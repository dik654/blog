import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case·#why-fit·#pipeline — 학습 [2,4]에서 평균 3·표준편차 1을 구해
 * 평가 [8,10]에 적용하면 [5,7]. 네 값 전체로 구하면 평균 6·표준편차 √10, 평가는 [0.63,1.26].
 * 위 직선 = 원래 값, 아래 직선 = 저장한 평균을 빼고 표준편차로 나눈 뒤의 값.
 */
const W = 360;
const H = 200;
const LEFT = 24;
const SPAN = W - 2 * LEFT;
const TOP_Y = 66;
const BOTTOM_Y = 162;
const TRAIN = [2, 4] as const;
const EVAL = [8, 10] as const;
const ALL = [2, 4, 8, 10] as const;

const TRAIN_COLOR = "#2563eb";
const EVAL_COLOR = "#d97706";
const MEAN_COLOR = "#0f766e";
const LEAK_COLOR = "#dc2626";
const MUTED = "#64748b";
const AXIS = "#94a3b8";

const topX = (value: number) => LEFT + (value / 11) * SPAN;
const bottomX = (value: number) => LEFT + (value / 8) * SPAN;

const mean = (values: readonly number[]) => values.reduce<number>((sum, value) => sum + value, 0) / values.length;
const popStd = (values: readonly number[]) => {
  const center = mean(values);
  return Math.sqrt(values.reduce<number>((sum, value) => sum + (value - center) ** 2, 0) / values.length);
};

const TRAIN_MEAN = mean(TRAIN);
const TRAIN_STD = popStd(TRAIN);
const ALL_MEAN = mean(ALL);
const ALL_STD = popStd(ALL);
const fair = EVAL.map((value) => (value - TRAIN_MEAN) / TRAIN_STD);
const leaky = EVAL.map((value) => (value - ALL_MEAN) / ALL_STD);

const SCENES = [
  {
    label: "행을 먼저 나눕니다",
    summary: "학습 [2,4] · 평가 [8,10]",
    note: "네 값 중 파란 두 값만 계산에 쓰고, 주황 두 값은 시험용으로 떼어 둡니다. 정답 열을 가리는 것만이 아니라 값 자체도 계산에서 뺀다는 뜻입니다.",
  },
  {
    label: "학습 값으로만 계산합니다",
    summary: "평균 3 · 표준편차 1",
    note: "학습 평균은 (2+4)/2=3입니다. 평균에서의 차이 −1과 +1을 제곱해 평균 내면 1이고, 그 제곱근인 표준편차(값이 평균에서 퍼진 정도)도 1입니다. 이 두 수를 저장합니다.",
  },
  {
    label: "평가 값에는 적용만 합니다",
    summary: "[8,10] → [5,7]",
    note: "저장한 3을 빼고 1로 나눕니다. (8−3)/1=5, (10−3)/1=7입니다. 평가 값을 보고 평균을 다시 구하지 않습니다.",
  },
  {
    label: "네 값 전체로 계산하면",
    summary: "평균 3 → 6 · 평가 [0.63, 1.26]",
    note: "평가 값까지 넣으면 평균은 6, 편차 제곱 평균은 (16+4+4+16)/4=10, 표준편차는 √10≈3.162가 됩니다. 정답 열을 읽지 않았어도 평가 값이 높다는 정보가 중심을 옮겼습니다. 결과 숫자가 작아진 것을 성능이 좋아진 것으로 읽으면 안 됩니다.",
  },
] as const;

function Dot({ value, y, color, label, faded = false, at }: { value: number; y: number; color: string; label: string; faded?: boolean; at: (v: number) => number }) {
  return (
    <g opacity={faded ? 0.3 : 1}>
      <circle cx={at(value)} cy={y} r={6} fill={color} />
      <text x={at(value)} y={y + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function TrainStateNumberLineViz() {
  return (
    <SceneShell
      eyebrow="학습에서 구한 중심"
      title="평균을 어느 값으로 구했는지에 따라 평가 결과가 달라집니다"
      description="위 직선은 원래 값, 아래 직선은 저장한 평균을 빼고 표준편차(값이 평균에서 퍼진 정도)로 나눈 값입니다. 네 숫자는 글의 사례(가정)이며 표준편차는 표본 수로 나누어 구합니다."
      ariaLabel="학습 값 2와 4로 구한 평균을 평가 값 8과 10에 적용하는 경우와 네 값 전체로 평균을 구하는 경우 비교"
      scenes={SCENES}
      render={(active) => {
        const leak = active === 3;
        const center = leak ? ALL_MEAN : TRAIN_MEAN;
        const showMean = active >= 1;
        const showOutput = active >= 2;
        const outputs = leak ? leaky : fair;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={16} fontSize={12} fill={MUTED}>원래 값</text>
            <line x1={LEFT} x2={W - LEFT} y1={TOP_Y} y2={TOP_Y} stroke={AXIS} strokeWidth={1} />
            {[0, 11].map((tick) => (
              <text key={tick} x={topX(tick)} y={TOP_Y + 34} textAnchor="middle" fontSize={11} fill={AXIS}>{tick}</text>
            ))}

            {leak && (
              <g>
                <line x1={topX(TRAIN_MEAN)} x2={topX(TRAIN_MEAN)} y1={30} y2={TOP_Y} stroke={AXIS} strokeWidth={1} strokeDasharray="3 3" />
                <text x={topX(TRAIN_MEAN)} y={26} textAnchor="middle" fontSize={11} fill={MUTED}>3</text>
                <line x1={topX(TRAIN_MEAN) + 8} x2={topX(ALL_MEAN) - 30} y1={23} y2={23} stroke={LEAK_COLOR} strokeWidth={1} markerEnd="url(#fold-arrow)" />
              </g>
            )}
            {showMean && (
              <g>
                <line x1={topX(center)} x2={topX(center)} y1={30} y2={TOP_Y} stroke={leak ? LEAK_COLOR : MEAN_COLOR} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={topX(center)} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={leak ? LEAK_COLOR : MEAN_COLOR}>
                  평균 {center}
                </text>
              </g>
            )}
            {active === 1 && (
              <g>
                <line x1={topX(2)} x2={topX(4)} y1={TOP_Y - 14} y2={TOP_Y - 14} stroke={MEAN_COLOR} strokeWidth={1} />
                <text x={topX(2.5)} y={TOP_Y - 18} textAnchor="middle" fontSize={11} fill={MEAN_COLOR}>−1</text>
                <text x={topX(3.5)} y={TOP_Y - 18} textAnchor="middle" fontSize={11} fill={MEAN_COLOR}>+1</text>
              </g>
            )}

            {TRAIN.map((value) => (
              <Dot key={value} value={value} y={TOP_Y} color={TRAIN_COLOR} label={String(value)} at={topX} />
            ))}
            {EVAL.map((value) => (
              <Dot key={value} value={value} y={TOP_Y} color={EVAL_COLOR} label={String(value)} at={topX} />
            ))}
            <text x={(topX(2) + topX(4)) / 2} y={TOP_Y + 46} textAnchor="middle" fontSize={12} fontWeight={700} fill={TRAIN_COLOR}>학습</text>
            <text x={(topX(8) + topX(10)) / 2} y={TOP_Y + 46} textAnchor="middle" fontSize={12} fontWeight={700} fill={EVAL_COLOR}>평가</text>
            {leak && (
              <text x={W - LEFT} y={TOP_Y + 64} textAnchor="end" fontSize={11} fill={LEAK_COLOR}>표준편차 √10≈3.162</text>
            )}
            {active === 1 && (
              <text x={W - LEFT} y={TOP_Y + 64} textAnchor="end" fontSize={11} fill={MEAN_COLOR}>표준편차 1</text>
            )}

            <text x={LEFT} y={BOTTOM_Y - 22} fontSize={12} fill={MUTED} opacity={showOutput ? 1 : 0.4}>평가 값 변환 뒤</text>
            <line x1={LEFT} x2={W - LEFT} y1={BOTTOM_Y} y2={BOTTOM_Y} stroke={AXIS} strokeWidth={1} opacity={showOutput ? 1 : 0.4} />
            {[0, 8].map((tick) => (
              <text key={tick} x={bottomX(tick)} y={BOTTOM_Y + 34} textAnchor="middle" fontSize={11} fill={AXIS} opacity={showOutput ? 1 : 0.4}>{tick}</text>
            ))}
            {leak && fair.map((value) => (
              <circle key={`ghost-${value}`} cx={bottomX(value)} cy={BOTTOM_Y} r={6} fill="none" stroke={AXIS} strokeWidth={1} strokeDasharray="2 2" />
            ))}
            {leak && (
              <text x={(bottomX(fair[0]) + bottomX(fair[1])) / 2} y={BOTTOM_Y + 20} textAnchor="middle" fontSize={11} fill={MUTED}>학습만 썼을 때 5, 7</text>
            )}
            {showOutput && outputs.map((value, index) => (
              <g key={`out-${index}`}>
                <line x1={topX(EVAL[index])} y1={TOP_Y + 8} x2={bottomX(value)} y2={BOTTOM_Y - 8} stroke={leak ? LEAK_COLOR : EVAL_COLOR} strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
                <circle cx={bottomX(value)} cy={BOTTOM_Y} r={6} fill={leak ? LEAK_COLOR : EVAL_COLOR} />
                <text x={leak ? bottomX(value) + (index === 0 ? -4 : 4) : bottomX(value)} y={BOTTOM_Y + 20} textAnchor={leak ? (index === 0 ? "end" : "start") : "middle"} fontSize={12} fontWeight={700} fill={leak ? LEAK_COLOR : EVAL_COLOR}>
                  {leak ? value.toFixed(2) : value}
                </text>
              </g>
            ))}
            <defs>
              <marker id="fold-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0 L8 4 L0 8 Z" fill={LEAK_COLOR} />
              </marker>
            </defs>
          </svg>
        );
      }}
    />
  );
}
