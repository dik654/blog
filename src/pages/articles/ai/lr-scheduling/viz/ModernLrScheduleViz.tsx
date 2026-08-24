import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const primary = "var(--primary)";
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
    <motion.g initial={false} animate={{ opacity: active ? 1 : 0.2 }}>
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
        stroke={active ? primary : border}
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
        y={y + 40}
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
    <g opacity={active ? 1 : 0.18}>
      <defs>
        <marker
          id={id}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill={active ? primary : muted} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? primary : muted}
        strokeWidth="1.25"
        markerEnd={`url(#${id})`}
      />
    </g>
  );
}

export function ScheduleClockViz() {
  const labels = [
    "Micro-batch와 update를 구분",
    "Update index를 시간축으로 고정",
    "Schedule이 learning rate를 반환",
    "Cursor와 설정을 receipt로 보존",
  ] as const;
  const notes = [
    "Backward를 여러 번 호출해도 parameter가 실제로 바뀌는 optimizer.step은 한 번일 수 있습니다.",
    "Scheduler의 t는 epoch 이름이 아니라 실제 parameter update 사건을 세는 index로 정의합니다.",
    "Schedule은 같은 update index와 같은 state에 대해 parameter group별 learning rate를 반환합니다.",
    "Global update·total budget·scheduler state·call order를 저장해야 resume 뒤 같은 trajectory가 이어집니다.",
  ] as const;
  return (
    <Scene
      id="schedule-clock-viz"
      title="Batch 실행에서 재현 가능한 schedule까지"
      description="Scheduler가 읽는 시간축과 반환하는 값, 저장해야 할 state를 한 장면씩 연결합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 400 238"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          {[0, 1, 2, 3].map((index) => (
            <motion.g
              key={index}
              initial={false}
              animate={{ opacity: active === 0 ? 1 : 0.24 }}
            >
              <rect
                x={20 + index * 42}
                y="28"
                width="30"
                height="28"
                rx="6"
                fill="var(--background)"
                stroke={active === 0 ? primary : border}
                strokeWidth="1.25"
              />
              <text
                x={35 + index * 42}
                y="46"
                textAnchor="middle"
                className="fill-foreground text-[9px] font-bold"
              >
                μ{index + 1}
              </text>
            </motion.g>
          ))}
          <Arrow
            x1={181}
            y1={42}
            x2={222}
            y2={42}
            active={active >= 0}
            id="clock-a"
          />
          <Box
            x={228}
            y={15}
            width={150}
            label="optimizer update"
            detail="parameter changes once"
            active={active <= 1}
          />
          <line
            x1="44"
            y1="112"
            x2="356"
            y2="112"
            stroke={border}
            strokeWidth="1.25"
          />
          {[0, 1, 2, 3, 4].map((tick) => (
            <motion.g
              key={tick}
              initial={false}
              animate={{ opacity: active >= 1 ? 1 : 0.18 }}
            >
              <line
                x1={52 + tick * 74}
                y1="104"
                x2={52 + tick * 74}
                y2="120"
                stroke={active >= 1 ? primary : muted}
                strokeWidth="1.25"
              />
              <text
                x={52 + tick * 74}
                y="138"
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                t={tick}
              </text>
            </motion.g>
          ))}
          <motion.path
            d="M52 194 C118 185 165 142 218 154 C272 166 312 185 348 198"
            fill="none"
            stroke={active >= 2 ? primary : muted}
            strokeWidth="1.25"
            initial={false}
            animate={{
              opacity: active >= 2 ? 1 : 0.18,
              pathLength: active >= 2 ? 1 : 0.35,
            }}
          />
          <text x="22" y="192" className="fill-muted-foreground text-[9px]">
            η(t)
          </text>
          <motion.g
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.16 }}
          >
            <rect
              x="238"
              y="160"
              width="140"
              height="60"
              rx="8"
              fill="var(--background)"
              stroke={primary}
              strokeWidth="1.25"
            />
            <text
              x="308"
              y="182"
              textAnchor="middle"
              className="fill-foreground text-[10px] font-bold"
            >
              schedule receipt
            </text>
            <text
              x="308"
              y="199"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              t · T · state · call event
            </text>
            <text
              x="308"
              y="214"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              param-group LR
            </text>
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function DecayPolicyViz() {
  const labels = [
    "Open-loop은 clock만 읽음",
    "Step과 exponential의 모양 비교",
    "Metric-trigger는 validation을 읽음",
    "두 정책의 state를 구분",
  ] as const;
  const notes = [
    "Open-loop decay는 validation 결과와 무관하게 milestone 또는 매-step factor로 learning rate를 낮춥니다.",
    "Step은 특정 경계에서 값을 바꾸고 exponential은 매 호출 같은 비율을 곱습니다. 호출 단위가 곡선을 결정합니다.",
    "Metric-triggered decay는 validation event가 의미 있게 개선됐는지 판정해 bad-count를 갱신합니다.",
    "Open-loop는 cursor·milestone이 핵심이고 plateau policy는 best·threshold·patience·cooldown도 저장합니다.",
  ] as const;
  return (
    <Scene
      id="decay-policy-viz"
      title="Clock-driven decay와 metric-driven decay"
      description="같은 ‘LR 감소’라는 결과 뒤에 있는 입력과 state machine을 분리합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 400 250"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Box
            x={18}
            y={18}
            width={96}
            label="update t"
            detail="deterministic clock"
            active={active <= 1 || active === 3}
          />
          <Arrow
            x1={116}
            y1={45}
            x2={151}
            y2={45}
            active={active <= 1 || active === 3}
            id="decay-a"
          />
          <Box
            x={156}
            y={18}
            width={104}
            label="open-loop"
            detail="milestone · gamma"
            active={active <= 1 || active === 3}
          />
          <motion.path
            d="M282 28 H310 V44 H338 V60 H372"
            fill="none"
            stroke={active === 1 ? primary : muted}
            strokeWidth="1.25"
            initial={false}
            animate={{ opacity: active === 1 ? 1 : 0.18 }}
          />
          <motion.path
            d="M282 75 C310 78 340 92 372 112"
            fill="none"
            stroke={active === 1 ? primary : muted}
            strokeWidth="1.25"
            initial={false}
            animate={{ opacity: active === 1 ? 1 : 0.18 }}
          />
          <text
            x="330"
            y="131"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            step / exponential
          </text>
          <Box
            x={18}
            y={156}
            width={96}
            label="val metric"
            detail="evaluation event"
            active={active >= 2}
          />
          <Arrow
            x1={116}
            y1={183}
            x2={151}
            y2={183}
            active={active >= 2}
            id="decay-b"
          />
          <Box
            x={156}
            y={156}
            width={104}
            label="plateau state"
            detail="best · bad-count"
            active={active >= 2}
          />
          <Arrow
            x1={262}
            y1={183}
            x2={297}
            y2={183}
            active={active >= 2}
            id="decay-c"
          />
          <Box
            x={302}
            y={156}
            width={78}
            label="decay?"
            detail="patience gate"
            active={active >= 2}
          />
          <motion.g
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.15 }}
          >
            <line
              x1="126"
              y1="112"
              x2="274"
              y2="112"
              stroke={primary}
              strokeWidth="1.25"
              strokeDasharray="5 5"
            />
            <text
              x="200"
              y="104"
              textAnchor="middle"
              className="fill-primary text-[9px] font-bold"
            >
              입력과 저장 state가 다름
            </text>
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function CosineRestartViz() {
  const labels = [
    "Progress를 0에서 1로 정규화",
    "Cosine 반 주기로 LR를 보간",
    "Cycle 경계에서 LR만 되돌림",
    "Model·optimizer state는 이어감",
  ] as const;
  const notes = [
    "현재 cycle의 local step을 cycle length로 나눠 무차원 progress를 만듭니다.",
    "1+cos(πr)를 절반으로 줄이면 peak에서 minimum으로 부드럽게 내려가는 scale이 됩니다.",
    "Warm restart는 다음 cycle 첫 LR를 다시 peak로 올리고 cycle cursor를 0으로 되돌립니다.",
    "Parameter와 momentum·moment를 지우는 cold restart가 아닙니다. 무엇을 보존하는지 receipt에 적습니다.",
  ] as const;
  return (
    <Scene
      id="cosine-restart-viz"
      title="한 cosine cycle과 warm restart"
      description="곡선의 progress 계산과 restart되는 state의 범위를 분리합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 400 248"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <line
            x1="34"
            y1="148"
            x2="366"
            y2="148"
            stroke={border}
            strokeWidth="1.25"
          />
          <line
            x1="34"
            y1="28"
            x2="34"
            y2="148"
            stroke={border}
            strokeWidth="1.25"
          />
          <motion.path
            d="M34 40 C100 40 132 148 200 148 C268 148 300 40 366 40"
            fill="none"
            stroke={primary}
            strokeWidth="1.25"
            initial={false}
            animate={{
              pathLength: active >= 1 ? 1 : 0.34,
              opacity: active >= 1 ? 1 : 0.25,
            }}
          />
          {[34, 200, 366].map((x, index) => (
            <motion.circle
              key={x}
              cx={x}
              cy={index === 1 ? 148 : 40}
              r="5"
              fill={active >= index ? primary : muted}
              initial={false}
              animate={{ scale: active >= index ? 1 : 0.65 }}
            />
          ))}
          <text
            x="34"
            y="168"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            r=0
          </text>
          <text
            x="200"
            y="168"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            r=1
          </text>
          <text
            x="366"
            y="168"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            next cycle
          </text>
          <motion.path
            d="M202 130 C230 92 256 58 354 42"
            fill="none"
            stroke={primary}
            strokeWidth="1.25"
            strokeDasharray="5 5"
            initial={false}
            animate={{ opacity: active >= 2 ? 1 : 0 }}
          />
          <motion.g
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.18 }}
          >
            <rect
              x="54"
              y="192"
              width="292"
              height="42"
              rx="8"
              fill="var(--background)"
              stroke={primary}
              strokeWidth="1.25"
            />
            <text
              x="200"
              y="209"
              textAnchor="middle"
              className="fill-foreground text-[10px] font-bold"
            >
              보존: θ · momentum/moments · data progress
            </text>
            <text
              x="200"
              y="226"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              reset: cycle cursor · LR phase
            </text>
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function OneCyclePolicyViz() {
  const labels = [
    "Range test에서 instability를 찾음",
    "Max LR 후보를 그보다 아래에 둠",
    "한 run을 rise와 decay로 나눔",
    "Momentum과 rollback도 함께 고정",
  ] as const;
  const notes = [
    "짧은 진단 run에서 LR를 log scale로 올리며 loss 감소 구간과 급증 시작점을 찾습니다.",
    "급증한 LR를 정답으로 쓰지 않고 그보다 충분히 낮은 max 후보를 full validation run에서 비교합니다.",
    "Total updates의 p 비율은 initial→max, 나머지는 max→very small final LR에 사용합니다.",
    "Momentum phase·nonfinite loss·gradient overflow·rollback checkpoint가 같은 policy receipt에 있어야 합니다.",
  ] as const;
  return (
    <Scene
      id="one-cycle-policy-viz"
      title="Range test에서 OneCycle 실행까지"
      description="진단 run과 실제 schedule을 섞지 않고 max LR 선택과 phase를 연결합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 400 254"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <line
            x1="32"
            y1="112"
            x2="184"
            y2="112"
            stroke={border}
            strokeWidth="1.25"
          />
          <line
            x1="32"
            y1="24"
            x2="32"
            y2="112"
            stroke={border}
            strokeWidth="1.25"
          />
          <motion.path
            d="M34 98 C74 86 104 62 132 58 C150 56 162 72 178 104"
            fill="none"
            stroke={primary}
            strokeWidth="1.25"
            initial={false}
            animate={{ pathLength: active >= 0 ? 1 : 0.2 }}
          />
          <motion.line
            x1="151"
            y1="24"
            x2="151"
            y2="112"
            stroke={primary}
            strokeWidth="1.25"
            strokeDasharray="4 4"
            initial={false}
            animate={{ opacity: active <= 1 ? 1 : 0.18 }}
          />
          <text
            x="151"
            y="128"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            instability
          </text>
          <motion.circle
            cx="125"
            cy="61"
            r="5"
            fill={primary}
            initial={false}
            animate={{ opacity: active >= 1 ? 1 : 0.2 }}
          />
          <text
            x="116"
            y="46"
            textAnchor="middle"
            className="fill-primary text-[9px] font-bold"
          >
            max 후보
          </text>
          <line
            x1="220"
            y1="112"
            x2="376"
            y2="112"
            stroke={border}
            strokeWidth="1.25"
          />
          <line
            x1="220"
            y1="24"
            x2="220"
            y2="112"
            stroke={border}
            strokeWidth="1.25"
          />
          <motion.path
            d="M222 100 C252 92 270 34 294 34 C326 34 348 84 374 104"
            fill="none"
            stroke={active >= 2 ? primary : muted}
            strokeWidth="1.25"
            initial={false}
            animate={{
              opacity: active >= 2 ? 1 : 0.18,
              pathLength: active >= 2 ? 1 : 0.3,
            }}
          />
          <line
            x1="294"
            y1="28"
            x2="294"
            y2="116"
            stroke={active >= 2 ? primary : muted}
            strokeWidth="1.25"
            strokeDasharray="4 4"
            opacity={active >= 2 ? 1 : 0.18}
          />
          <text
            x="294"
            y="128"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            pT
          </text>
          <motion.g
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.18 }}
          >
            <Box
              x={56}
              y={176}
              width={128}
              label="inverse momentum"
              detail="high LR ↔ low momentum"
              active
            />
            <Arrow x1={186} y1={203} x2={218} y2={203} active id="cycle-a" />
            <Box
              x={224}
              y={176}
              width={120}
              label="rollback gate"
              detail="loss · overflow · ckpt"
              active
            />
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function WarmupCompositionViz() {
  const labels = [
    "처음 W updates를 별도 구간으로 둠",
    "Warmup이 start에서 peak로 올림",
    "Main schedule은 local clock 0에서 시작",
    "실제 relative update로 안정성을 검사",
  ] as const;
  const notes = [
    "전체 T 중 처음 W를 warmup에 예약하고 남은 길이는 T−W로 계산합니다.",
    "Warmup 끝값과 main schedule 첫 값을 같은 peak로 맞춰 경계에서 LR가 튀지 않게 합니다.",
    "Global t=W에서 main local cursor k=0입니다. Cosine 길이도 전체 T가 아니라 T−W입니다.",
    "LR curve만 보지 않고 parameter displacement를 parameter norm으로 나눈 relative update와 overflow를 확인합니다.",
  ] as const;
  return (
    <Scene
      id="warmup-composition-viz"
      title="Warmup과 main schedule의 이음새"
      description="두 구간의 길이·cursor·경계값과 실제 update magnitude를 함께 봅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 400 250"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <line
            x1="34"
            y1="142"
            x2="368"
            y2="142"
            stroke={border}
            strokeWidth="1.25"
          />
          <line
            x1="34"
            y1="28"
            x2="34"
            y2="142"
            stroke={border}
            strokeWidth="1.25"
          />
          <motion.path
            d="M34 132 L126 42"
            fill="none"
            stroke={primary}
            strokeWidth="1.25"
            initial={false}
            animate={{
              opacity: active >= 1 ? 1 : 0.22,
              pathLength: active >= 1 ? 1 : 0.25,
            }}
          />
          <motion.path
            d="M126 42 C198 42 260 130 368 136"
            fill="none"
            stroke={active >= 2 ? primary : muted}
            strokeWidth="1.25"
            initial={false}
            animate={{
              opacity: active >= 2 ? 1 : 0.2,
              pathLength: active >= 2 ? 1 : 0.25,
            }}
          />
          <line
            x1="126"
            y1="28"
            x2="126"
            y2="148"
            stroke={primary}
            strokeWidth="1.25"
            strokeDasharray="5 5"
            opacity={active >= 0 ? 1 : 0.2}
          />
          <text
            x="80"
            y="162"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            warmup W
          </text>
          <text
            x="246"
            y="162"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            main length T−W
          </text>
          <text
            x="126"
            y="26"
            textAnchor="middle"
            className="fill-primary text-[9px] font-bold"
          >
            peak · k=0
          </text>
          <motion.g
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.16 }}
          >
            {[0.1, 0.35, 0.7, 0.28].map((height, index) => (
              <rect
                key={index}
                x={62 + index * 62}
                y={222 - height * 54}
                width="28"
                height={height * 54}
                rx="5"
                fill={
                  index === 2
                    ? "color-mix(in srgb, var(--primary) 20%, transparent)"
                    : "var(--muted)"
                }
                stroke={index === 2 ? primary : border}
                strokeWidth="1.25"
              />
            ))}
            <text
              x="308"
              y="196"
              className="fill-foreground text-[10px] font-bold"
            >
              relative update
            </text>
            <text x="308" y="214" className="fill-muted-foreground text-[9px]">
              ‖Δθ‖ / ‖θ‖
            </text>
            <text x="308" y="230" className="fill-muted-foreground text-[9px]">
              loss · overflow
            </text>
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}
