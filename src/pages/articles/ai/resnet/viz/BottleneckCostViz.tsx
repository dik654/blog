import SceneShell from "./SceneShell";

/**
 * 본문 대응: #architecture "Bottleneck은 parameter를 무조건 줄이는 장치가 아니다".
 * 같은 외부 width C에서 BasicBlock 18C², Bottleneck 2CB + 9B².
 * r = B/C로 두면 Bottleneck = (2r + 9r²)C².
 * r=1/4(expansion 4, C=4B): 0.5 + 0.5625 = 1.0625C²
 * r=1/2(가정): 1 + 2.25 = 3.25C²
 * r=1(가정): 2 + 9 = 11C²
 * r=1.5(가정): 3 + 20.25 = 23.25C² > 18C²
 * 교차점 9r² + 2r = 18 → r = (−2 + √652)/18 ≈ 1.31
 */
const BASIC = 18;
const RATIOS = [0.25, 0.5, 1, 1.5] as const;
const CROSS = (-2 + Math.sqrt(4 + 4 * 9 * 18)) / 18;

const cost = (r: number) => 2 * r + 9 * r * r;
const fmt = (value: number) => String(Number(value.toFixed(4)));

const SCENES = [
  { label: "B = C/4", summary: "1.0625C² vs 18C²", note: "Torchvision의 expansion 4처럼 C=4B이면 두 1×1이 0.5C², 가운데 3×3이 0.5625C²입니다. 비싼 3×3이 좁은 B 폭에서만 돌아서 같은 C의 BasicBlock 18C²보다 훨씬 작습니다." },
  { label: "B = C/2 (가정)", summary: "3.25C² vs 18C²", note: "내부 width를 절반만 줄이면 3×3 몫이 2.25C²로 커집니다. 여전히 18C²보다 작지만 B=C/4일 때의 세 배가 넘습니다." },
  { label: "B = C (가정)", summary: "11C² vs 18C²", note: "B를 줄이지 않으면 1×1 두 개가 2C²를 더합니다. 3×3이 하나뿐이라 아직 18C²보다는 작지만 차이가 많이 줄었습니다." },
  { label: "B = 1.5C (가정)", summary: "23.25C² > 18C²", note: "내부 width가 외부보다 넓으면 9B²가 20.25C²까지 커져 BasicBlock보다 비쌉니다. 이 식에서 교차점은 B≈1.31C입니다. 그래서 1×1이 있다는 사실만으로 더 싸다고 판단하지 않고 B와 C를 넣어 계산합니다." },
] as const;

const W = 360;
const H = 238;
const LEFT = 34;
const RIGHT = 344;
const TOP = 18;
const BASE = 132;
const R_MAX = 1.6;
const Y_MAX = 26;
const px = (r: number) => LEFT + (r / R_MAX) * (RIGHT - LEFT);
const py = (value: number) => BASE - (value / Y_MAX) * (BASE - TOP);
const CURVE = Array.from({ length: 41 }, (_, i) => (i / 40) * R_MAX)
  .map((r, i) => `${i === 0 ? "M" : "L"}${px(r).toFixed(1)} ${py(Math.min(cost(r), Y_MAX)).toFixed(1)}`)
  .join(" ");

const BAR_LEFT = 92;
const BAR_W = 250;
const bw = (value: number) => (value / Y_MAX) * BAR_W;

export default function BottleneckCostViz() {
  return (
    <SceneShell
      eyebrow="Parameter 계산"
      title="Bottleneck이 BasicBlock보다 싼지는 내부 width B에 달려 있습니다"
      description="둘 다 입력·출력 channel이 C인 block이고, 단위는 C²입니다. Bottleneck의 B는 가운데 3×3이 쓰는 내부 channel 수입니다. 위 곡선은 B/C에 따른 2CB+9B², 점선은 BasicBlock의 18C²입니다. Bias·normalization·projection shortcut은 뺐습니다."
      ariaLabel="내부 width B를 바꿀 때 Bottleneck parameter와 BasicBlock 18C² 비교"
      scenes={SCENES}
      render={(active) => {
        const r = RATIOS[active];
        const proj = 2 * r;
        const spatial = 9 * r * r;
        const total = proj + spatial;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT} x2={LEFT} y1={TOP} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {[0, 0.5, 1, 1.5].map((tick) => (
              <text key={tick} x={px(tick)} y={BASE + 13} textAnchor="middle" fontSize={10} fill="#64748b">{tick === 0 ? "0" : `${tick}C`}</text>
            ))}
            <text x={RIGHT} y={BASE - 6} textAnchor="end" fontSize={9} fill="#64748b">B</text>
            {[0, 10, 20].map((tick) => (
              <text key={tick} x={LEFT - 5} y={py(tick) + 3} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
            ))}
            <line x1={LEFT} x2={RIGHT} y1={py(BASIC)} y2={py(BASIC)} stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
            <text x={LEFT + 4} y={py(BASIC) - 5} fontSize={9.5} fill="#475569">BasicBlock 18C²</text>
            <line x1={px(CROSS)} x2={px(CROSS)} y1={py(BASIC)} y2={BASE} stroke="#d97706" strokeWidth={1} strokeDasharray="2 3" />
            <text x={px(CROSS) - 4} y={BASE - 6} textAnchor="end" fontSize={9} fill="#b45309">≈1.31C</text>
            <path d={CURVE} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            <circle cx={px(r)} cy={py(total)} r={4.5} fill={total > BASIC ? "#dc2626" : "#2563eb"} />
            <text x={px(r) + (r > 1.2 ? -8 : 8)} y={py(total) + (r > 1.2 ? -8 : 4)} textAnchor={r > 1.2 ? "end" : "start"} fontSize={10} fontWeight={700} fill={total > BASIC ? "#dc2626" : "#2563eb"}>
              {fmt(total)}C²
            </text>

            <text x={BAR_LEFT - 6} y={168} textAnchor="end" fontSize={10} fill="#475569">BasicBlock</text>
            <rect x={BAR_LEFT} y={158} width={bw(9)} height={14} fill="#94a3b8" />
            <rect x={BAR_LEFT + bw(9)} y={158} width={bw(9)} height={14} fill="#64748b" />
            <text x={BAR_LEFT + bw(4.5)} y={168.5} textAnchor="middle" fontSize={9} fill="#ffffff">3×3 9C²</text>
            <text x={BAR_LEFT + bw(13.5)} y={168.5} textAnchor="middle" fontSize={9} fill="#ffffff">3×3 9C²</text>

            <text x={BAR_LEFT - 6} y={196} textAnchor="end" fontSize={10} fill="#475569">Bottleneck</text>
            <rect x={BAR_LEFT} y={186} width={bw(proj)} height={14} fill="#93c5fd" />
            <rect x={BAR_LEFT + bw(proj)} y={186} width={bw(spatial)} height={14} fill="#2563eb" />
            <line x1={BAR_LEFT + bw(BASIC)} x2={BAR_LEFT + bw(BASIC)} y1={152} y2={206} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />

            <rect x={BAR_LEFT} y={216} width={9} height={9} fill="#93c5fd" />
            <text x={BAR_LEFT + 13} y={224} fontSize={10} fill="#475569">1×1 두 개 2CB = {fmt(proj)}C²</text>
            <rect x={BAR_LEFT + 140} y={216} width={9} height={9} fill="#2563eb" />
            <text x={BAR_LEFT + 153} y={224} fontSize={10} fill="#475569">3×3 9B² = {fmt(spatial)}C²</text>
          </svg>
        );
      }}
    />
  );
}
