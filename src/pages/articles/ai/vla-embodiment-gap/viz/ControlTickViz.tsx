import SceneShell from "./SceneShell";

/**
 * 본문 대응: #closed-loop-release — "10Hz target인데 p95 inference가 180ms면 stale observation이 누적됩니다."
 * 10Hz → 100ms마다 틱. 추론을 매번 180ms로 두고 쉬지 않고 이어 돌린다고 가정합니다(가정).
 * 추론 완료: 180, 360, 540, 720, 900ms. 완료 뒤 처음 오는 틱(같은 시각 포함)에 적용 → 200, 400, 600, 800, 900ms.
 * 적용 순간 관측 나이: 200, 220, 240, 260, 180ms.
 */
const PERIOD = 100;
const HZ = 1000 / PERIOD;
const INFER = 180;
const SPAN = 1000;
const TICKS = Array.from({ length: HZ }, (_, i) => i * PERIOD);
const RUNS = Array.from({ length: Math.ceil(SPAN / INFER) }, (_, i) => ({ obs: i * INFER, ready: (i + 1) * INFER }));
const DONE = RUNS.filter((r) => r.ready <= TICKS[TICKS.length - 1]);
const applyTick = (ready: number) => Math.ceil(ready / PERIOD) * PERIOD;
const APPLIED = DONE.map((r) => ({ ...r, at: applyTick(r.ready), age: applyTick(r.ready) - r.obs }));
const FRESH = new Set(APPLIED.map((a) => a.at));
const AGES = APPLIED.map((a) => a.age);
const MIN_AGE = Math.min(...AGES);
const MAX_AGE = Math.max(...AGES);

const W = 360;
const H = 176;
const X0 = 20;
const X1 = 340;
const tx = (ms: number) => X0 + (ms / SPAN) * (X1 - X0);
const TICK_Y = 46;
const RUN_Y = 92;
const INK = "#475569";
const MUTED = "#94a3b8";
const ACCENT = "#2563eb";
const OK = "#16a34a";
const AMBER = "#d97706";

const SCENES = [
  {
    label: "10Hz는 100ms마다 한 번",
    summary: `1초에 틱 ${HZ}번`,
    note: `Controller가 10Hz로 돌면 100ms마다 action을 하나씩 적용합니다. 틱마다 새 관측을 반영하려면 관측에서 action까지가 ${PERIOD}ms 안에 끝나야 합니다.`,
  },
  {
    label: "추론이 180ms라면",
    summary: `틱 ${HZ}번 중 새 action ${FRESH.size}번`,
    note: `추론 한 번에 ${INFER}ms가 걸리고 끝나자마자 다음 추론을 시작한다고 두면(가정) 1초 안에 끝나는 추론은 ${DONE.length}번입니다. 나머지 틱은 새 action 없이 지나갑니다. 글의 p95 ${INFER}ms를 모든 호출에 적용한 단순화입니다.`,
  },
  {
    label: "Action이 보는 관측은 이미 지난 것",
    summary: `관측 나이 ${MIN_AGE}~${MAX_AGE}ms`,
    note: `새 action이 적용되는 순간 그 action이 본 관측은 ${MIN_AGE}~${MAX_AGE}ms 전 것으로, 틱 간격 ${PERIOD}ms보다 오래됐습니다. 그동안 robot은 이미 다른 위치에 있을 수 있습니다.`,
  },
] as const;

export default function ControlTickViz() {
  return (
    <SceneShell
      eyebrow="Latency and control"
      title="추론이 제어 주기보다 길면 action은 지난 관측 위에서 움직입니다"
      description="가로축은 1초입니다. 위 눈금은 10Hz controller의 틱, 아래 막대는 추론 한 번입니다. 추론을 쉬지 않고 이어 돌린다고 둔 단순화입니다(가정)."
      ariaLabel="10Hz 제어 주기와 180ms 추론 시간의 시간선"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={X0} y={TICK_Y - 26} fontSize={11} fontWeight={700} fill={INK}>
            controller 틱 (100ms)
          </text>
          <line x1={X0} y1={TICK_Y} x2={X1} y2={TICK_Y} stroke={MUTED} strokeWidth={1} />
          {TICKS.map((t) => {
            const fresh = active >= 1 && FRESH.has(t);
            const color = active === 0 ? ACCENT : fresh ? OK : MUTED;
            return (
              <g key={t}>
                <rect x={tx(t) - 4} y={TICK_Y - 14} width={8} height={14} rx={1.5} fill={color} opacity={active >= 1 && !fresh ? 0.45 : 0.9} />
                <text x={tx(t)} y={TICK_Y + 12} textAnchor="middle" fontSize={9.5} fill={INK}>
                  {t}
                </text>
              </g>
            );
          })}
          <text x={X1} y={TICK_Y + 12} textAnchor="end" fontSize={9.5} fill={INK}>
            ms
          </text>

          {active === 0 && (
            <>
              <rect x={tx(0)} y={RUN_Y - 8} width={tx(PERIOD) - tx(0)} height={14} rx={2} fill="none" stroke={ACCENT} strokeWidth={1} strokeDasharray="3 2" />
              <text x={tx(PERIOD) + 6} y={RUN_Y - 2} fontSize={11} fill={ACCENT}>
                관측 → 추론 → action이
              </text>
              <text x={tx(PERIOD) + 6} y={RUN_Y + 12} fontSize={11} fill={ACCENT}>
                {PERIOD}ms 안에 끝나야 틱마다 새 action
              </text>
            </>
          )}

          {active >= 1 && (
            <>
              <text x={X0} y={RUN_Y - 14} fontSize={11} fontWeight={700} fill={INK}>
                추론 ({INFER}ms씩, 가정)
              </text>
              {RUNS.map((r, i) => {
                const end = Math.min(r.ready, SPAN);
                return (
                  <g key={r.obs}>
                    <rect
                      x={tx(r.obs) + 0.5}
                      y={RUN_Y - 6 + (i % 2) * 10}
                      width={tx(end) - tx(r.obs) - 1}
                      height={8}
                      rx={1.5}
                      fill={AMBER}
                      opacity={r.ready <= SPAN ? 0.75 : 0.3}
                    />
                  </g>
                );
              })}
            </>
          )}

          {active === 1 &&
            APPLIED.map((a) => (
              <line key={a.at} x1={tx(a.ready)} y1={RUN_Y - 6} x2={tx(a.at)} y2={TICK_Y + 16} stroke={OK} strokeWidth={1} />
            ))}

          {active === 2 &&
            APPLIED.map((a, i) => {
              const y = 128 + (i % 2) * 18;
              return (
                <g key={a.at}>
                  <line x1={tx(a.obs)} y1={y} x2={tx(a.at)} y2={y} stroke={OK} strokeWidth={1.25} />
                  <circle cx={tx(a.obs)} cy={y} r={2.5} fill={INK} />
                  <circle cx={tx(a.at)} cy={y} r={2.5} fill={OK} />
                  <text x={(tx(a.obs) + tx(a.at)) / 2} y={y - 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={OK}>
                    {a.age}ms
                  </text>
                </g>
              );
            })}

          <g>
            <rect x={X0} y={H - 12} width={8} height={8} rx={1.5} fill={OK} opacity={active === 1 ? 0.9 : 0} />
            <text x={active === 2 ? X0 : X0 + 12} y={H - 5} fontSize={10} fill={INK} opacity={active >= 1 ? 1 : 0}>
              {active === 2 ? "왼쪽 회색 점 = 관측 시각, 오른쪽 초록 점 = 적용 시각" : "새 action 적용 틱 · 흐린 틱 = 새 action 없음"}
            </text>
          </g>
        </svg>
      )}
    />
  );
}
