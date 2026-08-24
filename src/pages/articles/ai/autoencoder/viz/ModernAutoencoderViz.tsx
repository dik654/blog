import { motion } from "framer-motion";
import VizFrame from "@/components/viz/VizFrame";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

type Shape = "sample" | "bottleneck" | "plane" | "mask" | "gauge";

interface Scene {
  label: string;
  caption: string;
  shape: Shape;
}

interface LearningVizProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  scenes: readonly Scene[];
  edgeLabels: readonly string[];
  notes: readonly string[];
  note: string;
}

function Glyph({ shape, active }: { shape: Shape; active: boolean }) {
  const stroke = active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))";
  if (shape === "sample") {
    return (
      <svg viewBox="0 0 112 82" aria-hidden className="h-20 w-28">
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3, 4].map((column) => (
            <motion.rect
              key={`${row}-${column}`}
              x={9 + column * 19}
              y={7 + row * 17}
              width="13"
              height="11"
              rx="2"
              fill={active && (row + column) % 3 === 0 ? "hsl(var(--primary) / .28)" : "hsl(var(--muted) / .7)"}
              stroke={stroke}
              strokeWidth="1"
              animate={active ? { opacity: [0.55, 1, 0.55] } : undefined}
              transition={{ duration: 1.4, repeat: Infinity, delay: (row + column) * 0.04 }}
            />
          )),
        )}
      </svg>
    );
  }
  if (shape === "bottleneck") {
    return (
      <svg viewBox="0 0 112 82" aria-hidden className="h-20 w-28">
        <path d="M10 9h28l17 26L38 73H10zM102 9H74L57 35l17 38h28z" fill="hsl(var(--muted) / .55)" stroke={stroke} strokeWidth="1.25" />
        <motion.circle cx="56" cy="41" r="8" fill="hsl(var(--primary) / .2)" stroke="hsl(var(--primary))" strokeWidth="1.25" animate={active ? { opacity: [.45, 1, .45] } : { opacity: .65 }} transition={{ duration: 1.25, repeat: active ? Infinity : 0 }} />
      </svg>
    );
  }
  if (shape === "plane") {
    return (
      <svg viewBox="0 0 112 82" aria-hidden className="h-20 w-28">
        <path d="M13 68 98 14M14 70h86M14 70V9" fill="none" stroke={stroke} strokeWidth="1.25" />
        {[[26,57],[36,51],[47,44],[58,38],[70,31],[82,25]].map(([x,y], index) => <motion.circle key={x} cx={x} cy={y} r="4" fill="hsl(var(--primary) / .34)" stroke="hsl(var(--primary))" strokeWidth="1" animate={active ? { cy: [y, y - 3, y] } : undefined} transition={{ duration: 1.4, repeat: Infinity, delay: index * .08 }} />)}
      </svg>
    );
  }
  if (shape === "mask") {
    return (
      <svg viewBox="0 0 112 82" aria-hidden className="h-20 w-28">
        {[0,1,2].map((row) => [0,1,2,3].map((column) => {
          const hidden = (row + column) % 3 !== 0;
          return <motion.rect key={`${row}-${column}`} x={16 + column * 21} y={13 + row * 20} width="15" height="14" fill={hidden ? "hsl(var(--foreground) / .08)" : "hsl(var(--primary) / .3)"} stroke={hidden ? "hsl(var(--border))" : "hsl(var(--primary))"} strokeWidth="1" animate={active && hidden ? { opacity: [.2,.85,.2] } : undefined} transition={{ duration: 1.5, repeat: Infinity, delay: (row+column)*.06 }} />;
        }))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 112 82" aria-hidden className="h-20 w-28">
      <path d="M18 66a38 38 0 0 1 76 0" fill="none" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" />
      <motion.path d="M56 66 78 34" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.25" strokeLinecap="round" animate={active ? { rotate: [-10, 8, -10] } : undefined} style={{ transformOrigin: "56px 66px" }} transition={{ duration: 1.3, repeat: Infinity }} />
      <circle cx="56" cy="66" r="5" fill="hsl(var(--primary))" />
    </svg>
  );
}

function FlowArrow({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="grid shrink-0 place-items-center gap-1 py-1 lg:w-14">
      <svg viewBox="0 0 54 22" aria-hidden className="h-7 w-11 rotate-90 lg:rotate-0">
        <motion.path d="M3 11h41" fill="none" stroke="currentColor" strokeWidth="1.25" strokeDasharray="5 4" className={active ? "text-primary" : "text-border"} animate={active ? { strokeDashoffset: [9, 0] } : undefined} transition={{ duration: .75, repeat: Infinity, ease: "linear" }} />
        <path d="m39 5 10 6-10 6" fill="none" stroke="currentColor" strokeWidth="1.25" className={active ? "text-primary" : "text-border"} />
      </svg>
      <span className="max-w-14 text-center font-mono text-[9px] font-bold text-muted-foreground">{label}</span>
    </div>
  );
}

function LearningViz({ id, eyebrow, title, description, scenes, edgeLabels, notes, note }: LearningVizProps) {
  const controls = useAnimatedScenes(scenes.length, 2100);
  return (
    <VizFrame eyebrow={eyebrow} title={title} description={description} note={note}>
      <div data-viz={id} tabIndex={0} role="group" aria-label={`${title} animation`} onKeyDown={controls.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div data-viz-canvas className="grid min-w-0 gap-2 lg:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)_3.5rem_minmax(0,1fr)_3.5rem_minmax(0,1fr)] lg:items-center">
          {scenes.map((scene, index) => {
            const selected = index === controls.active;
            const reached = index <= controls.active;
            return <div key={scene.label} className="contents">
              <motion.div className={`grid min-w-0 place-items-center border px-2 py-4 ${selected ? "border-primary bg-primary/[.07]" : reached ? "border-primary/40 bg-primary/[.025]" : "border-border bg-background"}`} animate={selected && controls.playing ? { y: [0,-3,0] } : undefined} transition={{ duration: .9, repeat: Infinity }}>
                <Glyph shape={scene.shape} active={selected} />
                <strong className="mt-2 text-center text-sm leading-5">{scene.label}</strong>
                <p className="mt-1 max-w-44 text-center text-[11px] leading-5 text-muted-foreground">{scene.caption}</p>
              </motion.div>
              {index < scenes.length - 1 ? <FlowArrow active={controls.active > index} label={edgeLabels[index]} /> : null}
            </div>;
          })}
        </div>
        <div className="mt-5 border-l border-primary/60 pl-4">
          <p className="font-mono text-[10px] font-black uppercase tracking-[.14em] text-primary">CUT {String(controls.active + 1).padStart(2,"0")}</p>
          <p className="mt-1 text-sm font-bold">{scenes[controls.active].label}</p>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">{notes[controls.active]}</p>
        </div>
        <AnimatedSceneControls labels={scenes.map((scene) => scene.label)} active={controls.active} playing={controls.playing} reducedMotion={controls.reducedMotion} setActive={controls.setActive} setPlaying={controls.setPlaying} />
      </div>
    </VizFrame>
  );
}

export function AutoencoderFoundationViz() {
  return <LearningViz id="autoencoder-foundation-flow" eyebrow="Reconstruction path" title="입력은 좁은 통로를 지나 다시 같은 형태로 돌아옵니다" description="각 장면은 값을 하나씩 추가합니다. 마지막에야 loss와 failure를 조합합니다." scenes={[
    { label: "Input x", caption: "복원할 관측값의 shape", shape: "sample" },
    { label: "Latent z", caption: "decoder가 볼 수 있는 유일한 중간값", shape: "bottleneck" },
    { label: "Reconstruction x̂", caption: "input과 같은 shape의 예측", shape: "sample" },
    { label: "Validation", caption: "복원과 representation을 따로 평가", shape: "gauge" },
  ]} edgeLabels={["encode", "decode", "compare"]} notes={[
    "먼저 sample·feature axis와 값 범위를 고정합니다. Input이 target이라는 사실은 아직 학습된 representation을 뜻하지 않습니다.",
    "Latent는 decoder에 전달되는 interface입니다. Undercomplete는 coordinate 수를 줄이지만 bit 수와 semantic 의미까지 자동으로 정하지 않습니다.",
    "Decoder는 encoder의 역함수가 아니라 z에서 x̂를 만들도록 함께 학습된 별도 함수입니다.",
    "Training loss와 held-out reconstruction, downstream probe를 나눠 identity 복사와 유용한 표현을 구분합니다.",
  ]} note="공간 제약·corruption·sparsity는 서로 다른 방법입니다. 이 Viz는 가장 작은 deterministic 계약만 보여 줍니다." />;
}

export function LinearPcaViz() {
  return <LearningViz id="linear-autoencoder-pca-flow" eyebrow="Rank-k geometry" title="흩어진 점을 가장 잘 보존하는 k차원 평면을 고릅니다" description="Centering과 linear rank 제한이 있을 때만 autoencoder 문제가 PCA 부분공간으로 접힙니다." scenes={[
    { label: "Centered data", caption: "feature mean을 원점으로 이동", shape: "sample" },
    { label: "Rank-k map", caption: "k개 방향만 통과", shape: "bottleneck" },
    { label: "Principal plane", caption: "squared error가 최소인 부분공간", shape: "plane" },
    { label: "Boundary check", caption: "nonlinearity·loss·bias 확인", shape: "gauge" },
  ]} edgeLabels={["center", "optimize", "qualify"]} notes={[
    "Mean을 빼지 않으면 원점을 지나는 projection 문제와 affine reconstruction 문제가 섞입니다.",
    "Linear encoder와 decoder의 합성은 rank k 이하입니다. 여기서 bottleneck이 정리의 admissible map을 제한합니다.",
    "Eckart–Young 정리가 top-k singular subspace의 최소 Frobenius error를 줍니다. Basis 자체는 회전·scale로 유일하지 않습니다.",
    "ReLU·BCE·uncentered data·다른 regularizer가 들어오면 같은 정리를 그대로 인용하지 않습니다.",
  ]} note="같아지는 것은 최적 reconstruction subspace입니다. 특정 latent coordinate 이름이나 nonlinear representation 전체가 PCA와 같다는 뜻이 아닙니다." />;
}

export function DenoisingMaskedViz() {
  return <LearningViz id="denoising-masked-autoencoder-flow" eyebrow="Corruption curriculum" title="먼저 무엇을 숨길지 정하고, 그 다음 clean target을 복원합니다" description="Noise와 mask를 input transformation으로 먼저 그린 뒤 encoder·decoder objective를 조합합니다." scenes={[
    { label: "Clean x", caption: "복원해야 할 원본 target", shape: "sample" },
    { label: "Corrupt x̃", caption: "noise·dropout·mask 규칙", shape: "mask" },
    { label: "Visible evidence", caption: "encoder가 실제로 보는 부분", shape: "bottleneck" },
    { label: "Missing content", caption: "decoder가 원본과 비교", shape: "sample" },
  ]} edgeLabels={["sample q", "encode", "reconstruct"]} notes={[
    "Clean sample x는 supervision target입니다. 별도 class label 없이도 원본 좌표가 정답을 제공합니다.",
    "q(x̃|x)가 어떤 정보를 지우는지 먼저 명시합니다. Corruption이 task signal까지 없애면 좋은 objective가 아닙니다.",
    "Denoising AE는 손상된 전체 입력을, MAE는 visible patch만 encoder에 보내는 asymmetric 계산을 쓸 수 있습니다.",
    "Loss는 clean 또는 missing region과 비교합니다. 75% image masking은 특정 MAE recipe이지 모든 modality의 상수가 아닙니다.",
  ]} note="Denoising과 masking은 단순 data augmentation 이름이 아니라 encoder input과 target을 다르게 만드는 학습 계약입니다." />;
}

export function ReconstructionAnomalyViz() {
  return <LearningViz id="reconstruction-anomaly-flow" eyebrow="Operational decision" title="복원 오차는 점수이고, anomaly 판정은 별도 calibration입니다" description="Sample distance에서 바로 alarm으로 점프하지 않고 validation distribution과 threshold를 거칩니다." scenes={[
    { label: "Reconstruct", caption: "x와 x̂를 같은 좌표로 비교", shape: "sample" },
    { label: "Score s(x)", caption: "sample별 거리 하나로 reduction", shape: "gauge" },
    { label: "Threshold τ", caption: "false alarm·recall로 선택", shape: "plane" },
    { label: "Monitor drift", caption: "배포 score 분포를 재검증", shape: "gauge" },
  ]} edgeLabels={["reduce", "calibrate", "operate"]} notes={[
    "Feature scale과 missing-value policy를 고정한 뒤 sample별 unreduced reconstruction을 계산합니다.",
    "큰 score는 낯섦의 후보일 뿐 anomaly label이 아닙니다. 정상과 이상 score가 실제로 분리되는지 봅니다.",
    "τ는 training loss가 자동으로 주지 않습니다. Labeled validation에서 false-positive cost와 recall을 함께 선택합니다.",
    "정상 분포가 바뀌거나 decoder가 anomaly도 잘 복원하면 calibration이 무너집니다. score drift와 delayed label을 추적합니다.",
  ]} note="운영 계약은 model checkpoint·preprocessing·score reduction·threshold provenance·drift alarm을 하나의 receipt로 묶습니다." />;
}
