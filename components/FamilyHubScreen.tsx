
import React, { useState, useMemo } from 'react';
import { FamilyMember, ChallengeAnalysis } from '../types';
import { analyzeCurrentChallenges } from '../services/supportSystemService';
import FamilyMemberDetailView from './FamilyMemberDetailView';

interface FamilyHubScreenProps {
  familyMembers: FamilyMember[];
  onAdd: () => void;
  onEdit: (familyMember: FamilyMember) => void;
  onDelete: (familyMemberId: string) => void;
  onBack: () => void;
}

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

const FamilyMemberCard: React.FC<{
    familyMember: FamilyMember;
    onView: (familyMember: FamilyMember) => void;
    onEdit: (familyMember: FamilyMember) => void;
    onDelete: (familyMember: FamilyMember) => void;
}> = ({ familyMember, onView, onEdit, onDelete }) => {
    const analysis = analyzeCurrentChallenges(familyMember)[0]; // Get primary challenge

    const statusInfo: { [key in ChallengeAnalysis['level']]: { text: string, color: string } } = {
        High: { text: 'High Challenge', color: 'text-yellow-400' },
        Medium: { text: 'Medium Challenge', color: 'text-orange-400' },
        Low: { text: 'Low Challenge', color: 'text-gray-400' },
        Neutral: { text: 'Flowing Cycles', color: 'text-green-400' },
    };

    const currentStatus = statusInfo[analysis.level] || statusInfo.Neutral;

    return (
        <div className="bg-[#1A1A1A] border-2 border-gray-700 rounded-xl p-6 transition-all duration-300 hover:border-[#FF7A2F] hover:-translate-y-1 hover:shadow-xl flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white">{familyMember.fullName}</h3>
                    <p className={`text-sm font-semibold ${currentStatus.color}`}>{currentStatus.text}</p>
                </div>
                <WeatherIcon level={analysis.level} />
            </div>

            <div className="mt-6 flex flex-col space-y-3">
                <button
                    onClick={() => onView(familyMember)}
                    className="bg-[#FF7A2F] text-black py-2.5 px-4 rounded-lg text-sm font-semibold w-full hover:bg-[#ff8b50] transition-transform hover:scale-105"
                >
                    View Details
                </button>
                <div className="flex space-x-3">
                     <button
                        onClick={() => onEdit(familyMember)}
                        className="bg-gray-700/50 text-gray-300 py-2 px-4 rounded-lg text-sm font-semibold w-full hover:bg-gray-600/70 transition-colors"
                    >
                        Edit
                    </button>
                     <button
                        onClick={() => onDelete(familyMember)}
                        className="bg-red-900/40 text-red-400 py-2 px-4 rounded-lg text-sm font-semibold w-full hover:bg-red-900/60 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const ConfirmationModal: React.FC<{
    familyMember: FamilyMember;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ familyMember, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in" style={{animationDuration: '0.3s'}}>
        <div className="bg-[#1A1A1A] border-2 border-gray-700 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-4">Confirm Deletion</h2>
            <p className="text-[#D5CBA3] mb-8">
                Are you sure you want to remove <strong className="text-white">{familyMember.fullName}</strong> from your hub? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={onCancel}
                    className="bg-transparent border border-gray-600 text-gray-300 py-2 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors w-full"
                >
                    No, Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="bg-red-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors w-full"
                >
                    Yes, Delete
                </button>
            </div>
        </div>
    </div>
);


const FamilyHubScreen: React.FC<FamilyHubScreenProps> = ({ familyMembers, onAdd, onEdit, onDelete, onBack }) => {
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<FamilyMember | null>(null);
  const [familyMemberToDelete, setFamilyMemberToDelete] = useState<FamilyMember | null>(null);
  const [sortOption, setSortOption] = useState<'name' | 'weather'>('name');

  const sortedFamilyMembers = useMemo(() => {
    const getChallengeLevel = (familyMember: FamilyMember) => analyzeCurrentChallenges(familyMember)[0].level;
    const weatherOrder: Record<ChallengeAnalysis['level'], number> = { High: 4, Medium: 3, Low: 2, Neutral: 1 };

    const familyMembersCopy = [...familyMembers];

    if (sortOption === 'weather') {
        familyMembersCopy.sort((a, b) => {
            const levelA = weatherOrder[getChallengeLevel(a)] ?? 0;
            const levelB = weatherOrder[getChallengeLevel(b)] ?? 0;
            if (levelB !== levelA) {
                return levelB - levelA;
            }
            return a.fullName.localeCompare(b.fullName);
        });
    } else { // 'name'
        familyMembersCopy.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }
    return familyMembersCopy;
  }, [familyMembers, sortOption]);

  if (selectedFamilyMember) {
    return <FamilyMemberDetailView familyMember={selectedFamilyMember} onBack={() => setSelectedFamilyMember(null)} />
  }

  return (
    <div>
      <div className="text-center text-white mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-wider text-white">
          Family Support Hub
        </h1>
        <p className="text-base sm:text-lg opacity-95 text-[#D5CBA3]">Your family's current cosmic weather at a glance.</p>
      </div>

      {familyMembers.length > 0 && (
          <div className="flex justify-end mb-4">
            <div className="inline-flex items-center bg-[#1A1A1A] rounded-lg p-1 border-2 border-gray-700">
                <span className="text-sm text-gray-400 mr-2 pl-2">Sort by:</span>
                <button
                    onClick={() => setSortOption('name')}
                    className={`text-sm font-semibold py-1 px-4 rounded-md transition-all ${sortOption === 'name' ? 'bg-[#FF7A2F] text-black shadow-md' : 'text-gray-300 hover:bg-gray-600/50'}`}
                >
                    Name
                </button>
                <button
                    onClick={() => setSortOption('weather')}
                    className={`text-sm font-semibold py-1 px-4 rounded-md transition-all ${sortOption === 'weather' ? 'bg-[#FF7A2F] text-black shadow-md' : 'text-gray-300 hover:bg-gray-600/50'}`}
                >
                    Challenge
                </button>
            </div>
        </div>
      )}
        
      {familyMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sortedFamilyMembers.map(f => (
                <FamilyMemberCard 
                    key={f.id} 
                    familyMember={f}
                    onView={setSelectedFamilyMember}
                    onEdit={onEdit}
                    onDelete={setFamilyMemberToDelete}
                />
            ))}
        </div>
      ) : (
        <div className="text-center bg-[#000000] rounded-2xl p-8 sm:p-12 my-8">
            <p className="text-lg text-gray-400">Your Family Hub is empty.</p>
            <p className="text-gray-500 mt-2">Add a family member to start tracking their cosmic weather and learn how to support them.</p>
        </div>
      )}
      
      <div className="text-center flex flex-col md:flex-row gap-4 justify-center">
        <button
            onClick={onAdd}
            className="bg-[#C6E0C2]/20 text-[#C6E0C2] py-3 px-8 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-[#C6E0C2]/40"
        >
            + Add New Family Member
        </button>
         <button onClick={onBack} className="bg-transparent border border-gray-600 text-gray-300 py-3 px-8 rounded-lg text-base font-semibold hover:bg-gray-800 transition-colors">
            Back to Dashboard
        </button>
      </div>
        
      {familyMemberToDelete && (
        <ConfirmationModal
            familyMember={familyMemberToDelete}
            onConfirm={() => {
                onDelete(familyMemberToDelete.id);
                setFamilyMemberToDelete(null);
            }}
            onCancel={() => setFamilyMemberToDelete(null)}
        />
      )}

    </div>
  );
};

export default FamilyHubScreen;
