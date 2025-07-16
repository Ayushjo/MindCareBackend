import nodemailer from "nodemailer";
import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt"

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PASS, 
      },
    });

    const mailOptions = {
      from: "ayushsingh202586@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify Your Account" : "Reset Your Password",
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
            <h2 style="color: #333; text-align: center;">
              ${
                emailType === "VERIFY"
                  ? "Verify Your Email Address"
                  : "Reset Your Password"
              }
            </h2>
            <p style="font-size: 16px; color: #555;">
              ${
                emailType === "VERIFY"
                  ? "Thank you for signing up! Please confirm your email address by clicking the button below."
                  : "We received a request to reset your password. Click the button below to proceed."
              }
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "resetpassword"
      }/${encodeURIComponent(hashedToken)}"
                 style="padding: 12px 24px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">
                ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
              </a>
            </div>
            <p style="font-size: 14px; color: #777;">
              If the button above doesn't work, copy and paste the following URL into your browser:
            </p>
            <p style="font-size: 14px; color: #333; word-break: break-all;">
              ${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "resetpassword"
      }/${encodeURIComponent(hashedToken)}
            </p>
            <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #aaa; text-align: center;">
              If you did not request this email, you can safely ignore it.
            </p>
          </div>
        `,
    };
      

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", mailResponse);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
