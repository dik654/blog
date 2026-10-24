import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

type StageKind = "image" | "patches" | "features" | "projector" | "sequence";

const STAGES = [
  {
    label: "이미지",
    caption: "224×224 · 빨간 컵",
    kind: "image" as const,
    note: "질문은 ‘빨간 컵은 어디에 있나?’입니다. 아직 LLM에는 픽셀을 직접 넣지 않습니다.",
  },
  {
    label: "Patch sequence",
    caption: "14×14씩 나눠 256개",
    kind: "patches" as const,
    note: "224÷14=16이므로 가로 16개와 세로 16개, 모두 256개의 patch가 생깁니다.",
  },
  {
    label: "Vision encoder",
    caption: "256×1024 · Zᵥ",
    kind: "features" as const,
    note: "CLIP ViT-L/14 예에서는 각 patch가 1024차원 표현이 됩니다. 이 수치는 특정 공개 모델의 설정입니다.",
  },
  {
    label: "Projector",
    caption: "1024 → 5120 · W",
    kind: "projector" as const,
    note: "Vicuna-13B를 예로 들면 W가 각 1024차원 patch 표현을 5120차원 visual token으로 옮깁니다. 의미 정렬은 학습으로 따로 배워야 합니다.",
  },
  {
    label: "LLM sequence",
    caption: "visual 256개 + text token",
    kind: "sequence" as const,
    note: "변환된 visual token과 질문의 text token이 같은 입력 sequence에 놓입니다. LLM은 앞선 이미지 표현을 보며 다음 답 token을 생성합니다.",
  },
] as const;

const EDGE_LABELS = ["16×16", "encode", "W·Zᵥ", "이어 붙이기"] as const;

function Cup({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 120 82" aria-hidden className="h-20 w-28 max-w-full text-foreground">
      <rect x="7" y="6" width="106" height="70" fill="none" stroke="currentColor" strokeOpacity=".24" />
      <motion.path
        d="M43 25h35l-4 35a7 7 0 0 1-7 6H54a7 7 0 0 1-7-6z"
        fill="hsl(var(--primary) / .18)"
        stroke="hsl(var(--primary))"
        strokeWidth="1.25"
        animate={active ? { y: [0, -3, 0] } : undefined}
        transition={{ duration: 1.35, repeat: Infinity }}
      />
      <path d="M78 32q17 2 3 19" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.25" />
    </svg>
  );
}

function Glyph({ kind, active }: { kind: StageKind; active: boolean }) {
  if (kind === "image") return <Cup active={active} />;

  if (kind === "patches") {
    return (
      <svg viewBox="0 0 120 82" aria-hidden className="h-20 w-28 max-w-full">
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((column) => (
            <motion.rect
              key={`${row}-${column}`}
              x={20 + column * 20}
              y={6 + row * 18}
              width="16"
              height="14"
              fill={(row === 1 || row === 2) && (column === 1 || column === 2) ? "hsl(var(--primary) / .23)" : "hsl(var(--muted) / .65)"}
              stroke={(row === 1 || row === 2) && (column === 1 || column === 2) ? "hsl(var(--primary))" : "hsl(var(--border))"}
              animate={active ? { opacity: [.48, 1, .48] } : undefined}
              transition={{ duration: 1.4, repeat: Infinity, delay: (row + column) * .06 }}
            />
          )),
        )}
      </svg>
    );
  }

  if (kind === "features") {
    return (
      <svg viewBox="0 0 120 82" aria-hidden className="h-20 w-28 max-w-full">
        {[0, 1, 2, 3].map((row) => (
          <motion.g key={row} animate={active ? { x: [0, 4, 0] } : undefined} transition={{ duration: 1.3, repeat: Infinity, delay: row * .08 }}>
            <rect x="18" y={9 + row * 17} width="84" height="10" fill="hsl(var(--primary) / .08)" stroke="hsl(var(--primary) / .55)" />
            <rect x="18" y={9 + row * 17} width={24 + row * 13} height="10" fill="hsl(var(--primary) / .25)" />
          </motion.g>
        ))}
      </svg>
    );
  }

  if (kind === "projector") {
    return (
      <svg viewBox="0 0 120 82" aria-hidden className="h-20 w-28 max-w-full text-foreground">
        <rect x="8" y="26" width="28" height="30" fill="hsl(var(--muted) / .55)" stroke="currentColor" strokeOpacity=".5" />
        <motion.path d="M39 41h39" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.25" strokeDasharray="5 4" animate={active ? { strokeDashoffset: [9, 0] } : undefined} transition={{ duration: .85, repeat: Infinity, ease: "linear" }} />
        <path d="m72 35 9 6-9 6" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.25" />
        <rect x="84" y="15" width="28" height="52" fill="hsl(var(--primary) / .13)" stroke="hsl(var(--primary))" />
        <text x="16" y="44" fontSize="8" fill="currentColor">1024</text>
        <text x="90" y="44" fontSize="8" fill="currentColor">5120</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 82" aria-hidden className="h-20 w-28 max-w-full text-foreground">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.rect
          key={index}
          x={8 + index * 22}
          y="28"
          width="17"
          height="27"
          fill={index < 3 ? "hsl(var(--primary) / .22)" : "hsl(var(--muted) / .65)"}
          stroke={index < 3 ? "hsl(var(--primary))" : "hsl(var(--border))"}
          animate={active ? { y: [0, index % 2 === 0 ? -3 : 3, 0] } : undefined}
          transition={{ duration: 1.35, repeat: Infinity, delay: index * .07 }}
        />
      ))}
      <text x="15" y="70" fontSize="7" fill="currentColor" opacity=".65">visual</text>
      <text x="82" y="70" fontSize="7" fill="currentColor" opacity=".65">text</text>
    </svg>
  );
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

export default function VisionLanguageModelArchitectureViz() {
  const controls = useAnimatedScenes(STAGES.length, 3600, { loop: false });

  return (
    <VizFrame
      eyebrow="한 이미지가 답 token이 되기까지"
      title="픽셀은 patch 표현과 projector를 거쳐 LLM 입력에 합류합니다"
      description="‘빨간 컵은 어디에 있나?’라는 한 요청에서 배열의 개수와 차원이 어떻게 바뀌는지 먼저 따라갑니다."
      note="224px·patch 14·1024→5120은 CLIP ViT-L/14와 Vicuna-13B를 잇는 LLaVA 계열을 설명하기 위한 공개 설정 예입니다. 모든 VLM이 같은 수치를 쓰지는 않습니다."
    >
      <div id={controls.playbackId} data-viz="vlm-assembly-flow" tabIndex={0} role="group" aria-label="이미지가 patch 표현과 projector를 거쳐 LLM 입력 sequence가 되는 과정" onKeyDown={controls.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="flex min-h-0 flex-1 flex-col justify-center py-1">
          <div data-viz-canvas className="hidden min-w-0 gap-1 lg:grid lg:grid-cols-[minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)] lg:items-center">
            {STAGES.map((stage, index) => {
              const selected = index === controls.active;
              const reached = index <= controls.active;
              return (
                <div key={stage.label} className="contents">
                  <div className={`grid min-w-0 place-items-center border px-2 py-4 ${selected ? "border-primary bg-primary/[.07]" : reached ? "border-primary/35 bg-primary/[.025]" : "border-border bg-background"}`}>
                    <Glyph kind={stage.kind} active={selected && controls.playing && !controls.reducedMotion} />
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
              <Glyph kind={STAGES[controls.active].kind} active={controls.playing && !controls.reducedMotion} />
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

const CONNECTORS = [
  {
    name: "LLaVA",
    visual: "patch 256개",
    connector: "linear projector",
    language: "LLM 입력 앞에 concat",
    learn: "정렬 단계: projector만 · instruction 단계: projector+LLM",
  },
  {
    name: "Flamingo",
    visual: "Perceiver로 64개",
    connector: "gated cross-attention",
    language: "frozen LLM 층 사이에서 참조",
    learn: "vision encoder·LLM 고정 · 새 connector 학습",
  },
  {
    name: "BLIP-2",
    visual: "Q-Former query 32개",
    connector: "query bottleneck",
    language: "projection 뒤 frozen LLM 연결",
    learn: "image encoder·LLM 고정 · Q-Former 중심 학습",
  },
] as const;

export function VlmConnectorComparison() {
  return (
    <VizFrame
      eyebrow="같은 목적 · 다른 연결 지점"
      title="세 구조는 visual 정보를 줄이고 LLM에 넣는 위치가 다릅니다"
      description="왼쪽의 image 표현에서 오른쪽의 언어 모델까지 어떤 부품이 상태를 바꾸는지 행별로 읽습니다."
      note="세 논문의 구조를 비교하기 위한 개념도입니다. 모델 규모와 학습 데이터가 달라 이 표만으로 성능 우위를 정할 수는 없습니다."
    >
      <div data-viz-canvas className="grid gap-3">
        {CONNECTORS.map((row) => (
          <div key={row.name} className="grid min-w-0 grid-cols-[4.25rem_minmax(0,1fr)] gap-x-3 gap-y-2 border border-border p-3 md:grid-cols-[5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] md:items-center">
            <strong className="row-span-3 self-center text-sm md:row-span-1">{row.name}</strong>
            <div className="min-w-0 border-b border-border pb-2 text-xs leading-5 md:border md:bg-muted/30 md:px-3 md:py-2"><span className="mr-2 text-[9px] font-bold text-muted-foreground md:block">VISUAL</span>{row.visual}</div>
            <span aria-hidden className="hidden text-center text-primary md:block">→</span>
            <div className="min-w-0 border-b border-primary/35 pb-2 text-xs leading-5 md:border md:border-primary/45 md:bg-primary/[.05] md:px-3 md:py-2"><span className="mr-2 text-[9px] font-bold text-primary md:block">CONNECTOR</span>{row.connector}</div>
            <span aria-hidden className="hidden text-center text-primary md:block">→</span>
            <div className="min-w-0 text-xs leading-5 md:px-1 md:py-2"><strong className="block break-keep">{row.language}</strong><span className="mt-1 block text-[10px] leading-5 text-muted-foreground">{row.learn}</span></div>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

export function MultimodalPathBoundary() {
  return (
    <VizFrame
      eyebrow="여기서 두 경로가 갈립니다"
      title="생성형 VLM과 검색용 dual encoder는 입력과 출력이 다릅니다"
      description="둘 다 이미지와 언어를 다루지만, 같은 요청 경로의 앞뒤 단계는 아닙니다."
      note="제품에 따라 두 경로를 함께 조합할 수는 있습니다. 그때도 각 경로가 소유하는 출력은 visual token과 검색 점수로 구분해야 합니다."
    >
      <div data-viz-canvas className="grid gap-4 lg:grid-cols-2">
        <div className="border border-border p-4">
          <p className="text-[10px] font-bold text-primary">답을 생성하는 경로</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="border border-border px-3 py-2">이미지</span><span aria-hidden>→</span><span className="border border-primary/45 px-3 py-2">projector</span><span aria-hidden>→</span><span className="border border-border px-3 py-2">LLM</span><span aria-hidden>→</span><span className="border border-border px-3 py-2">답 token</span>
          </div>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">한 sequence 안에서 이미지 표현을 참조해 다음 token을 생성합니다.</p>
        </div>
        <div className="border border-border p-4">
          <p className="text-[10px] font-bold text-primary">후보를 검색하는 경로</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="border border-border px-3 py-2">text encoder</span><span aria-hidden>+</span><span className="border border-border px-3 py-2">image encoder</span><span aria-hidden>→</span><span className="border border-primary/45 px-3 py-2">similarity</span><span aria-hidden>→</span><span className="border border-border px-3 py-2">후보 순위</span>
          </div>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">두 encoder의 출력을 같은 공간에서 비교해 어느 후보가 가까운지 계산합니다.</p>
        </div>
      </div>
    </VizFrame>
  );
}
