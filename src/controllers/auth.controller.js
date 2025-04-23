import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendForgetPassword } from "../utils/mail.js";
import User from "../middlewares/models/user.model.js";

export const signup = async (req, res) => {
    const { email, password, name, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        // Validate role if provided, otherwise default will be used
        if (role && !['user', 'buyer', 'admin'].includes(role)) {
            return res.status(400).json({ error: "Invalid role specified" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            ...(role && { role }) // Only include role if provided
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "96h" }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ error: "Email must be provided" });
        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "96h" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Forgot Password function
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required for password reset" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User with this email does not exist" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = Date.now() + 600000; // 10 minutes expiration

        await user.save();
        await sendForgetPassword(email, otp);
        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong, please try again later." });
    }
};

// Reset Password function
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: "Email, OTP, and new password are required" });
    }

    try {
        const user = await User.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
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