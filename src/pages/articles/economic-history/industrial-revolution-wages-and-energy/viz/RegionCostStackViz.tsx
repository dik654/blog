import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 같은 생산을 만드는 두 방법을 고임금(주급 10)과 저임금(주급 6) 지역에서 같은 축으로 비교.
 * 1단위 = 3px. 기계 35 + 석탄 15는 두 지역에서 같고 임금 칸만 달라집니다.
 * 산수: 10×10=100, 50+40=90 / 10×6=60, 50+24=74 / 주급 −4 → 사람 방식 −40, 기계 방식 −16.
 */
const SCENES = [
  { label: "고임금 지역", summary: "사람 100 · 기계 90", note: "주급이 10이면 사람 10명은 100이고 기계 방식은 35+15+40=90입니다. 기계가 주당 10을 아낍니다." },
  { label: "저임금 지역", summary: "사람 60 · 기계 74", note: "주급이 6이면 사람 10명은 60이고 기계 방식은 35+15+24=74입니다. 같은 기계가 14 더 듭니다." },
  { label: "왜 뒤집히나", summary: "주급 −4: 사람 −40 · 기계 −16", note: "기계·석탄 50은 임금과 무관해 그대로입니다. 주급이 4 내리면 사람 방식은 10명분 40이 빠지고 기계 방식은 4명분 16만 빠집니다." },
] as const;

const W = 320;
const H = 200;
const UNIT = 3;
const X = 8;
const BAR_H = 24;
const MACHINE = "#2563eb";
const COAL = "#d97706";
const WAGE = "#64748b";
const GOOD = "#16a34a";
const WARN = "#dc2626";

function Seg({ x, y, value, color, text }: { x: number; y: number; value: number; color: string; text: string }) {
  return (
    <g>
      <rect x={x} y={y} width={value * UNIT - 1} height={BAR_H} fill={color} />
      <text x={x + (value * UNIT - 1) / 2} y={y + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">{text}</text>
    </g>
  );
}

function Pair({ y, wage, title, verdict, verdictColor, dim, bracket }: { y: number; wage: number; title: string; verdict: string; verdictColor: string; dim: boolean; bracket: boolean }) {
  const person = 10 * wage;
  const machineWage = 4 * wage;
  return (
    <g opacity={dim ? 0.3 : 1}>
      <text x={X} y={y + 12} fontSize={13} fontWeight={700} fill={WAGE}>{title}</text>
      <text x={W - 4} y={y + 12} textAnchor="end" fontSize={13} fontWeight={700} fill={verdictColor}>{verdict}</text>
      <Seg x={X} y={y + 20} value={person} color={WAGE} text={`사람 ${person}`} />
      <Seg x={X} y={y + 20 + BAR_H + 6} value={35} color={MACHINE} text="기계 35" />
      <Seg x={X + 35 * UNIT} y={y + 20 + BAR_H + 6} value={15} color={COAL} text="석탄 15" />
      <Seg x={X + 50 * UNIT} y={y + 20 + BAR_H + 6} value={machineWage} color={WAGE} text={`임금 ${machineWage}`} />
      {bracket && (
        <path d={`M${X} ${y + 20 + 2 * BAR_H + 10} v5 H${X + 50 * UNIT - 1} v-5`} fill="none" stroke={MACHINE} strokeWidth={1.25} />
      )}
      {bracket && <text x={X + 50 * UNIT + 6} y={y + 20 + 2 * BAR_H + 20} fontSize={12} fontWeight={700} fill={MACHINE}>임금과 무관한 50</text>}
    </g>
  );
}

export default function RegionCostStackViz() {
  return (
    <SceneShell
      eyebrow="같은 기계, 두 지역"
      title="기계의 50은 그대로이고 임금 칸만 줄어 손익이 뒤집힙니다"
      description="같은 기계가 왜 지역마다 갈릴까요? 네 막대는 같은 축이고 왼쪽에서 함께 시작합니다."
      note="노동자 10명, 기계 방식 4명, 기계 35, 석탄 15, 주급 10과 6은 모두 설명용 가정입니다."
      ariaLabel="주급 10과 주급 6인 지역의 사람 방식과 기계 방식 비용 막대"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          <Pair y={2} wage={10} title="주급 10 지역" verdict="기계가 10 쌈" verdictColor={GOOD} dim={index === 1} bracket={index === 2} />
          <Pair y={104} wage={6} title="주급 6 지역" verdict="기계가 14 비쌈" verdictColor={WARN} dim={index === 0} bracket={index === 2} />
        </svg>
      )}
    />
  );
}
