import React from 'react'
import { assets } from '../../assets/assets';

const Companies = () => {
  const logos = [
    { src: assets.microsoft_logo, alt: "Microsoft" },
    { src: assets.walmart_logo, alt: "Walmart" },
    { src: assets.accenture_logo, alt: "Accenture" },
    { src: assets.paypal_logo, alt: "Paypal" },
    { src: assets.adobe_logo, alt: "Adobe" },
  ];

  return (
    <div className="pt-16 pb-16 text-center" style={{ background: "#F8F5EE", fontFamily: "'Source Serif 4', Georgia, serif" }}>
      <p className="text-sm uppercase" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.12em", color: "#7A2E2E" }}>
        Trusted by Learners From
      </p>

      {/* Constrained width — matches rest of site content */}
      <div className="relative mt-8 md:mt-12 max-w-5xl mx-auto px-8 overflow-hidden">
        {/* Fade edges */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-16 md:w-24 z-10"
          style={{ background: "linear-gradient(to right, #F8F5EE, transparent)" }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-16 md:w-24 z-10"
          style={{ background: "linear-gradient(to left, #F8F5EE, transparent)" }}
        />

        <div className="marquee-track flex items-center gap-16 md:gap-24">
          {[...logos, ...logos].map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              className="w-20 md:w-28 shrink-0 logo-hover"
              style={{ filter: "contrast(0.9) brightness(0.85)", opacity: 0.75 }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .marquee-track {
          width: max-content;
          animation: marqueeScroll 22s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .logo-hover {
          transition: filter 0.3s ease, opacity 0.3s ease;
        }
        .logo-hover:hover {
          filter: contrast(1) brightness(1) !important;
          opacity: 1 !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default Companies;