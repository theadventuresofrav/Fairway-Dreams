import { Friend, ChallengeAnalysis } from '../types';

// --- Numerology Helpers ---
function reduceNumber(n: number): number {
    if ([11, 22, 33].includes(n)) return n;
    let sum = n;
    while (sum > 9) {
        sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    return sum;
}

// New helper function to calculate Life Path, essential for conflict detection.
function calculateLifePath(dob: string): number {
  const digits = dob.replace(/-/g, "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);

  while (![11, 22, 33].includes(sum) && sum > 9) {
    sum = sum.toString().split("").map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

export function calculatePersonalYear(birthDate: string): number {
    const date = new Date(birthDate);
    const currentYear = new Date().getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return reduceNumber(month + day + currentYear);
}

export function calculatePersonalMonth(birthDate: string): number {
    const personalYear = calculatePersonalYear(birthDate);
    const currentMonth = new Date().getMonth() + 1;
    return reduceNumber(personalYear + currentMonth);
}

// --- Chinese Zodiac Helpers ---
const chineseZodiacAnimals = ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'];
const getChineseZodiacAnimal = (year: number): string => {
    // Corrected for proper modulo behavior with negative numbers if ever needed, and base year.
    return chineseZodiacAnimals[(year - 1900) % 12];
};
const chineseZodiacClashMap: { [key: string]: string } = {
    'Rat': 'Horse', 'Horse': 'Rat',
    'Ox': 'Goat', 'Goat': 'Ox',
    'Tiger': 'Monkey', 'Monkey': 'Tiger',
    'Rabbit': 'Rooster', 'Rooster': 'Rabbit',
    'Dragon': 'Dog', 'Dog': 'Dragon',
    'Snake': 'Pig', 'Pig': 'Snake',
};

// --- Astrology Helpers (Simplified for current period) ---
const currentSlowPlanetPositions = {
    'Saturn': 'Pisces',
    'Pluto': 'Aquarius', 
};
const mercuryRetrogradePeriods = [ // YYYY-MM-DD
    { start: '2024-04-01', end: '2024-04-25' },
    { start: '2024-08-05', end: '2024-08-28' },
    { start: '2024-11-25', end: '2024-12-15' },
    // Add 2025 dates for future-proofing
    { start: '2025-03-14', end: '2025-04-07' },
    { start: '2025-07-17', end: '2025-08-11' },
    { start: '2025-11-09', end: '2025-11-29' },
];
const zodiacAspects: { [key: string]: { square: string[], opposition: string[] } } = {
    'Aries': { square: ['Cancer', 'Capricorn'], opposition: ['Libra'] },
    'Taurus': { square: ['Leo', 'Aquarius'], opposition: ['Scorpio'] },
    'Gemini': { square: ['Virgo', 'Pisces'], opposition: ['Sagittarius'] },
    'Cancer': { square: ['Aries', 'Libra'], opposition: ['Capricorn'] },
    'Leo': { square: ['Taurus', 'Scorpio'], opposition: ['Aquarius'] },
    'Virgo': { square: ['Gemini', 'Sagittarius'], opposition: ['Pisces'] },
    'Libra': { square: ['Cancer', 'Capricorn'], opposition: ['Aries'] },
    'Scorpio': { square: ['Leo', 'Aquarius'], opposition: ['Taurus'] },
    'Sagittarius': { square: ['Virgo', 'Pisces'], opposition: ['Gemini'] },
    'Capricorn': { square: ['Aries', 'Libra'], opposition: ['Cancer'] },
    'Aquarius': { square: ['Taurus', 'Scorpio'], opposition: ['Leo'] },
    'Pisces': { square: ['Gemini', 'Sagittarius'], opposition: ['Virgo'] },
};
const getZodiacSign = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    return "";
};


export const analyzeCurrentChallenges = (friend: Friend): ChallengeAnalysis[] => {
    const analyses: ChallengeAnalysis[] = [];
    const today = new Date();
    // Ensure the date is interpreted correctly regardless of timezone
    const [year, month, day] = friend.birthDate.split('-').map(Number);
    const friendBirthDate = new Date(year, month - 1, day);
    
    const currentYear = today.getFullYear();
    
    // --- Numerology Analysis ---
    const lifePathNumber = calculateLifePath(friend.birthDate);
    const currentPersonalYear = calculatePersonalYear(friend.birthDate);
    const currentPersonalMonth = calculatePersonalMonth(friend.birthDate);

    const pyChallenges = [4, 7, 9];
    if (pyChallenges.includes(currentPersonalYear)) {
        let description = '';
        switch(currentPersonalYear) {
            case 4: description = "A year of hard work, structure, and limitations. Can feel restrictive and demanding, requiring patience and effort."; break;
            case 7: description = "A year of introspection, analysis, and spiritual growth. Can feel isolating or confusing as they seek deeper meaning."; break;
            case 9: description = "A year of endings, completion, and release. Can feel emotional and bring a sense of loss as they clear space for the new."; break;
        }
        analyses.push({
            type: 'Numerology',
            level: 'High',
            title: `Personal Year ${currentPersonalYear}`,
            description,
        });
    }

    if (currentPersonalMonth === 5) {
        analyses.push({
            type: 'Numerology',
            level: 'Medium',
            title: `Personal Month 5`,
            description: 'A month of unexpected change, freedom, and potential chaos. Plans may go awry, requiring flexibility.',
        });
    }

    // Expanded: Life Path vs Personal Year conflict map
    const lpPyConflictMap: { [key: number]: number[] } = {
        1: [7, 9],       // Action vs. Introspection/Endings
        2: [1, 5],       // Cooperation vs. Independence/Change
        3: [4, 7],       // Creativity vs. Structure/Introspection
        4: [3, 5],       // Structure vs. Creativity/Freedom
        5: [2, 4, 6],    // Freedom vs. Patience/Structure/Responsibility
        6: [1, 5],       // Responsibility vs. Self-focus/Freedom
        7: [1, 6, 8],    // Introspection vs. Action/Social/Materialism
        8: [7, 9],       // Ambition vs. Introspection/Endings
        9: [4, 8],       // Humanitarianism vs. Structure/Materialism
        11: [1, 5],      // (as a 2)
        22: [3, 5],      // (as a 4)
        33: [1, 5],      // (as a 6)
    };

    if (lpPyConflictMap[lifePathNumber]?.includes(currentPersonalYear)) {
        analyses.push({
            type: 'Numerology',
            level: 'Medium',
            title: `Life Path / Personal Year Conflict`,
            description: `Their natural energy as a Life Path ${lifePathNumber} may feel constrained or at odds with the demands of a Personal Year ${currentPersonalYear}, leading to internal friction.`,
        });
    }

    // --- Chinese Zodiac Analysis ---
    const friendAnimal = getChineseZodiacAnimal(friendBirthDate.getFullYear());
    const currentYearAnimal = getChineseZodiacAnimal(currentYear);

    if (chineseZodiacClashMap[friendAnimal] === currentYearAnimal) {
        analyses.push({
            type: 'Chinese Zodiac',
            level: 'High',
            title: `Zodiac Clash Year (${friendAnimal} vs. ${currentYearAnimal})`,
            description: `This is a year of direct opposition, potentially bringing significant external challenges, conflicts, and life changes.`,
        });
    }
    
    // --- Astrology Analysis (Simplified) ---
    const friendSunSign = getZodiacSign(friendBirthDate);
    
    // Check slow-moving planets
    for (const [planet, sign] of Object.entries(currentSlowPlanetPositions)) {
        if (!zodiacAspects[sign]) continue;
        const challengingAspects = [...zodiacAspects[sign].square, zodiacAspects[sign].opposition];
        if (challengingAspects.includes(friendSunSign)) {
            analyses.push({
                type: 'Astrology',
                level: 'High',
                title: `${planet} Transit Challenge`,
                description: `The current position of ${planet} in ${sign} forms a tense aspect with their Sun in ${friendSunSign}, indicating a period of deep lessons, transformation, or restriction.`,
            });
        }
    }

    // Check for Mercury Retrograde
    const todayStr = today.toISOString().split('T')[0];
    for (const period of mercuryRetrogradePeriods) {
        if (todayStr >= period.start && todayStr <= period.end) {
            analyses.push({
                type: 'Astrology',
                level: 'Low',
                title: 'Mercury Retrograde',
                description: `A general period of miscommunications, tech issues, and travel delays. Patience and double-checking plans are key for everyone.`,
            });
            break; // only add it once
        }
    }

    // --- Final Check ---
    if (analyses.length === 0) {
        analyses.push({
            type: 'Numerology',
            level: 'Neutral',
            title: 'Flowing Cycles',
            description: `Currently in a Personal Year ${currentPersonalYear} and Personal Month ${currentPersonalMonth}, indicating a period of steady energy without major cosmic clashes.`,
        });
    }

    return analyses;
};