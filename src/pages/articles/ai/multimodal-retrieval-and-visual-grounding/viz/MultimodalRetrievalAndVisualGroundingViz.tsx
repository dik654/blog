import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type FlowKind = "query" | "candidates" | "scores" | "selected" | "grounded";

const STAGES = [
  {
    label: "Text query",
    caption: "‘빨간 컵’ → q=(1, 0)",
    kind: "query" as const,
    note: "Text encoder가 query를 정규화된 2차원 벡터 q=(1,0)으로 바꿨다고 가정합니다. 실제 모델은 훨씬 큰 차원을 씁니다.",
  },
  {
    label: "후보 이미지",
    caption: "A·B·C → image embedding",
    kind: "candidates" as const,
    note: "Image encoder는 A=(0.8,0.6), B=(0,1), C=(−0.6,0.8)을 냈다고 가정합니다. 세 벡터의 길이는 모두 1입니다.",
  },
  {
    label: "Similarity",
    caption: "0.8 · 0.0 · −0.6",
    kind: "scores" as const,
    note: "정규화된 벡터라 cosine similarity는 내적과 같습니다. q·A=0.8, q·B=0, q·C=−0.6입니다.",
  },
  {
    label: "이미지 A 선택",
    caption: "가장 큰 점수 0.8",
    kind: "selected" as const,
    note: "Retrieval은 여기서 끝납니다. 어떤 이미지가 query와 가장 가까운지 골랐지만, 이미지 안에서 컵이 어디에 있는지는 아직 모릅니다.",
  },
  {
    label: "Grounding",
    caption: "A 안의 컵 → bbox",
    kind: "grounded" as const,
    note: "Grounding 모델이 선택된 이미지 A와 text를 다시 받아 컵의 위치를 bounding box·point·mask 중 하나로 표시합니다.",
  },
] as const;

const EDGE_LABELS = ["text encoder", "cosine", "top-1", "where?"] as const;

function CupImage({ selected = false, grounded = false }: { selected?: boolean; grounded?: boolean }) {
  return (
    <svg viewBox="0 0 90 70" aria-hidden className="h-[4.5rem] w-24 max-w-full text-foreground">
      <rect x="3" y="3" width="84" height="64" fill="none" stroke={selected ? "hsl(var(--primary))" : "currentColor"} strokeOpacity={selected ? 1 : .25} strokeWidth={selected ? 1.25 : 1} />
      <path d="M32 23h28l-4 29a6 6 0 0 1-6 5H42a6 6 0 0 1-6-5z" fill="hsl(var(--primary) / .2)" stroke="hsl(var(--primary))" strokeWidth="1.2" />
      <path d="M60 29q14 2 2 16" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.2" />
      {grounded ? <rect x="27" y="18" width="48" height="44" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.25" strokeDasharray="4 3" /> : null}
    </svg>
  );
}

function FlowGlyph({ kind, active }: { kind: FlowKind; active: boolean }) {
  if (kind === "query") {
    return (
      <svg viewBox="0 0 120 76" aria-hidden className="h-20 w-28 max-w-full text-foreground">
        <rect x="7" y="14" width="106" height="46" fill="hsl(var(--muted) / .4)" stroke="currentColor" strokeOpacity=".35" />
        <text x="18" y="35" fontSize="10" fill="currentColor">빨간 컵</text>
        <motion.path d="M69 38h30" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.25" strokeDasharray="5 4" animate={active ? { strokeDashoffset: [9, 0] } : undefined} transition={{ duration: .85, repeat: Infinity, ease: "linear" }} />
        <text x="71" y="51" fontSize="8" fill="hsl(var(--primary))">(1,0)</text>
      </svg>
    );
  }

  if (kind === "candidates") {
    return (
      <svg viewBox="0 0 120 76" aria-hidden className="h-20 w-28 max-w-full text-foreground">
        {[0, 1, 2].map((index) => (
          <motion.g key={index} animate={active ? { y: [0, index === 1 ? -3 : 3, 0] } : undefined} transition={{ duration: 1.4, repeat: Infinity, delay: index * .1 }}>
            <rect x={7 + index * 38} y="14" width="31" height="37" fill={index === 0 ? "hsl(var(--primary) / .16)" : "hsl(var(--muted) / .5)"} stroke={index === 0 ? "hsl(var(--primary))" : "hsl(var(--border))"} />
            <text x={19 + index * 38} y="67" fontSize="9" fill="currentColor">{String.fromCharCode(65 + index)}</text>
          </motion.g>
        ))}
      </svg>
    );
  }

  if (kind === "scores") {
    return (
      <svg viewBox="0 0 120 76" aria-hidden className="h-20 w-28 max-w-full text-foreground">
        {[.8, 0, -.6].map((value, index) => (
          <g key={value}>
            <text x="6" y={17 + index * 23} fontSize="9" fill="currentColor">{String.fromCharCode(65 + index)}</text>
            <rect x="20" y={8 + index * 23} width="88" height="12" fill="hsl(var(--muted) / .45)" stroke="hsl(var(--border))" />
            <motion.rect x={value >= 0 ? 64 : 64 + value * 48} y={8 + index * 23} width={Math.abs(value) * 48} height="12" fill={index === 0 ? "hsl(var(--primary) / .5)" : "hsl(var(--foreground) / .18)"} animate={active ? { opacity: [.45, 1, .45] } : undefined} transition={{ duration: 1.3, repeat: Infinity, delay: index * .1 }} />
            <text x="91" y={18 + index * 23} fontSize="8" fill="currentColor">{value.toFixed(1)}</text>
          </g>
        ))}
        <path d="M64 5v66" stroke="currentColor" strokeOpacity=".35" />
      </svg>
    );
  }

  if (kind === "selected") return <CupImage selected />;
  return <CupImage selected grounded />;
}

function FlowEdge({ label, reached, moving }: { label: string; reached: boolean; moving: boolean }) {
  return (
    <div className="grid min-w-0 place-items-center gap-1 py-1 lg:w-7">
      <svg viewBox="0 0 52 22" aria-hidden className="h-7 w-10 rotate-90 lg:rotate-0">
        <motion.path d="M3 11h39" fill="none" stroke="currentColor" strokeWidth="1.25" strokeDasharray="5 4" className={reached ? "text-primary" : "text-border"} animate={moving ? { strokeDashoffset: [9, 0] } : undefined} transition={{ duration: .85, repeat: Infinity, ease: "linear" }} />
        <path d="m38 5 10 6-10 6" fill="none" stroke="currentColor" strokeWidth="1.25" className={reached ? "text-primary" : "text-border"} />
      </svg>
      <span className="break-keep text-center font-mono text-[8px] font-bold text-muted-foreground">{label}</span>
    </div>
  );
}

export default function MultimodalRetrievalAndVisualGroundingViz() {
  const controls = useAnimatedScenes(STAGES.length, 3600, { loop: false });

  return (
    <VizFrame
      eyebrow="한 query · 두 개의 서로 다른 결정"
      title="먼저 이미지를 고르고, 그다음 선택한 이미지 안의 위치를 찾습니다"
      description="‘빨간 컵’ query가 후보 A·B·C 중 하나를 고른 뒤 bounding box를 얻는 전체 경로입니다."
      note="2차원 embedding과 세 후보는 cosine 계산을 눈으로 확인하기 위한 교육용 가정입니다. 실제 embedding은 더 큰 차원을 쓰며 점수도 모델과 데이터에 따라 달라집니다."
    >
      <div id={controls.playbackId} data-viz="retrieval-grounding-flow" tabIndex={0} role="group" aria-label="Text query로 후보 이미지를 검색한 뒤 선택된 이미지 안에서 대상을 grounding하는 과정" onKeyDown={controls.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="flex min-h-0 flex-1 flex-col justify-center py-1">
          <div data-viz-canvas className="hidden min-w-0 gap-1 lg:grid lg:grid-cols-[minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)] lg:items-center">
            {STAGES.map((stage, index) => {
              const selected = index === controls.active;
              const reached = index <= controls.active;
              return (
                <div key={stage.label} className="contents">
                  <div className={`grid min-w-0 place-items-center border px-2 py-4 ${selected ? "border-primary bg-primary/[.07]" : reached ? "border-primary/35 bg-primary/[.025]" : "border-border bg-background"}`}>
                    <FlowGlyph kind={stage.kind} active={selected && controls.playing && !controls.reducedMotion} />
                    <strong className="mt-2 break-keep text-center text-xs leading-5">{stage.label}</strong>
                    <p className="mt-1 text-center text-[10px] leading-5 text-muted-foreground">{stage.caption}</p>
                  </div>
                  {index < STAGES.length - 1 ? <FlowEdge label={EDGE_LABELS[index]} reached={controls.active > index} moving={controls.playing && controls.active === index + 1} /> : null}
                </div>
              );
            })}
          </div>

          <div data-viz-canvas className="grid min-w-0 place-items-center lg:hidden">
            <div className="grid w-full min-w-0 place-items-center border border-primary bg-primary/[.07] px-4 py-4">
              <FlowGlyph kind={STAGES[controls.active].kind} active={controls.playing && !controls.reducedMotion} />
              <p className="mt-1 text-[10px] font-bold text-primary">{controls.active + 1} / {STAGES.length}</p>
              <strong className="mt-1 break-keep text-center text-base leading-6">{STAGES[controls.active].label}</strong>
              <p className="mt-1 text-center text-xs leading-5 text-muted-foreground">{STAGES[controls.active].caption}</p>
            </div>
          </div>

          <ol className="sr-only">
            {STAGES.map((stage, index) => <li key={`${stage.label}-text`}>{index + 1}. {stage.label}: {stage.caption}. {stage.note}</li>)}
          </ol>

          <div className="mt-5 border-l border-primary/60 pl-4">
            <p className="font-mono text-[10px] font-black uppercase tracking-[.14em] text-primary">단계 {String(controls.active + 1).padStart(2, "0")}</p>
            <p className="mt-1 text-sm font-bold">{STAGES[controls.active].label}</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">{STAGES[controls.active].note}</p>
          </div>
        </div>
        <AnimatedSceneControls labels={STAGES.map((stage) => stage.label)} active={controls.active} playing={controls.playing} reducedMotion={controls.reducedMotion} setActive={controls.setActive} setPlaying={controls.setPlaying} />
      </div>
    </VizFrame>
  );
}

const PRIMITIVES = [
  { name: "Bounding box", value: "(x₁,y₁)·(x₂,y₂)", cost: "좌표 4개", detail: "범위는 알지만 배경도 함께 포함" },
  { name: "Point", value: "(x,y)", cost: "좌표 2개", detail: "클릭 지점은 알지만 크기는 모름" },
  { name: "Segmentation mask", value: "pixel마다 0 또는 1", cost: "해상도만큼", detail: "윤곽은 정밀하지만 표현량이 큼" },
] as const;

export function GroundingPrimitiveComparison() {
  return (
    <VizFrame
      eyebrow="같은 컵 · 다른 위치 표현"
      title="Box·point·mask는 답하는 공간 정보의 양이 다릅니다"
      description="세 결과가 같은 대상에 무엇을 남기고 무엇을 버리는지 먼저 비교합니다."
      note="좌표는 설명용이며 실제 모델 출력이 아닙니다."
    >
      <div data-viz-canvas className="grid gap-3 md:grid-cols-3">
        {PRIMITIVES.map((item, index) => (
          <div key={item.name} className="grid min-w-0 grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-3 border border-border p-3 text-left md:grid-cols-1 md:place-items-center md:p-4 md:text-center">
            <div className="grid place-items-center">{index === 0 ? <CupImage grounded /> : index === 1 ? (
              <svg viewBox="0 0 90 70" aria-hidden className="h-16 w-[4.75rem] max-w-full text-foreground md:h-[4.5rem] md:w-24"><rect x="3" y="3" width="84" height="64" fill="none" stroke="currentColor" strokeOpacity=".25" /><path d="M32 23h28l-4 29a6 6 0 0 1-6 5H42a6 6 0 0 1-6-5z" fill="none" stroke="currentColor"/><circle cx="47" cy="39" r="4" fill="hsl(var(--primary))" /></svg>
            ) : (
              <svg viewBox="0 0 90 70" aria-hidden className="h-16 w-[4.75rem] max-w-full text-foreground md:h-[4.5rem] md:w-24"><rect x="3" y="3" width="84" height="64" fill="none" stroke="currentColor" strokeOpacity=".25" /><path d="M32 23h28l-4 29a6 6 0 0 1-6 5H42a6 6 0 0 1-6-5z" fill="hsl(var(--primary) / .42)" stroke="hsl(var(--primary))"/><path d="M60 29q14 2 2 16" fill="none" stroke="hsl(var(--primary))"/></svg>
            )}</div>
            <div className="min-w-0">
              <strong className="block text-sm">{item.name}</strong>
              <span className="mt-1 block break-words font-mono text-[10px] text-primary">{item.value}</span>
              <span className="mt-2 inline-block border border-border px-2 py-1 text-[10px] font-bold">{item.cost}</span>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

export function DocumentRetrievalPathComparison() {
  return (
    <VizFrame
      eyebrow="문서 페이지를 검색 벡터로 만드는 두 경로"
      title="OCR 경로는 구조를 해석하고, screenshot 경로는 페이지 이미지를 직접 표현합니다"
      description="둘의 차이는 검색 이전에 문서를 어떤 중간 표현으로 바꾸는가에 있습니다."
      note="속도와 검색 품질은 구현과 문서 분포에 따라 달라집니다. ColPali 수치는 해당 논문의 ViDoRe 실험으로 범위를 한정해 읽어야 합니다."
    >
      <div data-viz-canvas className="grid gap-4 lg:grid-cols-2">
        <div className="border border-border p-4">
          <p className="text-[10px] font-bold text-primary">OCR 중심 경로</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold"><span className="border border-border px-3 py-2">페이지</span><span>→</span><span className="border border-border px-3 py-2">layout</span><span>→</span><span className="border border-border px-3 py-2">OCR</span><span>→</span><span className="border border-primary/45 px-3 py-2">text embedding</span></div>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">읽을 수 있는 text와 구조를 명시적으로 남기지만, 표·그림·배치 정보가 중간 단계에서 줄어들 수 있습니다.</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] font-bold text-primary">Screenshot 중심 경로</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold"><span className="border border-border px-3 py-2">페이지 이미지</span><span>→</span><span className="border border-border px-3 py-2">VLM patches</span><span>→</span><span className="border border-primary/45 px-3 py-2">multi-vector</span><span>→</span><span className="border border-border px-3 py-2">MaxSim</span></div>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">페이지의 시각 배치를 직접 보존하지만, patch 벡터 수만큼 index와 비교 비용을 관리해야 합니다.</p>
        </div>
      </div>
    </VizFrame>
  );
}
