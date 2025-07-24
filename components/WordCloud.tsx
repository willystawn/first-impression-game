// FILE: components/WordCloud.tsx (Alternatif Tanpa Library)
import React, { useMemo } from 'react';
import { Impression } from '../hooks/useImpressions';

const colors = [
    'text-red-400', 'text-blue-400', 'text-green-400', 
    'text-purple-400', 'text-yellow-300', 'text-sky-400',
    'text-pink-400', 'text-orange-400'
];

const stringToSeed = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
};

const pseudoRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

const WordCloud: React.FC<WordCloudProps> = ({ impressions }) => {
    const processedWords = useMemo(() => {
        if (!impressions.length) return [];

        const counts = new Map<string, number>();
        impressions.forEach(imp => {
            const text = imp.text.toLowerCase().trim();
            if (text) {
                counts.set(text, (counts.get(text) || 0) + 1);
            }
        });

        const words = Array.from(counts.entries());
        const numWords = words.length;
        const radiusConstant = 15; // Sesuaikan untuk mengatur jarak antar kata

        return words.map(([text, count], i) => {
            const seed = stringToSeed(text);
            const maxCount = Math.max(1, ...Array.from(counts.values()));
            const sizeScale = 1 + (count - 1) / (maxCount);
            const size = Math.min(1.5 + (3 * sizeScale), 10);

            // Algoritma penempatan Phyllotaxis (Bunga Matahari)
            // Ini menyebar titik dari pusat ke luar secara spiral
            const angle = i * 137.5; // Golden angle
            const radius = radiusConstant * Math.sqrt(i + 1);
            
            // Konversi dari polar (angle, radius) ke cartesian (x, y)
            // 50% adalah pusat, jadi kita tambahkan offset
            const x = 50 + radius * Math.cos(angle * (Math.PI / 180));
            const y = 50 + radius * Math.sin(angle * (Math.PI / 180));

            const colorClass = colors[Math.floor(pseudoRandom(seed) * colors.length)];
            const rotation = pseudoRandom(seed + 1) < 0.2 ? 90 : 0;

            return {
                text,
                size,
                colorClass,
                top: `${y}%`,
                left: `${x}%`,
                rotation,
            };
        });

    }, [impressions]);

    return (
        <div className="relative w-full h-full">
            {processedWords.map((word) => (
                <span
                    key={word.text}
                    className={`absolute font-bold transition-all duration-1000 ease-out fade-in-card ${word.colorClass}`}
                    style={{
                        fontSize: `${word.size}rem`,
                        top: word.top,
                        left: word.left,
                        lineHeight: '1',
                        transform: `translate(-50%, -50%) rotate(${word.rotation}deg)`,
                        whiteSpace: 'nowrap',
                    }}
                >
                    {word.text}
                </span>
            ))}
        </div>
    );
};

export default WordCloud;