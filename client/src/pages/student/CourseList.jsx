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
    <div className="relative md:px-36 px-8 pt-24 text-left text-white bg-black min-h-screen">

      {/* ✅ Glow Gradient Background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] 
                      bg-cyan-500/20 blur-3xl rounded-full -z-10" />

      {/* Header Section */}
      <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
        <div>
          <h1 className="text-4xl font-semibold text-white">
            All Courses
          </h1>

          <p className="text-gray-400 mt-1">
            <span
              className="text-cyan-400 cursor-pointer hover:underline"
              onClick={() => navigate('/')}
            >
              Home
            </span>{" "}
            / <span className="text-gray-300">All Courses</span>
          </p>
        </div>

        <SearchBar data={input} />
      </div>

      {/* Active Search Tag */}
      {input && (
        <div
          className="inline-flex items-center gap-4 px-4 py-2 border border-white/20 
                     mt-8 -mb-8 text-gray-300 bg-white/5 backdrop-blur-md rounded-lg"
        >
          <p>{input}</p>
          <img
            src={assets.cross_icon}
            alt=""
            className="cursor-pointer opacity-80 hover:opacity-100"
            onClick={() => navigate('/course-list')}
          />
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                      my-16 gap-6 px-2 md:p-0">
        {filteredCourse.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
    <Footer />
  </>
);

}

export default CourseList;
