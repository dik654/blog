import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #failure — BlockExecutor는 FinalizeBlock response, application Commit, CometBFT State를 차례로 저장한다.
 * Application Commit 뒤 State 저장 전에 멈추면 app는 h41, State는 h40이다.
 * Restart handshake가 네 기록을 비교해 빠진 단계를 재생하고 다시 같은 height에 맞춘다.
 */
type Cell = { text: string; tone: "new" | "gap" | "fixed" };

const ROWS = ["BlockStore · block bytes", "① FinalizeBlock response", "② Application Commit", "③ CometBFT State"] as const;

const SCENES: readonly { label: string; summary: string; cells: readonly Cell[]; compare: boolean; note: string }[] = [
  {
    label: "정상이면 ①→②→③",
    summary: "네 기록 모두 h41",
    compare: false,
    cells: [
      { text: "B41", tone: "new" },
      { text: "h41 결과", tone: "new" },
      { text: "h41 · AppHash A41", tone: "new" },
      { text: "h41 · A41", tone: "new" },
    ],
    note: "+2/3 precommit과 B41 bytes가 있으면 BlockExecutor가 FinalizeBlock response, application Commit, CometBFT State를 이 순서로 저장합니다. 끝나면 네 기록이 같은 높이를 가리킵니다. AppHash는 application이 계산한 state 요약 hash입니다.",
  },
  {
    label: "②와 ③ 사이에서 멈춤",
    summary: "app h41 · State h40",
    compare: false,
    cells: [
      { text: "B41", tone: "new" },
      { text: "h41 결과", tone: "new" },
      { text: "h41 · AppHash A41", tone: "new" },
      { text: "h40 그대로", tone: "gap" },
    ],
    note: "Application Commit은 끝났지만 CometBFT State를 저장하기 전에 node가 멈췄습니다. Application이 CometBFT State보다 한 단계 앞선 상태로 디스크에 남습니다.",
  },
  {
    label: "재시작 때 대조",
    summary: "height·AppHash 비교",
    compare: true,
    cells: [
      { text: "B41", tone: "new" },
      { text: "h41 결과", tone: "new" },
      { text: "h41 · AppHash A41", tone: "new" },
      { text: "h40", tone: "gap" },
    ],
    note: "다시 켜지면 restart handshake가 BlockStore, 저장된 FinalizeBlock response, application height·AppHash, CometBFT State를 서로 비교해 어느 단계가 빠졌는지 찾습니다.",
  },
  {
    label: "빠진 단계를 채움",
    summary: "다시 네 기록 모두 h41",
    compare: false,
    cells: [
      { text: "B41", tone: "new" },
      { text: "h41 결과", tone: "new" },
      { text: "h41 · AppHash A41", tone: "new" },
      { text: "h41 · A41", tone: "fixed" },
    ],
    note: "Deterministic replay와 state save를 조정해 빠진 단계를 채우면 네 기록이 다시 h41에 맞습니다. 이 재생에서 email이나 결제 API 같은 외부 효과를 FinalizeBlock 안에서 무조건 다시 호출하면 중복될 수 있습니다.",
  },
];

const TONE: Record<Cell["tone"], { fill: string; stroke: string; dash?: string }> = {
  new: { fill: "#dbeafe", stroke: "#2563eb" },
  gap: { fill: "#fff7ed", stroke: "#d97706", dash: "4 3" },
  fixed: { fill: "#dcfce7", stroke: "#16a34a" },
};

export default function CrashReplayViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const labels = SCENES.map((scene) => scene.label);
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="높이 41 저장 도중 멈춤"
      title="Application이 State보다 한 height 앞서면 재시작 때 기록을 대조해 맞춥니다"
      description="한 줄이 node가 디스크에 남기는 기록 하나입니다. ①②③은 BlockExecutor가 저장하는 순서이고, 파란 칸은 h41, 점선 주황 칸은 아직 h40, 초록 칸은 재시작 뒤 채운 기록입니다."
      note="높이와 hash 이름은 앞의 Alice→Bob 사례를 이어 쓴 설명용입니다. 재생의 세부 절차는 이 그림에 넣지 않았습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Application Commit 뒤 CometBFT State 저장 전에 멈춘 node가 재시작 때 기록을 대조해 맞추는 네 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />

        <div className="mt-4 grid min-w-0 grid-cols-[minmax(0,1fr)_1.5rem] gap-2">
          <div className="min-w-0 space-y-2">
            {ROWS.map((row, index) => {
              const cell = scene.cells[index];
              const tone = TONE[cell.tone];
              const crash = scenes.active === 1 && index === 3;
              return (
                <div key={row} className="grid min-w-0 grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center gap-2 text-xs sm:text-sm">
                  <span className="break-keep font-semibold leading-5">{row}</span>
                  <div
                    className="flex min-h-9 items-center justify-between gap-1 rounded-md px-2 font-mono transition-colors duration-300 motion-reduce:transition-none"
                    style={{ backgroundColor: tone.fill, border: `1px ${tone.dash ? "dashed" : "solid"} ${tone.stroke}`, color: "#0f172a" }}
                  >
                    <span className="break-keep text-[11px] leading-4 sm:text-xs">{cell.text}</span>
                    <span className="shrink-0 text-[10px] font-bold" style={{ color: "#b45309" }}>{crash ? "■ 멈춤" : ""}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <svg viewBox="0 0 24 180" className="h-full w-6" preserveAspectRatio="none" aria-hidden>
            <path d="M4 10 H14 V170 H4" fill="none" stroke={scene.compare ? "#2563eb" : "none"} strokeWidth={1.25} />
            <path d="M14 90 H22" fill="none" stroke={scene.compare ? "#2563eb" : "none"} strokeWidth={1.25} />
          </svg>
        </div>
        <p className={`mt-2 text-right text-[11px] font-bold ${scene.compare ? "text-primary" : "text-transparent"}`} aria-hidden={!scene.compare}>
          restart handshake: ②는 h41, ③은 h40 → ③이 빠짐
        </p>

        <StableSceneStack
          active={scenes.active}
          className="mt-3"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
