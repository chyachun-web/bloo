export interface BirthdayFlower {
  flowerName: string;
  flowerLanguage: string;
  personalityDescription: string;
  advantages: string[];
  growthAdvice: string;
  soulLesson: string;
}

export interface LuckyFlower {
  id: string;
  flowerName: string;
  flowerLanguage: string;
  emotionReminder: string;
  fortune: {
    relationship: string;
    work: string;
    finance: string;
  };
  mindfulEatingAdvice: string;
  luckyColor: string;
  dateCollected: string;
  userEmotion?: string;
  
  // Emotion Flower Prompt specific fields
  reasonRepresented?: string;
  messageToUser?: string;
  emotionCareAdvice?: string;
  
  // Lottery draw keys
  luckStars?: number;
  loveFortune?: string;
  workFortune?: string;
  financeFortune?: string;
  healthFortune?: string;
  luckyNumber?: number;
  dailyMessage?: string;
}

export interface EatingLog {
  id: string;
  date: string;
  mealTitle: string;
  mealDescription: string;
  emoji: string;
  eatingSpeed: "slow" | "normal" | "quick";
  mindfulInsight: string;
  selfCareTips: string[];
  gardenConnection: string;
  pointsEarned: number;
  photoUrl?: string;
}

export type GardenLevel = "萌芽花園" | "療癒花園" | "夢幻花園" | "Bloom Kingdom";

export interface UserProfile {
  userName: string;
  birthDate: string;
  birthTime?: string;
  gender?: string;
  constellation?: string;
  sixStarsNode?: string;
  hasRegistered: boolean;
  birthdayFlower?: BirthdayFlower;
}
