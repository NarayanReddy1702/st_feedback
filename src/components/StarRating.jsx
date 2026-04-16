import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating, readOnly = false }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={24}
          className={`cursor-pointer transition-colors ${
            star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
          } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={() => !readOnly && setRating(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(null)}
        />
      ))}
    </div>
  );
};

export default StarRating;