import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const { userData, backendUrl, setUserData, setIsEducator, navigate } =
    useContext(AppContext);

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      setUserData(null);
      setIsEducator(false);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-10 py-3 bg-paper border-b border-navy text-ink">
      <Link to="/">
        <img
          src={assets.academix_logo}
          alt="logo"
          className="w-28 lg:w-32 h-12 object-contain cursor-pointer brightness-0 invert-[0.15] sepia hue-rotate-180"
        />
      </Link>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="font-meta text-[9px] uppercase text-oxblood leading-none mb-1">
            Faculty
          </p>
          <p className="font-body text-sm text-navy">
            {userData ? `${userData.firstName} ${userData.lastName}` : "Educator"}
          </p>
        </div>

        {userData ? (
          <button
            onClick={handleLogout}
            className="font-meta px-4 py-1.5 text-[11px] uppercase border border-oxblood text-oxblood hover:bg-oxblood hover:text-paper transition-colors"
          >
            Logout
          </button>
        ) : (
          <img
            className="w-9 h-9 object-cover border border-brass/60"
            src={assets.profile_img}
            alt="profile"
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;

