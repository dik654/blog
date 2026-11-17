import SceneShell from "./SceneShell";

/**
 * 본문 대응: #discriminator — D*(x) = p_data(x) / (p_data(x) + p_g(x)).
 * 본문 숫자: p_data = 0.6, p_g = 0.2 → 0.6 / 0.8 = 0.75.
 * 두 분포 모양은 가정: 폭이 같은 정규분포 두 개를 골라, x = 6에서 정확히 0.6과 0.2가 되도록 맞췄다.
 *   p_data = N(6, σ), σ = 1 / (0.6·√(2π))  → p_data(6) = 0.6
 *   p_g    = N(μ_g, σ), μ_g = 6 − σ·√(2 ln 3)  → p_g(6) = 0.6/3 = 0.2
 * 폭을 같게 둬야 D*가 x를 따라 한 방향으로만 움직인다. 폭이 다르면 두 곡선이 모두 0에 붙은
 * 꼬리에서 D*가 다시 꺾여, 그림에 보이지 않는 높이 차이가 결론을 좌우하게 된다.
 */
const ROOT_TWO_PI = Math.sqrt(2 * Math.PI);
const MU_DATA = 6;
const SD_DATA = 1 / (0.6 * ROOT_TWO_PI);
const SD_G = SD_DATA;
const MU_G = MU_DATA - SD_DATA * Math.sqrt(2 * Math.log(3));

const normal = (x: number, mu: number, sd: number) => Math.exp(-((x - mu) ** 2) / (2 * sd * sd)) / (sd * ROOT_TWO_PI);
const pData = (x: number) => normal(x, MU_DATA, SD_DATA);
const pG = (x: number) => normal(x, MU_G, SD_G);
const dStar = (x: number) => pData(x) / (pData(x) + pG(x));

/** μ_g와 6 사이에서 두 높이가 같아지는 점을 이분법으로 찾는다. */
const EQUAL_X = Array.from({ length: 40 }).reduce<[number, number]>(
  ([lo, hi]) => {
    const mid = (lo + hi) / 2;
    return pData(mid) < pG(mid) ? [mid, hi] : [lo, mid];
  },
  [MU_G, MU_DATA],
)[0];
const LOW_X = MU_G - 0.6;

const X_MIN = 2.5;
const X_MAX = 8.5;
const W = 360;
const LEFT = 30;
const RIGHT = 12;
const TOP_BASE = 112;
const TOP_TOP = 18;
const TOP_MAX = 0.65;
const BOT_BASE = 216;
const BOT_TOP = 140;

const sx = (x: number) => LEFT + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - LEFT - RIGHT);
const syTop = (v: number) => TOP_BASE - (v / TOP_MAX) * (TOP_BASE - TOP_TOP);
const syBot = (v: number) => BOT_BASE - v * (BOT_BASE - BOT_TOP);
const XS = Array.from({ length: 121 }, (_, i) => X_MIN + (i / 120) * (X_MAX - X_MIN));
const path = (f: (x: number) => number, sy: (v: number) => number) =>
  XS.map((x, i) => `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)} ${sy(f(x)).toFixed(1)}`).join(" ");
const DATA_PATH = path(pData, syTop);
const G_PATH = path(pG, syTop);
const D_PATH = path(dStar, syBot);

const REAL = "#2563eb";
const FAKE = "#d97706";

const f2 = (v: number) => v.toFixed(2);
const share = (x: number) => `${f2(pData(x))} ÷ (${f2(pData(x))} + ${f2(pG(x))}) = ${f2(dStar(x))}`;

const SCENES = [
  {
    label: "본문의 한 점",
    summary: "0.6 ÷ 0.8 = 0.75",
    x: MU_DATA,
    note: "이 x에서 실제 쪽 높이는 0.6, 생성 쪽 높이는 0.2입니다. 둘을 더한 0.8이 ‘이 x를 만들 수 있는 두 출처의 전체 mass’이고, 그중 실제 몫 0.6을 나누면 0.75입니다.",
  },
  {
    label: "두 높이가 같은 점",
    summary: share(EQUAL_X),
    x: EQUAL_X,
    note: "두 곡선이 만나는 x에서는 분자와 분모의 절반이 같아 D*가 0.5입니다. 이 x 하나만 보고는 실제와 생성을 가를 정보가 없습니다.",
  },
  {
    label: "생성 쪽이 훨씬 높은 점",
    summary: share(LOW_X),
    x: LOW_X,
    note: "생성 분포가 실제 분포보다 훨씬 많이 쌓인 x에서는 실제 몫이 작아 D*가 0에 가까워집니다. 아래 곡선은 이렇게 x마다 따로 계산한 몫을 이은 것입니다.",
  },
] as const;

export default function OptimalDiscriminatorViz() {
  return (
    <SceneShell
      eyebrow="Ideal discriminator"
      title="D*는 x마다 두 높이 중 실제 몫을 잽니다"
      description="data space를 가로축 하나로 줄이고 두 분포 모양을 골랐습니다(가정). 본문 숫자 0.6·0.2가 나오는 점만 본문에서 가져왔습니다. 아래 곡선은 G가 고정되고 D가 충분히 최적화됐다는 가정 아래의 ideal D*이며, 실제 network 출력이 아닙니다."
      ariaLabel="실제 분포와 생성 분포의 높이로 x마다 ideal discriminator 값을 계산하는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const x = scene.x;
        const real = pData(x);
        const fake = pG(x);
        const total = real + fake;
        return (
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5" style={{ backgroundColor: REAL }} />실제 분포 p_data</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 border-t-2 border-dashed" style={{ borderColor: FAKE }} />생성 분포 p_g</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-[#475569]" />D*(x)</span>
            </div>
            <svg viewBox={`0 0 ${W} 236`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={LEFT} y={12} fontSize={10} fill="#64748b">높이 (density)</text>
              <line x1={LEFT} x2={W - RIGHT} y1={TOP_BASE} y2={TOP_BASE} stroke="#94a3b8" strokeWidth={1} />
              <path d={DATA_PATH} fill="none" stroke={REAL} strokeWidth={1.25} />
              <path d={G_PATH} fill="none" stroke={FAKE} strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={LEFT} y={134} fontSize={10} fill="#64748b">D*(x)</text>
              <line x1={LEFT} x2={W - RIGHT} y1={BOT_BASE} y2={BOT_BASE} stroke="#94a3b8" strokeWidth={1} />
              <line x1={LEFT} x2={W - RIGHT} y1={syBot(0.5)} y2={syBot(0.5)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={LEFT} x2={W - RIGHT} y1={syBot(1)} y2={syBot(1)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="1 3" />
              {[0, 0.5, 1].map((v) => (
                <text key={v} x={LEFT - 4} y={syBot(v) + 3} fontSize={9} textAnchor="end" fill="#64748b">{v}</text>
              ))}
              <path d={D_PATH} fill="none" stroke="#475569" strokeWidth={1.25} />
              <line x1={sx(x)} x2={sx(x)} y1={TOP_TOP} y2={BOT_BASE} stroke="#64748b" strokeWidth={1} />
              <circle cx={sx(x)} cy={syTop(real)} r={3.5} fill={REAL} />
              <circle cx={sx(x)} cy={syTop(fake)} r={3.5} fill={FAKE} />
              <circle cx={sx(x)} cy={syBot(dStar(x))} r={3.5} fill="#475569" />
              <text x={sx(x) + (x > 6.5 ? -6 : 6)} y={syBot(dStar(x)) - 6} fontSize={11} fontWeight={700} textAnchor={x > 6.5 ? "end" : "start"} fill="#475569">{f2(dStar(x))}</text>
              <text x={W - RIGHT} y={230} fontSize={9} textAnchor="end" fill="#64748b">x (한 축으로 줄인 data space, 가정)</text>
            </svg>
            <div className="mt-3 space-y-1 text-xs">
              <p className="text-muted-foreground">이 x에서 두 출처의 전체 mass {f2(total)} 중</p>
              <div className="flex h-5 w-full overflow-hidden rounded-sm border border-border">
                <div className="flex items-center justify-center font-mono text-[11px] font-bold text-white" style={{ width: `${(real / total) * 100}%`, backgroundColor: REAL }}>{real / total > 0.12 ? f2(real) : ""}</div>
                <div className="flex items-center justify-center font-mono text-[11px] font-bold text-white" style={{ width: `${(fake / total) * 100}%`, backgroundColor: FAKE }}>{fake / total > 0.12 ? f2(fake) : ""}</div>
              </div>
              <p className="font-mono">실제 몫 = {share(x)}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
