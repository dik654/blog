import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 100 − 70 − 15 = 15, 그 15를 다시 취득 2 + 매도자 13으로 나눈다.
 * 위 막대 = 억 원 비례. 아래 막대는 맨 끝 15억 칸만 확대한 것입니다.
 */
const W = 340;
const H = 176;
const X0 = 10;
const FULL = W - 2 * X0;
const UNIT = FULL / 100;
const ZOOM_UNIT = FULL / 15;
const BAR_Y = 28;
const BAR_H = 44;
const ZOOM_Y = 118;
const ZOOM_H = 36;

const px = (value: number) => X0 + value * UNIT;

const SALE = "#94a3b8";
const COST = "#64748b";
const PROFIT = "#b45309";
const RESIDUAL = "#2563eb";
const ACQUIRE = "#475569";
const SELLER = "#1d4ed8";
const TEXT = "#64748b";

const SCENES = [
  { label: "완공 뒤 받을 돈", summary: "매각액 100억", note: "완공한 상태의 매각액 100억 원에서 출발합니다. 금액과 사업은 모두 (가정)이고, 오늘의 토지 시장가격을 구하는 계산이 아닙니다." },
  { label: "개발비 빼기", summary: "100 − 70 = 30억", note: "토지를 제외한 공사·금융·판매 등 개발비 70억 원을 뺍니다. 같은 기준일의 가격·비용 수준을 쓰고 월별 지급 시점의 할인은 생략했습니다." },
  { label: "목표 이익 빼기", summary: "30 − 15 = 15억", note: "이익 15억 원은 외부에 지급할 청구서가 아니라 개발업자가 남기려는 목표라서 점선으로 그렸습니다. 맨 끝에 남은 15억 원이 토지와 그 취득에 쓸 수 있는 잔여입니다." },
  { label: "잔여를 다시 나누기", summary: "15 − 2 = 13억", note: "취득에 드는 세금·법률·중개 비용 합계를 별도로 2억 원으로 가정하면 매도자에게 배정할 예산은 13억 원입니다. 2억 원은 특정 국가의 세율을 적용한 값이 아닙니다." },
] as const;

function Stage({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[step].label}: ${SCENES[step].summary}`}>
      {step === 0 && (
        <g>
          <rect x={px(0)} y={BAR_Y} width={100 * UNIT} height={BAR_H} rx={3} fill={COST} />
          <text x={px(50)} y={BAR_Y + 27} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ffffff">매각액 100억</text>
        </g>
      )}
      {step >= 1 && (
        <g>
          <rect x={px(0)} y={BAR_Y} width={70 * UNIT} height={BAR_H} fill={COST} />
          <text x={px(35)} y={BAR_Y + 27} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ffffff">개발비 70억</text>
        </g>
      )}
      {step === 1 && (
        <g>
          <rect x={px(70)} y={BAR_Y} width={30 * UNIT} height={BAR_H} fill="none" stroke={SALE} strokeWidth={1} />
          <text x={px(85)} y={BAR_Y + 27} textAnchor="middle" fontSize={14} fontWeight={700} fill={TEXT}>남은 30억</text>
        </g>
      )}
      {step >= 2 && (
        <g>
          <rect x={px(70)} y={BAR_Y} width={15 * UNIT} height={BAR_H} fill="none" stroke={PROFIT} strokeWidth={1.25} strokeDasharray="3 2" />
          <text x={px(77.5)} y={BAR_Y + 19} textAnchor="middle" fontSize={12} fontWeight={700} fill={PROFIT}>이익</text>
          <text x={px(77.5)} y={BAR_Y + 35} textAnchor="middle" fontSize={12} fontWeight={700} fill={PROFIT}>15억</text>
          <rect x={px(85)} y={BAR_Y} width={15 * UNIT} height={BAR_H} fill={RESIDUAL} />
          <text x={px(92.5)} y={BAR_Y + 19} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">잔여</text>
          <text x={px(92.5)} y={BAR_Y + 35} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">15억</text>
        </g>
      )}
      <text x={X0} y={BAR_Y - 9} fontSize={13} fill={TEXT}>0</text>
      <text x={W - X0} y={BAR_Y - 9} textAnchor="end" fontSize={13} fill={TEXT}>100억</text>

      {step === 3 && (
        <g>
          <line x1={px(85)} y1={BAR_Y + BAR_H} x2={X0} y2={ZOOM_Y} stroke={RESIDUAL} strokeWidth={1} strokeDasharray="2 3" />
          <line x1={px(100)} y1={BAR_Y + BAR_H} x2={X0 + FULL} y2={ZOOM_Y} stroke={RESIDUAL} strokeWidth={1} strokeDasharray="2 3" />
          <rect x={X0} y={ZOOM_Y} width={2 * ZOOM_UNIT} height={ZOOM_H} fill={ACQUIRE} />
          <text x={X0 + ZOOM_UNIT} y={ZOOM_Y + 23} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">2억</text>
          <rect x={X0 + 2 * ZOOM_UNIT} y={ZOOM_Y} width={13 * ZOOM_UNIT} height={ZOOM_H} fill={SELLER} />
          <text x={X0 + 8.5 * ZOOM_UNIT} y={ZOOM_Y + 23} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ffffff">매도자 예산 13억</text>
          <text x={X0} y={ZOOM_Y + ZOOM_H + 16} fontSize={13} fontWeight={700} fill={ACQUIRE}>취득 부대비용</text>
          <text x={W - X0} y={ZOOM_Y + ZOOM_H + 16} textAnchor="end" fontSize={13} fill={TEXT}>잔여 15억 칸 확대</text>
        </g>
      )}
    </svg>
  );
}

export default function ResidualWaterfallViz() {
  return (
    <SceneShell
      eyebrow="거꾸로 빼기"
      title="100억 원에서 두 칸을 빼고, 남은 칸을 다시 둘로 나눕니다"
      description="막대 길이는 금액에 비례합니다. 마지막 장면의 아래 막대만 15억 원 칸을 확대한 것입니다. 사업과 금액은 모두 (가정)입니다."
      ariaLabel="매각액 100억 원에서 개발비와 목표 이익을 빼 잔여 15억 원을 구하고 매도자 예산 13억 원으로 나누는 과정"
      scenes={SCENES}
      render={(active) => <Stage step={active} />}
    />
  );
}
