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
  <div className="relative h-full overflow-y-auto flex flex-col items-start gap-8 p-4 md:p-8 w-full bg-paper text-ink">
    <div className="w-full relative z-10">
      <p className="font-meta text-[10px] uppercase mb-2 text-oxblood">
        Faculty Records
      </p>
      <h2 className="font-display font-semibold text-xl text-navy pb-5">
        My Courses
      </h2>

      <div className="w-full border border-navy bg-paper-alt">
        <table className="md:table-auto table-fixed w-full">
          <thead className="border-b border-navy">
            <tr>
              <th className="font-meta text-[10px] uppercase text-muted px-4 py-3 text-left truncate">
                Course
              </th>
              <th className="font-meta text-[10px] uppercase text-muted px-4 py-3 text-left truncate">
                Earnings
              </th>
              <th className="font-meta text-[10px] uppercase text-muted px-4 py-3 text-left truncate">
                Students
              </th>
              <th className="font-meta text-[10px] uppercase text-muted px-4 py-3 text-left truncate">
                Published On
              </th>
              <th className="font-meta text-[10px] uppercase text-muted px-4 py-3 text-left truncate">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="font-body text-sm">
            {courses.map((course) => {
              const earnings = Math.floor(
                course.enrolledStudents.length *
                  (course.coursePrice - (course.discount * course.coursePrice) / 100)
              );

              return (
                <tr key={course._id} className="border-b border-brass/30 last:border-0">
                  <td className="md:px-4 pl-2 md:pl-4 py-3">
                    <div className="flex items-center space-x-3 truncate">
                      <img
                        src={course.courseThumbnail}
                        alt="Course"
                        className="w-16 h-16 object-cover border border-brass/60"
                      />
                      <span className="truncate hidden md:block text-ink">
                        {course.courseTitle}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-oxblood font-medium">
                    {currency}
                    {earnings}
                  </td>

                  <td className="px-4 py-3 text-ink">
                    {course.enrolledStudents.length}
                  </td>

                  <td className="px-4 py-3 text-muted">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/educator/edit-course/${course._id}`)}
                      className="font-meta px-4 py-1.5 text-[11px] uppercase border border-oxblood text-oxblood hover:bg-oxblood hover:text-paper transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}

            {courses.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted font-body">
                  You haven't published any courses yet.
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
