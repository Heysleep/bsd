
import { GoogleGenAI } from "@google/genai";
import { ITALIAN_DESIGN_PROMPT } from "../constants";

export const generateDesignDescription = async (modelName: string): Promise<string> => {
  const apiKey = process.env.API_KEY || "";
  if (!apiKey) return "精湛的意式工艺与现代极简主义设计完美融合，营造极致的居家舒适感。";

  const ai = new GoogleGenAI({ apiKey });
  const prompt = ITALIAN_DESIGN_PROMPT.replace("{{name}}", modelName);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "每一处细节都彰显着意式设计的艺术灵魂与现代生活的优雅品质。";
  } catch (error) {
    console.error("Gemini failed:", error);
    return "融汇意式传统与现代美学，重新定义奢华舒适的居家体验。";
  }
};
