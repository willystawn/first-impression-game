import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
    url: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ url }) => {
     return (
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-2xl flex flex-col items-center gap-4 animate-fadeIn w-full max-w-xs">
            <h2 className="text-2xl font-bold text-center text-white">Scan & Share!</h2>
            <p className="text-gray-400 text-center">Scan this code with your phone's camera to share your impression.</p>
            <div className="bg-white p-4 rounded-lg mt-2">
                <QRCodeSVG
                    value={url}
                    size={200}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"Q"}
                    includeMargin={false}
                />
            </div>
        </div>
    );
}

export default QRCodeDisplay;