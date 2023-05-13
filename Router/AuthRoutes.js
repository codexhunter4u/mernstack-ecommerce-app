import express from "express";
import {
  authRegister,
  authLogin,
  forgotPassword,
  updateProfile,
} from "../Controller/AuthController.js";
const router = express.Router();
import { requireSignIn, isAdmin } from "../Middleware/AuthMiddleware.js";
// Register[POST]
router.post("/register", authRegister);

// Register[GET]
router.post("/login", authLogin);

//Forgot Password[POST]
router.post("/forgot-password", forgotPassword);

//Protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//Protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfile);

export default router;
