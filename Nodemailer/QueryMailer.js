import axios from "axios";
import ResponseToUser from "./ResponseToUser.js";

const QueryMailer = async (userName, userEmail, userMessage) => {
  try {
    console.log(
      "------------------------------Sending Mail----------------------"
    );
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",

      {
        sender: {
          name: "VidTrim",
          email: "chandrashekharsaini322@gmail.com",
        },
        to: [{ email: "chandrashekharsaini322@gmail.com" }],
        subject: "New User Inquiry Received via VidTrim Website",
        htmlContent: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #007bff;">User Inquiry Received via VidTrim Website</h2>
    <p>Dear VidTrim Support Team,</p>
    <p>You have received a new message from a user through the VidTrim website. The details are as follows:</p>
    
    <table style="width: 100%; max-width: 500px; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Full Name</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${userName}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Email Address</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${userEmail}</td>
      </tr>
    </table>

    <p><strong>Message:</strong></p>
    <div style="background-color: #f9f9f9; padding: 12px; border-left: 4px solid #007bff; margin-top: 10px;">
      ${userMessage}
    </div>

    <p>Please review the inquiry and respond to the user at your earliest convenience.</p>
    <p>Kind regards,<br/><strong>VidTrim Website Notification System</strong></p>
  </div>
`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("--------------email-sending-start----------");
    console.log("Email sent:", response.data);

 await   ResponseToUser(userEmail, userName);
    console.log("--------------email-sending-end----------");
  } catch (error) {
    console.error("Error sending email:");
    if (error.response) {
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error("No response. Request details:", error.request);
    } else {
      console.error("General error:", error.message);
    }
  }
};

export default QueryMailer;
