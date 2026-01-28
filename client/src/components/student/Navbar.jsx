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
  const [mobileMenu, setMobileMenu] = useState(false);

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
    if (userData?.role === "educator") {
      navigate("/educator");
      return;
    }

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
        setUserData((prev) => ({ ...prev, role: "pending" }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div className="relative z-40 flex items-center justify-between px-4 py-4 bg-black border-b border-white/10 backdrop-blur-xl md:px-14 lg:px-36">
        {/* background grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#1e293b_1px,transparent_0)] [background-size:32px_32px] opacity-30" />

        {/* Logo */}
        <img
          src={assets.academix_logo}
          alt="logo"
          onClick={() => navigate("/")}
          className="relative z-50 w-28 h-12 cursor-pointer object-cover"
        />

        {/* ================= DESKTOP ================= */}
        <div className="relative z-50 hidden md:flex items-center gap-6 text-gray-200">
          {userData ? (
            <>
              <button onClick={becomeEducator} className="hover:text-cyan-400">
                {userData.role === "educator"
                  ? "Educator Dashboard"
                  : "Become Educator"}
              </button>

              <Link to="/my-enrollments" className="hover:text-cyan-400">
                My Enrollments
              </Link>

              <span
                onClick={() => setShowProfile(true)}
                className="cursor-pointer text-cyan-400"
              >
                Hi {userData.firstName}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-full text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-cyan-500 px-5 py-2 rounded-full text-black"
            >
              Login / Signup
            </button>
          )}
        </div>

        {/* ================= MOBILE HAMBURGER ================= */}
        <button
          type="button"
          onClick={() => setMobileMenu(true)}
          className="relative z-50 md:hidden"
        >
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
          </div>
        </button>
      </div>

      {/* ================= MOBILE MENU (FIXED) ================= */}
      {mobileMenu && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setMobileMenu(false)}
          />

          {/* menu */}
          <div className="fixed top-16 right-4 w-64 bg-black border border-white/10 rounded-xl z-50 text-gray-200 shadow-xl">
            {userData ? (
              <>
                <div className="px-4 py-3 border-b border-white/10 text-cyan-400">
                  Hi {userData.firstName}
                </div>

                <button
  onClick={() => {
    if (userData.role === "educator") {
      navigate("/educator");
    } else {
      becomeEducator();
    }
    setMobileMenu(false);
  }}
  disabled={userData.role === "pending"}
  className={`w-full px-4 py-2 text-left transition ${
    userData.role === "pending"
      ? "text-gray-400 cursor-not-allowed"
      : "hover:bg-white/5"
  }`}
>
  {userData.role === "educator"
    ? "Educator Dashboard"
    : userData.role === "pending"
    ? "Request Pending"
    : "Become Educator"}
</button>


                <Link
                  to="/my-enrollments"
                  onClick={() => setMobileMenu(false)}
                  className="block px-4 py-2 hover:bg-white/5"
                >
                  My Enrollments
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/5"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileMenu(false);
                }}
                className="w-full px-4 py-3 hover:bg-white/5"
              >
                Login / Signup
              </button>
            )}
          </div>
        </>
      )}

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
