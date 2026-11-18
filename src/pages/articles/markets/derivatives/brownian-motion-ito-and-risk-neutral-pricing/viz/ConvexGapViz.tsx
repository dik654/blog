import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 가격의 제곱 S²을 100에서 ±1.26 움직인다.
 * 오름: 101.26²−100²=253.5876, 기울기 직선 2×100×1.26=252, 차이 +1.5876.
 * 내림: 98.74²−100²=−250.4124, 기울기 직선 −252, 차이 +1.5876.
 * 실제 변화 − 직선 = (변화)²이므로 방향과 상관없이 같은 양수 1.26²≈1.59가 남는다.
 */
const MOVE = 1.26;
const SQUARE = MOVE ** 2;
const UP_ACTUAL = (100 + MOVE) ** 2 - 100 ** 2;
const DOWN_ACTUAL = (100 - MOVE) ** 2 - 100 ** 2;
const LINE = 2 * 100 * MOVE;

const SCENES = [
  { label: "1.26 오를 때", summary: "253.59 − 252 = +1.59", note: "101.26²−100²≈253.59인데 기울기 직선(2×100×1.26)은 252만 셉니다. 직선만 쓰면 약 1.59가 모자랍니다." },
  { label: "1.26 내릴 때", summary: "−250.41 − (−252) = +1.59", note: "98.74²−100²≈−250.41입니다. 직선은 −252라고 셈하므로 이번에도 실제 값이 직선보다 1.59 위에 있습니다." },
  { label: "차이만 모아 보면", summary: "방향과 무관하게 1.26² ≈ 1.59", note: "실제 변화에서 직선을 뺀 차이는 움직임의 제곱입니다. 오르든 내리든 같은 양수 1.59가 남고, 이 몫을 매일 누적하면 굽은 지급을 가진 계약의 가격과 헤지가 달라집니다." },
] as const;

const ROWS: readonly (readonly { label: string; value: string; bar: number | null }[])[] = [
  [
    { label: "실제 제곱값 변화", value: `+${UP_ACTUAL.toFixed(2)}`, bar: UP_ACTUAL },
    { label: "기울기 직선", value: `+${LINE.toFixed(0)}`, bar: LINE },
    { label: "차이", value: `+${SQUARE.toFixed(2)}`, bar: null },
  ],
  [
    { label: "실제 제곱값 변화", value: `−${Math.abs(DOWN_ACTUAL).toFixed(2)}`, bar: DOWN_ACTUAL },
    { label: "기울기 직선", value: `−${LINE.toFixed(0)}`, bar: -LINE },
    { label: "차이", value: `+${SQUARE.toFixed(2)}`, bar: null },
  ],
  [
    { label: "오를 때 차이", value: `+${SQUARE.toFixed(2)}`, bar: null },
    { label: "내릴 때 차이", value: `+${SQUARE.toFixed(2)}`, bar: null },
    { label: "공통", value: "1.26²", bar: null },
  ],
];

const W = 360;
const H = 166;
const X0 = 180;
const X_PER = 70;
const BASE_Y = 128;
const Y_PER = 30;
const gx = (move: number) => X0 + move * X_PER;
const gy = (gap: number) => BASE_Y - gap * Y_PER;
const CURVE = Array.from({ length: 37 }, (_, i) => -1.8 + i * 0.1)
  .map((move) => `${gx(move).toFixed(1)},${gy(move ** 2).toFixed(1)}`)
  .join(" ");

export default function ConvexGapViz() {
  return (
    <SceneShell
      eyebrow="제곱 함수의 굽음"
      title="오르든 내리든 직선보다 1.59 위에 남습니다"
      description="가격을 제곱하는 함수 S²을 주가 100에서 ±1.26 움직입니다. 기울기 직선은 100에서의 기울기(2×100)만으로 변화를 셈한 값입니다. 252에 비해 1.59는 작아서 막대에서는 거의 안 보이므로, 아래 그래프에서 차이만 따로 크게 그립니다."
      ariaLabel="제곱 함수에서 주가 1.26 상승과 하락 때 실제 변화와 기울기 직선의 차이"
      scenes={SCENES}
      render={(active) => {
        const rows = ROWS[active];
        const points = active === 0 ? [MOVE] : active === 1 ? [-MOVE] : [MOVE, -MOVE];
        return (
          <div className="min-w-0">
            <div className="space-y-2">
              {rows.map((row) => (
                <div key={row.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs sm:text-sm">
                  <span className={row.bar === null ? "font-bold" : "text-muted-foreground"}>{row.label}</span>
                  <div className="relative h-3 min-w-0 rounded-sm bg-muted/40">
                    {row.bar !== null && (
                      <div
                        className="absolute top-0 h-full rounded-sm"
                        style={{
                          width: `${(Math.abs(row.bar) / 260) * 50}%`,
                          left: row.bar >= 0 ? "50%" : `${50 - (Math.abs(row.bar) / 260) * 50}%`,
                          backgroundColor: row.label.startsWith("실제") ? "#2563eb" : "#94a3b8",
                        }}
                      />
                    )}
                    {row.bar === null && active !== 2 && <span className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground">막대로 안 보임</span>}
                  </div>
                  <span className={`text-right font-mono ${row.bar === null ? "font-bold text-amber-700 dark:text-amber-400" : ""}`}>{row.value}</span>
                </div>
              ))}
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-4 h-auto w-full max-w-[560px]" role="img" aria-label={`차이 그래프: ${SCENES[active].summary}`}>
              <text x={8} y={14} fontSize={12} fill="#64748b">차이 = 실제 변화 − 기울기 직선 (확대)</text>
              <line x1={20} x2={340} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
              <text x={340} y={BASE_Y + 32} textAnchor="end" fontSize={12} fill="#64748b">가로선 = 기울기 직선과 같은 높이(차이 0)</text>
              <line x1={X0} x2={X0} y1={BASE_Y} y2={BASE_Y + 4} stroke="#94a3b8" strokeWidth={1} />
              <text x={X0} y={BASE_Y + 15} textAnchor="middle" fontSize={12} fill="#64748b">100</text>
              <text x={gx(-MOVE)} y={BASE_Y + 15} textAnchor="middle" fontSize={12} fill="#64748b">98.74</text>
              <text x={gx(MOVE)} y={BASE_Y + 15} textAnchor="middle" fontSize={12} fill="#64748b">101.26</text>
              <polyline points={CURVE} fill="none" stroke={active === 2 ? "#d97706" : "#cbd5e1"} strokeWidth={1.25} />
              {[MOVE, -MOVE].map((move) => {
                const on = points.includes(move);
                return (
                  <g key={move} opacity={on ? 1 : 0.25}>
                    <line x1={gx(move)} x2={gx(move)} y1={BASE_Y} y2={gy(SQUARE)} stroke="#d97706" strokeWidth={1.25} strokeDasharray={on ? undefined : "3 3"} />
                    <circle cx={gx(move)} cy={gy(SQUARE)} r={4} fill="#d97706" />
                    <text x={gx(move) + (move > 0 ? 8 : -8)} y={gy(SQUARE) + 4} textAnchor={move > 0 ? "start" : "end"} fontSize={12} fontWeight={700} fill="#b45309">+1.59</text>
                  </g>
                );
              })}
            </svg>
          </div>
        );
      }}
    />
  );
}
