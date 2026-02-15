import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import Youtube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";

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

const CourseDetail = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  const {
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
    backendUrl,
    userData,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const enrollCourse = async () => {
  //   try {
  //     if (!userData) {
  //       return toast.warn("Login to enroll in the course");
  //     }
  //     if (isAlreadyEnrolled) {
  //       return toast.warn("Already enrolled");
  //     }

  //     const { data } = await axios.post(
  //       backendUrl + "/api/user/purchase",
  //       { courseId: courseData._id },
  //       { withCredentials: true}
  //     );

  //     if (data.success) {
  //       const { session_url } = data;
  //       window.location.replace(session_url);
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn("Login to enroll in the course");
      }

      if (isAlreadyEnrolled) {
        return toast.warn("Already enrolled");
      }

      if (isPaying) return;
      setIsPaying(true);

      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        { courseId: courseData._id },
        { withCredentials: true },
      );

      if (!data.success) {
        setIsPaying(false);
        return toast.error(data.message);
      }

      const { keyId, orderId, amount, currency, courseTitle, user } = data;

      if (!window.Razorpay) {
        setIsPaying(false);
        toast.error("Razorpay SDK not loaded. Please refresh.");
        return;
      }

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Your Platform Name",
        description: courseTitle,
        order_id: orderId,

        handler: function () {
          toast.success("Payment successful 🎉");
          window.location.href = "/loading/my-enrollments";
        },

        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
            setIsPaying(false); // ✅ reset ONLY on cancel
          },
        },

        prefill: {
          name: user.name,
          email: user.email,
        },

        theme: {
          color: "#06b6d4",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setIsPaying(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

 return courseData ? (
  <>
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      {/* 🔹 Animated grid background */}
      <div
        className="
        pointer-events-none absolute inset-0 
        bg-[radial-gradient(circle_at_1px_1px,#1e293b_1px,transparent_0)]
        [background-size:32px_32px]
        opacity-40
        animate-pulse
      "
      />

      {/* 🔹 Glowing gradient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-72 w-72 rounded-full bg-indigo-900 opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-72 w-72 rounded-full bg-cyan-500 opacity-30 blur-3xl" />

      {/* 🔹 Main Content Container */}
      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 items-start justify-between md:pt-28 pt-8 px-4 md:px-8 min-h-screen">
        
        {/* INNER GLOW behind content */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[650px] h-[380px] bg-cyan-500/10 blur-[120px] rounded-full -z-10" />

        {/* --- LEFT COLUMN: COURSE INFO & STRUCTURE --- */}
        {/* On mobile: order-2 (moves below the player) */}
        <div className="w-full md:w-[60%] lg:w-[65%] z-10 text-gray-300 order-2 md:order-1">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-4 border-b-4 border-cyan-500 inline-block pb-2">
            {courseData.courseTitle}
          </h1>

          <p
            className="pt-4 text-base md:text-lg text-gray-400 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 230) + '...',
            }}
          ></p>

          {/* REVIEW & RATING */}
          <div className="flex items-center flex-wrap gap-4 pt-6 pb-2 text-sm md:text-base">
            <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <span className="font-bold text-yellow-400">{calculateRating(courseData)}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank}
                    alt="star"
                    className="w-3.5 h-3.5"
                  />
                ))}
              </div>
            </div>

            <p className="text-gray-400">
              ({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? "ratings" : "rating"})
            </p>

            <span className="hidden md:inline text-gray-600">|</span>

            <p className="text-gray-300">
              <span className="text-white font-semibold">{courseData.enrolledStudents.length}</span> students enrolled
            </p>
          </div>

          <p className="text-sm text-gray-400 mt-2">
            Created by <span className="text-cyan-400 font-medium">{courseData.educator.name}</span>
          </p>

          {/* COURSE STRUCTURE SECTION */}
          <div className="pt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>
            <div className="space-y-3">
              {courseData.courseContent?.map((chapter, index) => (
                <div key={index} className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl overflow-hidden">
                  <div
                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className={`w-3 h-3 transition-transform duration-300 ${openSections[index] ? "rotate-180" : ""}`}
                        src={assets.down_arrow_icon}
                        alt="arrow"
                      />
                      <p className="font-semibold text-gray-100">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-xs md:text-sm text-gray-400">
                      {chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div className={`transition-all duration-300 overflow-hidden ${openSections[index] ? "max-h-[1000px] border-t border-white/10" : "max-h-0"}`}>
                    <ul className="py-2 bg-black/20">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-center justify-between px-6 py-3 hover:bg-white/5 group transition-colors">
                          <div className="flex items-center gap-3">
                            <img src={assets.play_icon} alt="play" className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                            <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{lecture.lectureTitle}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {lecture.isPreviewFree && (
                              <button
                                onClick={() => setPlayerData({ lectureUrl: lecture.lectureUrl })}
                                className="text-xs font-bold text-cyan-400 uppercase tracking-widest hover:text-cyan-300"
                              >
                                Preview
                              </button>
                            )}
                            <p className="text-xs text-gray-500">
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
          </div>

          {/* FULL DESCRIPTION */}
          <div className="py-16">
            <h3 className="text-2xl font-bold text-white mb-4">Description</h3>
            <div
              className="prose prose-invert max-w-none text-gray-400 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
            />
          </div>
        </div>

        {/* --- RIGHT COLUMN: PLAYER & PURCHASE CARD --- */}
        {/* On mobile: order-1 (moves to top) */}
        <div className="w-full md:w-[38%] lg:w-[32%] z-20 order-1 md:order-2 md:sticky md:top-28">
          <div className="rounded-2xl overflow-hidden bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl">
            
            {/* Aspect Ratio Video Box */}
            <div className="relative w-full aspect-video bg-black shadow-inner">
              {playerData ? (
                isGoogleDriveLink(playerData.lectureUrl) ? (
                  <iframe
                    src={getGoogleDriveEmbed(playerData.lectureUrl)}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <Youtube
                    videoId={getYouTubeId(playerData.lectureUrl)}
                    opts={{ playerVars: { autoplay: 1, fs: 1, modestbranding: 1 } }}
                    iframeClassName="absolute inset-0 w-full h-full"
                  />
                )
              ) : (
                <div className="relative w-full h-full group cursor-pointer">
                  <img src={courseData.courseThumbnail} alt="thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform">
                      <img src={assets.play_icon} className="w-6 h-6 translate-x-0.5" alt="play" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              {/* Pricing Section */}
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-bold text-white">
                  {currency}{(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">{currency}{courseData.coursePrice}</span>
                <span className="text-cyan-400 font-medium">{courseData.discount}% Off</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-red-400 mb-6 animate-pulse">
                <img className="w-4 h-4" src={assets.time_left_clock_icon} alt="timer" />
                <span className="font-semibold text-xs uppercase tracking-wider">Flash Sale: 5 days left!</span>
              </div>

              {/* Action Button */}
              <button
                disabled={isPaying}
                onClick={enrollCourse}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg
                  ${isPaying ? "bg-gray-700 cursor-not-allowed text-gray-400" : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20"}
                `}
              >
                {isAlreadyEnrolled ? "Already Enrolled" : isPaying ? "Processing..." : "Enroll Now"}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">30-Day Money-Back Guarantee</p>

              {/* Meta Info Grid */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <img src={assets.time_clock_icon} alt="duration" className="w-4 h-4 opacity-70" />
                  <span>{calculateCourseDuration(courseData)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={assets.lesson_icon} alt="lessons" className="w-4 h-4 opacity-70" />
                  <span>{calculateNoOfLectures(courseData)} Lessons</span>
                </div>
              </div>

              {/* Perks List */}
              <div className="mt-8">
                <p className="font-semibold text-white mb-3">This course includes:</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-500 text-lg">✓</span> Lifetime access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-500 text-lg">✓</span> Practical Projects
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-500 text-lg">✓</span> Certificate of Completion
                  </li>
                </ul>
              </div>
            </div>
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

export default CourseDetail;
