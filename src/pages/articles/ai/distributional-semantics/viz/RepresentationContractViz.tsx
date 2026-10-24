import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const STAGES = [
  { label: "관측쌍", value: "19개", note: "Corpus에서 target과 context가 함께 나온 사건 19개를 셉니다. 이 글의 context 열은 ‘반려·먹이·공전’입니다." },
  { label: "Count matrix", value: "3×3", note: "고양이 row는 [4,3,0], 강아지는 [3,4,0], 행성은 [0,0,5]입니다. 여기까지는 빈도 장부입니다." },
  { label: "PPMI", value: ".439 · .151 · 1.335", note: "각 count를 독립 기대와 비교합니다. 고양이–반려는 log((4/19)÷((7/19)(7/19)))≈0.439입니다." },
  { label: "Rank 2", value: "세 방향 → 두 방향", note: "SVD의 singular value 1.335·0.590·0.288 중 앞의 둘만 남깁니다. 작지만 구별에 쓰이던 0.288 방향은 사라집니다." },
  { label: "Similarity", value: ".616 → 1.000", note: "PPMI 원공간의 고양이–강아지 cosine은 약 0.616입니다. Rank 2에서는 둘의 차이 축이 버려져 같은 방향이 됩니다." },
] as const;

function MiniMatrix({ weighted = false }: { weighted?: boolean }) {
  const values = weighted
    ? [[".439", ".151", "0"], [".151", ".439", "0"], ["0", "0", "1.335"]]
    : [["4", "3", "0"], ["3", "4", "0"], ["0", "0", "5"]];
  return (
    <div className="grid grid-cols-[2.8rem_repeat(3,2rem)] gap-px bg-border p-px font-mono text-[9px]">
      <span className="bg-background p-1" />
      {["반려", "먹이", "공전"].map((label) => <span key={label} className="bg-muted/70 p-1 text-center">{label}</span>)}
      {values.flatMap((row, rowIndex) => [
        <span key={`r-${rowIndex}`} className="bg-muted/70 p-1">{["고양이", "강아지", "행성"][rowIndex]}</span>,
        ...row.map((value, columnIndex) => <span key={`${rowIndex}-${columnIndex}`} className={`bg-background p-1 text-center ${value !== "0" ? "text-primary" : "text-muted-foreground"}`}>{value}</span>),
      ])}
    </div>
  );
}

function StageGlyph({ index, active }: { index: number; active: boolean }) {
  if (index === 0) {
    return (
      <div className="grid grid-cols-2 gap-1 text-[9px] font-semibold sm:grid-cols-3">
        {["고양이·반려 ×4","고양이·먹이 ×3","강아지·반려 ×3","강아지·먹이 ×4","행성·공전 ×5"].map((pair, pairIndex) => (
          <motion.span key={pair} className="whitespace-nowrap border border-border px-2 py-1 text-center" animate={active ? { opacity: [.45, 1, .45] } : undefined} transition={{ duration: 1.4, repeat: Infinity, delay: pairIndex * .08 }}>
            {pair}
          </motion.span>
        ))}
      </div>
    );
  }
  if (index === 1) return <MiniMatrix />;
  if (index === 2) return <MiniMatrix weighted />;
  if (index === 3) {
    return (
      <svg viewBox="0 0 150 78" aria-hidden className="h-20 w-36 max-w-full text-foreground">
        <rect x="5" y="12" width="42" height="54" fill="hsl(var(--muted) / .5)" stroke="currentColor" strokeOpacity=".35" />
        <motion.path d="M53 39h28" stroke="hsl(var(--primary))" strokeWidth="1.25" strokeDasharray="5 4" animate={active ? { strokeDashoffset: [9, 0] } : undefined} transition={{ duration: .9, repeat: Infinity, ease: "linear" }} />
        <path d="m76 34 8 5-8 5" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.25" />
        <rect x="90" y="12" width="18" height="54" fill="hsl(var(--primary) / .16)" stroke="hsl(var(--primary))" />
        <text x="13" y="43" fontSize="9" fill="currentColor">3×3</text>
        <text x="92" y="43" fontSize="9" fill="currentColor">3×2</text>
        <text x="116" y="28" fontSize="8" fill="currentColor">1.335</text>
        <text x="116" y="42" fontSize="8" fill="currentColor">0.590</text>
        <text x="116" y="56" fontSize="8" fill="currentColor" opacity=".45">0.288 ×</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 150 78" aria-hidden className="h-20 w-36 max-w-full text-foreground">
      <line x1="18" y1="63" x2="135" y2="63" stroke="currentColor" strokeOpacity=".28" />
      <line x1="31" y1="70" x2="31" y2="8" stroke="currentColor" strokeOpacity=".28" />
      <motion.line x1="31" y1="63" x2="106" y2="23" stroke="hsl(var(--primary))" strokeWidth="1.25" animate={active ? { x2: [88, 106, 88] } : undefined} transition={{ duration: 1.5, repeat: Infinity }} />
      <line x1="31" y1="63" x2="100" y2="29" stroke="currentColor" strokeWidth="1.25" />
      <text x="105" y="20" fontSize="8" fill="hsl(var(--primary))">고양이</text>
      <text x="103" y="37" fontSize="8" fill="currentColor">강아지</text>
      <text x="43" y="13" fontSize="8" fill="currentColor">cos .616 → 1.000</text>
    </svg>
  );
}

export default function RepresentationContractViz() {
  const controls = useAnimatedScenes(STAGES.length, 3600, { loop: false });
  return (
    <VizFrame eyebrow="같은 관측 장부를 끝까지 추적합니다" title="19개의 관측쌍이 3×3 행렬을 거쳐 두 차원 단어 벡터가 됩니다" description="고양이·강아지·행성의 예에서 count, PPMI, SVD, cosine이 각각 무엇을 바꾸는지 먼저 봅니다." note="모든 수치는 계산 경로를 보이기 위한 교육용 가정입니다. 작은 corpus의 높은 PMI와 낮은 rank가 실제 품질을 보장하지 않습니다.">
      <div id={controls.playbackId} data-viz="distributional-end-to-end" tabIndex={0} role="group" aria-label="관측쌍이 count matrix, PPMI, rank 2 embedding, cosine으로 바뀌는 과정" onKeyDown={controls.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="flex min-h-0 flex-1 flex-col justify-center py-1">
          <div className="mb-3 grid grid-cols-5 gap-px bg-border p-px" aria-label="전체 변환 경로">
            {STAGES.map((stage, index) => <div key={stage.label} className={`min-w-0 bg-background px-1 py-2 text-center ${index === controls.active ? "text-primary" : index < controls.active ? "text-foreground" : "text-muted-foreground"}`}>
              <span className="font-mono text-[9px]">0{index + 1}</span>
              <strong className="mt-1 block break-keep text-[9px] leading-4 sm:text-[10px]">{stage.label}</strong>
              <span className="mt-1 hidden font-mono text-[9px] lg:block">{stage.value}</span>
            </div>)}
          </div>
          <div data-viz-canvas className="grid min-w-0 place-items-center">
            <div className="grid min-h-44 w-full min-w-0 place-items-center border border-primary bg-primary/[.06] px-3 py-3">
              <StageGlyph index={controls.active} active={controls.playing && !controls.reducedMotion} />
              <p className="mt-2 text-[10px] font-bold text-primary">{controls.active + 1} / {STAGES.length}</p>
              <strong className="mt-1 text-base">{STAGES[controls.active].label}</strong>
              <span className="mt-1 font-mono text-xs text-primary">{STAGES[controls.active].value}</span>
              <p className="mt-2 max-w-xl text-center text-xs leading-[1.125rem] text-muted-foreground">
                {STAGES[controls.active].note}
              </p>
            </div>
          </div>
          <ol className="sr-only">{STAGES.map((stage, index) => <li key={stage.label}>{index + 1}. {stage.label}: {stage.value}. {stage.note}</li>)}</ol>
        </div>
        <AnimatedSceneControls labels={STAGES.map((stage) => stage.label)} active={controls.active} playing={controls.playing} reducedMotion={controls.reducedMotion} setActive={controls.setActive} setPlaying={controls.setPlaying} />
      </div>
    </VizFrame>
  );
}
