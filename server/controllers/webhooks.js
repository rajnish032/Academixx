import { createHmac } from "crypto";
import Purchase from "../models/purchase.js";
import Course from "../models/course.js";
import User from "../models/user.js";

export const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = createHmac(
      "sha256",
      process.env.RAZORPAY_WEBHOOK_SECRET
    )
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ msg: "Invalid webhook signature" });
    }

    const payload = JSON.parse(req.body);
    const event = payload.event;

    if (event !== "payment.captured") {
      return res.status(200).json({ msg: "Event ignored" });
    }

    const payment = payload.payload.payment.entity;
    const { order_id } = payment;

    const purchase = await Purchase.findOne({ orderId: order_id });

    if (!purchase) {
      return res.status(200).json({ msg: "Purchase not found, ignored" });
    }
    if (purchase.status === "completed") {
      return res.status(200).json({ msg: "Already processed" });
    }

    purchase.status = "completed";
    await purchase.save();
    const user = await User.findById(purchase.userId);
    const course = await Course.findById(purchase.courseId);

    if (user && course) {
      if (!course.enrolledStudents.includes(user._id)) {
        course.enrolledStudents.push(user._id);
        await course.save();
      }

      if (!user.enrolledCourses.includes(course._id)) {
        user.enrolledCourses.push(course._id);
        await user.save();
      }
    }

    return res.status(200).json({ msg: "Payment processed successfully" });
  } catch (err) {
    console.error("Razorpay webhook error:", err);
    return res.status(500).json({ msg: "Webhook error" });
  }
};

