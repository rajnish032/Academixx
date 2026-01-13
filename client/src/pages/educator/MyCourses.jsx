import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const { currency, backendUrl} = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const navigate = useNavigate();


  const fetchEducatorCourses = async () => {
    try {
      
      const { data } = await axios.get(backendUrl + '/api/educator/courses', {
       withCredentials: true
      });
      setCourses(data.courses);
      if (!data.success) {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
      fetchEducatorCourses();
  }, []);

  return courses ? (
    <div className="relative h-full overflow-y-auto flex flex-col items-start gap-8 p-4 md:p-8 w-full text-slate-100">
      {/* glow */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-40 w-72 rounded-full bg-cyan-500/25 blur-3xl" />

      <div className="w-full relative z-10">
        <h2 className="pb-4 text-lg font-semibold text-slate-100">My Courses</h2>

        <div
          className="
            flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-xl
            border bg-slate-900/85 border-slate-800
            shadow-xl shadow-black/50
          "
        >
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead
              className="
                text-slate-100 text-sm text-left
                border-b border-slate-800
                bg-slate-950/70
              "
            >
              <tr>
                <th className="px-4 py-3 font-semibold truncate">All Courses</th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">Published On</th>
                <th className="px-4 py-3 font-semibold truncate">Action</th>
              </tr>
            </thead>

            <tbody className="text-sm text-slate-300">
              {courses.map(course => {
                const earnings = Math.floor(
                  course.enrolledStudents.length *
                    (course.coursePrice -
                      (course.discount * course.coursePrice) / 100)
                );

                return (
                  <tr
                    key={course._id}
                    className="
                      border-b border-slate-800
                      hover:bg-slate-800/70
                      transition-colors
                    "
                  >
                    <td className="md:px-4 pl-2 md:pl-4 py-3">
                      <div className="flex items-center space-x-3 truncate">
                        <img
                          src={course.courseThumbnail}
                          alt="Course"
                          className="w-16 h-16 rounded-md object-cover border border-slate-700"
                        />
                        <span className="truncate hidden md:block">
                          {course.courseTitle}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {currency}
                      {earnings}
                    </td>

                    <td className="px-4 py-3">
                      {course.enrolledStudents.length}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
  <button
    onClick={() => navigate(`/educator/edit-course/${course._id}`)}
    className="px-3 py-1.5 rounded-md text-sm
               bg-cyan-500/90 hover:bg-cyan-400
               text-black transition"
  >
    Update
  </button>
</td>

                  </tr>
                );
              })}

              {courses.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    You haven&apos;t published any courses yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
