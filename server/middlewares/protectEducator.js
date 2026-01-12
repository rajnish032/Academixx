import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protectEducator = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "educator") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    req.user = user;
    req.educatorId = user._id;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
