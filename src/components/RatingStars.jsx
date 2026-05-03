import { useState } from "react";
import styled from "styled-components";




export default function RatingStars({ value = 0, onRate }) {
  const [hover, setHover] = useState(0);

  const displayValue = hover !== 0 ? hover : value;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="w-8 inline-block text-center text-2xl cursor-pointer transition-all duration-200 hover:scale-110"
          onClick={() => {
            console.log("Clicked:", star);
            onRate(star);
          }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            color: displayValue >= star ? "#22c55e" : "#555",
            userSelect: "none"
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const StyledWrapper = styled.div`
  .rating:not(:checked) > input {
    position: absolute;
    appearance: none;
  }

  .rating:not(:checked) > label {
    float: right;
    cursor: pointer;
    font-size: 30px;
    color: #666;
    transition: color 0.3s ease;
  }

  .rating:not(:checked) > label:before {
    content: '★';
  }

  .rating > input:checked + label:hover,
  .rating > input:checked + label:hover ~ label,
  .rating > input:checked ~ label:hover,
  .rating > input:checked ~ label:hover ~ label,
  .rating > label:hover ~ input:checked ~ label {
    color: #e58e09;
  }

  .rating:not(:checked) > label:hover,
  .rating:not(:checked) > label:hover ~ label {
    color: #ff9e0b;
  }

  .rating > input:checked ~ label {
    color: #ffa723;
  }
`;