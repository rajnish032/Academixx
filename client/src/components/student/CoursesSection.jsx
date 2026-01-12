import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';
import { AppContext } from '../../context/AppContext';

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="py-16 md:px-40 px-8 text-center md:text-left">
      <h2 className="text-3xl font-medium text-white">
        Learn from the best tutor
      </h2>

      <p className="text-sm md:text-base text-gray-300 mt-3 mb-8">
        Discover our top-rated courses across various categories. From coding and design to <br className="hidden md:block" />
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
        className="inline-block text-gray-200 border border-white/20 px-10 py-3 rounded-lg 
                   hover:bg-white/10 hover:border-white/40 transition"
      >
        Show All Courses
      </Link>
    </div>
  );
};

export default CoursesSection;
