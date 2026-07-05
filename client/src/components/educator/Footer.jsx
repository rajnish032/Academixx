import React from 'react'
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between w-full px-8 py-4 border-t border-brass/30 bg-navy text-paper/80">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <img
          className="hidden md:block w-20 brightness-0 invert"
          src={assets.academix_logo}
          alt="logo"
        />

        <div className="hidden md:block h-7 w-px bg-brass/30" />

        <p className="font-meta py-2 text-center text-xs text-paper/50">
          © {new Date().getFullYear()} AcademiX. All Rights Reserved.
        </p>
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-5 mb-3 md:mb-0">
        <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">
          <img
            src={assets.facebook_icon}
            alt="facebook_icon"
            className="w-4 h-4 brightness-0 invert"
          />
        </a>

        <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">
          <img
            src={assets.twitter_icon}
            alt="twitter_icon"
            className="w-4 h-4 brightness-0 invert"
          />
        </a>

        <a href="#" className="opacity-70 hover:opacity-100 transition-opacity">
          <img
            src={assets.instagram_icon}
            alt="instagram_icon"
            className="w-4 h-4 brightness-0 invert"
          />
        </a>
      </div>
    </footer>
  );
};
export default Footer;

