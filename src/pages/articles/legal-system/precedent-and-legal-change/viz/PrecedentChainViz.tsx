import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "먼저 앞 사건의 답을 봅니다",
  "답에 꼭 필요했던 이유를 찾습니다",
  "새 사건에서 중요한 차이를 찾습니다",
  "따르기·구별하기·뒤집기를 가릅니다",
] as const;

const NOTES = [
  "앞 사건에서 전동 킥보드는 공원의 차량 출입 금지 조항에 걸렸습니다. 하지만 '킥보드는 차량이다'라는 결론만 복사하면 다음 사건을 풀 수 없습니다.",
  "판단에 꼭 필요했던 이유는 동력으로 움직이고, 개인 이동에 쓰이며, 보행자와 충돌할 위험을 만든다는 점입니다. 결론에 필요하지 않았던 넓은 말은 다음 사건의 출발점이 되더라도 같은 힘을 갖지 않습니다.",
  "새 사건은 환자를 태운 구급차입니다. 동력과 충돌 위험은 같지만, 응급 구조라는 사실은 금지 목적과 직접 맞닿습니다. 이 차이가 앞 이유의 사정거리를 바꿉니다.",
  "중요한 차이가 없으면 앞 이유를 따르고, 이유가 닿지 않는 차이가 있으면 구별합니다. 앞 이유 자체를 더는 유지하지 않겠다면 그때 비로소 판례 변경을 논합니다.",
] as const;

const outcome = [
  { label: "앞 사건", value: "전동 킥보드 출입 금지", tone: "border-primary/40 bg-primary/[0.06]" },
  { label: "필요한 이유", value: "개인 이동 · 동력 · 보행자 위험", tone: "border-amber-500/45 bg-amber-500/[0.07]" },
  { label: "새 사건", value: "환자를 태운 구급차", tone: "border-emerald-500/45 bg-emerald-500/[0.07]" },
] as const;

export default function PrecedentChainViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const step = scenes.active;

  return (
    <VizFrame
      documentFlow
      eyebrow="한 사건을 다음 사건에 쓰는 법"
      title="판례는 지난 답을 복사하지 않고, 필요한 이유의 사정거리를 확인합니다"
      description="전동 킥보드 사건 뒤에 구급차 사건이 왔다고 놓고 네 장면을 따라갑니다."
      note="두 사건은 설명을 위한 가상 사례입니다. 실제 판정은 적용 법령, 법원의 위계, 판례 법리와 구체적 사실에 따라 달라집니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="앞 사건의 이유를 새 사건에 적용하는 네 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="min-h-[48rem] py-1 sm:min-h-[32rem]">
          <p className="text-[11px] font-black text-primary">장면 {step + 1} / {SCENES.length}</p>
          <h4 className="mt-2 text-base font-bold text-foreground">{SCENES[step]}</h4>

          <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-3">
            {outcome.map((item, index) => (
              <div
                key={item.label}
                className={`min-w-0 rounded-xl border p-4 transition-opacity ${item.tone} ${index <= Math.min(step, 2) ? "opacity-100" : "opacity-35"}`}
              >
                <p className="text-xs font-bold text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-sm font-black leading-6 text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          {step < 3 ? (
            <div className="mt-4 rounded-xl border border-border bg-background/70 p-4">
              <p className="text-xs font-bold text-muted-foreground">지금 묻는 질문</p>
              <p className="mt-2 text-sm font-bold leading-6 text-foreground">
                {step === 0 && "앞 사건은 무엇을 결정했을까요?"}
                {step === 1 && "그 결론에 없으면 안 되었던 이유는 무엇일까요?"}
                {step === 2 && "구급차라는 차이가 그 이유와 직접 관련될까요?"}
              </p>
            </div>
          ) : (
            <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-3">
              {[
                ["따르기", "중요한 사실과 법적 질문이 같음"],
                ["구별하기", "이유의 사정거리를 바꾸는 차이가 있음"],
                ["뒤집기", "앞 이유 자체를 더는 유지하지 않음"],
              ].map(([label, detail], index) => (
                <div key={label} className={`rounded-xl border p-4 ${index === 1 ? "border-primary/50 bg-primary/[0.07]" : "border-border bg-muted/25"}`}>
                  <p className="text-sm font-black text-foreground">{label}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          )}

          <p className="mt-4 border-l-2 border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
