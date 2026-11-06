import ArrowHead from "./ArrowHead";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 만들 수 있는 100, 길의 한도 80, 원하는 100. 도착 80, 부족 20 (모두 가정).
 * 세로 1px = 1MWh. 부족 20을 채우는 방법은 글이 든 두 선택만 그린다.
 */
const BASE = 170;
const TOP_100 = BASE - 100;
const TOP_80 = BASE - 80;

const SCENES = [
  { label: "세 숫자", summary: "100 · 80 · 100 MWh", note: "오후 한 시간 동안 발전소는 100을 만들 수 있고, 길은 80까지만 통과시키며, 공장은 100을 원한다고 놓았습니다(가정). 손실과 다른 이용자는 우선 생략합니다." },
  { label: "도착하는 양", summary: "도착 80 · 부족 20", note: "그 발전소에서 공장으로 도착할 양은 80MWh입니다. 공장 막대의 위쪽 20이 비어 있습니다." },
  { label: "길에서 버리는 것이 아닙니다", summary: "100 생산 후 20 폐기 ✕", note: "100MWh를 먼저 만든 뒤 20MWh를 길에서 버린다는 뜻은 아닙니다. 발전소 쪽 점선처럼 미리 생산을 줄이는 선택도 있습니다." },
  { label: "부족한 20", summary: "근처 공급 또는 사용 축소", note: "나머지 20MWh는 공장 근처의 다른 공급원에서 구해야 합니다. 사용을 줄이는 선택도 있습니다." },
];

export default function ShortfallViz() {
  return (
    <SceneShell
      eyebrow="100 · 80 · 20"
      title="길의 폭이 도착량을 정하고 나머지 20은 다른 곳에서 풀어야 합니다"
      description="세로 높이가 한 시간의 에너지(MWh)입니다. 숫자는 모두 가정이며 MWh의 뜻은 3절에서 다룹니다."
      ariaLabel="발전소 100, 길 80, 공장 100에서 80만 도착하고 20이 부족한 그림"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 212" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active >= 1 && <rect x={90} y={TOP_80} width={180} height={80} fill="#2563eb" fillOpacity={0.18} />}
          <rect x={30} y={TOP_100} width={60} height={100} rx={4} fill={active >= 1 ? "none" : "#64748b"} fillOpacity={0.12} stroke="#64748b" strokeWidth={1} strokeDasharray={active === 2 ? "4 3" : undefined} />
          {active >= 1 && <rect x={30} y={TOP_80} width={60} height={80} fill="#2563eb" fillOpacity={0.3} />}
          <line x1={130} x2={230} y1={TOP_80} y2={TOP_80} stroke="#475569" strokeWidth={1.25} />
          <line x1={130} x2={230} y1={BASE} y2={BASE} stroke="#475569" strokeWidth={1.25} />
          <rect x={270} y={TOP_100} width={60} height={100} rx={4} fill={active === 0 ? "#64748b" : "none"} fillOpacity={0.12} stroke="#64748b" strokeWidth={1} />
          {active >= 1 && <rect x={270} y={TOP_80} width={60} height={80} fill="#2563eb" fillOpacity={0.3} />}
          {active >= 1 && <text x={180} y={BASE - 34} textAnchor="middle" fontSize={14} fontWeight={700} fill="#2563eb">80 도착</text>}
          {active >= 1 && <ArrowHead x={126} y={BASE - 40} color="#2563eb" />}
          {active >= 1 && <ArrowHead x={258} y={BASE - 40} color="#2563eb" />}
          {active >= 1 && (
            <>
              <rect x={270} y={TOP_100} width={60} height={20} fill="#dc2626" fillOpacity={0.1} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
              <text x={300} y={TOP_100 + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">부족 20</text>
            </>
          )}
          {active === 2 && (
            <g fontWeight={700} textAnchor="middle">
              <text x={60} y={TOP_100 + 14} fontSize={11} fill="#64748b">20</text>
              <text x={180} y={24} fontSize={12} fill="#dc2626">✕ 100을 만든 뒤 20을 길에서 버림</text>
              <text x={150} y={46} fontSize={12} fill="currentColor">미리 생산을 줄이는 선택도 있음</text>
              <path d="M 60 50 V 62" stroke="#64748b" strokeWidth={1} fill="none" />
              <path d="M 60 50 H 66" stroke="#64748b" strokeWidth={1} fill="none" />
            </g>
          )}
          {active === 3 && (
            <g>
              <rect x={232} y={12} width={118} height={30} rx={6} fill="#16a34a" fillOpacity={0.12} stroke="#16a34a" strokeWidth={1} />
              <text x={291} y={32} textAnchor="middle" fontSize={12} fontWeight={700} fill="#15803d">근처 다른 공급원</text>
              <line x1={300} x2={300} y1={42} y2={68} stroke="#16a34a" strokeWidth={1.25} />
              <ArrowHead x={300} y={70} angle={90} color="#16a34a" />
              <text x={222} y={32} textAnchor="end" fontSize={12} fontWeight={700} fill="currentColor">또는 사용을 줄임 ·</text>
            </g>
          )}
          <g textAnchor="middle" fill="currentColor">
            <text x={60} y={BASE + 18} fontSize={12} fontWeight={700}>발전소</text>
            <text x={180} y={BASE + 18} fontSize={12} fontWeight={700}>먼 공장으로 가는 길</text>
            <text x={300} y={BASE + 18} fontSize={12} fontWeight={700}>공장</text>
          </g>
          <g textAnchor="middle" fontSize={11} fill="#64748b">
            <text x={60} y={BASE + 34}>만들 수 있는 양 100</text>
            <text x={180} y={BASE + 34}>통과 한도 80</text>
            <text x={300} y={BASE + 34}>원하는 양 100</text>
          </g>
        </svg>
      )}
    />
  );
}
