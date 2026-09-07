import { motion } from "framer-motion";
import {
  ModuleBox,
  ActionBox,
  StatusBox,
  AlertBox,
} from "@/components/viz/boxes";
import { C } from "./ReleaseGateVizData";

/**
 * 판단 플로우차트 — 노드 좌표는 여기서 상수로 한 번만 정의하고
 * 모든 Step(0~5)이 동일한 좌표를 재사용한다. viewBox는 "0 0 480 328"로 고정.
 */

type NodeId =
  | "q1"
  | "yes"
  | "statusYes"
  | "no"
  | "q2"
  | "pipeline"
  | "ep"
  | "finalAlert"
  | "finalVerdict";

type NodeKind = "module" | "status" | "action" | "alert";

interface NodeSpec {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub: string;
  color: string;
  kind: NodeKind;
}

/* ── 노드 좌표 상수 — 모든 step에서 동일하게 재사용 ── */
const NODES: Record<NodeId, NodeSpec> = {
  q1: {
    x: 160,
    y: 20,
    w: 160,
    h: 38,
    label: "용량 문제인가?",
    sub: "Weight가 GPU 1장에 안 들어감",
    color: C.decision,
    kind: "module",
  },
  yes: {
    x: 20,
    y: 96,
    w: 150,
    h: 42,
    label: "48GB 개조 적용",
    sub: "대역폭은 그대로",
    color: C.capacity,
    kind: "module",
  },
  statusYes: {
    x: 20,
    y: 154,
    w: 150,
    h: 42,
    label: "용량 문제 해결",
    sub: "느리게라도 동작",
    color: C.capacity,
    kind: "status",
  },
  no: {
    x: 300,
    y: 96,
    w: 160,
    h: 42,
    label: "병목 = GPU 간 통신",
    sub: "처리량 문제, 통신이 원인",
    color: C.comm,
    kind: "module",
  },
  q2: {
    x: 300,
    y: 154,
    w: 160,
    h: 42,
    label: "Expert/activation 감당?",
    sub: "다음은 병렬화 전략 선택",
    color: C.decision,
    kind: "module",
  },
  pipeline: {
    x: 235,
    y: 214,
    w: 115,
    h: 42,
    label: "Pipeline Parallel",
    sub: "all-reduce 회피",
    color: C.pipeline,
    kind: "action",
  },
  ep: {
    x: 368,
    y: 214,
    w: 108,
    h: 42,
    label: "배치최적화+quant+batching",
    sub: "통신량 축소 + 숨김",
    color: C.ep,
    kind: "action",
  },
  finalAlert: {
    x: 140,
    y: 272,
    w: 160,
    h: 44,
    label: "9~14배 격차 여전",
    sub: "4기법 적용해도 안 메워짐",
    color: C.gap,
    kind: "alert",
  },
  finalVerdict: {
    x: 310,
    y: 272,
    w: 160,
    h: 44,
    label: "데이터센터 카드로",
    sub: "SLA·낮은 tail latency 워크로드",
    color: C.verdict,
    kind: "status",
  },
};

const DIM = 0.28;
const BRIGHT = 1;

/* 노드 중심 좌표 계산 */
function top(id: NodeId) {
  const n = NODES[id];
  return { x: n.x + n.w / 2, y: n.y };
}
function bottom(id: NodeId) {
  const n = NODES[id];
  return { x: n.x + n.w / 2, y: n.y + n.h };
}

interface EdgeSpec {
  id: string;
  from: NodeId;
  to: NodeId;
  label?: string;
  colorKey: keyof typeof C;
  /** 라벨을 옆으로 살짝 밀 오프셋 (겹침 방지) */
  labelDx?: number;
}

const EDGES: EdgeSpec[] = [
  { id: "e1", from: "q1", to: "yes", label: "YES", colorKey: "capacity", labelDx: -10 },
  { id: "e2", from: "yes", to: "statusYes", colorKey: "capacity" },
  { id: "e3", from: "q1", to: "no", label: "NO", colorKey: "comm", labelDx: 10 },
  { id: "e4", from: "no", to: "q2", colorKey: "comm" },
  { id: "e5", from: "q2", to: "pipeline", label: "감당됨", colorKey: "pipeline", labelDx: -14 },
  { id: "e6", from: "q2", to: "ep", label: "EP 불가피", colorKey: "ep", labelDx: 14 },
  { id: "e7", from: "pipeline", to: "finalAlert", colorKey: "gap" },
  { id: "e8", from: "ep", to: "finalVerdict", colorKey: "verdict" },
];

/* ── 공용 마커(화살촉) 정의 — 팔레트 색상별 + dim 1개 ── */
function ArrowDefs() {
  const colors: [string, string][] = [
    ["capacity", C.capacity],
    ["comm", C.comm],
    ["pipeline", C.pipeline],
    ["ep", C.ep],
    ["gap", C.gap],
    ["verdict", C.verdict],
  ];
  return (
    <defs>
      {colors.map(([key, color]) => (
        <marker
          key={key}
          id={`rg-arrow-${key}`}
          viewBox="0 0 10 10"
          refX={8.5}
          refY={5}
          markerWidth={5.5}
          markerHeight={5.5}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      ))}
      <marker
        id="rg-arrow-dim"
        viewBox="0 0 10 10"
        refX={8.5}
        refY={5}
        markerWidth={5}
        markerHeight={5}
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border)" />
      </marker>
    </defs>
  );
}

/** 노드 하나 렌더 — kind에 맞는 박스 컴포넌트로 위임, opacity로 경로 하이라이트 표현 */
function renderNode(id: NodeId, active: boolean, delay: number) {
  const n = NODES[id];
  const opacity = active ? BRIGHT : DIM;
  const common = {
    x: n.x,
    y: n.y,
    w: n.w,
    h: n.h,
    label: n.label,
    sub: n.sub,
    color: n.color,
  };
  return (
    <motion.g
      key={id}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 0.35, delay }}
    >
      {n.kind === "module" && <ModuleBox {...common} />}
      {n.kind === "action" && <ActionBox {...common} />}
      {n.kind === "status" && <StatusBox {...common} progress={1} />}
      {n.kind === "alert" && <AlertBox {...common} />}
      {active && (
        <rect
          x={n.x - 2}
          y={n.y - 2}
          width={n.w + 4}
          height={n.h + 4}
          rx={9}
          fill="none"
          stroke={n.color}
          strokeWidth={1}
          opacity={0.5}
        />
      )}
    </motion.g>
  );
}

/** 화살표 하나 렌더 — active면 팔레트 색, 아니면 흐린 회색 점선 */
function renderEdge(edge: EdgeSpec, active: boolean, delay: number) {
  const a = bottom(edge.from);
  const b = top(edge.to);
  const color = active ? C[edge.colorKey] : "var(--border)";
  const markerId = active ? `rg-arrow-${edge.colorKey}` : "rg-arrow-dim";
  const midX = (a.x + b.x) / 2 + (edge.labelDx ?? 0);
  const midY = (a.y + b.y) / 2;
  return (
    <g key={edge.id}>
      <motion.path
        d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
        stroke={color}
        strokeWidth={active ? 1.2 : 0.8}
        strokeDasharray={active ? undefined : "3 3"}
        fill="none"
        opacity={active ? 0.95 : 0.4}
        markerEnd={`url(#${markerId})`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay }}
      />
      {edge.label && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0.4 }}
          transition={{ duration: 0.3, delay: delay + 0.15 }}
        >
          <rect
            x={midX - 15}
            y={midY - 7}
            width={30}
            height={13}
            rx={6.5}
            fill="var(--card)"
            stroke={color}
            strokeWidth={0.8}
          />
          <text
            x={midX}
            y={midY + 2.5}
            textAnchor="middle"
            fontSize={7.5}
            fontWeight={700}
            fill={color}
          >
            {edge.label}
          </text>
        </motion.g>
      )}
    </g>
  );
}

/** 상단 "판단 시작" 표지 — 모든 step에서 동일하게 정상 밝기로 유지 */
function StartMarker() {
  const t = top("q1");
  return (
    <g>
      <text
        x={t.x}
        y={10}
        textAnchor="middle"
        fontSize={8}
        fontWeight={700}
        fill="var(--muted-foreground)"
      >
        판단 시작
      </text>
      <path
        d={`M ${t.x} 13 L ${t.x} ${t.y - 1}`}
        stroke="var(--muted-foreground)"
        strokeWidth={0.9}
        opacity={0.6}
        markerEnd="url(#rg-arrow-dim)"
      />
    </g>
  );
}

/** finalAlert ↔ finalVerdict 사이 연결선 (둘 다 최종 판단에 속함) */
function renderFinalLink(active: boolean, delay: number) {
  const a = { x: NODES.finalAlert.x + NODES.finalAlert.w, y: NODES.finalAlert.y + NODES.finalAlert.h / 2 };
  const b = { x: NODES.finalVerdict.x, y: NODES.finalVerdict.y + NODES.finalVerdict.h / 2 };
  const color = active ? C.verdict : "var(--border)";
  return (
    <motion.path
      d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`}
      stroke={color}
      strokeWidth={active ? 1.2 : 0.8}
      strokeDasharray={active ? undefined : "3 3"}
      fill="none"
      opacity={active ? 0.95 : 0.4}
      markerEnd="url(#rg-arrow-verdict)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, delay }}
    />
  );
}

interface FlowchartProps {
  activeNodes: Set<NodeId>;
  activeEdges: Set<string>;
  showFinal?: boolean;
  caption: string;
  captionColor: string;
}

/** 전체 플로우차트 골격 — Step0~5가 activeNodes/activeEdges만 바꿔가며 재사용 */
function Flowchart({
  activeNodes,
  activeEdges,
  showFinal = false,
  caption,
  captionColor,
}: FlowchartProps) {
  const nodeOrder: NodeId[] = [
    "q1",
    "yes",
    "no",
    "statusYes",
    "q2",
    "pipeline",
    "ep",
    "finalAlert",
    "finalVerdict",
  ];
  return (
    <g>
      <ArrowDefs />
      <StartMarker />
      {EDGES.map((e, i) => renderEdge(e, activeEdges.has(e.id), 0.1 + i * 0.05))}
      {showFinal && renderFinalLink(activeEdges.has("e9"), 0.55)}
      {nodeOrder.map((id, i) =>
        renderNode(id, activeNodes.has(id), 0.05 + i * 0.05),
      )}
      <motion.text
        x={240}
        y={322}
        textAnchor="middle"
        fontSize={8}
        fontWeight={600}
        fill={captionColor}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.3 }}
      >
        {caption}
      </motion.text>
    </g>
  );
}

/* ── Step 0: 시작 — 용량 문제인가? (두 갈래 모두 흐리게) ── */
export function Step0() {
  return (
    <Flowchart
      activeNodes={new Set<NodeId>(["q1"])}
      activeEdges={new Set<string>()}
      caption="용량 문제인지부터 확인 — 아직 어느 갈래도 선택되지 않음"
      captionColor="var(--muted-foreground)"
    />
  );
}

/* ── Step 1: YES — 48GB 개조로 용량 문제 해결 ── */
export function Step1() {
  return (
    <Flowchart
      activeNodes={new Set<NodeId>(["q1", "yes", "statusYes"])}
      activeEdges={new Set<string>(["e1", "e2"])}
      caption="대역폭은 그대로 — '느리게라도 돌아가는' 상태를 만드는 해법"
      captionColor={C.capacity}
    />
  );
}

/* ── Step 2: NO — 병목은 GPU 간 통신 ── */
export function Step2() {
  return (
    <Flowchart
      activeNodes={new Set<NodeId>(["q1", "no", "q2"])}
      activeEdges={new Set<string>(["e3", "e4"])}
      caption="48GB 개조는 해당 사항 없음 — 다음은 병렬화 전략 선택"
      captionColor={C.comm}
    />
  );
}

/* ── Step 3: 감당됨 — Pipeline Parallel ── */
export function Step3() {
  return (
    <Flowchart
      activeNodes={new Set<NodeId>(["q1", "no", "q2", "pipeline"])}
      activeEdges={new Set<string>(["e3", "e4", "e5"])}
      caption="all-reduce 자체를 피하는 구성이 PCIe 2-way에서 더 유리"
      captionColor={C.pipeline}
    />
  );
}

/* ── Step 4: EP 불가피 — 배치 최적화 + quantization + batching ── */
export function Step4() {
  return (
    <Flowchart
      activeNodes={new Set<NodeId>(["q1", "no", "q2", "ep"])}
      activeEdges={new Set<string>(["e3", "e4", "e6"])}
      caption="통신량은 quantization으로 줄이고, 나머지는 batching으로 숨긴다"
      captionColor={C.ep}
    />
  );
}

/* ── Step 5: 최종 판단 — 4기법으로도 못 메우는 9~14배 격차 ── */
export function Step5() {
  return (
    <Flowchart
      activeNodes={
        new Set<NodeId>([
          "q1",
          "no",
          "q2",
          "pipeline",
          "ep",
          "finalAlert",
          "finalVerdict",
        ])
      }
      activeEdges={new Set<string>(["e3", "e4", "e5", "e6", "e7", "e8", "e9"])}
      showFinal
      caption="SLA·낮은 tail latency 워크로드는 워크스테이션·데이터센터 카드로"
      captionColor={C.verdict}
    />
  );
}
