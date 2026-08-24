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
  title,
  description,
  labels,
  notes,
  children,
}: {
  id: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
}) {
  const controls = useAnimatedScenes(labels.length, 3000);
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
          Animated lesson · {String(controls.active + 1).padStart(2, "0")}
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

function Box({
  x,
  y,
  width,
  label,
  detail,
  active,
}: {
  x: number;
  y: number;
  width: number;
  label: string;
  detail: string;
  active: boolean;
}) {
  return (
    <motion.g initial={false} animate={{ opacity: active ? 1 : 0.18 }}>
      <rect
        x={x}
        y={y}
        width={width}
        height="48"
        rx="8"
        fill={
          active
            ? "color-mix(in srgb, var(--primary) 9%, transparent)"
            : "var(--background)"
        }
        stroke={active ? accent : border}
        strokeWidth="1.25"
      />
      <text
        x={x + width / 2}
        y={y + 20}
        textAnchor="middle"
        className="fill-foreground text-[9px] font-bold"
      >
        {label}
      </text>
      <text
        x={x + width / 2}
        y={y + 35}
        textAnchor="middle"
        className="fill-muted-foreground text-[7px]"
      >
        {detail}
      </text>
    </motion.g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  active,
  id,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  id: string;
}) {
  return (
    <g>
      <defs>
        <marker
          id={id}
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
        markerEnd={`url(#${id})`}
        initial={false}
        animate={{ opacity: active ? 1 : 0.12 }}
      />
    </g>
  );
}

export function ImbalanceDecisionViz() {
  const labels = [
    "Population의 base rate 확인",
    "Score는 순서만 만듦",
    "Probability 의미를 검증",
    "Threshold가 action을 만듦",
  ] as const;
  const notes = [
    "1,000명 중 positive가 50명이면 prevalence는 5%이고 all-negative accuracy는 이미 95%입니다.",
    "Score 0.8이 확률이라는 보장 없이도 positive가 위로 정렬될 수 있습니다.",
    "0.8이라고 말한 집단에서 실제 positive frequency도 약 80%인지 따로 검사합니다.",
    "비용·recall·alert capacity를 정책에 넣어 threshold 위만 실제 alert로 전환합니다.",
  ] as const;
  return (
    <Scene
      id="imbalance-decision-viz"
      title="Population에서 action까지 네 층"
      description="같은 model output을 base rate·ranking·probability·decision으로 분리합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 230"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <g>
            {Array.from({ length: 20 }, (_, i) => (
              <circle
                key={i}
                cx={28 + (i % 10) * 18}
                cy={40 + Math.floor(i / 10) * 18}
                r="5"
                fill={i < 1 ? accent : "var(--muted)"}
                opacity={active === 0 ? 1 : 0.16}
              />
            ))}
          </g>
          <Arrow
            x1={208}
            y1={48}
            x2={247}
            y2={48}
            active={active >= 1}
            id="imb-a"
          />
          <Box
            x={250}
            y={24}
            width={82}
            label="score"
            detail="ordering"
            active={active === 1}
          />
          <Arrow
            x1={333}
            y1={48}
            x2={365}
            y2={48}
            active={active >= 2}
            id="imb-b"
          />
          <Box
            x={350}
            y={82}
            width={76}
            label="p"
            detail="frequency"
            active={active === 2}
          />
          <motion.line
            x1="20"
            y1="154"
            x2="420"
            y2="154"
            stroke={border}
            strokeWidth="1.25"
            animate={{ opacity: active === 3 ? 1 : 0.1 }}
          />
          <motion.line
            x1="292"
            y1="134"
            x2="292"
            y2="174"
            stroke={accent}
            strokeWidth="1.25"
            animate={{ opacity: active === 3 ? 1 : 0.1 }}
          />
          <motion.g animate={{ opacity: active === 3 ? 1 : 0.08 }}>
            <text
              x="155"
              y="184"
              textAnchor="middle"
              className="fill-muted-foreground text-[8px]"
            >
              no action
            </text>
            <text
              x="352"
              y="184"
              textAnchor="middle"
              className="fill-foreground text-[8px] font-bold"
            >
              alert
            </text>
            <text
              x="292"
              y="126"
              textAnchor="middle"
              className="fill-primary text-[8px] font-bold"
            >
              threshold
            </text>
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function ResamplingGeometryViz() {
  const labels = [
    "먼저 group·time split",
    "Train의 노출만 변경",
    "Minority 두 점 사이 보간",
    "유효하지 않은 geometry 거부",
  ] as const;
  const notes = [
    "Validation·test의 row와 prevalence를 먼저 봉인해 neighbor search에서 제외합니다.",
    "Oversampling은 train minority의 노출을 늘리고 undersampling은 train majority 일부를 버립니다.",
    "SMOTE는 같은 class train point의 방향 벡터에 λ를 곱해 선분 안의 synthetic point를 만듭니다.",
    "Category·sparse·time feature에서는 선분 중간이 실제 가능한 record인지 constraint로 확인해야 합니다.",
  ] as const;
  return (
    <Scene
      id="imbalance-resampling-viz"
      title="Split 뒤에만 바꾸는 training geometry"
      description="원본 population과 model이 보는 training exposure를 구분합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 230"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <rect
            x="18"
            y="22"
            width="250"
            height="178"
            rx="10"
            fill="none"
            stroke={active === 0 ? accent : border}
            strokeWidth="1.25"
          />
          <text x="32" y="43" className="fill-foreground text-[8px] font-bold">
            TRAIN FOLD
          </text>
          <rect
            x="286"
            y="22"
            width="136"
            height="178"
            rx="10"
            fill="none"
            stroke={active === 0 ? accent : border}
            strokeWidth="1.25"
          />
          <text x="300" y="43" className="fill-foreground text-[8px] font-bold">
            VALIDATION
          </text>
          {[
            [62, 78],
            [102, 130],
            [156, 76],
            [215, 152],
            [326, 88],
            [380, 146],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === 0 || i === 1 ? 7 : 5}
              fill={i === 0 || i === 1 ? accent : "var(--muted)"}
              opacity={active === 0 ? 1 : active >= 1 && i < 4 ? 1 : 0.2}
            />
          ))}
          <motion.g animate={{ opacity: active === 1 ? 1 : 0.08 }}>
            {[
              [62, 97],
              [81, 78],
              [102, 149],
            ].map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="6"
                fill="none"
                stroke={accent}
                strokeWidth="1.25"
              />
            ))}
          </motion.g>
          <motion.g animate={{ opacity: active >= 2 ? 1 : 0.08 }}>
            <line
              x1="62"
              y1="78"
              x2="102"
              y2="130"
              stroke={accent}
              strokeWidth="1.25"
              strokeDasharray="4 4"
            />
            <circle
              cx="82"
              cy="104"
              r="7"
              fill="var(--background)"
              stroke={accent}
              strokeWidth="1.25"
            />
            <text
              x="82"
              y="126"
              textAnchor="middle"
              className="fill-primary text-[8px] font-bold"
            >
              λ=.5
            </text>
          </motion.g>
          <motion.g animate={{ opacity: active === 3 ? 1 : 0.05 }}>
            <path d="M300 70L405 168" stroke={accent} strokeWidth="1.25" />
            <path d="M405 70L300 168" stroke={accent} strokeWidth="1.25" />
            <text
              x="352"
              y="122"
              textAnchor="middle"
              className="fill-foreground text-[8px] font-bold"
            >
              invalid midpoint
            </text>
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function LossSignalViz() {
  const labels = [
    "기본 sample loss 합",
    "Class weight로 고정 배점",
    "Focal factor로 현재 난이도 반영",
    "Hard noise를 별도 audit",
  ] as const;
  const notes = [
    "평균 loss에서는 많은 majority example의 gradient 합이 training direction을 지배할 수 있습니다.",
    "Class weight는 target class만 보고 같은 coefficient를 곱해 minority의 평균 기여를 키웁니다.",
    "Focal loss는 target probability가 높은 easy example의 weight를 줄이고 hard example을 남깁니다.",
    "틀린 label도 hard example로 보이므로 focal 후보는 audited error slice와 calibration을 함께 봅니다.",
  ] as const;
  return (
    <Scene
      id="imbalance-loss-viz"
      title="어떤 example이 gradient를 얼마나 움직이는가"
      description="Class frequency와 현재 난이도라는 서로 다른 가중 축을 비교합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 230"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          {[
            ["easy −", 0.9, 52],
            ["hard −", 0.2, 130],
            ["positive", 0.35, 208],
            ["noisy +", 0.08, 286],
          ].map(([label, p, x], i) => {
            const weight =
              active === 0
                ? 1
                : active === 1
                  ? i >= 2
                    ? 5
                    : 1
                  : active >= 2
                    ? Math.pow(1 - Number(p), 2)
                    : 1;
            return (
              <g key={String(label)}>
                <text
                  x={Number(x) + 24}
                  y="35"
                  textAnchor="middle"
                  className="fill-muted-foreground text-[8px]"
                >
                  {label}
                </text>
                <rect
                  x={Number(x)}
                  y={55}
                  width="48"
                  height="135"
                  rx="7"
                  fill="var(--background)"
                  stroke={i === 3 && active === 3 ? accent : border}
                  strokeWidth="1.25"
                />
                <motion.rect
                  x={Number(x) + 8}
                  width="32"
                  y={185 - Math.min(115, weight * 22)}
                  height={Math.min(115, weight * 22)}
                  fill={i >= 2 ? accent : "var(--muted)"}
                  initial={false}
                  animate={{ opacity: active === 3 && i === 3 ? 1 : 0.8 }}
                />
                <text
                  x={Number(x) + 24}
                  y="210"
                  textAnchor="middle"
                  className="fill-foreground text-[8px] font-bold"
                >
                  w={weight.toFixed(2)}
                </text>
              </g>
            );
          })}
          <motion.path
            d="M342 52L410 120L342 188"
            fill="none"
            stroke={accent}
            strokeWidth="1.25"
            animate={{ opacity: active === 3 ? 1 : 0.05 }}
          />
          <text
            x="386"
            y="123"
            textAnchor="middle"
            className="fill-primary text-[8px] font-bold"
          >
            audit
          </text>
        </svg>
      )}
    </Scene>
  );
}

export function ThresholdPolicyViz() {
  const labels = [
    "두 action의 오류 비용 정의",
    "Probability별 expected cost 계산",
    "두 비용의 교차점 선택",
    "Capacity·drift로 policy 재검증",
  ] as const;
  const notes = [
    "Positive action은 실제 negative일 때 FP 비용을, negative action은 실제 positive일 때 FN 비용을 냅니다.",
    "Calibrated p에서 positive 비용은 (1−p)C_FP, negative 비용은 pC_FN입니다.",
    "두 비용이 같은 확률 τ*를 경계로 더 싼 action을 선택합니다. FN 비용이 커지면 τ*는 낮아집니다.",
    "하루 처리량이나 prevalence가 바뀌면 validation sweep과 rollback receipt로 threshold를 다시 승인합니다.",
  ] as const;
  return (
    <Scene
      id="threshold-policy-viz"
      title="Probability에서 action policy로"
      description="0.5 관습 대신 오류 비용과 운영 제약을 직접 비교합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 230"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <line
            x1="48"
            y1="178"
            x2="410"
            y2="178"
            stroke={border}
            strokeWidth="1.25"
          />
          <line
            x1="48"
            y1="32"
            x2="48"
            y2="178"
            stroke={border}
            strokeWidth="1.25"
          />
          <text
            x="228"
            y="208"
            textAnchor="middle"
            className="fill-muted-foreground text-[8px]"
          >
            calibrated probability p
          </text>
          <motion.path
            d="M50 42L404 174"
            fill="none"
            stroke={accent}
            strokeWidth="1.25"
            animate={{ opacity: active >= 1 ? 1 : 0.1 }}
          />
          <motion.path
            d="M50 174L404 42"
            fill="none"
            stroke={muted}
            strokeWidth="1.25"
            animate={{ opacity: active >= 1 ? 1 : 0.1 }}
          />
          <motion.line
            x1="122"
            y1="30"
            x2="122"
            y2="178"
            stroke={accent}
            strokeWidth="1.25"
            strokeDasharray="4 4"
            animate={{ opacity: active >= 2 ? 1 : 0.08 }}
          />
          <motion.circle
            cx="122"
            cy="69"
            r="7"
            fill="var(--background)"
            stroke={accent}
            strokeWidth="1.25"
            animate={{ opacity: active >= 2 ? 1 : 0.08 }}
          />
          <text
            x="122"
            y="198"
            textAnchor="middle"
            className="fill-primary text-[8px] font-bold"
          >
            τ*
          </text>
          <motion.g animate={{ opacity: active === 3 ? 1 : 0.08 }}>
            <rect
              x="244"
              y="44"
              width="142"
              height="42"
              rx="7"
              fill="var(--background)"
              stroke={accent}
              strokeWidth="1.25"
            />
            <text
              x="315"
              y="61"
              textAnchor="middle"
              className="fill-foreground text-[8px] font-bold"
            >
              capacity gate
            </text>
            <text
              x="315"
              y="75"
              textAnchor="middle"
              className="fill-muted-foreground text-[7px]"
            >
              alerts/day ≤ K
            </text>
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function ImbalanceEvaluationViz() {
  const labels = [
    "Threshold에서 네 count 생성",
    "서로 다른 분모의 precision·recall",
    "Prevalence 이동으로 precision 변화",
    "Probability bin의 frequency 확인",
  ] as const;
  const notes = [
    "한 evaluation unit·window·dedup rule에서 TP·FP·FN·TN을 만듭니다.",
    "Precision은 alert의 purity, recall은 실제 positive의 coverage를 묻습니다.",
    "TPR·FPR이 같아도 negative population이 커지면 FP count가 늘어 precision이 내려갑니다.",
    "Score bin별 평균 confidence와 positive frequency를 나란히 그려 calibration을 평가합니다.",
  ] as const;
  return (
    <Scene
      id="imbalance-evaluation-viz"
      title="한 report 안의 세 평가 층"
      description="Decision counts, prevalence-sensitive PR, probability calibration을 섞지 않습니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 240"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <motion.g animate={{ opacity: active <= 1 ? 1 : 0.12 }}>
            {[
              ["TP", 42, 34],
              ["FP", 132, 34],
              ["FN", 42, 100],
              ["TN", 132, 100],
            ].map(([label, x, y], i) => (
              <g key={String(label)}>
                <rect
                  x={Number(x)}
                  y={Number(y)}
                  width="72"
                  height="48"
                  rx="7"
                  fill={
                    i === 0
                      ? "color-mix(in srgb, var(--primary) 10%, transparent)"
                      : "var(--background)"
                  }
                  stroke={i === 0 ? accent : border}
                  strokeWidth="1.25"
                />
                <text
                  x={Number(x) + 36}
                  y={Number(y) + 28}
                  textAnchor="middle"
                  className="fill-foreground text-[10px] font-bold"
                >
                  {label}
                </text>
              </g>
            ))}
          </motion.g>
          <motion.g animate={{ opacity: active === 1 ? 1 : 0.08 }}>
            <text
              x="266"
              y="60"
              className="fill-foreground text-[9px] font-bold"
            >
              precision = TP / alerts
            </text>
            <text
              x="266"
              y="96"
              className="fill-foreground text-[9px] font-bold"
            >
              recall = TP / positives
            </text>
          </motion.g>
          <motion.g animate={{ opacity: active === 2 ? 1 : 0.08 }}>
            <rect
              x="260"
              y="38"
              width="58"
              height="135"
              fill="var(--background)"
              stroke={border}
              strokeWidth="1.25"
            />
            <rect
              x="330"
              y="38"
              width="58"
              height="135"
              fill="var(--background)"
              stroke={border}
              strokeWidth="1.25"
            />
            <rect x="270" y="80" width="38" height="93" fill={accent} />
            <rect x="340" y="146" width="38" height="27" fill={accent} />
            <text
              x="289"
              y="193"
              textAnchor="middle"
              className="fill-muted-foreground text-[7px]"
            >
              π=.5
            </text>
            <text
              x="359"
              y="193"
              textAnchor="middle"
              className="fill-muted-foreground text-[7px]"
            >
              π=.01
            </text>
          </motion.g>
          <motion.g animate={{ opacity: active === 3 ? 1 : 0.08 }}>
            {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
              <g key={p}>
                <rect
                  x={52 + i * 86}
                  y={170 - p * 120}
                  width="24"
                  height={p * 120}
                  fill="none"
                  stroke={border}
                  strokeWidth="1.25"
                />
                <motion.rect
                  x={80 + i * 86}
                  y={170 - (p - (i === 2 ? 0.15 : 0.03)) * 120}
                  width="24"
                  height={(p - (i === 2 ? 0.15 : 0.03)) * 120}
                  fill={accent}
                />
                <text
                  x={78 + i * 86}
                  y="195"
                  textAnchor="middle"
                  className="fill-muted-foreground text-[7px]"
                >
                  {p}
                </text>
              </g>
            ))}
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}
