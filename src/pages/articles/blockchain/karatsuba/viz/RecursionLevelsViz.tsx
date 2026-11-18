import SceneShell from "./SceneShell";

/**
 * 본문 대응: #recursive — n=8=2³을 한 자리까지 모두 나누는 모형(가정).
 * 깊이 j: 문제 3ʲ개, 각 8/2ʲ자리 → 층의 자리 합 8·(3/2)ʲ = 8, 12, 18, 27.
 * 마지막 층의 곱 3³=27개, 학교식 자리 쌍 8²=64개.
 */
const N = 8;
const DEPTHS = [0, 1, 2, 3] as const;
const count = (depth: number) => 3 ** depth;
const size = (depth: number) => N / 2 ** depth;
const MAX_UNITS = 27;

const SCENES = [
  { label: "깊이 0", summary: "8자리 문제 1개", note: "처음에는 8자리 두 수를 곱하는 문제 하나입니다. 막대 길이는 그 층에 있는 문제들의 자리 수를 모두 더한 값입니다." },
  { label: "깊이 1", summary: "4자리 × 3개 = 12자리", note: "한 번 나누면 절반 크기의 곱이 세 개 생깁니다. 크기는 반이 되고 개수는 세 배라 층의 자리 합은 8에서 12로 1.5배 늘어납니다." },
  { label: "깊이 2", summary: "2자리 × 9개 = 18자리", note: "세 문제를 각각 다시 세 개로 나눕니다. 층마다 자리 합이 1.5배씩 늘어나므로 합산 비용을 자리 수에 비례한다고 본 모형에서는 아래층일수록 그 층의 합산 비용이 큽니다." },
  { label: "깊이 3", summary: "1자리 × 27개", note: "한 자리까지 내려오면 더 나누지 않고 곱합니다. 마지막 곱은 3³=27개입니다. 실제 구현은 여러 자리에서 멈출 수 있어 이 수는 정한 모형의 값입니다." },
  { label: "학교식과 비교", summary: "27개 대 64개", note: "학교식은 8자리의 모든 자리 쌍을 곱하므로 8²=64개입니다. 같은 8자리에서 마지막 작은 곱의 수가 27개로 줄었습니다. 대신 각 층의 덧셈·뺄셈과 자리 합치기가 추가됩니다." },
] as const;

export default function RecursionLevelsViz() {
  return (
    <SceneShell
      eyebrow="재귀 나무의 층"
      title="문제는 세 배로 늘고 크기는 반으로 줄어듭니다"
      description="막대 조각 하나가 하위 곱 하나이고, 막대 전체 길이는 그 층 문제들의 자리 수 합입니다. 8자리 두 수를 한 자리까지 항상 세 개로 나누는 12절의 모형이며(가정), 실제 라이브러리의 호출 수가 아닙니다."
      ariaLabel="8자리 곱셈을 세 개씩 나눌 때 깊이별 문제 수와 자리 합, 학교식 64개와의 비교"
      scenes={SCENES}
      render={(active) => {
        const compare = active === SCENES.length - 1;
        return (
          <div className="min-w-0">
            <div className="space-y-3">
              {DEPTHS.map((depth) => {
                const visible = compare || depth <= active;
                const units = count(depth) * size(depth);
                return (
                  <div key={depth} className={`grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 transition-opacity duration-300 motion-reduce:transition-none ${visible ? "opacity-100" : "opacity-15"}`}>
                    <span className="text-xs leading-4">
                      <span className="block font-semibold">깊이 {depth}</span>
                      <span className="block font-mono text-muted-foreground">{size(depth)}자리×{count(depth)}</span>
                    </span>
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex min-w-0 gap-[2px]" style={{ width: `${(units / MAX_UNITS) * 82}%` }}>
                        {Array.from({ length: count(depth) }, (_, index) => (
                          <div key={index} className={`h-5 min-w-0 flex-1 rounded-[2px] border ${depth === active && !compare ? "border-blue-600 bg-blue-500/40" : "border-slate-400 bg-slate-300/60 dark:bg-slate-600/60"}`} />
                        ))}
                      </div>
                      <span className="shrink-0 font-mono text-xs font-semibold">{units}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`mt-5 space-y-2 border-t border-border pt-4 transition-opacity duration-300 motion-reduce:transition-none ${compare ? "opacity-100" : "opacity-0"}`} aria-hidden={!compare}>
              {[
                { label: "Karatsuba 마지막 곱", value: 27, color: "#2563eb" },
                { label: "학교식 자리 쌍", value: 64, color: "#64748b" },
              ].map((bar) => (
                <div key={bar.label} className="grid grid-cols-[7.5rem_minmax(0,1fr)_2rem] items-center gap-2 text-xs">
                  <span>{bar.label}</span>
                  <div className="h-3 min-w-0 rounded-sm bg-muted/40">
                    <div className="h-full rounded-sm" style={{ width: `${(bar.value / 64) * 100}%`, backgroundColor: bar.color }} />
                  </div>
                  <span className="text-right font-mono font-semibold">{bar.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
