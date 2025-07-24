
import React, { useEffect, useState } from 'react';
import { useImpressions } from '../hooks/useImpressions';
import ImpressionCard from './ImpressionCard';
import QRCodeDisplay from './QRCodeDisplay';

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
        <main className="container mx-auto p-4 md:p-8">
            <header className="text-center mb-8">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                    First Impression <span className="text-blue-400">Wall</span>
                </h1>
                <p className="text-gray-400 mt-2 text-lg">What's the vibe? See what everyone thinks!</p>
            </header>
            
            {hasImpressions && (
                 <div className="text-center mb-8">
                    <button
                        onClick={clearImpressions}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                        Clear All Impressions
                    </button>
                </div>
            )}

            <div className="relative">
                <div className={`flex justify-center items-start transition-all duration-700 ease-in-out ${hasImpressions ? 'mb-12' : 'min-h-[50vh] flex items-center'}`}>
                    {submitUrl ? <QRCodeDisplay url={submitUrl} /> : <div className="h-[292px]"></div>}
                </div>

                {hasImpressions ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {impressions.map((impression, index) => (
                            <ImpressionCard key={impression.id} text={impression.text} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-8">
                        <p className="text-xl">Waiting for the first impression...</p>
                        <p>Scan the QR code above to get started!</p>
                    </div>
                )}
            </div>
             <footer className="text-center text-gray-600 mt-16 pb-4">
                <p>Impressions are synced in real-time across all devices.</p>
            </footer>
        </main>
    );
};

export default DisplayPage;
