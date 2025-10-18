export enum Screen {
  Signup = 'SIGNUP',
  Calculating = 'CALCULATING',
  Dashboard = 'DASHBOARD',
  ProfileSelection = 'PROFILE_SELECTION',
  Compatibility = 'COMPATIBILITY',
  FriendHub = 'FRIEND_HUB',
  AddEditFriend = 'ADD_EDIT_FRIEND',
  FamilyHub = 'FAMILY_HUB',
  AddEditFamilyMember = 'ADD_EDIT_FAMILY_MEMBER',
}

export interface UserData {
  id?: string;
  fullName: string;
  email: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:MM
}

export interface Friend {
  id: string;
  fullName: string;
  birthDate: string;
  birthTime?: string; // HH:MM
  notes?: string;
}

export interface FamilyMember {
  id: string;
  fullName: string;
  birthDate: string;
  birthTime?: string; // HH:MM
  notes?: string;
}

export interface StoredProfile {
  id: string;
  userData: UserData;
  profileData: ProfileData;
  friends: Friend[];
  family: FamilyMember[];
}

export interface FriendData {
  fullName:string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:MM
  notes?: string;
}

export interface FamilyMemberData {
  fullName:string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:MM
  notes?: string;
}

export interface ChallengeAnalysis {
  type: 'Numerology' | 'Astrology' | 'Chinese Zodiac';
  level: 'High' | 'Medium' | 'Low' | 'Neutral';
  title: string;
  description: string;
  recommendation?: string; // To be filled by AI
}

export interface DailyForecast {
  theme: string;
  affirmation: string;
  nudge: string;
}

export interface DailyBreakdown {
    day: string; // e.g., "Monday"
    insight: string;
}

export interface WeeklyForecast {
    theme: string;
    overview: string;
    dailyBreakdown: DailyBreakdown[];
    weeklyAdvice: string;
}

export interface NumerologyProfile {
  lifePath: number;
  birthday: number;
  expression: number;
  soulUrge: number;
  personalYear: number;
  personalYearTheme: string;
  personalYearAlertType: 'good' | 'warning' | 'neutral';
}

export interface AstrologyProfile {
  sunSign: string;
  sunSignSymbol: string;
  moonSign: string;
  risingSign: string;
  sunMoonRisingInteraction: string;
}

export interface ChineseZodiacProfile {
  animal: string;
  animalSymbol: string;
  element: string;
}

export interface ProfileData {
  numerology: NumerologyProfile;
  astrology: AstrologyProfile;
  chinese: ChineseZodiacProfile;
  cosmicTheme: string;
  cosmicIcon?: string;
}

export interface CompatibilityScores {
  numerology: "High" | "Medium" | "Low";
  astrology: "High" | "Medium" | "Low";
  chinese: "High" | "Medium" | "Low";
  overall: { label: string; color: string };
}

export interface CompatibilityResult {
  friendProfile: ProfileData;
  scores: CompatibilityScores;
  summary: string;
}