import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";
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
        className="mx-auto mt-3 grid w-fit gap-0.5"
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
      <p className="mt-3 text-center text-xs tabular-nums text-foreground">{rows}행 × {cols}값</p>
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

function RereadScene() {
  return (
    <div>
      <p className="text-sm leading-6 text-muted-foreground">Query 여덟 행을 두 행씩 네 묶음으로 나눕니다. 각 묶음이 K와 V 전체를 다시 읽습니다.</p>
      <div className="mt-4 space-y-2">
        {["Q 0·1", "Q 2·3", "Q 4·5", "Q 6·7"].map((query, index) => (
          <div key={query} className="grid grid-cols-[3.8rem_minmax(0,1fr)_auto] items-center gap-2 border-b border-border pb-2">
            <div className="grid grid-cols-2 gap-1" aria-label={`${query} 두 행`}>
              <span className="h-5 border border-primary/50 bg-primary/20" />
              <span className="h-5 border border-primary/50 bg-primary/20" />
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="h-5 border border-border bg-muted/60"><span className="sr-only">K 전체</span></div>
              <div className="h-5 border border-border bg-muted/60"><span className="sr-only">V 전체</span></div>
            </div>
            <p className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">{index + 1}회 · 64 B</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
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

const scenes = [<OnceScene key="once" />, <RereadScene key="reread" />, <DecodeScene key="decode" />] as const;

export default function AttentionTrafficViz() {
  const scene = useAnimatedScenes(scenes.length, 6500);
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
        <div className="mt-5 min-w-0 border-t border-border pt-5 sm:min-h-[24rem]">{scenes[scene.active]}</div>
        <AnimatedSceneControls {...scene} labels={labels} />
      </div>
    </VizFrame>
  );
}
