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
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "#F8F5EE", color: "#211F1B" }}
    >
      {(() => {
        const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
        const serifBody = { fontFamily: "'Source Serif 4', Georgia, serif" };
        const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" };

        return (
          <>
            {/* Faint rule grid instead of glow blobs — reads as ledger paper, not a SaaS hero */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(#A9823D18 1px, transparent 1px), linear-gradient(90deg, #A9823D18 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 items-start justify-between md:pt-24 pt-8 px-4 md:px-8 min-h-screen">

              {/* --- LEFT COLUMN --- */}
              <div className="w-full md:w-[60%] lg:w-[65%] order-2 md:order-1">
                <p className="text-[10px] uppercase mb-3" style={{ ...metaSans, color: "#7A2E2E" }}>
                  Course Prospectus
                </p>
                <h1
                  className="text-3xl md:text-5xl font-semibold leading-[1.1] mb-5 pb-4 border-b-2 inline-block"
                  style={{ ...serifDisplay, color: "#1D2B3A", borderColor: "#7A2E2E" }}
                >
                  {courseData.courseTitle}
                </h1>

                <p
                  className="pt-2 text-base md:text-lg leading-relaxed"
                  style={{ ...serifBody, color: "#3A3630" }}
                  dangerouslySetInnerHTML={{
                    __html: courseData.courseDescription.slice(0, 230) + "...",
                  }}
                ></p>

                {/* REVIEW & RATING */}
                <div className="flex items-center flex-wrap gap-4 pt-6 pb-2 text-sm">
                  <div
                    className="flex items-center gap-2 px-3 py-1"
                    style={{ border: "1px solid #A9823D80" }}
                  >
                    <span style={{ ...serifDisplay, fontWeight: 600, color: "#7A2E2E" }}>
                      {calculateRating(courseData)}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <img
                          key={i}
                          src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank}
                          alt="star"
                          className="w-3.5 h-3.5"
                          style={{
                            filter:
                              i < Math.floor(calculateRating(courseData))
                                ? "sepia(60%) saturate(400%) hue-rotate(0deg) brightness(0.8)"
                                : "grayscale(1) opacity(0.5)",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <p style={{ ...serifBody, color: "#6B6355" }}>
                    ({courseData.courseRatings.length}{" "}
                    {courseData.courseRatings.length > 1 ? "ratings" : "rating"})
                  </p>

                  <span className="hidden md:inline" style={{ color: "#A9823D80" }}>|</span>

                  <p style={{ ...serifBody, color: "#3A3630" }}>
                    <span style={{ fontWeight: 600, color: "#1D2B3A" }}>
                      {courseData.enrolledStudents.length}
                    </span>{" "}
                    students enrolled
                  </p>
                </div>

                <p className="text-sm mt-2" style={{ ...serifBody, color: "#6B6355" }}>
                  Instructed by{" "}
                  <span style={{ color: "#7A2E2E", fontWeight: 600 }}>{courseData.educator.name}</span>
                </p>

                {/* COURSE STRUCTURE */}
                <div className="pt-14">
                  <h2 className="text-2xl font-semibold mb-6" style={{ ...serifDisplay, color: "#1D2B3A" }}>
                    Curriculum
                  </h2>
                  <div>
                    {courseData.courseContent?.map((chapter, index) => (
                      <div key={index} className="border-b" style={{ borderColor: "#A9823D30" }}>
                        <div
                          className="flex items-center gap-3 py-4 cursor-pointer"
                          onClick={() => toggleSection(index)}
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[13px]"
                            style={{ ...serifDisplay, border: "1px solid #1D2B3A", color: "#1D2B3A" }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </div>
                          <p
                            className="font-semibold flex-1"
                            style={{ ...serifBody, fontWeight: 600, color: "#1D2B3A" }}
                          >
                            {chapter.chapterTitle}
                          </p>
                          <p className="text-xs" style={{ ...metaSans, color: "#6B6355" }}>
                            {chapter.chapterContent.length} lectures · {calculateChapterTime(chapter)}
                          </p>
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
                          className={`transition-all duration-300 overflow-hidden ${
                            openSections[index] ? "max-h-[1000px]" : "max-h-0"
                          }`}
                        >
                          <ul className="pb-3 pl-11">
                            {chapter.chapterContent.map((lecture, i) => (
                              <li
                                key={i}
                                className="flex items-center justify-between py-2.5 group"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span
                                    className="text-[11px] w-4 shrink-0"
                                    style={{ ...serifBody, color: "#A9823D" }}
                                  >
                                    {i + 1}
                                  </span>
                                  <p
                                    className="text-sm truncate"
                                    style={{ ...serifBody, color: "#3A3630" }}
                                  >
                                    {lecture.lectureTitle}
                                  </p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                  {lecture.isPreviewFree && (
                                    <button
                                      onClick={() => setPlayerData({ lectureUrl: lecture.lectureUrl })}
                                      className="text-[10px] font-semibold uppercase"
                                      style={{ ...metaSans, color: "#7A2E2E" }}
                                    >
                                      Preview
                                    </button>
                                  )}
                                  <p className="text-xs" style={{ ...metaSans, color: "#6B6355" }}>
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
                  <h3 className="text-2xl font-semibold mb-4" style={{ ...serifDisplay, color: "#1D2B3A" }}>
                    About This Course
                  </h3>
                  <div
                    className="prose max-w-none leading-relaxed"
                    style={{ ...serifBody, color: "#3A3630" }}
                    dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
                  />
                </div>
              </div>

              {/* --- RIGHT COLUMN: ENROLLMENT CARD --- */}
              <div className="w-full md:w-[38%] lg:w-[32%] order-1 md:order-2 md:sticky md:top-24">
                <div style={{ border: "1px solid #1D2B3A", background: "#FFFDF8" }}>
                  <div className="relative w-full aspect-video" style={{ background: "#1D2B3A" }}>
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
                        <img
                          src={courseData.courseThumbnail}
                          alt="thumbnail"
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                            style={{ background: "#7A2E2E" }}
                          >
                            <img src={assets.play_icon} className="w-5 h-5 translate-x-0.5" alt="play" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Pricing */}
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-3xl font-semibold" style={{ ...serifDisplay, color: "#1D2B3A" }}>
                        {currency}
                        {(
                          courseData.coursePrice -
                          (courseData.discount * courseData.coursePrice) / 100
                        ).toFixed(2)}
                      </span>
                      <span className="text-base line-through" style={{ ...serifBody, color: "#A39A88" }}>
                        {currency}
                        {courseData.coursePrice}
                      </span>
                      <span className="text-sm font-medium" style={{ ...metaSans, color: "#7A2E2E" }}>
                        {courseData.discount}% off
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-2 text-xs mb-6 pt-2 border-t"
                      style={{ borderColor: "#A9823D30", color: "#7A2E2E" }}
                    >
                      <img className="w-3.5 h-3.5" src={assets.time_left_clock_icon} alt="timer" style={{ filter: "sepia(60%) saturate(400%)" }} />
                      <span className="uppercase font-medium" style={{ ...metaSans, fontSize: "10px" }}>
                        Enrollment closes in 5 days
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      disabled={isPaying}
                      onClick={enrollCourse}
                      className="w-full py-3.5 font-medium text-base transition-colors"
                      style={
                        isPaying
                          ? { ...metaSans, background: "#D8D2C4", color: "#A39A88", cursor: "not-allowed" }
                          : { ...metaSans, background: "#7A2E2E", color: "#F8F5EE" }
                      }
                    >
                      {isAlreadyEnrolled ? "Already Enrolled" : isPaying ? "Processing..." : "Enroll Now"}
                    </button>

                    <p className="text-center text-xs mt-4" style={{ ...serifBody, color: "#6B6355" }}>
                      30-Day Money-Back Guarantee
                    </p>

                    {/* Meta Info */}
                    <div
                      className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t text-sm"
                      style={{ borderColor: "#A9823D30", ...serifBody, color: "#3A3630" }}
                    >
                      <div className="flex items-center gap-2">
                        <img src={assets.time_clock_icon} alt="duration" className="w-4 h-4 opacity-70" />
                        <span>{calculateCourseDuration(courseData)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src={assets.lesson_icon} alt="lessons" className="w-4 h-4 opacity-70" />
                        <span>{calculateNoOfLectures(courseData)} Lessons</span>
                      </div>
                    </div>

                    {/* Perks */}
                    <div className="mt-8">
                      <p className="font-semibold mb-3" style={{ ...serifDisplay, color: "#1D2B3A" }}>
                        This course includes
                      </p>
                      <ul className="space-y-2 text-sm" style={{ ...serifBody, color: "#3A3630" }}>
                        <li className="flex items-center gap-2">
                          <span style={{ color: "#7A2E2E" }}>✓</span> Lifetime access
                        </li>
                        <li className="flex items-center gap-2">
                          <span style={{ color: "#7A2E2E" }}>✓</span> Practical projects
                        </li>
                        <li className="flex items-center gap-2">
                          <span style={{ color: "#7A2E2E" }}>✓</span> Certificate of completion
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })()}
    </div>
    <Footer />
  </>
) : (
  <Loading />
);
};

export default CourseDetail;
