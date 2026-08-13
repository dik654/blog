export const C = {
  active: "#10b981",
  inactive: "#94a3b8",
  boundary: "#f59e0b",
};

export const STEPS = [
  {
    label: "AND · 둘 다 1",
    body: "두 입력 모두 1일 때만 합(0.3)이 0을 넘는다. (1,1)만 활성.",
  },
  {
    label: "OR · 하나 이상 1",
    body: "하나만 1이어도 합(0.3)이 0을 넘는다. (0,0)만 비활성.",
  },
  {
    label: "NAND · AND 반전",
    body: "두 입력 모두 1이면 합(−0.3)이 0 이하. (1,1)만 비활성.",
  },
];

export type Point = { x: number; y: number; active: boolean };

export type GateDef = {
  points: Point[];
  lineY1: number;
  lineY2: number;
  equation: string;
  eqPos: [number, number];
  label1: [number, number];
  label0: [number, number];
};

export const GATES: GateDef[] = [
  {
    points: [
      { x: 0, y: 0, active: false },
      { x: 1, y: 0, active: false },
      { x: 0, y: 1, active: false },
      { x: 1, y: 1, active: true },
    ],
    lineY1: 1.4,
    lineY2: 0.4,
    equation: "0.5x₁ + 0.5x₂ − 0.7 = 0",
    eqPos: [0.1, 0.85],
    label1: [0.85, 0.75],
    label0: [0.15, 0.25],
  },
  {
    points: [
      { x: 0, y: 0, active: false },
      { x: 1, y: 0, active: true },
      { x: 0, y: 1, active: true },
      { x: 1, y: 1, active: true },
    ],
    lineY1: 0.4,
    lineY2: -0.6,
    equation: "0.5x₁ + 0.5x₂ − 0.2 = 0",
    eqPos: [0.08, 0.55],
    label1: [0.55, 0.75],
    label0: [-0.05, 0.3],
  },
  {
    points: [
      { x: 0, y: 0, active: true },
      { x: 1, y: 0, active: true },
      { x: 0, y: 1, active: true },
      { x: 1, y: 1, active: false },
    ],
    lineY1: 1.4,
    lineY2: 0.4,
    equation: "−0.5x₁ − 0.5x₂ + 0.7 = 0",
    eqPos: [0.1, 0.85],
    label1: [0.15, 0.25],
    label0: [0.85, 0.75],
  },
];
