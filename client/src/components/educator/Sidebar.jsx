import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_icon },
    { name: "Add Course", path: "/educator/add-course", icon: assets.add_icon },
    { name: "My Courses", path: "/educator/my-courses", icon: assets.my_course_icon },
    {
      name: "Student Enrolled",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
    },
  ];

  return (
    <div
      className="
        md:w-64 w-16 
        min-h-full 
        py-4 
        flex flex-col
        text-slate-100
      "
    >
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          end={item.path === "/educator"}
          className={({ isActive }) =>
            [
              "flex items-center md:flex-row flex-col md:justify-start justify-center gap-3",
              "py-3.5 md:px-8 transition-all duration-150",
              "border-l-4",
              isActive
                ? "bg-slate-900/80 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                : "border-transparent hover:bg-slate-900/60 hover:border-slate-700 text-slate-300 hover:text-cyan-200",
            ].join(" ")
          }
        >
          <img src={item.icon} alt="icon" className="w-5 h-5 opacity-90" />
          <p className="md:block hidden text-sm md:text-base">
            {item.name}
          </p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;

