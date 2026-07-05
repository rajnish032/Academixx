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
    <div
      className="min-h-screen md:px-36 px-8 pt-20 pb-16"
      style={{ background: "#F8F5EE", color: "#211F1B" }}
    >
      {(() => {
        const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
        const serifBody = { fontFamily: "'Source Serif 4', Georgia, serif" };
        const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" };

        return (
          <>
            <div className="mb-8 pb-5 border-b" style={{ borderColor: "#A9823D40" }}>
              <p className="text-[10px] uppercase mb-2" style={{ ...metaSans, color: "#7A2E2E" }}>
                Academic Record
              </p>
              <h1
                className="text-2xl md:text-3xl font-semibold"
                style={{ ...serifDisplay, color: "#1D2B3A" }}
              >
                My Enrollments
              </h1>
            </div>

            <table className="md:table-auto table-fixed w-full mt-8 border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid #1D2B3A" }}>
                  <th
                    className="px-4 py-3 text-left text-[10px] uppercase font-medium truncate"
                    style={{ ...metaSans, color: "#6B6355" }}
                  >
                    Course
                  </th>
                  <th
                    className="px-4 py-3 text-left text-[10px] uppercase font-medium truncate max-sm:hidden"
                    style={{ ...metaSans, color: "#6B6355" }}
                  >
                    Duration
                  </th>
                  <th
                    className="px-4 py-3 text-left text-[10px] uppercase font-medium truncate max-sm:hidden"
                    style={{ ...metaSans, color: "#6B6355" }}
                  >
                    Completed
                  </th>
                  <th
                    className="px-4 py-3 text-right text-[10px] uppercase font-medium truncate"
                    style={{ ...metaSans, color: "#6B6355" }}
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {enrolledCourses.map((course, index) => {
                  const pct =
                    progressArray[index] && progressArray[index].totalLectures > 0
                      ? (progressArray[index].lectureCompleted * 100) /
                        progressArray[index].totalLectures
                      : 0;
                  const isComplete = pct === 100;

                  return (
                    <tr
                      key={index}
                      style={{ borderBottom: "1px solid #A9823D30" }}
                    >
                      <td className="md:px-4 pl-2 md:pl-4 py-4 flex items-center space-x-4">
                        <img
                          src={course.courseThumbnail}
                          alt=""
                          className="w-14 sm:w-24 md:w-28 object-cover"
                          style={{ border: "1px solid #A9823D80" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className="mb-1.5 max-sm:text-xs line-clamp-2"
                            style={{ ...serifBody, fontWeight: 600, color: "#1D2B3A" }}
                          >
                            {course.courseTitle}
                          </p>
                          <div className="h-[2px] w-full max-w-[220px]" style={{ background: "#A9823D30" }}>
                            <div
                              className="h-full transition-all duration-500"
                              style={{ width: `${pct}%`, background: "#7A2E2E" }}
                            />
                          </div>
                        </div>
                      </td>

                      <td
                        className="px-4 py-4 max-sm:hidden text-sm"
                        style={{ ...serifBody, color: "#211F1B" }}
                      >
                        {calculateCourseDuration(course)}
                      </td>

                      <td
                        className="px-4 py-4 max-sm:hidden text-sm"
                        style={{ ...serifBody, color: "#211F1B" }}
                      >
                        {progressArray[index] && (
                          <>
                            {progressArray[index].lectureCompleted} /{" "}
                            {progressArray[index].totalLectures}{" "}
                          </>
                        )}
                        <span style={{ ...metaSans, fontSize: "10px", color: "#6B6355" }}>
                          Lectures
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          className="px-3 sm:px-5 py-1.5 sm:py-2 max-sm:text-xs transition-colors"
                          style={
                            isComplete
                              ? {
                                  ...metaSans,
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  color: "#7A2E2E",
                                  border: "1px solid #7A2E2E",
                                  background: "transparent",
                                }
                              : {
                                  ...metaSans,
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  color: "#F8F5EE",
                                  background: "#7A2E2E",
                                  border: "1px solid #7A2E2E",
                                }
                          }
                          onClick={() => navigate("/player/" + course._id)}
                        >
                          {isComplete ? "Completed" : "Ongoing"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        );
      })()}
    </div>
  </>
);
};

export default MyEnrollement;
