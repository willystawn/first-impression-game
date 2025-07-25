// FILE: components/WordCloud.tsx (Diubah menjadi Impression Gallery)
import React from 'react';
import { Impression } from '../hooks/useImpressions';
import ImpressionCard from './ImpressionCard'; // Menggunakan komponen kartu yang sudah ada

interface WordCloudProps {
    impressions: Impression[];
}

const WordCloud: React.FC<WordCloudProps> = ({ impressions }) => {
    return (
        // Container dibuat scrollable dengan scrollbar tersembunyi
        // Menggunakan masonry-like columns untuk layout yang lebih dinamis
        <div className="h-full w-full overflow-y-auto scrollbar-hide p-4 md:p-6">
            <div 
                className="gap-4 md:gap-6"
                style={{
                    columnCount: 3, // Jumlah kolom bisa disesuaikan
                    columnGap: '1.5rem',
                }}
            >
                {impressions.map((impression, index) => (
                    <div key={impression.id} className="mb-4 md:mb-6 break-inside-avoid">
                        <ImpressionCard
                            text={impression.text}
                            index={index}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WordCloud;