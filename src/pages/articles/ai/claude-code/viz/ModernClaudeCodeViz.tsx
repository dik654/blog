import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

const primary = "var(--primary)";
const border = "var(--border)";

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
        height="58"
        rx="8"
        fill={
          active
            ? "color-mix(in srgb, var(--primary) 8%, transparent)"
            : "var(--background)"
        }
        stroke={active ? primary : border}
        strokeWidth="1.25"
      />
      <text
        x={x + width / 2}
        y={y + 23}
        textAnchor="middle"
        className="fill-foreground text-[11px] font-bold"
      >
        {label}
      </text>
      <text
        x={x + width / 2}
        y={y + 42}
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
    <g opacity={active ? 1 : 0.2}>
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
            fill={active ? primary : "var(--muted-foreground)"}
          />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? primary : "var(--muted-foreground)"}
        strokeWidth="1.25"
        markerEnd={`url(#${id})`}
      />
    </g>
  );
}

export function WorkspaceHarnessViz() {
  const labels = [
    "Prompt가 workspace task를 시작합니다",
    "Model이 필요한 context와 action을 고릅니다",
    "Runtime이 tool을 실행해 workspace를 바꿉니다",
    "Test와 observation이 다음 판단으로 돌아갑니다",
  ] as const;
  const notes = [
    "Task에는 목표뿐 아니라 확인할 결과와 위험한 effect 경계가 필요합니다.",
    "Model은 다음 행동을 제안하지만 file·process를 직접 바꾸는 authority는 아닙니다.",
    "Claude Code harness가 permission을 적용하고 tool result를 observable state로 만듭니다.",
    "검증 결과가 다시 loop에 들어가며 완료·수정·중단을 결정합니다.",
  ] as const;
  return (
    <LessonScene
      id="claude-workspace-viz"
      title="Prompt에서 verified workspace까지"
      description="Model과 Claude Code harness의 역할을 분리한 한 작업 loop입니다."
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
          <Box x={16} y={72} width={76} label="prompt" detail="task" active />
          <Arrow
            x1={94}
            y1={101}
            x2={124}
            y2={101}
            active={active >= 1}
            id="cw1"
          />
          <Box
            x={128}
            y={72}
            width={82}
            label="model"
            detail="decide"
            active={active >= 1}
          />
          <Arrow
            x1={212}
            y1={101}
            x2={242}
            y2={101}
            active={active >= 2}
            id="cw2"
          />
          <Box
            x={246}
            y={72}
            width={84}
            label="runtime"
            detail="act"
            active={active >= 2}
          />
          <Arrow
            x1={332}
            y1={101}
            x2={360}
            y2={101}
            active={active >= 3}
            id="cw3"
          />
          <Box
            x={364}
            y={72}
            width={62}
            label="verify"
            detail="observe"
            active={active >= 3}
          />
          <path
            d="M395 132 C395 188 169 188 169 132"
            fill="none"
            stroke={active >= 3 ? primary : border}
            strokeWidth="1.25"
            strokeDasharray="5 5"
          />
        </svg>
      )}
    </LessonScene>
  );
}

export function InstructionMemoryViz() {
  const labels = [
    "Managed·user·project instruction을 순서대로 읽습니다",
    "Nested rule은 관련 file을 열 때 추가됩니다",
    "Auto memory는 repository별 학습을 보탭니다",
    "합쳐진 context는 instruction이지 permission이 아닙니다",
  ] as const;
  const notes = [
    "각 source는 작성자·scope·load 시점이 다른 context 조각입니다.",
    "아직 방문하지 않은 subtree의 rule을 전부 처음부터 싣지 않고 필요할 때 발견합니다.",
    "Auto memory는 Claude가 쓴 note이며 사용자가 쓴 CLAUDE.md와 owner가 다릅니다.",
    "어떤 문장을 읽었다는 사실만으로 file·shell·network 권한이 생기지 않습니다.",
  ] as const;
  const rows = [
    ["managed", "organization"],
    ["user", "personal"],
    ["project", "repository"],
    ["nested", "path lazy"],
    ["memory", "repo notes"],
  ] as const;
  return (
    <LessonScene
      id="claude-memory-viz"
      title="Instruction source가 context가 되는 순서"
      description="Scope와 load 시점을 분리해 한 stack으로 합칩니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 300"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          {rows.map(([label, detail], index) => (
            <Box
              key={label}
              x={28}
              y={18 + index * 52}
              width={132}
              label={label}
              detail={detail}
              active={index <= active + 1}
            />
          ))}
          <Arrow
            x1={166}
            y1={146}
            x2={238}
            y2={146}
            active={active >= 1}
            id="cm1"
          />
          <Box
            x={244}
            y={86}
            width={164}
            label="current context"
            detail="ordered evidence"
            active={active >= 1}
          />
          <Box
            x={244}
            y={174}
            width={164}
            label="runtime gate"
            detail="separate authority"
            active={active >= 3}
          />
          <Arrow
            x1={326}
            y1={146}
            x2={326}
            y2={170}
            active={active >= 3}
            id="cm2"
          />
        </svg>
      )}
    </LessonScene>
  );
}

export function SubagentHandoffViz() {
  const labels = [
    "Main이 objective와 input snapshot을 고정합니다",
    "Subagent는 별도 context와 좁은 tool scope에서 조사합니다",
    "Summary와 source receipt를 main에 반환합니다",
    "Main이 원자료를 다시 검증한 뒤에만 반영합니다",
  ] as const;
  const notes = [
    "‘조사해 줘’ 대신 file 범위·질문·금지 action·출력 schema를 적습니다.",
    "별도 context는 집중을 돕지만 부모 대화의 모든 사실을 자동 상속하지 않습니다.",
    "자유로운 완료 문장보다 file/line·command·uncertainty가 있는 artifact를 반환합니다.",
    "Subagent 수가 늘어도 사실성이나 safe merge가 자동 보장되지는 않습니다.",
  ] as const;
  return (
    <LessonScene
      id="claude-subagent-viz"
      title="Main과 subagent 사이의 검증 가능한 handoff"
      description="입력 snapshot과 반환 artifact의 owner를 도형으로 분리합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 250"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Box
            x={18}
            y={86}
            width={88}
            label="main"
            detail="owns write"
            active
          />
          <Arrow
            x1={108}
            y1={104}
            x2={174}
            y2={64}
            active={active >= 1}
            id="cs1"
          />
          <Box
            x={180}
            y={24}
            width={100}
            label="subagent"
            detail="read-only"
            active={active >= 1}
          />
          <Arrow
            x1={280}
            y1={65}
            x2={348}
            y2={104}
            active={active >= 2}
            id="cs2"
          />
          <Box
            x={352}
            y={86}
            width={72}
            label="receipt"
            detail="sources"
            active={active >= 2}
          />
          <path
            d="M388 146 C388 206 63 206 63 146"
            fill="none"
            stroke={active >= 3 ? primary : border}
            strokeWidth="1.25"
            strokeDasharray="5 5"
          />
          <text
            x="222"
            y="208"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            main re-reads · verifies · merges
          </text>
        </svg>
      )}
    </LessonScene>
  );
}

export function PermissionDecisionViz() {
  const labels = [
    "Model이 concrete tool call을 제안합니다",
    "Matching deny를 가장 먼저 확인합니다",
    "Ask가 맞으면 사용자 decision을 기다립니다",
    "Allow와 blocking hook을 모두 통과해야 실행합니다",
  ] as const;
  const notes = [
    "Registry와 schema는 제안 가능한 action shape이지 실행 허가가 아닙니다.",
    "넓은 deny는 더 구체적인 allow가 자동으로 뒤집지 못하므로 overlap을 설계해야 합니다.",
    "Approval은 현재 caller·target·operation에 binding된 fresh decision이어야 합니다.",
    "Permission allow 뒤에도 PreToolUse hook가 block할 수 있고 silent hook은 approve가 아닙니다.",
  ] as const;
  return (
    <LessonScene
      id="claude-permission-viz"
      title="Tool proposal이 execution이 되는 판정 순서"
      description="Deny·ask·allow와 hook을 한 decision path로 봅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 270"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Box
            x={154}
            y={12}
            width={132}
            label="tool proposal"
            detail="name + input"
            active
          />
          <Arrow
            x1={220}
            y1={72}
            x2={220}
            y2={94}
            active={active >= 1}
            id="cp1"
          />
          <Box
            x={154}
            y={98}
            width={132}
            label="deny?"
            detail="first match"
            active={active >= 1}
          />
          <Arrow
            x1={286}
            y1={127}
            x2={340}
            y2={127}
            active={active >= 1}
            id="cp2"
          />
          <Box
            x={344}
            y={98}
            width={72}
            label="stop"
            detail="blocked"
            active={active >= 1}
          />
          <Arrow
            x1={220}
            y1={158}
            x2={220}
            y2={178}
            active={active >= 2}
            id="cp3"
          />
          <Box
            x={62}
            y={182}
            width={104}
            label="ask"
            detail="fresh approval"
            active={active >= 2}
          />
          <Box
            x={274}
            y={182}
            width={104}
            label="allow + hook"
            detail="then execute"
            active={active >= 3}
          />
          <Arrow
            x1={168}
            y1={211}
            x2={270}
            y2={211}
            active={active >= 3}
            id="cp4"
          />
        </svg>
      )}
    </LessonScene>
  );
}

export function HookLifecycleViz() {
  const labels = [
    "Lifecycle event가 발생합니다",
    "Matcher와 optional if가 대상을 좁힙니다",
    "Command·HTTP·prompt·agent handler가 실행됩니다",
    "Decision·context·audit output을 runtime이 해석합니다",
  ] as const;
  const notes = [
    "Session·turn·tool call마다 event cadence가 다르므로 먼저 시점을 고릅니다.",
    "Matcher는 tool이나 event field를 고르고 if는 concrete argument까지 좁힐 수 있습니다.",
    "Handler는 신뢰 경계 안의 사용자 code이므로 timeout·secret·failure mode를 정해야 합니다.",
    "Exit 0과 무출력은 ‘결정 없음’이지 permission approve가 아닙니다.",
  ] as const;
  return (
    <LessonScene
      id="claude-hook-viz"
      title="Event에서 runtime decision까지"
      description="Hook을 callback 이름이 아니라 typed lifecycle pipeline으로 읽습니다."
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
          <Box x={18} y={74} width={78} label="event" detail="when" active />
          <Arrow
            x1={98}
            y1={103}
            x2={128}
            y2={103}
            active={active >= 1}
            id="ch1"
          />
          <Box
            x={132}
            y={74}
            width={82}
            label="matcher"
            detail="which"
            active={active >= 1}
          />
          <Arrow
            x1={216}
            y1={103}
            x2={246}
            y2={103}
            active={active >= 2}
            id="ch2"
          />
          <Box
            x={250}
            y={74}
            width={82}
            label="handler"
            detail="how"
            active={active >= 2}
          />
          <Arrow
            x1={334}
            y1={103}
            x2={362}
            y2={103}
            active={active >= 3}
            id="ch3"
          />
          <Box
            x={366}
            y={74}
            width={58}
            label="output"
            detail="decision"
            active={active >= 3}
          />
        </svg>
      )}
    </LessonScene>
  );
}

export function CheckpointBoundaryViz() {
  const labels = [
    "Direct file edit 전에 snapshot을 남깁니다",
    "Rewind는 추적된 file content를 복원합니다",
    "Bash·subagent·manual edit는 별도 receipt가 필요합니다",
    "Database·API·deploy effect는 독립 rollback을 사용합니다",
  ] as const;
  const notes = [
    "Checkpoint는 같은 session의 file edit 복구를 빠르게 만드는 제품 기능입니다.",
    "Conversation과 file snapshot을 되돌릴 수 있지만 Git history 전체를 대신하지 않습니다.",
    "누가 어떤 경로를 썼는지에 따라 snapshot coverage가 달라지므로 작은 복구 시험이 필요합니다.",
    "Remote state는 transaction·operation ID·status lookup·compensation 같은 해당 시스템 수단으로 복구합니다.",
  ] as const;
  return (
    <LessonScene
      id="claude-checkpoint-viz"
      title="Checkpoint 안과 밖의 effect"
      description="복구 가능한 file snapshot과 외부 side effect를 경계선으로 나눕니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 440 280"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <rect
            x="24"
            y="24"
            width="250"
            height="226"
            rx="10"
            fill="none"
            stroke={active >= 1 ? primary : border}
            strokeWidth="1.25"
          />
          <text x="42" y="49" className="fill-foreground text-[10px] font-bold">
            checkpoint coverage
          </text>
          <Box
            x={52}
            y={72}
            width={190}
            label="direct file edit"
            detail="snapshot before change"
            active
          />
          <Box
            x={52}
            y={160}
            width={190}
            label="rewind"
            detail="restore tracked content"
            active={active >= 1}
          />
          <Arrow
            x1={147}
            y1={132}
            x2={147}
            y2={156}
            active={active >= 1}
            id="cc1"
          />
          <rect
            x="302"
            y="24"
            width="114"
            height="226"
            rx="10"
            fill="none"
            stroke={active >= 2 ? primary : border}
            strokeWidth="1.25"
            strokeDasharray="5 5"
          />
          <text
            x="359"
            y="49"
            textAnchor="middle"
            className="fill-foreground text-[10px] font-bold"
          >
            outside
          </text>
          <text
            x="359"
            y="89"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            Bash files
          </text>
          <text
            x="359"
            y="123"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            subagent edits
          </text>
          <text
            x="359"
            y="157"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            database · API
          </text>
          <text
            x="359"
            y="191"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            deploy · message
          </text>
          <text
            x="359"
            y="225"
            textAnchor="middle"
            className="fill-primary text-[9px] font-bold"
            opacity={active >= 3 ? 1 : 0.2}
          >
            own rollback
          </text>
        </svg>
      )}
    </LessonScene>
  );
}
