import React, { useContext, useEffect, useState } from 'react';
import Loading from '../../components/student/Loading';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

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
  <div className="relative h-full overflow-y-auto flex flex-col items-start gap-8 p-4 md:p-8 w-full bg-paper text-ink">
    <div className="w-full relative z-10">
      <p className="font-meta text-[10px] uppercase mb-2 text-oxblood">
        Enrollment Register
      </p>
      <h2 className="font-display font-semibold text-xl text-navy pb-5">
        Students Enrolled
      </h2>

      <div className="w-full border border-navy bg-paper-alt">
        <table className="table-fixed md:table-auto w-full">
          <thead className="border-b border-navy">
            <tr>
              <th className="font-meta text-[10px] uppercase text-muted px-4 py-3 text-center hidden sm:table-cell">
                #
              </th>
              <th className="font-meta text-[10px] uppercase text-muted px-4 py-3 text-left">
                Student Name
              </th>
              <th className="font-meta text-[10px] uppercase text-muted px-4 py-3 text-left">
                Course Title
              </th>
              <th className="font-meta text-[10px] uppercase text-muted px-4 py-3 text-left hidden sm:table-cell">
                Date
              </th>
            </tr>
          </thead>

          <tbody className="font-body text-sm">
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-b border-brass/30 last:border-0">
                <td className="px-4 py-3 text-center hidden sm:table-cell text-faint">
                  {index + 1}
                </td>

                <td className="md:px-4 px-2 py-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.student.imageUrl || assets.profile}
                      alt="profile"
                      className="w-9 h-9 object-cover border border-brass/60"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = assets.profile_img;
                      }}
                    />
                    <span className="truncate text-ink">{item.student.firstName} {item.student.lastName}</span>
                  </div>
                </td>

                <td className="px-4 py-3 truncate text-ink">{item.courseTitle}</td>

                <td className="px-4 py-3 hidden sm:table-cell text-muted">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {enrolledStudents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted font-body">
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
