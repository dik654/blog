import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const accent = "var(--primary)";
const border = "var(--border)";
const muted = "var(--muted-foreground)";

function Scene({
  id,
  eyebrow,
  title,
  description,
  labels,
  notes,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
}) {
  const controls = useAnimatedScenes(labels.length, 3200);
  return (
    <VizFrame title={title} description={description} className="my-8">
      <div
        id={id}
        data-viz
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6"
      >
        <p className="text-[11px] font-black uppercase tracking-[.16em] text-primary">
          {eyebrow} · {String(controls.active + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-7">
          {labels[controls.active]}
        </h3>
        <div data-viz-canvas className="mt-5 min-w-0 overflow-hidden">
          {children(controls.active)}
        </div>
        <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
          {notes[controls.active]}
        </p>
        <AnimatedSceneControls labels={labels} {...controls} />
      </div>
    </VizFrame>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  active,
  marker,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  marker: string;
}) {
  return (
    <g>
      <defs>
        <marker
          id={marker}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill={active ? accent : muted} />
        </marker>
      </defs>
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? accent : muted}
        strokeWidth="1.25"
        markerEnd={`url(#${marker})`}
        initial={false}
        animate={{ opacity: active ? 1 : 0.2, pathLength: active ? 1 : 0.72 }}
      />
    </g>
  );
}

function Box({
  x,
  y,
  width,
  height,
  label,
  detail,
  active,
  rounded = false,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  detail?: string;
  active: boolean;
  rounded?: boolean;
}) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: active ? 1 : 0.32, scale: active ? 1.02 : 1 }}
      style={{ transformOrigin: `${x + width / 2}px ${y + height / 2}px` }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={rounded ? height / 2 : 7}
        fill={
          active
            ? "color-mix(in srgb, var(--primary) 10%, transparent)"
            : "var(--background)"
        }
        stroke={active ? accent : border}
        strokeWidth="1.25"
      />
      <text
        x={x + width / 2}
        y={y + height / 2 - (detail ? 4 : -3)}
        textAnchor="middle"
        className="fill-foreground text-[9px] font-bold sm:text-[10px]"
      >
        {label}
      </text>
      {detail ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 12}
          textAnchor="middle"
          className="fill-muted-foreground text-[7px] sm:text-[8px]"
        >
          {detail}
        </text>
      ) : null}
    </motion.g>
  );
}

export function MetricContractViz() {
  const labels = [
    "한 건의 prediction을 action으로 바꾸기",
    "틀린 action의 비용을 붙이기",
    "반복 행을 decision unit으로 묶기",
    "Unit에서 slice와 global로 집계하기",
  ] as const;
  const notes = [
    "0.73은 prediction이고 threshold를 지나 review queue로 들어가야 action이 됩니다.",
    "False negative와 false positive의 결과가 다르면 단순 accuracy가 실제 목표를 대신하지 못합니다.",
    "영상 1,000장을 가진 환자가 환자 한 명보다 1,000배 큰 표를 갖지 않게 먼저 환자별로 줄입니다.",
    "Unit 평균 뒤 지역·언어 slice를 만들고, 마지막에 배포 비중 또는 안전 정책으로 결합합니다.",
  ] as const;
  return (
    <Scene
      id="metric-contract-viz"
      eyebrow="Decision to metric"
      title="Prediction 한 건이 최종 metric이 되는 네 단계"
      description="Score→action→cost→unit/slice reducer를 차례로 펼쳐 봅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 420 250"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Box
            x={18}
            y={36}
            width={72}
            height={46}
            label="prediction"
            detail="p = .73"
            active={active === 0}
          />
          <Arrow
            x1={91}
            y1={59}
            x2={123}
            y2={59}
            active={active === 0}
            marker="metric-a"
          />
          <Box
            x={125}
            y={36}
            width={72}
            height={46}
            label="policy"
            detail="p ≥ .70"
            active={active === 0}
            rounded
          />
          <Arrow
            x1={198}
            y1={59}
            x2={230}
            y2={59}
            active={active <= 1}
            marker="metric-b"
          />
          <Box
            x={232}
            y={36}
            width={74}
            height={46}
            label="action"
            detail="review"
            active={active <= 1}
          />
          <Arrow
            x1={307}
            y1={59}
            x2={337}
            y2={59}
            active={active === 1}
            marker="metric-c"
          />
          <Box
            x={339}
            y={36}
            width={64}
            height={46}
            label="cost"
            detail="FN × 20"
            active={active === 1}
          />

          {[0, 1, 2, 3].map((index) => (
            <motion.circle
              key={index}
              cx={46 + index * 32}
              cy={145 + (index % 2) * 16}
              r="10"
              fill={
                active === 2
                  ? "color-mix(in srgb, var(--primary) 18%, transparent)"
                  : "var(--background)"
              }
              stroke={active === 2 ? accent : border}
              strokeWidth="1.25"
              initial={false}
              animate={{ opacity: active === 2 ? 1 : 0.3 }}
            />
          ))}
          <Arrow
            x1={164}
            y1={153}
            x2={198}
            y2={153}
            active={active === 2}
            marker="metric-d"
          />
          <Box
            x={201}
            y={127}
            width={79}
            height={53}
            label="patient A"
            detail="unit loss .4"
            active={active >= 2}
          />
          <Arrow
            x1={281}
            y1={153}
            x2={316}
            y2={153}
            active={active === 3}
            marker="metric-e"
          />
          <Box
            x={318}
            y={115}
            width={84}
            height={76}
            label="slice"
            detail="region → global"
            active={active === 3}
          />
          <text
            x="20"
            y="226"
            className="fill-muted-foreground text-[8px] sm:text-[9px]"
          >
            관측 행 수 ≠ 독립적인 의사결정 단위 수
          </text>
        </svg>
      )}
    </Scene>
  );
}

export function RegressionMetricViz() {
  const labels = [
    "Actual과 prediction 사이 residual 보기",
    "Absolute와 squared penalty 비교하기",
    "평균과 중앙값이라는 목표를 구분하기",
    "Coverage와 interval width를 함께 보기",
  ] as const;
  const notes = [
    "Residual은 방향을 가진 y−ŷ입니다. Metric은 이 값에 어떤 비용 곡선을 씌울지 정합니다.",
    "|r|은 선형으로, r²은 멀리 있는 오류를 빠르게 확대합니다.",
    "제곱 risk는 조건부 평균을, 절댓값 risk는 조건부 중앙값을 목표로 합니다.",
    "정답을 모두 덮는 넓은 구간은 coverage는 높아도 의사결정 정보가 약합니다.",
  ] as const;
  const points = [0, 0, 0, 100];
  return (
    <Scene
      id="regression-metric-viz"
      eyebrow="Residual geometry"
      title="같은 숫자 예측도 비용 곡선에 따라 목표가 달라집니다"
      description="점 예측의 residual에서 interval 평가까지 한 축 위에서 확인합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 420 250"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <line
            x1="30"
            y1="176"
            x2="392"
            y2="176"
            stroke={border}
            strokeWidth="1.25"
          />
          <line
            x1="70"
            y1="169"
            x2="70"
            y2="183"
            stroke={muted}
            strokeWidth="1"
          />
          <line
            x1="340"
            y1="169"
            x2="340"
            y2="183"
            stroke={muted}
            strokeWidth="1"
          />
          <text x="64" y="199" className="fill-muted-foreground text-[8px]">
            0
          </text>
          <text x="330" y="199" className="fill-muted-foreground text-[8px]">
            100
          </text>
          {points.map((value, index) => (
            <motion.circle
              key={index}
              cx={70 + value * 2.7}
              cy={154 - index * 10}
              r="7"
              fill={active >= 2 ? accent : "var(--background)"}
              stroke={active >= 2 ? accent : border}
              strokeWidth="1.25"
              initial={false}
              animate={{ opacity: active >= 2 ? 1 : 0.28 }}
            />
          ))}
          <motion.line
            x1="205"
            y1="142"
            x2="205"
            y2="183"
            stroke={accent}
            strokeWidth="1.25"
            initial={false}
            animate={{ opacity: active === 2 ? 1 : 0.18 }}
          />
          <text
            x="189"
            y="133"
            className="fill-foreground text-[8px] font-bold"
          >
            mean 25
          </text>
          <motion.line
            x1="70"
            y1="126"
            x2="70"
            y2="183"
            stroke={accent}
            strokeWidth="1.25"
            initial={false}
            animate={{ opacity: active === 2 ? 1 : 0.18 }}
          />
          <text x="50" y="116" className="fill-foreground text-[8px] font-bold">
            median 0
          </text>

          <motion.path
            d="M42 105L205 34L368 105"
            fill="none"
            stroke={accent}
            strokeWidth="1.25"
            initial={false}
            animate={{ opacity: active === 1 ? 1 : 0.16 }}
          />
          <motion.path
            d="M42 105Q205 -10 368 105"
            fill="none"
            stroke={muted}
            strokeWidth="1.25"
            initial={false}
            animate={{ opacity: active === 1 ? 1 : 0.16 }}
          />
          <text x="54" y="37" className="fill-foreground text-[8px]">
            |r|
          </text>
          <text x="354" y="37" className="fill-muted-foreground text-[8px]">
            r²
          </text>

          <motion.g
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.12 }}
          >
            <rect x="102" y="69" width="216" height="6" rx="3" fill={accent} />
            <circle
              cx="232"
              cy="72"
              r="7"
              fill="var(--background)"
              stroke={accent}
              strokeWidth="1.25"
            />
            <text x="102" y="56" className="fill-foreground text-[8px]">
              L
            </text>
            <text x="315" y="56" className="fill-foreground text-[8px]">
              U
            </text>
            <text x="210" y="94" className="fill-muted-foreground text-[8px]">
              actual y
            </text>
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function ClassificationMetricViz() {
  const labels = [
    "Score로 positive를 앞에 세우기",
    "Probability와 실제 빈도 맞추기",
    "Threshold로 action을 자르기",
    "세 결과를 한 report에 나란히 두기",
  ] as const;
  const notes = [
    "AUC는 score의 순서를 평가하며 .8이라는 수치가 실제 80%인지 답하지 않습니다.",
    "Calibration은 비슷한 probability를 받은 사례들의 empirical frequency를 비교합니다.",
    "Threshold는 오류 비용과 처리 용량을 반영해 hard action을 만듭니다.",
    "Ranking·probability·decision metric은 서로 대체하지 않고 같은 model의 다른 성질을 보고합니다.",
  ] as const;
  const dots = [
    { x: 72, positive: false },
    { x: 112, positive: false },
    { x: 162, positive: true },
    { x: 202, positive: false },
    { x: 246, positive: true },
    { x: 302, positive: true },
    { x: 350, positive: true },
  ];
  return (
    <Scene
      id="classification-metric-viz"
      eyebrow="Score to action"
      title="분류 score를 세 층으로 나눠 평가하기"
      description="Ranking, probability와 threshold action이 답하는 질문을 분리합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 420 250"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <line
            x1="42"
            y1="160"
            x2="382"
            y2="160"
            stroke={border}
            strokeWidth="1.25"
          />
          {dots.map((dot, index) => (
            <motion.g
              key={index}
              initial={false}
              animate={{ opacity: active === 0 || active === 2 ? 1 : 0.28 }}
            >
              <circle
                cx={dot.x}
                cy={146 - (index % 2) * 20}
                r="9"
                fill={dot.positive ? accent : "var(--background)"}
                stroke={dot.positive ? accent : muted}
                strokeWidth="1.25"
              />
              <text
                x={dot.x}
                y={149 - (index % 2) * 20}
                textAnchor="middle"
                className={
                  dot.positive
                    ? "fill-primary-foreground text-[7px] font-bold"
                    : "fill-muted-foreground text-[7px] font-bold"
                }
              >
                {dot.positive ? "+" : "−"}
              </text>
            </motion.g>
          ))}
          <motion.g
            initial={false}
            animate={{ opacity: active === 2 ? 1 : 0.12 }}
          >
            <line
              x1="220"
              y1="90"
              x2="220"
              y2="184"
              stroke={accent}
              strokeWidth="1.25"
            />
            <rect
              x="229"
              y="91"
              width="90"
              height="27"
              rx="13.5"
              fill="color-mix(in srgb, var(--primary) 10%, transparent)"
              stroke={accent}
              strokeWidth="1.25"
            />
            <text
              x="274"
              y="108"
              textAnchor="middle"
              className="fill-foreground text-[8px] font-bold"
            >
              threshold τ
            </text>
          </motion.g>
          <motion.g
            initial={false}
            animate={{ opacity: active === 1 ? 1 : 0.12 }}
          >
            <line
              x1="65"
              y1="104"
              x2="345"
              y2="42"
              stroke={border}
              strokeWidth="1.25"
            />
            <line
              x1="65"
              y1="104"
              x2="345"
              y2="104"
              stroke={muted}
              strokeWidth="1"
            />
            {[0, 1, 2, 3].map((index) => (
              <circle
                key={index}
                cx={95 + index * 72}
                cy={96 - index * 15}
                r="7"
                fill="var(--background)"
                stroke={accent}
                strokeWidth="1.25"
              />
            ))}
            <text x="67" y="32" className="fill-muted-foreground text-[8px]">
              observed frequency
            </text>
          </motion.g>
          <motion.g
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.12 }}
          >
            {[
              [48, "AUC", ".91"],
              [154, "Brier", ".08"],
              [260, "Cost", "12.4"],
            ].map(([x, label, value]) => (
              <g key={String(label)}>
                <rect
                  x={Number(x)}
                  y="194"
                  width="94"
                  height="39"
                  rx="6"
                  fill="var(--background)"
                  stroke={border}
                  strokeWidth="1.25"
                />
                <text
                  x={Number(x) + 47}
                  y="209"
                  textAnchor="middle"
                  className="fill-muted-foreground text-[7px]"
                >
                  {label}
                </text>
                <text
                  x={Number(x) + 47}
                  y="224"
                  textAnchor="middle"
                  className="fill-foreground text-[9px] font-bold"
                >
                  {value}
                </text>
              </g>
            ))}
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function RankingMetricViz() {
  const labels = [
    "Query 하나의 ranked list 고정하기",
    "Relevance를 gain으로 바꾸기",
    "아래 rank의 gain을 할인하기",
    "Query macro와 traffic 평균 구분하기",
  ] as const;
  const notes = [
    "먼저 query 하나와 그 후보 목록, relevance label, 사용자가 보는 깊이 k를 고정합니다.",
    "Relevance 3은 2³−1=7, relevance 2는 3처럼 단계 차이를 비선형 gain으로 바꿀 수 있습니다.",
    "같은 gain도 rank가 내려가면 log discount로 작아집니다. 이 discount는 사용자 관찰 가정입니다.",
    "Macro는 query 종류마다 한 표, traffic 평균은 발생량만큼 표를 주므로 서로 다른 population을 답합니다.",
  ] as const;
  const results = [
    { rel: 3, gain: 7, width: 138 },
    { rel: 0, gain: 0, width: 28 },
    { rel: 2, gain: 1.5, width: 78 },
    { rel: 1, gain: 0.43, width: 47 },
  ];
  return (
    <Scene
      id="ranking-metric-viz"
      eyebrow="One query first"
      title="Ranked list에서 query population까지"
      description="NDCG의 gain·discount와 query 집계 순서를 시각적으로 분리합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 420 270"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          {results.map((result, index) => {
            const y = 38 + index * 47;
            return (
              <motion.g
                key={index}
                initial={false}
                animate={{ opacity: active <= 2 ? 1 : 0.22 }}
              >
                <circle
                  cx="37"
                  cy={y + 14}
                  r="13"
                  fill={index === 0 ? accent : "var(--background)"}
                  stroke={index === 0 ? accent : border}
                  strokeWidth="1.25"
                />
                <text
                  x="37"
                  y={y + 17}
                  textAnchor="middle"
                  className={
                    index === 0
                      ? "fill-primary-foreground text-[8px] font-bold"
                      : "fill-foreground text-[8px] font-bold"
                  }
                >
                  {index + 1}
                </text>
                <rect
                  x="60"
                  y={y}
                  width="194"
                  height="29"
                  rx="6"
                  fill="var(--background)"
                  stroke={border}
                  strokeWidth="1.25"
                />
                <motion.rect
                  x="60"
                  y={y}
                  height="29"
                  rx="6"
                  fill="color-mix(in srgb, var(--primary) 16%, transparent)"
                  initial={false}
                  animate={{ width: active === 0 ? 45 : result.width }}
                />
                <text
                  x="72"
                  y={y + 18}
                  className="fill-foreground text-[8px] font-bold"
                >
                  rel {result.rel}
                </text>
                <text
                  x="267"
                  y={y + 18}
                  className="fill-muted-foreground text-[8px]"
                >
                  DCG +{result.gain}
                </text>
              </motion.g>
            );
          })}
          <motion.g
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.1 }}
          >
            <Box
              x={48}
              y={228}
              width={128}
              height={34}
              label="macro"
              detail="A와 B에 1표씩"
              active={active === 3}
            />
            <Box
              x={244}
              y={228}
              width={128}
              height={34}
              label="traffic"
              detail="A 99표 · B 1표"
              active={active === 3}
            />
            <Arrow
              x1={177}
              y1={245}
              x2={242}
              y2={245}
              active={active === 3}
              marker="rank-a"
            />
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function SelectionProtocolViz() {
  const labels = [
    "Train에서 model parameters 학습하기",
    "Validation에서 config와 policy 선택하기",
    "Guardrail로 feasible set 만들기",
    "Untouched test에서 procedure 보고하기",
  ] as const;
  const notes = [
    "Differentiable surrogate는 model weights를 학습하는 도구이며 최종 업무 metric과 같을 필요가 없습니다.",
    "Checkpoint·hyperparameter·calibrator·threshold를 반복 선택한 기록은 모두 validation 적응에 포함됩니다.",
    "Latency와 worst-slice처럼 반드시 지킬 조건을 먼저 통과시킨 뒤 primary metric을 비교합니다.",
    "Test 결과를 본 뒤 설정을 바꾸면 test가 validation으로 변하므로 새 독립 평가가 필요합니다.",
  ] as const;
  return (
    <Scene
      id="selection-protocol-viz"
      eyebrow="Information boundary"
      title="학습·선택·허용·보고의 문을 분리합니다"
      description="한 candidate가 release되기까지 어떤 data가 어떤 결정을 맡는지 보여 줍니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 420 250"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Box
            x={18}
            y={42}
            width={76}
            height={50}
            label="Train"
            detail="fit θ"
            active={active === 0}
          />
          <Arrow
            x1={95}
            y1={67}
            x2={119}
            y2={67}
            active={active <= 1}
            marker="select-a"
          />
          <Box
            x={121}
            y={42}
            width={86}
            height={50}
            label="Validation"
            detail="choose λ, τ"
            active={active === 1}
          />
          <Arrow
            x1={208}
            y1={67}
            x2={232}
            y2={67}
            active={active <= 2}
            marker="select-b"
          />
          <Box
            x={234}
            y={42}
            width={76}
            height={50}
            label="Gate"
            detail="feasible?"
            active={active === 2}
            rounded
          />
          <Arrow
            x1={311}
            y1={67}
            x2={335}
            y2={67}
            active={active === 3}
            marker="select-c"
          />
          <Box
            x={337}
            y={42}
            width={65}
            height={50}
            label="Test"
            detail="report"
            active={active === 3}
          />

          <line
            x1="58"
            y1="209"
            x2="365"
            y2="209"
            stroke={border}
            strokeWidth="1.25"
          />
          <line
            x1="58"
            y1="209"
            x2="58"
            y2="121"
            stroke={border}
            strokeWidth="1.25"
          />
          <rect
            x="58"
            y="121"
            width="204"
            height="88"
            fill="color-mix(in srgb, var(--primary) 5%, transparent)"
            stroke={active === 2 ? accent : border}
            strokeWidth="1.25"
            strokeDasharray="4 4"
          />
          <text x="67" y="136" className="fill-muted-foreground text-[8px]">
            feasible region
          </text>
          {[
            [96, 171, true],
            [148, 148, true],
            [214, 190, true],
            [300, 143, false],
            [331, 177, false],
          ].map(([x, y, pass], index) => (
            <motion.circle
              key={index}
              cx={Number(x)}
              cy={Number(y)}
              r="8"
              fill={pass && active === 2 ? accent : "var(--background)"}
              stroke={pass ? accent : muted}
              strokeWidth="1.25"
              initial={false}
              animate={{ opacity: active === 2 ? 1 : 0.2 }}
            />
          ))}
          <text x="295" y="228" className="fill-muted-foreground text-[8px]">
            latency →
          </text>
          <text
            x="24"
            y="151"
            className="fill-muted-foreground text-[8px]"
            transform="rotate(-90 24 151)"
          >
            slice error →
          </text>
        </svg>
      )}
    </Scene>
  );
}
