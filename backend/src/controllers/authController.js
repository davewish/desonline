import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/db.js";
import { generateToken } from "../utils/jwt.js";
import { sendActivationEmail } from "../services/emailService.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Normalize so "User@Example.com" and "user@example.com" are treated
    // as the same account
    email = email.trim().toLowerCase();
    name = name.trim();

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      });
    }

    // Check if user exists (fast path — see race-condition handling below
    // for the case where two requests pass this check simultaneously)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    let user;
    try {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "USER",
          isActive: false,
        },
      });
    } catch (createError) {
      // P2002 = unique constraint violation. Two concurrent requests can
      // both pass the findUnique check above before either insert lands;
      // this catches that race instead of falling through to a generic 500.
      if (
        createError instanceof Prisma.PrismaClientKnownRequestError &&
        createError.code === "P2002"
      ) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      throw createError;
    }

    // Generate activation token. Uses a dedicated secret (falling back to
    // JWT_SECRET if unset) and a "type" claim so this token can't be
    // replayed as a normal session/auth token if it leaks or is reused.
    // Make sure your auth middleware checks `type !== "activation"` and
    // rejects it, and that your /activate endpoint checks `type === "activation"`.
    const activationToken = jwt.sign(
      { userId: user.id, type: "activation" },
      process.env.JWT_ACTIVATION_SECRET || process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Send activation email. The user record already exists at this point,
    // so a failure here must NOT turn into a 500 "Registration failed" —
    // that would strand the user with an account they can't recreate
    // (duplicate email) and can't activate (no email sent). Instead, report
    // success with a flag the client can use to offer a "resend" action.
    let emailSent = true;
    try {
      await sendActivationEmail(user.email, activationToken);
    } catch (emailError) {
      console.error("Failed to send activation email:", emailError);
      emailSent = false;
    }

    return res.status(201).json({
      success: true,
      message: emailSent
        ? "Registration successful! Please check your email to activate your account."
        : "Registration successful, but we couldn't send the activation email. Please request a new one.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      emailSent,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

export const activateUser = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Activation token is required",
      });
    }

    // Verify signature + expiry. jwt.verify throws on either failure,
    // so both are handled in the catch block below.
    let payload;
    try {
      payload = jwt.verify(
        token,
        process.env.JWT_ACTIVATION_SECRET || process.env.JWT_SECRET,
      );
    } catch (verifyError) {
      const message =
        verifyError.name === "TokenExpiredError"
          ? "Activation link has expired. Please request a new one."
          : "Invalid activation link.";
      return res.status(400).json({ success: false, message });
    }

    // Reject tokens that aren't actually activation tokens — e.g. a normal
    // session/auth token signed with the same fallback secret.
    if (payload.type !== "activation") {
      return res.status(400).json({
        success: false,
        message: "Invalid activation link.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isActive) {
      return res.status(200).json({
        success: true,
        message: "Account is already activated. You can log in.",
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: true },
    });

    return res.status(200).json({
      success: true,
      message: "Account activated successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Activation failed:", error);
    return res.status(500).json({
      success: false,
      message: "Activation failed. Please try again later.",
    });
  }
};

/**
 * Login user
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Please activate your account before logging in.",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/**
 * Activate user account
 */
export const activateAccount = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: { isActive: true },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid activation link",
      });
    }

    // Redirect to frontend login with a success parameter
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendUrl}/login?activated=true`);
  } catch (error) {
    console.error("Activation error:", error);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendUrl}/login?error=activation_failed`);
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};
