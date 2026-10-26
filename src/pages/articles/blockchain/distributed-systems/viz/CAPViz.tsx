import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["네트워크 분할", "A에 쓰기", "B에서 읽기", "B가 즉시 응답", "B가 확인 대기"] as const;
const NOTES = [
  "A와 B는 실행 중이지만 두 노드 사이 메시지가 전달되지 않습니다. Partition tolerance는 이 실행을 모델에서 제외하지 않는다는 뜻입니다.",
  "클라이언트 1이 A에 x=1을 쓰고 성공 응답을 받습니다. 따라서 그 이후 시작한 읽기는 linearizability를 지키려면 1 또는 더 최신 값을 봐야 합니다.",
  "클라이언트 2가 B에 x를 묻습니다. B의 로컬 값은 0이고 A의 완료된 쓰기를 알아낼 통신 경로가 없습니다.",
  "B가 0을 답하면 요청에는 응답했지만 완료된 쓰기 뒤에 예전 값을 반환하므로 linearizability를 잃습니다.",
  "대안으로 B가 A를 확인할 때까지 기다리거나 오류를 반환하면 최신 값과 충돌하지 않지만, 모든 요청에 non-error 응답을 준다는 CAP의 availability는 잃습니다.",
] as const;

export default function CAPViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3900, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="CAP · 두 복제본"
      title="분할 중 B는 완료된 쓰기를 모르므로 두 약속을 동시에 지킬 수 없습니다"
      description="x=0에서 시작해 A의 쓰기와 B의 읽기를 실제 시간 순서로 놓습니다. 마지막 두 장면은 B가 택할 수 있는 서로 다른 두 갈래입니다."
      note="Availability는 응답 시간이 빠르다는 뜻이 아니라 non-failing node의 모든 요청이 결국 non-error 응답을 받는다는 논문의 정의입니다."
      canvasClassName="p-3 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="CAP partition 실행" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div className="grid grid-cols-[1fr_4.25rem_1fr] items-stretch gap-2 sm:grid-cols-[1fr_7rem_1fr] sm:gap-3">
          <div className={`min-w-0 border p-2 sm:p-4 ${active === 1 ? "border-primary bg-primary/[0.06]" : "border-border bg-background"}`}>
            <p className="text-[9px] font-black text-primary sm:text-[10px]">복제본 A</p>
            <p className="mt-1 text-lg font-black sm:mt-2 sm:text-2xl">x = {active >= 1 ? "1" : "0"}</p>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-2 sm:text-xs sm:leading-5">{active >= 1 ? "쓰기 성공" : "초기 상태"}</p>
          </div>

          <div className="flex min-h-16 items-center justify-center border-x border-border text-center sm:min-h-20">
            <div>
              <p className="text-lg font-black text-primary">×</p>
              <p className="break-keep text-[9px] font-bold leading-4 text-muted-foreground sm:text-[10px]">메시지 단절</p>
            </div>
          </div>

          <div className={`min-w-0 border p-2 sm:p-4 ${active >= 2 ? "border-primary bg-primary/[0.06]" : "border-border bg-background"}`}>
            <p className="text-[9px] font-black text-primary sm:text-[10px]">복제본 B</p>
            <p className="mt-1 text-lg font-black sm:mt-2 sm:text-2xl">x = 0</p>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-2 sm:text-xs sm:leading-5">
              {active < 2 ? "초기 상태" : active === 3 ? "read → 0 응답" : active >= 4 ? "read → 대기·오류" : "read 요청 도착"}
            </p>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-px bg-border p-px sm:mt-3" aria-label="두 응답 정책의 결과">
          <div className={`bg-background p-2 text-[10px] leading-4 sm:p-3 sm:text-xs sm:leading-5 ${active === 3 ? "text-foreground" : "text-muted-foreground"}`}>
            <strong className="block text-primary">0을 즉시 응답</strong>
            응답 약속 유지 · linearizability 위반
          </div>
          <div className={`bg-background p-2 text-[10px] leading-4 sm:p-3 sm:text-xs sm:leading-5 ${active === 4 ? "text-foreground" : "text-muted-foreground"}`}>
            <strong className="block text-primary">확인할 때까지 대기</strong>
            linearizability 보호 · availability 위반
          </div>
        </div>

        <div className="mt-3 border-l-2 border-primary/50 pl-3 sm:mt-4 sm:pl-4">
          <p className="text-[10px] font-black text-primary">{String(active + 1).padStart(2, "0")} · {SCENES[active]}</p>
          <p className="mt-1 min-h-20 break-keep text-xs leading-5 text-muted-foreground sm:min-h-12 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} playLabel="반례 재생" className="mt-2 sm:mt-4" />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
