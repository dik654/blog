/**
 * 본문 대응: #picture, #two-paths — 12 V 전원, 첫 1 kΩ, 그 뒤 같은 두 점에 붙은 두 갈래.
 * 이 파일은 그림 컴포넌트만 내보냅니다. 숫자 문구는 각 Viz가 넘깁니다.
 */
const WIRE = "#94a3b8";
const COMMON = "#d97706";
const BRANCH = "#2563eb";
const GROUP = "#16a34a";

export type CircuitHighlight = "none" | "common" | "branches";
export type CircuitMerge = "none" | "branches" | "all";

export interface CircuitLabels {
  r1: string;
  r2: string;
  r3: string;
  i1?: string;
  i2?: string;
  i3?: string;
  node?: string;
  merged?: string;
}

function Resistor({ x, y, w, h, color, strong }: { x: number; y: number; w: number; h: number; color: string; strong: boolean }) {
  return <rect x={x} y={y} width={w} height={h} rx={3} fill={strong ? color : "none"} fillOpacity={strong ? 0.15 : 0} stroke={color} strokeWidth={strong ? 1.25 : 1} />;
}

export default function CircuitDiagram({ highlight, merge, labels }: { highlight: CircuitHighlight; merge: CircuitMerge; labels: CircuitLabels }) {
  const commonColor = highlight === "common" ? COMMON : WIRE;
  const branchColor = highlight === "branches" ? BRANCH : WIRE;
  const branchFaded = merge !== "none";
  return (
    <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label="12 V 전원, 첫 저항, 두 갈래 저항이 있는 회로">
      {/* 전원 */}
      <line x1={30} y1={50} x2={30} y2={110} stroke={WIRE} strokeWidth={1} />
      <line x1={16} y1={110} x2={44} y2={110} stroke="currentColor" strokeWidth={1.25} />
      <line x1={23} y1={122} x2={37} y2={122} stroke="currentColor" strokeWidth={1.25} />
      <line x1={30} y1={122} x2={30} y2={190} stroke={WIRE} strokeWidth={1} />
      <text x={48} y={121} fontSize={14} fill="currentColor" fontWeight={700}>12 V</text>
      <text x={8} y={106} fontSize={13} fill="currentColor">+</text>
      {/* 공통 길: 전원 → 첫 저항 → 갈림길 */}
      <line x1={30} y1={50} x2={80} y2={50} stroke={commonColor} strokeWidth={highlight === "common" ? 1.25 : 1} />
      <Resistor x={80} y={40} w={70} h={20} color={commonColor} strong={highlight === "common"} />
      <line x1={150} y1={50} x2={200} y2={50} stroke={commonColor} strokeWidth={highlight === "common" ? 1.25 : 1} />
      <text x={115} y={30} fontSize={14} textAnchor="middle" fill="currentColor" fontWeight={700}>{labels.r1}</text>
      {labels.i1 ? (
        <text x={115} y={80} fontSize={14} textAnchor="middle" fill={COMMON} fontWeight={700}>{labels.i1}</text>
      ) : null}
      {/* 갈림길 위쪽 점과 두 갈래 */}
      <g opacity={branchFaded ? 0.45 : 1}>
        <line x1={200} y1={50} x2={330} y2={50} stroke={branchColor} strokeWidth={highlight === "branches" ? 1.25 : 1} />
        <line x1={200} y1={50} x2={200} y2={90} stroke={branchColor} strokeWidth={highlight === "branches" ? 1.25 : 1} />
        <Resistor x={190} y={90} w={20} h={60} color={branchColor} strong={highlight === "branches"} />
        <line x1={200} y1={150} x2={200} y2={190} stroke={branchColor} strokeWidth={highlight === "branches" ? 1.25 : 1} />
        <line x1={330} y1={50} x2={330} y2={90} stroke={branchColor} strokeWidth={highlight === "branches" ? 1.25 : 1} />
        <Resistor x={320} y={90} w={20} h={60} color={branchColor} strong={highlight === "branches"} />
        <line x1={330} y1={150} x2={330} y2={190} stroke={branchColor} strokeWidth={highlight === "branches" ? 1.25 : 1} />
      </g>
      <text x={182} y={114} fontSize={14} textAnchor="end" fill="currentColor" fontWeight={700}>{labels.r2}</text>
      <text x={312} y={114} fontSize={14} textAnchor="end" fill="currentColor" fontWeight={700}>{labels.r3}</text>
      {labels.i2 ? <text x={182} y={136} fontSize={13} textAnchor="end" fill={BRANCH} fontWeight={700}>{labels.i2}</text> : null}
      {labels.i3 ? <text x={312} y={136} fontSize={13} textAnchor="end" fill={BRANCH} fontWeight={700}>{labels.i3}</text> : null}
      <circle cx={200} cy={50} r={4} fill="currentColor" />
      <circle cx={200} cy={190} r={4} fill="currentColor" />
      <text x={208} y={32} fontSize={13} fill="currentColor">{labels.node ?? "갈림길 위쪽 점"}</text>
      {/* 돌아오는 쪽 */}
      <line x1={30} y1={190} x2={200} y2={190} stroke={WIRE} strokeWidth={1} />
      <line x1={200} y1={190} x2={330} y2={190} stroke={branchColor} strokeWidth={highlight === "branches" ? 1.25 : 1} opacity={branchFaded ? 0.45 : 1} />
      <text x={208} y={212} fontSize={13} fill="currentColor">기준 0 V · 아래쪽 점</text>
      {/* 하나로 줄인 범위 */}
      {merge === "branches" ? (
        <g>
          <rect x={90} y={68} width={262} height={108} rx={8} fill="none" stroke={GROUP} strokeWidth={1.25} strokeDasharray="6 4" />
          <text x={265} y={170} fontSize={14} textAnchor="middle" fill={GROUP} fontWeight={700}>{labels.merged}</text>
        </g>
      ) : null}
      {merge === "all" ? (
        <g>
          <rect x={68} y={12} width={284} height={164} rx={8} fill="none" stroke={GROUP} strokeWidth={1.25} strokeDasharray="6 4" />
          <text x={265} y={170} fontSize={14} textAnchor="middle" fill={GROUP} fontWeight={700}>{labels.merged}</text>
        </g>
      ) : null}
    </svg>
  );
}
