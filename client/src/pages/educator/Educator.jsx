import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/educator/Navbar";
import Sidebar from "../../components/educator/Sidebar";
import Footer from "../../components/educator/Footer";

const Educator = () => {
  return (
    <div className="relative min-h-screen bg-paper text-ink">
      {/* Rule grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(169,130,61,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(169,130,61,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <Navbar />

      <div className="flex pt-[72px]">
        <Sidebar />

        <main className="flex-1 md:ml-64 ml-16 p-4 md:p-8">
          
            <Outlet />
          
        </main>
      </div>

      <div className="md:ml-64 ml-16">
        <Footer />
      </div>
    </div>
  );
};

export default Educator;
