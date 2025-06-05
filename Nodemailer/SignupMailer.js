import nodemailer from "nodemailer";



const SignupMailer = async (email, randomName, randomPassword) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },

        tls: {
       
            rejectUnauthorized: false,
        },
    });


    const mailUser = {
        from: 'chandrashekharsaini322@gmail.com',
        to: email,
        subject: "Welcome to VidTrim - Signup Successful!",


        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #007bff;">Welcome to Our App!</h2>
        <p>Hi <strong>${randomName}</strong>,</p>
        <p>We're excited to have you join us. Here are your account details:</p>
        <table style="width: 100%; max-width: 400px; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Username:</td>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>${randomName}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Password:</td>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>${randomPassword}</strong></td>
          </tr>
        </table>
        <p>Please <a href="https://frontend-five-gamma-26.vercel.app/create-account/sign-in" style="color: #007bff; text-decoration: none;">log in</a> to your account and change your password as soon as possible.</p>
        <p>Thanks,</p>
        <p>The <strong>Your App Name</strong> Team</p>
      </div>
    

      `

    }

    const mailOption = transporter.sendMail(mailUser, (error, info) => {
      console.log("-----------------Error-------------------------");
        if (error) {
            console.log(error)
        }


        console.log("------------inof---------------------");

        console.log(inof);

        console.log("Successfully Send Mail");


    })
}

export default SignupMailer;