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
    <motion.g
      initial={false}
      animate={{ opacity: active ? 1 : 0.25, scale: active ? 1.02 : 1 }}
      style={{ transformOrigin: `${x + width / 2}px ${y + 26}px` }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height="52"
        rx="8"
        fill={
          active
            ? "color-mix(in srgb, var(--primary) 11%, transparent)"
            : "var(--background)"
        }
        stroke={active ? accent : border}
        strokeWidth="1.25"
      />
      <text
        x={x + width / 2}
        y={y + 22}
        textAnchor="middle"
        className="fill-foreground text-[10px] font-bold"
      >
        {label}
      </text>
      <text
        x={x + width / 2}
        y={y + 39}
        textAnchor="middle"
        className="fill-muted-foreground text-[8px]"
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
        animate={{ opacity: active ? 1 : 0.22, pathLength: active ? 1 : 0.72 }}
      />
    </g>
  );
}

export function TuningContractViz() {
  const labels = [
    "비교 규칙 고정",
    "같은 예산으로 trial 실행",
    "validation에서 선택",
    "outer data에서 보고",
  ] as const;
  const notes = [
    "Split·metric·training resource·seed policy가 같아야 configuration 차이만 비교할 수 있습니다.",
    "Search algorithm보다 먼저 trial 한 건의 비용과 전체 wall-clock 상한을 정합니다.",
    "Validation은 후보를 고르는 데이터입니다. 가장 좋은 validation 숫자를 최종 성능처럼 말하지 않습니다.",
    "Outer data는 선택이 끝난 procedure를 한 번 평가합니다. 결과를 보고 다시 고치면 새 outer data가 필요합니다.",
  ] as const;
  return (
    <Scene
      id="tuning-contract-viz"
      title="한 trial에서 최종 report까지"
      description="네 데이터·결정 경계를 한 장면씩 따라갑니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 220"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Node
            x={12}
            y={58}
            width={88}
            label="contract"
            detail="split · metric"
            active={active === 0}
          />
          <Arrow
            x1={101}
            y1={84}
            x2={122}
            y2={84}
            active={active <= 1}
            id="hpo-contract-a"
          />
          <Node
            x={124}
            y={58}
            width={88}
            label="trials"
            detail="same budget"
            active={active === 1}
          />
          <Arrow
            x1={213}
            y1={84}
            x2={234}
            y2={84}
            active={active <= 2}
            id="hpo-contract-b"
          />
          <Node
            x={236}
            y={58}
            width={88}
            label="selection"
            detail="validation"
            active={active === 2}
          />
          <Arrow
            x1={325}
            y1={84}
            x2={346}
            y2={84}
            active={active <= 3}
            id="hpo-contract-c"
          />
          <Node
            x={348}
            y={58}
            width={80}
            label="report"
            detail="outer data"
            active={active === 3}
          />
          <motion.path
            d="M280 118V164H168V118"
            fill="none"
            stroke={active === 3 ? accent : border}
            strokeWidth="1.25"
            strokeDasharray="4 5"
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.18 }}
          />
          <text
            x="224"
            y="184"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            outer를 보고 재선택하면 독립 경계가 사라짐
          </text>
        </svg>
      )}
    </Scene>
  );
}

export function AdaptiveSearchViz() {
  const labels = [
    "Random observations",
    "좋은 관측과 나머지 분리",
    "밀도비가 큰 영역 제안",
    "병렬·실패 history 보존",
  ] as const;
  const notes = [
    "처음에는 넓게 관측해 search space의 어느 구간이 유망한지 증거를 만듭니다.",
    "TPE는 score quantile로 good과 other 집합을 나누지만, 이 경계는 인과적 진실이 아닙니다.",
    "Good density는 높고 other density는 낮은 곳을 다음 후보로 선호합니다.",
    "PENDING·PRUNED·FAIL을 지우면 sampler가 실제로 본 공간과 제안 시점을 재구성할 수 없습니다.",
  ] as const;
  const points = [
    [52, 112],
    [86, 82],
    [120, 132],
    [156, 68],
    [195, 96],
    [228, 54],
    [268, 78],
    [310, 118],
    [350, 72],
    [386, 104],
  ] as const;
  return (
    <Scene
      id="adaptive-search-viz"
      title="관측 history가 다음 trial로 바뀌는 과정"
      description="산점도와 두 density를 이용해 적응형 제안의 직관을 봅니다."
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
          <line
            x1="34"
            y1="176"
            x2="414"
            y2="176"
            stroke={border}
            strokeWidth="1.25"
          />
          <line
            x1="34"
            y1="28"
            x2="34"
            y2="176"
            stroke={border}
            strokeWidth="1.25"
          />
          {points.map(([cx, cy]) => {
            const good = cy < 80;
            const visible = active === 0 || active >= 1;
            return (
              <motion.circle
                key={cx}
                cx={cx}
                cy={cy}
                r={good && active >= 1 ? 7 : 5}
                fill={good && active >= 1 ? accent : muted}
                initial={false}
                animate={{
                  opacity: visible ? (good || active === 0 ? 0.9 : 0.35) : 0.15,
                }}
              />
            );
          })}
          <motion.path
            d="M48 158C120 150 152 66 220 118C284 168 328 60 402 130"
            fill="none"
            stroke={accent}
            strokeWidth="1.25"
            initial={false}
            animate={{ opacity: active >= 2 ? 1 : 0.08 }}
          />
          <motion.rect
            x="207"
            y="38"
            width="66"
            height="138"
            fill="color-mix(in srgb, var(--primary) 9%, transparent)"
            stroke={accent}
            strokeWidth="1.25"
            strokeDasharray="4 4"
            initial={false}
            animate={{ opacity: active >= 2 ? 1 : 0 }}
          />
          <text
            x="240"
            y="30"
            textAnchor="middle"
            className="fill-primary text-[9px] font-bold"
          >
            next proposal
          </text>
          <motion.g
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.08 }}
          >
            {[
              [74, 205, "COMPLETE"],
              [184, 205, "PRUNED"],
              [284, 205, "FAIL"],
              [366, 205, "PENDING"],
            ].map(([x, y, text]) => (
              <g key={String(text)}>
                <rect
                  x={Number(x) - 34}
                  y={Number(y) - 14}
                  width="68"
                  height="26"
                  rx="7"
                  fill="var(--background)"
                  stroke={border}
                  strokeWidth="1.25"
                />
                <text
                  x={Number(x)}
                  y={Number(y) + 3}
                  textAnchor="middle"
                  className="fill-foreground text-[8px] font-bold"
                >
                  {text}
                </text>
              </g>
            ))}
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function SearchSpaceDesignViz() {
  const labels = [
    "Parameter마다 type 고정",
    "곱셈 scale은 log로 sampling",
    "Parent choice 뒤 child 열기",
    "실행 불가능 후보 제거",
  ] as const;
  const notes = [
    "Depth는 integer, optimizer는 category, learning rate는 positive continuous처럼 값의 의미를 먼저 고정합니다.",
    "10배 차이가 중요한 값은 log 좌표에서 같은 길이에 같은 확률을 줍니다.",
    "Momentum은 SGD를 골랐을 때만 존재합니다. 없는 값을 0으로 채우면 다른 configuration과 의미가 겹칩니다.",
    "Memory·latency·compatibility hard constraint는 평가 전에 적용하고, estimator 오차로 난 OOM은 FAIL로 남깁니다.",
  ] as const;
  return (
    <Scene
      id="search-space-design-viz"
      title="값 목록을 실행 가능한 분기 공간으로 만들기"
      description="Type·scale·condition·feasibility가 후보 하나의 의미를 만드는 순서입니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 245"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Node
            x={18}
            y={28}
            width={106}
            label="optimizer"
            detail="categorical"
            active={active === 0 || active === 2}
          />
          <Arrow
            x1={124}
            y1={54}
            x2={166}
            y2={54}
            active={active === 2}
            id="space-a"
          />
          <Node
            x={168}
            y={16}
            width={100}
            label="AdamW"
            detail="weight decay"
            active={active === 2}
          />
          <Node
            x={168}
            y={82}
            width={100}
            label="SGD"
            detail="momentum opens"
            active={active === 2}
          />
          <line
            x1="42"
            y1="182"
            x2="392"
            y2="182"
            stroke={border}
            strokeWidth="1.25"
          />
          {[42, 129, 216, 303, 390].map((x, index) => (
            <g key={x}>
              <line
                x1={x}
                y1="176"
                x2={x}
                y2="188"
                stroke={active === 1 ? accent : border}
                strokeWidth="1.25"
              />
              <text
                x={x}
                y="204"
                textAnchor="middle"
                className="fill-muted-foreground text-[8px]"
              >
                10^{index - 5}
              </text>
            </g>
          ))}
          <motion.circle
            cx="303"
            cy="182"
            r="8"
            fill={accent}
            initial={false}
            animate={{ opacity: active === 1 ? 1 : 0.08 }}
          />
          <motion.g
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.06 }}
          >
            <rect
              x="300"
              y="30"
              width="112"
              height="88"
              rx="8"
              fill="var(--background)"
              stroke={border}
              strokeWidth="1.25"
            />
            <text
              x="356"
              y="57"
              textAnchor="middle"
              className="fill-foreground text-[9px] font-bold"
            >
              batch 128
            </text>
            <text
              x="356"
              y="78"
              textAnchor="middle"
              className="fill-muted-foreground text-[8px]"
            >
              estimated 22 GB
            </text>
            <line
              x1="318"
              y1="96"
              x2="394"
              y2="52"
              stroke="var(--destructive)"
              strokeWidth="1.25"
            />
            <line
              x1="318"
              y1="52"
              x2="394"
              y2="96"
              stroke="var(--destructive)"
              strokeWidth="1.25"
            />
          </motion.g>
        </svg>
      )}
    </Scene>
  );
}

export function MultiFidelityViz() {
  const labels = [
    "같은 resource 좌표에서 비교",
    "많은 후보를 짧게 실행",
    "상위 일부에 resource 확대",
    "Finalist를 full budget 재실행",
  ] as const;
  const notes = [
    "Epoch 수가 아니라 optimizer update·processed token처럼 configuration 사이에서 비교 가능한 좌표를 정합니다.",
    "첫 rung은 많은 후보를 싼 비용으로 관측하는 예선입니다.",
    "Successive halving은 각 rung에서 살아남은 후보 수를 줄이고 후보당 resource를 늘립니다.",
    "Pruning이 고른 후보는 pruning을 끄고 full budget·여러 seed로 다시 실행해 slow-starter 편향을 확인합니다.",
  ] as const;
  const rows = [
    { y: 48, end: 1, color: muted },
    { y: 72, end: 2, color: accent },
    { y: 96, end: 1, color: muted },
    { y: 120, end: 3, color: accent },
    { y: 144, end: 1, color: muted },
    { y: 168, end: 2, color: accent },
  ];
  return (
    <Scene
      id="multi-fidelity-viz"
      title="후보 수를 줄이며 자원을 깊게 배분하기"
      description="같은 rung에서 비교하고 survivor만 다음 budget으로 보냅니다."
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
          {[102, 214, 326, 412].map((x, index) => (
            <g key={x}>
              <line
                x1={x}
                y1="28"
                x2={x}
                y2="188"
                stroke={active >= index ? accent : border}
                strokeWidth="1.25"
                strokeDasharray="3 5"
              />
              <text
                x={x}
                y="210"
                textAnchor="middle"
                className="fill-muted-foreground text-[8px]"
              >
                {["r", "3r", "9r", "full"][index]}
              </text>
            </g>
          ))}
          {rows.map((row, index) => {
            const x2 = [102, 214, 326, 412][row.end];
            return (
              <motion.g
                key={row.y}
                initial={false}
                animate={{ opacity: active >= Math.min(row.end, 2) ? 1 : 0.28 }}
              >
                <circle
                  cx="36"
                  cy={row.y}
                  r="7"
                  fill={index % 2 ? accent : muted}
                />
                <line
                  x1="44"
                  y1={row.y}
                  x2={x2}
                  y2={row.y}
                  stroke={row.color}
                  strokeWidth="1.25"
                />
                <circle cx={x2} cy={row.y} r="5" fill={row.color} />
              </motion.g>
            );
          })}
          <motion.path
            d="M214 118C250 116 282 122 326 120C360 119 384 120 412 120"
            fill="none"
            stroke={accent}
            strokeWidth="1.25"
            initial={false}
            animate={{ opacity: active === 3 ? 1 : 0.08 }}
          />
        </svg>
      )}
    </Scene>
  );
}

export function ParetoSelectionViz() {
  const labels = [
    "Hard constraint 적용",
    "지배당한 후보 제거",
    "Pareto frontier 확인",
    "반복 측정 뒤 한 후보 승인",
  ] as const;
  const notes = [
    "Memory·latency·safety 한도를 넘는 후보는 score가 좋아도 선택 집합에 들어오지 않습니다.",
    "다른 후보보다 quality·latency·memory가 모두 나쁜 후보는 별도 trade-off를 제공하지 않습니다.",
    "Frontier는 하나의 우승자가 아니라 서로 다른 장점을 가진 후보들의 경계입니다.",
    "Noise tolerance·여러 seed·outer data를 통과한 뒤 SLA와 비용을 책임지는 사람이 최종 configuration을 고릅니다.",
  ] as const;
  const points = [
    { x: 88, y: 62, id: "A" },
    { x: 145, y: 92, id: "B" },
    { x: 198, y: 126, id: "C" },
    { x: 238, y: 76, id: "D" },
    { x: 288, y: 144, id: "E" },
    { x: 342, y: 112, id: "F" },
    { x: 384, y: 156, id: "G" },
  ];
  return (
    <Scene
      id="pareto-selection-viz"
      title="여러 목적에서 선택 가능한 경계 찾기"
      description="Constraint→dominance→frontier→approval 순서로 후보를 줄입니다."
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
          <line
            x1="46"
            y1="188"
            x2="414"
            y2="188"
            stroke={border}
            strokeWidth="1.25"
          />
          <line
            x1="46"
            y1="24"
            x2="46"
            y2="188"
            stroke={border}
            strokeWidth="1.25"
          />
          <text
            x="228"
            y="216"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            latency → 낮을수록 좋음
          </text>
          <text
            x="18"
            y="108"
            textAnchor="middle"
            transform="rotate(-90 18 108)"
            className="fill-muted-foreground text-[9px]"
          >
            loss → 낮을수록 좋음
          </text>
          <motion.rect
            x="320"
            y="24"
            width="94"
            height="164"
            fill="color-mix(in srgb, var(--destructive) 8%, transparent)"
            stroke="var(--destructive)"
            strokeWidth="1.25"
            strokeDasharray="4 4"
            initial={false}
            animate={{ opacity: active === 0 ? 1 : 0.12 }}
          />
          <motion.path
            d="M88 62L145 92L198 126L288 144L384 156"
            fill="none"
            stroke={accent}
            strokeWidth="1.25"
            initial={false}
            animate={{ opacity: active >= 2 ? 1 : 0.08 }}
          />
          {points.map((point, index) => {
            const frontier = [0, 1, 2, 4, 6].includes(index);
            const approved = index === 2;
            return (
              <motion.g
                key={point.id}
                initial={false}
                animate={{
                  opacity:
                    active === 1 && !frontier
                      ? 0.18
                      : active === 3 && !approved
                        ? 0.24
                        : 1,
                }}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={approved && active === 3 ? 10 : 7}
                  fill={frontier ? accent : muted}
                />
                <text
                  x={point.x}
                  y={point.y - 12}
                  textAnchor="middle"
                  className="fill-foreground text-[8px] font-bold"
                >
                  {point.id}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </Scene>
  );
}
