
import React from 'react';

interface ImpressionCardProps {
    text: string;
    index: number;
}

const colors = [
    'bg-yellow-300 text-yellow-900',
    'bg-green-300 text-green-900',
    'bg-sky-300 text-sky-900',
    'bg-pink-300 text-pink-900',
    'bg-purple-300 text-purple-900',
    'bg-orange-300 text-orange-900',
];

const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-3', '-rotate-3'];

const ImpressionCard: React.FC<ImpressionCardProps> = ({ text, index }) => {
    const colorClass = colors[index % colors.length];
    const rotationClass = rotations[index % rotations.length];

    return (
        <div 
            className={`fade-in-card p-5 shadow-lg h-48 flex items-center justify-center text-center font-medium text-xl transform transition-transform duration-300 hover:scale-110 hover:z-10 rounded-md ${colorClass} ${rotationClass}`}
        >
            <p className="break-words">{text}</p>
        </div>
    );
};

export default ImpressionCard;
