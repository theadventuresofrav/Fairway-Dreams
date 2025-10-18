import React, { useState, useCallback, useEffect } from 'react';
// FIX: Added FriendData to the import from './types' to resolve type error on line 84.
import { UserData, ProfileData, Screen, StoredProfile, Friend, FriendData, FamilyMember, FamilyMemberData } from './types';
import SignupScreen from './components/SignupScreen';
import CalculatingScreen from './components/CalculatingScreen';
import DashboardScreen from './components/DashboardScreen';
import ProfileSelectionScreen from './components/ProfileSelectionScreen';
import CompatibilityChecker from './components/CompatibilityChecker';
import FriendHubScreen from './components/FriendHubScreen';
import AddEditFriendScreen from './components/AddEditFriendScreen';
import FamilyHubScreen from './components/FamilyHubScreen';
import AddEditFamilyMemberScreen from './components/AddEditFamilyMemberScreen';
import OnboardingModal from './components/OnboardingModal'; // New
import { generateMetaphysicalProfile, generateCosmicIcon } from './services/geminiService';

const APP_STORAGE_KEY = 'fairway_dreams_profiles';
const ONBOARDING_SEEN_KEY = 'fairway_dreams_onboarding_seen';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Calculating);
  const [profiles, setProfiles] = useState<StoredProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<StoredProfile | null>(null);
  const [editingProfile, setEditingProfile] = useState<UserData | null>(null);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [editingFamilyMember, setEditingFamilyMember] = useState<FamilyMember | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [successTheme, setSuccessTheme] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  useEffect(() => {
    setLoadingMessage('Loading Your Cosmic Blueprints...');
    let loadedProfiles: StoredProfile[] = [];
    let onboardingSeen = false;
    try {
      const storedProfiles = localStorage.getItem(APP_STORAGE_KEY);
      if (storedProfiles) {
        loadedProfiles = JSON.parse(storedProfiles);
        setProfiles(loadedProfiles);
      }
      const storedOnboardingFlag = localStorage.getItem(ONBOARDING_SEEN_KEY);
      if (storedOnboardingFlag) {
          onboardingSeen = JSON.parse(storedOnboardingFlag);
      }
    } catch (e) {
      console.error("Could not load profiles from storage:", e);
      setError("There was an error loading your saved profiles.");
    }
    
    // The timeout creates a smoother loading experience, showing the initial loading screen briefly.
    setTimeout(() => {
        if (loadedProfiles.length === 0 && !onboardingSeen) {
            setShowOnboarding(true);
            setScreen(Screen.Signup); // Set screen behind the modal
        } else {
            setScreen(loadedProfiles.length > 0 ? Screen.ProfileSelection : Screen.Signup);
        }
    }, 500);
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(profiles));
    } catch (e) {
        console.error("Could not save profiles to storage:", e);
    }
  }, [profiles]);
  
  const handleCloseOnboarding = () => {
      setShowOnboarding(false);
      try {
          localStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
      } catch (e) {
          console.error("Could not save onboarding status to storage:", e);
      }
  };

  const handleSaveProfile = useCallback(async (data: UserData) => {
    setError(null);
    setSuccessTheme(null);
    const isEditing = !!data.id;
    setLoadingMessage(isEditing ? 'Updating Cosmic Blueprint...' : 'Calculating Cosmic Blueprint...');
    setScreen(Screen.Calculating);

    try {
      const profileData = await generateMetaphysicalProfile(data);
      const cosmicIcon = await generateCosmicIcon(profileData.cosmicTheme);
      const profileId = isEditing ? data.id! : new Date().toISOString();
      
      const existingProfile = profiles.find(p => p.id === profileId);
      
      const newProfile: StoredProfile = {
        id: profileId,
        userData: { ...data, id: profileId },
        profileData: { ...profileData, cosmicIcon },
        friends: isEditing ? existingProfile?.friends || [] : [], // Preserve friends on edit
        family: isEditing ? existingProfile?.family || [] : [], // Preserve family on edit
      };

      if (isEditing) {
        setProfiles(prev => prev.map(p => p.id === profileId ? newProfile : p));
      } else {
        setProfiles(prev => [...prev, newProfile]);
      }
      
      setEditingProfile(null);
      setSuccessTheme(profileData.cosmicTheme);
      setScreen(Screen.Signup);

    } catch (e) {
      console.error("Failed to generate/update profile:", e);
      // The Gemini service throws specific, user-friendly error messages.
      // We pass them directly to the UI.
      if (e instanceof Error) {
          setError(e.message);
      } else {
          // Fallback for unexpected, non-Error exceptions.
          setError('An unexpected error occurred. Please try again.');
      }
      setScreen(Screen.Signup);
    }
  }, [profiles]);

  const handleSaveFriend = (friendData: FriendData) => {
      if (!selectedProfile) return;

      const isEditing = !!editingFriend;
      let updatedFriends: Friend[];

      if (isEditing) {
          updatedFriends = selectedProfile.friends.map(f => f.id === editingFriend.id ? { ...editingFriend, ...friendData } : f);
      } else {
          const newFriend: Friend = { id: new Date().toISOString(), ...friendData };
          updatedFriends = [...selectedProfile.friends, newFriend];
      }
      
      const updatedProfile = { ...selectedProfile, friends: updatedFriends };
      
      setSelectedProfile(updatedProfile);
      setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
      
      setEditingFriend(null);
      setScreen(Screen.FriendHub);
  };
  
  const handleDeleteFriend = (friendId: string) => {
    if (!selectedProfile) return;

    const updatedFriends = selectedProfile.friends.filter(f => f.id !== friendId);
    const updatedProfile = { ...selectedProfile, friends: updatedFriends };
      
    setSelectedProfile(updatedProfile);
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
  };

  const handleSaveFamilyMember = (familyMemberData: FamilyMemberData) => {
      if (!selectedProfile) return;

      const isEditing = !!editingFamilyMember;
      let updatedFamilyMembers: FamilyMember[];

      if (isEditing) {
          updatedFamilyMembers = selectedProfile.family.map(f => f.id === editingFamilyMember.id ? { ...editingFamilyMember, ...familyMemberData } : f);
      } else {
          const newFamilyMember: FamilyMember = { id: new Date().toISOString(), ...familyMemberData };
          updatedFamilyMembers = [...selectedProfile.family, newFamilyMember];
      }
      
      const updatedProfile = { ...selectedProfile, family: updatedFamilyMembers };
      
      setSelectedProfile(updatedProfile);
      setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
      
      setEditingFamilyMember(null);
      setScreen(Screen.FamilyHub);
  };
  
  const handleDeleteFamilyMember = (familyMemberId: string) => {
    if (!selectedProfile) return;

    const updatedFamily = selectedProfile.family.filter(f => f.id !== familyMemberId);
    const updatedProfile = { ...selectedProfile, family: updatedFamily };
      
    setSelectedProfile(updatedProfile);
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
  };

  const handleRegenerateProfile = useCallback(async () => {
    if (!selectedProfile) return;

    setError(null);
    setLoadingMessage('Regenerating Cosmic Blueprint...');
    setScreen(Screen.Calculating);

    try {
        const newProfileData = await generateMetaphysicalProfile(selectedProfile.userData);
        const cosmicIcon = await generateCosmicIcon(newProfileData.cosmicTheme);
        
        const regeneratedProfile: StoredProfile = {
            ...selectedProfile,
            profileData: { ...newProfileData, cosmicIcon },
        };

        setProfiles(prev => prev.map(p => p.id === regeneratedProfile.id ? regeneratedProfile : p));
        setSelectedProfile(regeneratedProfile);

        setTimeout(() => {
            setScreen(Screen.Dashboard);
        }, 1000);

    } catch (e) {
        console.error("Failed to regenerate profile:", e);
        setError(`Failed to regenerate your blueprint. Please try again later.`);
        setScreen(Screen.Dashboard); 
    }
  }, [selectedProfile]);


  const handleSelectProfile = (profile: StoredProfile) => {
    setSelectedProfile(profile);
    setScreen(Screen.Dashboard);
  };
  
  const handleEditRequest = (profile: StoredProfile) => {
    setEditingProfile(profile.userData);
    setScreen(Screen.Signup);
  };
  
  const handleAddRequest = () => {
    setEditingProfile(null);
    setScreen(Screen.Signup);
  };

  const handleDeleteProfile = (profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  const handleBackToSelection = () => {
    setSelectedProfile(null);
    setEditingProfile(null);
    setEditingFriend(null);
    setEditingFamilyMember(null);
    setScreen(Screen.ProfileSelection);
  };

  const renderScreen = () => {
    switch (screen) {
      case Screen.Calculating:
        return <CalculatingScreen message={loadingMessage}/>;
      case Screen.ProfileSelection:
        return <ProfileSelectionScreen profiles={profiles} onSelect={handleSelectProfile} onEdit={handleEditRequest} onDelete={handleDeleteProfile} onAdd={handleAddRequest}/>
      case Screen.Dashboard:
        return selectedProfile ? (
          <DashboardScreen
            profile={selectedProfile.profileData}
            userData={selectedProfile.userData}
            onReset={handleBackToSelection}
            onCheckCompatibility={() => setScreen(Screen.Compatibility)}
            onOpenSupportHub={() => setScreen(Screen.FriendHub)}
            onOpenFamilyHub={() => setScreen(Screen.FamilyHub)}
            onRegenerate={handleRegenerateProfile}
          />
        ) : <CalculatingScreen message="Loading Dashboard..." />;
       case Screen.Compatibility:
        return selectedProfile ? (
          <CompatibilityChecker 
            userProfile={selectedProfile.profileData} 
            onBack={() => setScreen(Screen.Dashboard)}
          />
        ) : <ProfileSelectionScreen profiles={profiles} onSelect={handleSelectProfile} onEdit={handleEditRequest} onDelete={handleDeleteProfile} onAdd={handleAddRequest}/>;
      case Screen.FriendHub:
        return selectedProfile ? (
            <FriendHubScreen
                friends={selectedProfile.friends}
                onAdd={() => setScreen(Screen.AddEditFriend)}
                onEdit={(friend) => { setEditingFriend(friend); setScreen(Screen.AddEditFriend); }}
                onDelete={handleDeleteFriend}
                onBack={() => setScreen(Screen.Dashboard)}
            />
        ) : <CalculatingScreen message="Loading Hub..." />;
      case Screen.AddEditFriend:
        return (
            <AddEditFriendScreen
                onSave={handleSaveFriend}
                initialData={editingFriend}
                onCancel={() => { setEditingFriend(null); setScreen(Screen.FriendHub); }}
            />
        );
      case Screen.FamilyHub:
        return selectedProfile ? (
            <FamilyHubScreen
                familyMembers={selectedProfile.family}
                onAdd={() => setScreen(Screen.AddEditFamilyMember)}
                onEdit={(member) => { setEditingFamilyMember(member); setScreen(Screen.AddEditFamilyMember); }}
                onDelete={handleDeleteFamilyMember}
                onBack={() => setScreen(Screen.Dashboard)}
            />
        ) : <CalculatingScreen message="Loading Hub..." />;
      case Screen.AddEditFamilyMember:
        return (
            <AddEditFamilyMemberScreen
                onSave={handleSaveFamilyMember}
                initialData={editingFamilyMember}
                onCancel={() => { setEditingFamilyMember(null); setScreen(Screen.FamilyHub); }}
            />
        );
      case Screen.Signup:
      default:
        return <SignupScreen
          onSave={handleSaveProfile}
          initialData={editingProfile}
          onCancel={profiles.length > 0 ? handleBackToSelection : undefined}
          error={error}
          successTheme={successTheme}
          onContinue={() => {
            setSuccessTheme(null);
            setScreen(Screen.ProfileSelection);
          }}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] font-sans p-4 sm:p-6 text-[#D5CBA3]">
      <div className="container max-w-4xl mx-auto">
        {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
