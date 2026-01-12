import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/educator/Navbar";
import Sidebar from "../../components/educator/Sidebar";
import Footer from "../../components/educator/Footer";

const Educator = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Animated grid background */}
      <div
        className="
          pointer-events-none absolute inset-0 
          bg-[radial-gradient(circle_at_1px_1px,#1e293b_1px,transparent_0)]
          [background-size:32px_32px]
          opacity-40
          animate-pulse
        "
      />

      {/* Glowing gradient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-72 w-72 rounded-full bg-indigo-500 opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-72 w-72 rounded-full bg-cyan-500 opacity-30 blur-3xl" />

      {/* Main layout */}
      <div className="relative flex min-h-screen flex-col">
        <Navbar />

        <div className="flex flex-1">
          <div className="border-r border-slate-800/60 bg-slate-900/40 backdrop-blur-md">
            <Sidebar />
          </div>

          <main className="flex-1 p-4 md:p-6">
            <div className="h-full rounded-2xl border border-slate-800/60 bg-slate-900/70 shadow-xl shadow-black/40 backdrop-blur-md">
              <Outlet />
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Educator;




