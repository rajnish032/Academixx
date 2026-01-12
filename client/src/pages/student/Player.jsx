import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const getCourseData = () => {
    const course = enrolledCourses.find((c) => c._id === courseId);
    if (!course) return;

    setCourseData(course);

    // Set initial rating of current user if exists
    if (userData && Array.isArray(course.courseRatings)) {
      const myRating = course.courseRatings.find(
        (item) => item.userId === userData._id // or userData.id / userData.clerkId based on your schema
      );
      if (myRating) {
        setInitialRating(myRating.rating);
      }
    }
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses, courseId, userData]);

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/update-course-progress",
        { courseId, lectureId },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

//   const getYouTubeId = (url) => {
//   try {
//     const parsedUrl = new URL(url);
//     return parsedUrl.searchParams.get("v");
//   } catch {
//     return null;
//   }
// };

const getYouTubeId = (url) => {
  if (!url) return null;

  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

  const match = url.match(regex);
  return match ? match[1] : null;
};


  const getCourseProgress = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/get-course-progress",
        { courseId },
        { withCredentials: true  }
      );

      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleRate = async (rating) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/add-rating",
        { courseId, rating },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getCourseProgress();
  }, []);

  return courseData ? (
  <>
    <div className="relative p-4 sm:p-10 md:px-36 pt-24 pb-16 min-h-screen bg-black text-white">

      {/* 🔹 Glow Gradient */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[260px]
                      bg-cyan-500/20 blur-3xl rounded-full -z-10" />

      <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-10 relative z-10">
        {/* LEFT */}
        <div className="text-gray-100">
          <h2 className="text-xl font-semibold">Course Structure</h2>

          <div className="pt-5">
            {courseData.courseContent?.map((chapter, index) => (
              <div
                key={index}
                className="border border-white/10 bg-white/5 backdrop-blur-md mb-2 rounded-lg overflow-hidden"
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      className={`transform transition-transform ${
                        openSections[index] ? "rotate-180" : ""
                      }`}
                      src={assets.down_arrow_icon}
                      alt="arrow_icon"
                    />
                    <p className="font-medium md:text-base text-sm text-white">
                      {chapter.chapterTitle}
                    </p>
                  </div>

                  <p className="text-sm text-gray-300">
                    {chapter.chapterContent.length} lectures -{" "}
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections[index] ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="md:pl-10 pl-4 pr-4 py-2 text-gray-200 border-t border-white/10">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex items-start gap-2 py-1">
                        <img
                          src={
                            progressData &&
                            progressData?.lectureCompleted?.includes(
                              lecture.lectureId
                            )
                              ? assets.blue_tick_icon
                              : assets.play_icon
                          }
                          className="w-4 h-2.5 mt-1"
                          alt=""
                        />

                        <div className="flex items-center justify-between w-full text-gray-100">
                          <p className="max-w-[70%] md:max-w-[75%]">
                            {lecture.lectureTitle}
                          </p>

                          <div className="flex gap-3 items-center text-sm">
                            {lecture.lectureUrl && (
                              <p
                                onClick={() =>
                                  setPlayerData({
                                    ...lecture,
                                    lectureId: lecture.lectureId,
                                    chapter: index + 1,
                                    lecture: i + 1,
                                  })
                                }
                                className="text-cyan-400 cursor-pointer hover:text-cyan-300"
                              >
                                Watch
                              </p>
                            )}

                            <p className="text-gray-300">
                              {humanizeDuration(
                                lecture.lectureDuration * 60 * 1000,
                                { units: ["h", "m"] }
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this course</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="mt-10">
          {playerData ? (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              <YouTube
  videoId={getYouTubeId(playerData.lectureUrl)}
  iframeClassName="w-full aspect-video"
/>


              <div className="flex justify-between items-center mt-2 px-3 py-2 text-sm md:text-base">
                <p className="text-gray-100">
                  {playerData.chapter}. {playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </p>

                <button
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {progressData &&
                  progressData?.lectureCompleted?.includes(
                    playerData.lectureId
                  )
                    ? "Completed"
                    : "Mark as Completed"}
                </button>
              </div>
            </div>
          ) : (
            <img
              src={courseData.courseThumbnail}
              alt=""
              className="w-full rounded-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
            />
          )}
        </div>
      </div>
    </div>

    <Footer />
  </>
) : (
  <Loading />
);
};

export default Player;


