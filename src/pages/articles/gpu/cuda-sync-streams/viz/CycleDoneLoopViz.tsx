import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #source-pipeline — simpleMultiCopy의 processWithStreams, streams_used=2를 대입한 두 회차.
 * 원문 순서: next 계산 → cudaEventSynchronize(cycleDone[next]) → kernel(current) → H2D(next) → D2H(current) → record(cycleDone[current]).
 */
type Tone = "now" | "past" | "event";
type Op = readonly [string, Tone];
type Scene = {
  label: string;
  vars: string;
  host: string;
  hostOn: boolean;
  slots: readonly [readonly Op[], readonly Op[]];
  note: string;
};

const SCENES: readonly Scene[] = [
  { label: "다음 자리 계산", vars: "current=0 · next=(0+1)%2=1", host: "host가 다음 줄을 정합니다", hostOn: false, slots: [[], []], note: "현재 slot이 0이면 다음 slot은 1입니다. 아직 어느 줄에도 작업을 넣지 않았습니다." },
  { label: "다음 자리 기다리기", vars: "current=0 · next=1", host: "host 대기: cycleDone[1]", hostOn: true, slots: [[], [["cycleDone[1] 확인", "event"]]], note: "slot 1을 다시 쓰기 전에 그 slot의 이전 회차 표식을 host에서 기다립니다." },
  { label: "계산과 다음 입력", vars: "current=0 · next=1", host: "host가 작업을 제출합니다", hostOn: false, slots: [[["kernel 계산", "now"]], [["H2D 다음 입력", "now"]]], note: "slot 0에는 계산을, slot 1에는 다음 입력 보내기를 각자의 stream에 제출합니다." },
  { label: "가져오고 표식 기록", vars: "current=0 · next=1", host: "host가 작업을 제출합니다", hostOn: false, slots: [[["kernel 계산", "past"], ["D2H 가져오기", "now"], ["record cycleDone[0]", "event"]], [["H2D 다음 입력", "past"]]], note: "slot 0의 D2H 뒤에 cycleDone[0]을 기록합니다. 이 표식이 끝나면 slot 0의 가져오기까지 끝난 것입니다." },
  { label: "자리 바꿔 기다리기", vars: "current=1 · next=(1+1)%2=0", host: "host 대기: cycleDone[0]", hostOn: true, slots: [[["cycleDone[0] 확인", "event"]], [["H2D 다음 입력", "past"]]], note: "다음 반복은 current=1, next=0입니다. slot 0을 재사용하기 전에 앞에서 기록한 표식의 완료를 기다립니다." },
  { label: "반대쪽으로 반복", vars: "current=1 · next=0", host: "host가 작업을 제출합니다", hostOn: false, slots: [[["H2D 다음 입력", "now"]], [["kernel 계산", "now"], ["D2H 가져오기", "now"], ["record cycleDone[1]", "event"]]], note: "이제 slot 1이 계산하고 slot 0이 다음 입력을 받습니다. slot 1의 표식은 다음 회차의 대기가 다시 확인합니다." },
];

const TONE: Record<Tone, string> = {
  now: "border-primary bg-primary/15 text-foreground",
  past: "border-border border-dashed text-muted-foreground",
  event: "border-amber-600 text-amber-700 dark:text-amber-400",
};

function Slot({ name, active, ops }: { name: string; active: boolean; ops: readonly Op[] }) {
  return (
    <div className={`min-w-0 rounded-lg border p-2 sm:p-3 ${active ? "border-primary" : "border-border"}`}>
      <p className="text-sm font-bold">{name}</p>
      <ol className="mt-2 space-y-2">
        {ops.map(([text, tone]) => (
          <li key={text} className={`rounded border px-2 py-1 text-xs leading-5 ${TONE[tone]}`}>{text}</li>
        ))}
      </ol>
    </div>
  );
}

export default function CycleDoneLoopViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);

  return (
    <VizFrame
      eyebrow="slot 교대"
      title="cycleDone은 어느 자리의 재사용을 막을까요"
      description="원문의 반복문에 streams_used=2를 대입했습니다. 칸의 위에서 아래로 그 stream에 제출한 순서이고, 점선 칸은 앞서 제출한 작업입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="두 slot을 번갈아 쓰며 cycleDone 표식을 기록하고 기다리는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => {
            const current = scene.vars.startsWith("current=0") ? 0 : 1;
            return (
              <div key={scene.label}>
                <h4 className="text-base font-bold">{scene.label}</h4>
                <p className="mt-1 font-mono text-sm font-bold text-primary">{scene.vars}</p>
                <p className={`mt-3 rounded-lg border px-3 py-2 text-sm ${scene.hostOn ? "border-amber-600 text-amber-700 dark:text-amber-400" : "border-border text-muted-foreground"}`}>{scene.host}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
                  <Slot name={`slot 0${current === 0 ? " · current" : " · next"}`} active={current === 0} ops={scene.slots[0]} />
                  <Slot name={`slot 1${current === 1 ? " · current" : " · next"}`} active={current === 1} ops={scene.slots[1]} />
                </div>
                <p className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{scene.note}</p>
              </div>
            );
          })}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
        <StaticSceneList labels={SCENES.map((scene) => scene.label)} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
