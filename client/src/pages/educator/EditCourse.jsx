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
    <div className="relative h-full overflow-y-auto flex flex-col items-start gap-8 p-4 md:p-8 text-slate-100">
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-40 w-72 bg-cyan-500/25 blur-3xl" />

      <form
  onSubmit={handleSubmit}
  className="relative z-10 flex flex-col gap-4 w-full max-w-3xl
             bg-slate-900/80 border border-slate-800 
             rounded-2xl shadow-xl shadow-black/40 p-5 md:p-6"
>

        <h1 className="text-2xl font-semibold mb-4">Edit Course</h1>

        <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-slate-200">Course Title</p>
                  <input
                    onChange={e => setCourseTitle(e.target.value)}
                    value={courseTitle}
                    type="text"
                    placeholder="Type here"
                    required
                    className="outline-none md:py-2.5 py-2 px-3 rounded-lg border border-slate-700 
                               bg-slate-900 text-slate-100 
                               focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500/70 transition"
                  />
                </div>
        
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-slate-200">Course Description</p>
                  <div
                    ref={editorCallbackRef}
                    className="border border-slate-700 rounded-lg bg-slate-900 text-slate-100"
                  ></div>
                </div>
        
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-slate-200">Course Price</p>
                    <input
                      onChange={e => setCoursePrice(e.target.value)}
                      value={coursePrice}
                      type="number"
                      placeholder="0"
                      required
                      className="outline-none md:py-2.5 py-2 w-28 px-3 rounded-lg border border-slate-700 
                                 bg-slate-900 text-slate-100 
                                 focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500/70 transition"
                    />
                  </div>
        
                  <div className="flex md:flex-row flex-col items-center gap-3">
  <p className="text-sm font-medium text-slate-200">Course Thumbnail</p>

  <label
    htmlFor="thumbnailImage"
    className="flex items-center gap-3 cursor-pointer"
  >
    <img
      src={assets.file_upload_icon}
      alt=""
      className="p-3 bg-cyan-500 hover:bg-cyan-400 transition rounded-lg shadow-md shadow-cyan-500/40"
    />

    <input
      type="file"
      id="thumbnailImage"
      accept="image/*"
      hidden
      onChange={(e) => setImage(e.target.files[0])}
    />

    {/* ✅ PREFILLED THUMBNAIL */}
    {(image || oldImage) && (
      <img
        className="max-h-10 rounded-lg border border-slate-700"
        src={
          image
            ? URL.createObjectURL(image) // new selected
            : oldImage                  // existing thumbnail
        }
        alt="Course thumbnail"
      />
    )}
  </label>
</div>

                </div>
        
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-slate-200">Discount %</p>
                  <input
                    onChange={e => setDiscount(e.target.value)}
                    value={discount}
                    type="number"
                    placeholder="0"
                    min={0}
                    max={100}
                    required
                    className="outline-none md:py-2.5 py-2 w-28 px-3 rounded-lg border border-slate-700 
                               bg-slate-900 text-slate-100 
                               focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500/70 transition"
                  />
                </div>
        
                {/* Chapters & Lectures */}
                <div className="pt-2 max-h-[60vh] overflow-y-auto scrollbar-hide pr-2">
                  {chapters.map((chapter, chapterIndex) => (
                    <div
                      key={chapter.chapterId}
                      className="bg-slate-900 border border-slate-800 
                                 rounded-lg mb-4 shadow-sm shadow-black/40"
                    >
                      <div className="flex justify-between items-center p-4 border-b border-slate-800">
                        <div className="flex items-center">
                          <img
                            onClick={() => handleChapter('toggle', chapter.chapterId)}
                            src={assets.dropdown_icon}
                            width={14}
                            alt=""
                            className={`mr-2 cursor-pointer transition-transform ${
                              chapter.collapsed && '-rotate-90'
                            }`}
                          />
                          <span className="font-semibold text-sm md:text-base text-slate-100">
                            {chapterIndex + 1}. {chapter.chapterTitle}
                          </span>
                        </div>
                        <span className="text-xs md:text-sm text-slate-400">
                          {chapter.chapterContent.length} Lectures
                        </span>
                        <img
                          onClick={() => handleChapter('remove', chapter.chapterId)}
                          src={assets.cross_icon}
                          alt=""
                          className="cursor-pointer hover:opacity-80 transition"
                        />
                      </div>
        
                      {!chapter.collapsed && (
                        <div className="p-4">
                          {chapter.chapterContent.map((lecture, lectureIndex) => (
                            <div
                              key={lecture.lectureId ?? lectureIndex}
                              className="flex justify-between items-center mb-2 text-sm"
                            >
                              <span className="text-slate-200">
                                {lectureIndex + 1}. {lecture.lectureTitle} -{' '}
                                {lecture.lectureDuration} mins -{' '}
                                <a
                                  href={lecture.lectureUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-cyan-400 hover:text-cyan-300 underline-offset-2 hover:underline"
                                >
                                  Link
                                </a>{' '}
                                -{' '}
                                <span className="font-medium">
                                  {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                                </span>
                              </span>
                              <img
                                src={assets.cross_icon}
                                alt=""
                                onClick={() =>
                                  handleLecture('remove', chapter.chapterId, lectureIndex)
                                }
                                className="cursor-pointer hover:opacity-80 transition"
                              />
                            </div>
                          ))}
        
                          <div
                            className="inline-flex bg-slate-800/80 text-slate-100 
                                       px-3 py-1.5 rounded cursor-pointer mt-2 text-sm 
                                       hover:bg-slate-700 transition"
                            onClick={() => handleLecture('add', chapter.chapterId)}
                          >
                            + Add Lectures
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
        
                  <div
                    className="flex justify-center items-center mt-1
                               bg-cyan-500/10 text-cyan-300 
                               px-3 py-2 rounded-lg cursor-pointer 
                               hover:bg-cyan-500/20 transition text-sm font-medium"
                    onClick={() => handleChapter('add')}
                  >
                    + Add Chapter
                  </div>
        
                  {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm z-50">
                      <div className="bg-slate-900 text-slate-200 
                                      p-4 rounded-lg relative w-full max-w-80 
                                      shadow-xl shadow-black/60">
                        <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>
        
                        <div className="mb-2">
                          <p className="text-sm">Lecture Title</p>
                          <input
                            type="text"
                            className="mt-1 block w-full border border-slate-700 
                                       rounded py-1 px-2 bg-slate-900 
                                       text-slate-100 outline-none 
                                       focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500/70 transition"
                            value={lectureDetails.lectureTitle}
                            onChange={e =>
                              setLectureDetails({
                                ...lectureDetails,
                                lectureTitle: e.target.value,
                              })
                            }
                          />
                        </div>
        
                        <div className="mb-2">
                          <p className="text-sm">Duration (minutes)</p>
                          <input
                            type="number"
                            className="mt-1 block w-full border border-slate-700 
                                       rounded py-1 px-2 bg-slate-900 
                                       text-slate-100 outline-none 
                                       focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500/70 transition"
                            value={lectureDetails.lectureDuration}
                            onChange={e =>
                              setLectureDetails({
                                ...lectureDetails,
                                lectureDuration: e.target.value,
                              })
                            }
                          />
                        </div>
        
                        <div className="mb-2">
                          <p className="text-sm">Lecture URL</p>
                          <input
                            type="text"
                            className="mt-1 block w-full border border-slate-700 
                                       rounded py-1 px-2 bg-slate-900 
                                       text-slate-100 outline-none 
                                       focus:ring-2 focus:ring-cyan-500/70 focus:border-cyan-500/70 transition"
                            value={lectureDetails.lectureUrl}
                            onChange={e =>
                              setLectureDetails({
                                ...lectureDetails,
                                lectureUrl: e.target.value,
                              })
                            }
                          />
                        </div>
        
                        <div className="mb-4 flex items-center gap-2">
                          <p className="text-sm">Is Preview Free?</p>
                          <input
                            type="checkbox"
                            className="mt-1 accent-cyan-500"
                            checked={lectureDetails.isPreviewFree}
                            onChange={e =>
                              setLectureDetails({
                                ...lectureDetails,
                                isPreviewFree: e.target.checked,
                              })
                            }
                          />
                        </div>
        
                        <button
                          type="button"
                          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 
                                     rounded-md font-medium transition"
                          onClick={addLecture}
                        >
                          Add Lecture
                        </button>
        
                        <img
                          onClick={() => setShowPopup(false)}
                          src={assets.cross_icon}
                          className="absolute top-4 right-4 w-4 cursor-pointer hover:opacity-80 transition"
                          alt=""
                        />
                      </div>
                    </div>
                  )}
                </div>
        
        <button
  type="submit"
  disabled={!quillReady}
  className={`px-8 py-2 rounded-lg mt-4
    ${quillReady
      ? "bg-cyan-500 hover:bg-cyan-400 text-black"
      : "bg-gray-600 cursor-not-allowed text-gray-300"}
  `}
>
  UPDATE
</button>

      </form>
    </div>
  );
};

export default EditCourse;



