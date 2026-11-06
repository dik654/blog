import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #source — 15와 밑 2. 256칸 → 나머지 1인 64칸 → 0·64·128·192의 네 값 → 64와 128의 검산.
 * 칸 하나가 지수 a 하나이고, 한 줄이 16칸입니다. 2ᵃ mod 15는 지수에서 바로 계산합니다.
 */
const SIZE = 256;
const ROW = 16;
const PEAKS = new Set([0, 64, 128, 192]);
const REMAINDERS = [1, 2, 4, 8];
const remainder = (exponent: number) => REMAINDERS[exponent % 4];

const SCENES = [
  { label: "256칸 준비", summary: "지수 0~255", note: "칸 하나가 지수 하나입니다. 첫 기록 공간의 256칸을 똑같이 준비합니다(가정). 왼쪽 숫자는 그 줄 첫 칸의 지수입니다." },
  { label: "나머지 기록", summary: "1 · 2 · 4 · 8 반복", note: "각 지수 a에 2ᵃ mod 15를 둘째 공간에 적습니다. 1·2·4·8이 네 칸마다 돌아오는데, 이 간격이 찾으려는 주기입니다." },
  { label: "1인 가지", summary: "256칸 → 64칸", note: "둘째 공간을 측정해 1이 나온 가지를 고르면 0·4·8·…·252, 16줄에 네 칸씩 64칸이 남습니다. 이 가지를 공짜로 고른다는 뜻이 아니라 원리 설명입니다." },
  { label: "푸리에 변환", summary: "간격 4 → 간격 64", note: "이 장면부터 칸 번호는 지수가 아니라 측정값입니다. 양자 푸리에 변환은 일정한 간격으로 놓인 값을 파동 성분으로 바꾸는 연산입니다. 이 이상적 사례에서 첫 공간을 측정하면 0·64·128·192 중 하나가 나옵니다." },
  { label: "64가 나오면", summary: "주기 4 통과", note: "측정값을 256으로 나눈 분수의 분모를 주기 후보로 읽습니다. 2⁴ mod 15=1이라 통과하고, 일반 컴퓨터의 후처리로 3과 5를 얻습니다." },
  { label: "128이 나오면", summary: "후보 2 실패", note: "분모 2는 주기가 아닙니다. 회로를 다시 돌리거나 다른 후보를 검사합니다. 192는 3/4라 분모 4를 주고, 0은 분수가 0이라 분모를 읽을 수 없습니다." },
] as const;

function Cells({ active }: { active: number }) {
  return (
    <div className="grid grid-cols-[1.75rem_repeat(16,minmax(0,1fr))] gap-px">
      {Array.from({ length: SIZE }, (_, exponent) => {
        const lit = active === 3 ? PEAKS.has(exponent) : active === 2 ? remainder(exponent) === 1 : true;
        const rowStart = exponent % ROW === 0;
        const showDigit = active === 1 || active === 2;
        let tone = "border border-border/70 bg-background text-foreground";
        if (active === 1) tone = remainder(exponent) === 1 ? "border border-primary/60 bg-primary/25 font-bold text-foreground" : "border border-border/70 bg-background text-muted-foreground";
        if (active === 2) tone = lit ? "border border-primary bg-primary/25 font-bold text-foreground" : "border border-transparent text-muted-foreground/25";
        if (active === 3) tone = lit ? "border border-primary bg-primary" : "border border-transparent bg-muted/30";
        return (
          <div key={exponent} className="contents">
            {rowStart && (
              <span
                className={`flex items-center justify-end pr-1 font-mono text-[10px] leading-none ${
                  active === 3 && PEAKS.has(exponent) ? "font-bold text-primary" : "text-muted-foreground"
                }`}
              >
                {exponent}
              </span>
            )}
            <span className={`flex h-[15px] items-center justify-center font-mono text-[10px] leading-none transition-colors ${tone}`}>
              {showDigit ? remainder(exponent) : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const STEP_BOX = "rounded-lg border px-3 py-1 text-sm leading-5";

function Path({ steps, fail }: { steps: readonly { head: string; body: string }[]; fail: boolean }) {
  return (
    <ol className="space-y-2.5">
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        return (
          <li key={step.head} className="relative">
            <div className={`${STEP_BOX} ${last ? (fail ? "border-dashed border-red-600" : "border-primary") : "border-border bg-background"}`}>
              <span className="block text-xs font-bold leading-4 text-muted-foreground">{step.head}</span>
              <span className={`block font-mono font-bold ${last && fail ? "text-red-700 dark:text-red-400" : ""}`}>{step.body}</span>
            </div>
            {!last && <span aria-hidden="true" className="absolute left-6 top-full h-2.5 w-px bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}

const PATH_64 = [
  { head: "측정값", body: "64" },
  { head: "256으로 나눈 분수", body: "64/256 = 1/4 → 분모 4" },
  { head: "검산", body: "2⁴ mod 15 = 1 통과" },
  { head: "주기 4의 절반을 지수로", body: "2² = 4 → 3과 5, 3×5 = 15" },
] as const;

const PATH_128 = [
  { head: "측정값", body: "128" },
  { head: "256으로 나눈 분수", body: "128/256 = 1/2 → 분모 2" },
  { head: "검산", body: "2² mod 15 = 4 실패" },
  { head: "다음 행동", body: "새로 준비해 다시 실행" },
] as const;

export default function PeriodCellsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const stage = active < 4 ? 0 : active - 3;

  return (
    <VizFrame
      eyebrow="칸으로 세는 주기 찾기"
      title="256칸이 64칸과 네 값으로 줄고, 측정값 하나를 검산합니다"
      description="15와 밑 2로 좁힌 이상적 사례입니다(가정). 큰 수의 회로나 오류 정정 비용은 이 그림에 들어 있지 않습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="256개 지수가 나머지 측정과 푸리에 변환을 거쳐 측정값 하나의 검산으로 이어지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={stage}
          className="mx-auto mt-4 w-full max-w-[480px]"
          scenes={[
            <Cells key="cells" active={active} />,
            <Path key="64" steps={PATH_64} fail={false} />,
            <Path key="128" steps={PATH_128} fail />,
          ]}
        />
        <StableSceneStack
          active={active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
        <StaticSceneList labels={SCENES.map((scene) => scene.label)} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
