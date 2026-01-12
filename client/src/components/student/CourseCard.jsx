import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  if (!course) return null;

  const rating = calculateRating(course);
  const finalPrice = (
    course.coursePrice - (course.discount * course.coursePrice) / 100
  ).toFixed(2);

  return (
    <Link
      to={'/course/' + course._id}
      onClick={() => scroll(0, 0)}
      className="group flex flex-col h-full bg-white/5 border border-white/10 
                 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.6)]
                 hover:border-cyan-400/50 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(34,211,238,0.45)]
                 transition-transform transition-colors duration-200"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-40 overflow-hidden">
        <img
          src={course.courseThumbnail}
          alt="thumbnail"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {course.discount > 0 && (
          <span className="absolute top-2 left-2 bg-cyan-500 text-xs text-black font-semibold px-2 py-1 rounded-full">
            {course.discount}% OFF
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-3 text-left">
        <div>
          <h3 className="text-base font-semibold text-white line-clamp-2">
            {course.courseTitle}
          </h3>
          <p className="text-sm text-gray-300 mt-1">
            {course.educator?.name}
          </p>
        </div>

        {/* Rating + Price */}
        <div className="mt-3 flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm text-yellow-300">
              {rating.toFixed(1)}
            </p>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                  alt="star"
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>
            <p className="text-xs text-gray-400">
              ({course.courseRatings.length})
            </p>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm text-gray-400 line-through">
              {course.discount > 0 && (
                <>
                  {currency}
                  {course.coursePrice.toFixed(2)}
                </>
              )}
            </p>
            <p className="text-base font-semibold text-cyan-400">
              {currency}
              {finalPrice}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;

