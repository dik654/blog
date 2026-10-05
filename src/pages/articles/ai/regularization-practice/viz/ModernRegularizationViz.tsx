import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type Scene = {
  label: string;
  title: string;
  note: string;
  nodes: readonly { label: string; sub: string; shape: "circle" | "box" | "bar" }[];
};

function ConceptViz({
  id,
  eyebrow,
  title,
  description,
  scenes,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  scenes: readonly Scene[];
}) {
  const controls = useAnimatedScenes(scenes.length, 2600);
  const scene = scenes[controls.active];
  return (
    <VizFrame title={title} description={description} className="my-8">
      <div
        id={id}
        data-viz
        data-viz-canvas
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6"
      >
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">{eyebrow} · {String(controls.active + 1).padStart(2, "0")}</p>
        <h3 className="mt-2 min-h-[7.25rem] text-lg font-bold leading-7 sm:min-h-[2.5rem]">{scene.title}</h3>
        <svg viewBox="0 0 360 230" role="img" aria-label={`${scene.label}: ${scene.title}`} className="mx-auto mt-5 block h-auto w-full max-w-[560px] overflow-visible">
          <defs>
            <marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" className="text-muted-foreground" />
            </marker>
          </defs>
          {scene.nodes.slice(0, -1).map((_, index) => {
            const x1 = 45 + index * (270 / Math.max(scene.nodes.length - 1, 1));
            const x2 = 45 + (index + 1) * (270 / Math.max(scene.nodes.length - 1, 1));
            return <motion.line key={index} x1={x1 + 37} y1="104" x2={x2 - 37} y2="104" stroke="currentColor" className="text-muted-foreground" strokeWidth="1.25" markerEnd={`url(#${id}-arrow)`} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: .45, delay: index * .12 }} />;
          })}
          {scene.nodes.map((node, index) => {
            const x = 45 + index * (270 / Math.max(scene.nodes.length - 1, 1));
            return <motion.g key={`${scene.label}-${node.label}-${index}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35, delay: index * .12 }}>
              {node.shape === "circle" ? <circle cx={x} cy="104" r="32" fill="var(--background)" stroke="var(--primary)" strokeWidth="1.25" /> : node.shape === "bar" ? <><rect x={x - 36} y="64" width="72" height="80" rx="9" fill="var(--muted)" fillOpacity=".35" stroke="var(--border)" strokeWidth="1.25" /><rect x={x - 24} y={128 - index * 10} width="48" height={12 + index * 10} fill="var(--primary)" fillOpacity=".22" /></> : <rect x={x - 36} y="70" width="72" height="68" rx="10" fill="var(--background)" stroke="var(--primary)" strokeWidth="1.25" />}
              <text x={x} y="100" textAnchor="middle" fill="currentColor" className="fill-foreground text-[9px] font-bold">{node.label}</text>
              <text x={x} y="116" textAnchor="middle" fill="currentColor" className="fill-muted-foreground text-[7px]">{node.sub}</text>
            </motion.g>;
          })}
          <motion.path d="M45 184 H315" stroke="var(--border)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          {scene.nodes.map((node, index) => {
            const x = 45 + index * (270 / Math.max(scene.nodes.length - 1, 1));
            return <circle key={`${node.label}-${index}`} cx={x} cy="184" r={index <= controls.active ? 5 : 3} fill={index <= controls.active ? "var(--primary)" : "var(--muted-foreground)"} />;
          })}
        </svg>
        <p className="mt-2 min-h-[8.75rem] border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground sm:min-h-[3.5rem]">{scene.note}</p>
        <AnimatedSceneControls labels={scenes.map((item) => item.label)} {...controls} />
      </div>
    </VizFrame>
  );
}

export function GeneralizationDiagnosisViz() {
  return <ConceptViz id="generalization-diagnosis-viz" eyebrow="Evidence before treatment" title="Gap은 판결이 아니라 조사 시작 신호입니다" description="두 곡선의 차이를 본 뒤 원인 후보를 하나씩 제거하고 마지막에만 regularizer를 비교합니다." scenes={[
    { label: "두 위험", title: "같은 loss로 train과 validation을 나란히 잽니다", note: "절대 loss가 모두 높은지, validation만 벌어지는지부터 구분합니다.", nodes: [{ label: "Train", sub: "R̂tr", shape: "bar" }, { label: "Validation", sub: "R̂val", shape: "bar" }] },
    { label: "Gap", title: "Validation에서 train을 뺀 관측 차이를 만듭니다", note: "G가 크다는 사실만으로 모델의 과적합 원인을 확정하지 않습니다.", nodes: [{ label: "R̂tr", sub: ".18", shape: "circle" }, { label: "subtract", sub: "val − train", shape: "box" }, { label: "G", sub: ".13", shape: "circle" }] },
    { label: "원인 감사", title: "Data 경계·pipeline·noise·shift를 먼저 검사합니다", note: "Leakage나 preprocessing mismatch는 regularization으로 고칠 문제가 아닙니다.", nodes: [{ label: "Boundary", sub: "overlap?", shape: "box" }, { label: "Pipeline", sub: "same loss?", shape: "box" }, { label: "Noise", sub: "labels?", shape: "box" }, { label: "Shift", sub: "slices?", shape: "box" }] },
    { label: "한 축 비교", title: "원인이 남을 때 regularizer 하나만 바꿉니다", note: "같은 seeds·updates·search budget에서 fit, validation, slice, cost를 함께 비교합니다.", nodes: [{ label: "Baseline", sub: "fixed", shape: "circle" }, { label: "One change", sub: "one axis", shape: "box" }, { label: "Decision", sub: "gain + cost", shape: "circle" }] },
  ]} />;
}

export function DropoutMechanismViz() {
  return <ConceptViz id="dropout-mechanism-viz" eyebrow="h=2 · p=.25 · q=.75" title="한 train output은 0 또는 8/3이고 평균은 2입니다" description="같은 activation의 Bernoulli 선택, inverted scaling, 추가 분산, eval mode를 추적합니다." scenes={[
    { label: "h·p·q", title: "Activation 2에서 drop .25·keep .75를 고정합니다", note: "h=2, p=.25, q=1−p=.75가 이번 계산의 세 입력입니다.", nodes: [{ label: "h", sub: "2", shape: "circle" }, { label: "p", sub: ".25 drop", shape: "box" }, { label: "q", sub: ".75 keep", shape: "circle" }] },
    { label: "두 결과", title: "Mask가 0이면 0, 1이면 scaling 전 값 2가 남습니다", note: "매 train forward에서 m~Bernoulli(.75)를 새로 뽑습니다.", nodes: [{ label: "m=0", sub: "p=.25", shape: "box" }, { label: "output", sub: "0", shape: "circle" }, { label: "m=1", sub: "q=.75", shape: "box" }, { label: "m·h", sub: "2", shape: "circle" }] },
    { label: "8/3·평균2", title: "살아남은 2를 .75로 나누면 8/3입니다", note: "0×.25+(8/3)×.75=2지만 추가 분산은 4/3입니다. 한 forward가 2가 되는 것은 아닙니다.", nodes: [{ label: "m·h", sub: "2", shape: "box" }, { label: "÷ .75", sub: "1/q", shape: "circle" }, { label: "h̃", sub: "8/3", shape: "bar" }] },
    { label: "Eval=2", title: "일반 eval에서는 mask 없이 h=2를 그대로 씁니다", note: "MC dropout만 명시적으로 train-style mask를 켜며 sample count와 aggregation을 별도로 정합니다.", nodes: [{ label: "train()", sub: "0 or 8/3", shape: "box" }, { label: "mode", sub: "switch", shape: "circle" }, { label: "eval()", sub: "2", shape: "box" }] },
  ]} />;
}

export function WeightDecayMechanismViz() {
  return <ConceptViz id="weight-decay-mechanism-viz" eyebrow="Parameter update boundary" title="Data gradient와 weight 축소가 어디서 만나는지 봅니다" description="SGD 등가에서 시작해 adaptive preconditioner 밖의 AdamW 경로와 parameter group을 연결합니다." scenes={[
    { label: "Penalty", title: "L2는 loss에 weight 크기 penalty를 더합니다", note: "미분하면 현재 weight 방향의 λw가 data gradient에 더해집니다.", nodes: [{ label: "Data loss", sub: "Ldata", shape: "box" }, { label: "L2", sub: "λ||w||²/2", shape: "circle" }, { label: "Gradient", sub: "g + λw", shape: "box" }] },
    { label: "SGD", title: "Scalar SGD에서는 기존 weight를 곱셈으로 줄이는 꼴입니다", note: "(1−ηλ)w와 −ηg를 분리해 읽을 수 있습니다.", nodes: [{ label: "w", sub: "current", shape: "circle" }, { label: "×(1−ηλ)", sub: "shrink", shape: "box" }, { label: "−ηg", sub: "task step", shape: "box" }] },
    { label: "AdamW", title: "Adaptive task direction과 direct shrink를 두 갈래로 둡니다", note: "λw를 moment·variance에 넣지 않아 coordinate preconditioning과 분리합니다.", nodes: [{ label: "g", sub: "task", shape: "circle" }, { label: "Adam", sub: "m̂ / √v̂", shape: "box" }, { label: "shrink", sub: "ηλw", shape: "box" }, { label: "w next", sub: "combine", shape: "circle" }] },
    { label: "Groups", title: "모든 trainable parameter를 정확히 한 group에 배치합니다", note: "Decay와 no-decay의 합집합은 전체이고 교집합은 비어야 합니다.", nodes: [{ label: "Weights", sub: "decay", shape: "box" }, { label: "Bias·Norm", sub: "no decay", shape: "box" }, { label: "Coverage", sub: "exact once", shape: "circle" }] },
  ]} />;
}

export function EarlyStoppingMechanismViz() {
  return <ConceptViz id="early-stopping-mechanism-viz" eyebrow="δ=0 · P=2 · stop when c>P" title=".42→.38→.39→.40→.41에서 eval 5에 멈추고 eval 2를 돌려줍니다" description="관측 metric, best 저장, bad counter, restore artifact를 한 trajectory로 봅니다." scenes={[
    { label: "다섯 loss", title: "Validation loss는 .42, .38, .39, .40, .41입니다", note: "같은 cadence에서 loss를 minimize하며 δ=0으로 비교합니다.", nodes: [{ label: "e1", sub: ".42", shape: "bar" }, { label: "e2", sub: ".38", shape: "bar" }, { label: "e3", sub: ".39", shape: "bar" }, { label: "e4·e5", sub: ".40·.41", shape: "bar" }] },
    { label: "Best=e2", title: "Eval 2의 .38에서 best snapshot을 저장합니다", note: "이후 .39·.40·.41은 .38보다 낮지 않으므로 best가 아닙니다.", nodes: [{ label: "e1", sub: ".42", shape: "bar" }, { label: "e2", sub: ".38 best", shape: "bar" }, { label: "Save", sub: "j*=2", shape: "box" }] },
    { label: "c=1·2·3", title: "Eval 3·4·5에서 bad counter가 1·2·3이 됩니다", note: "P=2이고 stop 조건이 c>P이므로 c=2인 eval 4가 아니라 c=3인 eval 5에서 멈춥니다.", nodes: [{ label: "Eval 3", sub: "bad 1", shape: "bar" }, { label: "Eval 4", sub: "bad 2", shape: "bar" }, { label: "Eval 5", sub: "bad 3", shape: "bar" }] },
    { label: "Stop5→Best2", title: "Stop index 5와 return index 2를 분리합니다", note: "Eval 5에서 학습을 멈춘 뒤 immutable eval 2 artifact와 그 재현 state를 복원합니다.", nodes: [{ label: "Last", sub: "eval 5", shape: "box" }, { label: "Stop", sub: "c=3>P", shape: "circle" }, { label: "Return", sub: "eval 2", shape: "box" }] },
  ]} />;
}

export function LabelSmoothingMechanismViz() {
  return <ConceptViz id="label-smoothing-mechanism-viz" eyebrow="Target distribution" title="정답 질량 일부를 없애는 대신 모든 class에 나눕니다" description="One-hot, uniform prior, smoothed target, 다른 soft target과의 조합을 분리합니다." scenes={[
    { label: "One-hot", title: "원래 target은 정답 class 하나에 질량 1을 둡니다", note: "K=4에서 두 번째 class가 정답이면 (0,1,0,0)입니다.", nodes: [{ label: "c₁", sub: "0", shape: "bar" }, { label: "c₂", sub: "1", shape: "bar" }, { label: "c₃", sub: "0", shape: "bar" }, { label: "c₄", sub: "0", shape: "bar" }] },
    { label: "Uniform", title: "ε만큼 섞을 기준은 K classes의 균등 분포입니다", note: "Uniform prior의 각 class 질량은 1/K입니다.", nodes: [{ label: "c₁", sub: ".25", shape: "bar" }, { label: "c₂", sub: ".25", shape: "bar" }, { label: "c₃", sub: ".25", shape: "bar" }, { label: "c₄", sub: ".25", shape: "bar" }] },
    { label: "Mixture", title: "One-hot 90%와 uniform 10%를 더합니다", note: "결과는 (.025,.925,.025,.025)이며 합은 여전히 1입니다.", nodes: [{ label: "hard", sub: "× .9", shape: "circle" }, { label: "uniform", sub: "× .1", shape: "circle" }, { label: "add", sub: "classwise", shape: "box" }, { label: "ỹ", sub: "sum 1", shape: "bar" }] },
    { label: "Compose", title: "Mixup·distillation과 겹치면 최종 target을 다시 계산합니다", note: "기법 이름만 나열하지 말고 적용 순서와 최종 entropy·class mass를 확인합니다.", nodes: [{ label: "Mixup", sub: "soft target", shape: "box" }, { label: "Smoothing", sub: "uniform mix", shape: "box" }, { label: "Final ỹ", sub: "audit", shape: "bar" }] },
  ]} />;
}
