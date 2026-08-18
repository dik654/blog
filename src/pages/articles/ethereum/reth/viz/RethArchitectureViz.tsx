import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

const primary = "var(--primary)";
const border = "var(--border)";

function Lesson({
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
        fill={active ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "var(--background)"}
        stroke={active ? primary : border}
        strokeWidth="1.25"
      />
      <text x={x + width / 2} y={y + 23} textAnchor="middle" className="fill-foreground text-[11px] font-bold">
        {label}
      </text>
      <text x={x + width / 2} y={y + 42} textAnchor="middle" className="fill-muted-foreground text-[9px]">
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
        <marker id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0L7 3.5L0 7Z" fill={active ? primary : "var(--muted-foreground)"} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? primary : "var(--muted-foreground)"} strokeWidth="1.25" markerEnd={`url(#${id})`} />
    </g>
  );
}

export default function RethArchitectureViz() {
  const labels = [
    "Network·Engine에서 block bytes를 받습니다",
    "Header·transaction·fork 규칙을 검증합니다",
    "같은 parent state에서 EVM을 실행합니다",
    "Head·safe·finalized 기준으로 canonical view를 갱신합니다",
    "Storage에 쓰고 provider가 고정된 view를 제공합니다",
  ] as const;
  const notes = [
    "Source peer 또는 Engine request, parent hash·number, 활성 fork version을 함께 남깁니다 — 수신 성공은 아직 검증 성공이 아닙니다.",
    "Historical pipeline과 live Engine path가 같은 chain spec·fork activation 규칙을 공유합니다.",
    "실행 성공은 아직 canonical adoption이 아닙니다 — post-state root·receipts·logs만 계산된 상태입니다.",
    "Consensus client의 forkchoiceUpdated가 head를 옮기면 Reth가 이 view를 따라갑니다. Finality 자체는 Reth가 정하지 않습니다.",
    "DB write 성공이 RPC consumer가 같은 snapshot을 읽었다는 뜻은 아닙니다 — provider가 canonical hash·state root를 함께 고정합니다.",
  ] as const;
  return (
    <Lesson
      id="reth-architecture-viz"
      title="한 block이 ingest부터 persist까지 다섯 단계를 지나갑니다"
      description="각 단계의 성공은 다음 단계의 성공을 보장하지 않습니다 — receipt를 이어서 추적해야 crash 뒤 무엇을 replay할지 알 수 있습니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg viewBox="0 0 520 220" role="img" aria-label={labels[active]} className="block h-auto w-full">
          <Box x={10} y={70} width={92} label="ingest" detail="block bytes" active={active >= 0} />
          <Arrow x1={104} y1={99} x2={122} y2={99} active={active >= 1} id="ra1" />
          <Box x={126} y={70} width={92} label="validate" detail="protocol rules" active={active >= 1} />
          <Arrow x1={220} y1={99} x2={238} y2={99} active={active >= 2} id="ra2" />
          <Box x={242} y={70} width={92} label="execute" detail="EVM transition" active={active >= 2} />
          <Arrow x1={336} y1={99} x2={354} y2={99} active={active >= 3} id="ra3" />
          <Box x={358} y={70} width={92} label="canonicalize" detail="fork-choice" active={active >= 3} />
          <Arrow x1={452} y1={99} x2={470} y2={99} active={active >= 4} id="ra4" />
          <Box x={412} y={158} width={98} label="persist / read" detail="storage · RPC" active={active >= 4} />
          <path
            d="M474 128V143H461V158"
            fill="none"
            stroke={active >= 4 ? primary : border}
            strokeWidth="1.25"
          />
          <text x="215" y="205" textAnchor="middle" className="fill-muted-foreground text-[9px]">
            block hash · state root · storage checkpoint로 다섯 단계를 잇는다
          </text>
        </svg>
      )}
    </Lesson>
  );
}
