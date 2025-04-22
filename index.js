    import express from "express";
    import dotenv from "dotenv";
    import bodyParser from "body-parser";
    import cors from "cors";
    import connectDB from "./src/config/db.js";

    import authRoutes from "./src/routes/auth.route.js";

    dotenv.config();
    const app = express();

    // Middleware
    const allowedOrigins = ["http://localhost:5000"];

    const corsOptions = {
        origin: (origin, callback) => {
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"), false);
            }
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    };

    app.use(cors(corsOptions));
    app.use(bodyParser.json());

    // Connect to the database
    connectDB();
app.get("/", (req, res) => {
    res.status(200).send("server is running");
});

    app.use("/api/auth", authRoutes);

    // Root route

    const PORT = process.env.PORT;
    app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${process.env.PORT}`)
    );
