import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 같은 system prompt 1,000 token을 네 엔진이 몇 token까지 다시 쓰는지 같은 막대 위에 칠한다.
 * 한 mechanism: 찾는 단위(16·32 token block, token 하나, slot)가 끝부분 8 token의 운명을 가른다.
 * 위 막대는 1,000 token 전체, 아래 띠는 끝 40 token(961~1,000)을 1칸 = 1 token으로 확대한 것.
 */
const TOTAL = 1000;
const ZOOM_START = 961;
const ZOOM = 40;

type Kind = "hit" | "redo" | "copy" | "unknown" | "stored";
interface Engine {
  key: string;
  name: string;
  unit: number | null; // block 크기, null이면 token 단위
  segments: readonly { kind: Kind; tokens: number }[];
  result: string;
}

const ENGINES: readonly Engine[] = [
  { key: "vllm", name: "vLLM", unit: 16, segments: [{ kind: "hit", tokens: 992 }, { kind: "redo", tokens: 8 }], result: "block 62개 · 992 적중 · 8 재계산" },
  { key: "trt", name: "TensorRT-LLM", unit: 32, segments: [{ kind: "hit", tokens: 992 }, { kind: "copy", tokens: 8 }], result: "block 31개 + 일부 8 복사 · 1,000" },
  { key: "sglang", name: "SGLang", unit: null, segments: [{ kind: "hit", tokens: 1000 }], result: "token 단위 · 1,000 적중" },
  { key: "llama-same", name: "llama.cpp 같은 slot", unit: null, segments: [{ kind: "hit", tokens: 1000 }], result: "직전 prompt와 비교 · 1,000" },
  { key: "llama-other", name: "llama.cpp 다른 slot", unit: null, segments: [{ kind: "unknown", tokens: 1000 }], result: "그 slot의 기록에 달림" },
];

const SCENES = [
  { label: "첫 요청이 1,000 token을 남김", shown: 0, note: "첫 요청이 끝나 같은 system prompt 1,000 token의 KV가 남았습니다. 둘째 요청이 같은 앞부분으로 들어오면 엔진마다 찾는 단위가 달라 가져오는 양이 갈립니다." },
  { label: "vLLM · 16 token block", shown: 1, note: "꽉 찬 16 token block만 hash로 찾습니다. 1,000 ÷ 16을 내리면 62개, 992 token입니다. 마지막 block을 채우지 못한 8 token은 빨간 칸처럼 다시 계산합니다." },
  { label: "TensorRT-LLM · 32 token block", shown: 2, note: "32칸 block 31개(992 token)를 radix tree에서 찾고, 일부만 같은 마지막 block에서 8 token을 복사해 이어 씁니다. 1,000 token을 모두 가져옵니다." },
  { label: "SGLang · token 하나", shown: 3, note: "한 칸이 token 하나라 경계선이 없습니다. radix tree에서 1,000 token을 그대로 찾습니다." },
  { label: "llama.cpp · slot", shown: 5, note: "기본으로 켜진 cache_prompt는 같은 slot의 직전 prompt와만 공통 앞부분을 비교합니다. 같은 slot이면 1,000, 다른 slot이면 그 slot에 남은 기록에 따라 정해집니다." },
] as const;

const COLOR: Record<Kind, string> = {
  hit: "#16a34a",
  redo: "#dc2626",
  copy: "#d97706",
  unknown: "#94a3b8",
  stored: "#cbd5e1",
};

function kindAt(engine: Engine, token: number): Kind {
  let end = 0;
  for (const seg of engine.segments) {
    end += seg.tokens;
    if (token <= end) return seg.kind;
  }
  return "stored";
}

export default function PrefixReuseUnitViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="Prefix reuse unit"
      title="찾는 단위가 끝부분 8 token을 재계산할지 정합니다"
      description="초록은 다시 쓴 KV, 빨강은 재계산, 주황은 일부 block 복사입니다. 아래 띠는 끝 40 token을 1칸 = 1 token으로 확대했고 진한 세로선이 block 경계입니다."
      note="1,000 token과 block 크기 16·32는 본문의 가정이며 첫 요청의 KV가 아직 지워지지 않았다고 둡니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="엔진별 prefix 재사용 단위와 적중 token 수"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <div className="mt-2 space-y-2">
            {ENGINES.map((engine, ei) => {
              const visible = ei < scene.shown;
              const active = visible && ei >= (scene.shown === 5 ? 3 : scene.shown - 1);
              return (
                <div key={engine.key} className={`min-w-0 ${visible ? "" : "opacity-45"}`}>
                  <div className="flex min-h-[2.25rem] flex-wrap items-baseline justify-between gap-x-2 text-xs sm:min-h-0">
                    <span className={`font-bold ${active ? "text-foreground" : "text-muted-foreground"}`}>{engine.name}</span>
                    <span className="font-mono text-muted-foreground">{visible ? engine.result : `${engine.unit ? `${engine.unit} token block` : "token 단위"}`}</span>
                  </div>
                  {/* 전체 1,000 token */}
                  <div className="mt-0.5 flex h-2.5 overflow-hidden rounded-sm border border-border">
                    {(visible ? engine.segments : [{ kind: "stored" as Kind, tokens: TOTAL }]).map((seg, si) => (
                      <motion.div
                        key={`${scene.shown}-${si}`}
                        style={{ backgroundColor: COLOR[seg.kind] }}
                        initial={{ width: visible ? 0 : `${(seg.tokens / TOTAL) * 100}%` }}
                        animate={{ width: `${(seg.tokens / TOTAL) * 100}%` }}
                        transition={{ duration: reduced || !active ? 0 : 0.7 }}
                      />
                    ))}
                  </div>
                  {/* 끝 40 token 확대 */}
                  <div className="mt-1 flex h-4">
                    {Array.from({ length: ZOOM }, (_, i) => {
                      const token = ZOOM_START + i;
                      const kind = visible ? kindAt(engine, token) : "stored";
                      const boundary = engine.unit !== null && (token - 1) % engine.unit === 0;
                      return (
                        <div
                          key={token}
                          className="h-full flex-1"
                          style={{
                            backgroundColor: COLOR[kind],
                            borderLeft: boundary ? "1.25px solid #0f172a" : "1px solid rgba(255,255,255,0.7)",
                            opacity: kind === "unknown" ? 0.5 : 1,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div className="relative h-3.5 font-mono text-[10px] text-muted-foreground" aria-label="확대 띠의 token 번호">
              {[961, 977, 993].map((t) => (
                <span key={t} className="absolute" style={{ left: `${((t - ZOOM_START) / ZOOM) * 100}%` }}>
                  {t}
                </span>
              ))}
              <span className="absolute right-0">1,000</span>
            </div>
          </div>

          <p className="mt-1 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
