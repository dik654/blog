import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const accent = "var(--primary)";
const border = "var(--border)";
const muted = "var(--muted-foreground)";

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
        animate={{ opacity: active ? 1 : 0.22, pathLength: active ? 1 : 0.7 }}
      />
    </g>
  );
}

function Node({
  x,
  y,
  w,
  h,
  label,
  detail,
  active,
  shape = "box",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  detail?: string;
  active: boolean;
  shape?: "box" | "decision" | "store";
}) {
  const fill = active
    ? "color-mix(in srgb, var(--primary) 10%, transparent)"
    : "var(--background)";
  return (
    <motion.g
      initial={false}
      animate={{ opacity: active ? 1 : 0.36, scale: active ? 1.025 : 1 }}
      style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}
    >
      {shape === "decision" ? (
        <polygon
          points={`${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`}
          fill={fill}
          stroke={active ? accent : border}
          strokeWidth="1.25"
        />
      ) : shape === "store" ? (
        <>
          <ellipse
            cx={x + w / 2}
            cy={y + 7}
            rx={w / 2}
            ry="7"
            fill={fill}
            stroke={active ? accent : border}
            strokeWidth="1.25"
          />
          <path
            d={`M${x} ${y + 7}v${h - 14}c0 9 ${w} 9 ${w} 0V${y + 7}`}
            fill={fill}
            stroke={active ? accent : border}
            strokeWidth="1.25"
          />
        </>
      ) : (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx="7"
          fill={fill}
          stroke={active ? accent : border}
          strokeWidth="1.25"
        />
      )}
      <text
        x={x + w / 2}
        y={y + h / 2 - (detail ? 4 : -3)}
        textAnchor="middle"
        className="fill-foreground text-[9px] font-bold sm:text-[10px]"
      >
        {label}
      </text>
      {detail ? (
        <text
          x={x + w / 2}
          y={y + h / 2 + 12}
          textAnchor="middle"
          className="fill-muted-foreground text-[7px] sm:text-[8px]"
        >
          {detail}
        </text>
      ) : null}
    </motion.g>
  );
}

function Scene({
  id,
  eyebrow,
  title,
  description,
  labels,
  notes,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
}) {
  const controls = useAnimatedScenes(labels.length, 3300);
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
          {eyebrow} · {String(controls.active + 1).padStart(2, "0")}
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
        <AnimatedSceneControls labels={[...labels]} {...controls} />
      </div>
    </VizFrame>
  );
}

function ImageTiles({ active }: { active: boolean }) {
  return (
    <g>
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((column) => (
          <motion.rect
            key={`${row}-${column}`}
            x={28 + column * 18}
            y={58 + row * 18}
            width="14"
            height="14"
            fill={
              row === 1 && column === 1 && active ? accent : "var(--background)"
            }
            stroke={active ? accent : border}
            strokeWidth="1"
            initial={false}
            animate={{ opacity: active ? 1 : 0.34 }}
          />
        )),
      )}
    </g>
  );
}

export function ImageIdentityViz() {
  const labels = [
    "Files 뒤의 실제 identity 찾기",
    "같은 identity를 한 group으로 묶기",
    "Group 단위로 split하기",
    "Baseline receipt를 봉인하기",
  ] as const;
  const notes = [
    "Crop·resize·burst frame은 파일이 달라도 같은 대상의 파생물일 수 있습니다.",
    "Deployment에서 새로 만날 단위가 patient·product·session 중 무엇인지 먼저 정합니다.",
    "Train과 validation의 group intersection이 비어야 새 identity risk를 읽을 수 있습니다.",
    "Split·class map·input transform·weight·quality·runtime을 한 generation에 고정합니다.",
  ] as const;
  return (
    <Scene
      id="image-identity-viz"
      eyebrow="Files to evidence"
      title="Image 파일을 독립 sample로 착각하지 않기"
      description="Derivative files→identity group→split→receipt의 데이터 경계를 따라갑니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 360 220"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <ImageTiles active={active === 0} />
          <Node
            x={105}
            y={54}
            w={66}
            h={50}
            label="identity"
            detail="product-17"
            active={active === 1}
            shape="decision"
          />
          <Node
            x={205}
            y={35}
            w={61}
            h={40}
            label="train"
            detail="groups 01–80"
            active={active === 2}
          />
          <Node
            x={205}
            y={91}
            w={61}
            h={40}
            label="validation"
            detail="groups 81–90"
            active={active === 2}
          />
          <Node
            x={292}
            y={53}
            w={54}
            h={72}
            label="receipt"
            detail="gen-04"
            active={active === 3}
            shape="store"
          />
          <Arrow
            x1={83}
            y1={84}
            x2={103}
            y2={79}
            active={active >= 1}
            id="img-id-a"
          />
          <Arrow
            x1={172}
            y1={79}
            x2={202}
            y2={58}
            active={active >= 2}
            id="img-id-b"
          />
          <Arrow
            x1={172}
            y1={82}
            x2={202}
            y2={107}
            active={active >= 2}
            id="img-id-c"
          />
          <Arrow
            x1={268}
            y1={81}
            x2={289}
            y2={88}
            active={active >= 3}
            id="img-id-d"
          />
          <line
            x1="205"
            y1="151"
            x2="266"
            y2="151"
            stroke={active === 2 ? accent : border}
            strokeWidth="1.25"
          />
          <text
            x="235"
            y="169"
            textAnchor="middle"
            className="fill-muted-foreground text-[8px]"
          >
            intersection = ∅
          </text>
        </svg>
      )}
    </Scene>
  );
}

export function ImageBackboneViz() {
  const labels = [
    "Image area가 feature workload를 만듦",
    "CNN local window와 ViT token pairs 비교",
    "Depth·width·resolution을 함께 조절",
    "Target runtime frontier에서 선택",
  ] as const;
  const notes = [
    "한 변을 두 배로 하면 pixel area는 네 배가 되며 input resolution은 무료 knob가 아닙니다.",
    "Global attention은 patch token 수의 제곱만큼 pair score를 만들지만 실제 latency는 kernel과 memory에도 좌우됩니다.",
    "Compound scaling은 세 축의 균형을 찾는 heuristic이지 target hardware의 정답표가 아닙니다.",
    "같은 split·input·search budget에서 quality와 p95·throughput·memory를 함께 통과한 후보만 남깁니다.",
  ] as const;
  return (
    <Scene
      id="image-backbone-viz"
      eyebrow="Pixels to budget"
      title="Architecture 이름을 resource path로 다시 읽기"
      description="Spatial area→interaction pattern→scaling knobs→measured frontier를 연결합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 360 220"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <ImageTiles active={active === 0} />
          <Node
            x={104}
            y={38}
            w={69}
            h={48}
            label="CNN"
            detail="local windows"
            active={active === 1}
          />
          <Node
            x={104}
            y={102}
            w={69}
            h={48}
            label="ViT"
            detail="global pairs"
            active={active === 1}
          />
          <Node
            x={207}
            y={25}
            w={57}
            h={37}
            label="depth"
            detail="α^φ"
            active={active === 2}
          />
          <Node
            x={207}
            y={77}
            w={57}
            h={37}
            label="width"
            detail="β^φ"
            active={active === 2}
          />
          <Node
            x={207}
            y={129}
            w={57}
            h={37}
            label="resolution"
            detail="γ^φ"
            active={active === 2}
          />
          <Node
            x={292}
            y={69}
            w={56}
            h={62}
            label="frontier"
            detail="quality / ms"
            active={active === 3}
            shape="decision"
          />
          <Arrow
            x1={84}
            y1={82}
            x2={101}
            y2={65}
            active={active >= 1}
            id="img-back-a"
          />
          <Arrow
            x1={84}
            y1={87}
            x2={101}
            y2={125}
            active={active >= 1}
            id="img-back-b"
          />
          <Arrow
            x1={175}
            y1={62}
            x2={204}
            y2={48}
            active={active >= 2}
            id="img-back-c"
          />
          <Arrow
            x1={175}
            y1={126}
            x2={204}
            y2={145}
            active={active >= 2}
            id="img-back-d"
          />
          <Arrow
            x1={266}
            y1={95}
            x2={289}
            y2={99}
            active={active >= 3}
            id="img-back-e"
          />
          <polyline
            points="283,176 304,157 321,163 342,139"
            fill="none"
            stroke={active === 3 ? accent : border}
            strokeWidth="1.25"
          />
        </svg>
      )}
    </Scene>
  );
}

export function ImageTrainingViz() {
  const labels = [
    "Baseline stage를 고정",
    "Resolution handoff를 새 stage로 기록",
    "Weak view에서 pseudo-label 선택",
    "Strong view와 release gate 연결",
  ] as const;
  const notes = [
    "Split·preprocessing·checkpoint·optimizer clock이 고정된 run이 다음 변경의 비교 기준입니다.",
    "Resolution을 바꾸면 batch·crop·position state·local schedule도 함께 바뀌므로 별도 manifest가 필요합니다.",
    "Weak-view maximum confidence는 선택 gate일 뿐 correctness의 증명이 아닙니다.",
    "Class별 precision·coverage와 rollback 조건을 통과한 pseudo-label stage만 새 baseline이 됩니다.",
  ] as const;
  return (
    <Scene
      id="image-training-viz"
      eyebrow="Stage to release"
      title="Resolution과 pseudo-label을 한 덩어리 recipe로 숨기지 않기"
      description="Baseline→stage handoff→selection→consistency→release를 한 축씩 봅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 360 220"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Node
            x={18}
            y={72}
            w={66}
            h={54}
            label="baseline"
            detail="160px · gen-03"
            active={active === 0}
            shape="store"
          />
          <Node
            x={108}
            y={33}
            w={68}
            h={48}
            label="stage"
            detail="320px · batch64"
            active={active === 1}
          />
          <Node
            x={108}
            y={119}
            w={68}
            h={48}
            label="weak view"
            detail="qmax=.96"
            active={active === 2}
          />
          <Node
            x={211}
            y={119}
            w={68}
            h={48}
            label="strong view"
            detail="CE target"
            active={active === 3}
          />
          <Node
            x={298}
            y={69}
            w={52}
            h={62}
            label="release?"
            detail="P/C slices"
            active={active === 3}
            shape="decision"
          />
          <Arrow
            x1={86}
            y1={94}
            x2={105}
            y2={62}
            active={active >= 1}
            id="img-train-a"
          />
          <Arrow
            x1={86}
            y1={105}
            x2={105}
            y2={141}
            active={active >= 2}
            id="img-train-b"
          />
          <Arrow
            x1={178}
            y1={143}
            x2={208}
            y2={143}
            active={active >= 3}
            id="img-train-c"
          />
          <Arrow
            x1={281}
            y1={142}
            x2={300}
            y2={124}
            active={active >= 3}
            id="img-train-d"
          />
          <line
            x1="142"
            y1="83"
            x2="142"
            y2="115"
            stroke={active >= 2 ? accent : border}
            strokeWidth="1.25"
            strokeDasharray="4 4"
          />
          <text
            x="142"
            y="103"
            textAnchor="middle"
            className="fill-muted-foreground text-[7px]"
          >
            handoff
          </text>
        </svg>
      )}
    </Scene>
  );
}

function Bars({
  x,
  y,
  active,
  flat,
}: {
  x: number;
  y: number;
  active: boolean;
  flat: boolean;
}) {
  const heights = flat ? [39, 27, 19] : [58, 23, 9];
  return (
    <g>
      {heights.map((height, index) => (
        <motion.rect
          key={index}
          x={x + index * 17}
          y={y + 62 - height}
          width="12"
          height={height}
          fill={index === 0 && active ? accent : "var(--muted)"}
          stroke={active ? accent : border}
          strokeWidth="1"
          initial={false}
          animate={{ opacity: active ? 1 : 0.38 }}
        />
      ))}
    </g>
  );
}

export function ImageDecisionViz() {
  const labels = [
    "Logit은 아직 probability가 아님",
    "Temperature로 confidence scale 조정",
    "TTA·model predictions를 같은 의미로 결합",
    "Threshold·reject action을 versioning",
  ] as const;
  const notes = [
    "Raw score의 순서는 class ranking을 주지만 confidence 0.8의 빈도 의미를 자동으로 보장하지 않습니다.",
    "양수 temperature로 모든 logits를 나누면 argmax는 유지하면서 분포의 뾰족함만 조절합니다.",
    "Class order·calibration·transform validity가 같은 outputs만 정해진 순서로 결합합니다.",
    "Probability를 action으로 바꾸는 threshold·reject·latency budget은 model과 별도 serving contract입니다.",
  ] as const;
  return (
    <Scene
      id="image-decision-viz"
      eyebrow="Scores to actions"
      title="Logit·probability·decision 사이의 변환을 보존하기"
      description="각 화살표가 validation에서 선택할 별도 parameter와 failure boundary를 가집니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 360 220"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Bars x={20} y={50} active={active === 0} flat={false} />
          <text
            x="40"
            y="133"
            textAnchor="middle"
            className="fill-muted-foreground text-[8px]"
          >
            logits
          </text>
          <Node
            x={91}
            y={55}
            w={58}
            h={58}
            label="÷ T"
            detail="fit on cal"
            active={active === 1}
            shape="decision"
          />
          <Bars x={174} y={50} active={active === 1} flat />
          <Node
            x={245}
            y={31}
            w={50}
            h={39}
            label="TTA"
            detail="valid views"
            active={active === 2}
          />
          <Node
            x={245}
            y={89}
            w={50}
            h={39}
            label="models"
            detail="weights"
            active={active === 2}
          />
          <Node
            x={309}
            y={58}
            w={45}
            h={62}
            label="action"
            detail="τ / reject"
            active={active === 3}
            shape="decision"
          />
          <Arrow
            x1={69}
            y1={89}
            x2={88}
            y2={84}
            active={active >= 1}
            id="img-dec-a"
          />
          <Arrow
            x1={151}
            y1={84}
            x2={171}
            y2={84}
            active={active >= 1}
            id="img-dec-b"
          />
          <Arrow
            x1={224}
            y1={84}
            x2={242}
            y2={54}
            active={active >= 2}
            id="img-dec-c"
          />
          <Arrow
            x1={224}
            y1={88}
            x2={242}
            y2={107}
            active={active >= 2}
            id="img-dec-d"
          />
          <Arrow
            x1={297}
            y1={79}
            x2={306}
            y2={82}
            active={active >= 3}
            id="img-dec-e"
          />
          <text
            x="270"
            y="158"
            textAnchor="middle"
            className="fill-muted-foreground text-[8px]"
          >
            class order · split digest · latency
          </text>
        </svg>
      )}
    </Scene>
  );
}
