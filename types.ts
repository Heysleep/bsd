
export enum MaterialGrade {
  FABRIC_G1 = '布艺 1级',
  FABRIC_G2 = '布艺 2级',
  FABRIC_G3 = '布艺 3级',
  LEATHER_G1 = '真皮 A级',
  LEATHER_G2 = '真皮 B级',
  LEATHER_G3 = '真皮 S级',
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface SofaModule {
  id: string;
  name: string;
  model: string;
  dimensions: Dimensions;
  image?: string;
  prices: Record<MaterialGrade, number>;
}

export interface Combination {
  id: string;
  name: string;
  model: string;
  moduleIds: string[]; // List of SofaModule IDs
  image?: string;
  // Combinations can have manual price overrides or be calculated
  isManualPrice: boolean;
  manualPrices: Record<MaterialGrade, number>;
}

export interface QuotationState {
  companyName: string;
  companyLogo?: string;
  coverImage?: string; // 新增封面大图
  sofaModelName: string;
  currency: string;
  modules: SofaModule[];
  combinations: Combination[];
}
