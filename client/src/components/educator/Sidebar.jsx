import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_icon },
    { name: "Add Course", path: "/educator/add-course", icon: assets.add_icon },
    { name: "My Courses", path: "/educator/my-courses", icon: assets.my_course_icon },
    { name: "Student Enrolled", path: "/educator/student-enrolled", icon: assets.person_tick_icon },
  ];

  return (
    <div className="fixed top-[72px] left-0 z-40 md:w-64 w-16 h-[calc(100vh-72px)] overflow-y-auto hide-scrollbar py-4 flex flex-col bg-paper-alt border-r border-navy">
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          end={item.path === "/educator"}
          className={({ isActive }) =>
            [
              "flex items-center md:flex-row flex-col md:justify-start justify-center gap-3",
              "py-3.5 md:px-8 transition-colors duration-150 border-l-4 font-meta text-[13px]",
              isActive
                ? "bg-paper border-oxblood text-oxblood"
                : "border-transparent text-navy hover:bg-paper hover:border-brass/50",
            ].join(" ")
          }
        >
          <img
            src={item.icon}
            alt="icon"
            className="w-5 h-5 brightness-0 invert-[0.15] sepia hue-rotate-180 opacity-80"
          />
          <p className="md:block hidden">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;

