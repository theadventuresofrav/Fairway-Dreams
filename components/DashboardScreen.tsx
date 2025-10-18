import React, { useState, useEffect } from 'react';
import { ProfileData, UserData, DailyForecast, WeeklyForecast } from '../types';
import TrinityCard from './TrinityCard';
import ReportCard from './ReportCard';
import ReportModal from './ReportModal';
import DailyForecastCard from './DailyForecastCard'; // New
import WeeklyForecastCard from './WeeklyForecastCard'; // New
import { generateReportContent, generateDailyForecast, generateWeeklyForecast } from '../services/geminiService';

interface DashboardScreenProps {
  profile: ProfileData;
  userData: UserData;
  onReset: () => void;
  onCheckCompatibility: () => void;
  onOpenSupportHub: () => void;
  onOpenFamilyHub: () => void;
  onRegenerate: () => void;
}

const reportData = [
    { type: 'life_path', title: 'Life Path Guide', description: 'Detailed analysis of your life path number with strengths, challenges, and guidance.' },
    { type: 'numerology', title: 'Complete Numerology', description: 'Complete numerology breakdown including all core numbers and their meanings.' },
    { type: 'astrology', title: 'Astrology Chart', description: 'Your complete astrological profile with planetary placements and aspects.' },
    { type: 'chinese', title: 'Chinese Zodiac Guide', description: 'In-depth Chinese zodiac analysis with compatibility and timing insights.' },
    { type: 'timing', title: 'Yearly Timing & Cycles', description: 'Year-by-year forecast with best timing for major decisions.' },
    { type: 'career', title: 'Career & Money Blueprint', description: 'Career paths, money patterns, and business success strategies.' },
    { type: 'master', title: 'Master Fairway Dreams Report', description: 'The complete Fairway Dreams integration report synthesizing all three systems.' }
];

const TimingAlert: React.FC<{ profile: ProfileData }> = ({ profile }) => {
    const { personalYear, personalYearTheme, personalYearAlertType } = profile.numerology;
    const currentYear = new Date().getFullYear();

    const alertClasses = {
        good: 'bg-[#C6E0C2]/20 border-[#C6E0C2] text-[#C6E0C2]',
        warning: 'bg-red-500/20 border-red-500 text-red-400',
        neutral: 'bg-[#D5CBA3]/20 border-[#D5CBA3] text-[#D5CBA3]',
    };
    
    return (
        <div className={`border-l-4 p-5 rounded-lg my-8 ${alertClasses[personalYearAlertType]}`}>
            <h3 className="font-bold">🌟 Personal Year {personalYear} - {currentYear}</h3>
            <p>{personalYearTheme}</p>
        </div>
    );
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ profile, userData, onReset, onCheckCompatibility, onOpenSupportHub, onOpenFamilyHub, onRegenerate }) => {
    const [reports, setReports] = useState<Record<string, string>>({});
    const [isGeneratingReports, setIsGeneratingReports] = useState<boolean>(true);
    const [selectedReport, setSelectedReport] = useState<{ title: string; content: string } | null>(null);
    const [dailyForecast, setDailyForecast] = useState<DailyForecast | null>(null);
    const [weeklyForecast, setWeeklyForecast] = useState<WeeklyForecast | null>(null);

    const firstName = userData.fullName.split(' ')[0];
    const { numerology, astrology, chinese } = profile;

    useEffect(() => {
        const pregenerateReports = async () => {
            setIsGeneratingReports(true);
            try {
                const reportPromises = reportData.map(report =>
                    generateReportContent(userData, profile, report.type, report.title)
                );
                const generatedContents = await Promise.all(reportPromises);
                const newReports: Record<string, string> = {};
                reportData.forEach((report, index) => {
                    newReports[report.type] = generatedContents[index];
                });
                setReports(newReports);
            } catch (error) {
                console.error("Failed to pregenerate reports:", error);
            } finally {
                setIsGeneratingReports(false);
            }
        };

        const fetchForecasts = async () => {
            // Fetch both forecasts concurrently
            const [daily, weekly] = await Promise.all([
                generateDailyForecast(profile),
                generateWeeklyForecast(profile)
            ]);
            setDailyForecast(daily);
            setWeeklyForecast(weekly);
        }

        pregenerateReports();
        fetchForecasts();
    }, [profile, userData]);

    const handleViewReport = (reportType: string, reportTitle: string) => {
        const content = reports[reportType];
        if (content) {
            setSelectedReport({ title: reportTitle, content });
        }
    };
    
    const handleRegenerateClick = () => {
        if (window.confirm("Are you sure you want to regenerate this profile? This will request a new analysis from the AI and replace the current data.")) {
            onRegenerate();
        }
    };

  return (
    <div>
        <div className="bg-[#FF7A2F] text-black p-6 sm:p-10 rounded-2xl mb-8 text-center shadow-lg opacity-0 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">Welcome, {firstName}! ✨</h2>
            <p className="opacity-90">Born {new Date(userData.birthDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
        </div>
        
        <DailyForecastCard forecast={dailyForecast} />
        <WeeklyForecastCard forecast={weeklyForecast} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 opacity-0 animate-fade-in animation-delay-100">
            <TrinityCard
                label="Life Path Number"
                value={numerology.lifePath.toString()}
                gradient="from-[#C6E0C2] to-[#C6E0C2]"
            />
            <TrinityCard
                label="Sun Sign"
                value={astrology.sunSignSymbol}
                subValue={astrology.sunSign}
                gradient="from-[#D5CBA3] to-[#D5CBA3]"
            />
            <TrinityCard
                label="Chinese Zodiac"
                value={chinese.animalSymbol}
                subValue={chinese.animal}
                gradient="from-[#FF7A2F] to-[#FF7A2F]"
            />
        </div>
        
        <div className="opacity-0 animate-fade-in animation-delay-200">
            <TimingAlert profile={profile} />
        </div>

        <div className="bg-[#000000] rounded-2xl p-6 sm:p-8 shadow-2xl mb-6 opacity-0 animate-fade-in animation-delay-300">
            <h2 className="text-2xl font-bold mb-6 text-white">Your Complete Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Numerology Card */}
                <div className="bg-[#1A1A1A] border-2 border-gray-800 rounded-xl p-6 flex flex-col h-full">
                    <h3 className="text-lg font-semibold mb-4 text-[#C6E0C2]">📊 Numerology</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Life Path:</span>
                            <span className="font-bold text-white">{numerology.lifePath}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Birthday Number:</span>
                            <span className="font-bold text-white">{numerology.birthday}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Expression Number:</span>
                            <span className="font-bold text-white">{numerology.expression}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Soul Urge Number:</span>
                            <span className="font-bold text-white">{numerology.soulUrge}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Personal Year ({new Date().getFullYear()}):</span>
                            <span className="font-bold text-white">{numerology.personalYear}</span>
                        </div>
                    </div>
                </div>
                
                {/* Astrology Card */}
                <div className="bg-[#1A1A1A] border-2 border-gray-800 rounded-xl p-6 flex flex-col h-full">
                    <h3 className="text-lg font-semibold mb-4 text-[#FF7A2F]">♈ Western Astrology</h3>
                    <div className="space-y-2 text-sm flex-grow">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Sun Sign:</span>
                            <span className="font-bold text-white">{astrology.sunSign}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-400">Moon Sign:</span>
                            {astrology.moonSign && astrology.moonSign !== 'Not Available' ? (
                                <span className="font-bold text-white">{astrology.moonSign}</span>
                            ) : (
                                <span className="text-sm text-gray-500 italic">Birth time needed</span>
                            )}
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-400">Rising Sign:</span>
                            {astrology.risingSign && astrology.risingSign !== 'Not Available' ? (
                                <span className="font-bold text-white">{astrology.risingSign}</span>
                            ) : (
                                <span className="text-sm text-gray-500 italic">Birth time needed</span>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-4 pt-2 border-t border-gray-700 italic">
                        {astrology.sunMoonRisingInteraction}
                    </p>
                </div>
                
                {/* Chinese Zodiac Card */}
                <div className="bg-[#1A1A1A] border-2 border-gray-800 rounded-xl p-6 flex flex-col h-full">
                    <h3 className="text-lg font-semibold mb-4 text-[#D5CBA3]">🐉 Chinese Zodiac</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Animal:</span>
                            <span className="font-bold text-white">{chinese.animal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Element:</span>
                            <span className="font-bold text-white">{chinese.element}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700 flex justify-end">
                <button
                    onClick={handleRegenerateClick}
                    className="bg-gray-700/50 text-gray-300 py-2 px-5 rounded-lg text-sm font-semibold hover:bg-gray-600/70 transition-colors flex items-center"
                    title="Regenerate Profile Analysis"
                    aria-label="Regenerate metaphysical profile"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10"></polyline>
                      <polyline points="23 20 23 14 17 14"></polyline>
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64M3.51 15A9 9 0 0 0 18.36 18.36"></path>
                    </svg>
                    Regenerate Profile
                </button>
            </div>
        </div>

        <div className="bg-[#000000] rounded-2xl p-6 sm:p-8 shadow-2xl mb-6 opacity-0 animate-fade-in animation-delay-400">
            <h2 className="text-2xl font-bold mb-2 text-white">Your Fairway Dreams Reports</h2>
            <p className="mb-6 text-[#D5CBA3]">
                Your personalized reports have been generated below.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportData.map(report => (
                    <ReportCard
                        key={report.type}
                        title={report.title}
                        description={report.description}
                        isLoading={isGeneratingReports || !reports[report.type]}
                        onView={() => handleViewReport(report.type, report.title)}
                    />
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-[#000000] rounded-2xl p-6 sm:p-8 shadow-2xl opacity-0 animate-fade-in animation-delay-500">
                <h2 className="text-2xl font-bold mb-2 text-white">Friendship Compatibility</h2>
                <p className="mb-6 text-[#D5CBA3]">
                    Discover your cosmic connection with friends and loved ones.
                </p>
                <button
                    onClick={onCheckCompatibility}
                    className="bg-[#C6E0C2]/20 text-[#C6E0C2] font-semibold py-3 px-6 rounded-lg hover:bg-[#C6E0C2]/40 transition-colors w-full md:w-auto"
                >
                    Check Compatibility →
                </button>
            </div>
            <div className="bg-[#000000] rounded-2xl p-6 sm:p-8 shadow-2xl opacity-0 animate-fade-in animation-delay-600">
                <h2 className="text-2xl font-bold mb-2 text-white">🔔 Friendship Support Hub</h2>
                <p className="mb-6 text-[#D5CBA3]">
                    Get insights on when to support your friends through challenging cycles.
                </p>
                <button
                    onClick={onOpenSupportHub}
                    className="bg-[#D5CBA3]/20 text-[#D5CBA3] font-semibold py-3 px-6 rounded-lg hover:bg-[#D5CBA3]/40 transition-colors w-full md:w-auto"
                >
                    Open Support Hub →
                </button>
            </div>
             <div className="bg-[#000000] rounded-2xl p-6 sm:p-8 shadow-2xl opacity-0 animate-fade-in animation-delay-700">
                <h2 className="text-2xl font-bold mb-2 text-white">🏡 Family Support Hub</h2>
                <p className="mb-6 text-[#D5CBA3]">
                    Understand the cosmic cycles affecting your family members.
                </p>
                <button
                    onClick={onOpenFamilyHub}
                    className="bg-[#FF7A2F]/20 text-[#FF7A2F] font-semibold py-3 px-6 rounded-lg hover:bg-[#FF7A2F]/40 transition-colors w-full md:w-auto"
                >
                    Open Family Hub →
                </button>
            </div>
        </div>


        <div className="text-center my-10">
            <button
                onClick={onReset}
                className="bg-transparent border border-[#FF7A2F] text-[#FF7A2F] py-3 px-12 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-[#FF7A2F] hover:text-black hover:shadow-lg"
            >
                Back to Profiles
            </button>
        </div>
        
        {selectedReport && (
            <ReportModal
                title={selectedReport.title}
                content={selectedReport.content}
                onClose={() => setSelectedReport(null)}
            />
        )}
    </div>
  );
};

export default DashboardScreen;