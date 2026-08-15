import { motion } from "framer-motion";
import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

type NodeKind = "token" | "state" | "gate" | "store";
type Node = { label: string; sub: string; kind: NodeKind };
type Scene = {
  label: string;
  title: string;
  note: string;
  nodes: readonly Node[];
};

function BertFlow({
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
  const controls = useAnimatedScenes(scenes.length, 2500);
  const scene = scenes[controls.active];
  const count = scene.nodes.length;
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
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
          {eyebrow} · {String(controls.active + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-7">{scene.title}</h3>
        <svg
          viewBox="0 0 360 230"
          role="img"
          aria-label={`${scene.label}: ${scene.title}`}
          className="mx-auto mt-5 block h-auto w-full max-w-[560px] overflow-visible"
        >
          <defs>
            <marker
              id={`${id}-arrow`}
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <path d="M0 0 L8 4 L0 8 Z" fill="var(--muted-foreground)" />
            </marker>
          </defs>
          {scene.nodes.slice(0, -1).map((_, i) => {
            const x1 = 45 + i * (270 / Math.max(count - 1, 1));
            const x2 = 45 + (i + 1) * (270 / Math.max(count - 1, 1));
            return (
              <motion.line
                key={i}
                x1={x1 + 35}
                y1="104"
                x2={x2 - 35}
                y2="104"
                stroke="var(--muted-foreground)"
                strokeWidth="1.25"
                markerEnd={`url(#${id}-arrow)`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
              />
            );
          })}
          {scene.nodes.map((n, i) => {
            const x = 45 + i * (270 / Math.max(count - 1, 1));
            return (
              <motion.g
                key={`${scene.label}-${n.label}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.12 }}
              >
                {n.kind === "token" ? (
                  <rect
                    x={x - 34}
                    y="73"
                    width="68"
                    height="62"
                    rx="7"
                    fill="var(--background)"
                    stroke="var(--primary)"
                    strokeWidth="1.25"
                  />
                ) : n.kind === "state" ? (
                  <circle
                    cx={x}
                    cy="104"
                    r="32"
                    fill="var(--primary)"
                    fillOpacity=".08"
                    stroke="var(--primary)"
                    strokeWidth="1.25"
                  />
                ) : n.kind === "gate" ? (
                  <path
                    d={`M${x} 67 L${x + 36} 104 L${x} 141 L${x - 36} 104 Z`}
                    fill="var(--background)"
                    stroke="var(--primary)"
                    strokeWidth="1.25"
                  />
                ) : (
                  <path
                    d={`M${x - 34} 76 Q${x} 64 ${x + 34} 76 V132 Q${x} 144 ${x - 34} 132 Z`}
                    fill="var(--muted)"
                    fillOpacity=".35"
                    stroke="var(--border)"
                    strokeWidth="1.25"
                  />
                )}
                <text
                  x={x}
                  y="101"
                  textAnchor="middle"
                  className="fill-foreground text-[9px] font-bold"
                >
                  {n.label}
                </text>
                <text
                  x={x}
                  y="117"
                  textAnchor="middle"
                  className="fill-muted-foreground text-[7px]"
                >
                  {n.sub}
                </text>
              </motion.g>
            );
          })}
          <path d="M45 184 H315" stroke="var(--border)" strokeWidth="1" />
          {scene.nodes.map((n, i) => {
            const x = 45 + i * (270 / Math.max(count - 1, 1));
            return (
              <circle
                key={`${n.label}-${i}`}
                cx={x}
                cy="184"
                r="4"
                fill={
                  i <= controls.active
                    ? "var(--primary)"
                    : "var(--muted-foreground)"
                }
              />
            );
          })}
        </svg>
        <p className="mt-2 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
          {scene.note}
        </p>
        <AnimatedSceneControls
          labels={scenes.map((s) => s.label)}
          {...controls}
        />
      </div>
    </VizFrame>
  );
}

export const BertVisibilityViz = () => (
  <BertFlow
    id="bert-visibility-modern"
    eyebrow="Encoder visibility"
    title="한 token state가 양쪽 실제 token을 읽습니다"
    description="Token row, visibility gate, contextual state를 한 장면씩 연결합니다."
    scenes={[
      {
        label: "Token rows",
        title: "입력 token마다 하나의 vector row를 만듭니다",
        note: "같은 word type도 문장 위치와 주변 token에 따라 다른 contextual state가 됩니다.",
        nodes: [
          { label: "token i−1", sub: "left", kind: "token" },
          { label: "token i", sub: "query", kind: "token" },
          { label: "token i+1", sub: "right", kind: "token" },
        ],
      },
      {
        label: "Visibility",
        title: "Query i는 왼쪽과 오른쪽 실제 token key를 모두 엽니다",
        note: "Causal triangle이 아니라 real-token rectangle이며 PAD column은 닫습니다.",
        nodes: [
          { label: "left key", sub: "visible", kind: "token" },
          { label: "query i", sub: "reads", kind: "gate" },
          { label: "right key", sub: "visible", kind: "token" },
          { label: "PAD", sub: "blocked", kind: "store" },
        ],
      },
      {
        label: "Context",
        title: "허용된 token의 정보를 가중합해 state hᵢ를 만듭니다",
        note: "양방향이라는 말은 두 방향 생성기가 아니라 입력 전체를 읽는 encoder visibility를 뜻합니다.",
        nodes: [
          { label: "allowed", sub: "K,V", kind: "store" },
          { label: "attention", sub: "weighted mix", kind: "gate" },
          { label: "hᵢ", sub: "contextual", kind: "state" },
        ],
      },
      {
        label: "Boundary",
        title: "미래가 아직 없는 streaming 생성에는 같은 mask를 쓰지 않습니다",
        note: "BERT는 입력이 모두 주어진 이해 작업에 맞고 자유 형식 causal decoding은 별도 구조입니다.",
        nodes: [
          { label: "full input", sub: "observed", kind: "store" },
          { label: "BERT", sub: "encode", kind: "state" },
          { label: "task head", sub: "finite output", kind: "gate" },
        ],
      },
    ]}
  />
);

export const BertPackingViz = () => (
  <BertFlow
    id="bert-packing-modern"
    eyebrow="Four aligned tensors"
    title="Token·position·segment·padding은 같은 길이의 다른 표입니다"
    description="Special token sequence를 만든 뒤 세 metadata row를 정확히 맞춥니다."
    scenes={[
      {
        label: "Tokens",
        title: "[CLS] A [SEP] B [SEP] 뒤에만 [PAD]를 붙입니다",
        note: "Special-token ID는 tokenizer와 checkpoint embedding row의 공동 계약입니다.",
        nodes: [
          { label: "[CLS]", sub: "start", kind: "token" },
          { label: "A [SEP]", sub: "segment A", kind: "token" },
          { label: "B [SEP]", sub: "segment B", kind: "token" },
          { label: "[PAD]", sub: "length only", kind: "store" },
        ],
      },
      {
        label: "Position",
        title: "각 실제 slot에 absolute position index를 붙입니다",
        note: "원 BERT는 learned position table 범위를 넘는 index를 자동 외삽하지 않습니다.",
        nodes: [
          { label: "0", sub: "CLS", kind: "token" },
          { label: "1…a", sub: "A", kind: "token" },
          { label: "a+1…", sub: "B", kind: "token" },
          { label: "limit", sub: "max length", kind: "gate" },
        ],
      },
      {
        label: "Segment",
        title: "A와 B의 소속을 token-type row로 분리합니다",
        note: "Checkpoint의 type-vocab size가 1이면 두 segment ID를 가정하면 안 됩니다.",
        nodes: [
          { label: "type 0", sub: "A side", kind: "store" },
          { label: "[SEP]", sub: "boundary", kind: "gate" },
          { label: "type 1", sub: "B side", kind: "store" },
        ],
      },
      {
        label: "Padding",
        title: "Attention mask는 content가 아닌 PAD key만 닫습니다",
        note: "Vocabulary token [MASK]와 padding attention mask는 이름만 비슷한 다른 물체입니다.",
        nodes: [
          { label: "real", sub: "mask 1", kind: "token" },
          { label: "PAD", sub: "mask 0", kind: "store" },
          { label: "logit", sub: "add −∞", kind: "gate" },
          { label: "weight", sub: "0", kind: "state" },
        ],
      },
    ]}
  />
);

export const BertMlmViz = () => (
  <BertFlow
    id="bert-mlm-modern"
    eyebrow="Corrupt then recover"
    title="정답 위치 선택과 model 입력 변경은 두 번의 sampling입니다"
    description="15% selection과 80/10/10 branch를 분리해 loss 위치를 추적합니다."
    scenes={[
      {
        label: "Select",
        title: "전체 실제 token 중 약 15%만 prediction target으로 고릅니다",
        note: "Special token과 PAD의 제외 규칙, static/dynamic masking을 collator revision에 고정합니다.",
        nodes: [
          { label: "tokens", sub: "10000", kind: "store" },
          { label: "sample", sub: "15%", kind: "gate" },
          { label: "targets M", sub: "1500", kind: "state" },
        ],
      },
      {
        label: "Corrupt",
        title: "선택된 위치 안에서만 80·10·10 branch를 나눕니다",
        note: "전체 token의 80%가 [MASK]가 아니라 selected 15%의 80%입니다.",
        nodes: [
          { label: "[MASK]", sub: "1200", kind: "token" },
          { label: "random", sub: "150", kind: "token" },
          { label: "unchanged", sub: "150", kind: "token" },
        ],
      },
      {
        label: "Encode",
        title: "Model은 corrupted sequence 전체를 양방향으로 읽습니다",
        note: "Target token 자체를 그대로 보이는 shortcut을 줄이면서 주변 context는 유지합니다.",
        nodes: [
          { label: "x̃", sub: "corrupted", kind: "store" },
          { label: "encoder", sub: "bidirectional", kind: "state" },
          { label: "hᵢ", sub: "selected state", kind: "state" },
        ],
      },
      {
        label: "Recover",
        title: "Loss는 선택 위치의 원래 vocabulary ID에만 계산합니다",
        note: "MLM은 left-to-right joint generation likelihood가 아니라 selected conditional reconstruction입니다.",
        nodes: [
          { label: "hᵢ", sub: "selected", kind: "state" },
          { label: "vocab head", sub: "softmax", kind: "gate" },
          { label: "xᵢ", sub: "original ID", kind: "token" },
        ],
      },
    ]}
  />
);

export const BertObjectiveViz = () => (
  <BertFlow
    id="bert-objectives-modern"
    eyebrow="Supervision unit"
    title="NSP·SOP·RTD는 서로 다른 위치에 label을 붙입니다"
    description="이름의 연대기가 아니라 example construction과 prediction unit을 비교합니다."
    scenes={[
      {
        label: "NSP",
        title: "[CLS] 하나가 실제 next segment인지 random인지 맞힙니다",
        note: "Random-document negative는 topic 차이라는 쉬운 단서를 만들 수 있습니다.",
        nodes: [
          { label: "A", sub: "segment", kind: "store" },
          { label: "B", sub: "next/random", kind: "store" },
          { label: "[CLS]", sub: "binary", kind: "gate" },
        ],
      },
      {
        label: "SOP",
        title: "같은 문서 A·B가 정상 순서인지 뒤집혔는지 맞힙니다",
        note: "Topic을 같게 두고 coherence와 order 단서에 더 집중합니다.",
        nodes: [
          { label: "A→B", sub: "positive", kind: "store" },
          { label: "B→A", sub: "negative", kind: "store" },
          { label: "order", sub: "binary", kind: "gate" },
        ],
      },
      {
        label: "RTD",
        title: "Generator가 바꾼 token인지 각 위치에서 판별합니다",
        note: "Selected vocabulary 복원보다 조밀한 binary supervision이지만 generator 비용과 label convention이 필요합니다.",
        nodes: [
          { label: "generator", sub: "replace", kind: "gate" },
          { label: "all tokens", sub: "inspect", kind: "store" },
          { label: "original?", sub: "per position", kind: "gate" },
        ],
      },
      {
        label: "Compare",
        title: "같은 compute·data에서 공통 downstream task로 비교합니다",
        note: "RoBERTa·ALBERT·ELECTRA는 objective 외 architecture와 recipe도 바뀌므로 단일 요인으로 읽지 않습니다.",
        nodes: [
          { label: "objective", sub: "one change", kind: "gate" },
          { label: "compute", sub: "matched", kind: "store" },
          { label: "transfer", sub: "common metrics", kind: "state" },
        ],
      },
    ]}
  />
);

export const BertTaskHeadViz = () => (
  <BertFlow
    id="bert-heads-modern"
    eyebrow="Output unit"
    title="Task가 요구하는 답의 축이 읽을 hidden state를 정합니다"
    description="Sequence, token, span, retrieval을 출력 tensor와 계산 재사용 기준으로 나눕니다."
    scenes={[
      {
        label: "Sequence",
        title: "[CLS] state 하나를 class logits로 투영합니다",
        note: "3-class classification은 [B,H]에서 [B,3]을 만듭니다.",
        nodes: [
          { label: "[B,L,H]", sub: "encoder", kind: "store" },
          { label: "hCLS", sub: "[B,H]", kind: "state" },
          { label: "classes", sub: "[B,3]", kind: "gate" },
        ],
      },
      {
        label: "Token",
        title: "각 token state를 각 위치 label logits로 바꿉니다",
        note: "NER는 subword-to-label alignment와 PAD loss mask를 별도로 고정합니다.",
        nodes: [
          { label: "h₁…hL", sub: "[B,L,H]", kind: "state" },
          { label: "linear", sub: "per token", kind: "gate" },
          { label: "labels", sub: "[B,L,C]", kind: "store" },
        ],
      },
      {
        label: "Span",
        title: "각 위치에서 start와 end score 두 개를 만듭니다",
        note: "Extractive QA는 answer가 input span 안에 있다는 data contract가 필요합니다.",
        nodes: [
          { label: "tokens", sub: "[B,L,H]", kind: "state" },
          { label: "start", sub: "[B,L]", kind: "gate" },
          { label: "end", sub: "[B,L]", kind: "gate" },
        ],
      },
      {
        label: "Retrieval",
        title: "함께 읽는 cross와 따로 저장하는 bi-encoder를 구분합니다",
        note: "Cross는 pair interaction이 강하고 bi는 document vector를 재사용할 수 있습니다.",
        nodes: [
          { label: "bi", sub: "cache vectors", kind: "store" },
          { label: "ANN", sub: "candidates", kind: "gate" },
          { label: "cross", sub: "rerank pair", kind: "state" },
        ],
      },
    ]}
  />
);
