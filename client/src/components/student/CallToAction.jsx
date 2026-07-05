import React from 'react'
import { assets } from '../../assets/assets';


const CallToAction = () => {
  const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
  const serifBody = { fontFamily: "'Source Serif 4', Georgia, serif" };
  const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" };

  return (
    <div className="flex flex-col items-center gap-4 pt-16 pb-24 px-8 md:px-0">
      <div
        className="max-w-3xl w-full text-center px-6 md:px-12 py-12"
        style={{ background: "#FFFDF8", border: "1px solid #1D2B3A" }}
      >
        <p className="text-[10px] uppercase mb-3" style={{ ...metaSans, color: "#7A2E2E" }}>
          Enrollment Open
        </p>

        <h1 className="text-2xl md:text-4xl font-semibold" style={{ ...serifDisplay, color: "#1D2B3A" }}>
          Learn anything, anytime, anywhere
        </h1>

        <p className="mt-4 text-sm md:text-base max-w-xl mx-auto leading-relaxed" style={{ ...serifBody, color: "#6B6355" }}>
          Every course is self-paced and built by working practitioners, so you can study
          around your schedule and apply what you learn immediately.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          <button
            className="px-10 py-3 text-sm transition-colors"
            style={{ ...metaSans, textTransform: "uppercase", fontSize: "12px", background: "#7A2E2E", color: "#F8F5EE" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#5F2323")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#7A2E2E")}
          >
            Get Started
          </button>

          <button
            className="flex items-center gap-2 transition-colors"
            style={{ ...serifBody, fontWeight: 600, color: "#1D2B3A" }}
          >
            Learn More
            <img
              src={assets.arrow_icon}
              alt="arrow_icon"
              className="h-4 w-4"
              style={{ filter: "invert(15%) sepia(20%) hue-rotate(180deg)" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;

