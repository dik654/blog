import SceneShell from "./SceneShell";

/**
 * 본문 대응: #audit — 네 원인을 배제하고 training error가 낮은 채 gap만 계속 커지면 overfitting.
 * 정의: train error는 계속 줄지만 unseen data error는 오히려 커지는 현상.
 * 곡선 값은 모양만 보이려는 가정이며 축 눈금을 두지 않습니다.
 */
const TRAIN: readonly number[] = [0.9, 0.65, 0.5, 0.4, 0.33, 0.28, 0.24, 0.21];
const VAL: readonly number[] = [0.95, 0.75, 0.62, 0.58, 0.6, 0.65, 0.71, 0.78];
const TURN = VAL.reduce<number>((best, value, index) => (value < VAL[best] ? index : best), 0);

const LEFT = 40;
const RIGHT = 300;
const STEP = (RIGHT - LEFT) / (TRAIN.length - 1);
const px = (index: number) => LEFT + index * STEP;
const py = (value: number) => 170 - value * 150;
const path = (values: readonly number[]) => values.map((value, index) => `${index === 0 ? "M" : "L"}${px(index)},${py(value)}`).join(" ");

const gapArea = (() => {
  const top = VAL.slice(TURN).map((value, offset) => `${px(TURN + offset)},${py(value)}`);
  const bottom = TRAIN.slice(TURN).map((value, offset) => `${px(TURN + offset)},${py(value)}`).reverse();
  return `M${[...top, ...bottom].join(" L")} Z`;
})();

const SCENES = [
  { label: "Train loss", summary: "checkpoint마다 계속 감소", note: "학습이 진행될수록 train data에서의 평균 loss는 계속 내려갑니다. 이것만으로는 좋은지 나쁜지 알 수 없습니다." },
  { label: "Validation loss", summary: "어느 시점부터 다시 증가", note: "학습에 쓰지 않은 validation data의 loss는 처음엔 같이 내려가다가, 어느 checkpoint부터 오히려 올라갑니다." },
  { label: "Gap이 계속 벌어짐", summary: "→ overfitting 패턴", note: "Train loss는 낮은 채 두 곡선 사이(빨간 영역)만 계속 넓어집니다. 다만 leakage·pipeline mismatch·label noise·distribution shift 네 원인을 먼저 배제한 뒤에만 이 모양을 overfitting이라 부릅니다." },
] as const;

export default function OverfitTrajectoryViz() {
  return (
    <SceneShell
      eyebrow="Checkpoint를 따라 본 두 loss"
      title="Train은 계속 내려가는데 validation만 돌아서면 gap이 벌어집니다"
      description="가로축은 학습 checkpoint 순서, 세로축은 평균 loss(아래가 낮음)입니다. 곡선 모양은 방향만 보이려는 가정이며 눈금 값은 없습니다."
      ariaLabel="checkpoint를 따라 train loss는 줄고 validation loss는 다시 늘어 gap이 커지는 모양"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={LEFT - 10} x2={LEFT - 10} y1={14} y2={176} stroke="#94a3b8" strokeWidth={1} />
          <line x1={LEFT - 10} x2={RIGHT + 14} y1={176} y2={176} stroke="#94a3b8" strokeWidth={1} />
          <text x={RIGHT + 14} y={192} textAnchor="end" fontSize={12} fill="#64748b">checkpoint →</text>
          <text x={LEFT - 6} y={12} fontSize={12} fill="#64748b">loss</text>
          {active >= 2 && <path d={gapArea} fill="#fee2e2" stroke="none" />}
          {active >= 1 && (
            <>
              <line x1={px(TURN)} x2={px(TURN)} y1={20} y2={176} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <path d={path(VAL)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              {VAL.map((value, index) => <circle key={index} cx={px(index)} cy={py(value)} r={2.5} fill="#2563eb" />)}
              <text x={px(VAL.length - 1) + 6} y={py(VAL[VAL.length - 1]) + 4} fontSize={12} fontWeight={700} fill="#1d4ed8">val</text>
              <text x={px(TURN)} y={190} textAnchor="middle" fontSize={12} fill="#64748b">돌아서는 지점</text>
            </>
          )}
          <path d={path(TRAIN)} fill="none" stroke="#475569" strokeWidth={1.25} />
          {TRAIN.map((value, index) => <circle key={index} cx={px(index)} cy={py(value)} r={2.5} fill="#475569" />)}
          <text x={px(TRAIN.length - 1) + 6} y={py(TRAIN[TRAIN.length - 1]) + 4} fontSize={12} fontWeight={700} fill="#334155">train</text>
          {active >= 2 && (
            <text x={(px(TURN) + px(VAL.length - 1)) / 2 + 20} y={(py(VAL[6]) + py(TRAIN[6])) / 2 + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b91c1c">gap</text>
          )}
        </svg>
      )}
    />
  );
}
