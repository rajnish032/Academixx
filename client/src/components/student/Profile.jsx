import React from "react";
import { assets } from "../../assets/assets";
import Loading from "./Loading";

const ProfileDrawer = ({ userData, onClose }) => {
  const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
  const serifBody = { fontFamily: "'Source Serif 4', Georgia, serif" };
  const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" };

  return userData ? (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(29,43,58,0.5)" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-full sm:w-[380px] overflow-hidden"
        style={{ background: "#F8F5EE", color: "#211F1B", borderLeft: "1px solid #1D2B3A" }}
      >
        {/* Faint rule grid, consistent with rest of site */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "linear-gradient(#A9823D18 1px, transparent 1px), linear-gradient(90deg, #A9823D18 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-2 pb-4" style={{ borderBottom: "1px solid #A9823D40" }}>
            <div>
              <p className="text-[10px] uppercase mb-1" style={{ ...metaSans, color: "#7A2E2E" }}>
                Student Record
              </p>
              <h2 className="text-lg font-semibold" style={{ ...serifDisplay, color: "#1D2B3A" }}>
                My Profile
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-xl transition-colors leading-none"
              style={{ color: "#6B6355" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#7A2E2E")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B6355")}
            >
              ✕
            </button>
          </div>

          {/* Profile Card — ledger rows, not a floating card */}
          <div className="mt-6">
            <div className="py-4" style={{ borderBottom: "1px solid #A9823D30" }}>
              <p className="text-[10px] uppercase mb-1" style={{ ...metaSans, color: "#6B6355" }}>
                First Name
              </p>
              <p className="text-base" style={{ ...serifBody, color: "#211F1B" }}>
                {userData.firstName}
              </p>
            </div>

            <div className="py-4" style={{ borderBottom: "1px solid #A9823D30" }}>
              <p className="text-[10px] uppercase mb-1" style={{ ...metaSans, color: "#6B6355" }}>
                Last Name
              </p>
              <p className="text-base" style={{ ...serifBody, color: "#211F1B" }}>
                {userData.lastName}
              </p>
            </div>

            <div className="py-4" style={{ borderBottom: "1px solid #A9823D30" }}>
              <p className="text-[10px] uppercase mb-1" style={{ ...metaSans, color: "#6B6355" }}>
                Email
              </p>
              <p className="text-base break-all" style={{ ...serifBody, color: "#211F1B" }}>
                {userData.emailId}
              </p>
            </div>

            <div className="py-4" style={{ borderBottom: "1px solid #A9823D30" }}>
              <p className="text-[10px] uppercase mb-1" style={{ ...metaSans, color: "#6B6355" }}>
                Role
              </p>
              <p className="text-base capitalize" style={{ ...serifDisplay, fontWeight: 600, color: "#7A2E2E" }}>
                {userData.role}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-6 text-[11px]" style={{ ...metaSans, color: "#A39A88" }}>
            AcademiX © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ProfileDrawer;

