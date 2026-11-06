/** 가입자 1,000명을 50×20 칸으로 그립니다. hot에 든 칸만 크고 빨갛게 표시합니다. 칸의 위치는 설명용입니다. */
const COLS = 50;
const STEP = 7;
const X0 = 5;
const ALL = Array.from({ length: 1000 }, (_, index) => index);

function squares(indices: readonly number[], size: number) {
  const inset = (STEP - size) / 2;
  return indices
    .map((index) => `M${X0 + (index % COLS) * STEP + inset} ${Math.floor(index / COLS) * STEP + inset}h${size}v${size}h-${size}z`)
    .join("");
}

export default function PoolDots({ hot }: { hot: readonly number[] }) {
  const hotSet = new Set(hot);
  return (
    <g>
      <path d={squares(ALL.filter((index) => !hotSet.has(index)), 3.4)} fill="#94a3b8" />
      {hot.length > 0 && <path d={squares(hot, 6)} fill="#dc2626" />}
    </g>
  );
}
