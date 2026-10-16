import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한도 6에서 A1·B1을 먼저 넣고 남은 4칸을 C(입력 20위치)에 주는 실행을 다섯 번 쌓는다.
 * 한 mechanism: 행마다 6칸이 같은 모양(A·B·C C C C)으로 차고, C 진행 띠가 4칸씩 차서
 * 20칸을 다 채운 다섯 번째 행에서만 C의 첫 출력이 켜진다. A·B는 매 행 출력을 받는다.
 */
const BUDGET = 6;
const C_INPUT = 20;
const C_PER_RUN = 4;
const RUNS = 5;

const SCENES = Array.from({ length: RUNS }, (_, i) => {
  const run = i + 1;
  const done = run * C_PER_RUN;
  return {
    label: `실행 ${run} · C ${done}/${C_INPUT}`,
    run,
    note:
      run === 1
        ? "6칸 중 A와 B가 한 칸씩 쓰고 남은 4칸에 C의 입력 1~4위치가 들어갑니다. A·B는 이 실행 뒤 다음 출력을 받지만 C는 입력 중간이라 아직 출력이 없습니다."
        : run < RUNS
          ? `같은 순서와 같은 한도라 행의 모양이 똑같습니다. C는 ${done}위치까지 읽었고 ${C_INPUT - done}위치가 남았습니다. A·B는 실행마다 출력 하나씩, 지금까지 ${run}개를 받았습니다.`
          : "다섯 번째 행에서 C의 마지막 4위치를 읽어 20칸이 모두 찹니다. 이때 처음으로 C의 첫 출력을 고릅니다. 다음 실행부터 C도 한 위치씩 이어 쓰는 경로로 들어갑니다.",
  };
});

type Slot = "A" | "B" | "C";
const ROW: readonly Slot[] = ["A", "B", "C", "C", "C", "C"];
const SLOT_STYLE: Record<Slot, string> = {
  A: "border-[#64748b] bg-[#e2e8f0] text-[#334155]",
  B: "border-[#64748b] bg-[#e2e8f0] text-[#334155]",
  C: "border-[#2563eb] bg-[#2563eb] text-white",
};

export default function ChunkFiveRunsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const cDone = scene.run * C_PER_RUN;

  return (
    <VizFrame
      eyebrow="Chunked prefill · five runs"
      title="한도 6의 실행이 같은 모양으로 다섯 번 쌓여야 C의 첫 출력이 나옵니다"
      description="한 행이 실행 한 번, 행의 6칸이 한도 6입니다. 회색은 이어 쓰는 A·B의 한 위치, 파랑은 C의 입력 위치입니다. 오른쪽은 그 실행 뒤에 나온 출력, 아래 띠는 C의 입력 20위치 진행입니다."
      note="A·B가 다섯 실행 내내 끝나지 않는다고 둔 본문 7절의 가정입니다. 행마다 걸리는 시간은 같다고 볼 수 없습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="한도 6 실행 다섯 번과 C의 진행"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 grid grid-cols-[3.25rem_minmax(0,1fr)_5.5rem] items-center gap-x-2 gap-y-1.5 sm:grid-cols-[4rem_minmax(0,1fr)_8rem]">
            <span className="text-[10px] font-bold text-muted-foreground">실행</span>
            <span className="text-[10px] font-bold text-muted-foreground">한도 6칸</span>
            <span className="text-[10px] font-bold text-muted-foreground">이번 출력</span>
            {Array.from({ length: RUNS }, (_, r) => {
              const shown = r < scene.run;
              const current = r === scene.run - 1;
              const cFrom = r * C_PER_RUN;
              return (
                <div key={r} className="contents">
                  <span className={`font-mono text-[11px] font-bold ${current ? "text-primary" : "text-muted-foreground"}`}>{r + 1}</span>
                  <div className="grid grid-cols-6 gap-1">
                    {ROW.map((slot, i) => {
                      const cIndex = slot === "C" ? cFrom + (i - 2) + 1 : 0;
                      return shown ? (
                        <motion.span
                          key={`${r}-${i}`}
                          className={`flex h-7 items-center justify-center rounded-sm border font-mono text-[10px] font-bold ${SLOT_STYLE[slot]} ${current ? "" : "opacity-60"}`}
                          initial={current ? { opacity: 0, y: -6 } : false}
                          animate={{ opacity: current ? 1 : 0.6, y: 0 }}
                          transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : i * 0.08 }}
                        >
                          {slot === "C" ? cIndex : slot}
                        </motion.span>
                      ) : (
                        <span key={`${r}-${i}`} className="h-7 rounded-sm border border-dashed border-border" />
                      );
                    })}
                  </div>
                  <div className="flex h-7 items-center gap-1">
                    {shown ? (
                      <>
                        <span className="rounded-sm border border-[#64748b] px-1 font-mono text-[10px] font-bold text-[#334155] dark:text-[#cbd5e1]">A</span>
                        <span className="rounded-sm border border-[#64748b] px-1 font-mono text-[10px] font-bold text-[#334155] dark:text-[#cbd5e1]">B</span>
                        {r === RUNS - 1 ? (
                          <motion.span
                            className="rounded-sm border border-[#16a34a] bg-[#dcfce7] px-1 font-mono text-[10px] font-bold text-[#166534]"
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.7 }}
                          >
                            C 첫
                          </motion.span>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-[11px] font-bold text-muted-foreground">C의 입력 20위치</p>
          <div className="mt-1 grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${C_INPUT}, minmax(0, 1fr))` }}>
            {Array.from({ length: C_INPUT }, (_, i) => {
              const filled = i < cDone;
              const fresh = filled && i >= cDone - C_PER_RUN;
              return (
                <motion.span
                  key={i}
                  className="h-4 rounded-[2px] border"
                  initial={false}
                  animate={{
                    backgroundColor: filled ? (fresh ? "#2563eb" : "#93c5fd") : "rgba(0,0,0,0)",
                    borderColor: filled ? (fresh ? "#2563eb" : "#93c5fd") : "#cbd5e1",
                  }}
                  transition={{ duration: reduced ? 0 : 0.25, delay: reduced || !fresh ? 0 : 0.3 + (i - (cDone - C_PER_RUN)) * 0.08 }}
                />
              );
            })}
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">한 행</dt>
              <dd className="font-bold">1 + 1 + 4 = {BUDGET}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">C 남은 입력</dt>
              <dd className="font-bold text-[#2563eb]">{C_INPUT - cDone}위치</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">A·B 출력</dt>
              <dd className="font-bold">각 {scene.run}개</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">C 첫 출력</dt>
              <dd className={`font-bold ${scene.run === RUNS ? "text-[#16a34a]" : ""}`}>{scene.run === RUNS ? "실행 5 뒤" : "아직 없음"}</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
