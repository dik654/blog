import SceneShell from "./SceneShell";

/**
 * 본문 대응: #vae-loss — K_j = −½(1 + log σ² − μ² − σ²) = μ²/2 + (σ² − log σ² − 1)/2.
 * 마지막 장면과 두 번째 장면은 첫 Viz의 μ=[1,−0.5], log σ²=[0,−1.386]과 같고 합은 약 0.94다.
 */
const meanCost = (mu: number) => (mu * mu) / 2;
const scaleCost = (s2: number) => (s2 - Math.log(s2) - 1) / 2;

const SCENES = [
  { label: "prior와 같은 축", summary: "μ=0 · σ²=1 → K=0", mu: 0, s2: 1, note: "두 곡선이 겹치면 비용은 0입니다. 모든 축이 이러면 latent가 입력 정보를 담지 않는 posterior collapse와 연결될 수 있지만, KL=0 하나로 원인을 확정하지는 않습니다." },
  { label: "중심만 이동", summary: "μ=1 · σ²=1 → K=0.500", mu: 1, s2: 1, note: "폭은 같고 중심만 1 옮겼습니다. μ²/2=0.5만 비용이 됩니다. 글 첫 Viz의 첫 번째 축 값입니다." },
  { label: "폭이 좁아짐", summary: "μ=0 · σ²=0.25 → K=0.318", mu: 0, s2: 0.25, note: "중심이 그대로여도 분산이 1보다 작으면 비용이 생깁니다." },
  { label: "폭이 넓어짐", summary: "μ=0 · σ²=4 → K=0.807", mu: 0, s2: 4, note: "분산이 1보다 커져도 비용이 생깁니다. 1에서 어느 쪽으로 벗어나도 비용이 붙습니다." },
  { label: "둘 다 어긋남", summary: "μ=−0.5 · σ²=0.25 → K=0.443", mu: -0.5, s2: 0.25, note: "두 비용을 더합니다(0.125+0.318). 글 첫 Viz의 두 번째 축 값이고, 첫 번째 축 0.5와 합치면 그 Viz의 KL 약 0.94입니다." },
] as const;

const W = 360;
const H = 128;
const LEFT = 12;
const RIGHT = W - 12;
const BASE = 108;
const TOP = 12;
const XMIN = -4;
const XMAX = 4;
const YMAX = 0.82;
const GRID = Array.from({ length: 81 }, (_, index) => XMIN + (index * (XMAX - XMIN)) / 80);
const px = (x: number) => LEFT + ((x - XMIN) / (XMAX - XMIN)) * (RIGHT - LEFT);
const py = (y: number) => BASE - (y / YMAX) * (BASE - TOP);
const bell = (mu: number, s2: number) =>
  GRID.map((x, index) => {
    const y = Math.exp(-((x - mu) ** 2) / (2 * s2)) / Math.sqrt(2 * Math.PI * s2);
    return `${index === 0 ? "M" : "L"}${px(x).toFixed(1)},${py(y).toFixed(1)}`;
  }).join(" ");

const COST_SCALE = 1;

function CostBar({ label, value, color, strong = false }: { label: string; value: number; color: string; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[5.25rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-3.5 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / COST_SCALE) * 100}%`, backgroundColor: color }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value.toFixed(3)}</span>
    </div>
  );
}

export default function KlShapeViz() {
  return (
    <SceneShell
      eyebrow="축 하나의 KL"
      title="중심이 옮겨 가도, 폭이 달라져도 KL 비용이 생깁니다"
      description="latent 축 j 하나만 봅니다. 점선은 prior N(0,1), 실선은 encoder의 분포입니다. 이 축의 비용 K_j = −½(1 + log σ² − μ² − σ²)을 모든 축에서 더하면 KL입니다."
      ariaLabel="평균과 분산에 따라 한 축의 KL 비용이 달라지는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const mean = meanCost(scene.mu);
        const scale = scaleCost(scene.s2);
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              {[-2, 0, 2].map((tick) => (
                <g key={tick}>
                  <line x1={px(tick)} x2={px(tick)} y1={BASE} y2={BASE + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={px(tick)} y={BASE + 17} textAnchor="middle" fontSize={11} fill="#64748b">{tick < 0 ? `−${-tick}` : tick}</text>
                </g>
              ))}
              <path d={bell(0, 1)} fill="none" stroke="#64748b" strokeWidth={1.25} strokeDasharray="4 3" />
              <path d={bell(scene.mu, scene.s2)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            </svg>
            <div className="mt-3 space-y-1.5">
              <CostBar label="중심 비용" value={mean} color="#d97706" />
              <CostBar label="폭 비용" value={scale} color="#7c3aed" />
              <CostBar label="K_j 합계" value={mean + scale} color="#2563eb" strong />
            </div>
          </div>
        );
      }}
    />
  );
}
