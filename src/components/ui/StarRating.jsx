import React from 'react';

const StarRating = ({ rate, max = 5, size = 24, color = "#FFD700", emptyColor = "#e0e0e0" }) => {
    const stars = Array.from({ length: max }).reverse(); // عكس الترتيب

    return (
        <svg
            width={size * max}
            height={size}
            viewBox={`0 0 ${size * max} ${size}`}
            style={{ display: 'block' }}
        >
            {stars.map((_, index) => {
                const fill = Math.min(Math.max(rate - (max - 1 - index), 0), 1); // تعديل الـ rate عشان العكس
                const starX = index * size;

                return (
                    <g key={index} transform={`translate(${starX}, 0)`}>
                        {/* نجمة كاملة باللون الفارغ */}
                        <polygon
                            points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
                            fill={emptyColor}
                            transform={`scale(${size / 24})`}
                        />
                        {/* نجمة صفراء حسب النسبة */}
                        <polygon
                            points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
                            fill={color}
                            transform={`scale(${size / 24})`}
                            clipPath={`polygon(0 0, ${fill * 100}% 0, ${fill * 100}% 100%, 0% 100%)`}
                        />
                    </g>
                );
            })}
        </svg>
    );
};

export default StarRating;
