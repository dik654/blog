import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stable-log-softmax — 세 로짓이 모두 100,000,000(가정)일 때 연산 순서 비교.
 * 큰 수 + ln3 → 반올림 100,000,000 → −100,000,000 → 0.
 * 100,000,000 − 100,000,000 = 0 → 0 + ln3 ≈ 1.0986123.
 */
const SCENES = [
  { label: "같은 입력", summary: "확률 각 1/3 · 답은 ln3", note: "세 로짓이 모두 100,000,000이면 확률은 각각 1/3이고 비용은 ln3이어야 합니다(가정)." },
  { label: "첫 연산", summary: "한쪽은 ln3이 사라짐", note: "먼저 더한 쪽은 큰 수에 ln3을 더한 값이 반올림되어 다시 100,000,000이 됩니다. 먼저 뺀 쪽은 같은 큰 수끼리 빼서 0을 얻습니다." },
  { label: "둘째 연산", summary: "0 대 약 1.0986123", note: "먼저 더한 쪽은 정답 로짓을 빼서 0, 먼저 뺀 쪽은 ln3을 더해 약 1.0986123 nat입니다. 실수 수학에서는 같은 식이지만 유한 정밀도에서는 결과가 달랐습니다." },
] as const;

const LANES = [
  {
    title: "큰 수에 ln3을 먼저 더함",
    steps: [
      { expr: "100,000,000 + ln3", out: "→ 100,000,000", bad: true },
      { expr: "100,000,000 − 100,000,000", out: "→ 0", bad: true },
    ],
  },
  {
    title: "같은 큰 수끼리 먼저 뺌",
    steps: [
      { expr: "100,000,000 − 100,000,000", out: "→ 0", bad: false },
      { expr: "0 + ln3", out: "→ 약 1.0986123", bad: false },
    ],
  },
] as const;

export default function StableOrderViz() {
  return (
    <SceneShell
      eyebrow="계산 순서"
      title="같은 식도 큰 수를 먼저 빼야 ln3이 남습니다"
      description="binary32는 32비트 실수 형식이고, 각 연산 뒤 이 형식으로 반올림합니다. 글의 Python 산술 예제이며 PyTorch의 실행 결과와 구별합니다."
      ariaLabel="큰 수에 작은 값을 먼저 더할 때와 큰 수끼리 먼저 뺄 때의 결과 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          {LANES.map((lane) => (
            <div key={lane.title} className="min-w-0 rounded-lg border border-border bg-background p-3">
              <p className="text-sm font-bold">{lane.title}</p>
              <ol className="mt-2 space-y-1.5">
                {lane.steps.map((step, index) => {
                  const shown = active >= index + 1;
                  return (
                    <li key={step.expr + index} className={`flex flex-wrap gap-x-2 font-mono text-xs leading-5 sm:text-sm ${shown ? "" : "text-muted-foreground/40"}`}>
                      <span>{step.expr}</span>
                      <span className={`font-bold ${shown ? (step.bad ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400") : "text-transparent"}`}>{step.out}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      )}
    />
  );
}
