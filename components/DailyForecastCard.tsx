import React from 'react';
import { DailyForecast } from '../types';

interface DailyForecastCardProps {
    forecast: DailyForecast | null;
}

const DailyForecastCard: React.FC<DailyForecastCardProps> = ({ forecast }) => {

    if (!forecast) {
        // Enhanced Loading Skeleton to better match final structure
        return (
            <div className="bg-[#000000] rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 animate-pulse">
                <div className="h-7 bg-gray-700 rounded w-3/4 mb-6"></div>
                <div className="border-l-2 border-gray-700 pl-4 space-y-4">
                    <div>
                        <div className="h-3 bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div className="h-5 bg-gray-700 rounded w-full"></div>
                    </div>
                    <div>
                        <div className="h-3 bg-gray-700 rounded w-1/3 mb-2"></div>
                        <div className="h-5 bg-gray-700 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-[#000000] rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 opacity-0 animate-fade-in animation-delay-100">
            <h3 className="text-2xl font-bold text-white mb-4">
                <span className="text-[#FF7A2F]">Today's Focus:</span> {forecast.theme}
            </h3>
            <div className="border-l-2 border-[#D5CBA3] pl-4 space-y-3">
                <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Affirmation</h4>
                    <p className="text-lg italic text-[#D5CBA3]">"{forecast.affirmation}"</p>
                </div>
                <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Gentle Nudge</h4>
                    <p className="text-lg text-[#D5CBA3]">{forecast.nudge}</p>
                </div>
            </div>
        </div>
    );
};

export default DailyForecastCard;