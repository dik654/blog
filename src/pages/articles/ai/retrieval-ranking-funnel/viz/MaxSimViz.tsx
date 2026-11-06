import SceneShell from "./SceneShell";

/**
 * 본문 대응: #late-interaction MaxSim 예시 — 0.82(세션–유지), 0.75(조기–짧), 0.72(만료–다), 합 2.29.
 * 나머지 칸의 값은 본문이 정하지 않았으므로 숫자를 적지 않습니다.
 */
const Q = ["세션", "조기", "만료"] as const;
const D = ["로그인", "유지", "시간", "짧", "다"] as const;
const BEST = [
  { col: 1, value: 0.82 },
  { col: 3, value: 0.75 },
  { col: 4, value: 0.72 },
] as const;
const SUM = BEST.reduce<number>((total, item) => total + item.value, 0);

const SCENES = [
  { label: "질의 토큰 × 문서 토큰", summary: `3 × 5 = ${Q.length * D.length}칸`, note: "칸 하나가 내적 한 번입니다. 숫자를 적지 않은 칸의 값은 예시가 정하지 않았고, 각 줄의 최댓값보다 크지 않습니다." },
  { label: "세션의 줄", summary: "최댓값 0.82 (유지)", note: "질의 토큰 하나를 문서 토큰 5개 전체와 비교해 가장 큰 값만 남깁니다." },
  { label: "조기의 줄", summary: "최댓값 0.75 (짧)", note: "줄마다 따로 최댓값을 고릅니다. 이번에는 다른 문서 토큰에서 나왔습니다." },
  { label: "만료의 줄", summary: "최댓값 0.72 (다)", note: "세 질의 토큰이 서로 다른 문서 토큰과 짝지어졌습니다." },
  { label: "최댓값을 더함", summary: `0.82 + 0.75 + 0.72 = ${SUM.toFixed(2)}`, note: "이 합이 MaxSim입니다. 하나의 뭉친 벡터였다면 이 대응 일부가 평균에 묻혀 사라질 수 있습니다." },
] as const;

export default function MaxSimViz() {
  return (
    <SceneShell
      eyebrow="MaxSim"
      title="질의 토큰마다 가장 비슷한 문서 토큰 하나만 셉니다"
      description="가로줄이 질의 토큰, 세로줄이 문서 토큰입니다. 유사도 값은 본문 예시의 가정입니다."
      ariaLabel="질의 토큰 3개와 문서 토큰 5개의 표에서 줄마다 최댓값을 골라 더하는 과정"
      scenes={SCENES}
      render={(active) => {
        const shownRows = Math.min(active, BEST.length);
        return (
          <div className="min-w-0">
            <div className="grid min-w-0 grid-cols-[2.75rem_repeat(5,minmax(0,1fr))] gap-1 text-center text-xs">
              <span />
              {D.map((token) => (
                <span key={token} className="min-w-0 py-1 font-semibold text-muted-foreground">{token}</span>
              ))}
              {Q.map((token, row) => (
                <div key={token} className="contents">
                  <span className="flex items-center justify-start font-semibold text-amber-800 dark:text-amber-300">{token}</span>
                  {D.map((docToken, col) => {
                    const scanning = active === row + 1;
                    const isBest = BEST[row].col === col && row < shownRows;
                    return (
                      <span
                        key={docToken}
                        className={`flex h-10 min-w-0 items-center justify-center rounded-md border font-mono ${
                          isBest ? "border-primary bg-primary font-bold text-primary-foreground" : scanning ? "border-amber-600 bg-amber-500/10 text-muted-foreground" : "border-border/70 bg-background text-muted-foreground/60"
                        }`}
                      >
                        {isBest ? BEST[row].value.toFixed(2) : "·"}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm">
              <span className="font-sans text-xs font-semibold text-muted-foreground">합계</span>
              {BEST.map((item, index) => (
                <span key={item.col} className={index < shownRows ? "font-bold" : "text-muted-foreground/40"}>
                  {index > 0 ? "+ " : ""}
                  {index < shownRows ? item.value.toFixed(2) : "?"}
                </span>
              ))}
              <span className={active === SCENES.length - 1 ? "font-bold text-primary" : "text-muted-foreground/40"}>= {active === SCENES.length - 1 ? SUM.toFixed(2) : "?"}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
