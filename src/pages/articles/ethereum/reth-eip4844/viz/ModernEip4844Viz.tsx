import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
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
  dashed = false,
}: {
  x: number;
  y: number;
  width: number;
  label: string;
  detail: string;
  active: boolean;
  dashed?: boolean;
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
        strokeDasharray={dashed ? "5 5" : undefined}
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

export function BlobBoundaryViz() {
  const labels = [
    "Rollup이 128 KiB blob을 만듭니다",
    "Commitment가 큰 blob을 짧게 약속합니다",
    "Transaction에는 versioned hash만 넣습니다",
    "Sidecar는 별도 경로로 검증·보관합니다",
  ] as const;
  const notes = [
    "Blob은 4096개의 32-byte field-element slot을 가진 고정 크기 data artifact입니다.",
    "KZG commitment는 blob의 압축본이 아니라 나중에 같은 data를 검증하기 위한 약속입니다.",
    "Execution transaction은 fee와 blob_versioned_hashes를 남기지만 blob bytes를 품지 않습니다.",
    "Blob·commitment·proof의 개수와 binding이 맞아야 두 경로를 같은 제출로 읽을 수 있습니다.",
  ] as const;
  return (
    <Lesson id="blob-boundary-viz" title="Blob body와 sidecar의 두 경로" description="큰 data와 execution reference를 분리하고 commitment로 다시 묶습니다." labels={labels} notes={notes}>
      {(active) => (
        <svg viewBox="0 0 440 250" role="img" aria-label={labels[active]} className="block h-auto w-full">
          <Box x={18} y={88} width={78} label="blob" detail="131,072 B" active />
          <Arrow x1={98} y1={117} x2={137} y2={117} active={active >= 1} id="eb1" />
          <Box x={141} y={88} width={92} label="commitment" detail="48 B" active={active >= 1} />
          <Arrow x1={235} y1={104} x2={278} y2={64} active={active >= 2} id="eb2" />
          <Box x={282} y={34} width={140} label="transaction" detail="versioned hash" active={active >= 2} />
          <Arrow x1={235} y1={130} x2={278} y2={170} active={active >= 3} id="eb3" />
          <Box x={282} y={142} width={140} label="sidecar" detail="blob · C · proof" active={active >= 3} />
          <text x="352" y="111" textAnchor="middle" className="fill-muted-foreground text-[9px]">same submission</text>
        </svg>
      )}
    </Lesson>
  );
}

export function BlobAdmissionViz() {
  const labels = [
    "Bounded decode로 입력 크기부터 제한합니다",
    "Fork·count·size·hash binding을 확인합니다",
    "Nonce·balance·두 fee market을 확인합니다",
    "KZG와 pool budget을 통과한 것만 저장합니다",
  ] as const;
  const notes = [
    "Malformed·oversized input을 싼 단계에서 거부해야 비싼 cryptographic work를 공격자가 강제하지 못합니다.",
    "Transaction hash list와 sidecar tuple의 길이·순서가 맞지 않으면 state 조회 전에 끝냅니다.",
    "Execution gas와 blob gas를 서로 다른 단위와 base fee로 판정합니다.",
    "KZG success 뒤에도 memory·disk·per-account policy가 pool admission을 거부할 수 있습니다.",
  ] as const;
  return (
    <Lesson id="blob-admission-viz" title="Cheap checks에서 KZG까지" description="실패 비용과 이유를 단계별로 분리한 admission pipeline입니다." labels={labels} notes={notes}>
      {(active) => (
        <svg viewBox="0 0 440 240" role="img" aria-label={labels[active]} className="block h-auto w-full">
          {[
            [12, "decode", "byte bound"],
            [118, "shape", "fork · count"],
            [224, "state", "nonce · fees"],
            [330, "KZG", "store gate"],
          ].map(([x, label, detail], index) => (
            <Box key={String(label)} x={Number(x)} y={82} width={88} label={String(label)} detail={String(detail)} active={active >= index} />
          ))}
          <Arrow x1={102} y1={111} x2={114} y2={111} active={active >= 1} id="ea1" />
          <Arrow x1={208} y1={111} x2={220} y2={111} active={active >= 2} id="ea2" />
          <Arrow x1={314} y1={111} x2={326} y2={111} active={active >= 3} id="ea3" />
          <path d="M56 146V184H374V146" fill="none" stroke={active >= 3 ? primary : border} strokeWidth="1.25" strokeDasharray="5 5" />
          <text x="215" y="204" textAnchor="middle" className="fill-muted-foreground text-[9px]">reason-coded reject at every gate</text>
        </svg>
      )}
    </Lesson>
  );
}

export function BlobStoreLifecycleViz() {
  const labels = [
    "Verified sidecar를 transaction hash에 묶습니다",
    "Bytes·digest·generation을 atomic receipt로 씁니다",
    "Read 결과를 hit·miss·corrupt로 나눕니다",
    "Finalized cleanup도 generation receipt를 남깁니다",
  ] as const;
  const notes = [
    "Key가 같아도 sidecar bytes와 검증 metadata의 owner를 분리해 기록합니다.",
    "Partial write 뒤 metadata만 남는 상태를 막거나 restart recovery가 처리해야 합니다.",
    "Miss는 빈 blob이 아니고 corrupt는 retry 가능한 miss와 다른 failure입니다.",
    "EL pool cleanup은 consensus sidecar retention이나 장기 archive 삭제와 같은 사건이 아닙니다.",
  ] as const;
  return (
    <Lesson id="blob-store-viz" title="BlobStore artifact state machine" description="큰 sidecar를 receipt가 있는 artifact로 저장·조회·정리합니다." labels={labels} notes={notes}>
      {(active) => (
        <svg viewBox="0 0 440 250" role="img" aria-label={labels[active]} className="block h-auto w-full">
          <Box x={20} y={84} width={94} label="verified" detail="H + sidecar" active />
          <Arrow x1={116} y1={113} x2={166} y2={113} active={active >= 1} id="es1" />
          <Box x={170} y={84} width={100} label="stored" detail="bytes · digest" active={active >= 1} />
          <Arrow x1={272} y1={113} x2={322} y2={113} active={active >= 2} id="es2" />
          <Box x={326} y={84} width={94} label="read" detail="hit/miss/bad" active={active >= 2} />
          <path d="M220 144V190H74V144" fill="none" stroke={active >= 3 ? primary : border} strokeWidth="1.25" strokeDasharray="5 5" />
          <text x="147" y="210" textAnchor="middle" className="fill-muted-foreground text-[9px]">finalized generation cleanup</text>
          <circle cx="392" cy="192" r="18" fill="none" stroke={active >= 3 ? primary : border} strokeWidth="1.25" />
          <path d="M383 192H401" stroke={active >= 3 ? primary : border} strokeWidth="1.25" />
        </svg>
      )}
    </Lesson>
  );
}

export function BlobFeeFeedbackViz() {
  const labels = [
    "Parent excess E와 사용량 U를 읽습니다",
    "활성 fork target T를 뺍니다",
    "음수 결과는 0에서 멈춥니다",
    "정수 fake-exponential이 다음 fee를 만듭니다",
  ] as const;
  const notes = [
    "E·U·T는 모두 blob gas 단위이며 execution gas와 섞지 않습니다.",
    "Target은 고정 암기값이 아니라 parent timestamp에 활성인 chain parameter에서 고릅니다.",
    "Saturating subtraction은 unused capacity가 negative debt가 되는 것을 막습니다.",
    "부동소수점 대신 같은 정수 항을 더해 모든 client가 결정론적인 fee를 계산합니다.",
  ] as const;
  return (
    <Lesson id="blob-fee-viz" title="사용량에서 다음 blob base fee까지" description="Excess state가 target 주변 수요를 다음 가격으로 되먹임합니다." labels={labels} notes={notes}>
      {(active) => (
        <svg viewBox="0 0 440 245" role="img" aria-label={labels[active]} className="block h-auto w-full">
          <Box x={18} y={80} width={86} label="E + U" detail="parent state" active />
          <Arrow x1={106} y1={109} x2={148} y2={109} active={active >= 1} id="ef1" />
          <Box x={152} y={80} width={86} label="− T" detail="active target" active={active >= 1} />
          <Arrow x1={240} y1={109} x2={282} y2={109} active={active >= 2} id="ef2" />
          <Box x={286} y={80} width={84} label="max(0,·)" detail="next excess" active={active >= 2} />
          <Arrow x1={328} y1={140} x2={328} y2={176} active={active >= 3} id="ef3" />
          <Box x={268} y={180} width={120} label="integer exp" detail="next blob fee" active={active >= 3} />
          <path d="M268 209C170 224 60 211 60 140" fill="none" stroke={active >= 3 ? primary : border} strokeWidth="1.25" strokeDasharray="5 5" />
        </svg>
      )}
    </Lesson>
  );
}

export function BlobReorgReleaseViz() {
  const labels = [
    "Old canonical chain의 blob transaction을 찾습니다",
    "Local BlobStore에서 sidecar receipt를 조회합니다",
    "Hit이면 재주입하고 miss면 fetch 또는 실패합니다",
    "Failure parity 뒤에만 성능 candidate를 승인합니다",
  ] as const;
  const notes = [
    "Reorg는 transaction body뿐 아니라 다시 실행 가능한 sidecar availability를 요구합니다.",
    "검증된 receipt와 generation이 같은 sidecar인지 확인해야 KZG 재검증 생략을 정당화할 수 있습니다.",
    "Transaction의 versioned hash만으로 128 KiB blob을 복원할 수 없습니다.",
    "Wrong hash·proof·fee·corruption·cleanup crash를 base와 candidate에 같은 순서로 재생합니다.",
  ] as const;
  return (
    <Lesson id="blob-reorg-viz" title="Reorg에서 release gate까지" description="Orphaned transaction의 sidecar availability와 복구 결과를 추적합니다." labels={labels} notes={notes}>
      {(active) => (
        <svg viewBox="0 0 440 250" role="img" aria-label={labels[active]} className="block h-auto w-full">
          <Box x={20} y={84} width={94} label="orphaned tx" detail="old chain" active />
          <Arrow x1={116} y1={113} x2={164} y2={113} active={active >= 1} id="er1" />
          <Box x={168} y={84} width={100} label="store lookup" detail="receipt" active={active >= 1} />
          <Arrow x1={270} y1={101} x2={322} y2={64} active={active >= 2} id="er2" />
          <Box x={326} y={34} width={94} label="hit" detail="reinsert" active={active >= 2} />
          <Arrow x1={270} y1={127} x2={322} y2={166} active={active >= 2} id="er3" />
          <Box x={326} y={142} width={94} label="miss" detail="fetch / fail" active={active >= 2} dashed />
          <path d="M373 94V132" stroke={active >= 3 ? primary : border} strokeWidth="1.25" strokeDasharray="5 5" />
          <text x="220" y="214" textAnchor="middle" className="fill-muted-foreground text-[9px]">paired failure trace → release or rollback</text>
        </svg>
      )}
    </Lesson>
  );
}
