import SceneShell from "./SceneShell";
import SvgArrow from "./SvgArrow";

/**
 * 본문 대응: #mechanism — 한국 식품위생법 제39조 제3항(승계한 날부터 1개월 이내 신고),
 * 제78조(처분기간이 끝난 날부터 1년간 효과 승계, 진행 중 절차 계속, 알지 못했음을 증명하면 예외).
 * 가로 길이는 기간에 비례하지 않습니다.
 */
const W = 340;
const H = 176;
const BRANCH_H = 180;
const AXIS_Y = 112;

const ACCENT = "#2563eb";
const WARN = "#b45309";
const FAIL = "#dc2626";
const DIM = "#94a3b8";
const TEXT = "#64748b";

const SCENES = [
  { label: "지위 승계 신고", summary: "승계한 날 + 1개월", note: "한국 음식점의 영업자 지위를 승계했다면 승계한 날부터 1개월 이내에 그 사실을 신고해야 합니다. 시계는 승계한 날부터 돌아갑니다." },
  { label: "처분 효과의 1년", summary: "처분기간 끝난 날 + 1년", note: "기존 점주가 받은 행정 제재처분의 효과가 처분기간이 끝난 날부터 1년간 양수인에게 승계됩니다. 처분기간이 지나 끝난 일처럼 보여도 그 뒤 1년이 남아 있습니다." },
  { label: "진행 중인 절차", summary: "양수 뒤에도 계속", note: "양수하기 전에 시작된 절차가 아직 진행 중이면 그 절차도 양수인에게 계속할 수 있습니다. 끝난 처분만 따지면 이 줄을 놓칩니다." },
  { label: "몰랐음을 증명하면", summary: "증명 → 승계 안 됨", note: "양수할 때 그 처분이나 위반 사실을 몰랐음을 양수인이 증명하면 승계되지 않습니다. 인수 전 확인에서 이력이 나오면 이미 알게 된 것이라 이 예외에 기대기 어렵고, 안 나오면 그 기록이 몰랐다는 자료가 될 수 있습니다." },
] as const;

function Mark({ x, label }: { x: number; label: string }) {
  return (
    <g>
      <line x1={x} x2={x} y1={AXIS_Y - 58} y2={AXIS_Y + 8} stroke={ACCENT} strokeWidth={1.25} />
      <text x={x} y={AXIS_Y - 64} textAnchor="middle" fontSize={13} fontWeight={700} fill={ACCENT}>{label}</text>
    </g>
  );
}

function Stage({ step }: { step: number }) {
  const aria = `${SCENES[step].label}: ${SCENES[step].summary}`;
  if (step === 3) {
    return (
      <svg viewBox={`0 0 ${W} ${BRANCH_H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={aria}>
        <rect x={90} y={4} width={160} height={28} rx={8} fill="none" stroke={TEXT} strokeWidth={1} />
        <text x={170} y={23} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEXT}>인수 전 이력 확인</text>
        <SvgArrow x1={130} y1={32} x2={84} y2={46} color={ACCENT} />
        <SvgArrow x1={210} y1={32} x2={256} y2={46} color={WARN} />
        <rect x={8} y={46} width={152} height={30} rx={8} fill="none" stroke={ACCENT} strokeWidth={1.25} />
        <text x={84} y={66} textAnchor="middle" fontSize={13} fontWeight={700} fill={ACCENT}>이력이 안 나옴</text>
        <rect x={180} y={46} width={152} height={30} rx={8} fill="none" stroke={WARN} strokeWidth={1.25} />
        <text x={256} y={66} textAnchor="middle" fontSize={13} fontWeight={700} fill={WARN}>이력이 나옴</text>
        <SvgArrow x1={84} y1={76} x2={84} y2={90} color={ACCENT} />
        <SvgArrow x1={256} y1={76} x2={256} y2={90} color={WARN} />
        <rect x={8} y={90} width={152} height={30} rx={8} fill="none" stroke={ACCENT} strokeWidth={1.25} />
        <text x={84} y={110} textAnchor="middle" fontSize={13} fontWeight={700} fill={ACCENT}>양수 때 몰랐음을 증명?</text>
        <rect x={180} y={90} width={152} height={30} rx={8} fill="none" stroke={WARN} strokeWidth={1.25} />
        <text x={256} y={110} textAnchor="middle" fontSize={13} fontWeight={700} fill={WARN}>알게 됨 → 예외 어려움</text>
        <SvgArrow x1={84} y1={120} x2={84} y2={134} color={ACCENT} />
        <SvgArrow x1={256} y1={120} x2={256} y2={134} color={WARN} />
        <rect x={8} y={134} width={152} height={42} rx={8} fill="none" stroke={ACCENT} strokeWidth={1.25} />
        <text x={84} y={151} textAnchor="middle" fontSize={13} fontWeight={700} fill={ACCENT}>증명 → 승계 안 됨</text>
        <text x={84} y={168} textAnchor="middle" fontSize={13} fontWeight={700} fill={WARN}>못 하면 → 승계</text>
        <rect x={180} y={134} width={152} height={42} rx={8} fill="none" stroke={WARN} strokeWidth={1.25} />
        <text x={256} y={151} textAnchor="middle" fontSize={13} fontWeight={700} fill={WARN}>승계를 전제로</text>
        <text x={256} y={168} textAnchor="middle" fontSize={13} fontWeight={700} fill={WARN}>가격·계약 조건에 반영</text>
      </svg>
    );
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={aria}>
      <line x1={8} x2={W - 8} y1={AXIS_Y} y2={AXIS_Y} stroke={DIM} strokeWidth={1} />
      {step === 0 && (
        <g>
          <Mark x={70} label="승계한 날" />
          <rect x={70} y={AXIS_Y - 34} width={190} height={28} fill={ACCENT} />
          <text x={165} y={AXIS_Y - 15} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">1개월 이내 신고</text>
          <line x1={260} x2={260} y1={AXIS_Y - 40} y2={AXIS_Y + 8} stroke={FAIL} strokeWidth={1.25} />
          <text x={260} y={AXIS_Y + 26} textAnchor="middle" fontSize={13} fontWeight={700} fill={FAIL}>기한</text>
        </g>
      )}
      {step === 1 && (
        <g>
          <rect x={8} y={AXIS_Y - 34} width={92} height={28} fill={TEXT} />
          <text x={54} y={AXIS_Y - 15} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">처분기간</text>
          <rect x={100} y={AXIS_Y - 34} width={232} height={28} fill="none" stroke={WARN} strokeWidth={1.25} strokeDasharray="4 3" />
          <text x={180} y={AXIS_Y - 15} textAnchor="middle" fontSize={13} fontWeight={700} fill={WARN}>1년간 효과 승계</text>
          <line x1={100} x2={100} y1={AXIS_Y - 40} y2={AXIS_Y + 8} stroke={TEXT} strokeWidth={1} />
          <text x={100} y={AXIS_Y + 26} textAnchor="middle" fontSize={13} fill={TEXT}>끝난 날</text>
          <Mark x={280} label="예: 이때 양수" />
        </g>
      )}
      {step === 2 && (
        <g>
          <rect x={40} y={AXIS_Y - 34} width={292} height={28} fill={TEXT} />
          <text x={135} y={AXIS_Y - 15} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">진행 중인 제재 절차</text>
          <text x={100} y={AXIS_Y + 26} textAnchor="middle" fontSize={13} fill={TEXT}>기존 점주 때 시작</text>
          <text x={W - 8} y={AXIS_Y + 26} textAnchor="end" fontSize={13} fontWeight={700} fill={WARN}>양수인에게 계속</text>
          <Mark x={240} label="양수" />
        </g>
      )}
    </svg>
  );
}

export default function FoodLawWindowViz() {
  return (
    <SceneShell
      eyebrow="한국 음식점 사례"
      title="영업을 넘겨받으면 기한 하나와 이어받는 구간 둘이 생깁니다"
      description="가로는 시간이며 길이는 기간에 비례하지 않습니다. 식품위생법 제39조·제78조(2026-10-08 시행판, 2026-10-09 확인)이고, 실제 절차는 거래 내용에 맞춰 판단합니다."
      ariaLabel="승계 신고 기한, 처분기간 종료 후 1년의 효과 승계, 진행 중 절차, 몰랐음을 증명할 때의 예외를 보여 주는 시간축"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
