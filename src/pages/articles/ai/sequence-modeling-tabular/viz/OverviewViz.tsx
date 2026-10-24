import { StoryShell } from "../../kimi-k3-shared";
import { useStory } from "../../useKimiStory";

const labels = [
  "cutoff 고정",
  "도착 여부 확인",
  "순서 만들기",
  "미래 label 분리",
] as const;

const notes = [
  "user_42의 09:00 예측을 고정합니다. 이 시각 뒤의 사건은 입력이 아니라 label 구간에 속합니다.",
  "08:40 payment는 발생 시각이 cutoff 전이지만 09:07에 도착했으므로 입력에서 제외합니다.",
  "남은 view와 cart를 event time과 tie-break key로 정렬해 Sᵢ,𝚌 = view → cart를 만듭니다.",
  "09:18 purchase는 다음 24시간 horizon 안의 정답입니다. 입력 token으로 다시 들어가면 누출입니다.",
] as const;

const events = [
  { time: "08:10", event: "view", available: "08:10", role: "입력" },
  { time: "08:26", event: "cart", available: "08:26", role: "입력" },
  { time: "08:40", event: "payment", available: "09:07", role: "제외" },
  { time: "09:18", event: "purchase", available: "09:18", role: "정답" },
] as const;

export default function OverviewViz() {
  const story = useStory(labels.length, 6200);

  return (
    <StoryShell
      title="09:00 예측 한 건에서 입력 사건과 미래 정답을 분리합니다"
      subtitle="발생 시각·도착 시각·cutoff·horizon을 한 원장에서 차례로 판정합니다."
      labels={labels}
      sceneId="event-sequence-cutoff-trace"
      staticNotes={notes}
      {...story}
    >
      <div className="hidden grid-cols-[5rem_1fr_7rem_5rem] border-y border-border text-sm sm:grid">
        <div className="px-3 py-2 font-medium text-muted-foreground">발생</div>
        <div className="px-3 py-2 font-medium text-muted-foreground">사건</div>
        <div className="px-3 py-2 font-medium text-muted-foreground">도착</div>
        <div className="px-3 py-2 font-medium text-muted-foreground">판정</div>
      </div>
      <div className="divide-y divide-border border-b border-border">
        {events.map((item, index) => {
          const active =
            story.step === 0 ||
            (story.step === 1 && index === 2) ||
            (story.step === 2 && index < 2) ||
            (story.step === 3 && index === 3);
          return (
            <div
              key={`${item.time}-${item.event}`}
              className={`grid gap-1 py-3 text-sm transition-colors sm:grid-cols-[5rem_1fr_7rem_5rem] sm:gap-0 sm:py-0 ${
                active ? "bg-primary/10" : ""
              }`}
            >
              <div className="font-mono sm:px-3 sm:py-3">{item.time}</div>
              <div className="font-medium sm:px-3 sm:py-3">{item.event}</div>
              <div className="text-muted-foreground sm:px-3 sm:py-3">
                <span className="sm:hidden">도착 · </span>
                {item.available}
              </div>
              <div className="font-semibold sm:px-3 sm:py-3">{item.role}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <p className={story.step >= 2 ? "font-black" : "text-muted-foreground"}>
          Sᵢ,𝚌 = view → cart
        </p>
        <span className="hidden text-muted-foreground sm:block">
          cutoff 09:00
        </span>
        <p className={story.step >= 3 ? "font-black" : "text-muted-foreground"}>
          label = 다음 24시간 purchase 여부
        </p>
      </div>

      <p
        data-scene-note
        className="mt-5 break-keep border-t border-border pt-4 text-sm leading-7 text-muted-foreground"
      >
        {notes[story.step]}
      </p>
    </StoryShell>
  );
}
