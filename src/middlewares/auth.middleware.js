import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        // Extract the userId from the decoded token
        const { userId, role } = decoded;
        if (!userId) {
            return res.status(403).json({
                message: "Token is valid but does not contain user information",
            });
        }

        // Attach the userId to the request object
        req.user = { userId, role };
        next();
    });
};

export default authenticateToken;
