import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import connectDB from "./config/db.js";
import { stripeWebhooks } from "./controllers/webhooks.js";

import authRouter from "./routes/auth.js";
import educatorRouter from "./routes/educatorRoutes.js";
import courseRouter from "./routes/course.js";
import userRouter from "./routes/user.js";

const app = express();

/* ================= DB ================= */
await connectDB();

/* ================= CORS ================= */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,           // frontend URL in production
    credentials: true,      // REQUIRED for cookies
  })
);

/* ================= STRIPE WEBHOOK ================= */
/* ⚠️ MUST be before express.json() */
app.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(cookieParser());

/* ================= ROUTES ================= */
app.get("/", (req, res) => res.send("API working 🚀"));

app.use("/api/auth", authRouter);
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

/* ================= SERVER ================= */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
