import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 새 요청의 앞 52 token이 이전 요청과 같을 때 어디까지 KV를 재사용하는지 token 칸으로 센다. 1칸 = 1 token.
 * TensorRT-LLM: 32칸 block 1개는 그대로 적중하고, 둘째 block은 앞 20칸만 같아 새 block에 복사해 이어 쓴다(52).
 * vLLM: 다 찬 16칸 block 3개(48)만 hash로 찾고 남은 4칸은 다시 계산한다.
 * 한 mechanism: 일치 판정 단위가 block이라 block 안의 일부 일치는 복사가 없으면 버려진다.
 */
type Cell = "blank" | "same" | "hit" | "copy" | "recompute";
const SHARED = 52;
const ROW = 32;
const TOKENS = 64;

interface Scene {
  label: string;
  trt: (i: number) => Cell;
  vllm: (i: number) => Cell;
  source: boolean;
  trtTitle: string;
  trtCount: string;
  vllmCount: string;
  note: string;
}

const same = (i: number): Cell => (i < SHARED ? "same" : "blank");

const SCENES: readonly Scene[] = [
  {
    label: "앞 52 token이 같음",
    trt: same,
    vllm: same,
    source: false,
    trtTitle: "TensorRT-LLM · block 32칸",
    trtCount: "—",
    vllmCount: "—",
    note: "테두리 칸 52개가 이전 요청과 같은 앞부분입니다. 같은 52칸을 위는 32칸 block 두 개로, 아래는 16칸 block 네 개로 나눠 봅니다.",
  },
  {
    label: "TRT · 정확 일치 32",
    trt: (i) => (i < 32 ? "hit" : same(i)),
    vllm: same,
    source: false,
    trtTitle: "TensorRT-LLM · block 32칸",
    trtCount: "적중 32",
    vllmCount: "—",
    note: "첫 block 32칸은 이전 요청의 block과 전부 같아 radix tree에서 그대로 찾습니다. 둘째 block은 32칸 중 앞 20칸만 같아 정확 일치가 없습니다.",
  },
  {
    label: "TRT · 20칸 복사",
    trt: (i) => (i < 32 ? "hit" : i < SHARED ? "copy" : "blank"),
    vllm: same,
    source: true,
    trtTitle: "TensorRT-LLM · block 32칸",
    trtCount: "적중 32 + 복사 20 = 52",
    vllmCount: "—",
    note: "앞부분만 같은 block을 찾아 그 20칸을 새 block에 복사하고 이어 씁니다. 원래 block을 다른 요청이 쓰는 중이어도 복사본이라 건드리지 않습니다.",
  },
  {
    label: "vLLM · 48 + 재계산 4",
    trt: (i) => (i < 32 ? "hit" : i < SHARED ? "copy" : "blank"),
    vllm: (i) => (i < 48 ? "hit" : i < SHARED ? "recompute" : "blank"),
    source: true,
    trtTitle: "TensorRT-LLM · block 32칸",
    trtCount: "적중 32 + 복사 20 = 52",
    vllmCount: "적중 48 · 재계산 4",
    note: "vLLM 기본 경로는 다 찬 16칸 block만 hash로 찾습니다. 16·32·48까지 세 block이 적중하고 넷째 block의 4칸은 다시 계산합니다.",
  },
  {
    label: "32칸 block · 복사 없음",
    trt: (i) => (i < 32 ? "hit" : i < SHARED ? "recompute" : "blank"),
    vllm: (i) => (i < 48 ? "hit" : i < SHARED ? "recompute" : "blank"),
    source: false,
    trtTitle: "block 32칸 · 부분 재사용 끔",
    trtCount: "적중 32 · 재계산 20",
    vllmCount: "적중 48 · 재계산 4",
    note: "block이 32칸인데 부분 재사용이 없다면 첫 block 32칸만 적중하고 같은 20칸도 다시 계산합니다. block이 클수록 버려지는 일치 칸이 늘어납니다.",
  },
];

const FILL: Record<Cell, { bg: string; border: string }> = {
  blank: { bg: "rgba(0,0,0,0)", border: "#e2e8f0" },
  same: { bg: "rgba(0,0,0,0)", border: "#64748b" },
  hit: { bg: "#2563eb", border: "#2563eb" },
  copy: { bg: "#0d9488", border: "#0d9488" },
  recompute: { bg: "#f59e0b", border: "#f59e0b" },
};

function TokenRows({ state, block, reduced }: { state: (i: number) => Cell; block: number; reduced: boolean }) {
  return (
    <div className="space-y-1">
      {[0, 1].map((r) => (
        <div key={r} className="grid grid-cols-[repeat(32,minmax(0,1fr))] gap-px">
          {Array.from({ length: ROW }, (_, c) => {
            const i = r * ROW + c;
            const cell = state(i);
            const boundary = c > 0 && c % block === 0;
            return (
              <motion.span
                key={c}
                className={`h-3 min-w-0 rounded-[1px] border sm:h-3.5 ${boundary ? "ml-[3px]" : ""}`}
                initial={false}
                animate={{ backgroundColor: FILL[cell].bg, borderColor: FILL[cell].border }}
                transition={{ duration: reduced ? 0 : 0.2, delay: reduced ? 0 : (i % ROW) * 0.012 + r * 0.3 }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function PartialReuseCopyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4400);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="Partial block reuse"
      title="block 안의 20칸 일치는 복사해야 살아남습니다"
      description="칸 하나가 token 하나이고, 한 줄은 32 token입니다. 파랑은 block째 찾은 칸, 청록은 복사한 칸, 주황은 다시 계산할 칸입니다."
      note="52 token 일치는 본문의 가정입니다. 부분 재사용과 복사는 enable_partial_reuse·copy_on_partial_reuse 기본값(둘 다 켜짐)일 때의 동작입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="TensorRT-LLM과 vLLM의 부분 block 재사용 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
              <p className="text-[11px] font-bold text-muted-foreground">{scene.trtTitle}</p>
              <p className="font-mono text-[11px] font-bold text-[#2563eb]">{scene.trtCount}</p>
            </div>
            {/* 복사 원본: 이전 요청의 둘째 block, 앞 20칸만 같다 */}
            <div className={`mt-1 flex items-center gap-2 transition-opacity ${scene.source ? "opacity-100" : "opacity-30"}`}>
              <span className="w-16 shrink-0 font-mono text-[10px] text-muted-foreground">이전 block 2</span>
              <div className="grid min-w-0 flex-1 grid-cols-[repeat(32,minmax(0,1fr))] gap-px">
                {Array.from({ length: ROW }, (_, c) => (
                  <span
                    key={c}
                    className="h-2 min-w-0 rounded-[1px] border"
                    style={{ borderColor: c < 20 ? "#0d9488" : "#cbd5e1", backgroundColor: c < 20 && scene.source ? "#0d948833" : "transparent" }}
                  />
                ))}
              </div>
            </div>
            <p className={`mt-0.5 pl-[4.5rem] font-mono text-[10px] text-[#0d9488] ${scene.source ? "visible" : "invisible"}`}>↓ 앞 20칸을 새 block에 복사</p>
            <div className="mt-1 flex items-start gap-2">
              <span className="w-16 shrink-0 font-mono text-[10px] text-muted-foreground">새 요청</span>
              <div className="min-w-0 flex-1">
                <TokenRows state={scene.trt} block={32} reduced={reduced} />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
              <p className="text-[11px] font-bold text-muted-foreground">vLLM · block 16칸</p>
              <p className="font-mono text-[11px] font-bold text-[#2563eb]">{scene.vllmCount}</p>
            </div>
            <div className="mt-1 flex items-start gap-2">
              <span className="w-16 shrink-0 font-mono text-[10px] text-muted-foreground">새 요청</span>
              <div className="min-w-0 flex-1">
                <TokenRows state={scene.vllm} block={16} reduced={reduced} />
              </div>
            </div>
          </div>

          <p className="mt-2 font-mono text-[10px] text-muted-foreground">줄마다 32 token · 전체 {TOKENS}칸 중 앞 {SHARED}칸이 같음</p>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
