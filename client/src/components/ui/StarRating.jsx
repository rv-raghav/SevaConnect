import { useState } from "react";

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = "text-2xl",
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={`${size} transition-colors ${readOnly ? "cursor-default" : "cursor-pointer"}`}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: `'FILL' ${(hover || value) >= star ? 1 : 0}`,
            }}
          >
            star
          </span>
        </button>
      ))}
    </div>
  );
}
