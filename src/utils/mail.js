import axios from "axios";

// Function to send the password reset email using the Brevo API
export const sendForgetPassword = async (email, otp) => {
    const apiKey = process.env.MAIL_API; // Your Brevo API Key

    const data = {
        sender: {
            name: "Mandi Mart",
            email: "meonpath008@gmail.com",
        },
        to: [
            {
                email: email,
                name: "User",
            },
        ],
        subject: "Mandi Mart - Password Reset Request",
        htmlContent: `
<div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
  <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #2E7D32; text-align: center;">Mandi Mart Password Reset</h2>
    <p>Hi there,</p>
    <p>We received a request to reset the password for your <strong>Mandi Mart</strong> account.</p>
    <p>Please use the OTP below to proceed with the password reset:</p>
    
    <div style="background: #e8f5e9; padding: 15px; margin: 20px 0; border-left: 5px solid #4CAF50;">
      <p style="font-size: 20px; color: #1b5e20; margin: 0;">Your OTP is: <strong>${otp}</strong></p>
    </div>

    <p>This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>

    <p>If you did not request a password reset, please ignore this email or contact our support team immediately.</p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 14px; color: #777;">
      Mandi Mart - Empowering Farmers, Connecting Markets.<br />
      Need help? <a href="mailto:support@mandimart.in" style="color: #4CAF50;">Contact Support</a>
    </p>
  </div>
</div>
        `
    };

    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            data,
            {
                headers: {
                    accept: "application/json",
                    "api-key": apiKey,
                    "content-type": "application/json",
                },
            }
        );
        console.log("Email sent successfully", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Error sending email:",
            error.response ? error.response.data : error
        );
        throw error;
    }
};
