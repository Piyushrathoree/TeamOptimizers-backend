import axios from "axios";

// Function to send the welcome email using the Brevo API

export const sendForgetPassword = async (email, otp) => {
    const apiKey = process.env.MAIL_API; // Replace this with your actual API key

    const data = {
        sender: {
            name: "Agro Galaxy",
            email: "meonpath008@gmail.com",
        },
        to: [
            {
                email: email,
                name: "Dear", // Optional: recipient's name, if available
            },
        ],
        subject: "Reset Password!",
        htmlContent: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
  <h2 style="color: #228B22;">Password Reset Request</h2>
  <p>Dear Farmer,</p>
  <p>We received a request to reset your password for your <strong>Agro Galaxy</strong> account. Use the One-Time Password (OTP) below to proceed with resetting your password:</p>
  
  <h3 style="color: #008000;">Your OTP: <strong>${otp}</strong></h3>
  
  <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
  
  <p>To reset your password, click the following link and enter the OTP:  
    <a href="https://agrogalaxy.com/reset-password" target="_blank" style="color: #006400; text-decoration: none; font-weight: bold;">Reset Password</a>
  </p>
  
  <p>If you have any questions or need further assistance, feel free to reach out to our support team.</p>
  
  <p style="color: #228B22;">Best regards,<br>The Agro Galaxy Team</p>
</div>
    `,
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
