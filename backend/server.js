const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");
const nodemailer = require("nodemailer");

// 🔹 Connect MongoDB
connectDB();

// 🔹 Contact Form Email Route
// (ඔබේ app.js එකේ routes handle කරනවා නම් මෙය එහි ඇතුළත් කළ හැකියි)
app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    // 1. Email එක යවන කෙනාගේ විස්තර (Transporter)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // .env එකේ ඇති ඔබේ email එක
            pass: process.env.EMAIL_PASS, // .env එකේ ඇති app password එක
        },
    });

    // 2. ලැබිය යුතු Email එකේ අන්තර්ගතය
    const mailOptions = {
        from: email,
        to: process.env.STAFF_EMAIL, // Staff එකේ email එක
        subject: `Lanka Salt Contact: ${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #2c6b6f;">New Inquiry Received</h2>
                <p><strong>Customer Name:</strong> ${name}</p>
                <p><strong>Customer Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Success! Email sent to Staff." });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ message: "Email sending failed. Server Error." });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});









