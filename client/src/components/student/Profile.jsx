import React from "react";
import { assets } from "../../assets/assets";
import Loading from "./Loading";

const ProfileDrawer = ({ userData, onClose }) => {
  return  userData ? (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="
          fixed top-0 right-0 z-50 h-full w-full sm:w-[380px]
          bg-black text-white
          border-l border-white/10
          shadow-2xl
          overflow-hidden
        "
      >
        {/* 🔹 Grid background */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-[radial-gradient(circle_at_1px_1px,#1e293b_1px,transparent_0)]
            [background-size:24px_24px]
            opacity-40
          "
        />

        {/* 🔹 Glow */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 
                        rounded-full bg-cyan-500/25 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-100">
              My Profile
            </h2>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xl transition"
            >
              ✕
            </button>
          </div>

          {/* Profile Card */}
          <div
            className="
              rounded-xl border border-white/10
              bg-white/5 backdrop-blur-lg
              p-5 space-y-4
              shadow-xl shadow-black/40
            "
          >
            <div>
              <p className="text-xs text-slate-400">First Name</p>
              <p className="text-base">{userData.firstName}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Last Name</p>
              <p className="text-base">{userData.lastName}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-base break-all">
                {userData.emailId}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Role</p>
              <p className="text-base capitalize text-cyan-400 font-medium">
                {userData.role}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-6 text-xs text-slate-500">
            Academix © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loading/>
  );
};

export default ProfileDrawer;

