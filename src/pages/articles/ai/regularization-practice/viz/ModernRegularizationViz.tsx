import { motion } from "framer-motion";
import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
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
        <h3 className="mt-2 text-lg font-bold leading-7">{scene.title}</h3>
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
        <p className="mt-2 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{scene.note}</p>
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
  return <ConceptViz id="dropout-mechanism-viz" eyebrow="Stochastic activation path" title="Mask는 학습 때만 통로를 끄고 살아남은 값을 키웁니다" description="Bernoulli 선택, inverted scaling, evaluation mode를 서로 다른 장면으로 봅니다." scenes={[
    { label: "Activation", title: "Dropout 전에는 모든 activation이 다음 층의 후보입니다", note: "h는 아직 random mask를 적용하지 않은 feature vector입니다.", nodes: [{ label: "h₁", sub: "2.0", shape: "circle" }, { label: "h₂", sub: "1.2", shape: "circle" }, { label: "h₃", sub: "0.7", shape: "circle" }] },
    { label: "Mask", title: "각 통로에 0 또는 1인 Bernoulli mask를 붙입니다", note: "Element dropout과 channel dropout은 mask를 공유하는 축이 다릅니다.", nodes: [{ label: "keep", sub: "m=1", shape: "circle" }, { label: "drop", sub: "m=0", shape: "box" }, { label: "keep", sub: "m=1", shape: "circle" }] },
    { label: "Scale", title: "살아남은 값만 1/q배 해 평균 크기를 맞춥니다", note: "평균은 보존되지만 한 번의 forward 결과와 downstream nonlinear output은 같지 않습니다.", nodes: [{ label: "m·h", sub: "selected", shape: "box" }, { label: "÷ q", sub: "inverted", shape: "circle" }, { label: "h̃", sub: "noisy", shape: "bar" }] },
    { label: "Eval", title: "평가할 때는 mask 없이 전체 경로를 사용합니다", note: "MC dropout은 예외적인 추론 protocol이므로 sampling 횟수와 aggregation을 별도로 정의합니다.", nodes: [{ label: "train()", sub: "sample mask", shape: "box" }, { label: "mode switch", sub: "module state", shape: "circle" }, { label: "eval()", sub: "all paths", shape: "box" }] },
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
  return <ConceptViz id="early-stopping-mechanism-viz" eyebrow="Trajectory selection" title="멈추는 checkpoint와 반환하는 checkpoint는 다를 수 있습니다" description="Validation event가 best artifact와 bad-event counter를 어떻게 바꾸는지 순서대로 봅니다." scenes={[
    { label: "Evaluate", title: "정해진 cadence마다 validation metric을 관측합니다", note: "Patience 단위는 update가 아니라 evaluation event입니다.", nodes: [{ label: "Train", sub: "updates", shape: "box" }, { label: "Eval", sub: "val loss", shape: "circle" }, { label: "Receipt", sub: "step + metric", shape: "box" }] },
    { label: "Improve", title: "Threshold보다 좋아진 순간 best snapshot을 저장합니다", note: "Model뿐 아니라 optimizer, preprocessing, config digest도 durable artifact에 묶습니다.", nodes: [{ label: "Metric", sub: ".38", shape: "bar" }, { label: "Compare", sub: "best − δ", shape: "circle" }, { label: "Save", sub: "j*", shape: "box" }] },
    { label: "Wait", title: "개선이 없을 때 bad-event counter를 하나 올립니다", note: "Evaluation cadence가 바뀌면 같은 patience라도 허용 update 수가 달라집니다.", nodes: [{ label: "Eval 3", sub: "bad 1", shape: "bar" }, { label: "Eval 4", sub: "bad 2", shape: "bar" }, { label: "Eval 5", sub: "bad 3", shape: "bar" }] },
    { label: "Restore", title: "Stop event 뒤 last가 아니라 best artifact를 복원합니다", note: "새 process에서 best metric과 prediction을 재현해야 선택 계약이 닫힙니다.", nodes: [{ label: "Last", sub: "eval 5", shape: "box" }, { label: "Stop", sub: "P exceeded", shape: "circle" }, { label: "Best", sub: "eval 2", shape: "box" }] },
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
