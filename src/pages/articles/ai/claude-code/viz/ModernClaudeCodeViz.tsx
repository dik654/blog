import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
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

function FlowPanel({
  label,
  detail,
  active,
  dashed = false,
}: {
  label: string;
  detail: string;
  active: boolean;
  dashed?: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0.3 }}
      className={`min-w-0 rounded-lg border bg-background px-3 py-3 text-center ${dashed ? "border-dashed" : ""}`}
      style={{ borderColor: active ? primary : border }}
    >
      <p className="break-words text-sm font-bold leading-5 text-foreground">
        {label}
      </p>
      <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
        {detail}
      </p>
    </motion.div>
  );
}

function DownArrow({ active, label }: { active: boolean; label: string }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0.25 }}
      className="flex items-center justify-center gap-2 py-1 text-center text-xs font-semibold text-primary"
    >
      <span aria-hidden>↓</span>
      <span>{label}</span>
    </motion.div>
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
    "시작 source",
    "auth rule",
    "auto memory",
    "permission",
  ] as const;
  const notes = [
    "조직의 production 승인, 사용자의 한국어, project의 pnpm test, local의 staging URL을 ordered context로 이룹니다.",
    "src/auth/token.ts에 Read가 발생해야 .claude/rules/auth.md의 auth test 규칙이 적용됩니다.",
    "‘표로 비교’는 Claude가 쓴 repository auto memory이며 첫 200줄 또는 25KB만 시작 때 load됩니다.",
    "‘production 명령은 승인받기’는 행동 지침입니다. 실제 차단은 permission·hook·sandbox에서 시행합니다.",
  ] as const;
  return (
    <LessonScene
      id="claude-memory-viz"
      title="token.ts를 열 때 instruction stack이 바뀌는 모습"
      description="Session 시작 source와 path-triggered source, 별도 runtime gate를 한 사례에서 구분합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={labels[active]} className="rounded-xl border border-border/70 bg-muted/15 p-3 sm:p-4">
          <FlowPanel
            label="Session 시작 source"
            detail="managed · user · project · local"
            active
          />
          <DownArrow active={active >= 1} label="Read src/auth/token.ts" />
          <div className="grid grid-cols-2 gap-2">
            <FlowPanel label="auth path rule" detail="Read 때 load" active={active >= 1} />
            <FlowPanel label="auto memory" detail="prefer table" active={active >= 2} />
          </div>
          <FlowPanel
            label="현재 context ≠ Bash permission"
            detail="ordered instruction과 실행 gate는 서로 다른 층"
            active={active >= 2}
            dashed={active >= 3}
          />
        </div>
      )}
    </LessonScene>
  );
}

export function SubagentHandoffViz() {
  const labels = [
    "main 상태",
    "일반 agent",
    "fork",
    "main 검증",
  ] as const;
  const notes = [
    "Main은 이미 login failure log와 src/auth/session.ts를 읽었지만 이 상태가 모든 agent에 자동 복사되지는 않습니다.",
    "Task message와 custom prompt·tools, 기본 CLAUDE.md hierarchy는 받지만 main history와 auto memory는 받지 않습니다.",
    "Fork는 system prompt·tools·model·message history를 상속해 설명 비용을 줄이는 대신 input isolation을 잃습니다.",
    "일반 subagent든 fork든 결론만 믿지 않고 main이 INC-81의 source identity와 재현 command를 다시 확인합니다.",
  ] as const;
  return (
    <LessonScene
      id="claude-subagent-viz"
      title="같은 INC-81을 일반 subagent와 fork에 맡기면"
      description="무엇이 자동으로 전달되는지와 검증 책임을 두 갈래로 비교합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={labels[active]} className="rounded-xl border border-border/70 bg-muted/15 p-3 sm:p-4">
          <FlowPanel label="Main" detail="INC-81 대화 + terminal log + session.ts" active />
          <DownArrow active={active >= 1} label="같은 조사 목표를 두 context 방식으로 전달" />
          <div className="grid grid-cols-2 gap-2">
            <FlowPanel
              label="일반 auth-reviewer"
              detail="fresh + task + CLAUDE.md"
              active={active >= 1}
            />
            <FlowPanel
              label="Fork"
              detail="main history 전체"
              active={active >= 2}
            />
          </div>
          <DownArrow active={active >= 2} label="둘 다 같은 receipt schema로 반환" />
          <FlowPanel
            label="원인 후보 + file:line + 재현 command"
            detail="Main이 원자료를 다시 읽고 검증한 뒤 반영"
            active={active >= 3}
            dashed
          />
        </div>
      )}
    </LessonScene>
  );
}

export function PermissionDecisionViz() {
  const labels = [
    "명령 분해",
    "deny match",
    "allow 충돌",
    "실행 차단",
  ] as const;
  const notes = [
    "제안은 rm -rf build && npm test 한 건이지만 rule matching은 compound command의 각 subcommand를 확인합니다.",
    "deny: Bash(rm *)가 첫 subcommand와 맞으므로 가장 높은 precedence의 결과가 정해집니다.",
    "allow: Bash(npm test *)가 둘째 subcommand와 맞아도 한 call 안의 deny match를 carve out하지 못합니다.",
    "결과는 blocked입니다. 별도의 git push call이라면 ask가 맞아 fresh user decision으로 갑니다.",
  ] as const;
  return (
    <LessonScene
      id="claude-permission-viz"
      title="rm -rf build && npm test는 왜 전체가 막히는가"
      description="Compound Bash call의 분해와 deny→ask→allow precedence를 실제 명령에 적용합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div role="img" aria-label={labels[active]} className="rounded-xl border border-border/70 bg-muted/15 p-3 sm:p-4">
          <FlowPanel label="rm -rf build && npm test" detail="Model이 제안한 Bash call 한 건" active />
          <DownArrow active={active >= 1} label="compound command를 subcommand별로 검사" />
          <div className="grid grid-cols-2 gap-2">
            <FlowPanel label="rm -rf build" detail="deny match" active={active >= 1} />
            <FlowPanel label="npm test" detail="allow match" active={active >= 2} />
          </div>
          <DownArrow active={active >= 2} label="deny → ask → allow precedence 적용" />
          <FlowPanel
            label="전체 call: BLOCKED"
            detail="allow가 겹쳐도 deny를 뒤집지 못하며 process는 시작되지 않음"
            active={active >= 3}
            dashed
          />
        </div>
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
