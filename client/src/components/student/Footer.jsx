import React from 'react'
import { assets } from '../../assets/assets';

const Footer = () => {
  const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
  const serifBody = { fontFamily: "'Source Serif 4', Georgia, serif" };
  const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" };

  return (
    <footer className="md:px-36 text-left w-full" style={{ background: "#1D2B3A", color: "#F8F5EE" }}>
      <div
        className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-12"
        style={{ borderBottom: "1px solid rgba(169,130,61,0.3)" }}
      >
        {/* Brand Section */}
        <div className="flex flex-col md:items-start items-center w-full">
          <img
            src={assets.academix_logo}
            alt="AcademiX Logo"
            className="h-16 object-cover"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <p className="mt-6 text-center md:text-left text-sm leading-relaxed max-w-xs" style={{ ...serifBody, color: "rgba(248,245,238,0.7)" }}>
            AcademiX is an institute for applied learning — bringing rigorous
            courses and distinguished instructors to students worldwide.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="text-[11px] uppercase mb-5" style={{ ...metaSans, color: "#A9823D" }}>
            Institute
          </h2>
          <ul className="flex md:flex-col w-full justify-between text-sm md:space-y-3" style={{ ...serifBody, color: "rgba(248,245,238,0.75)" }}>
            <li><a href="/" className="transition-colors hover:text-white">Home</a></li>
            <li><a href="/about" className="transition-colors hover:text-white">About Us</a></li>
            <li><a href="/contact" className="transition-colors hover:text-white">Contact Us</a></li>
            <li><a href="/terms" className="transition-colors hover:text-white">Terms &amp; Conditions</a></li>
            <li><a href="/privacy" className="transition-colors hover:text-white">Privacy Policy</a></li>
            <li><a href="/refund" className="transition-colors hover:text-white">Cancellation &amp; Refund</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="text-[11px] uppercase mb-5" style={{ ...metaSans, color: "#A9823D" }}>
            Correspondence
          </h2>
          <p className="text-sm leading-relaxed" style={{ ...serifBody, color: "rgba(248,245,238,0.7)" }}>
            Receive course announcements and new curriculum notes by email.
          </p>
          <div className="flex items-center gap-2 pt-4">
            <input
              type="email"
              placeholder="Your email"
              className="w-64 h-10 px-3 text-sm outline-none"
              style={{
                ...serifBody,
                background: "transparent",
                border: "1px solid rgba(169,130,61,0.5)",
                color: "#F8F5EE",
              }}
            />
            <button
              className="h-10 px-5 text-[11px] uppercase transition-colors shrink-0"
              style={{ ...metaSans, background: "#7A2E2E", color: "#F8F5EE" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#5F2323")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#7A2E2E")}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <p className="py-5 text-center text-xs" style={{ ...metaSans, color: "rgba(248,245,238,0.45)" }}>
        © {new Date().getFullYear()} AcademiX. All Rights Reserved.
      </p>
    </footer>
  )
}

export default Footer;
