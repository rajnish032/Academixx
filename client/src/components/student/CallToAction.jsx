import React from 'react'
import { assets } from '../../assets/assets';

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center gap-4 pt-16 pb-24 px-8 md:px-0">
      <div className="max-w-3xl w-full text-center bg-white/5 border border-white/10 rounded-2xl px-6 md:px-10 py-10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">

        <h1 className="text-2xl md:text-4xl text-white font-semibold">
          Learn anything, anytime, anywhere
        </h1>

        <p className="text-gray-300 sm:text-sm mt-4">
          Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam aliqua
          proident excepteur commodo do ea.
        </p>

        <div className="flex flex-wrap items-center justify-center font-medium gap-4 mt-6">
          <button className="px-10 py-3 rounded-md text-white bg-cyan-500 hover:bg-cyan-600 transition shadow-lg shadow-cyan-500/30">
            Get Started
          </button>

          <button className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition">
            Learn More
            <img src={assets.arrow_icon} alt="arrow_icon" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CallToAction;

