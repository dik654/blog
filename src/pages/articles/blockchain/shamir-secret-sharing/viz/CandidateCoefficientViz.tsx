import SceneShell from "./SceneShell";

/**
 * 본문 대응: #privacy-boundary — 1번 조각 8 하나는 비밀 후보 0~16 각각과 정확히 한 계수로 맞는다.
 * 계수 = (8 − 비밀) mod 17. 비밀 0 → 8, 5 → 3, 10 → 15, 8 → 0.
 * 계수 0을 금지하면 비밀 8 후보가 빠진다.
 */
const P = 17;
const SHARE = 8;
const CANDIDATES = Array.from({ length: P }, (_, secret) => ({ secret, coef: (SHARE - secret + P) % P }));
const EXAMPLES = new Set([0, 5, 10]);

const SCENES = [
  {
    label: "조각 8 하나를 봤을 때",
    summary: "비밀 후보 17개 · 계수 하나씩",
    note: "비밀이 0이면 계수 8, 5이면 계수 3, 10이면 계수 15입니다(10 + 15 = 25를 17로 나눈 나머지 8). 어느 칸도 비어 있지 않고 계수가 겹치는 칸도 없습니다.",
  },
  {
    label: "계수가 균등하다면",
    summary: "어느 후보든 조각 8이 나올 확률 1/17",
    note: "계수를 17개 값에서 같은 확률로 고른다면, 어느 비밀을 고정해도 조각 8이 나올 확률은 맞는 계수 하나가 뽑힐 1/17입니다. 관찰 분포가 비밀에 따라 달라지지 않으니 조각 하나는 새 정보를 더하지 않습니다. 비밀을 고르기 전부터 있던 사전 정보까지 없애지는 않습니다.",
  },
  {
    label: "계수 0을 금지하면",
    summary: "비밀 8 후보가 빠짐",
    note: "비밀 8에 조각 8을 맞추려면 계수 0이 필요합니다. 0을 뺀 16개에서 균등하게 고른다면(가정) 비밀 8에서는 이 조각이 나올 수 없고 다른 후보는 1/16입니다. 관찰이 비밀에 따라 달라져 완전한 비밀성 논리가 깨집니다.",
  },
] as const;

export default function CandidateCoefficientViz() {
  return (
    <SceneShell
      eyebrow="조각 하나의 비밀성"
      title="조각 8 하나는 비밀 후보 17개 모두와 맞습니다"
      description="칸 하나가 비밀 후보 하나입니다. 위 숫자는 비밀 후보, 아래 숫자는 그 비밀에서 1번 결과가 8이 되게 하는 계수입니다. 모든 계산은 17로 나눈 나머지입니다."
      ariaLabel="1번 조각 8과 맞는 비밀 후보 0부터 16과 각 후보의 계수, 계수 0을 금지하면 비밀 8이 빠지는 경우"
      scenes={SCENES}
      render={(active) => {
        const banned = active === 2;
        const showProb = active >= 1;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9">
              {CANDIDATES.map(({ secret, coef }) => {
                const out = banned && coef === 0;
                const highlight = active === 0 && EXAMPLES.has(secret);
                const prob = out ? "0" : banned ? "1/16" : "1/17";
                return (
                  <div
                    key={secret}
                    className={`rounded-lg border px-1 py-1.5 text-center font-mono leading-5 ${
                      out ? "border-dashed border-red-600 text-muted-foreground" : highlight ? "border-primary bg-primary/10" : "border-border bg-background"
                    }`}
                  >
                    <span className={`block text-sm font-bold ${out ? "line-through" : ""}`}>{secret}</span>
                    <span className={`block text-xs ${out ? "font-semibold text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"}`}>계수 {coef}</span>
                    <span className={`block text-[11px] ${showProb ? (out ? "font-semibold text-red-700 dark:text-red-400" : "text-muted-foreground") : "invisible"}`}>{prob}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span><span className="font-mono font-bold text-foreground">굵은 숫자</span> 비밀 후보</span>
              <span><span className="font-semibold text-amber-700 dark:text-amber-400">계수</span> 비밀 + 계수×1 = 8 (17로 나눈 나머지)</span>
              {showProb && <span><span className="font-semibold text-foreground">{banned ? "1/16·0" : "1/17"}</span> 그 비밀일 때 조각 8이 나올 확률</span>}
            </div>
          </div>
        );
      }}
    />
  );
}
