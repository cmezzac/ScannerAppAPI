require("dotenv").config();
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(to, message) {
  try {
    const res = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log("✅ SMS sent:", res.sid);
  } catch (error) {
    console.error("❌ Failed to send SMS:", error.message);
  }
}

module.exports = { sendSMS };
