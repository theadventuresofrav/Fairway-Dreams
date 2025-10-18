
import React from 'react';

interface CalculatingScreenProps {
    message?: string;
}

const CalculatingScreen: React.FC<CalculatingScreenProps> = ({ message = 'Calculating Your Cosmic Blueprint...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
        <div className="bg-[#000000] rounded-2xl p-8 shadow-2xl text-center w-full">
            <div className="loading">
                <div className="spinner border-4 border-gray-700 border-t-[#FF7A2F] rounded-full w-12 h-12 animate-spin mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-white">{message}</h2>
                <p className="text-[#D5CBA3] mt-2">Analyzing numerology, astrology, and Chinese zodiac patterns with AI.</p>
            </div>
        </div>
    </div>
  );
};

export default CalculatingScreen;