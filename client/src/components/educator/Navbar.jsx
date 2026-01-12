// import React from 'react'
// import { assets } from '../../assets/assets';
// import { UserButton, useUser } from '@clerk/clerk-react'
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   const { user } = useUser();

//   return (
//     <div className="
//       flex items-center justify-between 
//       px-4 md:px-10 py-3
//       bg-slate-900/70 border-b border-slate-800/60
//       backdrop-blur-xl
//       text-slate-100
//     ">
//       <Link to="/">
//         <img
//           src={assets.academix_logo}
//           alt="logo"
//           className="w-28 lg:w-32 h-12 object-contain cursor-pointer"
//         />
//       </Link>

//       <div className="flex items-center gap-4 text-slate-200">
//         <p className="text-sm md:text-base">
//           Hi!{" "}
//           <span className="font-semibold text-cyan-400">
//             {user ? user.fullName : "Developer"}
//           </span>
//         </p>

//         {user ? (
//           <UserButton />
//         ) : (
//           <img
//             className="w-9 h-9 rounded-full border border-slate-600 object-cover"
//             src={assets.profile_img}
//             alt="profile"
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const { userData, backendUrl, setUserData, setIsEducator, navigate } =
    useContext(AppContext);

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

  return (
    <div
      className="
        flex items-center justify-between 
        px-4 md:px-10 py-3
        bg-slate-900/70 border-b border-slate-800/60
        backdrop-blur-xl
        text-slate-100
      "
    >
      {/* Logo */}
      <Link to="/educator">
        <img
          src={assets.academix_logo}
          alt="logo"
          className="w-28 lg:w-32 h-12 object-contain cursor-pointer"
        />
      </Link>

      {/* Right section */}
      <div className="flex items-center gap-4 text-slate-200">
        <p className="text-sm md:text-base">
          Hi!{" "}
          <span className="font-semibold text-cyan-400">
            {userData
              ? `${userData.firstName} ${userData.lastName}`
              : "Educator"}
          </span>
        </p>

        {userData ? (
          <button
            onClick={handleLogout}
            className="bg-red-500/90 hover:bg-red-500 
                       px-4 py-2 rounded-full text-sm font-medium
                       transition"
          >
            Logout
          </button>
        ) : (
          <img
            className="w-9 h-9 rounded-full border border-slate-600 object-cover"
            src={assets.profile_img}
            alt="profile"
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;

