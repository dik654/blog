import SceneShell from "./SceneShell";

/**
 * 본문 대응: #transcript (와 #opening-security) — 고정한 gnark 원문의 질문 순서.
 * 순열·selector 약정 + 공개 입력 → wire 약정 3개 → γ → β → Z 약정 → α → 몫 조각 약정 3개 → ζ.
 */
type Step = { put: string; get: string; scene: number };
const STEPS: readonly Step[] = [
  { put: "순열·selector 약정, 공개 입력", get: "", scene: 0 },
  { put: "wire 약정 3개 (a·b·c)", get: "γ", scene: 1 },
  { put: "(γ까지의 기록에 이어서)", get: "β", scene: 2 },
  { put: "누적 곱 Z 약정", get: "α", scene: 3 },
  { put: "몫 조각 약정 3개", get: "ζ", scene: 4 },
];

const SCENES = [
  { label: "첫 입력", summary: "준비물과 공개 입력부터 기록", note: "첫 질문의 입력에는 순열과 selector의 약정, 공개 입력이 들어갑니다." },
  { label: "wire 약정 → γ", summary: "표를 고정한 뒤 γ", note: "세 wire 약정을 기록에 넣은 뒤에야 γ가 나옵니다. 9절에서 본 대로 β·γ는 값의 약정을 고정한 뒤 정합니다." },
  { label: "이어서 β", summary: "앞선 기록에 이어 β", note: "β는 앞선 기록에 이어 얻습니다. 이 버전은 γ를 먼저 만들며, 다른 구현도 같은 순서라고 가정하지 않습니다." },
  { label: "Z 약정 → α", summary: "누적 곱을 고정한 뒤 α", note: "β·γ로 계산한 누적 곱 Z의 약정을 넣은 뒤, 오차들을 하나로 묶는 계수 α를 얻습니다." },
  { label: "몫 약정 → ζ", summary: "T까지 고정한 뒤 ζ", note: "몫 약정 뒤에야 검사점 ζ가 나옵니다. ζ를 먼저 알면 잘못된 N에도 그 점의 값만 맞출 수 있습니다." },
] as const;

export default function TranscriptOrderViz() {
  return (
    <SceneShell
      eyebrow="질문이 나오는 순서"
      title="약정을 기록에 넣을 때마다 다음 질문이 나옵니다"
      description="왼쪽은 계산자가 기록(transcript)에 넣는 것, 오른쪽은 그때까지의 기록을 해시해 얻는 질문입니다. 대화형 확인자의 무작위 질문을 이렇게 해시로 바꾸는 방법을 Fiat–Shamir라고 합니다."
      ariaLabel="순열 약정과 공개 입력, wire 약정, Z 약정, 몫 약정 뒤에 γ, β, α, ζ가 차례로 나오는 순서"
      scenes={SCENES}
      render={(active) => (
        <ol className="min-w-0">
          {STEPS.map((step, i) => {
            const done = step.scene < active;
            const now = step.scene === active;
            return (
              <li
                key={i}
                className={`grid grid-cols-[1.5rem_minmax(0,1fr)_3rem] items-center gap-2 border-b border-border/60 py-2 transition-opacity duration-300 ${now || done ? "opacity-100" : "opacity-25"}`}
              >
                <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
                <span className={`text-xs leading-5 sm:text-sm ${now ? "font-semibold" : ""} ${i === 2 ? "text-muted-foreground" : ""}`}>{step.put}</span>
                <span
                  className={`flex h-8 items-center justify-center rounded-md border font-mono text-sm font-bold ${
                    step.get === "" ? "border-transparent" : now ? "border-[#2563eb] bg-[#dbeafe] text-[#1d4ed8]" : "border-border"
                  }`}
                >
                  {step.get ? `→ ${step.get}` : ""}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    />
  );
}
