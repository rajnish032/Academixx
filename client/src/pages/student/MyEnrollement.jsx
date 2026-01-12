import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import Footer from "../../components/student/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const MyEnrollement = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    navigate,
    userData,
    fetchUserEnrolledCourses,
    backendUrl,
    calculateNoOfLectures,
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);

  const getCourseProgress = async () => {
    try {
      
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { withCredentials: true }
          );
          let totalLectures = calculateNoOfLectures(course);

          const lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;
          return { totalLectures, lectureCompleted };
        })
      );
      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // useEffect(() => {
  //   if (userData) {
  //     fetchUserEnrolledCourses();
  //   }
  // }, [userData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses]);
  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 pb-16 min-h-screen bg-black text-white">
        {/* Glow gradient */}
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[260px] 
                      bg-cyan-500/20 blur-3xl rounded-full -z-10"
        />

        <h1 className="text-2xl md:text-3xl font-semibold mb-6">
          My Enrollements
        </h1>

        <table className="md:table-auto table-fixed w-full overflow-hidden border border-white/10 rounded-xl mt-8 bg-white/5 backdrop-blur-lg shadow-[0_0_35px_rgba(0,0,0,0.7)]">
          <thead className="text-xs md:text-sm text-left text-gray-200 border-b border-white/10 bg-white/5">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th>
              <th className="px-4 py-3 font-semibold truncate max-sm:hidden">
                Duration
              </th>
              <th className="px-4 py-3 font-semibold truncate max-sm:hidden">
                Completed
              </th>
              <th className="px-4 py-3 font-semibold truncate text-right">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="text-gray-200 text-sm">
            {enrolledCourses.map((course, index) => (
              <tr
                key={index}
                className="border-b border-white/10 last:border-0"
              >
                <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                  <img
                    src={course.courseThumbnail}
                    alt=""
                    className="w-14 sm:w-24 md:w-28 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="mb-1 max-sm:text-xs line-clamp-2">
                      {course.courseTitle}
                    </p>
                    <Line
                      strokeWidth={2}
                      percent={
  progressArray[index] && progressArray[index].totalLectures > 0
    ? (progressArray[index].lectureCompleted * 100) /
      progressArray[index].totalLectures
    : 0
}
                      className="bg-white/10 rounded-full"
                    />
                  </div>
                </td>

                <td className="px-4 py-3 max-sm:hidden">
                  {calculateCourseDuration(course)}
                </td>

                <td className="px-4 py-3 max-sm:hidden">
                  {progressArray[index] && (
                    <>
                      {progressArray[index].lectureCompleted} /{" "}
                      {progressArray[index].totalLectures}{" "}
                    </>
                  )}
                  <span>Lectures</span>
                </td>

                <td className="px-4 py-3 max-sm:text-right text-right">
                  <button
                    className="px-3 sm:px-5 py-1.5 sm:py-2 bg-cyan-500 text-black rounded-full 
                             max-sm:text-xs font-medium hover:bg-cyan-400 transition 
                             shadow-md shadow-cyan-500/30"
                    onClick={() => navigate("/player/" + course._id)}
                  >
                    {progressArray[index] &&
                    progressArray[index].lectureCompleted /
                      progressArray[index].totalLectures ===
                      1
                      ? "Completed"
                      : "Ongoing"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyEnrollement;
