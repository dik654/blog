import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pipeline (14절) — 행렬곱 예산과 지수 예산을 직렬로 더할 때와 겹칠 때.
 * 가정 예산: 행렬곱 2, 지수 1 → 직렬 3, 완전 겹침 하한 max(2,1)=2.
 * d=128 점수 한 칸: 512 FLOP ÷ 989×10¹² ≈ 0.518ps, 지수 1회 ÷ 3.9×10¹² ≈ 0.256ps → 지수 비중 ≈ 0.256/0.774 ≈ 1/3.
 * d=64: 256 FLOP ÷ 989×10¹² ≈ 0.259ps → 두 항이 거의 같음.
 */
type Lane = { start: number; length: number };
type Scene = {
  label: string;
  summary: string;
  note: string;
  max: number;
  unit: string;
  ticks: readonly number[];
  mm: Lane;
  exp: Lane;
  mmLabel: string;
  expLabel: string;
};

const SCENES: readonly Scene[] = [
  {
    label: "직렬로 더하면",
    summary: "2 + 1 = 3",
    note: "가정한 일감 전체의 행렬곱 예산 2와 지수 예산 1을 차례로 쓰면 3시간 단위입니다. 한쪽 연산기가 일할 때 다른 쪽은 쉽니다.",
    max: 3,
    unit: "시간 단위(가정)",
    ticks: [0, 1, 2, 3],
    mm: { start: 0, length: 2 },
    exp: { start: 2, length: 1 },
    mmLabel: "2",
    expLabel: "1",
  },
  {
    label: "완전히 겹친다고 치면",
    summary: "max(2, 1) = 2",
    note: "다른 행이나 다음 조각의 독립 작업으로 두 연산기를 동시에 채우면 이상적인 하한은 긴 쪽인 2입니다. 시작·종료 구간, 의존성, 버퍼까지 넣으면 실제 완료시간이 2라고 보장할 수 없습니다.",
    max: 3,
    unit: "시간 단위(가정)",
    ticks: [0, 1, 2, 3],
    mm: { start: 0, length: 2 },
    exp: { start: 0, length: 1 },
    mmLabel: "2",
    expLabel: "1",
  },
  {
    label: "d=128 점수 한 칸",
    summary: "0.518ps + 0.256ps · 지수 약 1/3",
    note: "점수 한 칸당 행렬곱 512 FLOP를 989TFLOP/s로 나누면 약 0.518ps, 지수 한 번을 초당 약 3.9조 회로 나누면 약 0.256ps입니다. 직렬 합 약 0.774ps 중 지수가 약 1/3입니다. GPU 전체 최고 처리량으로 나눈 예산이며 명령 하나의 지연시간이 아닙니다.",
    max: 0.8,
    unit: "ps",
    ticks: [0, 0.2, 0.4, 0.6, 0.8],
    mm: { start: 0, length: 0.518 },
    exp: { start: 0.518, length: 0.256 },
    mmLabel: "0.518",
    expLabel: "0.256",
  },
  {
    label: "d=64 점수 한 칸",
    summary: "약 0.259ps ≈ 0.256ps",
    note: "성분 수가 절반이면 행렬곱 항도 절반인 약 0.259ps가 되어 지수 항과 거의 같아집니다. 최대값·합산·이동·실제 활용률을 뺀 비교라서 겹치기를 시도할 이유까지만 설명합니다.",
    max: 0.8,
    unit: "ps",
    ticks: [0, 0.2, 0.4, 0.6, 0.8],
    mm: { start: 0, length: 0.259 },
    exp: { start: 0.259, length: 0.256 },
    mmLabel: "0.259",
    expLabel: "0.256",
  },
];

const X0 = 74;
const W = 210;
const ROWS = [
  { key: "mm", name: "행렬곱", y: 30, fill: "#bfdbfe", stroke: "#2563eb" },
  { key: "exp", name: "지수", y: 74, fill: "#fde68a", stroke: "#d97706" },
] as const;

export default function OverlapBudgetViz() {
  return (
    <SceneShell
      eyebrow="연산기 두 종류의 예산"
      title="두 연산기의 일을 겹치면 합이 아니라 긴 쪽이 하한이 됩니다"
      description="가로는 시간입니다. 위 줄은 행렬곱 연산기, 아래 줄은 지수 연산기가 쓰는 처리량 예산입니다. 앞 두 장면과 뒤 두 장면은 단위와 축척이 다릅니다."
      ariaLabel="행렬곱과 지수 예산의 직렬 합과 겹침 하한"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const x = (t: number) => X0 + (t / scene.max) * W;
        const end = Math.max(scene.mm.start + scene.mm.length, scene.exp.start + scene.exp.length);
        return (
          <svg viewBox="0 0 300 150" className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.ticks.map((t) => (
              <g key={t}>
                <line x1={x(t)} y1={20} x2={x(t)} y2={112} stroke="#94a3b8" strokeWidth={1} opacity={0.3} />
                <text x={x(t)} y={126} textAnchor="middle" fontSize={10} fill="#64748b">{t}</text>
              </g>
            ))}
            <text x={X0 + W} y={142} textAnchor="end" fontSize={10} fill="#64748b">{scene.unit}</text>
            {ROWS.map((row) => {
              const lane = row.key === "mm" ? scene.mm : scene.exp;
              const label = row.key === "mm" ? scene.mmLabel : scene.expLabel;
              return (
                <g key={row.key}>
                  <text x={X0 - 8} y={row.y + 17} textAnchor="end" fontSize={11} fill="#64748b">{row.name}</text>
                  <rect x={x(lane.start)} y={row.y} width={x(lane.start + lane.length) - x(lane.start)} height={26} rx={3} fill={row.fill} stroke={row.stroke} strokeWidth={1} />
                  <text x={(x(lane.start) + x(lane.start + lane.length)) / 2} y={row.y + 17} textAnchor="middle" fontSize={10} fontWeight={700} fill="#1e293b">{label}</text>
                </g>
              );
            })}
            <line x1={x(end)} y1={18} x2={x(end)} y2={112} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="3 3" />
          </svg>
        );
      }}
    />
  );
}
