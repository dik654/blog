import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["GST 이전", "100ms 만료", "200ms 만료", "400ms 안에 도착", "결정"] as const;
const NOTES = [
  "GST 이전에는 지연 상한이 아직 성립하지 않을 수 있습니다. 프로토콜은 이 구간의 진행을 약속하지 않아도 안전성 규칙은 계속 지켜야 합니다.",
  "안정된 실제 지연이 300ms라면 100ms 타임아웃은 정직한 리더의 메시지도 늦었다고 판단합니다. 다음 라운드로 이동하지만 고장 사실이 증명된 것은 아닙니다.",
  "200ms도 실제 지연보다 짧아 다시 만료됩니다. 라운드 번호가 바뀌므로 늦게 도착한 이전 라운드 메시지는 현재 결정에 그대로 쓸 수 없습니다.",
  "타임아웃을 400ms로 늘린 라운드에서는 300ms 안에 제안과 표가 도착할 수 있습니다. 이 시점부터 진행 조건이 충족됩니다.",
  "충분한 표와 올바른 증거가 모여 값을 결정합니다. 400ms라는 숫자가 안전성을 만든 것이 아니라 라운드·잠금·증거 규칙이 충돌 결정을 막습니다.",
] as const;
const TIMEOUTS = [0, 100, 200, 400, 400] as const;

export default function ConsensusClassViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3700, { loop: false });
  const active = scenes.active;
  const timeout = TIMEOUTS[active];

  return (
    <VizFrame
      eyebrow="부분 동기 · 진행 조건"
      title="타임아웃을 늘리면 언젠가 실제 지연보다 긴 라운드에 도달합니다"
      description="실제 안정 지연이 300ms인 설명용 실행에서 100→200→400ms로 기다리는 시간을 늘립니다. 타임아웃은 진행을 돕고, 안전성은 별도 증거 규칙이 지킵니다."
      note="DLS의 부분 동기 모델은 실제 인터넷이 반드시 특정 시각에 안정된다고 측정한 결과가 아닙니다. 프로토콜 보장을 설명하기 위한 시간 가정입니다."
      canvasClassName="p-3 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="부분 동기 모델의 타임아웃 증가와 진행" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-2 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] md:gap-3">
          <div className="min-w-0 border border-border bg-background p-2 sm:p-4">
            <div className="flex items-end justify-between gap-2 sm:gap-4">
              <div>
                <p className="text-[9px] font-black text-primary sm:text-[10px]">현재 라운드</p>
                <p className="mt-1 text-lg font-black sm:mt-2 sm:text-2xl">{active === 0 ? "상한 없음" : `${timeout}ms`}</p>
              </div>
              <div className="text-right text-[9px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
                <p>안정 뒤 실제 지연</p>
                <strong className="text-foreground">300ms</strong>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden bg-muted sm:mt-5 sm:h-3" aria-label={`현재 타임아웃 ${timeout}ms`}>
              <div className={`h-full bg-primary transition-[width] duration-300 ${active === 0 ? "w-0" : timeout < 300 ? timeout === 100 ? "w-1/4" : "w-1/2" : "w-full"}`} />
            </div>
            <div className="mt-1 flex justify-between text-[8px] text-muted-foreground sm:mt-2 sm:text-[10px]"><span>0</span><span>300ms 도착</span><span>400</span></div>
          </div>

          <div className="grid min-w-0 gap-px bg-border p-px text-[9px] leading-4 sm:text-xs sm:leading-5">
            <div className="bg-background p-2 sm:p-3">
              <strong className="block text-primary">진행성</strong>
              <span>{active < 3 ? "아직 보장 못 함" : active === 3 ? "조건 충족" : "결정 완료"}</span>
            </div>
            <div className="bg-background p-2 sm:p-3">
              <strong className="block text-primary">안전성</strong>
              <span>증거 규칙으로 보호</span>
            </div>
            <div className="bg-background p-2 sm:p-3">
              <strong className="block text-primary">이전 메시지</strong>
              <span>라운드 번호로 구분</span>
            </div>
          </div>
        </div>

        <div className="mt-3 border-l-2 border-primary/50 pl-3 sm:mt-4 sm:pl-4">
          <p className="text-[10px] font-black text-primary">{String(active + 1).padStart(2, "0")} · {SCENES[active]}</p>
          <p className="mt-1 min-h-20 break-keep text-xs leading-5 text-muted-foreground sm:min-h-12 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} playLabel="진행 과정 재생" className="mt-2 sm:mt-4" />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
