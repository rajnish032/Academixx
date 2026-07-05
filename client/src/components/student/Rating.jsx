import React, { useEffect, useState } from 'react'

const Rating = ({ initialRating, onRate }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [hovered, setHovered] = useState(0);

  const handleRating = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
    }
  }, [initialRating]);

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const active = starValue <= (hovered || rating);

        return (
          <span
            key={index}
            className="text-xl sm:text-2xl cursor-pointer transition-colors"
            style={{ color: active ? "#7A2E2E" : "#D8D2C4" }}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
