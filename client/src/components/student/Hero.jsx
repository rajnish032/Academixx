// import React from 'react'
// import { assets } from '../../assets/assets';
// import SearchBar from './SearchBar';

// const Hero = () => {
//   return (
//   <div className="relative flex flex-col items-center justify-center w-full md:pt-36 pt-24 px-7 md:px-0 space-y-7 text-center" style={{ background: "#F8F5EE", color: "#211F1B" }}>
//     {(() => {
//       const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
//       const serifBody = { fontFamily: "'Source Serif 4', Georgia, serif" };
//       const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" };

//       return (
//         <>
//           {/* Faint rule grid instead of glow — consistent with rest of the site */}
//           <div
//             className="pointer-events-none absolute inset-0 opacity-[0.3] -z-10"
//             style={{
//               backgroundImage:
//                 "linear-gradient(#A9823D18 1px, transparent 1px), linear-gradient(90deg, #A9823D18 1px, transparent 1px)",
//               backgroundSize: "40px 40px",
//             }}
//           />

//           <p className="text-[11px] uppercase" style={{ ...metaSans, color: "#7A2E2E" }}>
//             An Institute for Applied Learning
//           </p>

//           <h1
//             className="relative font-semibold max-w-3xl mx-auto text-3xl md:text-6xl leading-[1.15]"
//             style={{ ...serifDisplay, color: "#1D2B3A" }}
//           >
//             Shape your future with courses built to
//             <span style={{ color: "#7A2E2E" }}> your ambition.</span>
//             <svg
//               className="md:block hidden absolute -bottom-6 right-0"
//               width="140"
//               height="20"
//               viewBox="0 0 140 20"
//               fill="none"
//             >
//               <path
//                 d="M2 14C30 4 60 18 90 8C105 3 120 6 138 12"
//                 stroke="#A9823D"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//               />
//             </svg>
//           </h1>

//           <p
//             className="md:block hidden max-w-2xl mx-auto text-base leading-relaxed"
//             style={{ ...serifBody, color: "#3A3630" }}
//           >
//             We bring together distinguished instructors, rigorous content, and a community of
//             learners committed to helping you reach your personal and professional goals.
//           </p>

//           <p
//             className="md:hidden max-w-sm mx-auto text-base leading-relaxed"
//             style={{ ...serifBody, color: "#6B6355" }}
//           >
//             Distinguished instructors, rigorous content — built to help you reach your goals.
//           </p>

//           <SearchBar />
//         </>
//       );
//     })()}
//   </div>
// );
// }

// export default Hero;


import React from 'react'
import { assets } from '../../assets/assets';
import SearchBar from './SearchBar';

const Hero = () => {
  const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
  const serifBody = { fontFamily: "'Source Serif 4', Georgia, serif" };
  const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" };

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full md:pt-36 pt-24 px-7 md:px-0 space-y-7 text-center overflow-hidden"
      style={{ background: "#F8F5EE", color: "#211F1B" }}
    >
      {/* Faint rule grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3] -z-10"
        style={{
          backgroundImage:
            "linear-gradient(#A9823D18 1px, transparent 1px), linear-gradient(90deg, #A9823D18 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Drifting ink specks — very subtle */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
        <span className="ink-dot" style={{ top: "18%", left: "12%", animationDelay: "0s" }} />
        <span className="ink-dot" style={{ top: "62%", left: "8%", animationDelay: "2s" }} />
        <span className="ink-dot" style={{ top: "28%", left: "88%", animationDelay: "1s" }} />
        <span className="ink-dot" style={{ top: "70%", left: "90%", animationDelay: "3s" }} />
      </div>

      <p
        className="text-[11px] uppercase fade-up"
        style={{ ...metaSans, color: "#7A2E2E", animationDelay: "0.05s" }}
      >
        An Institute for Applied Learning
      </p>

      <h1
        className="relative font-semibold max-w-3xl mx-auto text-3xl md:text-6xl leading-[1.15] fade-up"
        style={{ ...serifDisplay, color: "#1D2B3A", animationDelay: "0.2s" }}
      >
        Shape your future with courses built to
        <span style={{ color: "#7A2E2E" }}> your ambition.</span>
        <svg
          className="md:block hidden absolute -bottom-6 right-0"
          width="140"
          height="20"
          viewBox="0 0 140 20"
          fill="none"
        >
          <path
            d="M2 14C30 4 60 18 90 8C105 3 120 6 138 12"
            stroke="#A9823D"
            strokeWidth="2"
            strokeLinecap="round"
            className="draw-line"
          />
        </svg>
      </h1>

      <p
        className="md:block hidden max-w-2xl mx-auto text-base leading-relaxed fade-up"
        style={{ ...serifBody, color: "#3A3630", animationDelay: "0.35s" }}
      >
        We bring together distinguished instructors, rigorous content, and a community of
        learners committed to helping you reach your personal and professional goals.
      </p>

      <p
        className="md:hidden max-w-sm mx-auto text-base leading-relaxed fade-up"
        style={{ ...serifBody, color: "#6B6355", animationDelay: "0.35s" }}
      >
        Distinguished instructors, rigorous content — built to help you reach your goals.
      </p>

      <div className="fade-up" style={{ animationDelay: "0.5s" }}>
        <SearchBar />
      </div>

      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.7s ease-out forwards;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .draw-line {
          stroke-dasharray: 160;
          stroke-dashoffset: 160;
          animation: drawLine 1s ease-out forwards;
          animation-delay: 0.9s;
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }

        .ink-dot {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #A9823D;
          opacity: 0.25;
          animation: drift 8s ease-in-out infinite;
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); opacity: 0.15; }
          50% { transform: translate(12px, -18px); opacity: 0.35; }
        }

        @media (prefers-reduced-motion: reduce) {
          .fade-up, .draw-line, .ink-dot { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Hero;