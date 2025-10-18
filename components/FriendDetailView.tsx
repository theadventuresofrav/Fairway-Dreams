
import React, { useState, useEffect, useCallback } from 'react';
import { Friend, ChallengeAnalysis } from '../types';
import { analyzeCurrentChallenges } from '../services/supportSystemService';
import { generateSupportRecommendation } from '../services/geminiService';

const WeatherIcon: React.FC<{ level: ChallengeAnalysis['level'] }> = ({ level }) => {
    const styles = {
        High: { icon: '⚠️', color: 'bg-yellow-500/20 text-yellow-400' },
        Medium: { icon: '⚡', color: 'bg-orange-500/20 text-orange-400' },
        Low: { icon: '... ', color: 'bg-gray-500/20 text-gray-400' },
        Neutral: { icon: '✨', color: 'bg-green-500/20 text-green-400' },
    };
    const { icon, color } = styles[level] || styles.Neutral;
    return <span className={`text-xl rounded-full px-2 py-1 ${color}`}>{icon}</span>;
}

interface FriendDetailViewProps {
    friend: Friend;
    onBack: () => void;
}

const FriendDetailView: React.FC<FriendDetailViewProps> = ({ friend, onBack }) => {
    const [analyses, setAnalyses] = useState<ChallengeAnalysis[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDetails = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const initialAnalyses = analyzeCurrentChallenges(friend);
            
            const recommendationsPromises = initialAnalyses.map(analysis => 
                generateSupportRecommendation(analysis)
            );
            
            // Use Promise.allSettled for resilience. If one promise fails, the others can still succeed.
            const recommendationResults = await Promise.allSettled(recommendationsPromises);
            
            const finalAnalyses = initialAnalyses.map((analysis, index) => {
                const result = recommendationResults[index];
                const recommendation = result.status === 'fulfilled'
                    ? result.value
                    : "Could not generate a recommendation at this time. Focus on being a supportive listener.";
                
                return {
                    ...analysis,
                    recommendation,
                };
            });

            setAnalyses(finalAnalyses);
        } catch (err) {
            console.error("Failed to fetch friend details:", err);
            setError("We couldn't generate the support insights at this time. The cosmic energies might be a bit fuzzy. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [friend]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const formatNotes = (text: string) => {
        // A simple markdown to HTML converter for bold and italics.
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white not-italic font-semibold">$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>')       // Italic
            .replace(/\n/g, '<br />');                  // New lines
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center py-10">
                    <div className="spinner border-4 border-gray-700 border-t-[#FF7A2F] rounded-full w-12 h-12 animate-spin mx-auto mb-6"></div>
                    <h2 className="text-2xl font-bold text-white">Generating Support Insights...</h2>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center bg-red-900/40 border border-red-500 text-red-400 p-6 rounded-lg my-6">
                    <h3 className="text-xl font-bold mb-2">Something Went Wrong</h3>
                    <p>{error}</p>
                    <button
                        onClick={fetchDetails}
                        className="mt-4 bg-red-500/50 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-500/70 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {friend.notes && (
                    <div className="bg-[#1A1A1A] p-4 rounded-lg border border-gray-700">
                        <h4 className="font-semibold text-[#D5CBA3]">Your Personal Notes:</h4>
                        <p className="text-gray-300 italic" dangerouslySetInnerHTML={{ __html: formatNotes(friend.notes) }}></p>
                    </div>
                )}
                {analyses.map((analysis, index) => (
                    <div key={index} className="border-l-4 border-[#FF7A2F] pl-4">
                        <h3 className="text-xl font-semibold text-white">{analysis.title} <WeatherIcon level={analysis.level}/></h3>
                        <p className="text-gray-300 mt-1">{analysis.description}</p>
                        <div className="mt-3 bg-[#1A1A1A] p-4 rounded-lg">
                            <h4 className="font-semibold text-[#C6E0C2]">How to Be a Better Friend:</h4>
                            <p className="text-[#D5CBA3] italic">"{analysis.recommendation}"</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-[#000000] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">{friend.fullName}'s Cosmic Weather</h2>
            <p className="text-md text-gray-400 mb-6">Born on {new Date(friend.birthDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>

            {renderContent()}

             <div className="mt-8 text-center">
                <button onClick={onBack} className="bg-transparent border border-gray-600 text-gray-300 py-3 px-12 rounded-lg text-base font-semibold hover:bg-gray-800 transition-colors">
                    Back to Hub
                </button>
            </div>
        </div>
    )
};

export default FriendDetailView;