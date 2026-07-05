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
    <div
      className="min-h-screen pb-16"
      style={{ background: "#F8F5EE", color: "#211F1B" }}
    >
      {(() => {
        const totalLectures = courseData.courseContent?.reduce(
          (sum, ch) => sum + ch.chapterContent.length,
          0
        ) || 0;
        const completedCount = progressData?.lectureCompleted?.length || 0;
        const overallPct = totalLectures
          ? Math.round((completedCount / totalLectures) * 100)
          : 0;

        const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
        const serifBody = { fontFamily: "'Source Serif 4', Georgia, serif" };
        const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" };

        return (
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
            {/* Masthead */}
            <div className="mb-8 pb-5 border-b" style={{ borderColor: "#A9823D40" }}>
              <p
                className="text-[10px] uppercase mb-2"
                style={{ ...metaSans, color: "#7A2E2E" }}
              >
                Course in Progress
              </p>
              <h1
                className="text-2xl md:text-3xl font-semibold leading-tight"
                style={{ ...serifDisplay, color: "#1D2B3A" }}
              >
                {courseData.courseTitle}
              </h1>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-[3fr_1.2fr] gap-10">
              <div className="flex flex-col gap-6">
                {playerData ? (
                  <div>
                    <div
                      className="w-full aspect-video overflow-hidden"
                      style={{ border: "1px solid #A9823D80", background: "#1D2B3A" }}
                    >
                      {isGoogleDriveLink(playerData.lectureUrl) ? (
                        <iframe
                          id="drive-player"
                          src={getGoogleDriveEmbed(playerData.lectureUrl)}
                          className="w-full h-full"
                          allow="autoplay; fullscreen"
                          allowFullScreen
                          frameBorder="0"
                        />
                      ) : (
                        <YouTube
                          videoId={getYouTubeId(playerData.lectureUrl)}
                          className="w-full h-full"
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

                    {/* Figure-style caption */}
                    <div className="flex justify-between items-start pt-3">
                      <div className="min-w-0 pr-4">
                        <p className="text-[10px] uppercase mb-1" style={{ ...metaSans, color: "#7A2E2E" }}>
                          Chapter {playerData.chapter} · Lecture {playerData.lecture}
                        </p>
                        <h2
                          className="text-lg leading-snug truncate"
                          style={{ ...serifBody, fontWeight: 600, color: "#1D2B3A" }}
                        >
                          {playerData.lectureTitle}
                        </h2>
                      </div>

                      <button
                        onClick={() => markLectureAsCompleted(playerData.lectureId)}
                        className="px-5 py-2 text-sm whitespace-nowrap transition-colors shrink-0"
                        style={
                          progressData?.lectureCompleted?.includes(playerData.lectureId)
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
                      >
                        {progressData?.lectureCompleted?.includes(playerData.lectureId)
                          ? "✓ Marked Complete"
                          : "Mark Complete"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full aspect-video overflow-hidden"
                    style={{ border: "1px solid #A9823D80" }}
                  >
                    <img
                      src={courseData.courseThumbnail}
                      alt="Course Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Evaluation block */}
                <div
                  className="hidden md:flex items-center justify-between gap-4 py-6 border-t"
                  style={{ borderColor: "#A9823D40" }}
                >
                  <div>
                    <h2 className="text-base font-semibold mb-0.5" style={serifDisplay}>
                      Course Evaluation
                    </h2>
                    <p className="text-[11px]" style={{ ...serifBody, color: "#6B6355" }}>
                      Your assessment helps refine this curriculum.
                    </p>
                  </div>
                  <Rating initialRating={initialRating} onRate={handleRate} />
                </div>
              </div>

              {/* Syllabus panel */}
              <div className="flex flex-col h-full">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={serifDisplay}>
                    Syllabus
                  </h2>
                  <span className="text-[10px] uppercase" style={{ ...metaSans, color: "#6B6355" }}>
                    {courseData.courseContent?.length} Chapters
                  </span>
                </div>

                {/* Overall progress — a ruled ledger line */}
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[10px] uppercase" style={{ ...metaSans, color: "#6B6355" }}>
                      Progress
                    </span>
                    <span className="text-[11px]" style={{ ...serifBody, fontWeight: 600, color: "#7A2E2E" }}>
                      {overallPct}%
                    </span>
                  </div>
                  <div className="h-[2px]" style={{ background: "#A9823D30" }}>
                    <div
                      className="h-full transition-all duration-500"
                      style={{ width: `${overallPct}%`, background: "#7A2E2E" }}
                    />
                  </div>
                </div>

                <div className="md:max-h-[65vh] md:overflow-y-auto pr-1 hide-scrollbar">
                  {courseData.courseContent?.map((chapter, index) => {
                    const chapterCompleted = chapter.chapterContent.filter((l) =>
                      progressData?.lectureCompleted?.includes(l.lectureId)
                    ).length;
                    const chapterTotal = chapter.chapterContent.length;

                    return (
                      <div key={index} className="border-b" style={{ borderColor: "#A9823D30" }}>
                        <div
                          className="flex items-center gap-3 py-4 cursor-pointer"
                          onClick={() => toggleSection(index)}
                        >
                          {/* Numeral badge — real ToC device */}
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[13px]"
                            style={{
                              ...serifDisplay,
                              border: "1px solid #1D2B3A",
                              color: "#1D2B3A",
                            }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className="text-[15px] leading-tight truncate"
                              style={{ ...serifBody, fontWeight: 600, color: "#1D2B3A" }}
                            >
                              {chapter.chapterTitle}
                            </p>
                            <p className="text-[10px] mt-0.5" style={{ ...metaSans, color: "#6B6355" }}>
                              {chapterCompleted}/{chapterTotal} · {calculateChapterTime(chapter)}
                            </p>
                          </div>

                          <img
                            className={`w-2.5 h-2.5 shrink-0 transition-transform duration-300 ${
                              openSections[index] ? "rotate-180" : ""
                            }`}
                            src={assets.down_arrow_icon}
                            alt="arrow"
                            style={{ filter: "invert(15%) sepia(20%) hue-rotate(180deg)" }}
                          />
                        </div>

                        <div
                          className={`transition-all duration-300 ease-in-out ${
                            openSections[index] ? "max-h-[1000px]" : "max-h-0"
                          } overflow-hidden`}
                        >
                          <ul className="pb-3 pl-11">
                            {chapter.chapterContent.map((lecture, i) => {
                              const isActive = playerData?.lectureId === lecture.lectureId;
                              const isDone = progressData?.lectureCompleted?.includes(lecture.lectureId);

                              return (
                                <li
                                  key={i}
                                  className="flex items-start gap-3 py-2.5 cursor-pointer"
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      lectureId: lecture.lectureId,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                >
                                  <span
                                    className="text-[11px] mt-0.5 w-4 shrink-0"
                                    style={{ ...serifBody, color: isDone ? "#7A2E2E" : "#A9823D" }}
                                  >
                                    {isDone ? "✓" : i + 1}
                                  </span>
                                  <div className="min-w-0">
                                    <p
                                      className="text-[13px] truncate"
                                      style={{
                                        ...serifBody,
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? "#7A2E2E" : "#211F1B",
                                      }}
                                    >
                                      {lecture.lectureTitle}
                                    </p>
                                    <p className="text-[10px] mt-0.5" style={{ ...metaSans, color: "#6B6355" }}>
                                      {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                        units: ["h", "m"],
                                      })}
                                    </p>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex md:hidden flex-col items-center gap-3 py-10 border-t mt-6" style={{ borderColor: "#A9823D40" }}>
                  <h2 className="text-base font-semibold" style={serifDisplay}>Course Evaluation</h2>
                  <p className="text-[11px]" style={{ ...serifBody, color: "#6B6355" }}>
                    Your assessment helps refine this curriculum.
                  </p>
                  <Rating initialRating={initialRating} onRate={handleRate} />
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>

    <Footer />
  </>
) : (
  <Loading />
);
};

export default Player;
