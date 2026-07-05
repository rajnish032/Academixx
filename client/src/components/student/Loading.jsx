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

  const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
  const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.15em" };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#F8F5EE", color: "#211F1B" }}
    >
      {/* Faint rule grid, consistent with rest of site */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "linear-gradient(#A9823D18 1px, transparent 1px), linear-gradient(90deg, #A9823D18 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <p className="text-2xl" style={{ ...serifDisplay, fontWeight: 600, color: "#1D2B3A" }}>
          AcademiX
        </p>

        {/* Animated ink underline */}
        <div className="w-40 h-[2px] overflow-hidden" style={{ background: "#A9823D30" }}>
          <div
            className="h-full"
            style={{
              width: "40%",
              background: "#7A2E2E",
              animation: "loadingBar 1.2s ease-in-out infinite",
            }}
          />
        </div>

        <p className="text-[11px] uppercase" style={{ ...metaSans, color: "#6B6355" }}>
          Preparing your page
        </p>
      </div>

      <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Loading;

