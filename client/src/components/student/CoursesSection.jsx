import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';
import { AppContext } from '../../context/AppContext';

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
  <div
    className="py-16 md:px-40 px-8 text-center md:text-left"
    style={{ background: "#F8F5EE", color: "#211F1B" }}
  >
    {(() => {
      const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
      const serifBody = { fontFamily: "'Source Serif 4', Georgia, serif" };
      const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" };

      return (
        <>
          <p
            className="text-[10px] uppercase mb-3"
            style={{ ...metaSans, color: "#7A2E2E" }}
          >
            Faculty Recommendations
          </p>

          <h2 className="text-3xl font-semibold" style={{ ...serifDisplay, color: "#1D2B3A" }}>
            Learn from the Best Tutors
          </h2>

          <p
            className="text-sm md:text-base mt-3 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed"
            style={{ ...serifBody, color: "#6B6355" }}
          >
            Discover our top-rated courses across various categories. From coding and design to{" "}
            <br className="hidden md:block" />
            business and wellness, our courses are crafted to deliver results.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-3.5 md:px-0 md:my-14 my-8">
            {(allCourses || []).slice(0, 4).map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>

          <Link
            to="/course-list"
            onClick={() => scrollTo(0, 0)}
            className="inline-block px-10 py-3 text-sm transition-colors"
            style={{
              ...metaSans,
              textTransform: "uppercase",
              fontSize: "12px",
              color: "#1D2B3A",
              border: "1px solid #1D2B3A",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1D2B3A";
              e.currentTarget.style.color = "#F8F5EE";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#1D2B3A";
            }}
          >
            View Full Catalogue
          </Link>
        </>
      );
    })()}
  </div>
);
};

export default CoursesSection;
