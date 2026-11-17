import SceneShell from "./SceneShell";

/**
 * 본문 대응: #error-shape — 같은 bit 수(signed INT2, code -2·-1·0·1, z=0)에서 scale을 바꾸면
 * 눈금 간격과 복원 range R이 함께 늘거나 줄어, 중앙 값의 반올림 오차와 outlier의 clipping 오차가 반대로 움직인다.
 * 중앙 값 x=-0.3, outlier x=1.7은 그림용 가정이다.
 * s=0.25: -0.3/0.25=-1.2→q=-1→x̂=-0.25(오차 0.05), 1.7→6.8→7→clip 1→x̂=0.25(오차 1.45)
 * s=0.5 : -0.6→q=-1→x̂=-0.5(오차 0.2),            1.7→3.4→3→clip 1→x̂=0.5(오차 1.2)
 * s=1   : -0.3→q=0→x̂=0(오차 0.3),                 1.7→1.7→2→clip 1→x̂=1(오차 0.7)
 */
const CODES = [-2, -1, 0, 1] as const;
const CENTER_X = -0.3;
const OUTLIER_X = 1.7;

const SCENES = [
  {
    label: "s = 0.25",
    summary: "R = [-0.5, 0.25]",
    s: 0.25,
    centerHat: -0.25,
    outlierHat: 0.25,
    note: "눈금이 촘촘해 range 안의 x=-0.3은 0.05만 이동합니다. 대신 R이 0.25에서 끝나 x=1.7은 끝 code q=1(복원값 0.25)에 붙고 1.45가 그대로 오차로 남습니다.",
  },
  {
    label: "s = 0.5",
    summary: "R = [-1, 0.5]",
    s: 0.5,
    centerHat: -0.5,
    outlierHat: 0.5,
    note: "간격을 두 배로 넓히면 R도 두 배가 됩니다. x=1.7의 clipping 오차는 1.2로 줄고, x=-0.3의 반올림 오차는 0.2로 커집니다. 반올림 오차의 상한 s/2도 0.25로 늘었습니다.",
  },
  {
    label: "s = 1",
    summary: "R = [-2, 1]",
    s: 1,
    centerHat: 0,
    outlierHat: 1,
    note: "R을 더 넓히면 x=1.7의 오차는 0.7까지 줄지만 x=-0.3은 0으로 복원돼 오차가 0.3입니다. 어느 scale이 나은지는 중앙과 꼬리에 값이 얼마나 놓이는지, 즉 실제 분포가 정합니다.",
  },
] as const;

const W = 340;
const PAD = 18;
const MIN_X = -2.2;
const MAX_X = 2.0;
const AXIS_Y = 74;
const toPx = (x: number) => PAD + ((x - MIN_X) / (MAX_X - MIN_X)) * (W - 2 * PAD);
const ERROR_MAX = 1.6;

function ErrorBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_2.75rem] items-center gap-2 text-xs sm:grid-cols-[11rem_minmax(0,1fr)_3rem] sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-3.5 min-w-0 rounded-sm bg-muted/40">
        <div
          className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${(value / ERROR_MAX) * 100}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-right font-mono">{Number(value.toFixed(3))}</span>
    </div>
  );
}

export default function ScaleTradeoffViz() {
  return (
    <SceneShell
      eyebrow="Scale 선택"
      title="같은 네 code로 scale을 바꾸면 두 오차가 반대로 움직입니다"
      description="Signed INT2(code -2·-1·0·1, zero-point 0)의 네 눈금을 실수 축에 놓았습니다. 파란 점이 복원값 s·q, 연한 띠가 복원 range R입니다. 초록 x=-0.3은 range 안의 중앙 값, 빨강 x=1.7은 outlier이며 두 값과 세 scale은 그림을 위한 가정입니다."
      note="반올림 오차는 range 안에서 s/2를 넘지 않고, clipping 오차는 outlier와 끝점 사이 거리입니다. 원소 하나의 오차가 작다고 task loss가 작다는 보장은 없습니다."
      ariaLabel="scale 0.25, 0.5, 1에서 중앙 값의 반올림 오차와 outlier의 clipping 오차 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const lo = scene.s * CODES[0];
        const hi = scene.s * CODES[CODES.length - 1];
        const centerErr = Math.abs(CENTER_X - scene.centerHat);
        const outlierErr = Math.abs(OUTLIER_X - scene.outlierHat);
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 132`} role="img" aria-label={`scale ${scene.s}에서 네 눈금과 두 값의 복원 위치`} className="mx-auto block h-auto w-full max-w-[34rem]">
              <rect x={toPx(lo)} y={AXIS_Y - 14} width={toPx(hi) - toPx(lo)} height={28} rx={4} fill="#2563eb" fillOpacity={0.1} stroke="#2563eb" strokeOpacity={0.4} strokeWidth={1} />
              <text x={(toPx(lo) + toPx(hi)) / 2} y={AXIS_Y + 30} textAnchor="middle" fontSize={12} fill="#2563eb" fontWeight={700}>
                R
              </text>
              <line x1={PAD} y1={AXIS_Y} x2={W - PAD} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {[-2, -1, 0, 1, 2].map((v) => (
                <g key={v}>
                  <line x1={toPx(v)} y1={AXIS_Y + 14} x2={toPx(v)} y2={AXIS_Y + 18} stroke="#94a3b8" strokeWidth={1} />
                  <text x={toPx(v)} y={AXIS_Y + 44} textAnchor="middle" fontSize={12} fill="#64748b">
                    {v}
                  </text>
                </g>
              ))}
              {CODES.map((q) => (
                <circle key={q} cx={toPx(scene.s * q)} cy={AXIS_Y} r={4} fill="#2563eb" />
              ))}
              {/* 중앙 값 → 복원값 */}
              <circle cx={toPx(CENTER_X)} cy={28} r={5} fill="#16a34a" />
              <text x={toPx(CENTER_X)} y={14} textAnchor="middle" fontSize={12} fill="#15803d" fontWeight={700}>
                x=-0.3
              </text>
              <line x1={toPx(CENTER_X)} y1={33} x2={toPx(scene.centerHat)} y2={AXIS_Y - 6} stroke="#16a34a" strokeWidth={1.25} />
              {/* outlier → 끝점 */}
              <circle cx={toPx(OUTLIER_X)} cy={28} r={5} fill="#dc2626" />
              <text x={toPx(OUTLIER_X)} y={14} textAnchor="middle" fontSize={12} fill="#b91c1c" fontWeight={700}>
                x=1.7
              </text>
              <line x1={toPx(OUTLIER_X)} y1={33} x2={toPx(scene.outlierHat)} y2={AXIS_Y - 6} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
            </svg>
            <div className="mt-3 space-y-2">
              <ErrorBar label="반올림 상한 s/2" value={scene.s / 2} color="#94a3b8" />
              <ErrorBar label="x=-0.3 반올림 오차" value={centerErr} color="#16a34a" />
              <ErrorBar label="x=1.7 clipping 오차" value={outlierErr} color="#dc2626" />
            </div>
          </div>
        );
      }}
    />
  );
}
