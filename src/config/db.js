import mongoose from "mongoose";
import { config } from "dotenv";
config();
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable in .env"
    );
}

async function connectDB() {
    return mongoose.connect(MONGODB_URI, {});
}

export default connectDB;
