import nodemailer from "nodemailer";

export const sendActivationEmail = async (email, token) => {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
  const activationLink = `${backendUrl}/api/auth/activate/${token}`;

  // For development, you can use a service like Ethereal or just log it
  console.log("-----------------------------------");
  console.log(`Sending activation email to: ${email}`);
  console.log(`Link: ${activationLink}`);
  console.log("-----------------------------------");

  // Production Implementation (example with Gmail/SMTP):
  /*
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"DesOnline Support" <no-reply@desonline.com>',
    to: email,
    subject: 'Activate your DesOnline account',
    html: `<p>Hello!</p><p>Please click the link below to activate your account:</p><a href="${activationLink}">${activationLink}</a>`,
  });
  */
};
