import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 첫 문단과 둘째 문단 앞부분 — 가계·은행·보험·연기금이 국채를 사며 현재 자금을 제공하고,
 * 전후 세금으로 이자를 지급하면 납세자의 돈이 채권 보유자에게 이동한다. 중앙은행이 보유하면 통화·금리·재무부 관계가 달라지고,
 * 연금·보험기금이 보유하면 이자가 노후급여 재원이 되기도 한다.
 * 위치는 관계만 보이는 개략도이고 화살표 굵기는 금액이 아니다.
 */
const ON = "#2563eb";
const TAX = "#16a34a";
const CB = "#7c3aed";
const DIM = "#94a3b8";

interface Scene {
  label: string;
  summary: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "전쟁 중: 국채를 팔아 자금을 모읍니다", summary: "보유자 → 자금 → 정부", note: "정부가 국채를 발행하면 가계·은행·보험·연기금이 사며 현재 자금을 제공합니다. 대신 이들은 앞으로 이자와 원금을 받을 청구권인 국채를 쥡니다." },
  { label: "전후: 세금으로 이자를 냅니다", summary: "납세자 → 세금 → 정부 → 이자 → 보유자", note: "전후 세금으로 이자를 지급하면 납세자의 돈이 정부를 거쳐 채권 보유자에게 이동합니다. 5절이 말한 대로 납세자와 채권 보유자가 다르면 국내 국채라도 분배 효과가 남습니다." },
  { label: "중앙은행이 채권을 보유하면", summary: "통화·금리·재무부 관계가 달라짐", note: "중앙은행이 국채를 보유하면 통화·금리·재무부의 관계가 달라진다고 글은 씁니다. 어떻게 달라지는지는 이 문단에서 더 나누지 않아, 그림에도 관계만 표시했습니다." },
  { label: "연기금이 채권을 보유하면", summary: "이자 → 연기금 → 노후급여", note: "연금과 보험기금이 국채를 들고 있으면 정부가 내는 이자가 노후급여의 재원이 되기도 합니다. 납세자가 낸 세금이 이자로 연기금에 들어가고, 연기금이 그 돈을 급여로 내보내는 길입니다." },
];

function Node({ x, y, label, on, color = ON, sub }: { x: number; y: number; label: string; on: boolean; color?: string; sub?: string }) {
  const w = label.length * 14 + 18;
  return (
    <g opacity={on ? 1 : 0.4}>
      <rect x={x - w / 2 + 0.5} y={y - 13.5} width={w - 1} height={27} rx={8} fill={on ? color : "none"} fillOpacity={0.12} stroke={on ? color : DIM} strokeWidth={1} />
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize={14} fontWeight={on ? 700 : 500} fill="currentColor">{label}</text>
      {sub && <text x={x} y={y + 30} textAnchor="middle" fontSize={12} fill="currentColor" fillOpacity={0.75}>{sub}</text>}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, label, color, on, labelDy = -6 }: { x1: number; y1: number; x2: number; y2: number; label: string; color: string; on: boolean; labelDy?: number }) {
  if (!on) return null;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a = 6;
  const left = `${x2 - a * Math.cos(angle - 0.5)},${y2 - a * Math.sin(angle - 0.5)}`;
  const right = `${x2 - a * Math.cos(angle + 0.5)},${y2 - a * Math.sin(angle + 0.5)}`;
  const vertical = Math.abs(x2 - x1) < 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} />
      <polyline points={`${left} ${x2},${y2} ${right}`} fill="none" stroke={color} strokeWidth={1.25} />
      <text x={vertical ? x1 + 8 : (x1 + x2) / 2} y={vertical ? (y1 + y2) / 2 + 4 : (y1 + y2) / 2 + labelDy} textAnchor={vertical ? "start" : "middle"} fontSize={12.5} fontWeight={600} fill={color}>{label}</text>
    </g>
  );
}

const GOV_X = 166;
const HOLD_X = 282;
const TAX_X = 46;
const MID_Y = 106;

export default function BondClaimFlowViz() {
  return (
    <SceneShell
      eyebrow="청구권의 이동"
      title="국채 이자는 납세자의 돈을 채권 보유자에게 옮깁니다"
      description="국채는 정부가 앞으로 이자와 원금을 주겠다고 약속한 증서, 곧 청구권입니다. 상자는 돈을 내거나 받는 쪽이고 화살표는 그 장면에서 움직이는 돈이나 청구권입니다. 위치와 화살표 굵기는 금액을 뜻하지 않습니다."
      ariaLabel="국채 발행, 세금으로 이자 지급, 중앙은행 보유, 연기금 보유에 따라 돈과 청구권이 움직이는 길"
      scenes={SCENES}
      render={(active) => {
        const issue = active === 0;
        const interest = active === 1 || active === 3;
        const central = active === 2;
        const pension = active === 3;
        return (
          <svg viewBox="0 0 340 226" className="mx-auto h-auto w-full max-w-[500px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Node x={GOV_X} y={28} label="중앙은행" on={central} color={CB} />
            <Node x={TAX_X} y={MID_Y} label="납세자" on={interest} color={TAX} />
            <Node x={GOV_X} y={MID_Y} label="정부" on />
            <Node x={HOLD_X} y={MID_Y} label="채권 보유자" on={!central} sub={pension ? "연기금·보험기금" : "가계·은행·보험·연기금"} />
            <Node x={HOLD_X} y={196} label="연금 수급자" on={pension} color={TAX} />

            <Arrow x1={HOLD_X - 53} y1={MID_Y - 7} x2={GOV_X + 24} y2={MID_Y - 7} label="자금" color={ON} on={issue} labelDy={-6} />
            <Arrow x1={GOV_X + 24} y1={MID_Y + 7} x2={HOLD_X - 53} y2={MID_Y + 7} label="국채" color={ON} on={issue} labelDy={16} />

            <Arrow x1={TAX_X + 31} y1={MID_Y} x2={GOV_X - 24} y2={MID_Y} label="세금" color={TAX} on={interest} />
            <Arrow x1={GOV_X + 24} y1={MID_Y} x2={HOLD_X - 53} y2={MID_Y} label="이자" color={ON} on={interest} />

            <Arrow x1={GOV_X} y1={MID_Y - 14} x2={GOV_X} y2={42} label="국채 보유" color={CB} on={central} />
            <Arrow x1={HOLD_X} y1={MID_Y + 38} x2={HOLD_X} y2={182} label="노후급여" color={TAX} on={pension} />
          </svg>
        );
      }}
    />
  );
}
