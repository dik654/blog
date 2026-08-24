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
  id,
  active,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id: string;
  active: boolean;
}) {
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
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
        animate={{ opacity: active ? 1 : 0.42, pathLength: active ? 1 : 0.78 }}
      />
    </g>
  );
}

function Box({
  x,
  y,
  w,
  h,
  label,
  detail,
  active,
  dashed = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  detail?: string;
  active: boolean;
  dashed?: boolean;
}) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: active ? 1 : 0.58, scale: active ? 1.02 : 1 }}
      style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="7"
        fill={active ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "var(--background)"}
        stroke={active ? accent : border}
        strokeWidth="1.25"
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <text x={x + w / 2} y={y + h / 2 - (detail ? 4 : -3)} textAnchor="middle" className="fill-foreground text-[12px] font-bold sm:text-[10px]">
        {label}
      </text>
      {detail ? (
        <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" className="fill-muted-foreground text-[10px] sm:text-[8px]">
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
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
          {eyebrow} · {String(controls.active + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-7">{labels[controls.active]}</h3>
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

export function AugmentationContractViz() {
  const labels = ["배포에서 달라지는 것", "허용 transformation", "Target map", "Training objective"] as const;
  const notes = [
    "먼저 camera·조명·자세처럼 실제 deployment에서 달라질 원인을 관찰합니다.",
    "변환 뒤에도 task 의미가 유지되는 범위만 augmentation distribution에 넣습니다.",
    "Class는 유지할 수 있지만 box·mask·keypoint는 같은 parameter로 함께 옮겨야 합니다.",
    "매 step에 transform을 sampling해 허용한 변화 전체의 평균 loss를 줄입니다.",
  ] as const;
  return <Scene id="augmentation-contract-viz" eyebrow="Meaning before transform" title="현실의 변화가 training pair가 되는 순서" description="Deployment variation→transformation→target→objective를 한 단계씩 봅니다." labels={labels} notes={notes}>{(active) => <svg viewBox="0 0 360 210" role="img" aria-label={labels[active]} className="block h-auto w-full"><Box x={8} y={74} w={70} h={58} label="deployment" detail="light·pose" active={active === 0}/><Arrow x1={79} y1={103} x2={105} y2={103} id="aug-found-a" active={active >= 1}/><Box x={109} y={64} w={70} h={78} label="Tω" detail="allowed change" active={active === 1}/><Arrow x1={180} y1={103} x2={206} y2={103} id="aug-found-b" active={active >= 2}/><Box x={210} y={43} w={66} h={48} label="x′" detail="input" active={active === 2}/><Box x={210} y={116} w={66} h={48} label="τᵨ(y)" detail="target" active={active === 2}/><Arrow x1={277} y1={103} x2={302} y2={103} id="aug-found-c" active={active === 3}/><Box x={306} y={72} w={46} h={62} label="E loss" detail="train" active={active === 3}/></svg>}</Scene>;
}

export function ImageTransformViz() {
  const labels = ["한 좌표계", "Clip 뒤 visibility", "Photometric 변화", "Normalization 좌표"] as const;
  const notes = [
    "Image와 box·mask·keypoint가 같은 affine parameter를 공유합니다.",
    "Canvas 밖으로 나간 annotation은 clip한 뒤 남은 면적으로 keep·drop을 판정합니다.",
    "Brightness·contrast·hue는 좌표를 옮기지 않지만 target signal을 지울 수 있어 범위를 제한합니다.",
    "Random color transform 뒤에 고정 center·scale을 적용해 model input 좌표를 맞춥니다.",
  ] as const;
  return <Scene id="image-transform-viz" eyebrow="Pixels and annotations" title="Image transform은 좌표와 값의 두 경로를 가집니다" description="기하·visibility·색·normalization의 역할을 분리합니다." labels={labels} notes={notes}>{(active) => <svg viewBox="0 0 360 220" role="img" aria-label={labels[active]} className="block h-auto w-full"><rect x="14" y="38" width="88" height="116" rx="6" fill="var(--background)" stroke={active <= 1 ? accent : border} strokeWidth="1.25"/><rect x="35" y="65" width="45" height="54" fill="none" stroke={accent} strokeWidth="1.25"/><text x="58" y="177" textAnchor="middle" className="fill-muted-foreground text-[10px] sm:text-[8px]">image + box</text><Arrow x1={103} y1={96} x2={132} y2={96} id="image-aug-a" active={active <= 1}/><motion.g animate={{ rotate: active === 0 ? -8 : 0 }} style={{ transformOrigin: "177px 96px" }}><rect x="136" y="38" width="82" height="116" rx="6" fill="var(--background)" stroke={active <= 1 ? accent : border} strokeWidth="1.25"/><rect x="166" y="61" width="45" height="54" fill="none" stroke={accent} strokeWidth="1.25"/></motion.g><motion.line x1="207" y1="30" x2="207" y2="164" stroke={active === 1 ? accent : border} strokeWidth="1.25" strokeDasharray="4 4" animate={{ opacity: active === 1 ? 1 : 0 }}/><Arrow x1={220} y1={96} x2={247} y2={96} id="image-aug-b" active={active >= 2}/><Box x={251} y={42} w={96} h={50} label="jitter" detail="value change" active={active === 2}/><Box x={251} y={120} w={96} h={50} label="(x−μ)/σ" detail="fixed input" active={active === 3}/></svg>}</Scene>;
}

export function SampleMixingViz() {
  const labels = ["두 source sample", "Mixup", "CutMix", "Mosaic annotation"] as const;
  const notes = [
    "두 input뿐 아니라 두 target도 같은 composition receipt에 넣습니다.",
    "Mixup은 전체 tensor를 λ와 1−λ로 보간하고 target probability도 같은 비율로 섞습니다.",
    "CutMix는 pixel mask의 실제 visible area로 class target 비율을 다시 계산합니다.",
    "Mosaic은 각 tile의 resize·offset·clip을 annotation마다 적용하고 너무 작은 object를 걸러냅니다.",
  ] as const;
  return <Scene id="sample-mixing-viz" eyebrow="Input and target together" title="Mixing 방식마다 target을 만드는 규칙이 다릅니다" description="Source→Mixup→CutMix→Mosaic을 같은 canvas에서 비교합니다." labels={labels} notes={notes}>{(active) => <svg viewBox="0 0 360 220" role="img" aria-label={labels[active]} className="block h-auto w-full"><Box x={12} y={48} w={70} h={50} label="sample i" detail="xᵢ,yᵢ" active={active === 0}/><Box x={12} y={126} w={70} h={50} label="sample j" detail="xⱼ,yⱼ" active={active === 0}/><Arrow x1={83} y1={112} x2={117} y2={112} id="mix-a" active={active >= 1}/><rect x="122" y="45" width="92" height="132" rx="6" fill="var(--background)" stroke={active >= 1 ? accent : border} strokeWidth="1.25"/><motion.rect x="122" y="45" width="92" height="132" fill={accent} animate={{ opacity: active === 1 ? 0.13 : 0 }}/><motion.rect x="164" y="45" width="50" height="70" fill={accent} animate={{ opacity: active === 2 ? 0.18 : 0 }}/><motion.g animate={{ opacity: active === 3 ? 1 : 0 }}><line x1="168" y1="45" x2="168" y2="177" stroke={accent} strokeWidth="1.25"/><line x1="122" y1="111" x2="214" y2="111" stroke={accent} strokeWidth="1.25"/></motion.g><text x="168" y="199" textAnchor="middle" className="fill-muted-foreground text-[10px] sm:text-[8px]">composed input</text><Arrow x1={215} y1={112} x2={245} y2={112} id="mix-b" active={active >= 1}/><Box x={249} y={75} w={99} h={74} label={active === 1 ? "λyᵢ+(1−λ)yⱼ" : active === 2 ? "area target" : active === 3 ? "box union" : "target receipt"} detail="same composition" active={active >= 1}/></svg>}</Scene>;
}

export function TabularSynthesisViz() {
  const labels = ["Row schema", "Constraint ledger", "Train-fold synthesis", "Utility·privacy audit"] as const;
  const notes = [
    "Column type·unit·category만 맞아도 row 전체가 현실적이라는 뜻은 아닙니다.",
    "날짜 순서·부분합·entity 상태처럼 여러 column을 묶는 제약을 별도 ledger로 둡니다.",
    "Neighbor·generator는 split 뒤 training fold만 fit해 validation 정보를 보지 않게 합니다.",
    "유용성뿐 아니라 duplicate·membership leakage와 subgroup distortion을 함께 검사합니다.",
  ] as const;
  return <Scene id="tabular-synthesis-viz" eyebrow="A row is a system" title="Synthetic row는 column보다 넓은 계약을 통과해야 합니다" description="Schema→constraint→split→audit의 네 gate입니다." labels={labels} notes={notes}>{(active) => <svg viewBox="0 0 360 220" role="img" aria-label={labels[active]} className="block h-auto w-full">{[[12,"schema","type·unit"],[102,"ledger","start≤end"],[192,"train only","fit·sample"],[282,"audit","utility·privacy"]].map(([x,label,detail],index) => <g key={String(label)}><Box x={Number(x)} y={72} w={66} h={76} label={String(label)} detail={String(detail)} active={active === index}/>{index < 3 ? <Arrow x1={Number(x)+67} y1={110} x2={Number(x)+88} y2={110} id={`tab-syn-${index}`} active={active >= index+1}/> : null}</g>)}<motion.path d="M315 160C268 201 99 201 44 160" fill="none" stroke={accent} strokeWidth="1.25" strokeDasharray="5 4" initial={false} animate={{ opacity: active === 3 ? 1 : 0, pathLength: active === 3 ? 1 : 0 }}/></svg>}</Scene>;
}

export function AugmentationEvaluationViz() {
  const labels = ["Versioned policy", "Clean·robust 분리", "TTA inverse map", "Release or rollback"] as const;
  const notes = [
    "Transform 이름뿐 아니라 범위·확률·순서·seed·target map revision을 하나의 artifact로 고정합니다.",
    "원본 validation과 고정 shift slice를 별도 column으로 두어 난이도와 품질을 섞지 않습니다.",
    "Spatial prediction은 각 augmented view의 출력을 원래 좌표로 되돌린 뒤 결합합니다.",
    "Paired seed gain·calibration·slice·latency gate가 모두 통과할 때만 policy를 release합니다.",
  ] as const;
  return <Scene id="augmentation-evaluation-viz" eyebrow="Evidence before rollout" title="Policy artifact에서 release receipt까지" description="Config→evaluation→inverse mapping→decision을 연결합니다." labels={labels} notes={notes}>{(active) => <svg viewBox="0 0 360 220" role="img" aria-label={labels[active]} className="block h-auto w-full"><Box x={8} y={72} w={72} h={72} label="policy" detail="range·p·order" active={active === 0}/><Arrow x1={81} y1={108} x2={106} y2={108} id="aug-eval-a" active={active >= 1}/><Box x={110} y={39} w={72} h={52} label="clean" detail="original" active={active === 1}/><Box x={110} y={124} w={72} h={52} label="robust" detail="fixed shift" active={active === 1}/><Arrow x1={183} y1={108} x2={208} y2={108} id="aug-eval-b" active={active >= 2}/><Box x={212} y={70} w={70} h={76} label="Tₖ⁻¹" detail="align output" active={active === 2}/><Arrow x1={283} y1={108} x2={307} y2={108} id="aug-eval-c" active={active === 3}/><Box x={311} y={76} w={42} h={64} label="gate" detail="ship" active={active === 3}/><motion.path d="M332 153C285 202 83 202 44 155" fill="none" stroke={accent} strokeWidth="1.25" strokeDasharray="5 4" animate={{ opacity: active === 3 ? 1 : 0, pathLength: active === 3 ? 1 : 0 }} initial={false}/></svg>}</Scene>;
}
