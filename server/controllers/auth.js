import bcrypt from "bcrypt";
import User from "../models/user.js";
import { validateSignUpData } from "../utils/validation.js";

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      role: "student",
    });

    const token = user.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      //sameSite: "lax",
      sameSite: "none", //none in prod
      secure: true, // true in production (https)
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ success: true, message: "Logout successful" });
};
