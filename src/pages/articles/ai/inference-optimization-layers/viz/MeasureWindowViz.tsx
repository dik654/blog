import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 같은 요청도 시계의 시작과 끝을 어디에 두느냐에 따라 다른 숫자가 된다.
 * 칸 폭은 순서만 나타내며 글이 정하지 않은 시간의 길이를 뜻하지 않는다.
 */
const STEPS = ["앞에서 기다림", "일을 제출", "안쪽 계산", "결과 전송"] as const;

const SCENES = [
  { label: "요청 전체", summary: "보낸 때 → 모두 받은 때", from: 0, to: 3, note: "요청을 보낸 때부터 결과를 모두 받은 때까지 잽니다. 네 칸이 모두 시계 안에 듭니다." },
  { label: "안쪽 계산만", summary: "계산 시작 → 계산 끝", from: 2, to: 2, note: "안쪽 계산만 잴 수도 있습니다. 나머지 칸은 숫자에 들어가지 않습니다." },
  { label: "기다림을 뺀 경우", summary: "제출 → 모두 받은 때", from: 1, to: 3, note: "앞에서 기다린 시간을 빼면 요청 전체를 잰 것과 다른 숫자가 나옵니다." },
  { label: "제출 시점에 멈춘 경우", summary: "보낸 때 → 제출한 때", from: 0, to: 1, note: "아직 끝나지 않은 일을 제출한 시점에 시계를 멈추면 계산과 전송이 빠집니다. 하나의 비교 안에서는 같은 시작과 끝을 지킵니다." },
] as const;

export default function MeasureWindowViz() {
  return (
    <SceneShell
      eyebrow="측정 경계"
      title="같은 요청도 시계를 어디서 켜고 끄느냐로 숫자가 달라집니다"
      description="칸은 일의 순서이고 폭은 시간의 길이가 아닙니다. 아래 막대가 시계가 세는 구간입니다."
      ariaLabel="요청의 네 단계와 측정 구간 네 가지"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-1.5">
              {STEPS.map((step, index) => {
                const inside = index >= scene.from && index <= scene.to;
                return (
                  <div
                    key={step}
                    className={`flex min-h-[3.5rem] items-center justify-center rounded-md border px-1 text-center text-xs leading-5 ${inside ? "border-[#2563eb] font-bold text-foreground" : "border-dashed border-border text-muted-foreground"}`}
                  >
                    {step}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1.5" role="img" aria-label={`시계 구간: ${scene.summary}`}>
              <div className="flex h-7 items-center justify-center rounded-sm bg-[#2563eb] font-mono text-xs font-bold text-white" style={{ gridColumn: `${scene.from + 1} / ${scene.to + 2}` }}>
                시계
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
