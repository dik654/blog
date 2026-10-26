import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["제안자 선택", "A에는 X", "B에는 Y", "모순 증거"] as const;
const NOTES = [
  "제안자 P가 같은 높이와 라운드에서 값을 보내려 합니다. Crash 모델이라면 P는 규칙을 따르다 멈출 수 있지만 서로 다른 값을 의도적으로 보내지는 않습니다.",
  "비잔틴 P는 A에게 X를 서명해 보냅니다. A는 서명을 확인해 P가 보냈고 내용이 변조되지 않았다는 사실만 압니다.",
  "같은 P가 B에게는 Y를 서명해 보냅니다. 두 서명은 모두 유효하므로 서명 검사만으로 어느 값이 정직한 제안인지 판정할 수 없습니다.",
  "A와 B가 메시지를 교환하면 P의 모순 행동은 증명할 수 있습니다. 그러나 충돌 결정 방지는 충분한 표의 교집합과 잠금·단계 규칙까지 있어야 합니다.",
] as const;

export default function ByzantineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3700, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="비잔틴 장애 · equivocation"
      title="서명된 메시지도 서로 모순될 수 있습니다"
      description="서명은 누가 무엇을 보냈는지 남깁니다. 발신자가 수신자마다 다른 값을 보내는 행동 자체를 막지는 못합니다."
      note="이 그림은 장애 능력의 차이만 설명합니다. 정확한 인원수와 quorum 조건은 비잔틴 합의 글에서 시간·인증 모델과 함께 계산합니다."
      canvasClassName="p-3 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="비잔틴 제안자의 모순 메시지" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="grid grid-cols-[1fr_1.1fr_1fr] items-center gap-1.5 sm:grid-cols-[1fr_1.2fr_1fr] sm:gap-3">
          <div className={`min-w-0 border p-2 sm:p-4 ${active >= 1 ? "border-primary bg-primary/[0.06]" : "border-border bg-background"}`}>
            <p className="text-[9px] font-black text-primary sm:text-[10px]">복제본 A</p>
            <p className="mt-1 break-keep text-[10px] font-bold sm:mt-2 sm:text-sm">{active >= 1 ? "P 서명 · X" : "미수신"}</p>
            <p className="mt-1 text-[9px] text-muted-foreground sm:text-[11px]">서명 유효</p>
          </div>

          <div className={`min-w-0 border p-2 text-center sm:p-4 ${active === 0 || active >= 3 ? "border-primary bg-primary/[0.06]" : "border-border bg-background"}`}>
            <p className="text-[9px] font-black text-primary sm:text-[10px]">제안자 P</p>
            <p className="mt-1 text-base font-black sm:mt-2 sm:text-lg">{active >= 2 ? "X ≠ Y" : "한 라운드"}</p>
            <p className="mt-1 break-keep text-[9px] leading-4 text-muted-foreground sm:text-[11px] sm:leading-5">{active >= 3 ? "모순 서명이 증거" : "수신자별 전송"}</p>
          </div>

          <div className={`min-w-0 border p-2 sm:p-4 ${active >= 2 ? "border-primary bg-primary/[0.06]" : "border-border bg-background"}`}>
            <p className="text-[9px] font-black text-primary sm:text-[10px]">복제본 B</p>
            <p className="mt-1 break-keep text-[10px] font-bold sm:mt-2 sm:text-sm">{active >= 2 ? "P 서명 · Y" : "미수신"}</p>
            <p className="mt-1 text-[9px] text-muted-foreground sm:text-[11px]">서명 유효</p>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-px bg-border p-px text-[10px] leading-4 sm:mt-3 sm:text-xs sm:leading-5">
          <div className="bg-background p-2 sm:p-3"><strong className="block text-primary sm:inline">서명이 답하는 것</strong><span className="sm:ml-2">발신자·변조 여부</span></div>
          <div className="bg-background p-2 sm:p-3"><strong className="block text-primary sm:inline">답하지 못하는 것</strong><span className="sm:ml-2">정직성·유일한 값</span></div>
        </div>

        <div className="mt-3 border-l-2 border-primary/50 pl-3 sm:mt-4 sm:pl-4">
          <p className="text-[10px] font-black text-primary">{String(active + 1).padStart(2, "0")} · {SCENES[active]}</p>
          <p className="mt-1 min-h-20 break-keep text-xs leading-5 text-muted-foreground sm:min-h-12 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} playLabel="모순 전송 재생" className="mt-2 sm:mt-4" />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
