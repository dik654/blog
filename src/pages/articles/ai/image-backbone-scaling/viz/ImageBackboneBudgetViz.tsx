import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

function ScenePlayer({
  labels,
  notes,
  children,
}: {
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
}) {
  const controls = useAnimatedScenes(labels.length, 4800, {
    loop: false,
    autoPlay: false,
  });

  return (
    <VizFrame
      eyebrow="한 이미지 추적"
      title="같은 사진을 크게 만들면 두 Backbone의 비용은 다르게 늘어납니다"
      description="재생하면 224px 사진이 CNN의 공간 위치와 ViT의 patch token·attention score 항목으로 바뀌는 과정을 차례로 보여줍니다."
      className="my-8"
    >
      <div
        id={controls.playbackId}
        data-viz-id="image-backbone-budget-viz"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-primary [&_[data-viz-controls]>p]:hidden"
      >
        <div data-viz-live-only>
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-primary">
            해상도 추적 · {String(controls.active + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1 text-base font-bold leading-6">
            {labels[controls.active]}
          </h3>
          <div className="mt-3 min-w-0 overflow-hidden">
            {children(controls.active)}
          </div>
          <p className="mt-3 border-l border-primary/50 pl-3 text-xs leading-5 text-muted-foreground">
            {notes[controls.active]}
          </p>
        </div>
        <AnimatedSceneControls labels={[...labels]} {...controls} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {labels.map((label, index) => (
            <li key={label}>
              <strong>
                {index + 1}. {label}
              </strong>
              <span className="mt-1 block text-muted-foreground">
                {notes[index]}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

function DensityGrid({ axis, active }: { axis: number; active: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="grid aspect-square w-full max-w-24 gap-px bg-border p-px"
      style={{ gridTemplateColumns: `repeat(${axis}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: axis * axis }, (_, index) => (
        <span
          key={index}
          className={
            active ? "bg-primary opacity-90" : "bg-foreground/25 opacity-30"
          }
        />
      ))}
    </div>
  );
}

function RatioRow({
  label,
  before,
  after,
  ratio,
  active,
}: {
  label: string;
  before: string;
  after: string;
  ratio: string;
  active: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: active ? 1 : 0.32 }}
      className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-t border-border py-2 first:border-t-0"
    >
      <div className="min-w-0">
        <strong className="block break-keep text-xs">{label}</strong>
        <span className="mt-1 block break-words font-mono text-[11px] text-muted-foreground">
          {before} → {after}
        </span>
      </div>
      <strong className="self-center font-mono text-sm text-primary">
        {ratio}
      </strong>
    </motion.div>
  );
}

function MobileBackboneTrace({
  active,
  side,
  axis,
  tokens,
  pairs,
}: {
  active: number;
  side: number;
  axis: number;
  tokens: number;
  pairs: number;
}) {
  return (
    <div className="space-y-2 sm:hidden">
      <div className="flex items-center justify-between gap-3 border-y border-border py-2">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[.12em] text-muted-foreground">
            공통 입력
          </p>
          <strong className="font-mono text-sm text-primary">
            {side} × {side}px
          </strong>
        </div>
        <span className="text-right text-[10px] leading-4 text-muted-foreground">
          같은 사진
          <br />
          정사각 입력
        </span>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: active >= 1 ? 1 : 0.3 }}
        className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 border-l-2 border-border py-2 pl-3"
      >
        <div>
          <p className="text-[9px] font-black uppercase tracking-[.12em] text-muted-foreground">
            CNN
          </p>
          <strong className="text-xs">Local</strong>
        </div>
        <div>
          <strong className="font-mono text-sm">
            {side}² = {(side * side).toLocaleString()}
          </strong>
          <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
            입력의 공간 위치
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={false}
        animate={{ opacity: active >= 1 ? 1 : 0.3 }}
        className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 border-l-2 border-primary py-2 pl-3"
      >
        <div>
          <p className="text-[9px] font-black uppercase tracking-[.12em] text-primary">
            ViT · P=16
          </p>
          <strong className="text-xs">Global</strong>
        </div>
        <div>
          <strong className="font-mono text-sm">
            {axis}² = {tokens.toLocaleString()} tokens
          </strong>
          <p className="mt-1 break-words font-mono text-[10px] leading-4 text-muted-foreground">
            {tokens.toLocaleString()}² = {pairs.toLocaleString()} pairs
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={false}
        animate={{ opacity: active >= 2 ? 1 : 0.3 }}
        className="grid grid-cols-2 gap-3 border-y border-border py-2 text-xs"
      >
        <p>
          공간 위치 <strong className="font-mono text-primary">4×</strong>
        </p>
        <p className="text-right">
          Token pairs <strong className="font-mono text-primary">16×</strong>
        </p>
      </motion.div>

      <motion.div
        initial={false}
        animate={{ opacity: active >= 3 ? 1 : 0.3 }}
        className="border-l-2 border-primary pl-3"
      >
        <p className="text-[9px] font-black uppercase tracking-[.12em] text-primary">
          실측 조건
        </p>
        <p className="mt-1 break-keep text-[10px] font-bold leading-4">
          같은 split · 입력 · 정밀도 · 장비
        </p>
      </motion.div>
    </div>
  );
}

export function ImageBackboneBudgetViz() {
  const labels = [
    "224px 입력 고정",
    "CNN·ViT 표현 계산",
    "448px 비용 비교",
    "실측 조건 고정",
  ] as const;
  const notes = [
    "같은 사진을 두 구조에 넣고, 해상도·깊이·폭 가운데 바꾼 축을 먼저 고정합니다.",
    "CNN은 공간 위치 50,176개, ViT는 token 196개와 score 항목 38,416개를 만듭니다.",
    "448px에서는 token 784개, 한 head·layer의 score 항목 614,656개가 됩니다.",
    "4배·16배는 구조적 증가율입니다. 실제 지연·처리량·메모리는 같은 조건에서 측정합니다.",
  ] as const;

  return (
    <ScenePlayer labels={labels} notes={notes}>
      {(active) => {
        const enlarged = active >= 2;
        const side = enlarged ? 448 : 224;
        const axis = enlarged ? 28 : 14;
        const tokens = axis * axis;
        const pairs = tokens * tokens;

        return (
          <div role="img" aria-label={labels[active]} className="min-w-0">
            <MobileBackboneTrace
              active={active}
              side={side}
              axis={axis}
              tokens={tokens}
              pairs={pairs}
            />

            <div className="hidden gap-4 sm:grid sm:grid-cols-2">
              <section className="min-w-0 border-y border-border py-2 sm:col-span-2">
                <p className="text-[10px] font-black uppercase tracking-[.14em] text-muted-foreground">
                  공통 입력
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-[4rem_minmax(0,1fr)] sm:items-center">
                  <div className="relative aspect-square w-full overflow-hidden bg-muted">
                    <div className="absolute inset-[18%] border-2 border-foreground/70" />
                    <div className="absolute bottom-[18%] left-[28%] h-[15%] w-[44%] border border-foreground/45" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-lg font-black text-primary">
                      {side} × {side}px
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      같은 사진 · 정사각 입력으로 단순화
                    </p>
                  </div>
                </div>
              </section>

              <motion.section
                initial={false}
                animate={{ opacity: active >= 1 ? 1 : 0.28 }}
                className="min-w-0 border-l-2 border-border pl-4"
              >
                <p className="text-[10px] font-black uppercase tracking-[.14em] text-muted-foreground">
                  CNN 경로
                </p>
                <h4 className="mt-1 break-keep text-sm font-black">
                  Local convolution
                </h4>
                <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,5rem)_minmax(0,1fr)] sm:items-center">
                  <DensityGrid axis={enlarged ? 12 : 8} active={active >= 1} />
                  <div className="min-w-0">
                    <p className="font-mono text-lg font-black">
                      {side * side === 50176 ? "50,176" : "200,704"}
                    </p>
                    <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">
                      입력의 공간 위치
                    </p>
                    <p className="mt-3 text-[10px] leading-4 text-muted-foreground">
                      격자는 밀도만 줄여 그린 도식입니다.
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.section
                initial={false}
                animate={{ opacity: active >= 1 ? 1 : 0.28 }}
                className="min-w-0 border-l-2 border-primary/60 pl-4"
              >
                <p className="text-[10px] font-black uppercase tracking-[.14em] text-primary">
                  ViT 경로 · P=16
                </p>
                <h4 className="mt-1 break-keep text-sm font-black">
                  Patch tokens → global attention
                </h4>
                <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,5rem)_minmax(0,1fr)] sm:items-center">
                  <DensityGrid axis={axis} active={active >= 1} />
                  <div className="min-w-0">
                    <p className="font-mono text-lg font-black text-primary">
                      {tokens.toLocaleString()} tokens
                    </p>
                    <p className="mt-2 break-words font-mono text-sm font-bold">
                      {pairs.toLocaleString()} pairs
                    </p>
                    <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">
                      한 head·한 layer의 score matrix 항목
                    </p>
                  </div>
                </div>
              </motion.section>
            </div>

            <div className="mt-3 hidden gap-3 sm:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="min-w-0 border-y border-border px-1">
                <RatioRow
                  label="CNN 공간 위치"
                  before="224² = 50,176"
                  after="448² = 200,704"
                  ratio="4×"
                  active={active >= 1}
                />
                <RatioRow
                  label="ViT global attention score 항목"
                  before="196² = 38,416"
                  after="784² = 614,656"
                  ratio="16×"
                  active={active >= 2}
                />
              </div>
              <motion.div
                initial={false}
                animate={{ opacity: active >= 3 ? 1 : 0.28 }}
                className="min-w-0 border-l-2 border-primary pl-4"
              >
                <p className="text-[10px] font-black uppercase tracking-[.14em] text-primary">
                  선택 조건
                </p>
                <p className="mt-2 break-keep text-sm font-bold leading-6">
                  같은 split · 같은 입력 · 같은 정밀도 · 같은 장비
                </p>
                <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
                  품질 · p95 지연 · 처리량 · peak memory를 함께 측정하기 전에는
                  최종 Backbone을 정하지 않습니다.
                </p>
              </motion.div>
            </div>
          </div>
        );
      }}
    </ScenePlayer>
  );
}

const frontierCandidates = [
  { name: "A", quality: ".82", latency: "18 ms", memory: "4.2 GB", kept: true },
  { name: "B", quality: ".84", latency: "24 ms", memory: "5.1 GB", kept: true },
  {
    name: "C",
    quality: ".83",
    latency: "30 ms",
    memory: "5.8 GB",
    kept: false,
  },
] as const;

export function RuntimeFrontierViz() {
  return (
    <VizFrame
      eyebrow="설명용 가정"
      title="세 수치를 함께 놓으면 버릴 후보와 남길 후보가 갈립니다"
      description="아래 값은 Pareto frontier를 설명하기 위한 가정이며 실제 모델 측정값이 아닙니다."
      className="my-8"
      note="B는 C보다 품질이 높고 지연과 메모리도 작으므로 C를 지배합니다. A와 B 가운데 무엇을 고를지는 서비스의 품질 목표와 지연·메모리 상한이 정합니다."
    >
      <div
        role="img"
        aria-label="설명용 후보 A, B, C의 품질, 지연, 메모리를 비교해 C를 제외하고 A와 B를 Pareto frontier에 남기는 표"
        className="min-w-0"
      >
        <div className="hidden grid-cols-[3.5rem_repeat(3,minmax(0,1fr))_7rem] gap-3 border-b border-border pb-2 text-[10px] font-black uppercase tracking-[.1em] text-muted-foreground sm:grid">
          <span>후보</span>
          <span>Macro recall</span>
          <span>p95 지연</span>
          <span>Peak memory</span>
          <span>판정</span>
        </div>
        <div className="divide-y divide-border">
          {frontierCandidates.map((candidate) => (
            <div
              key={candidate.name}
              className={`grid gap-3 py-4 sm:grid-cols-[3.5rem_repeat(3,minmax(0,1fr))_7rem] sm:items-center ${
                candidate.kept ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <strong className="font-mono text-lg">{candidate.name}</strong>
              <Metric label="Macro recall" value={candidate.quality} />
              <Metric label="p95 지연" value={candidate.latency} />
              <Metric label="Peak memory" value={candidate.memory} />
              <strong
                className={`text-xs ${candidate.kept ? "text-primary" : "line-through"}`}
              >
                {candidate.kept ? "frontier" : "제외"}
              </strong>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 border-t border-border pt-4 text-xs leading-5 sm:grid-cols-2">
          <p className="border-l-2 border-primary pl-3">
            <strong>A</strong> · 지연과 메모리가 작지만 품질은 B보다 낮음
          </p>
          <p className="border-l-2 border-primary pl-3">
            <strong>B</strong> · 품질이 높지만 A보다 느리고 메모리를 더 사용함
          </p>
        </div>
      </div>
    </VizFrame>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <p className="grid grid-cols-[7rem_minmax(0,1fr)] gap-2 text-xs sm:block">
      <span className="text-muted-foreground sm:hidden">{label}</span>
      <strong className="font-mono">{value}</strong>
    </p>
  );
}
