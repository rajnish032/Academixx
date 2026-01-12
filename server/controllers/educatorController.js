import Course from "../models/course.js";
import cloudinary from "../utils/cloudinary.js";
import Purchase from "../models/purchase.js";
import User from "../models/user.js";

/* ================= UPDATE ROLE TO EDUCATOR ================= */
export const updateRoleToEducator = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: login please",
      });
    }

    //role already educator → do nothing
    if (user.role === "educator") {
      return res.json({
        success: true,
        message: "Already an educator",
      });
    }

    // update role only once
    user.role = "educator";
    await user.save();

    return res.json({
      success: true,
      message: "You can publish a course now",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


/* ================= ADD NEW COURSE ================= */
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;

    const educatorId = req.educatorId;

    if (!imageFile) {
      return res.status(400).json({ message: "Thumbnail not attached" });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;

    await newCourse.save();

    res.status(200).json({
      success: true,
      message: "Course added successfully",
    });
  } catch (error) {
    console.error("addCourse error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

/* ================= GET EDUCATOR COURSES ================= */
export const getEducatorCourses = async (req, res) => {
  try {
    const educatorId = req.educatorId;

    const courses = await Course.find({ educator: educatorId });

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= EDUCATOR DASHBOARD ================= */
export const educatorDashboardData = async (req, res) => {
  try {
    const educatorId = req.educatorId;

    const courses = await Course.find({ educator: educatorId });
    const totalCourses = courses.length;

    const courseIds = courses.map((c) => c._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    const enrolledStudentsData = [];

    for (const course of courses) {
      if (!course.enrolledStudents?.length) continue;

      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        "firstName lastName emailId"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        totalCourses,
        enrolledStudentsData,
      },
    });
  } catch (error) {
    console.error("educatorDashboardData error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET ENROLLED STUDENTS DATA ================= */
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educatorId = req.educatorId;

    const courses = await Course.find({ educator: educatorId });
    const courseIds = courses.map((c) => c._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "firstName lastName emailId")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId?.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    console.error("getEnrolledStudentsData error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
