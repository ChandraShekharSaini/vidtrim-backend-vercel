import axios from 'axios';

const SignupMailer = async (email, randomName, randomPassword) => {
  console.log("------------------------------Sending Mail----------------------");

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: 'VidTrim',
          email: 'chandrashekharsaini322@gmail.com', 
        },
        to: [{ email: email, name: randomName }],
        subject: 'Welcome to VidTrim - Signup Successful!',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #007bff;">Welcome to Our App!</h2>
            <p>Hi <strong>${randomName}</strong>,</p>
            <p>We're excited to have you join us. Here are your account details:</p>
            <table style="width: 100%; max-width: 400px; border-collapse: collapse; margin: 20px 0;">
              <tr><td style="padding: 8px; border: 1px solid #ddd;">Username:</td><td style="padding: 8px; border: 1px solid #ddd;"><strong>${randomName}</strong></td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;">Password:</td><td style="padding: 8px; border: 1px solid #ddd;"><strong>${randomPassword}</strong></td></tr>
            </table>
            <p>Please <a href="https://frontend-five-gamma-26.vercel.app/create-account/sign-in" style="color: #007bff;">log in</a> and change your password as soon as possible.</p>
            <p>Thanks,<br/><strong>VidTrim</strong> Team</p>
          </div>
        `
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY , 
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Email sent:', response.data);
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
  }
};

export default SignupMailer;
