import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'buyer', 'admin'],
            default: 'user',
            required: true
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
