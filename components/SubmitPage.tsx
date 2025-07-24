// FILE: components/SubmitPage.tsx
import React, { useState } from 'react';
import { useImpressions } from '../hooks/useImpressions';

const CheckCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SubmitPage: React.FC = () => {
    const [inputs, setInputs] = useState(['', '', '']);
    const [submitted, setSubmitted] = useState(false);
    const { addImpressions } = useImpressions();

    const handleInputChange = (index: number, value: string) => {
        const words = value.trim().split(/\s+/);
        let validatedValue = value;
        if (words.length > 2) {
            validatedValue = words.slice(0, 2).join(' ');
        }
        
        const newInputs = [...inputs];
        newInputs[index] = validatedValue;
        setInputs(newInputs);
    };

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        const validInputs = inputs.map(i => i.trim()).filter(Boolean);
        if (validInputs.length > 0) {
            addImpressions(validInputs);
            setInputs(['', '', '']);
            setSubmitted(true);
        }
    };

    const isSubmitDisabled = inputs.every(input => !input.trim());

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                <CheckCircleIcon />
                <h1 className="text-3xl font-bold mt-4 text-green-300">Terima Kasih!</h1>
                <p className="text-gray-400 mt-2">Kesanmu telah dikirim. Lihat ke layar utama!</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md">
                <h1 className="text-4xl font-bold text-center mb-2 text-white">First Impression</h1>
                <p className="text-center text-gray-400 mb-8">Tuliskan hingga 3 kesan pertamamu (maks. 2 kata per kesan).</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {inputs.map((value, index) => (
                        <div key={index}>
                            <label htmlFor={`impression-${index}`} className="block text-sm font-medium text-gray-400 mb-1">
                                Kesan #{index + 1}
                            </label>
                            <input
                                type="text"
                                id={`impression-${index}`}
                                value={value}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                placeholder="Contoh: Sangat Keren"
                                maxLength={40}
                                // === PERUBAHAN DI SINI ===
                                autoComplete="off" 
                                // ==========================
                                className="w-full p-3 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition duration-200"
                            />
                        </div>
                    ))}
                    
                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="w-full mt-6 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
                    >
                        Kirim Kesan
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SubmitPage;