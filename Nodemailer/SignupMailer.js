import { Resend } from 'resend';


const resend = new Resend(process.env.RESEND_API_KEY);

const SignupMailer = async (email, randomName, randomPassword) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to VidTrim - Signup Successful!',
      html: `
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
    });

    if (error) {
      console.error('Resend error:', error);
    } else {
      console.log('Email sent:', data);
    }
  } catch (e) {
    console.error('Unexpected error:', e);
  }
};

export default SignupMailer;
