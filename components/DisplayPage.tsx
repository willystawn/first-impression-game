// FILE: components/DisplayPage.tsx
import React, { useEffect, useState } from 'react';
import { useImpressions } from '../hooks/useImpressions';
import QRCodeDisplay from './QRCodeDisplay';
import WordCloud from './WordCloud';

// Komponen untuk bentuk geometris di background
const BackgroundShapes = () => (
    <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-16 w-24 h-24 bg-yellow-300 opacity-20 transform -rotate-45" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
        <div className="absolute top-10 right-24 w-32 h-16 bg-blue-400 opacity-20 transform rotate-12"></div>
        <div className="absolute bottom-16 left-10 w-32 h-16 bg-green-300 opacity-10 rounded-t-full"></div>
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-pink-400 opacity-10 rounded-full"></div>
        <div className="absolute bottom-20 right-32 w-16 h-16 bg-purple-400 opacity-20 transform rotate-45" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
    </div>
);

const DisplayPage: React.FC = () => {
    const { impressions, clearImpressions } = useImpressions();
    const [submitUrl, setSubmitUrl] = useState('');

    useEffect(() => {
        const url = new URL(window.location.href);
        url.hash = '/submit';
        setSubmitUrl(url.toString());
    }, []);

    const hasImpressions = impressions.length > 0;

    return (
        <main className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white antialiased overflow-hidden">
            <BackgroundShapes />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 h-screen">
                {/* Kolom Kiri: Word Cloud */}
                <div className="lg:col-span-2 flex items-center justify-center p-8 h-full">
                    {hasImpressions ? (
                        <WordCloud impressions={impressions} />
                    ) : (
                        <div className="text-center text-gray-500">
                            <p className="text-2xl font-bold">Waiting for impressions...</p>
                            <p className="mt-2">Scan the QR code to add your words!</p>
                        </div>
                    )}
                </div>

                {/* Kolom Kanan: Panel Kontrol */}
                <aside className="lg:col-span-1 bg-black bg-opacity-20 backdrop-blur-sm border-l border-gray-800 flex flex-col items-center p-8 h-full">
                    
                    {/* Wrapper untuk konten utama agar bisa mendorong footer ke bawah */}
                    <div className="flex flex-col justify-center items-center gap-8 flex-grow">
                        <header className="text-center">
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                                Impression <span className="text-blue-400">Cloud</span>
                            </h1>
                            <p className="text-gray-400 mt-2 text-lg">See what everyone thinks!</p>
                        </header>
                        
                        {submitUrl && <QRCodeDisplay url={submitUrl} />}
                        
                        {hasImpressions && (
                            <button
                                onClick={clearImpressions}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-red-500/50"
                            >
                                Clear All Impressions
                            </button>
                        )}
                    </div>

                    {/* === BAGIAN KREDIT YANG DITAMBAHKAN === */}
                    <div className="w-full text-center mt-auto pt-4">
                        <p className="text-sm text-gray-500">
                            Credit by willystawn
                        </p>
                    </div>
                    {/* ===================================== */}
                </aside>
            </div>
        </main>
    );
};

export default DisplayPage;