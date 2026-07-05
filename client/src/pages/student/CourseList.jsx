import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import SearchBar from '../../components/student/SearchBar';
import { useParams } from 'react-router-dom';
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer'

const CourseList = () => {

  const {navigate, allCourses} = useContext(AppContext);
  const {input} = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(()=>{
       if(allCourses && allCourses.length > 0){
        const tempCourses = allCourses.slice()

        input ?
         setFilteredCourse(
          tempCourses.filter(
            item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
          )
         )
        : setFilteredCourse(tempCourses)
       }
  }, [allCourses,input])
  return (
  <>
    <div
      className="relative md:px-36 px-8 pt-24 min-h-screen"
      style={{ background: "#F8F5EE", color: "#211F1B" }}
    >
      {(() => {
        const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
        const serifBody = { fontFamily: "'Source Serif 4', Georgia, serif" };
        const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" };

        return (
          <>
            {/* Rule grid instead of glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(#A9823D18 1px, transparent 1px), linear-gradient(90deg, #A9823D18 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative">
              {/* Header */}
              <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full pb-6 border-b" style={{ borderColor: "#A9823D40" }}>
                <div>
                  <p className="text-[10px] uppercase mb-2" style={{ ...metaSans, color: "#7A2E2E" }}>
                    Course Catalogue
                  </p>
                  <h1 className="text-4xl font-semibold" style={{ ...serifDisplay, color: "#1D2B3A" }}>
                    All Courses
                  </h1>

                  <p className="mt-3 text-sm" style={{ ...serifBody, color: "#6B6355" }}>
                    <span
                      className="cursor-pointer hover:underline"
                      style={{ color: "#7A2E2E" }}
                      onClick={() => navigate("/")}
                    >
                      Home
                    </span>{" "}
                    / <span style={{ color: "#3A3630" }}>All Courses</span>
                  </p>
                </div>

                <SearchBar data={input} />
              </div>

              {/* Active Search Tag */}
              {input && (
                <div
                  className="inline-flex items-center gap-4 px-4 py-2 mt-6 text-sm"
                  style={{
                    ...serifBody,
                    border: "1px solid #A9823D80",
                    background: "#FFFDF8",
                    color: "#3A3630",
                  }}
                >
                  <p>{input}</p>
                  <img
                    src={assets.cross_icon}
                    alt=""
                    className="cursor-pointer w-3 h-3"
                    style={{ filter: "invert(15%) sepia(20%) hue-rotate(180deg)", opacity: 0.7 }}
                    onClick={() => navigate("/course-list")}
                  />
                </div>
              )}

              {/* Courses Grid */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                          my-16 gap-6 px-2 md:p-0"
              >
                {filteredCourse.map((course, index) => (
                  <CourseCard key={index} course={course} />
                ))}
              </div>
            </div>
          </>
        );
      })()}
    </div>
    <Footer />
  </>
);

}

export default CourseList;
