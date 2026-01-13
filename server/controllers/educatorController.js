import Course from "../models/course.js";
import cloudinary from "../utils/cloudinary.js";
import Purchase from "../models/purchase.js";
import User from "../models/user.js";

export const updateRoleToEducator = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // already approved educator
    if (user.role === "educator") {
      return res.json({
        success: true,
        message: "You are already an educator",
      });
    }

    // already applied
    if (user.role === "pending") {
      return res.json({
        success: true,
        message: "Application already submitted. Please wait for approval.",
      });
    }

    // submit educator request
    user.role = "pending";
    await user.save();

    return res.json({
      success: true,
      message: "Application submitted successfully. Please wait for admin approval.",
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


export const updateCourse = async (req, res) => {
  try {
    const { courseId, courseData } = req.body;
    const imageFile = req.file;

    const educatorId = req.educatorId;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 🔐 Security: only creator can update
    if (course.educator.toString() !== educatorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this course",
      });
    }

    const parsedCourseData = JSON.parse(courseData);

    // 🔄 Update fields
    course.courseTitle = parsedCourseData.courseTitle;
    course.courseDescription = parsedCourseData.courseDescription;
    course.coursePrice = parsedCourseData.coursePrice;
    course.discount = parsedCourseData.discount;
    course.courseContent = parsedCourseData.courseContent;

    // 🖼 Update thumbnail only if new image is provided
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path);
      course.courseThumbnail = imageUpload.secure_url;
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error("updateCourse error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


export const getEducatorCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const educatorId = req.educatorId;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 🔐 security
    if (course.educator.toString() !== educatorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
