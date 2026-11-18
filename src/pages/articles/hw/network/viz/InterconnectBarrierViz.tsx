import SceneShell from "./NetworkSceneShell";

/**
 * 본문 대응: GPU interconnect 도입 숫자 절 — (가정) 동시에 끝나야 하는 여덟 전송 중 일곱 개 20µs, 하나 100µs.
 * 단계 완료 ≥ max = 100µs. 평균 = (7 × 20 + 100) ÷ 8 = 240 ÷ 8 = 30µs. 100 ÷ 20 = 5배.
 */
const COUNT = 8;
const SLOW = 7;
const FAST_T = 20;
const SLOW_T = 100;
const TIMES = Array.from({ length: COUNT }, (_, i) => (i === SLOW ? SLOW_T : FAST_T));
const MEAN = TIMES.reduce<number>((sum, t) => sum + t, 0) / COUNT;
const X_MAX = 110;
const TICKS = [0, 20, 40, 60, 80, 100] as const;

const SCENES = [
  {
    label: "20µs: 일곱 전송이 끝납니다",
    summary: "7 / 8 완료 · 단계는 아직",
    note: "여덟 전송이 모두 끝나야 다음으로 넘어가는 단계입니다. 일곱 개가 20µs에 끝나도 이 단계는 아직 끝나지 않았고, 끝난 일곱 개는 기다립니다.",
  },
  {
    label: "100µs: 느린 한 쌍이 끝납니다",
    summary: "단계 완료는 100µs보다 빠를 수 없음",
    note: "마지막 전송이 100µs에 끝나야 단계가 끝날 수 있습니다. 이 한 쌍은 다른 쌍보다 다섯 배(100 ÷ 20) 느리고, 나머지 일곱 쌍은 각자 80µs를 기다린 셈입니다.",
  },
  {
    label: "평균 30µs는 이 대기를 숨깁니다",
    summary: "평균 30µs vs 단계 ≥ 100µs",
    note: "(7 × 20 + 100) ÷ 8 = 30µs입니다. 평균만 보면 정상처럼 보이지만 단계의 끝은 가장 느린 쌍이 정합니다. 그래서 한 숫자 대신 쌍마다 따로 봅니다.",
  },
] as const;

export default function InterconnectBarrierViz() {
  return (
    <SceneShell
      eyebrow="가장 느린 한 쌍"
      title="여덟 전송 중 하나만 늦어도 단계는 그 전송을 기다립니다"
      description="막대 하나가 동시에 끝나야 하는 전송 하나의 소요 시간입니다. 숫자는 본문의 가정 사례이며 실측값이 아닙니다."
      ariaLabel="여덟 전송 중 일곱은 20마이크로초, 하나는 100마이크로초가 걸려 단계가 100마이크로초 전에 끝나지 못하는 과정"
      scenes={SCENES}
      render={(active) => {
        const cursor = active === 0 ? FAST_T : SLOW_T;
        const pct = (t: number) => `${(t / X_MAX) * 100}%`;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-2">
              <div>
                <div className="mb-1 h-4" />
                {TIMES.map((t, i) => (
                  <div key={i} className={`h-6 font-mono text-[11px] leading-6 ${i === SLOW ? "font-bold text-[#b91c1c] dark:text-[#f87171]" : "text-muted-foreground"}`}>
                    {i === SLOW ? "느린 쌍" : `전송 ${i + 1}`}
                  </div>
                ))}
              </div>
              <div className="min-w-0 pr-4">
                <div className="relative mb-1 h-4 text-[10px] text-muted-foreground">
                  {TICKS.map((t) => (
                    <span key={t} className="absolute -translate-x-1/2 font-mono" style={{ left: pct(t) }}>{t}</span>
                  ))}
                </div>
                <div className="relative">
                  {TIMES.map((t, i) => {
                    const slow = i === SLOW;
                    const shown = Math.min(t, cursor);
                    const done = t <= cursor;
                    return (
                      <div key={i} className="relative h-6">
                        <div className="absolute inset-y-1 left-0 rounded-sm" style={{ width: pct(shown), backgroundColor: slow ? "#dc2626" : "#64748b" }} />
                        {done && !slow && active >= 1 && (
                          <div className="absolute top-[11px] border-t border-dashed border-[#94a3b8]" style={{ left: pct(t), width: pct(SLOW_T - t) }} />
                        )}
                        {slow && !done && (
                          <div className="absolute inset-y-1 rounded-sm border border-dashed border-[#dc2626]" style={{ left: pct(shown), width: pct(SLOW_T - shown) }} />
                        )}
                      </div>
                    );
                  })}
                  <div className="absolute inset-y-0 border-l border-foreground" style={{ left: pct(cursor) }} />
                  {active === 2 && <div className="absolute inset-y-0 border-l border-dashed border-[#2563eb]" style={{ left: pct(MEAN) }} />}
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span>가로축: µs</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 border-l border-foreground" />현재 시각</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block w-4 border-t border-dashed border-[#94a3b8]" />끝나고 기다림</span>
              <span className={`inline-flex items-center gap-1.5 ${active === 0 ? "" : "invisible"}`}><span className="inline-block h-3 w-4 rounded-sm border border-dashed border-[#dc2626]" />아직 남은 전송</span>
              <span className={`inline-flex items-center gap-1.5 ${active === 2 ? "" : "invisible"}`}><span className="inline-block h-3 border-l border-dashed border-[#2563eb]" />평균 30µs</span>
            </div>
          </div>
        );
      }}
    />
  );
}
