import SceneShell from "./SceneShell";

/**
 * 본문 대응: #random-boundary — 관찰 실행(verification/observation.json)의 위치별 실제 반경 [1,2,1,2,1], 쌍 수 [1,3,2,3,1], 합 10.
 * 쌍 표기는 원문 방향 from→to, 곧 이웃→현재 단어입니다.
 */
const SENTENCE = ["red", "saw", "cat", "saw", "dog"] as const;
const SLOTS = [-1, 0, 1, 2, 3, 4, 5] as const;
const COUNTS = [1, 3, 2, 3, 1] as const;

const STEPS = [
  { t: 0, r: 1, pairs: "saw→red", note: "반경 1이면 왼쪽 칸은 문장 밖이라 버립니다. 양쪽을 본다고 언제나 두 쌍이 생기지는 않습니다." },
  { t: 1, r: 2, pairs: "red→saw · cat→saw · saw→saw", note: "반경 2로 네 칸을 보지만 왼쪽 끝 하나는 문장 밖입니다. 위치 3의 saw는 자신과 다른 위치라 saw→saw도 생깁니다." },
  { t: 2, r: 1, pairs: "saw→cat · saw→cat", note: "가운데 위치에서 from=3 to=2가 두 번 나옵니다. 같은 번호의 쌍이지만 위치가 달라 두 건입니다." },
  { t: 3, r: 2, pairs: "saw→saw · cat→saw · dog→saw", note: "다시 반경 2입니다. 오른쪽 끝 칸은 문장 밖이라 세 쌍입니다." },
  { t: 4, r: 1, pairs: "saw→dog", note: "반경 1의 오른쪽 칸이 문장 밖이라 한 쌍입니다." },
] as const;

const SCENES = [
  ...STEPS.map((step) => ({ label: `위치 ${step.t} · 반경 ${step.r}`, summary: `쌍 ${COUNTS[step.t]}개`, note: step.note })),
  { label: "다섯 위치의 합", summary: "1 + 3 + 2 + 3 + 1 = 10쌍", note: "이 실험에서는 정수의 홀짝이 번갈아 나와 반경도 번갈아 바뀌었습니다. 10절의 독립 균일 추출과 같다고 볼 수 없고 학습 기능을 켠 실행에 재사용할 수도 없습니다." },
];

export default function RadiusTraceViz() {
  return (
    <SceneShell
      eyebrow="관찰한 반경과 쌍"
      title="위치마다 반경이 바뀌고 문장 밖은 버려 10쌍이 됩니다"
      description="실제 반경은 위치마다 이번에 뽑은 값입니다. 진한 칸이 현재 위치, 파란 테두리가 고른 이웃, ×는 반경이 닿지만 문장 밖인 자리입니다."
      note="최대 반경 2, 단어 제거·학습 목적 끔, 한 스레드, 난수 상태 0에서 시작한 관찰 실행입니다. 쌍은 14절 원문 방향대로 이웃→현재 단어로 적었습니다."
      ariaLabel="다섯 위치에서 실제 반경으로 고른 이웃과 쌍의 수"
      scenes={SCENES}
      render={(active) => {
        const step = active < STEPS.length ? STEPS[active] : null;
        const done = step ? active + 1 : COUNTS.length;
        const total = COUNTS.slice(0, done).reduce<number>((sum, count) => sum + count, 0);
        return (
          <div className="min-w-0">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${SLOTS.length}, minmax(0, 1fr))` }}>
              {SLOTS.map((slot) => {
                const inside = slot >= 0 && slot < SENTENCE.length;
                const isCenter = step !== null && slot === step.t;
                const reached = step !== null && !isCenter && Math.abs(slot - step.t) <= step.r;
                const dropped = reached && !inside;
                return (
                  <div key={slot} className="min-w-0 text-center">
                    <p className="font-mono text-[10px] text-muted-foreground">{inside ? `위치 ${slot}` : "밖"}</p>
                    <div
                      className={`mt-0.5 flex h-10 items-center justify-center rounded-sm border text-xs font-semibold ${dropped ? "border-dashed" : ""}`}
                      style={{
                        borderColor: isCenter ? "#2563eb" : dropped ? "#dc2626" : reached ? "#2563eb" : inside ? "#94a3b8" : "transparent",
                        borderWidth: 1,
                        backgroundColor: isCenter ? "#2563eb" : reached && inside ? "#2563eb22" : "transparent",
                        color: isCenter ? "#ffffff" : dropped ? "#dc2626" : undefined,
                      }}
                    >
                      {inside ? (SENTENCE as readonly string[])[slot] : dropped ? "×" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 min-h-[1.5rem] text-center font-mono text-xs font-bold sm:text-sm">{step ? step.pairs : "from=3 to=2는 그중 두 건"}</p>
            <div className="mt-3 grid grid-cols-[3.25rem_repeat(5,minmax(0,1fr))_3rem] items-center gap-1 text-center font-mono text-xs">
              <span className="text-left text-muted-foreground">쌍 수</span>
              {COUNTS.map((count, index) => (
                <span key={index} className="rounded-sm border py-1" style={{ borderColor: "#94a3b8", fontWeight: step?.t === index ? 700 : 400 }}>{index < done ? count : "·"}</span>
              ))}
              <span className="font-bold">= {total}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
