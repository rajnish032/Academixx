import React, { useContext, useEffect, useState } from 'react';
import Loading from '../../components/student/Loading';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentsEnrolled = () => {
  const { backendUrl } = useContext(AppContext);

  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    try {
      
      const { data } = await axios.get(
        backendUrl + '/api/educator/enrolled-students',
        { withCredentials: true }
      );
      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
      fetchEnrolledStudents();
  }, []);

  return enrolledStudents ? (
    <div className="relative h-full overflow-y-auto flex flex-col items-start gap-8 p-4 md:p-8 w-full text-slate-100">
      {/* glow */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-40 w-72 rounded-full bg-indigo-500/25 blur-3xl" />

      <div className="w-full relative z-10">
        <h2 className="pb-4 text-lg font-semibold text-slate-100">
          Students Enrolled
        </h2>

        <div
          className="
            flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-xl
            border bg-slate-900/85 border-slate-800
            shadow-xl shadow-black/50
          "
        >
          <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
            <thead
              className="
                text-slate-100 text-sm text-left
                border-b border-slate-800
                bg-slate-950/70
              "
            >
              <tr>
                <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                  #
                </th>
                <th className="px-4 py-3 font-semibold">Student Name</th>
                <th className="px-4 py-3 font-semibold">Course Title</th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="text-sm text-slate-300">
              {enrolledStudents.map((item, index) => (
                <tr
                  key={index}
                  className="
                    border-b border-slate-800
                    hover:bg-slate-800/70
                    transition-colors
                  "
                >
                  <td className="px-4 py-3 text-center hidden sm:table-cell text-slate-500">
                    {index + 1}
                  </td>

                  <td className="md:px-4 px-2 py-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.student.imageUrl}
                        alt="profile"
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <span className="truncate">{item.student.name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3 truncate">
                    {item.courseTitle}
                  </td>

                  <td className="px-4 py-3 hidden sm:table-cell text-slate-400">
                    {new Date(item.purchaseDate).toLocaleString()}
                  </td>
                </tr>
              ))}

              {enrolledStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No students enrolled yet.
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

export default StudentsEnrolled;
