import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * (가정) CPU 준비 2칸, GPU 계산 4칸으로 step 1~4를 CPU·GPU 두 줄 타임라인에 놓는다. 1칸 = 시간 1단위.
 * 직렬: CPU가 결과를 확인하고 다음 batch를 만드는 동안 GPU가 논다(빈칸 2×4 = 8).
 * 겹침: GPU가 step k를 계산하는 동안 CPU가 step k+1을 준비하고 step k−1의 결과를 읽는다.
 * 한 mechanism: 준비를 계산 뒤에 숨기면 결과를 한 step 늦게 알게 되어, 끝 token 뒤에 token 하나를 더 계산한다.
 */
const SPAN = 24;

interface Block {
  lane: "cpu" | "gpu";
  start: number;
  len: number;
  label: string;
  kind: "prep" | "gpu" | "idle" | "extra";
}

const SERIAL: readonly Block[] = [
  { lane: "cpu", start: 0, len: 2, label: "1", kind: "prep" },
  { lane: "gpu", start: 0, len: 2, label: "", kind: "idle" },
  { lane: "gpu", start: 2, len: 4, label: "1", kind: "gpu" },
  { lane: "cpu", start: 6, len: 2, label: "2", kind: "prep" },
  { lane: "gpu", start: 6, len: 2, label: "", kind: "idle" },
  { lane: "gpu", start: 8, len: 4, label: "2", kind: "gpu" },
  { lane: "cpu", start: 12, len: 2, label: "3", kind: "prep" },
  { lane: "gpu", start: 12, len: 2, label: "", kind: "idle" },
  { lane: "gpu", start: 14, len: 4, label: "3", kind: "gpu" },
  { lane: "cpu", start: 18, len: 2, label: "4", kind: "prep" },
  { lane: "gpu", start: 18, len: 2, label: "", kind: "idle" },
  { lane: "gpu", start: 20, len: 4, label: "4", kind: "gpu" },
];

const overlap = (extra: boolean): readonly Block[] => [
  { lane: "cpu", start: 0, len: 2, label: "1", kind: "prep" },
  { lane: "gpu", start: 0, len: 2, label: "", kind: "idle" },
  { lane: "gpu", start: 2, len: 4, label: "1", kind: "gpu" },
  { lane: "cpu", start: 2, len: 2, label: "2", kind: "prep" },
  { lane: "gpu", start: 6, len: 4, label: "2", kind: "gpu" },
  { lane: "cpu", start: 6, len: 2, label: "3", kind: "prep" },
  { lane: "gpu", start: 10, len: 4, label: "3", kind: extra ? "extra" : "gpu" },
  { lane: "cpu", start: 10, len: 2, label: "4", kind: "prep" },
  { lane: "gpu", start: 14, len: 4, label: "4", kind: "gpu" },
];

interface Scene {
  label: string;
  blocks: readonly Block[];
  reads: readonly { from: number; at: number; label: string }[];
  end: number;
  idle: number;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "직렬 · GPU가 기다림",
    blocks: SERIAL,
    reads: [],
    end: 24,
    idle: 8,
    note: "CPU가 앞 결과를 확인하고 다음 batch를 만드는 2칸 동안 GPU가 놉니다. step 네 번에 빈칸이 2×4 = 8칸이고 끝나는 시각은 24입니다.",
  },
  {
    label: "겹침 · 준비를 뒤에 숨김",
    blocks: overlap(false),
    reads: [],
    end: 18,
    idle: 2,
    note: "GPU가 step 1을 계산하는 동안 CPU가 step 2를 미리 만듭니다. 첫 준비 2칸만 남고 나머지 빈칸이 사라져 18에 끝납니다.",
  },
  {
    label: "결과를 한 step 늦게 읽음",
    blocks: overlap(false),
    reads: [
      { from: 6, at: 7, label: "1" },
      { from: 10, at: 11, label: "2" },
    ],
    end: 18,
    idle: 2,
    note: "step 2를 만들 때는 step 1이 아직 계산 중이라 그 결과를 모릅니다. step 1의 결과는 GPU가 step 2를 도는 동안 읽습니다. 화살표가 한 step씩 뒤로 밀려 있습니다.",
  },
  {
    label: "끝 token 뒤 1 token 더",
    blocks: overlap(true),
    reads: [
      { from: 6, at: 7, label: "1" },
      { from: 10, at: 11, label: "2" },
    ],
    end: 18,
    idle: 2,
    note: "요청 R이 step 2에서 끝 token을 냈다고 합시다. CPU가 그 사실을 읽는 시각 11에는 R이 든 step 3이 이미 GPU에 올라가 있어 R의 token 하나를 더 계산하고 버립니다.",
  },
];

const STYLE: Record<Block["kind"], string> = {
  prep: "border-[#7c3aed] bg-[#ede9fe] text-[#4c1d95]",
  gpu: "border-[#2563eb] bg-[#2563eb] text-white",
  idle: "border-dashed border-[#94a3b8] bg-transparent text-[#94a3b8]",
  extra: "border-[#dc2626] bg-[#2563eb] text-white",
};

function Lane({ name, blocks, lane, reduced }: { name: string; blocks: readonly Block[]; lane: Block["lane"]; reduced: boolean }) {
  return (
    <div className="grid grid-cols-[2.6rem_minmax(0,1fr)] items-center gap-2">
      <span className="font-mono text-[11px] font-bold text-muted-foreground">{name}</span>
      <div className="relative grid h-8 grid-cols-[repeat(24,minmax(0,1fr))] gap-px rounded-sm bg-muted/30">
        {blocks
          .filter((b) => b.lane === lane)
          .map((b) => (
            <motion.div
              key={`${b.start}-${b.kind}`}
              className={`relative flex min-w-0 items-center justify-center overflow-hidden rounded-[2px] border font-mono text-[10px] font-bold sm:text-[11px] ${STYLE[b.kind]}`}
              style={{ gridColumn: `${b.start + 1} / span ${b.len}` }}
              initial={reduced ? false : { opacity: 0, scaleX: 0.4 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: reduced ? 0 : b.start * 0.06, duration: reduced ? 0 : 0.3 }}
            >
              {b.kind === "idle" ? "쉼" : b.label}
              {b.kind === "extra" ? <span className="absolute inset-y-0 right-0 w-1/4 bg-[#dc2626]" aria-hidden /> : null}
            </motion.div>
          ))}
      </div>
    </div>
  );
}

export default function OverlapStepViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="Overlap scheduling"
      title="다음 batch 준비를 GPU 계산 뒤에 숨기면 결과를 한 step 늦게 읽습니다"
      description="위 줄은 CPU, 아래 줄은 GPU입니다. 보라 칸 숫자는 CPU가 준비하는 step, 파랑 칸 숫자는 GPU가 계산하는 step, 초록 화살표는 CPU가 그 step의 결과를 읽는 시각입니다. 한 칸은 시간 1단위입니다."
      note="(가정) 준비 2단위·계산 4단위는 설명용 값입니다. 세 엔진의 기본값이 겹침이라는 사실만 본문의 원문에서 확인했고 실제 시간 비율은 모델과 batch에 따라 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="CPU 준비와 GPU 계산의 직렬·겹침 타임라인"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <div className="mt-3 space-y-1.5">
            <Lane name="CPU" lane="cpu" blocks={scene.blocks} reduced={reduced} />
            {/* 결과 읽기 화살표: GPU step이 끝난 뒤 CPU가 그 결과를 읽는 시각 */}
            <div className="grid grid-cols-[2.6rem_minmax(0,1fr)] gap-2">
              <span />
              <div className="relative h-5">
                {scene.reads.map((r) => (
                  <motion.span
                    key={r.from}
                    className="absolute top-0 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-bold text-[#16a34a]"
                    style={{ left: `${(r.at / SPAN) * 100}%` }}
                    initial={reduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduced ? 0 : 0.9, duration: reduced ? 0 : 0.3 }}
                  >
                    <span className="sm:hidden">↑{r.label}</span>
                    <span className="hidden sm:inline">↑ 결과 {r.label}</span>
                  </motion.span>
                ))}
              </div>
            </div>
            <Lane name="GPU" lane="gpu" blocks={scene.blocks} reduced={reduced} />
            <div className="grid grid-cols-[2.6rem_minmax(0,1fr)] gap-2">
              <span />
              <div className="relative h-4 font-mono text-[10px] text-muted-foreground">
                {[0, 6, 12, 18, 24].map((t) => (
                  <span
                    key={t}
                    className={`absolute ${t === 0 ? "" : t === SPAN ? "-translate-x-full" : "-translate-x-1/2"}`}
                    style={{ left: `${(t / SPAN) * 100}%` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">끝나는 시각</dt>
              <dd className="font-bold">{scene.end}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">GPU 쉼</dt>
              <dd className="font-bold">{scene.idle}칸</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">버리는 token</dt>
              <dd className={`font-bold ${scenes.active === 3 ? "text-[#dc2626]" : ""}`}>{scenes.active === 3 ? "R 1개" : "0"}</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
