import Course from "../models/course.js";
import { courseProgress } from "../models/courseProgress.js";
import Purchase from "../models/purchase.js";
import User from "../models/user.js";
//import Stripe from "stripe";
import Razorpay from "razorpay";

export const getUserData = async (req, res) => {
  try {
    const user = req.user; 

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// user enrolled courses with lecture links
export const userEnrolledCourses = async (req, res) => {
  try {
    const  userId  = req.user._id;
    const userData = await User.findById(userId).populate("enrolledCourses");

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//PURCHASE Course

// export const purchaseCourse = async (req, res) => {
//     try {
//         const { courseId } = req.body
//         const { origin } = req.headers
//         const userId = req.user._id;

//         const userData = await User.findById(userId)
//         const courseData = await Course.findById(courseId)

//         if (!userData || !courseData) {
//   return res.json({
//     success: false,
//     message: "data not found",
//   });
// }
//         const purchaseData = {
//             courseId: courseData._id,
//             userId,
//             amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100). toFixed(2),

//         }
//         const newPurchase = await Purchase.create(purchaseData)

//         //stripe gateway initialize

//         const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
//         const currency = process.env.CURRENCY.toLowerCase()
//         const line_items = [{
//             price_data:{
//                 currency,
//                 product_data: {
//                     name: courseData.courseTitle
//                 },
//                 unit_amount: Math.floor(newPurchase.amount) * 100
//             },
//             quantity: 1,

//         }]
//         const session = await stripeInstance.checkout.sessions.create({
//             success_url: `${origin}/loading/my-enrollments`,
//             cancel_url: `${origin}/`,
//             line_items: line_items,
//             mode: 'payment',
//             metadata: {
//                 purchaseId: newPurchase._id.toString()
//             }
//         })
//         res.json({success:true, session_url: session.url})
//     } catch (error) {
//          res.json({success:false, message: error.message})
//     }
// }


const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.json({ success: false, message: "Data not found" });
    }

    const amount =
      course.coursePrice -
      (course.discount * course.coursePrice) / 100;

    const purchase = await Purchase.create({
      courseId,
      userId,
      amount,
      status: "pending",
    });

    const order = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `course_${purchase._id}`,
      notes: {
        purchaseId: purchase._id.toString(),
        courseId: course._id.toString(),
        userId: user._id.toString(),
      },
    });

    purchase.orderId = order.id;
    await purchase.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      courseTitle: course.courseTitle,
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailId,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//update user course progress

export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, lectureId } = req.body;

    if (!userId || !courseId || !lectureId) {
      return res.json({
        success: false,
        message: "Missing userId, courseId or lectureId",
      });
    }

    let progressData = await courseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture Already Completed",
        });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await courseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: "Progress Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//get User course progresss
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;  // or req.query / req.params

    if (!userId || !courseId) {
      return res.json({
        success: false,
        message: "Missing userId or courseId",
      });
    }

    const progressData = await courseProgress.findOne({ userId, courseId });

    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//ADD USER RATING 
export const addUserRating = async (req, res) => {
  try {
    const userId = req.user._id;
    let { courseId, rating } = req.body;

    rating = Number(rating); // ensure number

    if (!courseId || !userId || Number.isNaN(rating) || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "Invalid Details" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({ success: false, message: "course not found" });
    }

    const user = await User.findById(userId);
    if (!user || !user.enrolledCourses?.includes(courseId)) {
      return res.json({
        success: false,
        message: "user has not purchased this course",
      });
    }

    if (!Array.isArray(course.courseRatings)) {
      course.courseRatings = [];
    }

    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRatingIndex > -1) {
      // update existing rating
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      // push new rating
      course.courseRatings.push({ userId, rating });
    }

    await course.save();

    return res.json({ success: true, message: "Rating Added" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
