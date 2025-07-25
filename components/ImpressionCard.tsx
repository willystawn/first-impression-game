import React from 'react';

interface ImpressionCardProps {
    text: string;
    index: number;
}

// Palet warna gradien baru yang lebih cerah dan modern
const gradientColors = [
    'from-yellow-400 to-orange-500',
    'from-green-400 to-teal-500',
    'from-sky-400 to-blue-500',
    'from-pink-400 to-rose-500',
    'from-purple-400 to-indigo-500',
    'from-lime-400 to-emerald-500',
];

const rotations = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-3', '-rotate-3'];

const ImpressionCard: React.FC<ImpressionCardProps> = ({ text, index }) => {
    const gradientClass = gradientColors[index % gradientColors.length];
    const rotationClass = rotations[index % rotations.length];

    // === PERUBAHAN DI SINI ===
    // Kartu sekarang hanya menampilkan satu kesan (text), tidak perlu di-split lagi.
    return (
        <div 
            className={`fade-in-card p-5 shadow-xl flex flex-col justify-center items-center text-center transform transition-all duration-300 hover:scale-110 hover:z-10 rounded-lg bg-gradient-to-br text-gray-900 ${gradientClass} ${rotationClass}`}
            style={{ minHeight: '8rem' }} // Sedikit mengurangi tinggi minimum agar lebih pas
        >
            <p className="break-words text-white font-bold text-2xl">
                {text}
            </p>
        </div>
    );
};

export default ImpressionCard;