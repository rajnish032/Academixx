import React, { useContext, useEffect, useRef, useState } from 'react';
import uniqid from 'uniqid';
import Quill from 'quill';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddCourse = () => {
  const { backendUrl } = useContext(AppContext);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name: ');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters[chapters.length - 1].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter(chapter => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map(chapter =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map(chapter =>
          chapter.chapterId === chapterId
            ? {
                ...chapter,
                chapterContent: chapter.chapterContent.filter(
                  (_, index) => index !== lectureIndex
                ),
              }
            : chapter
        )
      );
    }
  };

  const addLecture = () => {
    if (
      !lectureDetails.lectureTitle ||
      !lectureDetails.lectureDuration ||
      !lectureDetails.lectureUrl
    ) {
      alert('Please fill all lecture fields');
      return;
    }

    setChapters(
      chapters.map(chapter => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent[chapter.chapterContent.length - 1]
                    .lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          };

          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, newLecture],
          };
        }
        return chapter;
      })
    );

    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
  };

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      if (!image) {
        toast.error('Thumbnail not selected');
        return;
      }

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      formData.append('image', image);

      const { data } = await axios.post(
        backendUrl + '/api/educator/add-course',
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        setCourseTitle('');
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = '';
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);

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
          Add New Course
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
          ref={editorRef}
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
              Upload
            </span>
            <input
              type="file"
              id="thumbnailImage"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              hidden
            />
            {image && (
              <img
                className="max-h-10 border border-brass/50"
                src={URL.createObjectURL(image)}
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
        className="font-meta text-[12px] uppercase bg-oxblood text-paper w-max py-3 px-10 mt-2 hover:bg-[#5F2323] transition-colors"
      >
        Publish Course
      </button>
    </form>
  </div>
);
};

export default AddCourse;
