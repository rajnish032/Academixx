import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 text-white overflow-hidden">

      {/* ✅ Animated Grid Background */}
      <div
        className="
          pointer-events-none absolute inset-0 
          bg-[radial-gradient(circle_at_1px_1px,#1e293b_1px,transparent_0)]
          [background-size:32px_32px]
          opacity-40
          animate-pulse
        "
      />

      {/* ✅ Glow Blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-72 w-72 rounded-full bg-indigo-500 opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-cyan-500 opacity-30 blur-3xl" />

      {/* ✅ Spinner */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div
          className="
            w-16 sm:w-20 aspect-square 
            border-4 border-slate-700 
            border-t-4 border-t-cyan-400 
            rounded-full animate-spin
            shadow-lg shadow-cyan-500/30
          "
        />
        <p className="text-sm text-slate-300 tracking-wide">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default Loading;

