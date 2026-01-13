import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import ProfileDrawer from "./Profile";

const Navbar = () => {
  const { backendUrl, userData, setUserData, setIsEducator } =
    useContext(AppContext);

  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

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
    } catch {
      toast.error("Logout failed");
    }
  };

  /* ================= BECOME EDUCATOR ================= */
  const becomeEducator = async () => {
    // already approved educator
    if (userData?.role === "educator") {
      navigate("/educator");
      return;
    }

    // already applied
    if (userData?.role === "pending") {
      toast.info("Application submitted. Please wait for admin approval.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/educator/update-role`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);

        // update local state (no extra API call)
        setUserData((prev) => ({
          ...prev,
          role: "pending",
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div
        className="
          relative flex items-center justify-between
          px-4 sm:px-10 md:px-14 lg:px-36 py-4
          bg-black border-b border-white/10
          backdrop-blur-xl
        "
      >
        {/* Grid background */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-[radial-gradient(circle_at_1px_1px,#1e293b_1px,transparent_0)]
            [background-size:32px_32px]
            opacity-30
          "
        />

        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          src={assets.academix_logo}
          alt="logo"
          className="relative z-10 w-28 lg:w-32 h-12 object-cover cursor-pointer"
        />

        {/* ================= DESKTOP ================= */}
        <div className="relative z-10 hidden md:flex items-center gap-6 text-gray-200">
          {userData ? (
            <>
              {/* Educator button */}
              <button
                onClick={becomeEducator}
                disabled={userData.role === "pending"}
                className={`transition ${
                  userData.role === "pending"
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:text-cyan-400"
                }`}
              >
                {userData.role === "educator"
                  ? "Educator Dashboard"
                  : userData.role === "pending"
                  ? "Request Pending"
                  : "Become Educator"}
              </button>

              {/* Enrollments */}
              <Link
                to="/my-enrollments"
                className="hover:text-cyan-400 transition"
              >
                My Enrollments
              </Link>

              {/* Name → Profile drawer */}
              <p
                onClick={() => setShowProfile(true)}
                className="text-sm cursor-pointer hover:text-cyan-300 transition"
              >
                Hi!{" "}
                <span className="font-semibold text-cyan-400">
                  {userData.firstName} {userData.lastName}
                </span>
              </p>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-red-500/90 hover:bg-red-500
                           px-4 py-2 rounded-full text-sm font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-cyan-500 text-black px-5 py-2 rounded-full
                         text-sm font-medium hover:bg-cyan-400 transition
                         shadow-lg shadow-cyan-500/30"
            >
              Login / Signup
            </button>
          )}
        </div>

        {/* ================= MOBILE ================= */}
        <div className="relative z-10 md:hidden flex items-center gap-3 text-gray-200">
          {userData && (
            <>
              <Link
                to="/my-enrollments"
                className="hover:text-cyan-400 transition text-xs"
              >
                Enrollments
              </Link>

              <p
                onClick={() => setShowProfile(true)}
                className="text-xs text-cyan-400 cursor-pointer"
              >
                Hi {userData.firstName}
              </p>
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

      {/* ================= PROFILE DRAWER ================= */}
      {showProfile && (
        <ProfileDrawer
          userData={userData}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
};

export default Navbar;
