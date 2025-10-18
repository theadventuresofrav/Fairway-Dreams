import { GoogleGenAI, Type } from "@google/genai";
import { UserData, ProfileData, CompatibilityScores, ChallengeAnalysis, DailyForecast, WeeklyForecast } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const profileSchema = {
    type: Type.OBJECT,
    properties: {
        numerology: {
            type: Type.OBJECT,
            properties: {
                lifePath: { type: Type.INTEGER, description: "The user's Life Path number (reduced to a single digit, unless it's a master number 11, 22, or 33)." },
                birthday: { type: Type.INTEGER, description: "The user's birthday number (the day of the month)." },
                expression: { type: Type.INTEGER, description: "The user's Expression (or Destiny) number, calculated from their full name." },
                soulUrge: { type: Type.INTEGER, description: "The user's Soul Urge (or Heart's Desire) number, calculated from the vowels in their name." },
                personalYear: { type: Type.INTEGER, description: "The user's Personal Year number for the current year, reduced to a single digit." },
                personalYearTheme: { type: Type.STRING, description: "A short, encouraging theme for the personal year. E.g., 'Change & Freedom' or 'New Beginnings'."},
                personalYearAlertType: { type: Type.STRING, description: "The type of alert for the personal year. Can be 'good', 'warning', or 'neutral'. Good for years 1, 3, 5, 6, 8. Warning for 4, 9. Neutral for 2, 7."}
            },
        },
        astrology: {
            type: Type.OBJECT,
            properties: {
                sunSign: { type: Type.STRING, description: "The user's Western zodiac sun sign (e.g., 'Aries', 'Taurus')." },
                sunSignSymbol: { type: Type.STRING, description: "The single emoji symbol for the sun sign (e.g., '♈', '♉')."},
                moonSign: { type: Type.STRING, description: "The user's Moon sign. If birth time is not provided, return 'Not Available'." },
                risingSign: { type: Type.STRING, description: "The user's Rising (Ascendant) sign. If birth time is not provided, return 'Not Available'." },
                sunMoonRisingInteraction: { type: Type.STRING, description: "A brief (1-2 sentence) interpretation of how the Sun, Moon, and Rising signs interact to shape the user's core personality. If Moon or Rising is unavailable, explain the importance of the Sun sign as the primary identity and that birth time is required for a full reading." }
            },
        },
        chinese: {
            type: Type.OBJECT,
            properties: {
                animal: { type: Type.STRING, description: "The user's Chinese zodiac animal (e.g., 'Dragon', 'Rabbit')." },
                animalSymbol: { type: Type.STRING, description: "The single emoji symbol for the Chinese animal (e.g., '🐉', '🐇')."},
                element: { type: Type.STRING, description: "The element associated with the user's birth year (e.g., 'Earth', 'Wood')." },
            },
        },
        cosmicTheme: { 
            type: Type.STRING, 
            description: "A short, mystical, and encouraging theme (3-5 words) for the user based on their most prominent metaphysical trait (e.g., 'The Intuitive Leader', 'The Harmonious Builder', 'The Cosmic Pioneer')." 
        },
    },
};

const forecastSchema = {
    type: Type.OBJECT,
    properties: {
        theme: { type: Type.STRING, description: "A single, powerful keyword for the day (e.g., 'Creativity', 'Rest', 'Connection')." },
        affirmation: { type: Type.STRING, description: "A short, personal, and empowering affirmation for the user to carry with them today." },
        nudge: { type: Type.STRING, description: "A gentle, actionable piece of advice for the day. (e.g., 'Take 10 minutes for quiet reflection.' or 'Reach out to a friend you miss.')." },
    },
};

const weeklyForecastSchema = {
    type: Type.OBJECT,
    properties: {
        theme: { type: Type.STRING, description: "A high-level theme for the week (e.g., 'Productivity & Planning', 'Emotional Clarity')." },
        overview: { type: Type.STRING, description: "A 1-2 sentence overview of the week's energetic landscape for the user." },
        dailyBreakdown: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "The day of the week (e.g., 'Monday')." },
                    insight: { type: Type.STRING, description: "A very brief insight or focus for that specific day." },
                },
            },
            description: "An array of 7 objects, one for each day from Monday to Sunday."
        },
        weeklyAdvice: { type: Type.STRING, description: "A key piece of actionable advice for making the most of the week." },
    },
};

const FALLBACK_COSMIC_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"></path></svg>`;

export const generateCosmicIcon = async (theme: string): Promise<string> => {
    const prompt = `
        Generate a single, minimalist, mystical SVG icon representing the theme: "${theme}".
        
        **Strict Style Guidelines:**
        - **Simplicity:** The design must be clean and symbolic, suitable for a small icon.
        - **Line Weight:** Use a consistent, medium line weight throughout the icon.
        - **Negative Space:** Make intelligent use of negative space to create a sense of depth and mystery.
        - **Balance:** The design must be balanced and centered within the viewbox.
        - **Single Path:** Aim for a single, continuous path where possible to maintain elegance.
        
        **Technical SVG Requirements (MUST be followed):**
        - The SVG MUST have a viewBox="0 0 24 24".
        - The SVG MUST NOT have width or height attributes.
        - The design MUST be single-color. Use "currentColor" for the fill or stroke attribute so it can be styled with CSS.
        
        **Output Format:**
        The response must ONLY be the raw SVG string, starting with "<svg" and ending with "</svg>". Do not include any other text, explanations, markdown formatting, or code fences.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        const svgText = response.text.trim();
        // Basic validation
        if (svgText.startsWith('<svg') && svgText.endsWith('</svg>')) {
            return svgText;
        }
        console.warn("Received non-SVG response for icon generation, using fallback.", svgText);
        return FALLBACK_COSMIC_ICON;
    } catch (error) {
        console.error("Error generating cosmic icon, using fallback:", error);
        return FALLBACK_COSMIC_ICON;
    }
};

export const generateMetaphysicalProfile = async (userData: UserData): Promise<ProfileData> => {
  const prompt = `
    Analyze the following user data to create a complete metaphysical profile.
    Full Name: ${userData.fullName}
    Birth Date: ${userData.birthDate}
    Birth Time: ${userData.birthTime || 'Not provided'}
    Current Year: ${new Date().getFullYear()}

    Calculate the following and return the data in the specified JSON format.
    1.  **Numerology**:
        -   **Life Path Number**: From the full birth date (month + day + year). Reduce to a single digit unless it's a master number 11, 22, or 33.
        -   **Birthday Number**: Just the day of the month from the birth date.
        -   **Expression Number**: From the full name using the Pythagorean chart (A=1, B=2, etc.).
        -   **Soul Urge Number**: From the vowels in the full name (A=1, E=5, I=9, O=6, U=3, Y is sometimes a vowel but for simplicity here treat it as a consonant unless it is the only vowel sound in a syllable).
        -   **Personal Year**: For the current year, from the user's birth month and day.
        -   Provide a short theme and alert type for the personal year.
    2.  **Western Astrology**:
        -   Determine the user's Sun Sign based on their birth date.
        -   **If birth time is provided**, determine their Moon Sign and Rising (Ascendant) Sign. If not, return "Not Available" for both.
        -   Provide the corresponding emoji symbol for the sun sign. (Aries: ♈, Taurus: ♉, Gemini: ♊, Cancer: ♋, Leo: ♌, Virgo: ♍, Libra: ♎, Scorpio: ♏, Sagittarius: ♐, Capricorn: ♑, Aquarius: ♒, Pisces: ♓).
        -   Generate a brief (1-2 sentence) interpretation of how the Sun, Moon, and Rising signs interact. If Moon/Rising are unavailable, explain the importance of the Sun sign as the core identity.
    3.  **Chinese Zodiac**:
        -   Determine the user's animal and element based on their birth year.
        -   Provide the corresponding emoji symbol for the animal. (Rat: 🐀, Ox: 🐂, Tiger: 🐅, Rabbit: 🐇, Dragon: 🐉, Snake: 🐍, Horse: 🐎, Goat: 🐐, Monkey: 🐒, Rooster: 🐓, Dog: 🐕, Pig: 🐖).
    4.  **Cosmic Theme**:
        -   Based on the most dominant trait (e.g., a master Life Path number, a powerful Sun Sign), create a short, mystical, and encouraging theme (3-5 words) for the user. Examples: 'The Intuitive Leader', 'The Harmonious Builder', 'The Cosmic Pioneer'.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: profileSchema,
        },
    });

    const jsonText = response.text.trim();
    if (!jsonText.startsWith('{') && !jsonText.startsWith('[')) {
        console.error("Gemini API returned non-JSON text:", jsonText);
        throw new Error("The AI service returned an unexpected response format. Please try again.");
    }
    return JSON.parse(jsonText) as ProfileData;

  } catch (error) {
    console.error("Error in generateMetaphysicalProfile:", error);

    // This error comes from JSON.parse() failing
    if (error instanceof SyntaxError) {
        throw new Error("The AI service returned a malformed response. Please try regenerating.");
    }
    
    // This handles our custom error and any other Error instances from the API call.
    if (error instanceof Error) {
        // Pass through our specific 'unexpected format' message
        if (error.message.includes("unexpected response format")) {
            throw error;
        }
        // Otherwise, assume it's a general service availability issue
        throw new Error("The AI service seems to be unavailable right now. Please check your connection or try again in a few moments.");
    }
    
    // Fallback for any other kind of thrown object
    throw new Error("An unknown error occurred while contacting the AI service.");
  }
};

export const generateDailyForecast = async (profile: ProfileData): Promise<DailyForecast> => {
    const today = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const prompt = `
        Based on the user's core metaphysical profile, generate a concise, personalized forecast for today, ${today}.
        
        User Profile:
        - Life Path: ${profile.numerology.lifePath}
        - Sun Sign: ${profile.astrology.sunSign}
        - Chinese Animal: ${profile.chinese.animal}
        - Current Personal Year: ${profile.numerology.personalYear}

        Analyze the blend of these energies for today and provide an uplifting, gentle, and actionable forecast. It must include:
        1. A single, powerful 'theme' keyword for the day.
        2. A short, personal, and empowering 'affirmation' directly related to the theme.
        3. A gentle, actionable 'nudge' as a piece of advice for the day.
        
        Return it in the specified JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: forecastSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as DailyForecast;
    } catch (error) {
        console.error("Error generating daily forecast:", error);
        // Return a gentle default forecast on error
        return {
            theme: "Presence",
            affirmation: "I am grounded and centered in the present moment.",
            nudge: "Take a few deep breaths and notice the world around you. Find a small moment of peace just for yourself."
        };
    }
};

export const generateWeeklyForecast = async (profile: ProfileData): Promise<WeeklyForecast> => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ...
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Set to Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Sunday

    const weekString = `the week of ${startOfWeek.toLocaleDateString(undefined, {month: 'long', day: 'numeric' })} - ${endOfWeek.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}`;

    const prompt = `
        Based on the user's core metaphysical profile, generate a personalized weekly forecast for ${weekString}.

        User Profile:
        - Life Path: ${profile.numerology.lifePath}
        - Sun Sign: ${profile.astrology.sunSign}
        - Chinese Animal: ${profile.chinese.animal}
        - Current Personal Year: ${profile.numerology.personalYear}

        Provide a strategic and uplifting forecast that includes:
        1. A high-level 'theme' for the week.
        2. A 1-2 sentence 'overview' of the week's energy.
        3. A 'dailyBreakdown' with a very brief insight for each day, Monday to Sunday.
        4. A key piece of 'weeklyAdvice' to help them navigate the week.

        Return the entire forecast in the specified JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: weeklyForecastSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as WeeklyForecast;
    } catch (error) {
        console.error("Error generating weekly forecast:", error);
        return {
            theme: "Adaptability",
            overview: "This week encourages flexibility. Be open to shifts in your plans and look for opportunities in the unexpected.",
            dailyBreakdown: [
                { day: "Monday", insight: "Focus on communication." },
                { day: "Tuesday", insight: "Tackle a creative task." },
                { day: "Wednesday", insight: "A good day for networking." },
                { day: "Thursday", insight: "Handle practical matters." },
                { day: "Friday", insight: "Enjoy social connections." },
                { day: "Saturday", insight: "Rest and recharge." },
                { day: "Sunday", insight: "Reflect and plan ahead." },
            ],
            weeklyAdvice: "Stay grounded and adaptable. Your ability to pivot will be your greatest strength this week."
        };
    }
};

export const generateCompatibilitySummary = async (
    userProfile: ProfileData,
    friendProfile: ProfileData,
    scores: CompatibilityScores
): Promise<string> => {
    const prompt = `
      Analyze the friendship compatibility between two individuals based on their metaphysical profiles.

      Person 1 (User):
      - Life Path: ${userProfile.numerology.lifePath}
      - Sun Sign: ${userProfile.astrology.sunSign}
      - Chinese Zodiac: ${userProfile.chinese.animal}

      Person 2 (Friend):
      - Life Path: ${friendProfile.numerology.lifePath}
      - Sun Sign: ${friendProfile.astrology.sunSign}
      - Chinese Zodiac: ${friendProfile.chinese.animal}

      Compatibility Scores:
      - Numerology: ${scores.numerology}
      - Astrology: ${scores.astrology}
      - Chinese Zodiac: ${scores.chinese}
      - Overall: ${scores.overall.label}

      Based on this data, write a short, insightful, and encouraging summary (2-4 sentences) of their friendship dynamic. Focus on their potential strengths as friends and areas where they complement each other. Address them as "You" and "your friend". Keep the tone positive and mystical.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating compatibility summary:", error);
        return "Could not generate a summary at this time. However, the calculated scores show a promising connection!";
    }
};

export const generateSupportRecommendation = async (challenge: ChallengeAnalysis): Promise<string> => {
    if (challenge.level === 'Neutral') {
        return "This is a great time to connect and share in their positive energy. Celebrate their stability and enjoy the smooth flow of your friendship.";
    }
    
    const prompt = `
      A friend is experiencing a challenging metaphysical cycle.
      Challenge Type: ${challenge.type}
      Challenge Title: ${challenge.title}
      Challenge Description: ${challenge.description}
      
      Based on this, write a concise, empathetic, and actionable recommendation (2-3 sentences) for how to be a good friend during this specific period.
      The advice should be practical and encouraging. Start with a clear suggestion.
      
      Example for a "Personal Year 7":
      "This is a time of deep introspection for your friend. Give them the space they need, but send a simple message to let them know you're thinking of them. A thoughtful question or shared article might be more welcome than a big social invitation."
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating support recommendation:", error);
        return "Be a good listener and offer your support. Your presence alone can make a big difference during a challenging time.";
    }
}

const getReportPrompt = (userData: UserData, profile: ProfileData, reportType: string, reportTitle: string): string => {
    const profileSummary = `
- Name: ${userData.fullName}
- Life Path Number: ${profile.numerology.lifePath}
- Sun Sign: ${profile.astrology.sunSign}
- Chinese Zodiac Animal: ${profile.chinese.animal} (${profile.chinese.element})
- Other Numerology: Expression ${profile.numerology.expression}, Soul Urge ${profile.numerology.soulUrge}
- Current Personal Year: ${profile.numerology.personalYear}
    `;

    switch(reportType) {
        case 'life_path':
            return `Based on the user's profile, generate a detailed "${reportTitle}".\n\nUser Profile Summary:\n${profileSummary}\n\nThe report should be comprehensive (at least 4-5 paragraphs) and cover:\n1. The core meaning and purpose of their Life Path number.\n2. Key strengths, talents, and positive traits associated with this path.\n3. Potential challenges, weaknesses, and areas for growth.\n4. How their Sun Sign and Chinese Zodiac animal might influence or interact with their Life Path's journey.\n5. Actionable advice and guidance for aligning with their life purpose.\n\nMaintain a positive, empowering, and mystical tone. Format the response with clear headings for each section (e.g., 'Core Purpose', 'Strengths and Talents').`;
        case 'numerology':
            return `Generate a "${reportTitle}" report based on the user's profile.\n\nUser Profile Summary:\n${profileSummary}\n\nThis report should be an in-depth numerology breakdown (4-5 paragraphs). Explain the meaning and influence of:\n1. Life Path Number (the main journey).\n2. Expression Number (talents and potential).\n3. Soul Urge Number (inner desires and motivations).\n4. Birthday Number (a specific skill or talent).\n5. Synthesize how these numbers work together to form a complete picture of the user's personality and destiny.\n\nMaintain an insightful and illuminating tone. Use headings for each number's section.`;
        case 'astrology':
            return `Generate a "${reportTitle}" based on the user's profile.\n\nUser Profile Summary:\n${profileSummary}\n\nThis report should focus on their Sun Sign (${profile.astrology.sunSign}). It should be 4-5 paragraphs and cover:\n1. The core traits, motivations, and personality of their Sun Sign.\n2. Strengths and weaknesses associated with the sign.\n3. How this sign approaches relationships, career, and personal growth.\n4. A brief note on how their Life Path number might add a unique flavor to their astrological profile.\n\nUse an eloquent and astrological tone.`;
        case 'chinese':
            return `Generate a "${reportTitle}" for the user.\n\nUser Profile Summary:\n${profileSummary}\n\nThis report should be an in-depth analysis of their Chinese Zodiac animal (${profile.chinese.animal}) and its element (${profile.chinese.element}). It should be 4-5 paragraphs and include:\n1. The main personality traits and characteristics of their animal.\n2. The specific influence of their element (e.g., a Wood Dragon vs. a Fire Dragon).\n3. Compatibility with other signs in friendships and partnerships.\n4. Career and life advice based on their zodiac profile.\n\nUse a wise and traditional tone.`;
        case 'timing':
            return `Generate a "${reportTitle}" report for the user for the current year.\n\nUser Profile Summary:\n${profileSummary}\n\nThe report should focus on their current Personal Year in numerology (${profile.numerology.personalYear}). It should be 4-5 paragraphs and explain:\n1. The theme and purpose of their current Personal Year.\n2. The types of opportunities and challenges they can expect this year.\n3. Advice on what to focus on and what to avoid during this period.\n4. A brief mention of what to anticipate in the upcoming Personal Year to prepare for the future.\n\nMaintain a predictive and guiding tone.`;
        case 'career':
            return `Generate a "${reportTitle}" report for the user.\n\nUser Profile Summary:\n${profileSummary}\n\nThis report should provide career and financial guidance based on a synthesis of their profile. In 4-5 paragraphs, cover:\n1. Ideal career paths and work environments that align with their Life Path, Sun Sign, and Chinese Animal.\n2. Natural talents and skills they can leverage for professional success.\n3. Potential challenges in the workplace and how to navigate them.\n4. Their relationship with money and strategies for financial abundance, based on their core numbers and signs.\n\nMaintain a practical, strategic, and empowering tone.`;
        case 'master':
            return `You are a master metaphysician. Create the "${reportTitle}" for a user by synthesizing all their data into a holistic and cohesive narrative.\n\nUser Profile:\n${profileSummary}\n\nThe report must be a comprehensive synthesis (6-8 paragraphs) and:\n1. Start with a powerful, personalized opening statement about their unique cosmic blueprint.\n2. Explain the primary theme or 'story' that emerges from the combination of their Life Path, Sun Sign, and Chinese Animal.\n3. Identify and discuss the key synergies (where the systems reinforce each other) in their chart.\n4. Identify and discuss potential conflicts or areas of tension between the systems and offer advice on how to integrate these energies.\n5. Conclude with an inspiring summary and a key piece of wisdom for them to carry forward.\n\nMaintain a profound, insightful, and empowering tone. Use headings to structure the report clearly.`;
        default:
            return `Generate a general report titled "${reportTitle}" for the user with this profile:\n${profileSummary}\n\nProvide an encouraging overview of their metaphysical strengths.`;
    }
};

export const generateReportContent = async (userData: UserData, profile: ProfileData, reportType: string, reportTitle: string): Promise<string> => {
    const prompt = getReportPrompt(userData, profile, reportType, reportTitle);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error(`Error generating report for ${reportType}:`, error);
        return `We encountered an issue generating the "${reportTitle}". Please try again later.`;
    }
};