const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // ඔයාගේ Gmail එක (.env එකේ දාන්න)
      pass: process.env.EMAIL_PASS, // App Password එක (.env එකේ දාන්න)
    },
  });

  const mailOptions = {
    from: `"Salter Hambantota" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html, // අපිට ලස්සන Design එකක් යවන්න පුළුවන් HTML වලින්
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;