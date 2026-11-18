import SceneShell from "./SceneShell";

/**
 * 본문 대응: "training과 generation의 입력 분포가 달라진다".
 * 정답 문장 [BOS, 나, 간다]. 첫 step에서 model이 '너'를 예측했다고 가정합니다.
 * training(teacher forcing)은 다음 입력에 정답 '나'를, generation은 방금 sample한 '너'를 넣습니다.
 */
type Slot = { text: string; tone: "plain" | "wrong" | "truth" | "empty" | "shifted" };

const LANES = [
  {
    name: "training · teacher forcing",
    steps: [
      [{ text: "BOS", tone: "plain" }, { text: "h₁", tone: "plain" }, { text: "예측 너 ✕", tone: "wrong" }],
      [{ text: "정답 나", tone: "truth" }, { text: "h₂", tone: "plain" }, { text: "다음 예측", tone: "plain" }],
      [{ text: "정답 간다", tone: "truth" }, { text: "h₃", tone: "plain" }, { text: "다음 예측", tone: "plain" }],
    ],
  },
  {
    name: "generation",
    steps: [
      [{ text: "BOS", tone: "plain" }, { text: "h₁", tone: "plain" }, { text: "sample 너", tone: "wrong" }],
      [{ text: "방금 낸 너", tone: "wrong" }, { text: "h₂′", tone: "shifted" }, { text: "다음 sample", tone: "shifted" }],
      [{ text: "model 출력", tone: "shifted" }, { text: "h₃′", tone: "shifted" }, { text: "다음 sample", tone: "shifted" }],
    ],
  },
] as const satisfies readonly { name: string; steps: readonly (readonly Slot[])[] }[];

const TONE: Record<Slot["tone"], string> = {
  plain: "border-border bg-background",
  wrong: "border-red-600 bg-background text-red-700 dark:text-red-400",
  truth: "border-blue-600 bg-background text-blue-700 dark:text-blue-400",
  shifted: "border-dashed border-amber-600 bg-background text-amber-700 dark:text-amber-400",
  empty: "border-dashed border-border/40 text-muted-foreground/40",
};

const SCENES = [
  {
    label: "첫 예측이 틀림",
    summary: "BOS → 너 (정답은 나)",
    note: "두 경우 모두 BOS를 읽고 정답 '나' 대신 '너'를 냈다고 가정합니다. 여기까지는 같습니다.",
  },
  {
    label: "다음 입력이 갈림",
    summary: "training: 나 · generation: 너",
    note: "training은 틀렸어도 정답 '나'를 넣고, generation은 방금 낸 '너'를 넣어 h₂′가 h₂와 달라집니다.",
  },
  {
    label: "이후 prefix",
    summary: "정답 prefix vs model 자신의 prefix",
    note: "training 입력은 끝까지 정답이고, generation은 실수 뒤로 자기 출력 위에서 이어 갑니다. 그래서 inference 품질은 따로 평가합니다.",
  },
] as const;

export default function TeacherForcingDriftViz() {
  return (
    <SceneShell
      eyebrow="exposure bias"
      title="한 번 틀린 뒤 training과 generation의 다음 입력이 달라집니다"
      description="열마다 위에서부터 입력, state, 출력입니다. 정답 문장 [BOS, 나, 간다, …]과 첫 예측 '너'는 가정입니다. 파랑은 정답 입력, 빨강은 틀린 token, 주황 점선은 그 실수 위에서 이어져 정답 경로에서 벗어난 state·입력·출력입니다."
      ariaLabel="teacher forcing을 쓰는 training과 자기 출력을 다시 넣는 generation의 입력 차이"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          {LANES.map((lane, laneIndex) => (
            <div key={lane.name} className="min-w-0">
              <p className="mb-1.5 text-xs font-bold">{lane.name}</p>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {lane.steps.map((column, step) => {
                  const visible = step <= active;
                  return (
                    <div key={step} className="min-w-0 space-y-0.5 sm:space-y-1">
                      {laneIndex === 0 ? <p className="text-[10px] leading-3 text-muted-foreground">t = {step + 1}</p> : null}
                      {column.map((slot, row) => (
                        <div
                          key={row}
                          className={`rounded-md border px-1 py-0.5 text-center text-[11px] leading-4 sm:py-1.5 break-keep sm:text-xs ${visible ? TONE[slot.tone] : TONE.empty}`}
                        >
                          {visible ? slot.text : "·"}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    />
  );
}
