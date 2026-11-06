import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source SourceApplication — 인용식의 total development costs는 이익을 포함(85억),
 * 용어집의 total development cost는 토지와 이익을 제외(70억). 100−85−15=0은 범위를 놓쳤을 때의 뺄셈입니다.
 */
const W = 340;
const H = 166;
const X0 = 10;
const UNIT = (W - 2 * X0) / 100;
const BAR_Y = 62;
const BAR_H = 40;

const px = (value: number) => X0 + value * UNIT;

const COST = "#64748b";
const PROFIT = "#b45309";
const RESIDUAL = "#2563eb";
const FAIL = "#dc2626";
const TEXT = "#64748b";

const SCENES = [
  { label: "인용한 식의 범위", summary: "100 − 85 = 15억", note: "인용한 식은 비용에 이익을 포함합니다. 그래서 한 칸처럼 보이는 괄호 안에 70억 원과 15억 원이 함께 들어가고, 각각 한 번씩 빠집니다." },
  { label: "용어집의 범위", summary: "100 − 70 − 15 = 15억", note: "같은 지침의 용어집은 total development cost를 토지와 이익을 제외한 값으로 정의합니다. 이 범위로 읽으면 이익 15억 원을 따로 한 번 더 빼야 같은 답이 나옵니다." },
  { label: "범위를 놓치면", summary: "100 − 85 − 15 = 0", note: "이익이 들어 있는 85억 원에서 15억 원을 또 빼면 같은 칸을 두 번 뺀 것입니다. 잔여가 0으로 보이지만 계산 실수입니다. 표 제목만 보지 말고 해당 식의 포함 범위를 확인합니다." },
] as const;

function Bracket({ from, to, y, color, down = false }: { from: number; to: number; y: number; color: string; down?: boolean }) {
  const tick = down ? -6 : 6;
  return <path d={`M ${px(from)} ${y + tick} L ${px(from)} ${y} L ${px(to)} ${y} L ${px(to)} ${y + tick}`} fill="none" stroke={color} strokeWidth={1.25} />;
}

function Stage({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[step].label}: ${SCENES[step].summary}`}>
      {step !== 1 && (
        <g>
          <text x={X0} y={18} fontSize={13} fontWeight={700} fill={TEXT}>식의 total development costs</text>
          <text x={X0} y={36} fontSize={13} fontWeight={700} fill={TEXT}>(including profit) = 85억</text>
          <Bracket from={0} to={85} y={50} color={TEXT} />
        </g>
      )}
      {step === 1 && (
        <g>
          <text x={X0} y={18} fontSize={13} fontWeight={700} fill={TEXT}>용어집의 total development cost</text>
          <text x={X0} y={36} fontSize={13} fontWeight={700} fill={TEXT}>토지·이익 제외 = 70억</text>
          <Bracket from={0} to={70} y={50} color={TEXT} />
        </g>
      )}
      <rect x={px(0)} y={BAR_Y} width={70 * UNIT} height={BAR_H} fill={COST} />
      <text x={px(35)} y={BAR_Y + 25} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">개발비 70억</text>
      <rect x={px(70)} y={BAR_Y} width={15 * UNIT} height={BAR_H} fill={PROFIT} />
      <text x={px(77.5)} y={BAR_Y + 25} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">이익</text>
      <rect x={px(85)} y={BAR_Y} width={15 * UNIT} height={BAR_H} fill={RESIDUAL} />
      <text x={px(92.5)} y={BAR_Y + 25} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">잔여</text>

      {step === 1 && (
        <g>
          <Bracket from={70} to={85} y={BAR_H + BAR_Y + 12} color={PROFIT} down />
          <text x={px(85)} y={BAR_H + BAR_Y + 32} textAnchor="end" fontSize={13} fontWeight={700} fill={PROFIT}>이익 15억은 따로 한 번 뺍니다</text>
        </g>
      )}
      {step === 2 && (
        <g>
          <Bracket from={70} to={85} y={BAR_H + BAR_Y + 12} color={FAIL} down />
          <text x={px(85)} y={BAR_H + BAR_Y + 32} textAnchor="end" fontSize={13} fontWeight={700} fill={FAIL}>괄호 안의 15억을 또 뺌</text>
          <text x={px(85)} y={BAR_H + BAR_Y + 50} textAnchor="end" fontSize={13} fill={FAIL}>같은 칸을 두 번 뺀 계산</text>
        </g>
      )}
    </svg>
  );
}

export default function CostScopeViz() {
  return (
    <SceneShell
      eyebrow="괄호의 범위"
      title="같은 이름의 비용이 식과 용어집에서 다른 칸을 가리킵니다"
      description="아래에 인용하는 RICS 식은 GDV − 비용(이익 포함) = 잔여입니다. 막대는 3절의 100억 원을 그대로 나눈 것이고 위 괄호가 그 용어의 범위입니다. 사업과 금액은 (가정)입니다."
      ariaLabel="인용식과 용어집의 비용 범위를 같은 막대 위에 괄호로 비교하고 이익을 두 번 뺄 때의 오류를 보여 주는 그림"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
