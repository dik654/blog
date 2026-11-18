import SceneShell from "./NetworkSceneShell";

/**
 * 본문 대응: GPU collective network 도입 숫자 절 — (가정) 16 ranks 중 15개는 0.2초, rank 13만 2.2초.
 * 공동 단계 완료 ≥ max = 2.2초. 평균 = (15 × 0.2 + 2.2) ÷ 16 = 5.2 ÷ 16 = 0.325초.
 */
const RANKS = 16;
const SLOW = 13;
const FAST_T = 0.2;
const SLOW_T = 2.2;
const TIMES = Array.from({ length: RANKS }, (_, rank) => (rank === SLOW ? SLOW_T : FAST_T));
const MEAN = TIMES.reduce<number>((sum, t) => sum + t, 0) / RANKS;
const X_MAX = 2.5;

const SCENES = [
  {
    label: "1. 0.2초: 열다섯 rank가 준비를 마칩니다",
    summary: "15 / 16 준비 · 단계는 아직",
    note: "Rank 열다섯 개는 0.2초에 준비를 끝냈지만 공동 단계는 모든 참여자가 들어와야 진행됩니다. 이들은 이제부터 기다립니다.",
  },
  {
    label: "2. 2.2초: rank 13이 도착합니다",
    summary: "완료는 2.2초 전에 불가능",
    note: "마지막 rank 13이 2.2초에 준비를 마쳐야 공동 단계가 끝날 수 있습니다. 나머지 열다섯 rank는 각자 2초를 기다린 셈입니다.",
  },
  {
    label: "3. 평균은 이 대기를 숨깁니다",
    summary: "평균 0.325초 vs 최소 완료 2.2초",
    note: "(15 × 0.2 + 2.2) ÷ 16 = 0.325초입니다. 평균만 보면 빨라 보이지만 사용자가 겪는 대기는 가장 늦은 rank가 정합니다.",
  },
] as const;

export default function SlowestRankWaitViz() {
  return (
    <SceneShell
      eyebrow="가장 늦은 참여자"
      title="16개 중 하나만 늦어도 모두가 그 시각까지 기다립니다"
      description="Rank는 공동 연산에 참여한 process 번호입니다. 막대 하나가 rank 하나의 단계 준비 시간이며, 숫자는 본문의 가정 사례입니다."
      ariaLabel="16개 rank 중 rank 13만 2.2초가 걸려 공동 단계가 2.2초 전에 끝나지 못하는 과정"
      scenes={SCENES}
      render={(active) => {
        const cursor = active === 0 ? FAST_T : SLOW_T;
        const pct = (t: number) => `${(t / X_MAX) * 100}%`;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-x-2">
              <div>
                <div className="mb-1 h-4" />
                {TIMES.map((t, rank) => (
                  <div key={rank} className={`h-4 font-mono text-[11px] leading-4 ${rank === SLOW ? "font-bold text-[#b91c1c]" : "text-muted-foreground"}`}>rank {rank}</div>
                ))}
              </div>
              <div className="min-w-0 pr-3">
                <div className="relative mb-1 h-4 text-[10px] text-muted-foreground">
                  {[0, 0.5, 1, 1.5, 2, 2.5].map((t) => (
                    <span key={t} className="absolute -translate-x-1/2 font-mono" style={{ left: pct(t) }}>{t}s</span>
                  ))}
                </div>
                <div className="relative">
                  {TIMES.map((t, rank) => {
                    const slow = rank === SLOW;
                    const shown = Math.min(t, cursor);
                    const done = t <= cursor;
                    return (
                      <div key={rank} className="relative h-4">
                        <div className="absolute inset-y-0.5 left-0 rounded-sm" style={{ width: pct(shown), backgroundColor: slow ? "#dc2626" : "#64748b" }} />
                        {done && !slow && active >= 1 && (
                          <div className="absolute top-[7px] border-t border-dashed border-[#94a3b8]" style={{ left: pct(t), width: pct(SLOW_T - t) }} />
                        )}
                        {slow && !done && (
                          <div className="absolute inset-y-0.5 rounded-sm border border-dashed border-[#dc2626]" style={{ left: pct(shown), width: pct(SLOW_T - shown) }} />
                        )}
                      </div>
                    );
                  })}
                  <div className="absolute inset-y-0 border-l border-foreground" style={{ left: pct(cursor) }} />
                  {active === 2 && <div className="absolute inset-y-0 border-l border-dashed border-[#2563eb]" style={{ left: pct(MEAN) }} />}
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
              <span><span className="mr-1 inline-block h-3 w-px translate-y-0.5 bg-foreground" />{active === 0 ? "지금 0.2초" : "공동 단계가 끝날 수 있는 가장 이른 시각 2.2초"}</span>
              <span className={active === 2 ? "" : "invisible"}><span className="mr-1 inline-block h-3 w-0 translate-y-0.5 border-l border-dashed border-[#2563eb]" />평균 {MEAN.toFixed(3)}초</span>
              {active === 0 ? (
                <span><span className="mr-1 inline-block h-3 w-4 translate-y-0.5 rounded-sm border border-dashed border-[#dc2626]" />rank 13의 남은 준비 (2.2초까지)</span>
              ) : (
                <span><span className="mr-1 inline-block w-4 translate-y-[-3px] border-t border-dashed border-[#94a3b8]" />기다리는 시간</span>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
