import React from 'react'
import Hero from '../../components/student/Hero';
import Companies from '../../components/student/Companies';
import CoursesSection from '../../components/student/CoursesSection';
import TestimonialSection from '../../components/student/TestimonialSection';
import CallToAction from '../../components/student/CallToAction';
import Footer from '../../components/student/Footer.jsx'

const Home = () => {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: "#F8F5EE", color: "#211F1B" }}
    >
      {/* Rule grid instead of the old animated dark grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "linear-gradient(#A9823D18 1px, transparent 1px), linear-gradient(90deg, #A9823D18 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

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