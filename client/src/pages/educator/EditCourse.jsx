import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import uniqid from "uniqid";
import Quill from "quill";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/student/Loading";

const EditCourse = () => {
  const { backendUrl } = useContext(AppContext);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const [quillReady, setQuillReady] = useState(false);


  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [image, setImage] = useState(null);          // new image (File)
  const [oldImage, setOldImage] = useState("");      // existing URL

  const [chapters, setChapters] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [courseDescription, setCourseDescription] = useState("");

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  /* ================= LOAD COURSE ================= */
  const fetchCourse = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/educator/course/${courseId}`,
        { withCredentials: true }
      );

      if (!data.success) {
        toast.error(data.message);
        return navigate("/educator/my-courses");
      }

      const course = data.course;

      setCourseTitle(course.courseTitle);
      setCoursePrice(course.coursePrice);
      setDiscount(course.discount);
      setChapters(course.courseContent || []);
      setOldImage(course.courseThumbnail);

     setCourseDescription(course.courseDescription || "");

    } catch (error) {
      toast.error("Failed to load course");
      navigate("/educator/my-courses");
    } finally {
      setLoading(false);
    }
  };

  /* ================= QUILL INIT ================= */
  const editorCallbackRef = (node) => {
  if (!node || quillRef.current) return;

  quillRef.current = new Quill(node, {
    theme: "snow",
  });

  setQuillReady(true);
};




useEffect(() => {
  if (quillReady && quillRef.current) {
    quillRef.current.root.innerHTML = courseDescription;
  }
}, [quillReady, courseDescription]);

  useEffect(() => {
    fetchCourse();
  }, []);

  /* ================= CHAPTER & LECTURE (SAME AS ADD) ================= */
  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (!title) return;

      setChapters((prev) => [
        ...prev,
        {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: prev.length + 1,
        },
      ]);
    }

    if (action === "remove") {
      setChapters((prev) =>
        prev.filter((c) => c.chapterId !== chapterId)
      );
    }

    if (action === "toggle") {
      setChapters((prev) =>
        prev.map((c) =>
          c.chapterId === chapterId
            ? { ...c, collapsed: !c.collapsed }
            : c
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    }

    if (action === "remove") {
      setChapters((prev) =>
        prev.map((c) =>
          c.chapterId === chapterId
            ? {
                ...c,
                chapterContent: c.chapterContent.filter(
                  (_, i) => i !== lectureIndex
                ),
              }
            : c
        )
      );
    }
  };

  const addLecture = () => {
    if (!lectureDetails.lectureTitle) return;

    setChapters((prev) =>
      prev.map((c) => {
        if (c.chapterId !== currentChapterId) return c;

        return {
          ...c,
          chapterContent: [
            ...c.chapterContent,
            {
              ...lectureDetails,
              lectureId: uniqid(),
              lectureOrder: c.chapterContent.length + 1,
            },
          ],
        };
      })
    );

    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  /* ================= UPDATE COURSE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quillRef.current) {
  toast.error("Editor not ready yet");
  return;
}

    try {
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append("courseId", courseId);
      formData.append("courseData", JSON.stringify(courseData));

      if (image) formData.append("image", image);

      const { data } = await axios.put(
        `${backendUrl}/api/educator/update-course`,
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Course updated successfully");
        navigate("/educator/my-courses");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  

  if (loading) return <Loading/>

  return (
  <div className="relative h-full overflow-y-auto flex flex-col items-start gap-8 p-4 md:p-8 bg-paper text-ink">
    <form
      onSubmit={handleSubmit}
      className="relative z-10 flex flex-col gap-6 w-full max-w-3xl bg-paper-alt border border-navy p-5 md:p-8"
    >
      <div>
        <p className="font-meta text-[10px] uppercase mb-2 text-oxblood">
          Curriculum Builder
        </p>
        <h1 className="font-display font-semibold text-xl md:text-2xl text-navy">
          Edit Course
        </h1>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-meta text-[10px] uppercase text-muted">
          Course Title
        </label>
        <input
          onChange={(e) => setCourseTitle(e.target.value)}
          value={courseTitle}
          type="text"
          placeholder="e.g. Introduction to Machine Learning"
          required
          className="font-body outline-none py-2.5 px-3 border border-brass/50 bg-transparent text-ink focus:border-oxblood transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-meta text-[10px] uppercase text-muted">
          Course Description
        </label>
        <div
          ref={editorCallbackRef}
          className="border border-brass/50 bg-paper-alt text-ink"
        ></div>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="font-meta text-[10px] uppercase text-muted">
            Course Price
          </label>
          <input
            onChange={(e) => setCoursePrice(e.target.value)}
            value={coursePrice}
            type="number"
            placeholder="0"
            required
            className="font-body outline-none py-2.5 w-28 px-3 border border-brass/50 bg-transparent text-ink focus:border-oxblood transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-meta text-[10px] uppercase text-muted">
            Course Thumbnail
          </label>
          <label htmlFor="thumbnailImage" className="flex items-center gap-3 cursor-pointer">
            <span className="flex items-center gap-2 px-4 py-2.5 border border-oxblood text-oxblood font-meta text-[11px] uppercase hover:bg-oxblood hover:text-paper transition-colors">
              <img
                src={assets.file_upload_icon}
                alt=""
                className="w-4 h-4 brightness-0 invert-[0.15] sepia hue-rotate-180"
              />
              Change
            </span>

            <input
              type="file"
              id="thumbnailImage"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />

            {(image || oldImage) && (
              <img
                className="max-h-10 border border-brass/50"
                src={image ? URL.createObjectURL(image) : oldImage}
                alt="Course thumbnail"
              />
            )}
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-meta text-[10px] uppercase text-muted">
          Discount %
        </label>
        <input
          onChange={(e) => setDiscount(e.target.value)}
          value={discount}
          type="number"
          placeholder="0"
          min={0}
          max={100}
          required
          className="font-body outline-none py-2.5 w-28 px-3 border border-brass/50 bg-transparent text-ink focus:border-oxblood transition-colors"
        />
      </div>

      {/* Chapters & Lectures */}
      <div className="pt-2 border-t border-brass/40">
        <p className="font-meta text-[10px] uppercase mt-6 mb-4 text-oxblood">
          Curriculum
        </p>

        <div className="max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar space-y-4">
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapter.chapterId} className="border border-navy bg-paper">
              <div className="flex justify-between items-center p-4 border-b border-brass/30">
                <div className="flex items-center gap-3">
                  <img
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                    src={assets.dropdown_icon}
                    width={12}
                    alt=""
                    className={`cursor-pointer transition-transform brightness-0 invert-[0.15] sepia hue-rotate-180 ${
                      chapter.collapsed && '-rotate-90'
                    }`}
                  />
                  <span className="font-display font-semibold text-sm md:text-base text-navy">
                    {chapterIndex + 1}. {chapter.chapterTitle}
                  </span>
                </div>
                <span className="font-meta text-[11px] uppercase text-muted">
                  {chapter.chapterContent.length} Lectures
                </span>
                <img
                  onClick={() => handleChapter('remove', chapter.chapterId)}
                  src={assets.cross_icon}
                  alt=""
                  className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100 transition-opacity brightness-0 invert-[0.15] sepia hue-rotate-180"
                />
              </div>

              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div
                      key={lecture.lectureId ?? lectureIndex}
                      className="flex justify-between items-center py-2 border-b border-brass/20 last:border-0 text-sm font-body"
                    >
                      <span className="text-ink">
                        {lectureIndex + 1}. {lecture.lectureTitle} —{' '}
                        {lecture.lectureDuration} mins —{' '}
                        <a
                          href={lecture.lectureUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-oxblood underline-offset-2 hover:underline"
                        >
                          Link
                        </a>{' '}
                        —{' '}
                        <span className="font-semibold">
                          {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                        </span>
                      </span>
                      <img
                        src={assets.cross_icon}
                        alt=""
                        onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
                        className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100 transition-opacity brightness-0 invert-[0.15] sepia hue-rotate-180"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    className="font-meta text-[11px] uppercase text-oxblood mt-3 hover:underline"
                    onClick={() => handleLecture('add', chapter.chapterId)}
                  >
                    + Add Lecture
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            className="w-full flex justify-center items-center py-3 border border-dashed border-brass/60 font-meta text-[11px] uppercase text-oxblood hover:bg-paper-alt transition-colors"
            onClick={() => handleChapter('add')}
          >
            + Add Chapter
          </button>
        </div>

        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-navy/50 z-50">
            <div className="bg-paper-alt border border-navy p-5 relative w-full max-w-80">
              <h2 className="font-display font-semibold text-lg mb-5 text-navy">
                Add Lecture
              </h2>

              <div className="mb-3">
                <label className="font-meta text-[10px] uppercase text-muted block mb-1">
                  Lecture Title
                </label>
                <input
                  type="text"
                  className="font-body block w-full border border-brass/50 bg-transparent py-1.5 px-2 text-ink outline-none focus:border-oxblood transition-colors"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="font-meta text-[10px] uppercase text-muted block mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  className="font-body block w-full border border-brass/50 bg-transparent py-1.5 px-2 text-ink outline-none focus:border-oxblood transition-colors"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="font-meta text-[10px] uppercase text-muted block mb-1">
                  Lecture URL
                </label>
                <input
                  type="text"
                  className="font-body block w-full border border-brass/50 bg-transparent py-1.5 px-2 text-ink outline-none focus:border-oxblood transition-colors"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })
                  }
                />
              </div>

              <div className="mb-5 flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-oxblood"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })
                  }
                />
                <label className="font-meta text-[11px] uppercase text-muted">
                  Free Preview
                </label>
              </div>

              <button
                type="button"
                className="w-full font-meta text-[11px] uppercase bg-oxblood text-paper py-2.5 hover:bg-[#5F2323] transition-colors"
                onClick={addLecture}
              >
                Add Lecture
              </button>

              <img
                onClick={() => setShowPopup(false)}
                src={assets.cross_icon}
                className="absolute top-4 right-4 w-3 h-3 cursor-pointer opacity-60 hover:opacity-100 transition-opacity brightness-0 invert-[0.15] sepia hue-rotate-180"
                alt=""
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!quillReady}
        className={`font-meta text-[12px] uppercase px-10 py-3 mt-2 transition-colors ${
          quillReady
            ? "bg-oxblood text-paper hover:bg-[#5F2323]"
            : "bg-[#D8D2C4] text-faint cursor-not-allowed"
        }`}
      >
        Update Course
      </button>
    </form>
  </div>
);
};

export default EditCourse;



