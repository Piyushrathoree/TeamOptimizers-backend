import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendForgetPassword } from "../utils/mail.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
    const { email, phone, password, name} = req.body;

    try {
        const existingUser = await User.findOne({
            $or: [
                email ? { email } : null,
                phone ? { phone } : null,
            ].filter(Boolean)
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ error: "Email is already in use" });
            }
            if (existingUser.phone === phone) {
                return res.status(400).json({ error: "Phone number is already in use" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUserData = { password: hashedPassword, name, role };
        if (email) newUserData.email = email;
        if (phone) newUserData.phone = phone;

        const newUser = new User(newUserData);

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "96h" }
        );

        const userResponse = {
            id: newUser._id,
            name: newUser.name,
            role: newUser.role,
        };

        if (newUser.email) userResponse.email = newUser.email;
        if (newUser.phone) userResponse.phone = newUser.phone;

        res.status(201).json({
            token,
            user: userResponse,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, phone, password } = req.body;

    try {
        if (!email && !phone) {
            return res.status(400).json({ error: "Email or Phone must be provided" });
        }

        let query = {};
        if (email) {
            query.email = email;
        }
        if (phone) {
            query.phone = phone;
        }

        const user = await User.findOne(query);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "96h" }
        );

        const userResponse = {
            id: user._id,
            name: user.name,
            role: user.role,
        };

        if (user.email) userResponse.email = user.email;
        if (user.phone) userResponse.phone = user.phone;

        res.status(200).json({
            token,
            user: userResponse,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Forgot Password function
export const forgotPassword = async (req, res) => {
    const { email } = req.body; // Only use email for reset

    // Check if email is provided
    if (!email) {
        return res.status(400).json({ error: "Email is required for password reset" });
    }

    try {
        const user = await User.findOne({ email }); // Search by email only
        if (!user) {
            return res.status(400).json({ error: "User with this email does not exist" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration

        await user.save();
        await sendForgetPassword(email, otp); // Send OTP to email
        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong, please try again later." });
    }
};

// Reset Password function
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    // Validate required fields
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: "Email, OTP, and new password are required" });
    }

    try {
        const user = await User.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }, // OTP should be valid
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Remove reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: "Something went wrong, please try again later." });
    }
};

// Change Password function
export const changePassword = async (req, res) => {
    const { userId } = req.user;
    const { oldPass, newPass } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user || !(await bcrypt.compare(oldPass, user.password))) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        const hashedPassword = await bcrypt.hash(newPass, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Update Password by userId
export const updatePasswordByUserId = async (req, res) => {
    const { id, newPassword } = req.body;

    // Validate input
    if (!newPassword) {
        return res.status(400).json({ error: "New password is required" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Update Password Error:", error);
        res.status(500).json({ error: "Something went wrong, please try again later." });
    }
};