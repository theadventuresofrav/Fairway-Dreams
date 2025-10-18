import React from 'react';
import { WeeklyForecast } from '../types';

interface WeeklyForecastCardProps {
    forecast: WeeklyForecast | null;
}

const WeeklyForecastCard: React.FC<WeeklyForecastCardProps> = ({ forecast }) => {

    if (!forecast) {
        // Loading Skeleton
        return (
            <div className="bg-[#000000] rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 animate-pulse">
                <div className="h-7 bg-gray-700 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-6"></div>
                <div className="space-y-3 mb-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="h-5 bg-gray-700 rounded w-24"></div>
                            <div className="h-4 bg-gray-700 rounded w-full"></div>
                        </div>
                    ))}
                </div>
                 <div className="h-3 bg-gray-700 rounded w-1/4 mb-2"></div>
                 <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
        );
    }
    
    return (
        <div className="bg-[#000000] rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 opacity-0 animate-fade-in animation-delay-200">
            <h3 className="text-2xl font-bold text-white mb-2">
                <span className="text-[#C6E0C2]">This Week's Theme:</span> {forecast.theme}
            </h3>
            <p className="text-lg text-gray-300 mb-6">{forecast.overview}</p>

            <div className="mb-6">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-3">Daily Focus</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                    {forecast.dailyBreakdown.map(item => (
                        <div key={item.day} className="flex items-start">
                            <span className="font-bold text-white w-24 flex-shrink-0">{item.day}:</span>
                            <span className="text-gray-400">{item.insight}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-400">Key Advice</h4>
                <p className="text-lg italic text-[#D5CBA3]">"{forecast.weeklyAdvice}"</p>
            </div>
        </div>
    );
};

export default WeeklyForecastCard;