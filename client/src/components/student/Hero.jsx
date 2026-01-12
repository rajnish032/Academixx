import React from 'react'
import { assets } from '../../assets/assets';
import SearchBar from './SearchBar';

const Hero = () => {
  return (
    <div className='relative flex flex-col items-center justify-center w-full md:pt-36 pt-24 px-7 md:px-0 space-y-7 text-center text-white'>

      {/* 🔹 Glow Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/20 blur-3xl rounded-full -z-10" />

      <h1 className='relative font-bold max-w-3xl mx-auto text-3xl md:text-6xl leading-tight'>
        Improve your Future with the courses designed to 
        <span className='text-cyan-400'> fit your choice.</span> 
        <img
          src={assets.sketch}
          alt='sketch'
          className='md:block hidden absolute -bottom-7 right-0 opacity-80'
        />
      </h1>

      <p className='md:block hidden text-gray-300 max-w-2xl mx-auto text-base'>
        We bring together world-class instructor, interactive content, supportive community to help you achieve your personal and professional goals.
      </p>

      <p className='md:hidden text-gray-400 max-w-sm mx-auto text-base'>
        We bring together world-class instructor, to help you achieve your professional goals
      </p>

      <SearchBar />
    </div>
  )
}

export default Hero;


