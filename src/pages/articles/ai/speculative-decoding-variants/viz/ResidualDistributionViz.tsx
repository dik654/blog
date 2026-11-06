import SceneShell from "./SceneShell";

/**
 * 본문 대응: #correctness — SpecInfer Algorithm 2. target (.7,.3) − 첫 제안 (.4,.6) = (.3,−.3).
 * 양수 부분 (.3,0)을 합 .3으로 나누면 잔여 분포 (1,0).
 */
interface Scene {
  label: string;
  summary: string;
  note: string;
  a: number;
  b: number;
  proposal: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "현재 남은 분포", summary: "A .7 · B .3", a: 0.7, b: 0.3, proposal: false, note: "아직 어떤 후보도 거부하지 않은 상태의 target 분포입니다. 값은 설명을 위한 예입니다." },
  { label: "거부한 형제의 제안 분포", summary: "제안 A .4 · B .6", a: 0.7, b: 0.3, proposal: true, note: "같은 부모 아래의 후보들을 형제라고 합니다. 첫 형제의 후보를 거부하면 그 후보를 뽑아 온 제안 분포 (.4, .6)을 현재 남은 분포에서 뺍니다. 점선이 제안 분포입니다." },
  { label: "뺍니다", summary: ".7 − .4 = .3 · .3 − .6 = −.3", a: 0.3, b: -0.3, proposal: false, note: "B는 제안이 target보다 커서 음수가 됩니다. 확률로 쓸 수 없는 값입니다." },
  { label: "양수 부분만 남깁니다", summary: "A .3 · B 0", a: 0.3, b: 0, proposal: false, note: "음수인 B를 0으로 둡니다. 합이 .3이므로 아직 분포가 아닙니다." },
  { label: "다시 정규화합니다", summary: ".3 / .3 = 1 → (1, 0)", a: 1, b: 0, proposal: false, note: "합으로 나누면 잔여 분포는 (1, 0)입니다. 다음 형제를 확인할 때 원래 (.7, .3)이 아니라 이 갱신된 분포를 씁니다." },
];

const BASE = 124;
const SCALE = 104;
const BARS = [
  { key: "a", name: "A", x: 86 },
  { key: "b", name: "B", x: 210 },
] as const;
const BAR_W = 66;
const format = (value: number) => (value === 0 ? "0" : value === 1 ? "1" : value.toString().replace("0.", "."));

export default function ResidualDistributionViz() {
  return (
    <SceneShell
      eyebrow="거부 뒤의 분포"
      title="거부한 제안을 빼고 양수만 남겨 다시 정규화합니다"
      description="막대 높이는 확률에 비례하고 가로선이 0입니다. 파란 막대는 현재 분포, 점선은 제안 분포입니다."
      note="이 보장은 논문의 제안 선택·조건부 분포·중복 처리와 검증 규칙을 함께 지켰을 때 읽습니다."
      ariaLabel="거부한 제안 분포를 빼고 잔여 분포를 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 362 176" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {BARS.map((bar) => {
              const value = bar.key === "a" ? scene.a : scene.b;
              const proposal = bar.key === "a" ? 0.4 : 0.6;
              const height = Math.abs(value) * SCALE;
              const top = value >= 0 ? BASE - height : BASE;
              return (
                <g key={bar.key}>
                  <rect x={bar.x} y={top} width={BAR_W} height={height} rx={2} fill={value < 0 ? "#dc2626" : "#2563eb"} fillOpacity={0.75} />
                  {scene.proposal && <rect x={bar.x - 6} y={BASE - proposal * SCALE} width={BAR_W + 12} height={proposal * SCALE} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />}
                  <text x={bar.x + BAR_W / 2} y={value < 0 ? BASE + height + 16 : top - 6} textAnchor="middle" fontSize={14} fontWeight={700} className="fill-foreground">{format(value)}</text>
                  {scene.proposal && <text x={bar.x + BAR_W + 12} y={BASE - proposal * SCALE + 12} fontSize={12} fontWeight={700} fill="#d97706">{format(proposal)}</text>}
                  {value >= 0 && <text x={bar.x + BAR_W / 2} y={BASE + 18} textAnchor="middle" fontSize={13} className="fill-muted-foreground">{bar.name}</text>}
                  {value < 0 && <text x={bar.x + BAR_W / 2} y={BASE - 8} textAnchor="middle" fontSize={13} className="fill-muted-foreground">{bar.name}</text>}
                </g>
              );
            })}
            <line x1={40} x2={330} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
