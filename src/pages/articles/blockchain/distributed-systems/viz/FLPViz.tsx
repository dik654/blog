import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["두 값이 가능", "결정 직전", "다른 사건 먼저", "미결정 연장"] as const;
const NOTES = [
  "현재 구성 C0에서는 남은 메시지의 전달 순서에 따라 0도 1도 결정될 수 있습니다. 이런 구성을 bivalent라고 부릅니다.",
  "메시지 e를 지금 전달하면 이후 결과가 1로만 좁혀진다고 가정합니다. e가 결정값을 고정하는 critical event입니다.",
  "완전 비동기 모델에는 전달 시한이 없으므로 스케줄러는 e와 독립적인 다른 사건 d를 먼저 실행할 수 있습니다.",
  "d 뒤에도 0과 1이 가능한 다음 구성 C1을 만들 수 있습니다. 이 선택을 반복해 모든 규칙을 지키면서도 결정을 끝없이 미루는 실행 하나가 존재합니다.",
] as const;

export default function FLPViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="FLP · 한 실행"
      title="결정값을 고정할 메시지를 늦추면 미결정 상태가 이어집니다"
      description="FLP는 모든 실행이 멈춘다고 말하지 않습니다. 완전 비동기·결정적 합의에서 종료하지 않는 허용된 실행 하나를 만들 수 있다는 결과입니다."
      note="그림의 e와 d는 특정 프로토콜의 패킷 이름이 아니라 증명에서 비교하는 두 사건입니다."
      canvasClassName="p-3 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="FLP의 bivalent 실행" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="grid gap-2 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:gap-3">
          <div className="border border-border bg-background p-2 sm:p-4" aria-label="구성과 사건 순서">
            <div className="flex min-h-20 items-center gap-1.5 overflow-hidden sm:min-h-24 sm:gap-4">
              <div className={`min-w-14 border p-2 text-center sm:min-w-20 sm:p-3 ${active === 0 ? "border-primary bg-primary/10" : "border-border"}`}>
                <strong className="block text-sm">C0</strong>
                <span className="text-[10px] text-muted-foreground">0 또는 1</span>
              </div>
              <span className="shrink-0 text-muted-foreground">→</span>
              <div className={`min-w-0 flex-1 border p-2 sm:p-3 ${active === 1 ? "border-primary bg-primary/10" : "border-border"}`}>
                <strong className="block break-keep text-[10px] sm:text-xs">e · 결정 직전</strong>
                <span className="mt-1 block text-[9px] leading-4 text-muted-foreground sm:text-[10px]">전달하면 1로 좁혀짐</span>
              </div>
              <span className="shrink-0 text-muted-foreground">→</span>
              <div className={`min-w-14 border p-2 text-center sm:min-w-20 sm:p-3 ${active === 3 ? "border-primary bg-primary/10" : "border-border"}`}>
                <strong className="block text-sm">C1</strong>
                <span className="text-[10px] text-muted-foreground">0 또는 1</span>
              </div>
            </div>
            <div className={`mt-2 border-l-2 pl-2 text-[10px] leading-4 sm:mt-3 sm:pl-3 sm:text-xs sm:leading-5 ${active >= 2 ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}>
              <strong className="block">d · 독립적인 다른 사건</strong>
              {active >= 2 ? "e보다 먼저 실행되어 다음 미결정 구성을 만듭니다." : "아직 실행하지 않았습니다."}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px bg-border p-px text-[10px] leading-4 sm:text-xs sm:leading-5 md:grid-cols-1" aria-label="FLP가 고정한 전제">
            {[
              ["시간", "전달 상한 없음"],
              ["고장", "최대 한 process 중단"],
              ["방식", "결정적 합의"],
            ].map(([label, value], index) => (
              <div key={label} className={`min-w-0 bg-background p-2 sm:p-3 ${active >= index ? "text-foreground" : "text-muted-foreground"}`}>
                <strong className="block text-primary">{label}</strong>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 border-l-2 border-primary/50 pl-3 sm:mt-4 sm:pl-4">
          <p className="text-[10px] font-black text-primary">{String(active + 1).padStart(2, "0")} · {SCENES[active]}</p>
          <p className="mt-1 min-h-20 break-keep text-xs leading-5 text-muted-foreground sm:min-h-12 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} playLabel="증명 흐름 재생" className="mt-2 sm:mt-4" />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
