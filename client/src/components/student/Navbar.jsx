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

  const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
  const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.06em" };

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
      {/* ================= NAVBAR (fixed) ================= */}
      <div
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-4 md:px-14 lg:px-36"
        style={{ background: "#F8F5EE", borderBottom: "1px solid #1D2B3A" }}
      >
        {/* Logo */}
        <img
          src={assets.academix_logo}
          alt="logo"
          onClick={() => navigate("/")}
          className="relative z-50 w-28 h-12 cursor-pointer object-cover"
          style={{ filter: "invert(15%) sepia(20%) hue-rotate(180deg)" }}
        />

        {/* ================= DESKTOP ================= */}
        <div className="relative z-50 hidden md:flex items-center gap-7">
          {userData ? (
            <>
              <Link
                to="/feed"
                className="text-sm transition-colors"
                style={{ ...metaSans, color: "#1D2B3A" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7A2E2E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1D2B3A")}
              >
                Share Your Learning
              </Link>

              <button
                onClick={becomeEducator}
                className="text-sm transition-colors"
                style={{ ...metaSans, color: "#1D2B3A" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7A2E2E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1D2B3A")}
              >
                {userData.role === "educator"
                  ? "Educator Dashboard"
                  : "Become Educator"}
              </button>

              <Link
                to="/my-enrollments"
                className="text-sm transition-colors"
                style={{ ...metaSans, color: "#1D2B3A" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7A2E2E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1D2B3A")}
              >
                My Enrollments
              </Link>

              <span
                onClick={() => setShowProfile(true)}
                className="cursor-pointer text-sm"
                style={{ ...serifDisplay, fontWeight: 600, color: "#7A2E2E" }}
              >
                Hi, {userData.firstName}
              </span>

              <button
                onClick={handleLogout}
                className="px-4 py-1.5 text-[11px] uppercase transition-colors"
                style={{ ...metaSans, color: "#7A2E2E", border: "1px solid #7A2E2E" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#7A2E2E";
                  e.currentTarget.style.color = "#F8F5EE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#7A2E2E";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 text-[11px] uppercase"
              style={{ ...metaSans, background: "#7A2E2E", color: "#F8F5EE" }}
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
          <div className="space-y-1.5">
            <span className="block w-6 h-[1.5px]" style={{ background: "#1D2B3A" }} />
            <span className="block w-6 h-[1.5px]" style={{ background: "#1D2B3A" }} />
            <span className="block w-6 h-[1.5px]" style={{ background: "#1D2B3A" }} />
          </div>
        </button>
      </div>

      {/* Spacer so content doesn't sit under the fixed navbar */}
      <div className="h-[72px] md:h-[80px]" />

      {/* ================= MOBILE MENU ================= */}
      {mobileMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(29,43,58,0.5)" }}
            onClick={() => setMobileMenu(false)}
          />

          <div
            className="fixed top-16 right-4 w-64 z-50"
            style={{ background: "#FFFDF8", border: "1px solid #1D2B3A" }}
          >
            {userData ? (
              <>
                <div
                  className="px-4 py-3 text-sm"
                  style={{ ...serifDisplay, fontWeight: 600, color: "#7A2E2E", borderBottom: "1px solid #A9823D30" }}
                >
                  Hi, {userData.firstName}
                </div>

                <Link
                  to="/feed"
                  onClick={() => setMobileMenu(false)}
                  className="block px-4 py-3 text-sm"
                  style={{ ...metaSans, fontSize: "13px", color: "#1D2B3A", borderBottom: "1px solid #A9823D30" }}
                >
                  Share Your Learning
                </Link>

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
                  className="w-full px-4 py-3 text-left text-sm transition-colors"
                  style={{
                    ...metaSans,
                    fontSize: "13px",
                    color: userData.role === "pending" ? "#A39A88" : "#1D2B3A",
                    cursor: userData.role === "pending" ? "not-allowed" : "pointer",
                    borderBottom: "1px solid #A9823D30",
                  }}
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
                  className="block px-4 py-3 text-sm"
                  style={{ ...metaSans, fontSize: "13px", color: "#1D2B3A", borderBottom: "1px solid #A9823D30" }}
                >
                  My Enrollments
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm"
                  style={{ ...metaSans, fontSize: "13px", color: "#7A2E2E" }}
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
                className="w-full px-4 py-3 text-sm"
                style={{ ...metaSans, fontSize: "13px", color: "#1D2B3A" }}
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