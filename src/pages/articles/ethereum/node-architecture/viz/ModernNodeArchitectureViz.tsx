import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

type NodeId =
  | "network"
  | "execution-network"
  | "consensus"
  | "engine"
  | "execution"
  | "service"
  | "beacon-service"
  | "consensus-store"
  | "execution-store";

type EdgeId = "receive" | "request" | "response" | "publish";

type Scene = {
  label: string;
  title: string;
  summary: string;
  status: string;
  mobileStatus: string;
  consensusInput: string;
  executionInput: string;
  consensusStore: string;
  executionStore: string;
  engineAction: string;
  mobileEngineAction: string;
  activeNodes: readonly NodeId[];
  activeEdges: readonly EdgeId[];
  motionPath: readonly NodeId[];
  timeline: readonly [string, string, string];
};

type MapToken = {
  id: string;
  label: string;
  mobileLabel?: string;
  tone: "work" | "result" | "choice";
  desktop: readonly (readonly [number, number])[];
  mobile: readonly (readonly [number, number])[];
  delay?: number;
};

type NodeMapScene = {
  label: string;
  question: string;
  conclusion: string;
  clCandidate: string;
  clHead: "parent" | "candidate";
  elHead: "parent" | "candidate";
  elCandidate: string;
  laneRequest: string;
  laneResponse: string;
  tokens: readonly MapToken[];
};

const nodeMapScenes = [
  {
    label: "전체 지도",
    question: "한 노드 안에서 누가 계산하고 누가 기록을 선택할까요?",
    conclusion: "CL은 기록을 선택하고 EL은 거래를 계산합니다. 두 프로그램은 Engine API로만 판단을 주고받고 각자 상태를 저장합니다.",
    clCandidate: "후보 대기",
    clHead: "parent",
    elHead: "parent",
    elCandidate: "아직 없음",
    laneRequest: "실행 요청 →",
    laneResponse: "← 실행 판정",
    tokens: [],
  },
  {
    label: "송금 접수",
    question: "지갑이 보낸 송금은 어느 쪽으로 들어갈까요?",
    conclusion: "송금은 JSON-RPC를 통해 EL에 들어오고 실행 P2P로 전파됩니다. 접수만으로 확정된 계정 잔액이 바뀌지는 않습니다.",
    clCandidate: "후보 대기",
    clHead: "parent",
    elHead: "parent",
    elCandidate: "송금 대기 · 이전 잔액 유지",
    laneRequest: "실행 요청 →",
    laneResponse: "← 실행 판정",
    tokens: [
      { id: "transaction", label: "송금 · 10 ETH", tone: "work", desktop: [[84, 96], [84, 38], [84, 5]], mobile: [[78, 96], [30, 67], [25, 94]] },
    ],
  },
  {
    label: "후보 수신",
    question: "송금이 든 새 블록 후보는 어느 쪽으로 들어올까요?",
    conclusion: "새 블록 후보는 합의 P2P를 통해 CL에 들어옵니다. CL은 후보와 투표를 받지만 거래 결과를 직접 계산하지 않습니다.",
    clCandidate: "새 후보 · 판정 전",
    clHead: "parent",
    elHead: "parent",
    elCandidate: "아직 없음",
    laneRequest: "다음: 후보 실행 요청 →",
    laneResponse: "← 실행 판정",
    tokens: [
      { id: "candidate", label: "새 후보 · 송금 포함", mobileLabel: "새 후보", tone: "work", desktop: [[16, 5], [16, 38]], mobile: [[25, 4], [30, 23]] },
    ],
  },
  {
    label: "실행 계산",
    question: "새 후보의 잔액 결과는 누가 확인할까요?",
    conclusion: "CL이 새 후보를 EL로 보내면 EL은 부모 블록 상태에서 송금을 실행합니다. A는 89.999958 ETH, B는 10 ETH가 됩니다.",
    clCandidate: "새 후보 · 계산 요청",
    clHead: "parent",
    elHead: "parent",
    elCandidate: "A 89.999958 · B 10",
    laneRequest: "newPayload(후보) →",
    laneResponse: "← 결과 대기",
    tokens: [
      { id: "candidate", label: "새 후보", tone: "work", desktop: [[27, 38], [50, 38], [68, 38]], mobile: [[30, 38], [50, 43], [30, 59]] },
      { id: "delta", label: "−10 −0.000042 / +10", mobileLabel: "잔액 계산", tone: "choice", desktop: [[84, 49], [84, 54]], mobile: [[78, 58], [78, 59]], delay: 1.5 },
    ],
  },
  {
    label: "실행 판정",
    question: "VALID는 무엇이 끝났다는 뜻일까요?",
    conclusion: "VALID는 EL이 새 후보의 실행 결과를 재현했다는 뜻입니다. 이때 CL과 EL의 head는 아직 부모 블록에 머뭅니다.",
    clCandidate: "새 후보 · VALID",
    clHead: "parent",
    elHead: "parent",
    elCandidate: "VALID · A 89.999958 · B 10",
    laneRequest: "newPayload(후보) →",
    laneResponse: "← VALID · 후보 해시",
    tokens: [
      { id: "VALID", label: "VALID · 후보 해시", mobileLabel: "VALID", tone: "result", desktop: [[68, 44], [50, 44], [32, 44]], mobile: [[30, 59], [50, 56], [30, 38]] },
    ],
  },
  {
    label: "기록 선택",
    question: "계산이 맞는 후보 가운데 어느 기록을 따를지는 누가 정할까요?",
    conclusion: "CL은 투표를 반영해 새 후보를 head로 바꾸고 EL에 선택 결과를 알립니다. safe와 finalized는 더 앞선 조상을 가리킬 수 있습니다.",
    clCandidate: "새 후보 · VALID · 투표 반영",
    clHead: "candidate",
    elHead: "candidate",
    elCandidate: "VALID · A 89.999958 · B 10",
    laneRequest: "forkchoiceUpdated(새 head) →",
    laneResponse: "← 선택 반영",
    tokens: [
      { id: "votes", label: "새 후보 지지 투표", mobileLabel: "지지 투표", tone: "choice", desktop: [[16, 5], [16, 34]], mobile: [[25, 4], [30, 23]] },
      { id: "choice", label: "새 후보를 head로 선택", mobileLabel: "새 head", tone: "result", desktop: [[32, 42], [50, 42], [68, 42]], mobile: [[30, 38], [50, 43], [30, 59]], delay: 1.2 },
    ],
  },
  {
    label: "남은 상태",
    question: "처리가 끝난 뒤 노드에는 어떤 두 상태가 남을까요?",
    conclusion: "CL은 head·safe·finalized를 결정하고 EL은 전달받은 포인터와 새 후보의 실행 결과를 저장합니다. 잔액과 기록 선택은 서로 다른 API에서 조회합니다.",
    clCandidate: "head 새 후보 · safe·finalized는 조상",
    clHead: "candidate",
    elHead: "candidate",
    elCandidate: "A 89.999958 · B 10 · VALID",
    laneRequest: "선택 상태 →",
    laneResponse: "← 실행 상태",
    tokens: [
      { id: "choice-query", label: "head · safe · finalized", mobileLabel: "선택 상태", tone: "choice", desktop: [[16, 67], [16, 96]], mobile: [[78, 28], [78, 4]] },
      { id: "balance-query", label: "A 89.999958 · B 10", tone: "result", desktop: [[84, 67], [84, 96]], mobile: [[78, 70], [78, 96]], delay: 0.35 },
    ],
  },
] as const satisfies readonly NodeMapScene[];

const scenes = [
  {
    label: "전체 구조",
    title: "두 프로그램은 판단을 나눠 맡고 호출 결과로 상태를 맞춥니다",
    summary:
      "합의 클라이언트는 어느 기록을 따를지 판단하고, 실행 클라이언트는 거래를 계산합니다. 저장소와 외부 API도 각 책임을 따라 나뉩니다.",
    status: "새 블록 후보를 처리하기 전",
    mobileStatus: "후보 처리 전",
    consensusInput: "후보·투표 입력 대기",
    executionInput: "블록·거래·조회 요청 대기",
    consensusStore: "head · safe · finalized 관리",
    executionStore: "후보 실행 결과 없음",
    engineAction: "요청 →\n← 응답",
    mobileEngineAction: "요청 →\n← 응답",
    activeNodes: ["network", "execution-network", "consensus", "engine", "execution", "service", "beacon-service", "consensus-store", "execution-store"],
    activeEdges: [],
    motionPath: [],
    timeline: ["후보 입력 대기", "판단 책임 분리", "상태 별도 보관"],
  },
  {
    label: "후보 수신",
    title: "네트워크에서 새 블록 후보가 들어옵니다",
    summary:
      "합의 클라이언트는 후보의 제안과 투표 정보를 받습니다. 거래 계산은 직접 하지 않고 실행 클라이언트에 새 후보의 실행 내용을 검증해 달라고 요청합니다.",
    status: "새 후보 접수 · 실행 결과는 미정",
    mobileStatus: "후보 접수 · 미검증",
    consensusInput: "실행 블록을 담은 새 후보 수신",
    executionInput: "새 실행 입력 없음",
    consensusStore: "새 후보 접수 · 기존 head 유지",
    executionStore: "새 후보 미검증",
    engineAction: "다음 요청\nnewPayload",
    mobileEngineAction: "다음 요청\n후보",
    activeNodes: ["network", "consensus", "consensus-store"],
    activeEdges: ["receive"],
    motionPath: ["network", "consensus", "consensus-store"],
    timeline: ["새 후보 수신", "CL에 기록", "실행 검증 준비"],
  },
  {
    label: "자료 부족",
    title: "부모 블록이 없으면 틀렸다고 단정하지 않습니다",
    summary:
      "실행 클라이언트는 부모 블록 상태가 없어 잔액을 재현할 수 없습니다. SYNCING은 잘못된 후보가 아니라 아직 판단할 자료가 부족하다는 응답입니다.",
    status: "newPayload(후보) → SYNCING",
    mobileStatus: "SYNCING · 자료 대기",
    consensusInput: "추가 합의 입력 없음",
    executionInput: "부모 블록 미수신",
    consensusStore: "새 후보 보류 · 기존 head 유지",
    executionStore: "부모 상태 없음 · SYNCING",
    engineAction: "newPayload\n후보 →\n← SYNCING",
    mobileEngineAction: "후보 →\n← SYNCING",
    activeNodes: ["consensus", "engine", "execution", "consensus-store", "execution-store"],
    activeEdges: ["request", "response"],
    motionPath: ["consensus", "engine", "execution", "execution-store"],
    timeline: ["newPayload 후보", "부모 없음", "SYNCING 응답"],
  },
  {
    label: "검증 성공",
    title: "부모 상태를 얻으면 같은 후보를 다시 계산합니다",
    summary:
      "A의 100 ETH에서 송금 10 ETH와 처리 비용 0.000042 ETH를 빼 89.999958 ETH를 재현합니다. VALID는 계산이 맞다는 뜻이지 현재 head라는 뜻은 아닙니다.",
    status: "VALID · latestValidHash=후보 블록 해시",
    mobileStatus: "VALID · 후보 해시",
    consensusInput: "추가 합의 입력 없음",
    executionInput: "실행 P2P에서 부모 블록 수신",
    consensusStore: "후보 VALID · 기존 head 유지",
    executionStore: "부모 확보 · 후보 VALID",
    engineAction: "newPayload\n후보 →\n← VALID",
    mobileEngineAction: "후보 →\n← VALID",
    activeNodes: ["execution-network", "consensus", "engine", "execution", "consensus-store", "execution-store"],
    activeEdges: ["request", "response"],
    motionPath: ["execution-network", "execution", "engine", "consensus", "execution-store", "consensus-store"],
    timeline: ["부모 수신", "후보 다시 계산", "VALID 응답"],
  },
  {
    label: "가지 선택",
    title: "계산이 맞는 후보 가운데 지금 따를 기록을 따로 고릅니다",
    summary:
      "합의 클라이언트가 새 후보를 head로 고르면 head, safe, finalized의 블록 해시를 별도 값으로 전달합니다. 세 값은 같은 속도로 움직이지 않습니다.",
    status: "forkchoiceUpdated · head / safe / finalized",
    mobileStatus: "head · safe · finalized",
    consensusInput: "새 후보 선택을 지지한 투표 수신",
    executionInput: "새 실행 입력 없음",
    consensusStore: "새 후보가 head · 조상에 safe·finalized",
    executionStore: "후보 VALID · 새 head 반영",
    engineAction: "forkchoiceUpdated\nhead / safe / finalized",
    mobileEngineAction: "가지 선택\nhead / safe / final",
    activeNodes: ["consensus", "engine", "execution", "consensus-store", "execution-store", "service", "beacon-service"],
    activeEdges: ["request", "response", "publish"],
    motionPath: ["network", "consensus", "engine", "execution", "execution-store", "consensus-store"],
    timeline: ["투표 반영", "forkchoiceUpdated", "새 head 반영"],
  },
  {
    label: "재수신",
    title: "같은 후보가 다시 오면 저장 상태를 먼저 확인합니다",
    summary:
      "두 프로그램은 블록 식별자와 현재 저장 상태를 확인합니다. 실제 재실행·결과 재사용 방식은 구현과 요청 상태에 따라 달라지므로 이 지도에서는 단정하지 않습니다.",
    status: "이미 본 후보 · 저장 상태 확인",
    mobileStatus: "재수신 · 상태 확인",
    consensusInput: "같은 후보 재수신",
    executionInput: "같은 후보 재요청",
    consensusStore: "현재 head · 변경 없음",
    executionStore: "기존 검증·선택 상태 확인",
    engineAction: "후보 재요청\n← 현재 상태 응답",
    mobileEngineAction: "후보 재요청\n← 상태 응답",
    activeNodes: ["network", "consensus", "engine", "execution", "service", "beacon-service"],
    activeEdges: ["receive", "request", "response", "publish"],
    motionPath: ["network", "consensus", "engine", "execution"],
    timeline: ["후보 재수신", "저장 상태 조회", "현재 상태 응답"],
  },
] as const satisfies readonly Scene[];

function ArchitectureNode({
  id,
  active,
  eyebrow,
  title,
  children,
  className = "",
  motionOrder = -1,
}: {
  id: NodeId;
  active: boolean;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
  motionOrder?: number;
}) {
  return (
    <div
      data-architecture-node={id}
      data-process-node={motionOrder >= 0 ? "true" : undefined}
      style={motionOrder >= 0 ? ({ "--process-order": motionOrder } as CSSProperties) : undefined}
      className={`min-w-0 border p-3 transition-colors duration-300 ${className} ${
        active ? "border-primary bg-primary/[0.055]" : "border-border bg-background"
      }`}
    >
      <div className="text-[11px] font-semibold leading-4 text-muted-foreground">{eyebrow}</div>
      <h4 className="mt-1 text-sm font-bold leading-5">{title}</h4>
      <div className="mt-3 text-xs leading-5 text-muted-foreground">{children}</div>
    </div>
  );
}
function ProgramBox({
  id,
  active,
  title,
  role,
  modules,
  motionOrder = -1,
}: {
  id: "consensus" | "execution";
  active: boolean;
  title: string;
  role: string;
  modules: readonly string[];
  motionOrder?: number;
}) {
  return (
    <div
      data-architecture-node={id}
      data-process-node={motionOrder >= 0 ? "true" : undefined}
      style={motionOrder >= 0 ? ({ "--process-order": motionOrder } as CSSProperties) : undefined}
      className={`min-w-0 border p-4 transition-colors duration-300 ${
        active ? "border-primary bg-primary/[0.055]" : "border-border bg-background"
      }`}
    >
      <div className="text-[11px] font-semibold leading-4 text-muted-foreground lg:hidden">독립 실행 프로그램</div>
      <h4 className="mt-1 text-sm font-bold leading-5 lg:mt-0">{title}</h4>
      <div className="mt-1 text-xs leading-5 text-muted-foreground lg:hidden">{role}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {modules.map((module) => (
          <div key={module} className="border-t border-border pt-2 text-xs font-medium leading-5">
            {module}
          </div>
        ))}
      </div>
    </div>
  );
}
function CompactNode({
  id,
  active,
  eyebrow,
  title,
  motionOrder = -1,
}: {
  id: NodeId;
  active: boolean;
  eyebrow: string;
  title: string;
  motionOrder?: number;
}) {
  return (
    <div
      data-architecture-node={id}
      data-process-node={motionOrder >= 0 ? "true" : undefined}
      style={motionOrder >= 0 ? ({ "--process-order": motionOrder } as CSSProperties) : undefined}
      className={`min-h-[4.5rem] min-w-0 border px-3 py-2 transition-colors duration-300 ${
        active ? "border-primary bg-primary/[0.055]" : "border-border bg-background"
      }`}
    >
      <div className="text-[10px] font-semibold leading-4 text-muted-foreground">{eyebrow}</div>
      <div className="mt-1 text-[11px] font-bold leading-4">{title}</div>
    </div>
  );
}

function MobileProgramBox({
  id,
  active,
  title,
  role,
  motionOrder = -1,
}: {
  id: "consensus" | "execution";
  active: boolean;
  title: string;
  role: string;
  motionOrder?: number;
}) {
  return (
    <div
      data-architecture-node={id}
      data-process-node={motionOrder >= 0 ? "true" : undefined}
      style={motionOrder >= 0 ? ({ "--process-order": motionOrder } as CSSProperties) : undefined}
      className={`flex min-h-[7.25rem] min-w-0 flex-col justify-center border px-2 py-3 text-center transition-colors duration-300 ${
        active ? "border-primary bg-primary/[0.055]" : "border-border bg-background"
      }`}
    >
      <div className="text-[10px] font-semibold leading-4 text-muted-foreground">실행 프로그램</div>
      <div className="mt-1 text-xs font-bold leading-4">{title}</div>
      <div className="mt-2 text-[10px] leading-4 text-muted-foreground">{role}</div>
    </div>
  );
}

function EngineMotion({ active }: { active: boolean }) {
  return (
    <div data-engine-motion={active ? "active" : "idle"} className="mt-2 grid gap-1" aria-hidden="true">
      <span className="relative block h-px bg-border">
        <span className="engine-request-dot absolute -top-[2px] left-0 h-[5px] w-[5px] rounded-full bg-primary" />
      </span>
      <span className="relative block h-px bg-border">
        <span className="engine-response-dot absolute -top-[2px] right-0 h-[5px] w-[5px] rounded-full bg-primary" />
      </span>
    </div>
  );
}

function SceneSequence({ steps }: { steps: readonly [string, string, string] }) {
  return (
    <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5" aria-label={`처리 순서: ${steps.join(", ")}`}>
      {steps.map((step, index) => (
        <div key={step} className="contents">
          <div
            data-sequence-step="true"
            style={{ "--sequence-order": index } as CSSProperties}
            className="flex min-h-9 min-w-0 items-center justify-center border border-border bg-background px-1.5 py-1 text-center text-[9px] font-bold leading-4 sm:text-[10px]"
          >
            {step}
          </div>
          {index < steps.length - 1 ? <span className="text-[10px] text-muted-foreground" aria-hidden="true">→</span> : null}
        </div>
      ))}
    </div>
  );
}

function MapNode({
  id,
  eyebrow,
  title,
  detail,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  detail: string;
  className: string;
}) {
  return (
    <div
      data-node-id={id}
      className={`absolute z-10 flex min-w-0 flex-col justify-center border border-border bg-background px-3 py-2 ${className}`}
    >
      <div className="text-[10px] font-semibold leading-4 text-muted-foreground">{eyebrow}</div>
      <div className="mt-0.5 text-xs font-bold leading-4 sm:text-sm sm:leading-5">{title}</div>
      <div className="mt-1 text-[10px] leading-4 text-muted-foreground sm:text-[11px]">{detail}</div>
    </div>
  );
}

function TraceToken({
  token,
  mobile,
  reducedMotion,
  sceneId,
}: {
  token: MapToken;
  mobile: boolean;
  reducedMotion: boolean;
  sceneId: number;
}) {
  const path = mobile ? token.mobile : token.desktop;
  const final = path[path.length - 1];
  const positions = reducedMotion ? [final] : path;
  const duration = reducedMotion ? 0 : Math.max(1.4, path.length * 0.75);
  const movement = reducedMotion
    ? { duration: 0 }
    : {
        duration,
        delay: token.delay ?? 0,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatDelay: 1.25,
      };
  const tone = token.tone === "result"
    ? "border-emerald-700 bg-emerald-700 text-white"
    : token.tone === "choice"
      ? "border-amber-700 bg-amber-50 text-amber-950"
      : "border-foreground bg-foreground text-background";

  return (
    <motion.div
      key={`${sceneId}-${token.id}-${mobile ? "mobile" : "desktop"}`}
      data-token={token.id}
      initial={{ left: `${positions[0][0]}%`, top: `${positions[0][1]}%`, opacity: reducedMotion ? 1 : 0 }}
      animate={{
        left: positions.map(([x]) => `${x}%`),
        top: positions.map(([, y]) => `${y}%`),
        opacity: 1,
      }}
      transition={{
        left: movement,
        top: movement,
        opacity: { duration: reducedMotion ? 0 : 0.18, delay: token.delay ?? 0 },
      }}
      className={`pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border px-2 py-1 text-[9px] font-bold shadow-sm sm:text-[10px] ${tone}`}
    >
      {mobile && token.mobileLabel ? token.mobileLabel : token.label}
    </motion.div>
  );
}

function ChainState({ head, compact = false }: { head: NodeMapScene["clHead"]; compact?: boolean }) {
  if (compact) {
    return (
      <div data-slot="consensus-state" className="mt-2 text-[10px] font-semibold leading-4">
        <div>head · {head === "candidate" ? "새 후보" : "부모"}</div>
        <div className="text-muted-foreground">safe · finalized · 조상</div>
      </div>
    );
  }

  return (
    <div data-slot="consensus-state" className="mt-1.5">
      <div className={`grid grid-cols-4 gap-0.5 ${compact ? "text-[8px]" : "text-[9px]"}`}>
        {(["확정", "안전", "부모", "후보"] as const).map((block) => (
          <span key={block} className="border border-border bg-muted/30 py-0.5 text-center font-semibold">{block}</span>
        ))}
      </div>
      <div className={`mt-1 grid grid-cols-4 gap-0.5 text-center font-semibold text-muted-foreground ${compact ? "text-[7px]" : "text-[8px]"}`}>
        <span>final</span><span>safe</span><span>{head === "parent" ? "head" : ""}</span><span>{head === "candidate" ? "head" : ""}</span>
      </div>
    </div>
  );
}

function ExecutionState({ scene, compact = false }: { scene: NodeMapScene; compact?: boolean }) {
  if (compact) {
    return (
      <div data-slot="execution-state" className="mt-2 text-[10px] font-semibold leading-4">
        <div>head · {scene.elHead === "candidate" ? "새 후보" : "부모"}</div>
        <div className="text-muted-foreground">
          {scene.elHead === "candidate" ? "A 89.999958 · B 10" : "A 100 · B 0"}
        </div>
      </div>
    );
  }

  return (
    <div data-slot="execution-state" className="mt-1.5 grid grid-cols-2 gap-1 text-[9px]">
      <div className="border border-border bg-muted/30 p-1">
        <div className="font-bold">부모 블록</div>
        <div className="mt-0.5 text-muted-foreground">A 100 · B 0</div>
        {scene.elHead === "parent" ? <div className="mt-0.5 font-bold">head</div> : null}
      </div>
      <div className="border border-border bg-muted/30 p-1">
        <div className="font-bold">새 후보</div>
        <div className="mt-0.5 text-muted-foreground">{scene.elCandidate}</div>
        {scene.elHead === "candidate" ? <div className="mt-0.5 font-bold">head</div> : null}
      </div>
    </div>
  );
}

function DesktopNodeMap({ scene, sceneId, reducedMotion, generic = false }: { scene: NodeMapScene; sceneId: number; reducedMotion: boolean; generic?: boolean }) {
  const labels = generic
    ? {
        consensusNetwork: "후보·투표 입력",
        executionNetwork: "송금·블록 입력",
        consensus: "기록을 고르는 프로그램",
        engine: "검증 요청과 판정",
        execution: "거래를 계산하는 프로그램",
        beacon: "선택 결과 조회",
        rpc: "송금 제출·잔액 조회",
      }
    : {
        consensusNetwork: "합의 P2P",
        executionNetwork: "실행 P2P",
        consensus: "합의 클라이언트 · CL",
        engine: "Engine API",
        execution: "실행 클라이언트 · EL",
        beacon: "Beacon API",
        rpc: "JSON-RPC",
      };

  return (
    <div data-map-layout="desktop" className="relative hidden h-[32rem] min-w-0 xl:block">
      <div className="absolute inset-x-0 top-[18%] h-[62%] border border-border/80" aria-hidden="true" />
      <span className="absolute left-3 top-[18%] z-20 -translate-y-1/2 bg-background px-2 text-[10px] font-bold text-muted-foreground">이더리움 노드 한 대</span>

      <MapNode id="consensus-network" eyebrow="다른 노드" title={labels.consensusNetwork} detail="블록 후보·투표" className="left-0 top-0 h-[13%] w-[34%]" />
      <MapNode id="execution-network" eyebrow="다른 노드" title={labels.executionNetwork} detail="거래·블록·상태 동기화" className="right-0 top-0 h-[13%] w-[34%]" />
      <MapNode id="consensus" eyebrow="기록 선택" title={labels.consensus} detail={generic ? "후보와 투표로 현재 기록을 선택" : scene.clCandidate} className="left-[3%] top-[27%] h-[22%] w-[32%]" />
      <MapNode id="engine" eyebrow="두 프로그램의 전용 통로" title={labels.engine} detail={`${scene.laneRequest}\n${scene.laneResponse}`} className="left-[41%] top-[29%] h-[18%] w-[18%] whitespace-pre-line text-center" />
      <MapNode id="execution" eyebrow="거래 계산" title={labels.execution} detail="거래 실행·계정 상태 검증" className="right-[3%] top-[27%] h-[22%] w-[32%]" />

      <div data-node-id="consensus-store" className="absolute left-[3%] top-[57%] z-10 h-[18%] w-[32%] border border-border bg-background px-3 py-2">
        <div className="text-[10px] font-semibold text-muted-foreground">합의 저장소 · 선택 상태</div>
        {generic ? <div className="mt-3 text-xs font-bold">현재 기록 · 안전 지점 · 최종 확정</div> : <ChainState head={scene.clHead} />}
      </div>
      <div data-node-id="execution-store" className="absolute right-[3%] top-[57%] z-10 h-[18%] w-[32%] border border-border bg-background px-3 py-2">
        <div className="text-[10px] font-semibold text-muted-foreground">실행 저장소 · 계정 상태</div>
        {generic ? <div className="mt-3 text-xs font-bold">블록별 잔액 · 코드 · 저장 상태</div> : <ExecutionState scene={scene} />}
      </div>

      <MapNode id="beacon-api" eyebrow="사용자·검증자 도구" title={labels.beacon} detail="선택된 기록 조회" className="bottom-0 left-0 h-[15%] w-[34%]" />
      <MapNode id="json-rpc" eyebrow="지갑·애플리케이션" title={labels.rpc} detail="송금 제출·잔액 조회" className="bottom-0 right-0 h-[15%] w-[34%]" />

      <div data-edge-id="consensus-input" className="absolute left-[17%] top-[13%] h-[14%] border-l border-border" aria-hidden="true"><span className="absolute -bottom-1 -left-1 text-[9px]">▼</span></div>
      <div data-edge-id="execution-input" className="absolute right-[17%] top-[13%] h-[14%] border-l border-border" aria-hidden="true"><span className="absolute -bottom-1 -left-1 text-[9px]">▼</span></div>
      <div data-edge-id="engine-request" className="absolute left-[35%] right-[35%] top-[36%] border-t border-border" aria-hidden="true" />
      <div data-edge-id="engine-response" className="absolute left-[35%] right-[35%] top-[43%] border-t border-border" aria-hidden="true" />
      <div data-edge-id="consensus-store" className="absolute left-[17%] top-[49%] h-[8%] border-l border-border" aria-hidden="true" />
      <div data-edge-id="execution-store" className="absolute right-[17%] top-[49%] h-[8%] border-l border-border" aria-hidden="true" />
      <div data-edge-id="beacon-api" className="absolute bottom-[15%] left-[17%] h-[10%] border-l border-border" aria-hidden="true" />
      <div data-edge-id="json-rpc" className="absolute bottom-[15%] right-[17%] h-[10%] border-l border-border" aria-hidden="true" />

      {!generic ? scene.tokens.map((token) => <TraceToken key={token.id} token={token} mobile={false} reducedMotion={reducedMotion} sceneId={sceneId} />) : null}
    </div>
  );
}

function MobileNodeMap({ scene, sceneId, reducedMotion, generic = false }: { scene: NodeMapScene; sceneId: number; reducedMotion: boolean; generic?: boolean }) {
  const labels = generic
    ? {
        consensusNetwork: "후보·투표 입력",
        executionNetwork: "송금·블록 입력",
        consensus: "기록을 고르는 프로그램",
        engine: "검증 요청과 판정",
        execution: "거래를 계산하는 프로그램",
        beacon: "선택 결과 조회",
        rpc: "송금·잔액 조회",
      }
    : {
        consensusNetwork: "합의 P2P",
        executionNetwork: "실행 P2P",
        consensus: "합의 클라이언트 · CL",
        engine: "Engine API",
        execution: "실행 클라이언트 · EL",
        beacon: "Beacon API",
        rpc: "JSON-RPC",
      };

  return (
    <div data-map-layout="mobile" className="relative h-[31rem] min-w-0 xl:hidden">
      <div className="absolute inset-x-0 top-[15%] h-[70%] border border-border/80" aria-hidden="true" />
      <span className="absolute left-2 top-[15%] z-20 -translate-y-1/2 bg-background px-1.5 text-[9px] font-bold text-muted-foreground">이더리움 노드 한 대</span>

      <MapNode id="consensus-network" eyebrow="다른 노드" title={labels.consensusNetwork} detail="후보·투표" className="left-0 top-0 h-[14%] w-[48%]" />
      <MapNode id="beacon-api" eyebrow="검증자 도구" title={labels.beacon} detail="기록 조회" className="right-0 top-0 h-[14%] w-[48%]" />
      <MapNode id="consensus" eyebrow="기록 선택" title={labels.consensus} detail={generic ? "후보와 투표로 기록 선택" : scene.clCandidate} className="left-[2%] top-[20%] h-[18%] w-[57%]" />
      <div data-node-id="consensus-store" className="absolute right-[2%] top-[20%] z-10 h-[18%] w-[35%] overflow-hidden border border-border bg-background px-2 py-2">
        <div className="text-[9px] font-semibold leading-3 text-muted-foreground">합의 저장소</div>
        {generic ? <div className="mt-2 text-[10px] font-bold leading-4">현재 기록<br />안전·확정 지점</div> : <ChainState head={scene.clHead} compact />}
      </div>

      <MapNode id="engine" eyebrow="전용 통로" title={labels.engine} detail={`${scene.laneRequest}\n${scene.laneResponse}`} className="left-[20%] top-[43%] h-[13%] w-[60%] whitespace-pre-line text-center" />

      <MapNode id="execution" eyebrow="거래 계산" title={labels.execution} detail="거래 실행·계정 상태 검증" className="left-[2%] top-[62%] h-[18%] w-[57%]" />
      <div data-node-id="execution-store" className="absolute right-[2%] top-[62%] z-10 h-[18%] w-[35%] overflow-hidden border border-border bg-background px-2 py-2">
        <div className="text-[9px] font-semibold leading-3 text-muted-foreground">실행 저장소</div>
        {generic ? <div className="mt-2 text-[10px] font-bold leading-4">블록별 계정 상태</div> : <ExecutionState scene={scene} compact />}
      </div>

      <MapNode id="execution-network" eyebrow="다른 노드" title={labels.executionNetwork} detail="거래·상태" className="bottom-0 left-0 h-[14%] w-[48%]" />
      <MapNode id="json-rpc" eyebrow="지갑·앱" title={labels.rpc} detail="송금·잔액" className="bottom-0 right-0 h-[14%] w-[48%]" />

      <div data-edge-id="consensus-input" className="absolute left-[25%] top-[14%] h-[6%] border-l border-border" aria-hidden="true" />
      <div data-edge-id="beacon-api" className="absolute right-[22%] top-[14%] h-[6%] border-l border-border" aria-hidden="true" />
      <div data-edge-id="engine-request" className="absolute left-[30%] top-[38%] h-[5%] border-l border-border" aria-hidden="true" />
      <div data-edge-id="engine-response" className="absolute right-[50%] top-[56%] h-[6%] border-l border-border" aria-hidden="true" />
      <div data-edge-id="execution-input" className="absolute left-[25%] bottom-[14%] h-[6%] border-l border-border" aria-hidden="true" />
      <div data-edge-id="json-rpc" className="absolute right-[22%] bottom-[14%] h-[6%] border-l border-border" aria-hidden="true" />

      {!generic ? scene.tokens.map((token) => <TraceToken key={token.id} token={token} mobile reducedMotion={reducedMotion} sceneId={sceneId} />) : null}
    </div>
  );
}

function NodeArchitectureMap({ scene, sceneId, reducedMotion, generic = false }: { scene: NodeMapScene; sceneId: number; reducedMotion: boolean; generic?: boolean }) {
  return (
    <div className="min-w-0">
      <DesktopNodeMap scene={scene} sceneId={sceneId} reducedMotion={reducedMotion} generic={generic} />
      <MobileNodeMap scene={scene} sceneId={sceneId} reducedMotion={reducedMotion} generic={generic} />
    </div>
  );
}

export function SystemBlackBoxViz() {
  const scene = nodeMapScenes[0];
  return (
    <VizFrame
      eyebrow="전체 아키텍처"
      title="한 프로그램은 거래를 계산하고, 다른 프로그램은 기록을 고릅니다"
      description="송금 결과를 계산하는 일과 여러 후보 가운데 따를 기록을 고르는 일을 나눠야 두 판단의 실패를 서로 구별할 수 있습니다."
      note="네트워크 경계에서는 후보와 거래가 들어오고, 서비스 경계에서는 지갑과 검증자 도구가 결과를 읽습니다."
      canvasClassName="p-3 sm:p-5"
      className="!h-auto !max-h-none [&_p]:!leading-6"
    >
      <div data-viz="node-map-overview" aria-label="이더리움 노드의 두 책임과 두 저장소">
        <NodeArchitectureMap scene={scene} sceneId={0} reducedMotion generic />
      </div>
    </VizFrame>
  );
}
export function NodeRequestTraceViz() {
  const state = useAnimatedScenes(nodeMapScenes.length, 5200, { loop: true });
  const scene = nodeMapScenes[state.active];

  return (
    <VizFrame
      eyebrow="같은 지도에서 요청 추적"
      title="송금이 새 블록 후보에 담겨 처리되는 과정을 따라갑니다"
      canvasClassName="p-3 sm:p-5"
      className="[&>figcaption]:!mb-3 [&_p]:!leading-6"
    >
      <div
        data-viz="node-map-trace"
        data-viz-keyboard
        data-scene={scene.label}
        tabIndex={0}
        onKeyDown={state.onKeyDown}
        aria-label="송금이 포함된 새 블록 후보의 실행 노드 처리 과정"
        className="min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary [&_[data-viz-controls]>p]:hidden [&_[data-viz-desktop-controls]]:flex-wrap [&_[data-viz-desktop-controls]]:overflow-visible"
      >
        <header className="mb-3 min-h-[7.5rem] border-b border-border pb-3 sm:min-h-[6.75rem]">
          <div className="text-xs font-bold text-primary">{String(state.active + 1).padStart(2, "0")} · {scene.label}</div>
          <h4 className="mt-2 text-base font-bold leading-6">{scene.question}</h4>
          <p className="mt-2 text-[13px] leading-5 text-muted-foreground sm:text-sm sm:leading-6" aria-live="polite">{scene.conclusion}</p>
        </header>
        <NodeArchitectureMap scene={scene} sceneId={state.active} reducedMotion={state.reducedMotion} />
        <AnimatedSceneControls labels={nodeMapScenes.map((item) => item.label)} playLabel="전체 흐름 재생" {...state} />
      </div>
    </VizFrame>
  );
}

function DesktopArchitecture({
  scene,
}: {
  scene: Scene;
}) {
  const node = (id: NodeId) => (scene.activeNodes as readonly NodeId[]).includes(id);
  const edge = (id: EdgeId) => (scene.activeEdges as readonly EdgeId[]).includes(id);
  const order = (id: NodeId) => (scene.motionPath as readonly NodeId[]).indexOf(id);

  return (
    <div key={`desktop-${scene.label}`} className="hidden min-w-0 grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)] items-center gap-x-4 lg:grid">
      <div className="grid min-w-0 gap-2">
        <CompactNode id="network" active={node("network") || node("beacon-service") || edge("publish")} motionOrder={order("network")} eyebrow="외부 경계 · 합의 P2P / Beacon API / 검증자" title={scene.consensusInput} />
        <ProgramBox
          id="consensus"
          active={node("consensus")}
          motionOrder={order("consensus")}
          title="합의 클라이언트 · CL"
          role="후보 순서와 합의 상태를 관리합니다."
          modules={["입력 검사", "상태 전환", "기록 선택"]}
        />
        <CompactNode id="consensus-store" active={node("consensus-store")} motionOrder={order("consensus-store")} eyebrow="합의 저장소" title={scene.consensusStore} />
      </div>
      <div className="relative">
        <div className={`absolute -left-4 -right-4 top-1/2 h-px ${edge("request") || edge("response") ? "bg-primary" : "bg-border"}`} aria-hidden="true" />
        <ArchitectureNode id="engine" active={node("engine")} motionOrder={order("engine")} eyebrow="호출 계약" title="Engine API">
          <span className="whitespace-pre-line break-keep font-mono text-[10px] leading-4">{scene.engineAction}</span>
          <EngineMotion active={edge("request") || edge("response")} />
        </ArchitectureNode>
      </div>
      <div className="grid min-w-0 gap-2">
        <CompactNode id="execution-network" active={node("execution-network") || node("service") || edge("publish")} motionOrder={order("execution-network")} eyebrow="외부 경계 · 실행 P2P / JSON-RPC / 지갑" title={scene.executionInput} />
        <ProgramBox
          id="execution"
          active={node("execution")}
          motionOrder={order("execution")}
          title="실행 클라이언트 · EL"
          role="거래와 EVM 상태 전환이 맞는지 계산합니다."
          modules={["블록 검사", "EVM 실행", "계정 상태"]}
        />
        <CompactNode id="execution-store" active={node("execution-store")} motionOrder={order("execution-store")} eyebrow="실행 저장소" title={scene.executionStore} />
      </div>
    </div>
  );
}

function MobileArchitecture({
  scene,
}: {
  scene: Scene;
}) {
  const node = (id: NodeId) => (scene.activeNodes as readonly NodeId[]).includes(id);
  const edge = (id: EdgeId) => (scene.activeEdges as readonly EdgeId[]).includes(id);
  const order = (id: NodeId) => (scene.motionPath as readonly NodeId[]).indexOf(id);

  return (
    <div key={`mobile-${scene.label}`} className="grid min-w-0 gap-2 lg:hidden">
      <div className="grid grid-cols-2 gap-2">
        <CompactNode
          id="network"
          active={node("network") || node("beacon-service") || edge("publish")}
          motionOrder={order("network")}
          eyebrow="합의 P2P · Beacon API"
          title={scene.consensusInput}
        />
        <CompactNode
          id="execution-network"
          active={node("execution-network") || node("service") || edge("publish")}
          motionOrder={order("execution-network")}
          eyebrow="실행 P2P · JSON-RPC"
          title={scene.executionInput}
        />
      </div>

      <div className="relative grid grid-cols-[minmax(0,1fr)_5.25rem_minmax(0,1fr)] items-center gap-2">
        <MobileProgramBox id="consensus" active={node("consensus")} motionOrder={order("consensus")} title="CL" role="기록 선택 · 확정" />
        <div
          data-architecture-node="engine"
          data-process-node={order("engine") >= 0 ? "true" : undefined}
          style={order("engine") >= 0 ? ({ "--process-order": order("engine") } as CSSProperties) : undefined}
          className={`relative z-10 min-w-0 border px-1 py-3 text-center transition-colors duration-300 ${
            node("engine") ? "border-primary bg-background" : "border-border bg-background"
          }`}
        >
          <div className="text-[9px] font-semibold leading-3 text-muted-foreground">Engine API</div>
          <div className="mt-1 whitespace-pre-line break-keep font-mono text-[9px] font-bold leading-4">{scene.mobileEngineAction}</div>
          <EngineMotion active={edge("request") || edge("response")} />
        </div>
        <MobileProgramBox id="execution" active={node("execution")} motionOrder={order("execution")} title="EL" role="거래 · 상태 계산" />
        <div
          className={`absolute left-[25%] right-[25%] top-1/2 h-px ${
            edge("request") || edge("response") ? "bg-primary" : "bg-border"
          }`}
          aria-hidden="true"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <CompactNode id="consensus-store" active={node("consensus-store")} motionOrder={order("consensus-store")} eyebrow="합의 저장소" title={scene.consensusStore} />
        <CompactNode id="execution-store" active={node("execution-store")} motionOrder={order("execution-store")} eyebrow="실행 저장소" title={scene.executionStore} />
      </div>
    </div>
  );
}

export function EngineBoundaryViz() {
  const state = useAnimatedScenes(scenes.length, 4200, { loop: true });
  const scene = scenes[state.active];
  const controlLabels = ["구조", "수신", "대기", "검증", "선택", "재수신"];
  const traceRef = useRef<HTMLDivElement>(null);
  const setTracePlaying = state.setPlaying;

  useEffect(() => {
    const trace = traceRef.current;
    if (!trace) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setTracePlaying(false);
      },
      { threshold: 0.05 },
    );
    observer.observe(trace);
    return () => observer.disconnect();
  }, [setTracePlaying]);

  return (
    <VizFrame
      eyebrow="Engine API 추적"
      title="새 블록 후보가 검증되고 선택되는 왕복"
      canvasClassName="p-4 sm:p-6"
      className="!h-auto !max-h-none [&_p]:!leading-6"
    >
      <div
        ref={traceRef}
        data-viz="engine-boundary"
        data-viz-keyboard
        tabIndex={0}
        onKeyDown={state.onKeyDown}
        aria-label="이더리움 실행 노드 요청 경로"
        className="flex min-w-0 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary [&_[data-viz-controls]>p]:hidden [&_[data-viz-desktop-controls]]:flex-wrap [&_[data-viz-desktop-controls]]:overflow-visible"
      >
        <header className="mb-3 min-h-[11.5rem] border-b border-border pb-3 sm:mb-5 sm:min-h-[9rem] sm:pb-5">
          <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
            <div className="text-xs font-bold leading-5 text-primary">{String(state.active + 1).padStart(2, "0")} · {scene.label}</div>
            <div className="max-w-full border border-border bg-background px-3 py-2 text-xs font-semibold leading-5">
              <span className="sm:hidden">{scene.mobileStatus}</span>
              <span className="hidden sm:inline">{scene.status}</span>
            </div>
          </div>
          <h4 className="mt-2 text-[15px] font-bold leading-5 sm:mt-3 sm:text-lg sm:leading-6">{scene.title}</h4>
          <div className="mt-1 max-w-3xl text-[13px] leading-5 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-6" aria-live="polite">{scene.summary}</div>
          <SceneSequence steps={scene.timeline} />
        </header>

        <DesktopArchitecture scene={scene} />
        <MobileArchitecture scene={scene} />
        <AnimatedSceneControls labels={controlLabels} playLabel="순서대로 보기" {...state} />
      </div>
    </VizFrame>
  );
}

export function SystemSettledViz() {
  const settledScene: NodeMapScene = {
    ...nodeMapScenes[nodeMapScenes.length - 1],
    tokens: [],
  };

  return (
    <VizFrame
      eyebrow="전체 구조로 돌아오기"
      title="선택의 근거와 적용된 실행 상태가 서로 다른 저장소에 남습니다"
      description="합의 저장소는 head·safe·finalized를 결정한 후보와 투표를 보존합니다. 실행 저장소는 계산 결과와 함께 전달받아 적용한 포인터를 보존합니다. 재수신 처리 방식은 구현과 요청 상태에 따라 따로 확인해야 합니다."
      note="VALID는 계산 결과이고 head·safe·finalized는 기록 선택 결과입니다. 두 상태는 같은 블록을 가리킬 때도 의미가 다릅니다."
      canvasClassName="p-4 sm:p-6"
      className="!h-auto !max-h-none [&_p]:!leading-6"
    >
      <NodeArchitectureMap scene={settledScene} sceneId={nodeMapScenes.length - 1} reducedMotion />
    </VizFrame>
  );
}

export function StateOwnershipViz() {
  return (
    <VizFrame
      eyebrow="저장소를 나누는 기준"
      title="두 저장소는 같은 블록을 서로 다른 질문으로 기억합니다"
      description="실행 저장소는 거래를 적용한 결과를, 합의 저장소는 어느 기록을 따르고 어디까지 확정했는지를 보관합니다."
      note="한쪽 저장소만 보고는 노드의 현재 상태를 모두 설명할 수 없습니다."
      canvasClassName="p-4 sm:p-6"
    >
      <div className="relative grid gap-4 sm:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)] sm:items-stretch">
        <div className="border border-border bg-background p-4">
          <div className="text-[11px] font-semibold text-muted-foreground">합의 저장소</div>
          <div className="mt-2 text-base font-bold">어느 기록을 따를까?</div>
          <div className="mt-4 grid grid-cols-3 gap-1 text-center">
            {["head", "safe", "finalized"].map((item) => (
              <span key={item} className="whitespace-nowrap border border-border bg-muted/30 px-0.5 py-2 font-mono text-[9px] font-bold sm:text-[10px]">{item}</span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">후보·투표·체크포인트를 이용해 현재 가지와 확정 지점을 남깁니다.</p>
        </div>
        <div className="flex min-h-20 flex-col items-center justify-center text-center sm:min-h-0">
          <span className="text-[10px] font-semibold text-muted-foreground">Engine API</span>
          <span className="my-2 hidden w-full border-t border-border sm:block" aria-hidden="true" />
          <span className="my-1 h-8 border-l border-border sm:hidden" aria-hidden="true" />
          <strong className="text-[11px] leading-5">후보·판정·선택 포인터 전달</strong>
        </div>
        <div className="border border-border bg-background p-4">
          <div className="text-[11px] font-semibold text-muted-foreground">실행 저장소</div>
          <div className="mt-2 text-base font-bold">거래 결과가 맞을까?</div>
          <div className="mt-4 grid grid-cols-2 gap-1 text-center sm:grid-cols-4">
            {["잔액", "코드", "저장 상태", "전달받은 head"].map((item) => (
              <span key={item} className="border border-border bg-muted/30 px-1 py-2 text-[10px] font-bold sm:text-xs">{item}</span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">부모 상태에서 거래를 실행한 결과와 CL이 전달한 head·safe·finalized 포인터를 적용해 조회에 사용합니다.</p>
        </div>
      </div>
    </VizFrame>
  );
}

const drilldownRegions = {
  consensusNetwork: {
    eyebrow: "다른 노드에서 후보·투표 수신",
    title: "합의 P2P",
    question: "후보와 투표는 어떻게 들어올까요?",
    links: [["합의 P2P", "/cs/blockchain/prysm-gossipsub"]],
  },
  executionNetwork: {
    eyebrow: "다른 노드에서 거래·블록 수신",
    title: "실행 P2P",
    question: "거래와 실행 블록은 어떻게 들어올까요?",
    links: [["실행 P2P", "/cs/blockchain/reth-net"]],
  },
  consensus: {
    eyebrow: "기록 선택과 확정",
    title: "합의 클라이언트 · CL",
    question: "유효한 후보 중 어느 기록을 따를까요?",
    links: [
      ["가지 선택", "/cs/blockchain/prysm-forkchoice"],
      ["최종 확정", "/cs/blockchain/prysm-finality"],
      ["합의 복구", "/cs/blockchain/prysm-sync"],
    ],
  },
  engine: {
    eyebrow: "두 프로그램의 호출 계약",
    title: "Engine API",
    question: "후보와 판정을 어떤 순서로 주고받을까요?",
    links: [
      ["Prysm 호출", "/cs/blockchain/prysm-engine-api"],
      ["Reth 응답", "/cs/blockchain/reth-rpc"],
    ],
  },
  execution: {
    eyebrow: "자료 확보·계산·저장",
    title: "실행 클라이언트 · EL",
    question: "거래 결과를 어떻게 계산하고 남길까요?",
    links: [
      ["자료 동기화", "/cs/blockchain/reth-sync"],
      ["블록 실행", "/cs/blockchain/reth-block-execution"],
      ["상태 저장", "/cs/blockchain/reth-provider"],
    ],
  },
} as const;

function DrilldownRegion({
  region,
  className = "",
}: {
  region: (typeof drilldownRegions)[keyof typeof drilldownRegions];
  className?: string;
}) {
  return (
    <section className={`min-w-0 border border-border bg-background p-3 ${className}`}>
      <div className="text-[9px] font-semibold leading-4 text-muted-foreground sm:text-[10px]">{region.eyebrow}</div>
      <h4 className="mt-0.5 text-xs font-bold leading-5 sm:text-sm">{region.title}</h4>
      <p className="mt-1 text-[10px] leading-4 text-muted-foreground sm:text-[11px] sm:leading-5">{region.question}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {region.links.map(([label, href]) => (
          <Link key={href} to={href} className="inline-flex min-h-11 items-center border border-border px-2 py-1 text-[10px] font-semibold hover:border-primary hover:text-primary sm:text-[11px]">
            {label}<span className="ml-1" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ArchitectureLearningPathsViz() {
  return (
    <VizFrame
      eyebrow="다음 글"
      title="첫 지도에서 궁금한 영역을 고릅니다"
      description="각 글은 새로운 구조를 다시 만들지 않습니다. 첫 지도와 같은 합의 P2P·CL·Engine API·EL·실행 P2P 좌표에서 한 영역만 확대합니다."
      note="링크는 선택 사항입니다. 전체 구조만 필요하다면 앞 절의 정리에서 읽기를 마쳐도 됩니다."
      canvasClassName="p-4 sm:p-6"
      className="!h-auto !max-h-none [&_p]:!leading-5"
    >
      <nav aria-label="이더리움 노드 상세 학습 경로">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] lg:gap-x-3">
          <DrilldownRegion region={drilldownRegions.consensusNetwork} />
          <div className="hidden lg:block" />
          <DrilldownRegion region={drilldownRegions.executionNetwork} />
        </div>

        <div className="relative my-2 h-5" aria-hidden="true">
          <span className="absolute left-1/4 top-0 h-full border-l border-border lg:left-[18%]" />
          <span className="absolute right-1/4 top-0 h-full border-l border-border lg:right-[18%]" />
        </div>

        <div className="hidden grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] items-stretch gap-3 lg:grid">
          <DrilldownRegion region={drilldownRegions.consensus} />
          <DrilldownRegion region={drilldownRegions.engine} className="text-center" />
          <DrilldownRegion region={drilldownRegions.execution} />
        </div>

        <div className="grid gap-2 lg:hidden">
          <DrilldownRegion region={drilldownRegions.engine} />
          <DrilldownRegion region={drilldownRegions.consensus} />
          <DrilldownRegion region={drilldownRegions.execution} />
        </div>
      </nav>
    </VizFrame>
  );
}

export function PayloadStateViz() {
  return (
    <VizFrame
      eyebrow="상태를 읽는 법"
      title="실행 판정과 기록 선택은 서로 다른 축입니다"
      description="네 가지 응답은 실행 검증의 진행 상태를 말합니다. 현재 head와 최종 확정 지점은 CL이 별도로 관리합니다."
      note="반환 가능한 상태는 Engine API 메서드와 버전마다 다릅니다. 아래는 각 상태를 같은 개념으로 합치지 않기 위한 읽기 지도입니다."
      canvasClassName="p-4 sm:p-6"
    >
      <dl className="grid grid-cols-2 gap-2 sm:gap-3">
        {[
          ["VALID", "부모 상태에서 계산이 맞음"],
          ["INVALID", "후보나 조상의 실행이 잘못됨"],
          ["SYNCING", "필요한 자료가 없어 판단을 기다림"],
          ["ACCEPTED", "받았지만 전체 검증은 끝나지 않음"],
        ].map(([term, description]) => (
          <div key={term} className="min-w-0 border border-border bg-background p-3">
            <dt className="font-mono text-xs font-bold sm:text-sm">{term}</dt>
            <dd className="mt-1 text-[11px] leading-5 text-muted-foreground sm:text-xs">{description}</dd>
          </div>
        ))}
      </dl>
      <div className="my-3 flex items-center gap-2 text-[10px] font-semibold text-muted-foreground" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        VALID ≠ 현재 선택
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          ["head", "지금 따르는 기록"],
          ["safe", "더 안정적인 지점"],
          ["finalized", "최종 확정 지점"],
        ].map(([term, description]) => (
          <div key={term} className="min-w-0 border-t-2 border-primary px-1 pt-2 text-center">
            <div className="font-mono text-[11px] font-bold sm:text-xs">{term}</div>
            <div className="mt-1 text-[10px] leading-4 text-muted-foreground">{description}</div>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

export function BalanceTransitionViz() {
  return (
    <VizFrame
      eyebrow="같은 후보로 계산하기"
      title="새 후보는 직전 잔액에서 송금액과 처리 비용을 한 번 뺍니다"
      description="숫자를 먼저 고정하면 이후 SYNCING·VALID와 기록 선택이 모두 같은 후보를 가리키는지 확인할 수 있습니다."
      note="금액은 설명용 가정입니다. 실제 거래 유형과 적용 규칙이 다르면 처리 비용도 달라집니다."
      canvasClassName="p-4 sm:p-6"
    >
      <div className="grid items-stretch gap-2 sm:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)] sm:gap-3">
        <div className="border border-border bg-background p-3">
          <div className="text-[10px] font-semibold text-muted-foreground">직전 블록의 상태</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-center">
            <div><span className="block text-[10px] text-muted-foreground">A</span><strong className="text-base">100</strong></div>
            <div><span className="block text-[10px] text-muted-foreground">B</span><strong className="text-base">0</strong></div>
          </div>
        </div>
        <div className="flex min-h-[5.5rem] flex-col items-center justify-center border-y border-border px-2 text-center">
          <div className="text-[10px] font-semibold text-muted-foreground">새 후보에 든 송금</div>
          <div className="mt-1 text-xs font-bold">A → B · 10 ETH</div>
          <div className="mt-1 font-mono text-[10px] leading-4 text-muted-foreground">−10 − 0.000042</div>
        </div>
        <div className="border border-primary bg-primary/[0.055] p-3">
          <div className="text-[10px] font-semibold text-muted-foreground">새 후보의 계산 결과</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-center">
            <div><span className="block text-[10px] text-muted-foreground">A</span><strong className="text-base">89.999958</strong></div>
            <div><span className="block text-[10px] text-muted-foreground">B</span><strong className="text-base">10</strong></div>
          </div>
        </div>
      </div>
    </VizFrame>
  );
}

export function DecisionSeparationViz() {
  const cases = [
    ["부모 상태 없음", "SYNCING", "판단 보류"],
    ["실행 결과 불일치", "INVALID", "후보 거절"],
    ["실행 결과 일치", "VALID", "선택 가능한 후보"],
  ] as const;

  return (
    <VizFrame
      eyebrow="판정을 섞지 않기"
      title="자료 부족, 계산 실패, 계산 성공을 먼저 나눕니다"
      description="정상 경로에서는 CL이 VALID와 투표·가지 상태를 함께 보고 head·safe·finalized를 따로 정합니다. 동기화 중에는 실행 판정 전 낙관적 head가 보일 수 있습니다."
      note="계산에 필요한 자료가 아직 없다는 사실을 INVALID로 저장하면, 나중에 부모 블록을 받아도 올바른 후보를 되살릴 수 없습니다."
      canvasClassName="p-4 sm:p-6"
    >
      <div className="grid grid-cols-3 gap-2">
        {cases.map(([condition, result, meaning]) => (
          <div key={result} className="min-w-0 border border-border bg-background px-2 py-3 text-center">
            <div className="min-h-8 text-[10px] font-semibold leading-4 text-muted-foreground">{condition}</div>
            <div className="my-2 text-sm text-primary" aria-hidden="true">↓</div>
            <div className="break-all font-mono text-[10px] font-bold leading-4 sm:break-normal sm:text-xs">{result}</div>
            <div className="mt-1 text-[10px] leading-4 text-muted-foreground">{meaning}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 border border-primary/45 bg-primary/[0.045] px-3 py-3 text-center">
        <div className="text-[10px] font-semibold text-muted-foreground">실행 판정과 기록 선택은 서로 다른 판단</div>
        <div className="mt-1 text-xs font-bold">정상 경로는 VALID와 투표를 함께 반영 · 동기화 중에는 낙관적 head 가능</div>
      </div>
    </VizFrame>
  );
}
