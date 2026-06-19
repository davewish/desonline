import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL; // must be a verified sender in SendGrid
const FROM_NAME = process.env.SENDGRID_FROM_NAME || "DesOnline";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

/**
 * Sends an account activation email containing a link with the activation token.
 * Throws on failure so the caller (registerUser) can catch it and decide how
 * to respond — it does NOT swallow errors itself.
 *
 * @param {string} toEmail - recipient's email address
 * @param {string} activationToken - JWT generated in registerUser
 */
export const sendActivationEmail = async (toEmail, activationToken) => {
  const activationLink = `${APP_URL}/activate?token=${activationToken}`;

  const msg = {
    to: toEmail,
    from: {
      email: FROM_EMAIL,
      name: FROM_NAME,
    },
    subject: "Activate your account",
    text: `Welcome! Please activate your account by visiting the following link (expires in 24 hours): ${activationLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Welcome to ${FROM_NAME}!</h2>
        <p>Thanks for signing up. Please confirm your email address to activate your account.</p>
        <p style="margin: 24px 0;">
          <a href="${activationLink}"
             style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px;
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            Activate Account
          </a>
        </p>
        <p style="color: #666; font-size: 13px;">
          This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.
        </p>
        <p style="color: #999; font-size: 12px;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          ${activationLink}
        </p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    // SendGrid errors put useful detail in error.response.body, which
    // doesn't show up if you just log `error` directly.
    if (error.response) {
      console.error(
        "SendGrid error body:",
        JSON.stringify(error.response.body),
      );
    }
    // Re-throw so registerUser's catch block can flip emailSent to false
    // instead of this failing silently.
    throw error;
  }
};
