import PosttrainingSceneShell from "./PosttrainingSceneShell";

/**
 * 본문 대응: #rl-approach 2단계 — 정확도만, 언어만 채점할 때의 빈틈과 가중합 R=Σ w_k r_k.
 * 가중치는 논문 snapshot(w_acc=1.0, 나머지 0.2). 후보 A·B·C와 0/1 채점은 설명용 가정.
 * A: 1.0+0.2+0.2 = 1.4 · B(오답): 0+0.2+0.2 = 0.4 · C(영어 전환): 1.0+0.2+0 = 1.2
 * overlong은 threshold 전에는 더하는 값이 없고, 넘으면 음수(크기는 글에 없음).
 */
type Part = "acc" | "fmt" | "lang";

const PARTS: readonly { key: Part; name: string; color: string }[] = [
  { key: "acc", name: "정확도", color: "#2563eb" },
  { key: "fmt", name: "형식", color: "#64748b" },
  { key: "lang", name: "언어", color: "#16a34a" },
];

const CANDIDATES = [
  { id: "A", desc: "3,200원 · 한국어 trace · 형식 지킴", raw: { acc: 1, fmt: 1, lang: 1 } },
  { id: "B", desc: "오답 · 한국어 trace · 형식 지킴", raw: { acc: 0, fmt: 1, lang: 1 } },
  { id: "C", desc: "3,200원 · trace 중간 영어 전환 · 형식 지킴", raw: { acc: 1, fmt: 1, lang: 0 } },
] as const;

/** 장면별로 각 항에 곱하는 비중. 0이면 그 항을 보지 않는다는 뜻입니다. */
const MODES: readonly Record<Part, number>[] = [
  { acc: 0, fmt: 0, lang: 1 },
  { acc: 1, fmt: 0, lang: 0 },
  { acc: 1, fmt: 0.2, lang: 0.2 },
  { acc: 1, fmt: 0.2, lang: 0.2 },
];

const SCALE = 1.6;

const SCENES = [
  { label: "언어만 채점하면", summary: "B 1 > C 0", note: "언어 일관성만 보상하면 한국어로 쓴 오답 B가 1점, 정답이지만 trace 중간에 영어로 넘어간 C가 0점입니다. 오답이 정답보다 높은 점수를 받습니다." },
  { label: "정답만 채점하면", summary: "A 1 = C 1", note: "정답 여부만 보상하면 A와 C가 같은 1점입니다. trace의 언어와 형식 차이가 reward에 나타나지 않으므로 그쪽이 흔들려도 policy가 구분할 신호가 없습니다." },
  { label: "가중합", summary: "A 1.4 > C 1.2 > B 0.4", note: "정확도 ×1.0, 형식·언어 ×0.2를 더하면 A 1.0+0.2+0.2=1.4, C 1.0+0.2+0=1.2, B 0+0.2+0.2=0.4입니다. 형식과 언어가 완벽해도 오답 B는 정답 C를 넘지 못합니다." },
  { label: "길이 초과", summary: "1.4 + 0.2×(음수)", note: "overlong 항은 bonus가 아니어서 threshold 전에는 더하는 값이 없고, 넘으면 음수가 되어 총점을 깎습니다. 깎는 크기는 이 글에 없어서 막대 길이로 그리지 않았습니다." },
] as const;

function score(raw: Record<Part, number>, mode: Record<Part, number>) {
  return PARTS.reduce<number>((sum, part) => sum + raw[part.key] * mode[part.key], 0);
}

function fmt(value: number) {
  return value.toFixed(1);
}

export default function RewardMixViz() {
  return (
    <PosttrainingSceneShell
      eyebrow="Composite reward"
      title="한 기준만 채점하면 어느 후보를 놓치는가"
      description="같은 질문의 후보 세 개를 막대로 채점합니다. 가중치 1.0·0.2는 논문 snapshot이고, 후보와 각 항의 0/1 채점은 설명용입니다(가정)."
      note="sub-reward가 0과 1로만 매겨진다는 것은 그림을 위한 단순화입니다(가정). overlong penalty의 threshold와 크기는 이 글에 나오지 않습니다."
      ariaLabel="언어만, 정답만, 가중합으로 채점할 때 후보 세 개의 reward 비교"
      scenes={SCENES}
      render={(active) => {
        const mode = MODES[active];
        const overlong = active === 3;
        const rows = overlong ? CANDIDATES.slice(0, 1) : CANDIDATES;
        return (
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {PARTS.map((part) => (
                <span key={part.key} className={`inline-flex items-center gap-1.5 ${mode[part.key] === 0 ? "text-muted-foreground/50" : ""}`}>
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: mode[part.key] === 0 ? "#cbd5e1" : part.color }} />
                  {part.name} ×{mode[part.key] === 0 ? "0 (안 봄)" : mode[part.key].toFixed(1)}
                </span>
              ))}
              <span className={`inline-flex items-center gap-1.5 ${overlong ? "" : "text-muted-foreground/50"}`}>
                <span className="inline-block h-2.5 w-2.5 rounded-sm border border-dashed" style={{ borderColor: overlong ? "#d97706" : "#cbd5e1" }} />
                길이 ×0.2 (0 또는 음수)
              </span>
            </div>
            <div className="space-y-3">
              {CANDIDATES.map((candidate) => {
                const shown = rows.some((row) => row.id === candidate.id);
                const total = score(candidate.raw, mode);
                return (
                  <div key={candidate.id} className={`min-w-0 ${shown ? "" : "invisible"}`} aria-hidden={!shown}>
                    <p className="text-xs leading-5">
                      <strong className="font-mono">{candidate.id}</strong>
                      <span className="ml-2 text-muted-foreground">{overlong ? "3,200원 · 한국어 · 형식 지킴 · threshold보다 긴 trace" : candidate.desc}</span>
                    </p>
                    <div className="mt-1 grid grid-cols-[minmax(0,1fr)_4.75rem] items-center gap-2">
                      <div className="flex h-5 min-w-0 rounded-sm bg-muted/40">
                        {PARTS.map((part) => {
                          const value = candidate.raw[part.key] * mode[part.key];
                          return value > 0 ? (
                            <div
                              key={part.key}
                              className="h-full border-r border-background transition-[width] duration-300 motion-reduce:transition-none"
                              style={{ width: `${(value / SCALE) * 100}%`, backgroundColor: part.color }}
                              title={`${part.name} ${fmt(value)}`}
                            />
                          ) : null;
                        })}
                        {overlong && (
                          <div className="ml-1 flex h-full shrink-0 items-center whitespace-nowrap rounded-sm border border-dashed px-1.5 text-[10px] font-semibold" style={{ borderColor: "#d97706", color: "#b45309" }}>
                            ← 깎임
                          </div>
                        )}
                      </div>
                      <span className="text-right font-mono text-sm font-bold">{overlong ? "1.4 − ?" : fmt(total)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
