import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const PROFILES = [
  {
    label: "Native text",
    limit: "262K",
    input: "text tokens",
    position: "native position profile",
    test: "위치별 retrieval",
  },
  {
    label: "Native multimodal",
    limit: "262K",
    input: "text + visual tokens",
    position: "time · height · width",
    test: "token budget + retrieval",
  },
  {
    label: "Extended",
    limit: "1.01M",
    input: "scaled long sequence",
    position: "separate scaling profile",
    test: "quality · latency · peak",
  },
] as const;

export default function ContextEnvelopeViz() {
  const scenes = useAnimatedScenes(PROFILES.length, 4200);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="Context support envelope"
      title="같은 max length 숫자라도 입력·위치 표현·검증 범위가 다르다"
      description="세 profile을 비교합니다. ← →로 profile을 넘기고 Space로 자동 재생을 켜거나 끌 수 있습니다."
      note="Extended profile은 native profile의 자동 확대판이 아닙니다. 위치별 품질·latency·memory를 별도 evidence로 남깁니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Qwen context profile comparison"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div data-viz-live-only className="flex flex-1 flex-col justify-center">
          <div className="grid grid-cols-3 gap-2">
            {PROFILES.map((profile, index) => (
              <button
                key={profile.label}
                type="button"
                aria-pressed={active === index}
                onClick={() => scenes.setActive(index)}
                className={`min-w-0 border px-2 py-3 text-left sm:px-4 sm:py-4 ${active === index ? "border-primary bg-primary/10" : "border-border bg-background"}`}
              >
                <span className="block break-keep text-[10px] font-bold leading-4 sm:text-xs">{profile.label}</span>
                <strong className="mt-2 block font-mono text-sm sm:text-lg">
                  {profile.limit}
                </strong>
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-1 sm:mt-6 sm:gap-3">
            <div className="min-w-0 border border-sky-500/40 bg-sky-500/10 p-2 text-center sm:p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-sky-800 dark:text-sky-200">
                Input
              </p>
              <p className="mt-2 break-words text-[10px] font-bold leading-4 sm:text-sm">{PROFILES[active].input}</p>
            </div>
            <span
              aria-hidden
              className="my-auto h-px w-2 bg-border sm:w-5"
            />
            <div className="min-w-0 border border-violet-500/40 bg-violet-500/10 p-2 text-center sm:p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-violet-800 dark:text-violet-200">
                Position
              </p>
              <p className="mt-2 break-words text-[10px] font-bold leading-4 sm:text-sm">
                {PROFILES[active].position}
              </p>
            </div>
            <span
              aria-hidden
              className="my-auto h-px w-2 bg-border sm:w-5"
            />
            <div className="min-w-0 border border-emerald-500/40 bg-emerald-500/10 p-2 text-center sm:p-4">
              <p className="text-[10px] font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-200">
                Release evidence
              </p>
              <p className="mt-2 break-words text-[10px] font-bold leading-4 sm:text-sm">{PROFILES[active].test}</p>
            </div>
          </div>
        </div>
        <AnimatedSceneControls
          {...scenes}
          labels={PROFILES.map((profile) => profile.label)}
        />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {PROFILES.map((profile, index) => (
            <li key={profile.label}>
              <strong>{index + 1}. {profile.label} · {profile.limit}</strong>
              <span className="mt-1 block text-muted-foreground">
                입력은 {profile.input}, 위치 표현은 {profile.position}, 배포 전 확인할 증거는 {profile.test}입니다.
              </span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
