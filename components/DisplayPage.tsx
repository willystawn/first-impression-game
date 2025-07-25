// FILE: components/DisplayPage.tsx
import React, { useEffect, useState } from 'react';
import { useImpressions } from '../hooks/useImpressions';
import QRCodeDisplay from './QRCodeDisplay';
import WordCloud from './WordCloud';

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-500 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

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
    
    const [eventTitle, setEventTitle] = useState('For the Presenter');
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    useEffect(() => {
        const savedTitle = localStorage.getItem('eventTitle');
        if (savedTitle) {
            setEventTitle(savedTitle);
        }

        const url = new URL(window.location.href);
        url.hash = '/submit';
        setSubmitUrl(url.toString());
    }, []);

    const handleTitleSave = () => {
        const trimmedTitle = eventTitle.trim();
        if (trimmedTitle) {
            localStorage.setItem('eventTitle', trimmedTitle);
            setEventTitle(trimmedTitle);
        } else {
            const defaultTitle = 'For the Presenter';
            localStorage.setItem('eventTitle', defaultTitle);
            setEventTitle(defaultTitle);
        }
        setIsEditingTitle(false);
    };
    
    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleTitleSave();
        } else if (e.key === 'Escape') {
            const savedTitle = localStorage.getItem('eventTitle') || 'For the Presenter';
            setEventTitle(savedTitle);
            setIsEditingTitle(false);
        }
    };

    const hasImpressions = impressions.length > 0;

    return (
        <main className="relative min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white antialiased overflow-hidden">
            <BackgroundShapes />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 h-screen">
                <div className="lg:col-span-2 flex items-center justify-center p-8 h-full overflow-hidden">
                    {hasImpressions ? (
                        <div className="relative w-full h-full">
                            <WordCloud impressions={impressions} />
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <p className="text-2xl font-bold">Waiting for impressions...</p>
                            <p className="mt-2">Scan the QR code to add your words!</p>
                        </div>
                    )}
                </div>

                <aside className="lg:col-span-1 bg-black bg-opacity-20 backdrop-blur-sm border-l border-gray-800 flex flex-col items-center p-8 h-full">
                    
                    <div className="flex flex-col justify-center items-center gap-8 flex-grow w-full">
                        <header className="text-center w-full">
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                                Impression <span className="text-blue-400">Cloud</span>
                            </h1>

                            {/* === BAGIAN JUDUL DINAMIS YANG DIPERBARUI === */}
                            <div className="mt-6 min-h-[4rem]">
                                {isEditingTitle ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <input
                                            type="text"
                                            value={eventTitle}
                                            onChange={(e) => setEventTitle(e.target.value)}
                                            onKeyDown={handleTitleKeyDown}
                                            // Ukuran font dan gaya input disesuaikan
                                            className="w-full max-w-sm p-2 bg-gray-700 border-2 border-blue-500 rounded-lg text-white text-center text-3xl font-bold"
                                            autoFocus
                                            onFocus={(e) => e.target.select()}
                                        />
                                        <button onClick={handleTitleSave} className="text-sm text-blue-400 hover:underline">
                                            Save (or press Enter)
                                        </button>
                                    </div>
                                ) : (
                                    <div 
                                        className="group flex items-center justify-center cursor-pointer"
                                        onClick={() => setIsEditingTitle(true)}
                                    >
                                        {/* Ukuran font diperbesar dan gaya diubah */}
                                        <h2 className="text-3xl font-bold text-gray-200 group-hover:text-white transition-colors break-words max-w-full">
                                            {eventTitle}
                                        </h2>
                                        <PencilIcon />
                                    </div>
                                )}
                            </div>
                            {/* ============================================= */}
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

                    <div className="w-full text-center mt-auto pt-4">
                        <p className="text-base text-gray-300">
                            Made with ❤️ by{' '}
                            <a 
                                href="https://github.com/willystawn" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                            >
                                willystawn
                            </a>
                        </p>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default DisplayPage;