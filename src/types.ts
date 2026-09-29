export interface PinItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  author: string;
  board?: string;
  aspectRatio: 'tall' | 'medium' | 'short';
  sourceUrl?: string;
  savesCount: string;
  tag: string;
}

export interface DynamicCategory {
  id: string;
  phrase: string;
  color: string;
  bgLight: string;
  accent: string;
  pins: PinItem[];
  emotionalTrigger: string;
  searchIntent: string;
}

export interface PsychologicalTrigger {
  id: string;
  name: string;
  portugueseName: string;
  description: string;
  pinterestApplication: string;
  croImpact: string;
  behavioralPrinciple: string;
  iconName: string;
}

export interface TeardownSection {
  id: string;
  title: string;
  rawTextPt: string;
  rawTextEn: string;
  functionalGoal: string;
  primaryEmotionalDriver: string;
  psychologicalMechanics: string[];
  keyTakeaways: string[];
}
