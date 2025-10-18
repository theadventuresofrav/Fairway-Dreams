import React, { useState, useCallback } from 'react';
import { ProfileData, FriendData, CompatibilityResult, CompatibilityScores } from '../types';
import { generateMetaphysicalProfile, generateCompatibilitySummary } from '../services/geminiService';
import {
  getNumerologyCompatibility,
  getAstroCompatibility,
  getZodiacAnimalCompatibility,
  getOverallCompatibility,
} from '../compatibility';

interface CompatibilityCheckerProps {
  userProfile: ProfileData;
  onBack: () => void;
}

const CompatibilityChecker: React.FC<CompatibilityCheckerProps> = ({ userProfile, onBack }) => {
  const [friendName, setFriendName] = useState('');
  const [friendDob, setFriendDob] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const handleCheckCompatibility = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName || !friendDob) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const friendData: FriendData = { fullName: friendName, birthDate: friendDob };
      const friendProfile = await generateMetaphysicalProfile(friendData as any); // Re-use the service

      const scores: CompatibilityScores = {
        numerology: getNumerologyCompatibility(userProfile.numerology.lifePath, friendProfile.numerology.lifePath),
        astrology: getAstroCompatibility(userProfile.astrology.sunSign, friendProfile.astrology.sunSign),
        chinese: getZodiacAnimalCompatibility(userProfile.chinese.animal, friendProfile.chinese.animal),
        overall: { label: '', color: '' } // placeholder
      };
      scores.overall = getOverallCompatibility(scores.numerology, scores.astrology, scores.chinese);

      const summary = await generateCompatibilitySummary(userProfile, friendProfile, scores);

      setResult({ friendProfile, scores, summary });

    } catch (e) {
      console.error("Failed to check compatibility:", e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to analyze compatibility. Please try again. Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [friendName, friendDob, userProfile]);

  const resetChecker = () => {
    setFriendName('');
    setFriendDob('');
    setError(null);
    setResult(null);
    setIsLoading(false);
  };
  
  const CompatibilityScoreDisplay: React.FC<{label: string, value: string}> = ({label, value}) => {
    const colorClasses = {
        High: 'text-[#C6E0C2]',
        Medium: 'text-[#D5CBA3]',
        Low: 'text-red-400',
    };
    return <p><strong>{label}:</strong> <span className={colorClasses[value] || 'text-white'}>{value}</span></p>
  }

  return (
    <div className="bg-[#000000] rounded-2xl p-6 sm:p-8 shadow-2xl mb-6">
      {!result && !isLoading && (
        <form onSubmit={handleCheckCompatibility}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Friendship Compatibility</h2>
          <p className="mb-6 text-[#D5CBA3]">Enter your friend's details to reveal your cosmic connection.</p>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
          )}

          <div className="mb-5">
            <label htmlFor="friendName" className="block font-semibold mb-2 text-sm text-[#D5CBA3]">
              Friend's Full Name
            </label>
            <input
              type="text"
              id="friendName"
              required
              placeholder="Jane Doe"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              className="w-full p-3 bg-[#1A1A1A] text-white border-2 border-gray-700 rounded-lg text-base transition-all focus:outline-none focus:border-[#FF7A2F] focus:ring-2 focus:ring-[#FF7A2F]/50"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="friendDob" className="block font-semibold mb-2 text-sm text-[#D5CBA3]">
              Friend's Birth Date
            </label>
            <input
              type="date"
              id="friendDob"
              required
              value={friendDob}
              onChange={(e) => setFriendDob(e.target.value)}
              className="w-full p-3 bg-[#1A1A1A] text-white border-2 border-gray-700 rounded-lg text-base transition-all focus:outline-none focus:border-[#FF7A2F] focus:ring-2 focus:ring-[#FF7A2F]/50"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <button
                type="submit"
                className="bg-[#FF7A2F] text-black py-3 px-8 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 flex-grow hover:bg-[#ff8b50] hover:translate-y-[-2px] hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!friendName || !friendDob || isLoading}
            >
                Analyze Connection
            </button>
             <button type="button" onClick={onBack} className="bg-transparent border border-gray-600 text-gray-300 py-3 px-8 rounded-lg text-base font-semibold hover:bg-gray-800 transition-colors">
                Back to Dashboard
            </button>
          </div>
        </form>
      )}

      {isLoading && (
        <div className="text-center py-10">
            <div className="spinner border-4 border-gray-700 border-t-[#FF7A2F] rounded-full w-12 h-12 animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white">Comparing Cosmic Energies...</h2>
            <p className="text-[#D5CBA3] mt-2">Unveiling the secrets of your friendship blueprint.</p>
        </div>
      )}

      {result && (
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Your Compatibility with {friendName.split(' ')[0]}</h2>
            <p className={`text-xl font-semibold mb-4 ${result.scores.overall.color}`}>
                Overall Compatibility: {result.scores.overall.label}
            </p>
            <p className="mb-6 text-[#D5CBA3] italic text-lg border-l-2 border-[#FF7A2F] pl-4">
                "{result.summary}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-[#C6E0C2]">📊 Compatibility Breakdown</h3>
                    <CompatibilityScoreDisplay label="Numerology" value={result.scores.numerology} />
                    <CompatibilityScoreDisplay label="Astrology" value={result.scores.astrology} />
                    <CompatibilityScoreDisplay label="Chinese Zodiac" value={result.scores.chinese} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-[#FF7A2F]">
                        {friendName.split(' ')[0]}'s Profile
                    </h3>
                    <p><strong>Life Path:</strong> {result.friendProfile.numerology.lifePath}</p>
                    <p><strong>Sun Sign:</strong> {result.friendProfile.astrology.sunSign} {result.friendProfile.astrology.sunSignSymbol}</p>
                    <p><strong>Chinese Animal:</strong> {result.friendProfile.chinese.animal} {result.friendProfile.chinese.animalSymbol}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-8">
                <button
                    onClick={resetChecker}
                    className="bg-[#FF7A2F] text-black py-3 px-8 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 flex-grow hover:bg-[#ff8b50] hover:translate-y-[-2px] hover:shadow-xl"
                >
                    Check Another Friend
                </button>
                <button onClick={onBack} className="bg-transparent border border-gray-600 text-gray-300 py-3 px-8 rounded-lg text-base font-semibold hover:bg-gray-800 transition-colors">
                    Back to Dashboard
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default CompatibilityChecker;