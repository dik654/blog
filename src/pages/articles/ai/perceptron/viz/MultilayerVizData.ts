import type { StepDef } from "@/components/ui/step-viz";

export const STEPS: StepDef[] = [
  {
    label: "단층 · 직선 하나",
    body: "직선 하나로는 XOR 분류 불가.\n선형 분리 가능한 문제만 해결.",
  },
  {
    label: "다층 · NAND + OR → AND",
    body: "1층: NAND와 OR이 각각 입력 처리.\n2층: AND로 결합 → XOR 완성.",
  },
  {
    label: "보편 근사 정리",
    body: "적절한 비선형 activation과 충분한 hidden unit은 compact domain의 연속 함수를 근사할 수 있습니다. 학습 효율이나 일반화까지 자동으로 보장하지는 않습니다.",
  },
];

export const NAND_C = "#6366f1";
export const OR_C = "#10b981";
export const AND_C = "#f59e0b";
