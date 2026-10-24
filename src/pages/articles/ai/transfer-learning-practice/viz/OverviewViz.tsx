import { StoryShell } from "../../kimi-k3-shared";
import { useStory } from "../../useKimiStory";

const labels = ["기준선", "부분 해제", "전체 해제", "회귀 판정"] as const;

const notes = [
  "같은 pretrained checkpoint에서 backbone은 고정하고 새 head만 학습합니다. 이 결과가 data·label·metric의 가장 싼 기준선입니다.",
  "Upper block과 head만 optimizer에 넣습니다. target validation 이득이 head-only 기준선을 넘는지 같은 seed와 budget에서 비교합니다.",
  "전체 parameter를 열되 lower block의 relative update와 memory를 함께 기록합니다. 자유도가 커진 만큼 비용과 손상 가능성도 커집니다.",
  "Target metric이 좋아져도 source regression이 guardrail 아래로 떨어지면 채택하지 않습니다. 통과한 후보 중 가장 작은 trainable scope를 남깁니다.",
] as const;

const candidates = [
  ["Fixed", "head", "가장 작은 기준선"],
  ["Partial", "upper + head", "target 가까운 표현"],
  ["Full", "all parameters", "최대 자유도"],
  ["Accept", "target + source", "이득과 손상 함께 판정"],
] as const;

export default function OverviewViz() {
  const story = useStory(labels.length, 6200);

  return (
    <StoryShell
      title="같은 pretrained state에서 바꾸는 범위만 넓혀 가장 작은 유효 후보를 찾습니다"
      subtitle="Fixed→partial→full 세 후보를 같은 split·seed·budget에 놓고 마지막에 source 회귀까지 검사합니다."
      labels={labels}
      sceneId="transfer-scope-selection-trace"
      staticNotes={notes}
      {...story}
    >
      <div className="grid min-w-0 gap-px bg-border p-px sm:grid-cols-4">
        {candidates.map(([title, scope, evidence], index) => (
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
            <p className="mt-2 break-keep font-mono text-[11px] leading-5">
              {scope}
            </p>
            <p className="mt-3 border-t border-border pt-2 break-keep text-[10px] leading-4 text-muted-foreground">
              {evidence}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 border-y border-border py-4 text-xs sm:grid-cols-[7rem_minmax(0,1fr)] sm:text-sm">
        <strong>고정 조건</strong>
        <span className="break-keep text-muted-foreground">
          checkpoint · preprocessing · split · metric · search budget
        </span>
        <strong>현재 판정</strong>
        <span className="break-keep text-muted-foreground">
          {story.step === 0 && "head-only가 target task의 첫 비교점입니다."}
          {story.step === 1 && "추가 block의 이득이 비용보다 큰지 봅니다."}
          {story.step === 2 &&
            "전체 자유도의 gain·variance·memory를 함께 봅니다."}
          {story.step === 3 &&
            "target 이득과 source guardrail을 모두 통과해야 합니다."}
        </span>
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
