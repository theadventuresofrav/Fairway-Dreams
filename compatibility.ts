// Numerology compatibility mapping
export const numerologyCompatibility = {
  1: { compatible: [3, 5, 7], challenging: [2, 4, 8] },
  2: { compatible: [4, 6, 8], challenging: [1, 5, 9] },
  3: { compatible: [1, 5, 7], challenging: [4, 8] },
  4: { compatible: [2, 6, 8], challenging: [3, 5] },
  5: { compatible: [1, 3, 7], challenging: [2, 4, 6] },
  6: { compatible: [2, 4, 8], challenging: [5, 9] },
  7: { compatible: [1, 3, 5], challenging: [2, 6, 9] },
  8: { compatible: [2, 4, 6], challenging: [1, 3, 5] },
  9: { compatible: [3, 6, 7], challenging: [2, 5, 8] }
};

export const zodiacElements = {
  Aries: "Fire",
  Leo: "Fire",
  Sagittarius: "Fire",
  Taurus: "Earth",
  Virgo: "Earth",
  Capricorn: "Earth",
  Gemini: "Air",
  Libra: "Air",
  Aquarius: "Air",
  Cancer: "Water",
  Scorpio: "Water",
  Pisces: "Water"
};

export const elementCompatibility = {
  Fire: ["Fire", "Air"],
  Earth: ["Earth", "Water"],
  Air: ["Air", "Fire"],
  Water: ["Water", "Earth"]
};

export const chineseZodiacCompatibility = {
  Rat: ["Ox", "Dragon", "Monkey"],
  Ox: ["Rat", "Snake", "Rooster"],
  Tiger: ["Horse", "Dog", "Pig"],
  Rabbit: ["Goat", "Pig", "Dog"],
  Dragon: ["Monkey", "Rat", "Rooster"],
  Snake: ["Ox", "Rooster"],
  Horse: ["Tiger", "Dog", "Goat"],
  Goat: ["Rabbit", "Horse", "Pig"],
  Monkey: ["Rat", "Dragon"],
  Rooster: ["Ox", "Dragon", "Snake"],
  Dog: ["Rabbit", "Tiger", "Horse"],
  Pig: ["Goat", "Rabbit", "Tiger"]
};

export function calculateLifePath(dob: string): number {
  const digits = dob.replace(/-/g, "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);

  while (![11, 22, 33].includes(sum) && sum > 9) {
    sum = sum.toString().split("").map(Number).reduce((a, b) => a + b, 0);
  }

  return sum;
}

export function getNumerologyCompatibility(childLP: number, friendLP: number): "High" | "Medium" | "Low" {
  const compat = numerologyCompatibility[childLP];
  if (!compat) return "Medium";
  if (compat.compatible.includes(friendLP)) return "High";
  if (compat.challenging.includes(friendLP)) return "Low";
  return "Medium";
}

export function getAstroCompatibility(childSign: string, friendSign: string): "High" | "Medium" | "Low" {
  const childElem = zodiacElements[childSign];
  const friendElem = zodiacElements[friendSign];

  if (!childElem || !friendElem) return "Medium";

  // Different elements in the same compatibility group are high
  if (elementCompatibility[childElem].includes(friendElem) && childElem !== friendElem) return "High";
  // Same element is medium
  if (childElem === friendElem) return "Medium";

  // Otherwise low
  return "Low";
}

export function getZodiacAnimalCompatibility(childAnimal: string, friendAnimal: string): "High" | "Medium" | "Low" {
  const matches = chineseZodiacCompatibility[childAnimal];
  if (!matches) return "Medium";

  return matches.includes(friendAnimal) ? "High" : "Low";
}

export function getOverallCompatibility(
  numerology: "High" | "Medium" | "Low",
  astro: "High" | "Medium" | "Low",
  chinese: "High" | "Medium" | "Low"
): { label: string; color: string } {
  const scoreMap = { High: 3, Medium: 2, Low: 1 };

  const avg = (scoreMap[numerology] + scoreMap[astro] + scoreMap[chinese]) / 3;

  if (avg >= 2.5) return { label: "Excellent", color: "text-[#C6E0C2]" };
  if (avg >= 1.8) return { label: "Good", color: "text-[#D5CBA3]" };
  return { label: "Challenging", color: "text-red-400" };
}

const child = {
  dob: "2015-04-12",
  sunSign: "Aries",
  chineseAnimal: "Goat"
};

const friend = {
  dob: "2015-09-20",
  sunSign: "Virgo",
  chineseAnimal: "Rabbit"
};

const childLP = calculateLifePath(child.dob);
const friendLP = calculateLifePath(friend.dob);

const numerology = getNumerologyCompatibility(childLP, friendLP);
const astro = getAstroCompatibility(child.sunSign, friend.sunSign);
const chinese = getZodiacAnimalCompatibility(child.chineseAnimal, friend.chineseAnimal);

const finalScore = getOverallCompatibility(numerology, astro, chinese);

console.log(finalScore); 
// { label: "Good", color: "text-[#D5CBA3]" }