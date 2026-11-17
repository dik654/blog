import SceneShell from "./SceneShell";

/**
 * 본문 대응: #fid — 1차원 N(0,1)과 N(2,1)은 공분산이 같고 평균 차의 제곱이 4라 FID=4.
 * 1차원에서 Σ = σ², 공분산 항 = σr² + σg² − 2σrσg = (σr − σg)².
 * 세 번째 장면의 σg = 2는 "중심은 같지만 퍼짐이 다른 경우"를 보이려는 가정값 → 0 + 1 = 1.
 */
const SCENES = [
  { label: "같은 분포", summary: "평균 항 0 + 공분산 항 0 = 0", mu: 0, sigma: 1, note: "실제와 생성 특징이 모두 N(0,1)이면 중심도 퍼짐도 같습니다. 두 항이 모두 0이라 FID도 0입니다." },
  { label: "중심만 2 이동", summary: "(0 − 2)² + 0 = 4", mu: 2, sigma: 1, note: "글의 예입니다. 생성 쪽이 N(2,1)로 옮겨 가면 퍼짐은 그대로라 공분산 항은 1 + 1 − 2 = 0이고, 평균 차의 제곱 4가 FID 전부입니다." },
  { label: "퍼짐만 두 배 (가정)", summary: "0 + (1 − 2)² = 1", mu: 0, sigma: 2, note: "생성 쪽을 N(0, 2²)로 둔 가정입니다. 중심이 같아 평균 항만 보면 첫 장면처럼 0입니다. 공분산 항 1 + 4 − 2·2 = 1이 퍼짐 차이를 잡아 FID가 1이 됩니다." },
] as const;

const W = 360;
const H = 158;
const BASE_Y = 128;
const X0 = 20;
const UNIT = 32; // 특징값 1 = 32px, 표시 범위 −4 … 6
const PEAK_SCALE = 250; // 밀도 1 = 250px
const px = (x: number) => X0 + (x + 4) * UNIT;
const TICKS = [-4, -2, 0, 2, 4, 6] as const;

function curve(mu: number, sigma: number) {
  return Array.from({ length: 101 }, (_, i) => {
    const x = -4 + i * 0.1;
    const density = Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2)) / (sigma * Math.sqrt(2 * Math.PI));
    return `${i === 0 ? "M" : "L"}${px(x).toFixed(1)},${(BASE_Y - density * PEAK_SCALE).toFixed(1)}`;
  }).join(" ");
}

const REAL_PATH = curve(0, 1);
const BAR_MAX = 4.5;

function Bar({ label, value, color, strong = false }: { label: string; value: number; color: string; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / BAR_MAX) * 100}%`, backgroundColor: color }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

export default function FidGapViz() {
  return (
    <SceneShell
      eyebrow="FID 두 항"
      title="중심이 움직인 차이와 퍼짐이 달라진 차이를 따로 더합니다"
      description="특징이 1차원 하나뿐인 장난감 예입니다. 파란 곡선은 실제 특징 N(0,1), 주황 곡선은 생성 특징입니다. 1차원에서 공분산 Σ는 분산 σ²이므로 공분산 항은 σr² + σg² − 2σrσg = (σr − σg)²로 줄어듭니다."
      ariaLabel="1차원 정규분포 두 개로 본 FID의 평균 항과 공분산 항"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const meanTerm = (0 - scene.mu) ** 2;
        const covTerm = (1 - scene.sigma) ** 2;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={X0} x2={W - X0} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
              {TICKS.map((t) => (
                <g key={t}>
                  <line x1={px(t)} x2={px(t)} y1={BASE_Y} y2={BASE_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={px(t)} y={BASE_Y + 16} textAnchor="middle" fontSize={11} fill="#64748b">{t}</text>
                </g>
              ))}
              <text x={W - X0} y={BASE_Y + 28} textAnchor="end" fontSize={11} fill="#64748b">특징값</text>
              <path d={REAL_PATH} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <path d={curve(scene.mu, scene.sigma)} fill="none" stroke="#f97316" strokeWidth={1.25} strokeDasharray="5 3" />
              <line x1={px(0)} x2={px(0)} y1={BASE_Y} y2={22} stroke="#2563eb" strokeWidth={1} strokeDasharray="2 3" />
              <line x1={px(scene.mu)} x2={px(scene.mu)} y1={BASE_Y} y2={22} stroke="#f97316" strokeWidth={1} strokeDasharray="2 3" />
              <text x={px(0) - 4} y={16} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">실제 N(0,1)</text>
              <text x={scene.sigma === 1 ? px(scene.mu) + 4 : px(2.2)} y={scene.sigma === 1 ? 16 : 88} textAnchor="start" fontSize={12} fontWeight={700} fill="#c2410c">
                {`생성 N(${scene.mu},${scene.sigma === 1 ? 1 : `${scene.sigma}²`})`}
              </text>
            </svg>
            <div className="mt-3 space-y-2">
              <Bar label="평균 항" value={meanTerm} color="#2563eb" />
              <Bar label="공분산 항" value={covTerm} color="#f97316" />
              <Bar label="FID" value={meanTerm + covTerm} color="#475569" strong />
            </div>
          </div>
        );
      }}
    />
  );
}
