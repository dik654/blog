import { StoryShell } from "../../kimi-k3-shared";
import { useStory } from "../../useKimiStory";

const labels = [
  "입력 확인",
  "gradient 누적",
  "상태 갱신",
  "복원 비교",
] as const;

const notes = [
  "Snapshot train-v7에서 sampler가 고른 sample 41·08를 transform과 collate에 통과시켜 micro-batch 1을 만듭니다.",
  "Micro-batch 두 개의 loss를 2로 나눠 backward합니다. 이 구간에는 gradient만 쌓이고 optimizer update 번호는 아직 120입니다.",
  "두 번째 backward 뒤 optimizer와 scheduler가 한 번 움직입니다. model, optimizer moment, update clock이 함께 121로 바뀝니다.",
  "Update 121에서 저장한 RNG와 sampler cursor를 새 process가 읽습니다. 다음 sample 55와 learning rate가 연속 실행과 같아야 복원에 성공합니다.",
] as const;

const stages = [
  ["micro 1", "IDs 41·08", "update 120"],
  ["micro 2", "IDs 17·63", "gradient 누적"],
  ["optimizer", "parameter·moment", "update 121"],
  ["새 process", "next ID 55", "trajectory 비교"],
] as const;

export default function OverviewViz() {
  const story = useStory(labels.length, 6200);

  return (
    <StoryShell
      title="sample 네 개가 update 하나가 되고, 저장 뒤 같은 다음 sample로 이어지는지 추적합니다"
      subtitle="train-v7의 update 120→121 한 건을 따라가며 batch iteration과 optimizer update를 구분합니다."
      labels={labels}
      sceneId="training-run-state-trace"
      staticNotes={notes}
      {...story}
    >
      <div className="grid min-w-0 gap-px bg-border p-px sm:grid-cols-4">
        {stages.map(([title, detail, clock], index) => (
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
            <p className="mt-3 border-t border-border pt-2 font-mono text-[10px]">
              {clock}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-px bg-border p-px sm:grid-cols-3">
        {[
          ["Data", "snapshot · sample IDs · sampler cursor"],
          ["State", "model · optimizer · scheduler · RNG"],
          ["Evidence", "loss 합 · sample 수 · config · checksum"],
        ].map(([title, detail]) => (
          <div key={title} className="min-w-0 bg-background p-3">
            <strong className="text-xs">{title}</strong>
            <p className="mt-1 break-keep text-[11px] leading-5 text-muted-foreground">
              {detail}
            </p>
          </div>
        ))}
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
