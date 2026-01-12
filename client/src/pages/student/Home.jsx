import React from 'react'
import Hero from '../../components/student/Hero';
import Companies from '../../components/student/Companies';
import CoursesSection from '../../components/student/CoursesSection';
import TestimonialSection from '../../components/student/TestimonialSection';
import CallToAction from '../../components/student/CallToAction';
import Footer from '../../components/student/Footer.jsx'

const Home = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      
      {/* 🔹 Animated Grid Background */}
      <div className="absolute inset-0 animated-grid opacity-30" />

      {/* 🔹 Page Content */}
      <div className="relative z-10 flex flex-col items-center space-y-7 text-center">
        <Hero />
        <Companies />
        <CoursesSection />
        <TestimonialSection />
        <CallToAction />
        <Footer />
      </div>

    </div>
  )
}

export default Home;

