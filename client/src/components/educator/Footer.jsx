import React from 'react'
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer
      className="
        flex md:flex-row flex-col-reverse items-center justify-between
        w-full px-8 py-4
        border-t border-slate-800/60
        bg-slate-900/60 backdrop-blur-xl
        text-slate-300
      "
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <img
          className="hidden md:block w-20 opacity-90"
          src={assets.academix_logo}
          alt="logo"
        />

        <div className="hidden md:block h-7 w-px bg-slate-600/60" />

        <p className="py-2 text-center text-xs md:text-sm text-slate-400">
          Copyright 2025 © AcademiX. All Rights Reserved.
        </p>
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-4 mb-3 md:mb-0">
        <a href="#" className="hover:scale-110 transition">
          <img
            src={assets.facebook_icon}
            alt="facebook_icon"
            className="opacity-80 hover:opacity-100"
          />
        </a>

        <a href="#" className="hover:scale-110 transition">
          <img
            src={assets.twitter_icon}
            alt="twitter_icon"
            className="opacity-80 hover:opacity-100"
          />
        </a>

        <a href="#" className="hover:scale-110 transition">
          <img
            src={assets.instagram_icon}
            alt="instagram_icon"
            className="opacity-80 hover:opacity-100"
          />
        </a>
      </div>
    </footer>
  )
}

export default Footer;

