/** 1000칸 다이 격자(50×20)의 칸 순서. 칸 위치는 설명용이고 몇 칸을 칠할지만 계산값입니다. */
export const GRID_COLS = 50;
export const GRID_ROWS = 20;
const TOTAL = GRID_COLS * GRID_ROWS;

/** 고정 씨앗의 해시로 만든 난수처럼 보이는 값 (렌더마다 같아야 합니다). */
const hash = (index: number, seed: number) => {
  const raw = Math.sin((index + 1) * 12.9898 + seed * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
};

const byKey = (key: (index: number) => number): readonly number[] =>
  Array.from({ length: TOTAL }, (_, index) => index)
    .map((index) => ({ index, value: key(index) }))
    .sort((a, b) => a.value - b.value)
    .map((item) => item.index);

/** 고르게 흩어지는 순서: 앞에서 n칸을 고르면 격자 전체에 퍼집니다. */
export const SCATTER_ORDER = byKey((index) => hash(index, 1));

const CENTERS: readonly (readonly [number, number])[] = [
  [8, 4], [38, 15], [22, 16], [44, 4], [4, 15], [27, 5],
];

/** 뭉치는 순서: 앞에서 n칸을 고르면 몇 군데에 몰립니다. */
export const CLUSTER_ORDER = byKey((index) => {
  const col = index % GRID_COLS;
  const row = Math.floor(index / GRID_COLS);
  const nearest = Math.min(...CENTERS.map(([cx, cy]) => Math.hypot(col - cx, (row - cy) * 1.3)));
  return nearest + hash(index, 2) * 3;
});
