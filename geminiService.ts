
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, NutritionPlan, PhysiqueInsight, FoodAnalysis, FoodDatabaseResult } from "../types";

// Helper to get fresh AI instance
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const NUTRITION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    dailyCalories: { type: Type.NUMBER },
    macros: {
      type: Type.OBJECT,
      properties: {
        protein: { type: Type.NUMBER, description: "Grams of protein" },
        carbs: { type: Type.NUMBER, description: "Grams of carbs" },
        fats: { type: Type.NUMBER, description: "Grams of fats" },
        calories: { type: Type.NUMBER },
      },
      required: ["protein", "carbs", "fats", "calories"]
    },
    explanation: { type: Type.STRING },
    foodSuggestions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    tips: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    }
  },
  required: ["dailyCalories", "macros", "explanation", "foodSuggestions", "tips"]
};

const FOOD_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    foodName: { type: Type.STRING },
    calories: { type: Type.NUMBER },
    protein: { type: Type.NUMBER },
    carbs: { type: Type.NUMBER },
    fats: { type: Type.NUMBER },
    notes: { type: Type.STRING },
    isEstimate: { type: Type.BOOLEAN }
  },
  required: ["foodName", "calories", "protein", "carbs", "fats", "notes", "isEstimate"]
};

export const getNutritionPlan = async (profile: UserProfile): Promise<NutritionPlan> => {
  const prompt = `
    Acts as a world-class student-friendly nutritionist. 
    Calculate a safe and sustainable nutrition plan for:
    Age: ${profile.age}, Weight: ${profile.weight}kg, Height: ${profile.height}cm, Goal: ${profile.goal}
    
    Provide an educational explanation of WHY these numbers were chosen.
  `;

  const response = await getAi().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: NUTRITION_SCHEMA,
    },
  });

  return JSON.parse(response.text || '{}');
};

export const analyzePhysique = async (base64Image: string): Promise<PhysiqueInsight> => {
  const prompt = `Analyze this physique photo for body type and nutrition guidance. Focus on muscle/fat balance and sustainability.`;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1],
    },
  };

  const response = await getAi().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bodyType: { type: Type.STRING },
          compositionNotes: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          disclaimer: { type: Type.STRING }
        },
        required: ["bodyType", "compositionNotes", "recommendations", "disclaimer"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const analyzeFood = async (input: string | { base64: string }): Promise<FoodAnalysis> => {
  const prompt = `Analyze the nutritional content. Provide calories, protein, carbs, and fats.`;

  let contents: any;
  if (typeof input === 'string') {
    contents = `Analyze this food: "${input}". ${prompt}`;
  } else {
    contents = {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: input.base64.split(',')[1] } },
        { text: prompt }
      ]
    };
  }

  const response = await getAi().models.generateContent({
    model: 'gemini-3-flash-preview',
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: FOOD_ANALYSIS_SCHEMA,
    },
  });

  return JSON.parse(response.text || '{}');
};

export const searchFoodDatabase = async (query: string): Promise<FoodDatabaseResult> => {
  const prompt = `
    Search for precise nutritional data for: "${query}".
    Structure your response using the following clean format:
    
    ### [Food Name & Serving Size]
    **Calories**: [Value] kcal | **P**: [Value]g | **C**: [Value]g | **F**: [Value]g
    
    #### Key Highlights
    * Bullet 1: Notable vitamins/minerals.
    * Bullet 2: Main ingredients or source.
    * Bullet 3: Health considerations (e.g., sodium/sugar).
    
    #### The Verdict
    [One sentence on how this fits into a student-athlete diet].
    
    Use the Google Search tool for live, brand-specific data. Keep it concise.
  `;

  try {
    const response = await getAi().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter((chunk: any) => chunk.web)
      ?.map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri,
      })) || [];

    return {
      text: response.text || "No data available.",
      sources: sources,
    };
  } catch (error) {
    console.error("Search Error:", error);
    throw new Error("Could not reach the database. Try again.");
  }
};
