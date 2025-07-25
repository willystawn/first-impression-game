// FILE: components/WordCloud.tsx (Gallery Layout)
import React, { useMemo } from 'react';
import { Impression } from '../hooks/useImpressions';

// Using background colors for the cards
const bgColors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 
    'bg-purple-500', 'bg-yellow-500', 'bg-sky-500',
    'bg-pink-500', 'bg-orange-500'
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

interface WordCloudProps {
    impressions: Impression[];
}

const WordCloud: React.FC<WordCloudProps> = ({ impressions }) => {
    const processedWords = useMemo(() => {
        return impressions.map((impression, i) => {
            const seed = stringToSeed(impression.text + i);
            const bgColorClass = bgColors[Math.floor(pseudoRandom(seed) * bgColors.length)];
            // A smaller, more uniform size range for a neater gallery
            const size = 1.1 + pseudoRandom(seed + 1) * 0.4; 

            return {
                id: impression.id,
                text: impression.text,
                size,
                bgColorClass,
            };
        });
    }, [impressions]);

    return (
        <div className="flex flex-wrap justify-center items-start gap-4 p-4 overflow-y-auto h-full">
            {processedWords.map((word) => (
                <div
                    key={word.id}
                    className={`p-4 rounded-lg shadow-xl text-white transform transition-transform duration-300 hover:scale-110 hover:shadow-2xl ${word.bgColorClass}`}
                >
                    <span
                        className="font-bold text-center block"
                        style={{
                            fontSize: `${word.size}rem`,
                            lineHeight: '1.3',
                        }}
                    >
                        {word.text}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default WordCloud;