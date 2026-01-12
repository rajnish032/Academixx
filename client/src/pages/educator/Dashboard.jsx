import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import Loading from '../../components/student/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { currency, backendUrl } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/educator/dashboard', {
        withCredentials: true
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
      fetchDashboardData();
  }, []);

  return dashboardData ? (
    <div className="relative h-full overflow-y-auto flex flex-col items-start gap-8 p-4 md:p-8 text-slate-100">
      {/* glow */}
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-40 w-72 rounded-full bg-indigo-500/25 blur-3xl" />

      <div className="space-y-6 w-full relative z-10">
        {/* Top stats */}
        <div className="grid w-full gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Enrollments */}
          <div className="flex items-center gap-4 rounded-xl border h-32 px-6
                          bg-slate-900/80 border-slate-800 shadow-lg shadow-black/40">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/20">
              <img src={assets.patients_icon} alt="enrollments_icon" className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-50">
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className="text-sm text-slate-400">Total Enrollments</p>
            </div>
          </div>

          {/* Total Courses */}
          <div className="flex items-center gap-4 rounded-xl border h-32 px-6
                          bg-slate-900/80 border-slate-800 shadow-lg shadow-black/40">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
              <img src={assets.appointments_icon} alt="courses_icon" className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-50">
                {dashboardData.totalCourses}
              </p>
              <p className="text-sm text-slate-400">Total Courses</p>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="flex items-center gap-4 rounded-xl border h-32 px-6
                          bg-slate-900/80 border-slate-800 shadow-lg shadow-black/40">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20">
              <img src={assets.earning_icon} alt="earning_icon" className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-50">
                {currency} {dashboardData.totalEarnings}
              </p>
              <p className="text-sm text-slate-400">Total Earnings</p>
            </div>
          </div>
        </div>

        {/* Latest Enrollments */}
        <div className="w-full">
          <h2 className="pb-4 text-lg font-semibold text-slate-100">
            Latest Enrollments
          </h2>

          <div
            className="
              flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-xl
              border bg-slate-900/85 border-slate-800
              shadow-xl shadow-black/50
            "
          >
            <table className="table-fixed md:table-auto w-full overflow-hidden">
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
                </tr>
              </thead>

              <tbody className="text-sm text-slate-300">
                {dashboardData.enrolledStudentsData.map((item, index) => (
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

                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                      <img
                        src={item.student.imageUrl}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <span className="truncate">{item.student.firstName} {item.student.lastName}</span>
                    </td>

                    <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  </tr>
                ))}

                {dashboardData.enrolledStudentsData.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-slate-500"
                    >
                      No enrollments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};
export default Dashboard;