import axios from "axios";

const ResponseToUser = async ( userEmail, userName) => {
  try {
    console.log(
      "------------------------------Sending Mail----------------------"
    );

    console.log("user",userEmail , userName);
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",

      {
        sender: {
          name: "VidTrim",
          email: "chandrashekharsaini322@gmail.com",
        },
        to: [{ email: userEmail }],
        subject: "We Have Received Your Message – VidTrim Support",
        htmlContent: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px; color: #333;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
      <h2 style="color: #1e88e5; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Thank You for Contacting VidTrim</h2>
      
      <p style="font-size: 16px;">Dear <strong>${userName}</strong>,</p>
      
      <p style="font-size: 15px;">
        Thank you for reaching out to us. We have received your message and our support team is currently reviewing your query.
      </p>

      <p style="font-size: 15px;">
        Kindly allow us some time to provide a detailed response. We appreciate your patience and will do our best to assist you as quickly as possible.
      </p>

      <p style="font-size: 15px;">
        If your message involves a technical issue, please ensure you have included any relevant screenshots or additional details to help us investigate more efficiently.
      </p>

      <p style="font-size: 15px;">
        Should you have any further questions or updates, feel free to reply to this email.
      </p>

      <p style="font-size: 15px;">
        Best regards,<br/>
        <strong>VidTrim Support Team</strong><br/>
        <a href="https://frontend-five-gamma-26.vercel.app" style="color: #1e88e5; text-decoration: none;">www.vidtrim.app</a>
      </p>
    </div>
  </div>
`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    console.log("--------------email-sending-start----------");
    console.log("Email sent:", response.data);
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

export default ResponseToUser;
