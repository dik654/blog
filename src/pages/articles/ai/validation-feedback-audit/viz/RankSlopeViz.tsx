import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #small-case — 다섯 후보의 내부·공개 점수(가정).
 * 내부 [0.80,0.79,0.78,0.77,0.76], 공개 [0.76,0.74,0.75,0.72,0.73].
 * A는 0.04 낮아졌고, 선이 교차하는 B/C와 D/E 두 쌍만 우열이 바뀐다.
 */
const CANDIDATES = [
  { id: "A", local: 0.8, pub: 0.76 },
  { id: "B", local: 0.79, pub: 0.74 },
  { id: "C", local: 0.78, pub: 0.75 },
  { id: "D", local: 0.77, pub: 0.72 },
  { id: "E", local: 0.76, pub: 0.73 },
] as const;

const SWAPPED = new Set(["B", "C", "D", "E"]);

const W = 360;
const H = 236;
const TOP = 0.81;
const Y0 = 34;
const PX_PER_HUNDREDTH = 18;
const LX = 120;
const RX = 240;
const y = (value: number) => Y0 + Math.round((TOP - value) * 100) * PX_PER_HUNDREDTH;
const color = (id: string) => (id === "A" ? "#2563eb" : SWAPPED.has(id) ? "#d97706" : "#64748b");

export default function RankSlopeViz() {
  return (
    <VizFrame
      eyebrow="두 점수표"
      title="점수가 내려간 것과 선이 엇갈린 것은 다른 일입니다"
      description="왼쪽 축은 내부 점수, 오른쪽 축은 공개 점수입니다. 선 하나가 후보 하나이며, 위로 갈수록 좋은 점수입니다. 숫자는 이 글의 가정입니다."
      documentFlow
      note={
        <>
          <span className="font-semibold text-[#2563eb]">파란 선</span> A는 0.80→0.76으로 0.04 낮아졌지만 두 표 모두에서 1위입니다.{" "}
          <span className="font-semibold text-[#d97706]">주황 선</span>끼리 엇갈린 곳이 우열이 바뀐 쌍입니다: B/C와 D/E. 나머지 관계는 그대로라 공개 순서는 A, C, B, E, D입니다.
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label="다섯 후보의 내부 점수와 공개 점수를 잇는 선. B와 C, D와 E의 선만 교차한다.">
        <text x={LX} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">내부 점수</text>
        <text x={RX} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">공개 점수</text>
        <line x1={LX} x2={LX} y1={Y0 - 8} y2={y(0.72) + 8} stroke="#94a3b8" strokeWidth={1} />
        <line x1={RX} x2={RX} y1={Y0 - 8} y2={y(0.72) + 8} stroke="#94a3b8" strokeWidth={1} />
        {[0.8, 0.79, 0.78, 0.77, 0.76, 0.75, 0.74, 0.73, 0.72].flatMap((v) => [
          <line key={`l${v}`} x1={LX - 4} x2={LX} y1={y(v)} y2={y(v)} stroke="#94a3b8" strokeWidth={1} />,
          <line key={`r${v}`} x1={RX} x2={RX + 4} y1={y(v)} y2={y(v)} stroke="#94a3b8" strokeWidth={1} />,
        ])}
        {CANDIDATES.map((c) => (
          <g key={c.id}>
            <line x1={LX} y1={y(c.local)} x2={RX} y2={y(c.pub)} stroke={color(c.id)} strokeWidth={1.25} />
            <circle cx={LX} cy={y(c.local)} r={3.5} fill={color(c.id)} />
            <circle cx={RX} cy={y(c.pub)} r={3.5} fill={color(c.id)} />
            <text x={LX - 10} y={y(c.local) + 4} textAnchor="end" fontSize={12} fill="#334155">
              <tspan fontWeight={700} fill={color(c.id)}>{c.id}</tspan> {c.local.toFixed(2)}
            </text>
            <text x={RX + 10} y={y(c.pub) + 4} textAnchor="start" fontSize={12} fill="#334155">
              {c.pub.toFixed(2)} <tspan fontWeight={700} fill={color(c.id)}>{c.id}</tspan>
            </text>
          </g>
        ))}
        <text x={(LX + RX) / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="#64748b">세로 간격 한 칸 = 0.01</text>
      </svg>
    </VizFrame>
  );
}
