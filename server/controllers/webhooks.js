// import Stripe from "stripe";
// import Purchase from "../models/purchase.js";
// import Course from "../models/course.js";
// import User from "../models/user.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// /* ================= STRIPE WEBHOOK ================= */
// export const stripeWebhooks = async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   try {
//     switch (event.type) {
//       /* ===== PAYMENT SUCCESS ===== */
//       case "payment_intent.succeeded": {
//         const paymentIntent = event.data.object;

//         const sessionList = await stripe.checkout.sessions.list({
//           payment_intent: paymentIntent.id,
//         });

//         const session = sessionList.data[0];
//         const { purchaseId } = session.metadata;

//         const purchase = await Purchase.findById(purchaseId);
//         if (!purchase) break;

//         const user = await User.findById(purchase.userId);
//         const course = await Course.findById(purchase.courseId);

//         if (!user || !course) break;

//         /* prevent duplicate enroll */
//         if (!course.enrolledStudents.includes(user._id)) {
//           course.enrolledStudents.push(user._id);
//           await course.save();
//         }

//         if (!user.enrolledCourses.includes(course._id)) {
//           user.enrolledCourses.push(course._id);
//           await user.save();
//         }

//         purchase.status = "completed";
//         await purchase.save();

//         break;
//       }

//       /* ===== PAYMENT FAILED ===== */
//       case "payment_intent.payment_failed": {
//         const paymentIntent = event.data.object;

//         const sessionList = await stripe.checkout.sessions.list({
//           payment_intent: paymentIntent.id,
//         });

//         const session = sessionList.data[0];
//         const { purchaseId } = session.metadata;

//         const purchase = await Purchase.findById(purchaseId);
//         if (purchase) {
//           purchase.status = "failed";
//           await purchase.save();
//         }
//         break;
//       }

//       default:
//         console.log(`Unhandled Stripe event: ${event.type}`);
//     }

//     res.json({ received: true });
//   } catch (error) {
//     res.status(500).json({
//       received: false,
//       message: error.message,
//     });
//   }
// };


// import crypto from "crypto";
// import Purchase from "../models/purchase.js";
// import Course from "../models/course.js";
// import User from "../models/user.js";

// export const razorpayWebhook = async (req, res) => {
//   try {
//     const signature = req.headers["x-razorpay-signature"];

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
//       .update(JSON.stringify(req.body))
//       .digest("hex");

//     if (signature !== expectedSignature) {
//       return res.status(400).json({ msg: "Invalid webhook signature" });
//     }

//     const payment = req.body.payload.payment.entity;
//     const { order_id, status } = payment;

//     const purchase = await Purchase.findOne({ orderId: order_id });
//     if (!purchase) return res.json({ msg: "Purchase not found" });

//     if (status === "captured") {
//       purchase.status = "completed";
//       await purchase.save();

//       const user = await User.findById(purchase.userId);
//       const course = await Course.findById(purchase.courseId);

//       if (user && course) {
//         if (!course.enrolledStudents.includes(user._id)) {
//           course.enrolledStudents.push(user._id);
//           await course.save();
//         }

//         if (!user.enrolledCourses.includes(course._id)) {
//           user.enrolledCourses.push(course._id);
//           await user.save();
//         }
//       }
//     } else {
//       purchase.status = "failed";
//       await purchase.save();
//     }

//     res.status(200).json({ msg: "Webhook handled" });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };


export const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body) // ✅ IMPORTANT FIX
      .digest("hex");

    if (signature !== expectedSignature) {
      console.log("❌ Invalid webhook signature");
      return res.status(400).json({ msg: "Invalid webhook signature" });
    }

    console.log("✅ Webhook verified");

    const payment = JSON.parse(req.body).payload.payment.entity;
    const { order_id, status } = payment;

    const purchase = await Purchase.findOne({ orderId: order_id });
    if (!purchase) {
      console.log("❌ Purchase not found for order:", order_id);
      return res.json({ msg: "Purchase not found" });
    }

    if (status === "captured") {
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

      console.log("🎉 User enrolled successfully");
    } else {
      purchase.status = "failed";
      await purchase.save();
    }

    res.status(200).json({ msg: "Webhook handled" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ msg: err.message });
  }
};
