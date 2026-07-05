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
  <div className="relative h-full overflow-y-auto flex flex-col items-start gap-8 p-4 md:p-12 lg:p-16 w-full bg-paper text-ink">
    <div className="space-y-10 w-full relative z-10">
      {/* Top stats — ledger entries, not floating cards */}
      <div className="grid w-full gap-0 grid-cols-1 sm:grid-cols-3 ">
        {/* Total Enrollments */}
<div className="flex items-center gap-4 px-6 py-6 bg-paper-alt">
  <div className="w-12 h-12 flex items-center justify-center shrink-0">
    <img src={assets.patients_icon} alt="enrollments_icon" className="w-6 h-6" />
  </div>
  <div>
    <p className="font-display font-semibold text-3xl text-navy">
      {dashboardData.enrolledStudentsData.length}
    </p>
    <p className="font-meta text-[11px] uppercase text-muted mt-1">
      Total Enrollments
    </p>
  </div>
</div>

{/* Total Courses */}
<div className="flex items-center gap-4 px-6 py-6 bg-paper-alt">
  <div className="w-12 h-12 flex items-center justify-center shrink-0">
    <img src={assets.appointments_icon} alt="courses_icon" className="w-6 h-6" />
  </div>
  <div>
    <p className="font-display font-semibold text-3xl text-navy">
      {dashboardData.totalCourses}
    </p>
    <p className="font-meta text-[11px] uppercase text-muted mt-1">
      Total Courses
    </p>
  </div>
</div>

{/* Total Earnings */}
<div className="flex items-center gap-4 px-6 py-6 bg-paper-alt">
  <div className="w-12 h-12 flex items-center justify-center shrink-0">
    <img src={assets.earning_icon} alt="earning_icon" className="w-6 h-6" />
  </div>
  <div>
    <p className="font-display font-semibold text-3xl text-oxblood">
      {currency} {dashboardData.totalEarnings}
    </p>
    <p className="font-meta text-[11px] uppercase text-muted mt-1">
      Total Earnings
    </p>
  </div>
</div>
      </div>

      {/* Latest Enrollments */}
      {/* Latest Enrollments */}
<div className="w-full">
  <p className="font-meta text-[10px] uppercase mb-2 text-oxblood">
    Recent Activity
  </p>
  <h2 className="font-display font-semibold text-xl text-navy pb-5">
    Latest Enrollments
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
        </tr>
      </thead>

      <tbody className="font-body text-sm">
        {dashboardData.enrolledStudentsData.map((item, index) => (
          <tr key={index} className="border-b border-brass/30 last:border-0">
            <td className="px-4 py-3 text-center hidden sm:table-cell text-faint">
              {index + 1}
            </td>

            <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
              <img
  src={item.student.imageUrl || assets.profile}
  alt="Profile"
  className="w-9 h-9 object-cover border border-brass/60"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = assets.profile_img;
  }}
/>
              <span className="truncate text-ink">
                {item.student.firstName} {item.student.lastName}
              </span>
            </td>

            <td className="px-4 py-3 truncate text-ink">{item.courseTitle}</td>
          </tr>
        ))}

        {dashboardData.enrolledStudentsData.length === 0 && (
          <tr>
            <td colSpan={3} className="px-4 py-8 text-center text-muted font-body">
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