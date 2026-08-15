import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

const p = "var(--primary)";
const b = "var(--border)";

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
  const controls = useAnimatedScenes(labels.length, 3200);
  return (
    <VizFrame title={title} description={description} className="my-9">
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
  w,
  label,
  sub,
  active,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  sub: string;
  active: boolean;
}) {
  return (
    <motion.g initial={false} animate={{ opacity: active ? 1 : 0.18 }}>
      <rect
        x={x}
        y={y}
        width={w}
        height="58"
        rx="8"
        fill={
          active
            ? "color-mix(in srgb, var(--primary) 8%, transparent)"
            : "var(--background)"
        }
        stroke={active ? p : b}
        strokeWidth="1.25"
      />
      <text
        x={x + w / 2}
        y={y + 23}
        textAnchor="middle"
        className="fill-foreground text-[11px] font-bold"
      >
        {label}
      </text>
      <text
        x={x + w / 2}
        y={y + 42}
        textAnchor="middle"
        className="fill-muted-foreground text-[9px]"
      >
        {sub}
      </text>
    </motion.g>
  );
}

function Link({
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
          <path
            d="M0 0L7 3.5L0 7Z"
            fill={active ? p : "var(--muted-foreground)"}
          />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? p : "var(--muted-foreground)"}
        strokeWidth="1.25"
        markerEnd={`url(#${id})`}
      />
    </g>
  );
}

export function HarnessBoundaryViz() {
  const labels = [
    "Model이 다음 action을 제안합니다",
    "Runtime이 identity와 capability를 검사합니다",
    "Executor가 effect를 만들고 receipt를 남깁니다",
    "Observation과 verifier 결과가 다음 step으로 돌아갑니다",
  ] as const;
  const notes = [
    "Model output은 proposal이지 authority나 side effect 자체가 아닙니다.",
    "Runtime은 target·identity·operation·approval을 deterministic policy로 확인합니다.",
    "External write는 stable operation key와 observable receipt를 남겨야 합니다.",
    "Harness는 typed observation과 종료 조건을 다시 model·controller에 돌려줍니다.",
  ] as const;
  return (
    <Scene
      id="harness-boundary-viz"
      title="Proposal에서 verified observation까지"
      description="Model과 runtime이 서로 다른 책임을 갖는 실행 loop입니다."
      labels={labels}
      notes={notes}
    >
      {(a) => (
        <svg
          viewBox="0 0 440 235"
          role="img"
          aria-label={labels[a]}
          className="block h-auto w-full"
        >
          <Node x={16} y={66} w={82} label="model" sub="propose" active />
          <Link x1={100} y1={95} x2={130} y2={95} active={a >= 1} id="hb1" />
          <Node
            x={134}
            y={66}
            w={86}
            label="runtime"
            sub="authorize"
            active={a >= 1}
          />
          <Link x1={222} y1={95} x2={252} y2={95} active={a >= 2} id="hb2" />
          <Node
            x={256}
            y={66}
            w={78}
            label="executor"
            sub="effect"
            active={a >= 2}
          />
          <Link x1={336} y1={95} x2={364} y2={95} active={a >= 3} id="hb3" />
          <Node
            x={368}
            y={66}
            w={58}
            label="verify"
            sub="observe"
            active={a >= 3}
          />
          <path
            d="M397 126 C397 184 57 184 57 128"
            fill="none"
            stroke={a >= 3 ? p : b}
            strokeWidth="1.25"
            strokeDasharray="5 5"
          />
        </svg>
      )}
    </Scene>
  );
}

export function RunContractViz() {
  const labels = [
    "Objective와 acceptance를 먼저 고정합니다",
    "Context path와 capability를 좁힙니다",
    "Artifact와 verifier를 연결합니다",
    "Recovery와 handoff receipt를 남깁니다",
  ] as const;
  const notes = [
    "Objective는 방향, acceptance는 완료를 관측하는 조건입니다.",
    "모든 문서·권한 대신 현재 task가 필요한 정본과 operation만 엽니다.",
    "대화 기억이 아니라 versioned artifact를 deterministic verifier에 건넵니다.",
    "Retry·rollback·escalation과 미완료 항목을 다음 session이 재현 가능하게 남깁니다.",
  ] as const;
  const cells = [
    ["objective", "done?"],
    ["context", "capability"],
    ["artifact", "verifier"],
    ["recovery", "handoff"],
  ];
  return (
    <Scene
      id="run-contract-viz"
      title="한 run을 여덟 칸 contract로 고정"
      description="계약 항목을 한꺼번에 나열하지 않고 두 칸씩 연결합니다."
      labels={labels}
      notes={notes}
    >
      {(a) => (
        <svg
          viewBox="0 0 440 250"
          role="img"
          aria-label={labels[a]}
          className="block h-auto w-full"
        >
          {cells.map((row, r) =>
            row.map((label, c) => (
              <Node
                key={label}
                x={36 + c * 196}
                y={30 + r * 52}
                w={150}
                label={label}
                sub={
                  r === 0
                    ? "intent"
                    : r === 1
                      ? "access"
                      : r === 2
                        ? "evidence"
                        : "failure"
                }
                active={r <= a}
              />
            )),
          )}
          <path d="M111 238 H326" stroke={a >= 3 ? p : b} strokeWidth="1.25" />
          <text
            x="218"
            y="232"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            versioned run receipt
          </text>
        </svg>
      )}
    </Scene>
  );
}

export function VerificationLayersViz() {
  const labels = [
    "Artifact를 deterministic checks에 넣습니다",
    "환경 oracle로 실제 state를 확인합니다",
    "Rubric judge는 모호한 품질만 평가합니다",
    "고위험 effect는 사람 승인까지 올립니다",
  ] as const;
  const notes = [
    "Compiler·test·schema처럼 명확한 판정을 가장 먼저 적용합니다.",
    "Browser·API·filesystem·metric에서 실제 배포 상태를 확인합니다.",
    "디자인·설명처럼 deterministic oracle이 약한 항목에만 versioned rubric을 씁니다.",
    "되돌리기 어려운 effect와 judge 불일치는 human checkpoint로 올립니다.",
  ] as const;
  const rows = [
    ["deterministic", "compile · test"],
    ["environment", "browser · API"],
    ["rubric", "blind judge"],
    ["human", "approve effect"],
  ];
  return (
    <Scene
      id="verification-layers-viz"
      title="확실한 검사에서 사람 승인까지"
      description="검사 비용과 불확실성이 함께 올라가는 계층입니다."
      labels={labels}
      notes={notes}
    >
      {(a) => (
        <svg
          viewBox="0 0 440 250"
          role="img"
          aria-label={labels[a]}
          className="block h-auto w-full"
        >
          {rows.map((r, i) => (
            <g key={r[0]}>
              <rect
                x={52 + i * 34}
                y={174 - i * 40}
                width={336 - i * 68}
                height="34"
                rx="7"
                fill={
                  i <= a
                    ? "color-mix(in srgb, var(--primary) 8%, transparent)"
                    : "var(--background)"
                }
                stroke={i <= a ? p : b}
                strokeWidth="1.25"
              />
              <text
                x="220"
                y={195 - i * 40}
                textAnchor="middle"
                className="fill-foreground text-[10px] font-bold"
              >
                {r[0]} · {r[1]}
              </text>
            </g>
          ))}
        </svg>
      )}
    </Scene>
  );
}

export function FailureAblationViz() {
  const labels = [
    "실패 trace를 재현 fixture로 고정합니다",
    "Failure를 contract layer에 분류합니다",
    "후보 layer 하나만 바꿉니다",
    "실패 fixture와 기존 success를 함께 비교합니다",
  ] as const;
  const notes = [
    "Input·model·tool·runtime·expected/actual state를 동일하게 재생할 수 있어야 합니다.",
    "Context miss를 reviewer 문제로, 권한 거부를 prompt 문제로 잘못 분류하지 않습니다.",
    "Model·prompt·tool을 동시에 바꾸면 개선 원인을 귀속할 수 없습니다.",
    "Target failure 회복과 기존 success 회귀·token·latency를 같은 표에서 봅니다.",
  ] as const;
  return (
    <Scene
      id="failure-ablation-viz"
      title="증상에서 한 계층의 원인으로"
      description="같은 fixture에서 한 장치만 바꾸는 ablation 흐름입니다."
      labels={labels}
      notes={notes}
    >
      {(a) => (
        <svg
          viewBox="0 0 440 235"
          role="img"
          aria-label={labels[a]}
          className="block h-auto w-full"
        >
          <Node x={18} y={68} w={84} label="trace" sub="replay" active />
          <Link x1={104} y1={97} x2={132} y2={97} active={a >= 1} id="fa1" />
          <Node
            x={136}
            y={68}
            w={80}
            label="layer"
            sub="classify"
            active={a >= 1}
          />
          <Link x1={218} y1={97} x2={246} y2={97} active={a >= 2} id="fa2" />
          <Node
            x={250}
            y={68}
            w={78}
            label="A/B"
            sub="one change"
            active={a >= 2}
          />
          <Link x1={330} y1={97} x2={356} y2={97} active={a >= 3} id="fa3" />
          <Node
            x={360}
            y={68}
            w={64}
            label="gate"
            sub="fail+success"
            active={a >= 3}
          />
        </svg>
      )}
    </Scene>
  );
}

export function ControlBoundaryViz() {
  const labels = [
    "경로가 고정된 구간은 workflow로 둡니다",
    "의미 탐색 구간은 agent loop가 고릅니다",
    "위험한 state transition 앞에 checkpoint를 둡니다",
    "Run loop와 production 개선 loop의 권한을 나눕니다",
  ] as const;
  const notes = [
    "Build·test처럼 순서와 판정이 고정된 일은 model에게 매번 묻지 않습니다.",
    "조사·디버깅처럼 다음 경로가 observation에 따라 달라지는 구간만 model이 선택합니다.",
    "Deploy·delete·payment는 diff·approval·rollback receipt 없이는 진행하지 않습니다.",
    "한 run의 feedback이 review·canary 없이 global harness를 즉시 바꾸지 못하게 합니다.",
  ] as const;
  return (
    <Scene
      id="control-boundary-viz"
      title="Workflow·agent·checkpoint의 조합"
      description="경로 불확실성과 effect 위험을 서로 다른 축으로 나눕니다."
      labels={labels}
      notes={notes}
    >
      {(a) => (
        <svg
          viewBox="0 0 440 245"
          role="img"
          aria-label={labels[a]}
          className="block h-auto w-full"
        >
          <Node x={18} y={38} w={92} label="workflow" sub="fixed path" active />
          <Node
            x={18}
            y={142}
            w={92}
            label="agent loop"
            sub="search path"
            active={a >= 1}
          />
          <Link x1={112} y1={67} x2={190} y2={101} active={a >= 2} id="cb1" />
          <Link x1={112} y1={171} x2={190} y2={121} active={a >= 2} id="cb2" />
          <Node
            x={194}
            y={80}
            w={104}
            label="checkpoint"
            sub="approve effect"
            active={a >= 2}
          />
          <Link x1={300} y1={109} x2={334} y2={109} active={a >= 3} id="cb3" />
          <Node
            x={338}
            y={80}
            w={84}
            label="canary"
            sub="change harness"
            active={a >= 3}
          />
        </svg>
      )}
    </Scene>
  );
}
