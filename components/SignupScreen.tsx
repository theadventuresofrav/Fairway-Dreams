
import React, { useState, useEffect } from 'react';
import { UserData } from '../types';

interface SignupScreenProps {
  onSave: (data: UserData) => void;
  initialData: UserData | null;
  onCancel?: () => void;
  error: string | null;
  successTheme: string | null;
  onContinue: () => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onSave, initialData, onCancel, error, successTheme, onContinue }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName);
      setEmail(initialData.email);
      setBirthDate(initialData.birthDate);
      setBirthTime(initialData.birthTime || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && email && birthDate) {
      onSave({ id: initialData?.id, fullName, email, birthDate, birthTime });
    }
  };
  
  if (successTheme) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-[#000000] rounded-2xl p-8 shadow-2xl text-center w-full max-w-lg opacity-0 animate-fade-in">
                <div className="mb-6">
                    <span className="text-6xl" role="img" aria-label="Sparkles">✨</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Your Cosmic Blueprint is Ready!</h2>
                <p className="text-[#D5CBA3] text-lg mb-8">The universe recognizes you as:</p>
                
                <div className="bg-gradient-to-br from-[#FF7A2F]/20 to-[#D5CBA3]/20 border border-gray-700 rounded-xl p-6 my-6">
                    <p className="text-2xl sm:text-3xl font-bold text-white tracking-wide">{successTheme}</p>
                </div>

                <button
                    onClick={onContinue}
                    className="bg-[#FF7A2F] text-black py-3.5 px-12 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 w-full hover:bg-[#ff8b50] hover:translate-y-[-2px] hover:shadow-xl active:translate-y-0"
                >
                    Continue to Your Profiles →
                </button>
            </div>
        </div>
    );
  }

  return (
    <div id="signup-screen">
      {!isEditing && (
        <div className="text-center text-white mb-8 sm:mb-10 py-6 sm:py-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-wider text-white">
            FAIRWAY DREAMS
            </h1>
            <p className="text-base sm:text-lg opacity-95 text-[#D5CBA3]">The Universe Knows Who You Are</p>
        </div>
      )}

      <div className="bg-[#000000] rounded-2xl p-6 sm:p-8 shadow-2xl mb-6">
        <h2 className="mb-6 text-2xl font-bold text-center text-white">{isEditing ? 'Edit Profile' : 'Create Your Profile'}</h2>
        {error && (
            <div className="bg-red-500/10 border-l-4 border-red-500 text-red-300 p-4 mb-6 rounded-r-lg" role="alert">
                <p className="font-bold text-red-200">⚠️ Profile Generation Failed</p>
                <p className="text-sm">{error}</p>
            </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="fullName" className="block font-semibold mb-2 text-sm text-[#D5CBA3]">
              Full Name (as on birth certificate)
            </label>
            <input
              type="text"
              id="fullName"
              required
              placeholder="John Michael Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 bg-[#1A1A1A] text-white border-2 border-gray-700 rounded-lg text-base transition-all focus:outline-none focus:border-[#FF7A2F] focus:ring-2 focus:ring-[#FF7A2F]/50"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="email" className="block font-semibold mb-2 text-sm text-[#D5CBA3]">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#1A1A1A] text-white border-2 border-gray-700 rounded-lg text-base transition-all focus:outline-none focus:border-[#FF7A2F] focus:ring-2 focus:ring-[#FF7A2F]/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label htmlFor="birthDate" className="block font-semibold mb-2 text-sm text-[#D5CBA3]">
                Birth Date
              </label>
              <input
                type="date"
                id="birthDate"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-3 bg-[#1A1A1A] text-white border-2 border-gray-700 rounded-lg text-base transition-all focus:outline-none focus:border-[#FF7A2F] focus:ring-2 focus:ring-[#FF7A2F]/50"
              />
            </div>
            <div>
              <label htmlFor="birthTime" className="block font-semibold mb-2 text-sm text-[#D5CBA3]">
                Birth Time (Optional)
              </label>
              <input
                type="time"
                id="birthTime"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full p-3 bg-[#1A1A1A] text-white border-2 border-gray-700 rounded-lg text-base transition-all focus:outline-none focus:border-[#FF7A2F] focus:ring-2 focus:ring-[#FF7A2F]/50"
              />
              <p className="text-xs text-gray-500 mt-2">Crucial for an accurate astrological reading (determines Moon & Rising signs).</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-transparent border border-gray-600 text-gray-300 py-3.5 px-8 rounded-lg text-base font-semibold hover:bg-gray-800 transition-colors w-full md:w-auto"
                >
                    Cancel
                </button>
            )}
            <button
                type="submit"
                className="bg-[#FF7A2F] text-black py-3.5 px-8 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 w-full hover:bg-[#ff8b50] hover:translate-y-[-2px] hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex-grow"
                disabled={!fullName || !email || !birthDate}
            >
                {isEditing ? 'Save Changes' : 'Generate My Fairway Dreams Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupScreen;