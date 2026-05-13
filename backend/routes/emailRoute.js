const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.post("/contact", async (req, res) => {
  const { name, userEmail, subject, message } = req.body;

  if (!name || !userEmail || !subject || !message) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  // Email eke design eka (HTML body)
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
      <h2 style="color: #333;">New Inquiry from Saltern Hambanthota</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Sender Email:</strong> <a href="mailto:${userEmail}">${userEmail}</a></p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    </div>
  `;

  try {
    await sendEmail({
      email: "senumihimanadi@gmail.com", // Labana kenage email eka (Admin)
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
    });

    res.status(200).json({ success: true, message: "Email sent to admin successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

module.exports = router;