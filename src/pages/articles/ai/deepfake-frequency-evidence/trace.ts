export const SPECTRUM_ROW = [1, -1, 1, -1, 1, -1, 1, -1] as const;
export const BASIS_K4 = [1, -1, 1, -1, 1, -1, 1, -1] as const;
export const PRODUCT_K4 = SPECTRUM_ROW.map((value, index) => value * BASIS_K4[index]);
export const MAGNITUDE_K4 = PRODUCT_K4.reduce((sum, value) => sum + value, 0);

export interface CorruptionCell {
  condition: "원본" | "JPEG" | "크기 변경" | "흐림";
  revision: string;
  generatorA: number;
  generatorB: number;
}

export const CORRUPTION_MATRIX: readonly CorruptionCell[] = [
  { condition: "원본", revision: "변환 없음", generatorA: 0.84, generatorB: 0.22 },
  { condition: "JPEG", revision: "quality 70", generatorA: 0.46, generatorB: 0.2 },
  { condition: "크기 변경", revision: "256→128→256", generatorA: 0.28, generatorB: 0.17 },
  { condition: "흐림", revision: "평균 반경 1", generatorA: 0.11, generatorB: 0.09 },
] as const;

export interface BranchResult {
  sample: string;
  rgbError: boolean;
  frequencyError: boolean;
}

export const BRANCH_RESULTS: readonly BranchResult[] = [
  { sample: "S01", rgbError: false, frequencyError: false },
  { sample: "S02", rgbError: true, frequencyError: true },
  { sample: "S03", rgbError: false, frequencyError: false },
  { sample: "S04", rgbError: false, frequencyError: true },
  { sample: "S05", rgbError: false, frequencyError: false },
  { sample: "S06", rgbError: true, frequencyError: true },
  { sample: "S07", rgbError: false, frequencyError: false },
  { sample: "S08", rgbError: false, frequencyError: false },
  { sample: "S09", rgbError: true, frequencyError: false },
  { sample: "S10", rgbError: false, frequencyError: true },
] as const;

export const ERROR_COUNTS = {
  total: BRANCH_RESULTS.length,
  rgb: BRANCH_RESULTS.filter((row) => row.rgbError).length,
  frequency: BRANCH_RESULTS.filter((row) => row.frequencyError).length,
  joint: BRANCH_RESULTS.filter((row) => row.rgbError && row.frequencyError).length,
  rgbOnly: BRANCH_RESULTS.filter((row) => row.rgbError && !row.frequencyError).length,
  frequencyOnly: BRANCH_RESULTS.filter((row) => !row.rgbError && row.frequencyError).length,
  union: BRANCH_RESULTS.filter((row) => row.rgbError || row.frequencyError).length,
} as const;
