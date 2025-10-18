import React from 'react';

interface ReportCardProps {
    title: string;
    description: string;
    isLoading: boolean;
    onView: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, isLoading, onView }) => {
    return (
        <div className="bg-[#1A1A1A] border-2 border-gray-700 rounded-xl p-6 transition-all duration-300 hover:border-[#FF7A2F] hover:-translate-y-1 hover:shadow-xl flex flex-col">
            <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
            <div className="mb-4">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${isLoading ? 'bg-gray-600 text-gray-300' : 'bg-[#C6E0C2]/20 text-[#C6E0C2]'}`}>
                    {isLoading ? 'Generating...' : '✓ Complete'}
                </span>
            </div>
            <p className="text-sm text-[#D5CBA3] mb-4 flex-grow">{description}</p>
            <button 
                onClick={onView} 
                disabled={isLoading}
                className="mt-auto flex items-center justify-center bg-[#FF7A2F]/20 text-[#FF7A2F] font-semibold py-2 px-4 rounded-lg hover:bg-[#FF7A2F]/40 transition-colors w-full disabled:bg-gray-700/50 disabled:text-gray-400 disabled:cursor-wait"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Please wait...</span>
                    </>
                ) : (
                    'View Report'
                )}
            </button>
        </div>
    );
};

export default ReportCard;