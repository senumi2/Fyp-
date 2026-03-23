const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Order = require("../models/Order");

// --- 1. Hash එක ජනනය කිරීම (Frontend එකට) ---
router.post("/generate-hash", (req, res) => {
    const { order_id, amount, currency } = req.body;

    const merchant_id = "YOUR_MERCHANT_ID"; // Sandbox ID එක දාන්න
    const merchant_secret = "YOUR_MERCHANT_SECRET"; // Sandbox Secret එක දාන්න

    const amountFormatted = parseFloat(amount).toLocaleString('en-us', { minimumFractionDigits: 2 }).replaceAll(',', '');
    const merchant_secret_hash = crypto.createHash("md5").update(merchant_secret).digest("hex").toUpperCase();

    const hash = crypto
        .createHash("md5")
        .update(merchant_id + order_id + amountFormatted + currency + merchant_secret_hash)
        .digest("hex")
        .toUpperCase();

    res.json({ hash });
});

// --- 2. Notify URL (PayHere Webhook) ---
router.post("/notify", async (req, res) => {
    const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;
    const merchant_secret = "YOUR_MERCHANT_SECRET";
    const merchant_secret_hash = crypto.createHash("md5").update(merchant_secret).digest("hex").toUpperCase();

    const local_md5sig = crypto
        .createHash("md5")
        .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + merchant_secret_hash)
        .digest("hex")
        .toUpperCase();

    if (local_md5sig === md5sig && status_code === "2") {
        try {
            await Order.findByIdAndUpdate(order_id, { status: "Paid" });
            console.log(`✅ Order ${order_id} updated to Paid via PayHere.`);
        } catch (err) {
            console.error("Order update error:", err);
        }
    }
    res.status(200).send();
});

module.exports = router; // 👈 මේක අනිවාර්යයි!