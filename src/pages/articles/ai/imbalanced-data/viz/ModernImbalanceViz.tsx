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
        data-viz-scene={id}
        className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 sm:px-6"
      >
        <div
          id={controls.playbackId}
          data-viz-live-only
          tabIndex={0}
          onKeyDown={controls.onKeyDown}
          className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <p className="text-[11px] font-black tracking-[.14em] text-primary">
            상태 추적 · {String(controls.active + 1).padStart(2, "0")}
          </p>
          <h3 aria-live="polite" className="mt-2 text-lg font-bold leading-7">
            {labels[controls.active]}
          </h3>
          <div data-viz-canvas className="mt-5 min-w-0 overflow-hidden">
            {children(controls.active)}
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
            {notes[controls.active]}
          </p>
          <AnimatedSceneControls labels={[...labels]} {...controls} />
        </div>
        <ol className="static-reading-only mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
          {labels.map((label, index) => (
            <li key={label}>
              <strong>{label}</strong>
              <span className="mt-1 block text-muted-foreground">
                {notes[index]}
              </span>
            </li>
          ))}
        </ol>
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
        className="fill-foreground text-[11px] sm:text-[9px] font-bold"
      >
        {label}
      </text>
      <text
        x={x + width / 2}
        y={y + 35}
        textAnchor="middle"
        className="fill-muted-foreground text-[12px] sm:text-[10px] sm:text-[7px]"
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
    "모집단의 기준 비율 확인",
    "점수로 순서를 정함",
    "확률의 의미를 검증",
    "임계값으로 행동을 정함",
  ] as const;
  const notes = [
    "1,000명 중 양성이 50명이면 기준 비율은 5%이고, 모두 음성이라고 답한 정확도도 이미 95%입니다.",
    "점수 0.8이 확률이라는 보장은 없어도 양성 표본을 더 위에 정렬할 수는 있습니다.",
    "0.8이라고 예측한 집단의 실제 양성 빈도도 약 80%인지 따로 확인합니다.",
    "오류 비용·재현율·알림 처리 용량을 정책에 넣어 임계값을 넘은 예측만 실제 알림으로 바꿉니다.",
  ] as const;
  return (
    <Scene
      id="imbalance-decision-viz"
      title="모집단에서 실제 행동까지 이어지는 네 층"
      description="같은 모델 출력을 기준 비율·순위·확률·의사결정으로 나눠 봅니다."
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
            label="점수"
            detail="순서"
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
            detail="실제 빈도"
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
              className="fill-muted-foreground text-[11px] sm:text-[8px]"
            >
              조치 안 함
            </text>
            <text
              x="352"
              y="184"
              textAnchor="middle"
              className="fill-foreground text-[11px] sm:text-[8px] font-bold"
            >
              알림
            </text>
            <text
              x="292"
              y="126"
              textAnchor="middle"
              className="fill-primary text-[11px] sm:text-[8px] font-bold"
            >
              임계값
            </text>
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function ResamplingGeometryViz() {
  const labels = [
    "집단과 시간을 기준으로 먼저 분리",
    "학습 자료의 노출만 변경",
    "소수 클래스의 두 점 사이를 보간",
    "불가능한 합성점을 제외",
  ] as const;
  const notes = [
    "검증·시험 자료의 행과 기준 비율을 먼저 봉인해 이웃 탐색에서 제외합니다.",
    "과대표집은 학습 자료의 소수 클래스를 더 자주 보여주고, 과소표집은 다수 클래스 일부를 덜 보여줍니다.",
    "xᵢ=(2,4), xⱼ=(6,8)에서 λ=.25를 쓰면 (2,4)+.25×(4,4)=(3,5)가 됩니다.",
    "범주형·희소·시계열 특성에서는 선분의 중간점이 실제 가능한 기록인지 제약 조건으로 확인해야 합니다.",
  ] as const;
  return (
    <Scene
      id="imbalance-resampling-viz"
      title="자료를 나눈 뒤 학습 좌표만 바꿉니다"
      description="실제 모집단과 모델이 반복해서 보는 학습 표본을 구분합니다."
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
          <text
            x="32"
            y="43"
            className="fill-foreground text-[11px] sm:text-[8px] font-bold"
          >
            학습 폴드
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
          <text
            x="300"
            y="43"
            className="fill-foreground text-[11px] sm:text-[8px] font-bold"
          >
            검증 세트
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
              cx="72"
              cy="91"
              r="7"
              fill="var(--background)"
              stroke={accent}
              strokeWidth="1.25"
            />
            <text
              x="72"
              y="116"
              textAnchor="middle"
              className="fill-primary text-[11px] sm:text-[8px] font-bold"
            >
              λ=.25 · (3,5)
            </text>
          </motion.g>
          <motion.g animate={{ opacity: active === 3 ? 1 : 0.05 }}>
            <path d="M300 70L405 168" stroke={accent} strokeWidth="1.25" />
            <path d="M405 70L300 168" stroke={accent} strokeWidth="1.25" />
            <text
              x="352"
              y="122"
              textAnchor="middle"
              className="fill-foreground text-[11px] sm:text-[8px] font-bold"
            >
              불가능한 중간점
            </text>
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function LossSignalViz() {
  const labels = [
    "표본별 기본 손실을 합산",
    "클래스 가중치로 고정 배점",
    "초점 계수로 현재 난이도를 반영",
    "어려운 오표기를 별도로 점검",
  ] as const;
  const notes = [
    "네 표본의 기본 기여도를 먼저 1로 놓고 어떤 규칙이 배점을 바꾸는지 비교합니다.",
    "양성과 오표기 양성은 정답 클래스만 보고 가중치 9를 받습니다. 행 수는 그대로입니다.",
    "γ=2이면 pₜ=.9는 .01, pₜ=.2는 .64를 받아 쉬운 표본의 기여도가 더 크게 줄어듭니다.",
    "pₜ=.08인 오표기도 어려운 표본으로 보이므로 오류 구간과 확률 보정을 함께 점검합니다.",
  ] as const;
  return (
    <Scene
      id="imbalance-loss-viz"
      title="어떤 표본이 경사를 얼마나 움직이는가"
      description="클래스 빈도와 현재 난이도라는 서로 다른 가중 기준을 비교합니다."
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
            ["쉬운 음성", 0.9, 52],
            ["어려운 음성", 0.2, 130],
            ["양성", 0.35, 208],
            ["오표기 양성", 0.08, 286],
          ].map(([label, p, x], i) => {
            const weight =
              active === 0
                ? 1
                : active === 1
                  ? i >= 2
                    ? 9
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
                  className="fill-muted-foreground text-[11px] sm:text-[8px]"
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
                  className="fill-foreground text-[11px] sm:text-[8px] font-bold"
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
            className="fill-primary text-[11px] sm:text-[8px] font-bold"
          >
            점검
          </text>
        </svg>
      )}
    </Scene>
  );
}

export function ThresholdPolicyViz() {
  const labels = [
    "C_FP=1 · C_FN=9",
    "R₊=(1−p) · R₋=9p",
    "두 비용은 p=.1에서 교차",
    "하루 200건·재현율 .90 기준",
  ] as const;
  const notes = [
    "보정된 예측 후보 1,000건에서 거짓 양성 비용은 1, 거짓 음성 비용은 9로 둡니다.",
    "양성 조치의 기대비용은 1−p이고, 음성 조치의 기대비용은 9p입니다.",
    "1−p=9p인 p=.1이 베이즈 임계값입니다. p가 .1보다 높으면 양성 조치의 기대비용이 더 작습니다.",
    "τ=.1도 하루 알림 200건 이하와 재현율 .90 이상을 함께 만족해야 배포할 수 있습니다. 분포가 바뀌면 다시 검증합니다.",
  ] as const;
  return (
    <Scene
      id="threshold-policy-viz"
      title="C_FP=1·C_FN=9이면 비용은 p=.1에서 교차합니다"
      description="보정된 후보 1,000건에서 베이즈 임계값과 하루 200건·재현율 .90 기준을 차례로 봅니다."
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
            className="fill-muted-foreground text-[12px] sm:text-[10px]"
          >
            보정된 확률 p
          </text>
          <motion.path
            d="M50 106L404 120"
            fill="none"
            stroke={accent}
            strokeWidth="1.25"
            animate={{ opacity: active >= 1 ? 1 : 0.55 }}
          />
          <motion.path
            d="M50 178L404 48"
            fill="none"
            stroke={muted}
            strokeWidth="1.25"
            animate={{ opacity: active >= 1 ? 1 : 0.55 }}
          />
          <motion.line
            x1="227"
            y1="30"
            x2="227"
            y2="178"
            stroke={accent}
            strokeWidth="1.25"
            strokeDasharray="4 4"
            animate={{ opacity: active >= 2 ? 1 : 0.08 }}
          />
          <motion.circle
            cx="227"
            cy="113"
            r="7"
            fill="var(--background)"
            stroke={accent}
            strokeWidth="1.25"
            animate={{ opacity: active >= 2 ? 1 : 0.08 }}
          />
          <text
            x="227"
            y="194"
            textAnchor="middle"
            className="fill-primary text-[12px] sm:text-[10px] font-bold"
          >
            τ*=.1
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
              className="fill-foreground text-[12px] sm:text-[10px] font-bold"
            >
              처리 용량 기준
            </text>
            <text
              x="315"
              y="75"
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] sm:text-[9px]"
            >
              하루 알림≤200 · 재현율≥.90
            </text>
          </motion.g>
          <text
            x="50"
            y="194"
            textAnchor="middle"
            className="fill-muted-foreground text-[11px] sm:text-[9px]"
          >
            0
          </text>
          <text
            x="404"
            y="194"
            textAnchor="middle"
            className="fill-muted-foreground text-[11px] sm:text-[9px]"
          >
            .2
          </text>
          <text
            x="55"
            y="101"
            className="fill-primary text-[11px] sm:text-[9px] font-bold"
          >
            R₊=1−p
          </text>
          <text
            x="55"
            y="171"
            className="fill-muted-foreground text-[11px] sm:text-[9px] font-bold"
          >
            R₋=9p
          </text>
        </svg>
      )}
    </Scene>
  );
}

export function ImbalanceEvaluationViz() {
  const labels = [
    "임계값에서 네 가지 수를 계산",
    "서로 다른 분모로 정밀도·재현율 계산",
    "기준 비율 변화에 따른 정밀도 확인",
    "확률 구간의 실제 빈도 확인",
  ] as const;
  const notes = [
    "1,000건을 같은 단위와 기간으로 세어 TP=40, FP=10, FN=10, TN=940을 만듭니다.",
    "정밀도는 40/(40+10)=.8이고 재현율도 40/(40+10)=.8입니다. 값은 같아도 분모의 뜻은 다릅니다.",
    "TPR·FPR이 같아도 음성 모집단이 커지면 거짓 양성 수가 늘어 정밀도가 내려갑니다.",
    "점수 구간별 평균 예측 확률과 실제 양성 빈도를 나란히 그려 확률 보정을 평가합니다.",
  ] as const;
  return (
    <Scene
      id="imbalance-evaluation-viz"
      title="한 보고서 안에서 세 평가 층을 분리합니다"
      description="행동 결과 수, 기준 비율에 민감한 정밀도·재현율, 확률 보정을 섞지 않습니다."
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
              ["TP 40", 42, 34],
              ["FP 10", 132, 34],
              ["FN 10", 42, 100],
              ["TN 940", 132, 100],
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
                  className="fill-foreground text-[12px] sm:text-[10px] font-bold"
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
              className="fill-foreground text-[11px] sm:text-[9px] font-bold"
            >
              정밀도 = TP / 알림 수
            </text>
            <text
              x="266"
              y="96"
              className="fill-foreground text-[11px] sm:text-[9px] font-bold"
            >
              재현율 = TP / 실제 양성 수
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
              className="fill-muted-foreground text-[12px] sm:text-[10px] sm:text-[7px]"
            >
              π=.5
            </text>
            <text
              x="359"
              y="193"
              textAnchor="middle"
              className="fill-muted-foreground text-[12px] sm:text-[10px] sm:text-[7px]"
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
                  className="fill-muted-foreground text-[12px] sm:text-[10px] sm:text-[7px]"
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
