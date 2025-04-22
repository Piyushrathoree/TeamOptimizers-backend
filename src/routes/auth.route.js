import { Router } from "express";

import {
    signup,
    login,
    forgotPassword,
    resetPassword,
    changePassword,
    updatePasswordByUserId,
} from "../controllers/auth.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";
// import verifyRole from "../middleware/roles.js";

const router = Router();

// Routes
router.post("/signup", signup);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/change-password", authenticateToken, changePassword);

router.put(
    "/update-password",
    authenticateToken,

    updatePasswordByUserId
);

// router.put(
//     "/update-user/:id",
//     authenticateToken,
//     updateUserById
// );

export default router;
