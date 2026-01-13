import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);

  /* ================= AXIOS DEFAULT ================= */
  axios.defaults.withCredentials = true;

  /* ================= FETCH ALL COURSES ================= */
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/all`);
      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ================= FETCH USER DATA ================= */
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.user);
        setIsEducator(data.user.role === "educator");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // user not logged in → ignore silently
      setUserData(null);
      setIsEducator(false);
    } finally {
      setAuthLoading(false);
    }
  };

  /* ================= FETCH ENROLLED COURSES ================= */
  const fetchUserEnrolledCourses = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/enrolled-courses`
      );
      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  /* ================= HELPERS ================= */
  const calculateRating = (course) => {
    if (!course.courseRatings?.length) return 0;
    const total = course.courseRatings.reduce(
      (sum, r) => sum + r.rating,
      0
    );
    return Math.floor(total / course.courseRatings.length);
  };

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach(
      (lecture) => (time += lecture.lectureDuration)
    );
    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
    });
  };

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach((chapter) =>
      chapter.chapterContent.forEach(
        (lecture) => (time += lecture.lectureDuration)
      )
    );
    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
    });
  };

  const calculateNoOfLectures = (course) => {
    let total = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        total += chapter.chapterContent.length;
      }
    });
    return total;
  };

  /* ================= EFFECTS ================= */
  useEffect(() => {
    fetchAllCourses();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);

  /* ================= CONTEXT VALUE ================= */
  const value = {
    currency,
    backendUrl,
    navigate,

    allCourses,
    fetchAllCourses,

    userData,
    setUserData,

    isEducator,
    setIsEducator,

    enrolledCourses,
    fetchUserEnrolledCourses,

    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    authLoading,
    fetchUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
