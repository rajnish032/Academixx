// import React, { useContext } from 'react'
// import { assets } from '../../assets/assets';;
// import { Link } from 'react-router-dom';
// import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
// import { AppContext } from '../../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const Navbar = () => {

//   const { navigate , isEducator, backendUrl, setIsEducator, getToken} = useContext(AppContext);
//   const isCourseList = location.pathname.includes('/course-list');

//   const { openSignIn } = useClerk()
//   const {user} = useClerk()

//   const becomeEducator = async ()=> {
//     try {
//       if(isEducator){
//         navigate('/educator')
//         return;
//       }
//       const token = await getToken()
//       const { data } = await axios.get(backendUrl+'/api/educator/update-role',
//         {headers: {Authorization: `Bearer ${token}`}}
//       )
//       if(data.success){
//         setIsEducator(true)
//         toast.success(data.message)
//       }else{
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   return (
//   <div
//     className="flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36
//                py-4 bg-black border-b border-white/10 backdrop-blur-xl"
//   >
//     {/* Logo */}
//     <img
//       onClick={() => navigate('/')}
//       src={assets.academix_logo}
//       alt="logo"
//       className="w-28 lg:w-32 h-12 object-cover cursor-pointer"
//     />

//     {/* Desktop Menu */}
//     <div className="hidden md:flex items-center gap-6 text-gray-200">
//       <div className="flex items-center gap-6">
//         {user && (
//           <>
//             <button
//               className="cursor-pointer hover:text-cyan-400 transition"
//               onClick={becomeEducator}
//             >
//               {isEducator ? 'Educator Dashboard' : 'Become Educator'}
//             </button>

//             <Link
//               to="/my-enrollments"
//               className="hover:text-cyan-400 transition"
//             >
//               My Enrollments
//             </Link>
//           </>
//         )}
//       </div>

//       {user ? (
//         <UserButton />
//       ) : (
//         <button
//           onClick={() => openSignIn()}
//           className="bg-cyan-500 text-black px-5 py-2 rounded-full text-sm font-medium
//                      hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/30"
//         >
//           Create Account
//         </button>
//       )}
//     </div>

//     {/* Mobile Menu */}
//     <div className="md:hidden flex items-center gap-3 text-gray-200">
//       <div className="flex items-center gap-2 max-sm:text-xs">
//         {user && (
//           <>
//             <button
//               onClick={becomeEducator}
//               className="hover:text-cyan-400 transition"
//             >
//               {isEducator ? 'Educator Dashboard' : 'Become Educator'}
//             </button>

//             <Link
//               to="/my-enrollments"
//               className="hover:text-cyan-400 transition"
//             >
//               My Enrollments
//             </Link>
//           </>
//         )}
//       </div>

//       {user ? (
//         <UserButton />
//       ) : (
//         <button onClick={() => openSignIn()}>
//           <img src={assets.user_icon} alt="user" className="w-6 h-6" />
//         </button>
//       )}
//     </div>
//   </div>
// );

// }

// export default Navbar;

import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const {
    navigate,
    isEducator,
    backendUrl,
    setIsEducator,
    userData,
    setUserData,
    fetchUserData,
  } = useContext(AppContext);

  const location = useLocation();
  const isCourseList = location.pathname.includes("/course-list");

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUserData(null);
      setIsEducator(false);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const becomeEducator = async () => {
    // ✅ already educator → no API call
    if (userData?.role === "educator") {
      navigate("/educator");
      return;
    }

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/educator/update-role`,
        { withCredentials: true }
      );

      if (data.success) {
        await fetchUserData(); // refresh role
        toast.success(data.message);
        navigate("/educator");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      className="flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 
                    py-4 bg-black border-b border-white/10 backdrop-blur-xl"
    >
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.academix_logo}
        alt="logo"
        className="w-28 lg:w-32 h-12 object-cover cursor-pointer"
      />

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex items-center gap-6 text-gray-200">
        {userData && (
          <>
            <button
              onClick={becomeEducator}
              className="hover:text-cyan-400 transition"
            >
              {userData.role === "educator"
                ? "Educator Dashboard"
                : "Become Educator"}
            </button>

            <Link
              to="/my-enrollments"
              className="hover:text-cyan-400 transition"
            >
              My Enrollments
            </Link>

            {/* ✅ NAME AFTER ENROLLMENTS */}
            <p className="text-sm">
              Hi!{" "}
              <span className="font-semibold text-cyan-400">
                {userData.firstName} {userData.lastName}
              </span>
            </p>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full text-sm 
                   hover:bg-red-400 transition"
            >
              Logout
            </button>
          </>
        )}

        {!userData && (
          <button
            onClick={() => navigate("/login")}
            className="bg-cyan-500 text-black px-5 py-2 rounded-full text-sm font-medium 
                 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/30"
          >
            Login / Signup
          </button>
        )}
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden flex items-center gap-3 text-gray-200">
        {userData && (
          <>
            <Link
              to="/my-enrollments"
              className="hover:text-cyan-400 transition text-xs"
            >
              Enrollments
            </Link>

            <p className="text-xs text-cyan-400">Hi {userData.firstName}</p>
          </>
        )}

        {userData ? (
          <button onClick={handleLogout}>
            <img src={assets.user_icon} alt="logout" className="w-6 h-6" />
          </button>
        ) : (
          <button onClick={() => navigate("/login")}>
            <img src={assets.user_icon} alt="login" className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
