
export enum ActivityLevel {
  SEDENTARY = 'Sedentary (Little to no exercise)',
  LIGHT = 'Lightly Active (1-3 days/week)',
  MODERATE = 'Moderately Active (3-5 days/week)',
  ACTIVE = 'Very Active (6-7 days/week)',
  EXTRA_ACTIVE = 'Extra Active (Athletic/Physical job)'
}

export enum FitnessGoal {
  FAT_LOSS = 'Fat Loss',
  MAINTAIN = 'Maintain Weight',
  LEAN_BULK = 'Lean Bulk',
  RECOMP = 'Body Recomposition'
}

export interface UserProfile {
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: 'male' | 'female' | 'other';
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
}

export interface MacroBreakdown {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

export interface NutritionPlan {
  dailyCalories: number;
  macros: MacroBreakdown;
  explanation: string;
  foodSuggestions: string[];
  tips: string[];
}

export interface PhysiqueInsight {
  bodyType: string;
  compositionNotes: string;
  recommendations: string[];
  disclaimer: string;
}

export interface FoodAnalysis {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  notes: string;
  isEstimate: boolean;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface FoodDatabaseResult {
  text: string;
  sources: GroundingSource[];
}

export type ViewType = 'dashboard' | 'profile' | 'physique' | 'food-check' | 'food-database' | 'learn';
