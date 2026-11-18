import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #release 두 번째 문단 — 당첨자가 없는 epoch에는 빈 tipset을 만들지 않는다.
 * 다음 block의 height는 둘 이상 증가할 수 있고, timestamp와 cron·state 전이는 건너뛴 epoch 수를 반영한다.
 * epoch 101·102·104에 tipset, 103은 null epoch인 배치는 설명용 가정이다.
 */
const SLOTS = [
  { epoch: 101, tipset: "T101" },
  { epoch: 102, tipset: "T102" },
  { epoch: 103, tipset: null },
  { epoch: 104, tipset: "T104" },
] as const;

export default function NullEpochGapViz() {
  return (
    <VizFrame
      eyebrow="null epoch · height와 tipset 개수"
      title="당첨자가 없는 epoch는 빈칸으로 남고, 다음 tipset의 height는 그 칸을 건너뜁니다"
      description="칸 하나가 epoch 하나입니다. epoch는 체인 시간의 한 칸이고, null epoch는 당첨된 block이 하나도 없는 칸입니다. 101~104의 tipset 배치와 103을 null epoch로 둔 것은 설명용입니다(가정)."
      note="빈 tipset을 만들지 않으므로 T102 다음 tipset은 T104입니다. 이 그림은 epoch 길이나 cron 작업 내용을 수치로 다루지 않습니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-4 gap-2">
          {SLOTS.map((slot) => (
            <div key={slot.epoch} className="min-w-0 text-center">
              <p className="font-mono text-[11px] font-bold text-muted-foreground">epoch {slot.epoch}</p>
              <div
                className={`mt-1 flex h-16 items-center justify-center rounded-lg border px-1 ${
                  slot.tipset ? "border-primary/60 bg-primary/5" : "border-dashed border-border bg-background"
                }`}
              >
                {slot.tipset ? (
                  <strong className="font-mono text-sm">{slot.tipset}</strong>
                ) : (
                  <span className="break-keep text-[11px] leading-4 text-muted-foreground">tipset 없음<br />(null)</span>
                )}
              </div>
              <p className="mt-1 font-mono text-[10px] leading-4 text-muted-foreground">
                {slot.tipset ? `height ${slot.epoch}` : "height 없음"}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-px bg-border p-px sm:grid-cols-2">
          <div className="bg-background p-4">
            <p className="text-[11px] font-bold text-destructive">잘못된 가정 · tipset 개수로 세기</p>
            <p className="mt-2 break-keep text-sm leading-6">
              T102 → T104는 tipset으로 <strong>한 칸</strong>입니다. 이것을 epoch 차이로 쓰면 103이 사라지고 parent time과 상태 실행을 잘못 재현합니다.
            </p>
          </div>
          <div className="bg-background p-4">
            <p className="text-[11px] font-bold text-primary">실제 규칙 · epoch 차이로 세기</p>
            <p className="mt-2 break-keep text-sm leading-6">
              height는 102에서 104로 <strong>2</strong> 증가합니다. timestamp와 VM의 cron·state 전이도 건너뛴 103을 반영합니다.
            </p>
          </div>
        </div>
      </div>
    </VizFrame>
  );
}
