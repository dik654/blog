import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #cost-model(등비 합) — 항 α^i가 곱으로 줄어드는 막대와 그 합을 쌓은 띠.
 * α=.7,K=4 → 2.7731 / α=.8,K=3 → 2.952 / α=.8,K=8 → 4.328911(상한 5) / α=1 → 5 / α=0 → 1.
 */
interface Scene extends ShellScene {
  alpha: number;
  k: number;
  ceiling: number | null;
}

const SCENES: readonly Scene[] = [
  { label: "α=.7, K=4", summary: "1+.7+.49+.343+.2401 = 2.7731", alpha: 0.7, k: 4, ceiling: 1 / 0.3, note: "첫 항 1은 교체 토큰 또는 보너스이고 그다음부터 .7을 계속 곱합니다. 2.7731은 평균이며 한 번의 실행에서 반드시 나오는 길이가 아닙니다." },
  { label: "α=.8, K=3", summary: "1+.8+.64+.512 = 2.952", alpha: 0.8, k: 3, ceiling: 5, note: "α가 커지면 항이 천천히 줄어듭니다. 무한히 더해도 넘지 못하는 상한은 1/(1−α)로, α=.8에서는 5입니다." },
  { label: "α=.8, K=8", summary: "≈ 4.328911 · 상한 5 아래", alpha: 0.8, k: 8, ceiling: 5, note: "K를 8로 늘려도 합은 상한 5에 다가가기만 합니다. 검증 비용도 K와 함께 달라지므로 기대 길이만으로 가장 빠른 K가 정해지지는 않습니다." },
  { label: "경계 α=1", summary: "K=4 → 1×5 = 5", alpha: 1, k: 4, ceiling: null, note: "모든 항이 1이라 다섯 위치가 항상 확정됩니다. 분모 1−α가 0이라 닫힌 식 대신 K+1로 세고, 합이 K와 함께 늘어 상한 선이 없습니다." },
  { label: "경계 α=0", summary: "K=4 → 1", alpha: 0, k: 4, ceiling: 1, note: "후보가 하나도 살아남지 못하면 교체 토큰 하나만 남습니다. 합은 1로 상한과 같습니다." },
];

const SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const AXIS_MAX = 5.5;
const W = 360;
const BASE = 118;
const UNIT = 92;
const STEP = 39;
const LEFT = 6;
const BLUE = "#2563eb";
const GRAY = "#64748b";

const format = (value: number) => {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(4).replace(/0+$/, "").replace(/^0/, "");
};

export default function GeometricTailViz() {
  return (
    <SceneShell
      eyebrow="모형: 독립·동일 α (가정)"
      title="뒤 항이 곱으로 줄어 K를 늘려도 합은 상한 아래에 머뭅니다"
      description="막대는 αⁱ, 곧 i번째 후보까지 살아남을 확률이고 아래 띠는 그 합, 빨간 선은 α&lt;1일 때 합의 상한 1/(1−α)입니다. 실제 요청의 값이 아닙니다."
      ariaLabel="알파의 거듭제곱 항이 줄어드는 모습과 그 합"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const terms = SLOTS.map((i) => (i <= scene.k ? scene.alpha ** i : null));
        const present = terms.filter((value): value is number => value !== null);
        const sum = present.reduce<number>((total, value) => total + value, 0);
        const ceilingLeft = scene.ceiling === null ? null : (scene.ceiling / AXIS_MAX) * 100;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 138`} className="mx-auto h-auto w-full max-w-[600px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {terms.map((value, i) => {
                const x = LEFT + i * STEP;
                if (value === null) {
                  return <line key={i} x1={x + 4} x2={x + 32} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />;
                }
                const height = value * UNIT;
                return (
                  <g key={i}>
                    <rect x={x + 4} y={BASE - height} width={28} height={height} rx={2} fill={i === 0 ? GRAY : BLUE} opacity={i === 0 ? 0.75 : 0.85} />
                    <text x={x + 18} y={BASE - height - 5} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="currentColor">{format(value)}</text>
                  </g>
                );
              })}
              <line x1={LEFT} x2={W - LEFT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              {SLOTS.map((i) => (
                <text key={i} x={LEFT + i * STEP + 18} y={BASE + 15} textAnchor="middle" fontSize={11} fill={GRAY}>i={i}</text>
              ))}
            </svg>

            <div className="mx-auto mt-2 max-w-[600px]">
              <div className="flex items-baseline justify-between text-xs tabular-nums">
                <span className="font-sans font-bold">기대 확정 길이</span>
                <span className="text-sm font-bold">{scene.alpha === 0.8 && scene.k === 8 ? "≈ 4.328911" : format(sum)}</span>
              </div>
              <div className="relative mt-1 h-5 rounded-sm bg-muted/50">
                <div className="flex h-full overflow-hidden rounded-sm">
                  {present.map((value, i) => (
                    <span key={i} className="h-full shrink-0" style={{ width: `${(value / AXIS_MAX) * 100}%`, backgroundColor: i === 0 ? GRAY : BLUE, opacity: i === 0 ? 0.75 : 0.85 - (i % 2) * 0.3 }} />
                  ))}
                </div>
                {ceilingLeft !== null && (
                  <span className="absolute inset-y-[-3px] w-px bg-[#dc2626]" style={{ left: `${ceilingLeft}%` }} aria-hidden />
                )}
              </div>
              <div className="relative mt-1 h-4 font-mono text-[11px] text-muted-foreground">
                <span className="absolute left-0">0</span>
                <span className="absolute right-0">5.5</span>
                {ceilingLeft !== null && scene.ceiling !== null && (
                  <span
                    className="absolute font-bold text-[#dc2626]"
                    style={ceilingLeft > 50 ? { right: `${100 - ceilingLeft}%` } : { left: `${ceilingLeft}%` }}
                  >
                    상한 {scene.ceiling.toFixed(scene.ceiling === 1 || scene.ceiling === 5 ? 0 : 2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
