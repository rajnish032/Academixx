import Stripe from "stripe";
import Purchase from "../models/purchase.js";
import Course from "../models/course.js";
import User from "../models/user.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ================= STRIPE WEBHOOK ================= */
export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      /* ===== PAYMENT SUCCESS ===== */
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];
        const { purchaseId } = session.metadata;

        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) break;

        const user = await User.findById(purchase.userId);
        const course = await Course.findById(purchase.courseId);

        if (!user || !course) break;

        /* prevent duplicate enroll */
        if (!course.enrolledStudents.includes(user._id)) {
          course.enrolledStudents.push(user._id);
          await course.save();
        }

        if (!user.enrolledCourses.includes(course._id)) {
          user.enrolledCourses.push(course._id);
          await user.save();
        }

        purchase.status = "completed";
        await purchase.save();

        break;
      }

      /* ===== PAYMENT FAILED ===== */
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];
        const { purchaseId } = session.metadata;

        const purchase = await Purchase.findById(purchaseId);
        if (purchase) {
          purchase.status = "failed";
          await purchase.save();
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({
      received: false,
      message: error.message,
    });
  }
};
