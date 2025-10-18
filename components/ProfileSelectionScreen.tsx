
import React, { useState } from 'react';
import { StoredProfile } from '../types';

interface ProfileSelectionScreenProps {
  profiles: StoredProfile[];
  onSelect: (profile: StoredProfile) => void;
  onEdit: (profile: StoredProfile) => void;
  onDelete: (profileId: string) => void;
  onAdd: () => void;
}

const ProfileCard: React.FC<{
    profile: StoredProfile;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ profile, onSelect, onEdit, onDelete }) => {
    const { userData, profileData } = profile;
    const { numerology, astrology, chinese } = profileData;

    return (
        <div className="bg-[#1A1A1A] border-2 border-gray-700 rounded-xl p-6 transition-all duration-300 hover:border-[#FF7A2F] hover:-translate-y-1 hover:shadow-xl flex flex-col">
            <div className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                    {profileData.cosmicIcon && (
                        <div
                            className="w-12 h-12 flex-shrink-0 text-[#FF7A2F]"
                            dangerouslySetInnerHTML={{ __html: profileData.cosmicIcon }}
                        />
                    )}
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white">{userData.fullName}</h3>
                        <p className="text-sm text-gray-400">{new Date(userData.birthDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
                    </div>
                </div>
                
                <div className="flex justify-center gap-4 my-4">
                    <div className="text-center">
                        <span className="text-2xl sm:text-3xl font-bold block text-[#C6E0C2]">{numerology.lifePath}</span>
                        <span className="text-xs uppercase">Life Path</span>
                    </div>
                    <div className="text-center">
                        <span className="text-2xl sm:text-3xl font-bold block text-[#D5CBA3]">{astrology.sunSignSymbol}</span>
                        <span className="text-xs uppercase">{astrology.sunSign}</span>
                    </div>
                     <div className="text-center">
                        <span className="text-2xl sm:text-3xl font-bold block text-[#FF7A2F]">{chinese.animalSymbol}</span>
                        <span className="text-xs uppercase">{chinese.animal}</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-col space-y-3">
                <button
                    onClick={onSelect}
                    className="bg-[#FF7A2F] text-black py-2.5 px-4 rounded-lg text-sm font-semibold w-full hover:bg-[#ff8b50] transition-transform hover:scale-105"
                >
                    View Dashboard
                </button>
                <div className="flex space-x-3">
                     <button
                        onClick={onEdit}
                        className="bg-gray-700/50 text-gray-300 py-2 px-4 rounded-lg text-sm font-semibold w-full hover:bg-gray-600/70 transition-colors"
                    >
                        Edit
                    </button>
                     <button
                        onClick={onDelete}
                        className="bg-red-900/40 text-red-400 py-2 px-4 rounded-lg text-sm font-semibold w-full hover:bg-red-900/60 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const EditConfirmationModal: React.FC<{
    profile: StoredProfile;
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ profile, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in" style={{animationDuration: '0.3s'}}>
        <div className="bg-[#1A1A1A] border-2 border-gray-700 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-4">Confirm Edit</h2>
            <p className="text-[#D5CBA3] mb-8">
                Editing core details like name or birth date for <strong className="text-white">{profile.userData.fullName}</strong> will require a full regeneration of their metaphysical analysis. Are you sure you want to proceed?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={onCancel}
                    className="bg-transparent border border-gray-600 text-gray-300 py-2 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors w-full"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="bg-yellow-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-yellow-700 transition-colors w-full"
                >
                    Yes, Edit Profile
                </button>
            </div>
        </div>
    </div>
);

const ProfileSelectionScreen: React.FC<ProfileSelectionScreenProps> = ({ profiles, onSelect, onEdit, onDelete, onAdd }) => {
  const [profileToEdit, setProfileToEdit] = useState<StoredProfile | null>(null);

  const handleConfirmEdit = () => {
    if (profileToEdit) {
      onEdit(profileToEdit);
      setProfileToEdit(null);
    }
  };
  
  return (
    <div>
      <div className="text-center text-white mb-10 py-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-wider text-white">
          Your Profiles
        </h1>
        <p className="text-lg opacity-95 text-[#D5CBA3]">Select a profile to view or add a new one.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {profiles.map(p => (
            <ProfileCard 
                key={p.id} 
                profile={p}
                onSelect={() => onSelect(p)}
                onEdit={() => setProfileToEdit(p)}
                onDelete={() => {
                    if(confirm(`Are you sure you want to delete the profile for ${p.userData.fullName}?`)) {
                        onDelete(p.id);
                    }
                }}
            />
        ))}
      </div>
      
      <div className="text-center">
        <button
            onClick={onAdd}
            className="bg-[#C6E0C2]/20 text-[#C6E0C2] py-4 px-12 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-[#C6E0C2]/40 hover:shadow-lg"
        >
            + Add New Profile
        </button>
      </div>
      
      {profileToEdit && (
        <EditConfirmationModal
            profile={profileToEdit}
            onConfirm={handleConfirmEdit}
            onCancel={() => setProfileToEdit(null)}
        />
      )}

    </div>
  );
};

export default ProfileSelectionScreen;
