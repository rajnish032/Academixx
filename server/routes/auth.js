import express from "express";
import { signup, login, logout } from "../controllers/auth.js";

const authRouter = express.Router();

// signup
authRouter.post("/signup", signup);

// login
authRouter.post("/login", login);

// logout
authRouter.post("/logout", logout);

export default authRouter;
