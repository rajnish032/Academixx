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
        (item) => item.userId === userData._id,
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
        { withCredentials: true },
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

  const playNextLecture = () => {
  if (!playerData || !courseData) return;

  const { chapter, lecture } = playerData;

  const currentChapter = courseData.courseContent[chapter - 1];

  if (currentChapter.chapterContent[lecture]) {
    const nextLecture =
      currentChapter.chapterContent[lecture];

    setPlayerData({
      ...nextLecture,
      chapter,
      lecture: lecture + 1,
    });
  }
  else if (courseData.courseContent[chapter]) {
    const nextChapter = courseData.courseContent[chapter];
    const firstLecture = nextChapter.chapterContent[0];

    setPlayerData({
      ...firstLecture,
      chapter: chapter + 1,
      lecture: 1,
    });
  }
};


  const getYouTubeId = (url) => {
    if (!url) return null;

    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const isGoogleDriveLink = (url) => {
    return url?.includes("drive.google.com");
  };

  const getGoogleDriveEmbed = (url) => {
    if (!url) return null;
    return url.replace("/view", "/preview");
  };

  const getCourseProgress = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/get-course-progress",
        { courseId },
        { withCredentials: true },
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
        { withCredentials: true },
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
    <div className="relative pb-16 min-h-screen bg-black text-white">
      {/* 🔹 Glow Gradient */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[260px]
                    bg-cyan-500/10 blur-[120px] rounded-full -z-10"
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 flex flex-col md:grid md:grid-cols-[3fr_1.2fr] gap-8 relative z-10">
        
        <div className="flex flex-col gap-6">
          {playerData ? (
            <div className="w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
              <div className="relative w-full aspect-video bg-black">
                {isGoogleDriveLink(playerData.lectureUrl) ? (
                  <iframe
                    id="drive-player"
                    src={getGoogleDriveEmbed(playerData.lectureUrl)}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    frameBorder="0"
                  />
                ) : (
                  <YouTube
                    videoId={getYouTubeId(playerData.lectureUrl)}
                    className="absolute top-0 left-0 w-full h-full"
                    iframeClassName="w-full h-full"
                    opts={{
                      playerVars: {
                        autoplay: 1,
                        controls: 1,
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                        iv_load_policy: 3,
                        playsinline: 1,
                      },
                    }}
                    onEnd={() => {
                      markLectureAsCompleted(playerData.lectureId);
                      playNextLecture();
                    }}
                  />
                )}
              </div>
              <div className="flex justify-between items-center px-4 py-4 border-t border-white/10 bg-white/[0.02]">
                <div className="flex-1 mr-4">
                  <p className="text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
                    Chapter {playerData.chapter} • Lecture {playerData.lecture}
                  </p>
                  <h1 className="text-lg font-semibold text-gray-100 truncate">
                    {playerData.lectureTitle}
                  </h1>
                </div>

                <button
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    progressData?.lectureCompleted?.includes(playerData.lectureId)
                      ? "bg-green-500/20 text-green-400 border border-green-500/40"
                      : "bg-cyan-500 text-black hover:bg-cyan-400 active:scale-95"
                  }`}
                >
                  {progressData?.lectureCompleted?.includes(playerData.lectureId)
                    ? "✓ Completed"
                    : "Mark Done"}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-video rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <img
                src={courseData.courseThumbnail}
                alt="Course Thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="hidden md:flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h2 className="text-lg font-bold">How's the learning?</h2>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>
        <div className="flex flex-col h-full">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            Course Structure
            <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400 font-normal">
              {courseData.courseContent?.length} Chapters
            </span>
          </h2>

          <div className="md:max-h-[75vh] md:overflow-y-auto space-y-3 pr-1 hide-scrollbar">
            {courseData.courseContent?.map((chapter, index) => (
              <div
                key={index}
                className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden"
              >
                <div
                  className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      className={`w-3 h-3 transition-transform duration-300 ${
                        openSections[index] ? "rotate-180" : ""
                      }`}
                      src={assets.down_arrow_icon}
                      alt="arrow"
                    />
                    <p className="font-semibold text-sm md:text-base leading-tight">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap ml-2">
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openSections[index] ? "max-h-[1000px] border-t border-white/10" : "max-h-0"
                  } overflow-hidden`}
                >
                  <ul className="py-2">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li 
                        key={i} 
                        className={`group flex items-start gap-3 px-4 py-3 hover:bg-cyan-500/10 cursor-pointer transition-colors ${
                          playerData?.lectureId === lecture.lectureId ? "bg-cyan-500/10" : ""
                        }`}
                        onClick={() =>
                          setPlayerData({
                            ...lecture,
                            lectureId: lecture.lectureId,
                            chapter: index + 1,
                            lecture: i + 1,
                          })
                        }
                      >
                        <img
                          src={
                            progressData?.lectureCompleted?.includes(lecture.lectureId)
                              ? assets.blue_tick_icon
                              : assets.play_icon
                          }
                          className="w-4 h-4 mt-0.5 object-contain"
                          alt=""
                        />

                        <div className="flex flex-col w-full">
                          <p className={`text-sm ${playerData?.lectureId === lecture.lectureId ? "text-cyan-400 font-medium" : "text-gray-200"}`}>
                            {lecture.lectureTitle}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                             {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="flex md:hidden flex-col items-center gap-4 py-10 border-t border-white/10 mt-6">
            <h2 className="text-lg font-bold">Rate this course</h2>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
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
