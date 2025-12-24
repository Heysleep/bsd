
import { MaterialGrade } from './types';

export const INITIAL_GRADES = [
  MaterialGrade.FABRIC_G1,
  MaterialGrade.FABRIC_G2,
  MaterialGrade.FABRIC_G3,
  MaterialGrade.LEATHER_G1,
  MaterialGrade.LEATHER_G2,
  MaterialGrade.LEATHER_G3,
];

export const ITALIAN_DESIGN_PROMPT = `
你是一位精通意大利现代家具营销的大师。
请为名为 "{{name}}" 的沙发系列写一段简短、高级且具有艺术感的描述（2句中文）。
侧重于“极简线条”、“精湛工艺”、“意式美学”和“极致舒适”。
语气应当优雅、专业且具有品牌感。
`;
