import { StoryShell } from "../../kimi-k3-shared";
import { useStory } from "../../useKimiStory";

const labels = ["질문 고정", "기록 선택", "특성 계산", "과거 재생"] as const;

const notes = [
  "매장 A·cutoff 8월 1일 00:00·horizon 7일을 하나의 예측 질문으로 고정합니다.",
  "같은 매장의 기록 중 available time이 cutoff 이하인 세 건만 남깁니다. 7월 27일 기록은 8월 5일에 도착하므로 제외합니다.",
  "선택된 세 건으로 lag-1=15, 7일 window count=3, mean=10을 계산합니다. 모든 값은 같은 cutoff에서 재현돼야 합니다.",
  "이 계약을 과거 origin마다 다시 실행하고 다음 7일의 실제 매출과 비교합니다. 마지막 test 기간은 선택이 끝날 때까지 열지 않습니다.",
] as const;

const stages = [
  ["질문", "매장 A · 08-01 00:00 · 다음 7일"],
  ["과거 원장", "cutoff까지 도착한 기록 3건"],
  ["입력 행", "lag 15 · count 3 · mean 10"],
  ["평가", "rolling-origin · 미래 7일"],
] as const;

export default function OverviewViz() {
  const story = useStory(labels.length, 6200);

  return (
    <StoryShell
      title="한 예측 질문이 과거 원장에서 재현 가능한 입력 행이 되는 과정을 추적합니다"
      subtitle="매장 A의 8월 1일 예측 한 건만 끝까지 따라가며 네 시간 경계를 구분합니다."
      labels={labels}
      sceneId="time-feature-row-contract"
      staticNotes={notes}
      {...story}
    >
      <div className="grid min-w-0 gap-px bg-border p-px sm:grid-cols-4">
        {stages.map(([title, detail], index) => (
          <div
            key={title}
            className={`min-w-0 bg-background p-4 transition-colors ${
              story.step === index ? "bg-primary/10" : ""
            }`}
          >
            <p className="font-mono text-[10px] font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 text-sm font-black">{title}</p>
            <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
              {detail}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-y border-border py-4">
        <div className="grid gap-3 text-xs sm:grid-cols-[8rem_minmax(0,1fr)] sm:text-sm">
          <strong>현재 장면</strong>
          <span>{labels[story.step]}</span>
          <strong>판정 기준</strong>
          <span className="break-keep text-muted-foreground">
            {story.step === 0 &&
              "entity·cutoff·horizon이 달라지면 다른 예측 행입니다."}
            {story.step === 1 &&
              "event time이 과거여도 available time이 늦으면 입력에서 제외합니다."}
            {story.step === 2 &&
              "lag와 window의 양끝·결측·중복 규칙을 학습과 서빙에서 같이 씁니다."}
            {story.step === 3 &&
              "각 fold는 과거로 학습하고 origin 뒤의 horizon만 평가합니다."}
          </span>
        </div>
      </div>

      <p
        data-scene-note
        className="mt-5 break-keep text-sm leading-7 text-muted-foreground"
      >
        {notes[story.step]}
      </p>
    </StoryShell>
  );
}
