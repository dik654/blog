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
        <h3 className="mt-2 min-h-[7.25rem] text-lg font-bold leading-7 sm:min-h-[2.5rem]">
          {labels[controls.active]}
        </h3>
        <div data-viz-canvas className="mt-5 min-w-0 overflow-hidden">
          {children(controls.active)}
        </div>
        <p className="mt-4 min-h-[8.75rem] border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground sm:min-h-[3.5rem]">
          {notes[controls.active]}
        </p>
        <AnimatedSceneControls labels={labels} {...controls} />
      </div>
    </VizFrame>
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

function Box({
  x,
  y,
  w,
  label,
  detail,
  active,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  detail: string;
  active: boolean;
}) {
  return (
    <motion.g initial={false} animate={{ opacity: active ? 1 : 0.22 }}>
      <rect
        x={x}
        y={y}
        width={w}
        height="58"
        rx="9"
        fill={
          active
            ? "color-mix(in srgb, var(--primary) 8%, transparent)"
            : "var(--background)"
        }
        stroke={active ? primary : border}
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
        {detail}
      </text>
    </motion.g>
  );
}

function Matrix({
  active,
  structured = false,
}: {
  active: number;
  structured?: boolean;
}) {
  const cells = Array.from({ length: 24 }, (_, i) => i);
  return (
    <g>
      {cells.map((cell) => {
        const row = Math.floor(cell / 6);
        const col = cell % 6;
        const removed = structured
          ? col === 1 || col === 4
          : [1, 4, 8, 10, 15, 19, 22].includes(cell);
        const visible = active === 0 || !removed;
        return (
          <motion.rect
            key={cell}
            x={42 + col * 43}
            y={35 + row * 39}
            width="31"
            height="27"
            rx="5"
            stroke={visible ? primary : border}
            strokeWidth="1.25"
            initial={false}
            animate={{
              opacity: visible ? 1 : 0.16,
              fill: visible
                ? "color-mix(in srgb, var(--primary) 10%, transparent)"
                : "var(--background)",
            }}
          />
        );
      })}
    </g>
  );
}

export function PruningMaskViz() {
  const labels = [
    "Dense weight의 자리를 봅니다",
    "Mask가 연결의 생존을 표시합니다",
    "제거 단위를 runtime 계약으로 넘깁니다",
  ] as const;
  const notes = [
    "숫자 0은 값일 뿐 아직 제거 계약이 아닙니다.",
    "Mask의 1은 남은 연결, 0은 제거한 연결입니다. 분모가 정해져야 sparsity가 의미를 가집니다.",
    "Weight·group·channel 중 어떤 단위를 지웠는지에 따라 저장 형식과 실행 kernel이 달라집니다.",
  ] as const;
  return (
    <Scene
      id="pruning-mask-viz"
      title="값에서 제거 단위까지"
      description="Weight matrix 위에 mask를 올리고 runtime이 소비할 제거 단위로 넘기는 과정을 봅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 430 245"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Matrix active={active} />
          <Box
            x={315}
            y={36}
            w={92}
            label="Mask"
            detail="1 keep · 0 drop"
            active={active >= 1}
          />
          <Arrow
            x1={296}
            y1={82}
            x2={312}
            y2={65}
            active={active >= 1}
            id="mask-arrow"
          />
          <Box
            x={42}
            y={197}
            w={104}
            label="Weight"
            detail="irregular cells"
            active={active >= 2}
          />
          <Box
            x={163}
            y={197}
            w={104}
            label="N:M group"
            detail="local pattern"
            active={active >= 2}
          />
          <Box
            x={284}
            y={197}
            w={104}
            label="Channel"
            detail="smaller shape"
            active={active >= 2}
          />
        </svg>
      )}
    </Scene>
  );
}

export function UnstructuredPruningViz() {
  const labels = [
    "개별 weight를 score로 정렬합니다",
    "낮은 score를 mask로 제거합니다",
    "남은 value와 index를 함께 저장합니다",
    "Target sparse kernel에서 손익을 측정합니다",
  ] as const;
  const notes = [
    "Magnitude와 movement는 importance를 만드는 근거가 다릅니다.",
    "같은 sparsity라도 어느 layer를 얼마나 지웠는지에 따라 품질이 달라집니다.",
    "불규칙한 위치는 주소표가 필요하므로 0이 많다는 사실만으로 파일이 작아지지 않습니다.",
    "저장량 이득과 gather·index 비용을 포함한 latency 이득은 별도 gate입니다.",
  ] as const;
  return (
    <Scene
      id="unstructured-pruning-viz"
      title="Score에서 sparse payload까지"
      description="불규칙한 weight 제거가 value·index artifact와 kernel 측정으로 이어지는 흐름입니다."
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
          <Box
            x={18}
            y={68}
            w={88}
            label="Weights"
            detail="|w| or movement"
            active
          />
          <Arrow
            x1={108}
            y1={97}
            x2={128}
            y2={97}
            active={active >= 1}
            id="u-arrow-1"
          />
          <Box
            x={132}
            y={68}
            w={88}
            label="Mask"
            detail="irregular zeros"
            active={active >= 1}
          />
          <Arrow
            x1={222}
            y1={97}
            x2={242}
            y2={97}
            active={active >= 2}
            id="u-arrow-2"
          />
          <Box
            x={246}
            y={38}
            w={84}
            label="Values"
            detail="ρN × bv"
            active={active >= 2}
          />
          <Box
            x={246}
            y={112}
            w={84}
            label="Indices"
            detail="ρN × bi"
            active={active >= 2}
          />
          <Arrow
            x1={332}
            y1={97}
            x2={352}
            y2={97}
            active={active >= 3}
            id="u-arrow-3"
          />
          <Box
            x={356}
            y={68}
            w={68}
            label="Kernel"
            detail="measure"
            active={active >= 3}
          />
          <motion.path
            d="M60 178 C130 218 284 218 390 178"
            fill="none"
            stroke={active >= 3 ? primary : border}
            strokeWidth="1.25"
            initial={false}
            animate={{ pathLength: active >= 3 ? 1 : 0 }}
          />
        </svg>
      )}
    </Scene>
  );
}

export function StructuredPruningViz() {
  const labels = [
    "연결된 tensor shape를 찾습니다",
    "Channel을 앞뒤 layer에서 함께 제거합니다",
    "N:M은 shape 대신 local pattern을 고정합니다",
    "Compiler가 실제 tactic을 고르는지 확인합니다",
  ] as const;
  const notes = [
    "Channel 하나는 현재 output이자 다음 layer input입니다.",
    "Shape를 실제로 줄여야 일반 dense GEMM도 더 작은 행렬을 계산합니다.",
    "2:4는 모든 네 weight 묶음마다 두 개를 남기는 제약이며 전체 50%와 다릅니다.",
    "적격 pattern이어도 dtype·axis·shape에서 dense tactic이 더 빠를 수 있습니다.",
  ] as const;
  return (
    <Scene
      id="structured-pruning-viz"
      title="Shape pruning과 N:M의 다른 형태"
      description="Graph dimension 축소와 local sparse pattern을 같은 그림에서 구분합니다."
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
          <g transform="translate(0 8) scale(.72)">
            <Matrix active={active >= 1 ? 1 : 0} structured />
          </g>
          <Arrow
            x1={224}
            y1={86}
            x2={246}
            y2={86}
            active={active >= 1}
            id="s-arrow-1"
          />
          <Box
            x={250}
            y={40}
            w={80}
            label="Next W"
            detail="input shrinks"
            active={active >= 1}
          />
          <Box
            x={346}
            y={40}
            w={76}
            label="Dense GEMM"
            detail="smaller shape"
            active={active >= 1}
          />
          <Arrow
            x1={332}
            y1={69}
            x2={343}
            y2={69}
            active={active >= 1}
            id="s-arrow-2"
          />
          {[0, 1].map((row) =>
            [0, 1, 2, 3].map((col) => {
              const on = row === 0 ? col < 2 : col % 2 === 0;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={74 + col * 40}
                  y={174 + row * 34}
                  width="28"
                  height="23"
                  rx="4"
                  fill={
                    on
                      ? "color-mix(in srgb, var(--primary) 12%, transparent)"
                      : "var(--background)"
                  }
                  stroke={active >= 2 && on ? primary : border}
                  strokeWidth="1.25"
                  opacity={active >= 2 ? 1 : 0.2}
                />
              );
            }),
          )}
          <Box
            x={270}
            y={169}
            w={126}
            label="2:4 eligible?"
            detail="axis · dtype · op"
            active={active >= 2}
          />
          <motion.circle
            cx="408"
            cy="198"
            r="8"
            fill={active >= 3 ? primary : border}
            initial={false}
            animate={{ scale: active >= 3 ? 1 : 0.6 }}
          />
        </svg>
      )}
    </Scene>
  );
}

export function OneShotLlmPruningViz() {
  const labels = [
    "Calibration prompts를 slice로 모읍니다",
    "Layer input X를 기록합니다",
    "SparseGPT와 Wanda가 다른 score를 만듭니다",
    "Held-out slice에서 mask를 비교합니다",
  ] as const;
  const notes = [
    "언어·길이·domain이 빠진 activation은 deployment importance를 대표하지 못할 수 있습니다.",
    "One-shot은 label 없이도 X를 쓰지만 tokenizer·packing·attention mask를 고정해야 합니다.",
    "SparseGPT는 layer output reconstruction과 compensation을, Wanda는 |w|와 input norm의 곱을 사용합니다.",
    "같은 sparsity에서 slice quality와 runtime을 비교해야 method 이름이 아니라 배포 후보를 고를 수 있습니다.",
  ] as const;
  return (
    <Scene
      id="one-shot-llm-pruning-viz"
      title="Calibration에서 one-shot mask까지"
      description="대표 prompt가 layer activation을 만들고 두 method의 다른 판단으로 이어지는 흐름입니다."
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
          <Box
            x={18}
            y={66}
            w={84}
            label="Prompts"
            detail="lang·length"
            active
          />
          <Arrow
            x1={104}
            y1={95}
            x2={125}
            y2={95}
            active={active >= 1}
            id="l-arrow-1"
          />
          <Box
            x={129}
            y={66}
            w={72}
            label="X"
            detail="layer input"
            active={active >= 1}
          />
          <Arrow
            x1={203}
            y1={95}
            x2={226}
            y2={62}
            active={active >= 2}
            id="l-arrow-2"
          />
          <Arrow
            x1={203}
            y1={95}
            x2={226}
            y2={145}
            active={active >= 2}
            id="l-arrow-3"
          />
          <Box
            x={230}
            y={28}
            w={96}
            label="SparseGPT"
            detail="reconstruct XW"
            active={active >= 2}
          />
          <Box
            x={230}
            y={116}
            w={96}
            label="Wanda"
            detail="|w| × ‖Xj‖"
            active={active >= 2}
          />
          <Arrow
            x1={328}
            y1={58}
            x2={352}
            y2={94}
            active={active >= 3}
            id="l-arrow-4"
          />
          <Arrow
            x1={328}
            y1={145}
            x2={352}
            y2={112}
            active={active >= 3}
            id="l-arrow-5"
          />
          <Box
            x={356}
            y={72}
            w={68}
            label="Gate"
            detail="held-out"
            active={active >= 3}
          />
        </svg>
      )}
    </Scene>
  );
}

export function PruningRecoveryViz() {
  const labels = [
    "Mask와 checkpoint를 한 generation으로 고정합니다",
    "Update 뒤 weight와 optimizer state를 다시 mask합니다",
    "Artifact를 target engine으로 build합니다",
    "Quality·memory·latency frontier에서 승인합니다",
  ] as const;
  const notes = [
    "Fixed-mask recovery는 지운 연결을 다시 뽑는 단계가 아닙니다.",
    "Weight만 0으로 만들면 momentum이 다음 step에 연결을 되살릴 수 있어 optimizer state도 같은 mask를 따릅니다.",
    "Sparsity 숫자가 아니라 실제 packing·fallback·chosen tactic이 들어간 artifact를 시험합니다.",
    "더 sparse한 후보가 아니라 quality gate를 지키며 필요한 runtime 축을 개선한 후보를 선택합니다.",
  ] as const;
  return (
    <Scene
      id="pruning-recovery-viz"
      title="Recovery에서 runtime release까지"
      description="고정 mask 불변식과 실제 배포 승인을 하나의 receipt 흐름으로 보여 줍니다."
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
          <Box
            x={16}
            y={68}
            w={88}
            label="Checkpoint"
            detail="W · M · state"
            active
          />
          <Arrow
            x1={106}
            y1={97}
            x2={127}
            y2={97}
            active={active >= 1}
            id="r-arrow-1"
          />
          <Box
            x={131}
            y={68}
            w={82}
            label="Recover"
            detail="update → mask"
            active={active >= 1}
          />
          <Arrow
            x1={215}
            y1={97}
            x2={236}
            y2={97}
            active={active >= 2}
            id="r-arrow-2"
          />
          <Box
            x={240}
            y={68}
            w={82}
            label="Build"
            detail="packing·tactic"
            active={active >= 2}
          />
          <Arrow
            x1={324}
            y1={97}
            x2={345}
            y2={97}
            active={active >= 3}
            id="r-arrow-3"
          />
          <Box
            x={349}
            y={68}
            w={75}
            label="Release"
            detail="Pareto gate"
            active={active >= 3}
          />
          <motion.path
            d="M58 168 L174 168 L281 168 L386 168"
            fill="none"
            stroke={active >= 3 ? primary : border}
            strokeWidth="1.25"
            strokeDasharray="5 5"
            initial={false}
            animate={{ pathLength: active >= 3 ? 1 : 0.15 }}
          />
          {[58, 174, 281, 386].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy="168"
              r="6"
              fill={i <= active ? primary : border}
            />
          ))}
          <text
            x="58"
            y="191"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            mask
          </text>
          <text
            x="174"
            y="191"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            quality
          </text>
          <text
            x="281"
            y="191"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            kernel
          </text>
          <text
            x="386"
            y="191"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            latency
          </text>
        </svg>
      )}
    </Scene>
  );
}
