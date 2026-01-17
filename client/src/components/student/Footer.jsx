import React from 'react'
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
        {/* Brand Section */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <img src={assets.academix_logo} alt='Academix Logo' className='h-16 object-cover'/>
          <p className='mt-6 text-center md:text-left text-sm text-white/80'>
            Academix is your one-stop platform for quality online learning, empowering educators and students with modern digital education tools.
          </p>
        </div>

        {/* Company Links */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><a href='/' className='hover:text-white transition'>Home</a></li>
            <li><a href='/about' className='hover:text-white transition'>About Us</a></li>
            <li><a href='/contact' className='hover:text-white transition'>Contact Us</a></li>
            <li><a href='/terms' className='hover:text-white transition'>Terms & Conditions</a></li>
            <li><a href='/privacy' className='hover:text-white transition'>Privacy Policy</a></li>
            <li><a href='/refund' className='hover:text-white transition'>Cancellation & Refund</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Subscribe to our newsletter</h2>
          <p className='text-sm text-white/80'>
            Get the latest courses, updates, and resources delivered to your inbox.
          </p>
          <div className='flex items-center gap-2 pt-4'>
            <input 
              type='email' 
              placeholder='Type your email'
              className='border border-gray-500/30 bg-gray-800 text-white placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm'
            />
            <button className='bg-blue-600 w-24 h-9 text-white rounded hover:bg-blue-700 transition'>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <p className='py-4 text-center text-xs md:text-sm text-white/60'>
        Copyright {new Date().getFullYear()} © AcademiX. All Rights Reserved.
      </p>
    </footer>
  )
}

export default Footer;
