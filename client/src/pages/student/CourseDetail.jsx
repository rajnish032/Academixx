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
  try {
    // Handles both https://www.youtube.com/watch?v=ID and https://youtu.be/ID
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.replace("/", "");
    }
    return parsedUrl.searchParams.get("v");
  } catch {
    return null;
  }
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
        { withCredentials: true }
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
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
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

        {/* 🔹 Course content area */}
        <div className="relative max-w-6xl mx-auto flex md:flex-row flex-col-reverse gap-12 items-start justify-between md:pt-28 pt-20 px-4 md:px-8 lg:px-0 min-h-screen">
          {/* Inner glow behind title area */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[380px] 
                     bg-cyan-500/25 blur-3xl rounded-full -z-10"
          />

          {/* LEFT COLUMN */}
          <div className="w-full md:w-1/2 z-10 text-gray-300">
            <h1
              className="
              text-2xl 
              md:text-4xl 
              font-semibold 
              text-white
              tracking-tight 
              leading-snug 
              mb-4 
              border-b-4 
              border-cyan-500 
              inline-block 
              pb-1 
              hover:text-cyan-300 
              transition-all 
              duration-300
            "
            >
              {courseData.courseTitle}
            </h1>

            <p
              className="pt-4 md:text-base text-sm text-gray-300"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription.slice(0, 230),
              }}
            ></p>

            {/* REVIEW & RATING */}
            <div className="flex items-center flex-wrap gap-2 pt-3 pb-1 text-sm">
              <p className="ml-1 font-medium text-yellow-300">
                {calculateRating(courseData)}
              </p>

              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={
                      i < Math.floor(calculateRating(courseData))
                        ? assets.star
                        : assets.star_blank
                    }
                    alt="star"
                    className="w-3 h-3"
                  />
                ))}
              </div>

              <p className="text-gray-400">
                ({courseData.courseRatings.length}
                {courseData.courseRatings.length > 1 ? " ratings" : " rating"})
              </p>

              <span className="text-gray-400">•</span>

              <p className="text-gray-300">
                {courseData.enrolledStudents.length}{" "}
                {courseData.enrolledStudents.length > 1
                  ? "students"
                  : "student"}
              </p>
            </div>

            <p className="text-sm text-gray-300">
              Course by{" "}
              <span className="text-cyan-400 underline">
                {courseData.educator.name}
              </span>
            </p>

            {/* COURSE STRUCTURE */}
            <div className="pt-8 text-gray-100">
              <h2 className="text-xl font-semibold">Course Structure</h2>

              <div className="pt-5">
                {courseData.courseContent?.map((chapter, index) => (
                  <div
                    key={index}
                    className="border border-white/10 bg-white/5 backdrop-blur-md mb-2 rounded-lg"
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
                        <p className="font-medium md:text-base text-sm">
                          {chapter.chapterTitle}
                        </p>
                      </div>
                      <p className="text-sm md:text-default text-gray-300">
                        {chapter.chapterContent.length} lectures -{" "}
                        {calculateChapterTime(chapter)}
                      </p>
                    </div>

                    <div
  className={`transition-all duration-300 ${
    openSections[index] ? "max-h-96" : "max-h-0"
  } overflow-y-auto hide-scrollbar`}
>

                      <ul
                        className="md:pl-10 pl-4 pr-4 py-2 text-gray-200
                                 border-t border-white/10"
                      >
                        {chapter.chapterContent.map((lecture, i) => (
                          <li key={i} className="flex items-start gap-2 py-1">
                            <img
                              src={assets.play_icon}
                              alt="play_icon"
                              className="w-4 h-2.5 mt-1"
                            />
                            <div className="flex items-center justify-between w-full text-xs md:text-default text-gray-100">
                              <p>{lecture.lectureTitle}</p>
                              <div className="flex gap-2 items-center">
                                {lecture.isPreviewFree && (
                                  <p
                                    onClick={() =>
                                      setPlayerData({
                                        videoId: getYouTubeId(
                                          lecture.lectureUrl
                                        ),
                                      })
                                    }
                                    className="text-cyan-400 cursor-pointer hover:text-cyan-300"
                                  >
                                    Preview
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
            </div>

            {/* FULL DESCRIPTION */}
            <div className="py-16 text-sm md:text-default text-gray-200">
              <h3 className="text-xl font-semibold text-white">
                Course Description
              </h3>
              <p
                className="pt-3 leading-relaxed text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription,
                }}
              ></p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full md:w-1/2 z-10 flex justify-end">
            <div className="w-full max-w-md rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.9)]">
              {playerData ? (
                <Youtube
                  videoId={playerData.videoId}
                  opts={{ playerVars: { autoplay: 1 } }}
                  iframeClassName="w-full aspect-video"
                />
              ) : (
                <img
                  src={courseData.courseThumbnail}
                  alt="course thumbnail"
                  className="w-full h-64 object-cover"
                />
              )}

              <div className="p-6 text-gray-200">
                {/* Offer timer */}
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <img
                    className="w-4"
                    src={assets.time_left_clock_icon}
                    alt="time left clock icon"
                  />
                  <p className="text-red-400 font-semibold">5 days</p>
                  <span>left at this price!</span>
                </div>

                {/* Pricing */}
                <div className="flex gap-3 items-center pt-3">
                  <p className="md:text-4xl text-2xl font-semibold text-white">
                    {currency}{" "}
                    {(
                      courseData.coursePrice -
                      (courseData.discount * courseData.coursePrice) / 100
                    ).toFixed(2)}
                  </p>
                  <p className="md:text-lg text-gray-400 line-through">
                    {currency} {courseData.coursePrice}
                  </p>
                  <p className="md:text-lg text-cyan-300">
                    {courseData.discount}% off
                  </p>
                </div>

                {/* Course meta info */}
                <div className="flex flex-wrap items-center text-sm md:text-base gap-4 pt-4 text-gray-300">
                  <div className="flex items-center gap-1">
                    <img
                      src={assets.star}
                      alt="star icon"
                      className="w-4 h-4"
                    />
                    <p>{calculateRating(courseData)}</p>
                  </div>

                  <div className="h-4 w-px bg.white/20"></div>

                  <div className="flex items-center gap-1">
                    <img
                      src={assets.time_clock_icon}
                      alt="clock icon"
                      className="w-4 h-4"
                    />
                    <p>{calculateCourseDuration(courseData)}</p>
                  </div>

                  <div className="h-4 w-px bg-white/20"></div>

                  <div className="flex items-center gap-1">
                    <img
                      src={assets.lesson_icon}
                      alt="lesson icon"
                      className="w-4 h-4"
                    />
                    <p>{calculateNoOfLectures(courseData)} lessons</p>
                  </div>
                </div>

                {/* <button
                onClick={enrollCourse}
                className="md:mt-6 mt-4 w-full py-3 rounded-lg bg-cyan-500 text-black font-medium
                           hover:bg-cyan-400 transition shadow-md shadow-cyan-500/40"
              >
                {isAlreadyEnrolled ? "Already Enrolled" : "Enroll now"}
              </button> */}

                <button
                  disabled={isPaying}
                  onClick={enrollCourse}
                  className={`md:mt-6 mt-4 w-full py-3 rounded-lg font-medium transition
    ${
      isPaying
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-cyan-500 hover:bg-cyan-400 text-black"
    }
  `}
                >
                  {isAlreadyEnrolled
                    ? "Already Enrolled"
                    : isPaying
                    ? "Processing..."
                    : "Enroll now"}
                </button>

                <div className="pt-6">
                  <p className="md:text-xl text-lg font-medium text-white">
                    What's in the course?
                  </p>
                  <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-300">
                    <li>Lifetime access with free updates</li>
                    <li>Step-by-step, hands-on project guidance</li>
                    <li>Downloadable resources and source code</li>
                    <li>Quizzes to test your knowledge</li>
                    <li>Certificate of Completion</li>
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
