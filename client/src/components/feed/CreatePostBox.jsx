import React from "react";
import { FaVideo } from "react-icons/fa6";
import { FaFileImage } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";
import { assets } from "../../assets/assets";
export default function CreatePostBox({ currentUser, openModal }) {
  return (
  <div className="bg-paper-alt border border-navy p-6 w-full  max-w-[540px] mx-auto">
    <div className="flex items-center space-x-3">
      <img
        src={currentUser?.avatar || assets.profile}
        className="w-12 h-12 object-cover border border-brass/50"
        alt="avatar"
      />

      <div
        onClick={openModal}
        className="font-body flex-1 bg-paper text-muted border border-brass/50 px-4 py-2.5 cursor-pointer outline-none hover:border-oxblood transition-colors"
      >
        Start a post
      </div>
    </div>

    <div className="flex justify-around mt-4 pt-3 border-t border-brass/30">
      <button
        onClick={openModal}
        className="flex items-center gap-2 font-meta text-[11px] uppercase text-navy px-3 py-2 hover:text-oxblood transition-colors"
      >
        <FaVideo className="text-green-600" /> Video
      </button>
      <button
        onClick={openModal}
        className="flex items-center gap-2 font-meta text-[11px] uppercase text-navy px-3 py-2 hover:text-oxblood transition-colors"
      >
        <FaFileImage className="text-blue-600" /> Photo
      </button>
      <button
        onClick={openModal}
        className="flex items-center gap-2 font-meta text-[11px] uppercase text-navy px-3 py-2 hover:text-oxblood transition-colors"
      >
        <FaFilePdf className="text-red-500" /> PDF
      </button>
    </div>
  </div>
);
}