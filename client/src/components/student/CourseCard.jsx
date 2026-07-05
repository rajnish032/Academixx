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
      to={"/course/" + course._id}
      onClick={() => scroll(0, 0)}
      className="group flex flex-col h-full bg-paper-alt border border-navy transition-transform duration-200 hover:-translate-y-1"
    >
      {/* Thumbnail — the "plate" */}
      <div className="relative w-full h-40 overflow-hidden border-b border-brass/50">
        <img
          src={course.courseThumbnail}
          alt="thumbnail"
          className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-300"
        />
        {course.discount > 0 && (
          <span className="absolute top-2 left-2 font-meta text-[10px] uppercase font-medium px-2 py-1 bg-oxblood text-paper">
            {course.discount}% Off
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-4 text-left">
        <div>
          <h3 className="font-body font-semibold text-base leading-snug line-clamp-2 text-navy">
            {course.courseTitle}
          </h3>
          <p className="font-meta text-xs mt-1.5 text-muted">
            {course.educator?.name}
          </p>
        </div>

        {/* Rating + Price */}
        <div className="mt-4 pt-3 flex items-center justify-between border-t border-brass/30">
          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <p className="font-display font-semibold text-sm text-oxblood">
              {rating.toFixed(1)}
            </p>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                  alt="star"
                  className={`w-3 h-3 ${
                    i < Math.floor(rating)
                      ? "brightness-90 sepia saturate-[4]"
                      : "grayscale opacity-50"
                  }`}
                />
              ))}
            </div>
            <p className="font-meta text-[10px] text-faint">
              ({course.courseRatings.length})
            </p>
          </div>

          {/* Price */}
          <div className="text-right">
            {course.discount > 0 && (
              <p className="font-body text-xs line-through text-faint">
                {currency}
                {course.coursePrice.toFixed(2)}
              </p>
            )}
            <p className="font-display font-semibold text-base text-oxblood">
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