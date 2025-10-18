import React, { useState } from 'react';

const TrinityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#FF7A2F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
);
const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#C6E0C2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);
const ConnectIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#D5CBA3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.975M15 21H9" />
    </svg>
);

const steps = [
  {
    icon: <span className="text-5xl">✨</span>,
    title: 'Welcome to Fairway Dreams',
    description: 'Get ready to unlock your personal cosmic blueprint. We analyze your unique data to reveal insights hidden in the universe.',
  },
  {
    icon: <TrinityIcon />,
    title: 'The Metaphysical Trinity',
    description: "We synthesize three ancient systems: Numerology (your life's path), Astrology (your personality), and the Chinese Zodiac (your character).",
  },
  {
    icon: <DashboardIcon />,
    title: 'Your Personal Dashboard',
    description: 'After creating a profile, you\'ll get a dashboard with daily forecasts, in-depth reports, and a complete breakdown of your cosmic identity.',
  },
  {
    icon: <ConnectIcon />,
    title: 'Connect & Support',
    description: 'Explore your compatibility with friends and family, and learn how to support them through their own cosmic cycles in the Hubs.',
  },
];

interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => setStep(prev => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 0));
  
  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 animate-fade-in" style={{ animationDuration: '0.5s' }}>
      <div className="bg-[#1A1A1A] border-2 border-gray-700 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-md text-center flex flex-col min-h-[400px]">
        <div className="flex-grow">
            <div className="mb-6 h-12 flex items-center justify-center">{currentStep.icon}</div>
            <h2 className="text-2xl font-bold text-white mb-3">{currentStep.title}</h2>
            <p className="text-[#D5CBA3]">{currentStep.description}</p>
        </div>

        <div className="mt-8">
            <div className="flex justify-center gap-2 mb-6">
                {steps.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all ${index === step ? 'bg-[#FF7A2F] w-6' : 'bg-gray-600'}`}
                    />
                ))}
            </div>

            <div className="flex gap-4 items-center">
                {step > 0 && (
                     <button onClick={handlePrev} className="bg-transparent border border-gray-600 text-gray-300 py-3 px-6 rounded-lg text-base font-semibold hover:bg-gray-800 transition-colors">
                        Prev
                    </button>
                )}
                {step < steps.length - 1 ? (
                    <button onClick={handleNext} className="bg-[#FF7A2F] text-black py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-colors w-full hover:bg-[#ff8b50]">
                        Next
                    </button>
                ) : (
                    <button onClick={onClose} className="bg-[#C6E0C2] text-black py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-colors w-full hover:bg-[#d4e6d1]">
                        Get Started
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
