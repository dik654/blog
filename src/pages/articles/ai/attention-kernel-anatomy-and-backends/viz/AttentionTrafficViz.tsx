import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

const labels = ["한 번씩 이동", "K·V 네 번 읽기", "한 행 decode"] as const;

function Matrix({
  name,
  rows = 8,
  cols = 2,
  action,
  bytes,
  emphasis = false,
}: {
  name: string;
  rows?: number;
  cols?: number;
  action: string;
  bytes: string;
  emphasis?: boolean;
}) {
  return (
    <div className={`min-w-0 border p-3 ${emphasis ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-mono text-sm font-bold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{action}</p>
      </div>
      <div
        className="mx-auto mt-2 grid w-fit gap-0.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        aria-label={`${name} ${rows}행 ${cols}열`}
      >
        {Array.from({ length: rows * cols }, (_, index) => (
          <span
            key={index}
            className={`h-2.5 w-4 border ${emphasis ? "border-primary/50 bg-primary/20" : "border-border bg-muted/60"}`}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-xs tabular-nums text-foreground">{rows}행 × {cols}값</p>
      <p className="mt-1 text-center text-sm font-bold tabular-nums text-primary">{bytes}</p>
    </div>
  );
}

function OnceScene() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Matrix name="Q" action="읽기" bytes="32 B" />
        <Matrix name="K" action="읽기" bytes="32 B" />
        <Matrix name="V" action="읽기" bytes="32 B" />
        <Matrix name="O" action="쓰기" bytes="32 B" />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="border-l-2 border-border pl-4">
          <p className="text-xs font-bold text-muted-foreground">배열 이동</p>
          <p className="mt-1 font-mono text-sm leading-6 text-foreground">32 + 32 + 32 + 32 = 128 B</p>
        </div>
        <div className="border-l-2 border-primary pl-4">
          <p className="text-xs font-bold text-muted-foreground">같은 전체 계산</p>
          <p className="mt-1 font-mono text-sm leading-6 text-foreground">512 FLOP ÷ 128 B = 4 FLOP/B</p>
        </div>
      </div>
    </div>
  );
}

const PASSES = ["Q 0·1", "Q 2·3", "Q 4·5", "Q 6·7"] as const;

function KvCells({ color }: { color: string }) {
  // K 또는 V 전체 = 8행 × 2값 = 16칸, 칸 하나가 2바이트
  return (
    <span className="grid grid-cols-8 gap-px">
      {Array.from({ length: 16 }, (_, i) => (
        <span key={i} className="size-2 border" style={{ borderColor: color, backgroundColor: `${color}55` }} />
      ))}
    </span>
  );
}

function RereadScene({ playing, reduced }: { playing: boolean; reduced: boolean }) {
  return (
    <div>
      <p className="text-sm leading-6 text-muted-foreground">Query 여덟 행을 두 행씩 네 묶음으로 나눕니다. 묶음마다 HBM의 K 16칸과 V 16칸을 칩으로 다시 가져옵니다.</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border border-border px-2 py-2">
        <span className="text-xs font-bold text-muted-foreground">HBM</span>
        <span className="flex items-center gap-1 font-mono text-[11px] font-bold">K <KvCells color="#2563eb" /></span>
        <span className="flex items-center gap-1 font-mono text-[11px] font-bold">V <KvCells color="#d97706" /></span>
      </div>
      {/* 장면에 들어올 때마다 네 번의 복사를 차례로 다시 보여 준다 */}
      <div key={playing ? "play" : "rest"} className="mt-2 space-y-1">
        {PASSES.map((query, index) => {
          const delay = reduced ? 0 : 0.3 + index * 0.9;
          return (
            <div key={query} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border pb-1">
              <span className="w-12 shrink-0 font-mono text-[11px] font-bold text-primary">{query}</span>
              <motion.span
                className="flex items-center gap-1.5"
                initial={reduced ? false : { opacity: 0.12, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: reduced ? 0 : 0.45 }}
              >
                <span aria-hidden className="text-xs text-muted-foreground">↓</span>
                <KvCells color="#2563eb" />
                <KvCells color="#d97706" />
              </motion.span>
              <motion.span
                className="whitespace-nowrap font-mono text-xs tabular-nums text-foreground"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.35, duration: reduced ? 0 : 0.3 }}
              >
                {index + 1}회 · 32칸 = 64 B · 누적 {(index + 1) * 64} B
              </motion.span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <p className="border-l-2 border-border pl-3 text-sm leading-6 text-foreground">K·V 네 번<br /><strong>4 × 64 = 256 B</strong></p>
        <p className="border-l-2 border-border pl-3 text-sm leading-6 text-foreground">Q·O 한 번<br /><strong>32 + 32 = 64 B</strong></p>
        <p className="border-l-2 border-primary pl-3 text-sm leading-6 text-foreground">전체 이동<br /><strong>320 B → 1.6 FLOP/B</strong></p>
      </div>
    </div>
  );
}

function DecodeScene() {
  return (
    <div>
      <div className="grid grid-cols-[minmax(3.5rem,0.55fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(3.5rem,0.55fr)] gap-2 sm:gap-4">
        <Matrix name="Q" rows={1} action="읽기" bytes="4 B" emphasis />
        <Matrix name="K" action="읽기" bytes="32 B" />
        <Matrix name="V" action="읽기" bytes="32 B" />
        <Matrix name="O" rows={1} action="쓰기" bytes="4 B" emphasis />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="border-l-2 border-border pl-3">
          <p className="text-xs font-bold text-muted-foreground">점수 만들기</p>
          <p className="mt-1 font-mono text-sm text-foreground">Q 한 행 × K 여덟 행 = 32 FLOP</p>
        </div>
        <div className="border-l-2 border-border pl-3">
          <p className="text-xs font-bold text-muted-foreground">값 섞기</p>
          <p className="mt-1 font-mono text-sm text-foreground">점수 여덟 개 × V = 32 FLOP</p>
        </div>
        <div className="border-l-2 border-primary pl-3">
          <p className="text-xs font-bold text-muted-foreground">같은 한 행의 비율</p>
          <p className="mt-1 font-mono text-sm text-foreground">64 FLOP ÷ 72 B = 8/9 FLOP/B</p>
        </div>
      </div>
    </div>
  );
}

export default function AttentionTrafficViz() {
  const scene = useAnimatedScenes(labels.length, 6500);
  const scenes = [
    <OnceScene key="once" />,
    <RereadScene key="reread" playing={scene.active === 1} reduced={scene.reducedMotion} />,
    <DecodeScene key="decode" />,
  ];
  const overview = [
    ["A", "128 B", "한 번씩 이동"],
    ["B", "320 B", "K·V 네 번"],
    ["C", "72 B", "한 query 행"],
  ] as const;
  return (
    <VizFrame
      eyebrow="배열과 이동량"
      title="같은 배열도 몇 번 읽느냐에 따라 128바이트가 320바이트가 됩니다"
      description="작은 칸 하나가 2바이트 값 하나입니다. 모든 장면은 여덟 위치와 성분 두 개라는 같은 사례를 사용합니다."
      note="칸이 차지한 저장 공간과 칸이 메모리 경계를 건넌 횟수를 구별합니다. 실제 cache와 보조 이동은 아래 계산 장부의 경계에서 따로 설명합니다."
    >
      <div role="group" tabIndex={0} onKeyDown={scene.onKeyDown} aria-label="attention 배열 이동량 세 장면" className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className="grid grid-cols-3 gap-2">
          {overview.map(([id, value, detail], index) => (
            <div key={id} className={`min-w-0 border-t-2 px-2 py-2 text-center ${scene.active === index ? "border-primary bg-primary/5" : "border-border"}`}>
              <p className="text-xs font-bold text-muted-foreground">장부 {id}</p>
              <p className="mt-1 text-base font-bold tabular-nums text-foreground">{value}</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <StableSceneStack active={scene.active} scenes={scenes} className="mt-4 border-t border-border pt-4" />
        <AnimatedSceneControls {...scene} labels={labels} />
      </div>
    </VizFrame>
  );
}
