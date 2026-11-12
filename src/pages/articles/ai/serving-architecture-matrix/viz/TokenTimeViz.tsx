import SceneShell from "./SceneShell";

/**
 * 본문 대응: limits 절 — 대역폭 상한(token당 약 2.3ms, 추정)과 실측 단일 스트림의 차이,
 * P2P on 65 tok/s → 15.4ms, off 44 tok/s → 22.7ms, 차이 7.3ms ÷ 122회 ≈ 60μs(추정, 차이를 모두 통신 탓으로 둠).
 */
const FLOOR_MS = 2.3;
const ON_MS = 1000 / 65;
const OFF_MS = 1000 / 44;
const SYNCS = 122;
const GAP_MS = OFF_MS - ON_MS;
const PER_SYNC_US = (GAP_MS / SYNCS) * 1000;
const AXIS_MS = 25;

const SCENES = [
  {
    label: "대역폭만으로 본 바닥",
    summary: `약 ${FLOOR_MS}ms (추정)`,
    note: "3절에서 token당 약 30GB를 8장이 나눠 읽는다고 보고 1,597GB/s로 나눈 값입니다. 이 바닥이면 초당 400 token이 넘습니다. 가중치를 읽는 시간만 넣었고 합치기와 kernel 실행은 넣지 않았습니다.",
  },
  {
    label: "실측, P2P 켬",
    summary: `65 tok/s → ${ON_MS.toFixed(1)}ms`,
    note: `같은 노드의 실측 단일 스트림은 초당 65~101 token입니다. P2P를 켠 FP8 기록·DCP8 측정 65 token을 token당 시간으로 바꾸면 1,000 ÷ 65 = ${ON_MS.toFixed(1)}ms로 바닥의 6배가 넘습니다. 본문은 이 차이의 큰 몫을 122번의 합치기와 kernel 실행 지연으로 봅니다. 차이를 항목별로 나눠 잰 것은 아니라서 막대를 쪼개지 않았습니다.`,
  },
  {
    label: "실측, P2P 끔",
    summary: `44 tok/s → ${OFF_MS.toFixed(1)}ms`,
    note: `P2P를 끄면 44 token, 1,000 ÷ 44 = ${OFF_MS.toFixed(1)}ms입니다. 켰을 때보다 ${GAP_MS.toFixed(1)}ms 깁니다.`,
  },
  {
    label: "늘어난 시간을 122번으로 나누면",
    summary: `${GAP_MS.toFixed(1)}ms ÷ ${SYNCS} ≈ ${Math.round(PER_SYNC_US)}μs`,
    note: `token 하나에 합치기가 2 × 61 = ${SYNCS}번 있으므로, 늘어난 ${GAP_MS.toFixed(1)}ms를 모두 통신 탓으로 두면 합치기 한 번에 약 ${Math.round(PER_SYNC_US)}μs가 늘어난 셈입니다(추정). 다른 원인이 섞였다면 한 번의 몫은 이보다 작습니다.`,
  },
] as const;

const W = 320;
const H = 160;
const LEFT = 84;
const RIGHT = 46;
const BAR_H = 20;
const xs = (ms: number) => LEFT + (ms / AXIS_MS) * (W - LEFT - RIGHT);
const ROW_Y = [20, 60, 100] as const;

const FLOOR = "#94a3b8";
const ON = "#2563eb";
const OFF = "#64748b";
const GAP = "#d97706";
const MUTED = "#6b7280";

export default function TokenTimeViz() {
  return (
    <SceneShell
      eyebrow="Time per token, single stream"
      title="token 하나의 시간은 읽는 시간보다 훨씬 깁니다"
      description="막대는 요청 하나가 token 하나를 만드는 데 걸리는 시간(ms)입니다. 8×RTX PRO 6000 노드의 Kimi K2.5이고, 실측 두 줄은 FP8 기록·DCP8 설정입니다. P2P는 GPU끼리 CPU 메모리를 거치지 않고 PCIe로 직접 주고받게 하는 설정입니다."
      note="바닥값은 근거 문서의 추정 30GB에서 나온 계산이고, 실측은 커뮤니티 위키의 현장 경험 등급 기록입니다."
      ariaLabel="대역폭 바닥, P2P를 켠 실측, 끈 실측의 token당 시간과 그 차이"
      scenes={SCENES}
      render={(active) => {
        const rows = [
          { label: "대역폭 바닥", ms: FLOOR_MS, color: FLOOR, show: true, text: `${FLOOR_MS}ms` },
          { label: "P2P 켬", ms: ON_MS, color: ON, show: active >= 1, text: `${ON_MS.toFixed(1)}ms` },
          { label: "P2P 끔", ms: OFF_MS, color: OFF, show: active >= 2, text: `${OFF_MS.toFixed(1)}ms` },
        ];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 5, 10, 15, 20, 25].map((t) => (
              <g key={t}>
                <line x1={xs(t)} x2={xs(t)} y1={16} y2={ROW_Y[2] + BAR_H + 2} stroke="#94a3b8" strokeWidth={0.75} strokeDasharray="2 3" strokeOpacity={0.6} />
                <text x={xs(t)} y={H - 6} fontSize={10.5} textAnchor="middle" fill={MUTED}>
                  {t}
                </text>
              </g>
            ))}
            <text x={xs(AXIS_MS) + 12} y={H - 6} fontSize={10.5} fill={MUTED}>
              ms
            </text>
            {rows.map((row, i) => (
              <g key={row.label}>
                <text x={LEFT - 8} y={ROW_Y[i] + 14} fontSize={12} fontWeight={700} textAnchor="end" fill={row.show ? "currentColor" : MUTED}>
                  {row.label}
                </text>
                {row.show ? (
                  <>
                    <rect x={LEFT} y={ROW_Y[i]} width={xs(row.ms) - LEFT} height={BAR_H} rx={2} fill={row.color} />
                    {!(i === 2 && active === 3) && (
                      <text x={xs(row.ms) + 5} y={ROW_Y[i] + 14} fontSize={12} fontWeight={700} fill="currentColor">
                        {row.text}
                      </text>
                    )}
                  </>
                ) : (
                  <rect x={LEFT} y={ROW_Y[i]} width={W - LEFT - RIGHT} height={BAR_H} rx={2} fill="none" stroke="#94a3b8" strokeWidth={0.75} strokeDasharray="3 3" />
                )}
              </g>
            ))}
            {active === 3 && (
              <g>
                {Array.from({ length: SYNCS }, (_, k) => {
                  const x = xs(ON_MS + (k * GAP_MS) / SYNCS);
                  return <line key={k} x1={x} x2={x} y1={ROW_Y[2] + 1} y2={ROW_Y[2] + BAR_H - 1} stroke={GAP} strokeWidth={0.5} />;
                })}
                <rect x={xs(ON_MS)} y={ROW_Y[2]} width={xs(OFF_MS) - xs(ON_MS)} height={BAR_H} fill="none" stroke={GAP} strokeWidth={1.25} />
                <text x={xs(OFF_MS) + 5} y={ROW_Y[2] + 14} fontSize={12} fontWeight={700} fill={GAP}>
                  +{GAP_MS.toFixed(1)}ms
                </text>
                <text x={xs(OFF_MS)} y={ROW_Y[2] + BAR_H + 16} fontSize={11} fontWeight={700} textAnchor="end" fill={GAP}>
                  {SYNCS}칸 = 합치기 {SYNCS}번 × 약 {Math.round(PER_SYNC_US)}μs(추정)
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
