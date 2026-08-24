import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const accent = "var(--primary)";
const border = "var(--border)";
const muted = "var(--muted-foreground)";

function LessonScene({
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

function Node({
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
    <motion.g initial={false} animate={{ opacity: active ? 1 : 0.16 }}>
      <rect
        x={x}
        y={y}
        width={width}
        height="54"
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
        y={y + 22}
        textAnchor="middle"
        className="fill-foreground text-[11px] font-bold"
      >
        {label}
      </text>
      <text
        x={x + width / 2}
        y={y + 39}
        textAnchor="middle"
        className="fill-muted-foreground text-[9px]"
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
        animate={{ opacity: active ? 1 : 0.15 }}
      />
    </g>
  );
}

export function SgdUpdateViz() {
  const labels = [
    "Loss에서 gradient를 계산",
    "Learning rate로 이동량을 만듦",
    "Micro-batch gradient를 먼저 평균",
    "한 update와 receipt를 확정",
  ] as const;
  const notes = [
    "Backprop은 parameter마다 loss가 커지는 방향 g를 만들고 optimizer는 그 값을 입력으로 받습니다.",
    "SGD는 g의 반대 방향에 하나의 global learning rate를 곱해 parameter displacement를 만듭니다.",
    "Accumulation 중에는 parameter를 움직이지 않고 micro-batch gradient를 같은 장부에 더합니다.",
    "평균 gradient로 한 번만 update하고 update index·effective batch·LR을 함께 기록합니다.",
  ] as const;
  return (
    <LessonScene
      id="sgd-update-viz"
      title="Gradient에서 한 번의 SGD update까지"
      description="Gradient 계산·step 크기·accumulation·update clock의 경계를 순서대로 봅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 400 240"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Node
            x={18}
            y={24}
            width={84}
            label="loss"
            detail="scalar"
            active={active === 0}
          />
          <Arrow
            x1={104}
            y1={51}
            x2={142}
            y2={51}
            active={active >= 0}
            marker="sgd-a"
          />
          <Node
            x={146}
            y={24}
            width={90}
            label="gradient g"
            detail="backprop"
            active={active <= 1}
          />
          <Arrow
            x1={238}
            y1={51}
            x2={274}
            y2={51}
            active={active >= 1}
            marker="sgd-b"
          />
          <Node
            x={278}
            y={24}
            width={104}
            label="−ηg"
            detail="displacement"
            active={active === 1}
          />
          {[0, 1, 2, 3].map((index) => (
            <motion.g
              key={index}
              initial={false}
              animate={{ opacity: active >= 2 ? 1 : 0.12 }}
            >
              <rect
                x={34 + index * 58}
                y={112}
                width="46"
                height={28 + index * 5}
                rx="6"
                fill={
                  index === 3
                    ? "color-mix(in srgb, var(--primary) 18%, transparent)"
                    : "var(--muted)"
                }
                stroke={index === 3 ? accent : border}
                strokeWidth="1.25"
              />
              <text
                x={57 + index * 58}
                y={174}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                micro {index + 1}
              </text>
            </motion.g>
          ))}
          <Arrow
            x1={274}
            y1={138}
            x2={314}
            y2={138}
            active={active >= 2}
            marker="sgd-c"
          />
          <Node
            x={304}
            y={108}
            width={78}
            label="mean g"
            detail="one step"
            active={active >= 2}
          />
          <motion.g
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.12 }}
          >
            <rect
              x="108"
              y="202"
              width="184"
              height="28"
              rx="6"
              fill="var(--background)"
              stroke={accent}
              strokeWidth="1.25"
            />
            <text
              x="200"
              y="220"
              textAnchor="middle"
              className="fill-foreground text-[10px] font-bold"
            >
              update #42 · batch 32 · η=.1
            </text>
          </motion.g>
        </svg>
      )}
    </LessonScene>
  );
}

export function MomentumMemoryViz() {
  const labels = [
    "Step마다 noisy gradient가 도착",
    "EMA가 과거 방향을 감쇠해 저장",
    "Velocity가 일관된 축을 강화",
    "Curvature와 overshoot를 함께 감시",
  ] as const;
  const notes = [
    "현재 gradient만 보면 좁은 골짜기의 좌우 방향이 step마다 번갈아 바뀔 수 있습니다.",
    "EMA는 전체 history를 보관하지 않고 오래된 gradient를 β의 거듭제곱만큼 약하게 남깁니다.",
    "같은 부호가 이어진 축은 velocity가 커지고 번갈아 나온 축은 서로 상쇄됩니다.",
    "β와 learning rate가 너무 크면 state가 늦게 꺾여 minimum을 지나칠 수 있어 trajectory를 측정해야 합니다.",
  ] as const;
  const bars = [1, 0.72, 0.52, 0.37, 0.27];
  return (
    <LessonScene
      id="momentum-memory-viz"
      title="Noisy gradient를 velocity state로 압축"
      description="현재 signal·EMA memory·방향 강화·overshoot 경계를 한 trajectory로 연결합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 400 240"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <path
            d="M26 72C78 28 118 112 166 62S258 92 300 50S352 80 378 40"
            fill="none"
            stroke={border}
            strokeWidth="1.25"
          />
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.g
              key={index}
              initial={false}
              animate={{ opacity: active === 0 ? 1 : 0.2 }}
            >
              <circle
                cx={42 + index * 72}
                cy={index % 2 ? 88 : 48}
                r="8"
                fill={index === 4 ? accent : "var(--muted)"}
              />
              <line
                x1={42 + index * 72}
                y1={88}
                x2={42 + index * 72}
                y2={index % 2 ? 110 : 68}
                stroke={muted}
                strokeWidth="1.25"
              />
            </motion.g>
          ))}
          {bars.map((value, index) => (
            <motion.g
              key={index}
              initial={false}
              animate={{ opacity: active >= 1 ? 1 : 0.12 }}
            >
              <rect
                x={32 + index * 50}
                y={196 - value * 58}
                width="30"
                height={value * 58}
                rx="4"
                fill={index === 0 ? accent : "var(--muted)"}
              />
              <text
                x={47 + index * 50}
                y="214"
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                β^{index}
              </text>
            </motion.g>
          ))}
          <motion.path
            d="M44 150C105 130 145 142 202 116S300 102 356 82"
            fill="none"
            stroke={accent}
            strokeWidth="1.25"
            initial={false}
            animate={{
              pathLength: active >= 2 ? 1 : 0.08,
              opacity: active >= 2 ? 1 : 0.12,
            }}
          />
          <motion.g
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.1 }}
          >
            <circle
              cx="354"
              cy="82"
              r="18"
              fill="none"
              stroke={accent}
              strokeWidth="1.25"
            />
            <path
              d="M342 75L364 89M364 75L342 89"
              stroke={accent}
              strokeWidth="1.25"
            />
            <text
              x="354"
              y="124"
              textAnchor="middle"
              className="fill-foreground text-[10px] font-bold"
            >
              overshoot audit
            </text>
          </motion.g>
        </svg>
      )}
    </LessonScene>
  );
}

export function AdamStateViz() {
  const labels = [
    "Signed gradient와 squared gradient 분리",
    "두 EMA의 초기 bias를 보정",
    "좌표별 history scale로 나눔",
    "Update·state·precision을 receipt로 검증",
  ] as const;
  const notes = [
    "Adam은 gradient의 방향 장부 m과 squared magnitude 장부 v를 서로 다른 decay로 갱신합니다.",
    "0에서 시작한 EMA는 초기에 작으므로 각각 1−β₁ᵗ와 1−β₂ᵗ로 나눕니다.",
    "m̂을 √v̂+ε로 나누어 큰-history 좌표의 step은 줄이고 작은-history 좌표는 상대적으로 키웁니다.",
    "Moment dtype·step index·epsilon placement·skipped update를 고정해야 resume와 reference parity를 검사할 수 있습니다.",
  ] as const;
  return (
    <LessonScene
      id="adam-state-viz"
      title="Adam의 두 state와 coordinate-wise update"
      description="Moment 생성에서 bias correction·preconditioning·release receipt까지 흐름을 봅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 400 240"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Node
            x={18}
            y={22}
            width={70}
            label="gₜ"
            detail="signed"
            active={active === 0}
          />
          <Arrow
            x1={90}
            y1={49}
            x2={122}
            y2={49}
            active={active >= 0}
            marker="adam-a"
          />
          <Node
            x={126}
            y={14}
            width={88}
            label="mₜ"
            detail="first EMA"
            active={active <= 1}
          />
          <Node
            x={126}
            y={78}
            width={88}
            label="vₜ"
            detail="square EMA"
            active={active <= 1}
          />
          <path
            d="M88 50L122 104"
            fill="none"
            stroke={active === 0 ? accent : muted}
            strokeWidth="1.25"
            opacity={active === 0 ? 1 : 0.15}
          />
          <Arrow
            x1={216}
            y1={41}
            x2={252}
            y2={41}
            active={active >= 1}
            marker="adam-b"
          />
          <Arrow
            x1={216}
            y1={105}
            x2={252}
            y2={105}
            active={active >= 1}
            marker="adam-c"
          />
          <Node
            x={256}
            y={14}
            width={88}
            label="m̂ₜ"
            detail="÷(1−β₁ᵗ)"
            active={active === 1}
          />
          <Node
            x={256}
            y={78}
            width={88}
            label="v̂ₜ"
            detail="÷(1−β₂ᵗ)"
            active={active === 1}
          />
          <motion.g
            initial={false}
            animate={{ opacity: active >= 2 ? 1 : 0.12 }}
          >
            <line
              x1="48"
              y1="180"
              x2="352"
              y2="180"
              stroke={border}
              strokeWidth="1.25"
            />
            <rect
              x="74"
              y="153"
              width="34"
              height="54"
              rx="5"
              fill="var(--muted)"
              stroke={border}
              strokeWidth="1.25"
            />
            <rect
              x="182"
              y="166"
              width="34"
              height="41"
              rx="5"
              fill="color-mix(in srgb, var(--primary) 18%, transparent)"
              stroke={accent}
              strokeWidth="1.25"
            />
            <rect
              x="290"
              y="174"
              width="34"
              height="33"
              rx="5"
              fill="var(--muted)"
              stroke={border}
              strokeWidth="1.25"
            />
            <text
              x="91"
              y="224"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              small v̂
            </text>
            <text
              x="199"
              y="224"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              medium
            </text>
            <text
              x="307"
              y="224"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              large v̂
            </text>
          </motion.g>
          <motion.g
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.1 }}
          >
            <rect
              x="112"
              y="142"
              width="176"
              height="64"
              rx="8"
              fill="var(--background)"
              stroke={accent}
              strokeWidth="1.25"
            />
            <text
              x="200"
              y="166"
              textAnchor="middle"
              className="fill-foreground text-[10px] font-bold"
            >
              Adam update receipt
            </text>
            <text
              x="200"
              y="184"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              step · m/v dtype · ε · skipped-step
            </text>
          </motion.g>
        </svg>
      )}
    </LessonScene>
  );
}
