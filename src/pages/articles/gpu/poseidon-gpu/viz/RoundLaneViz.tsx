import SceneShell from "./SceneShell";

/**
 * 본문 대응: #round-kernel — full/partial round의 S-box 범위와,
 * state를 thread 하나가 가질 때와 여러 lane이 칸을 나눌 때 mix 앞 barrier가 생기는지.
 * width 3은 위 F17 예와 같은 폭이며, partial round에서 S-box를 받는 칸(x₀)은 가정이다.
 */
const SCENES = [
  {
    label: "Full round",
    summary: "세 칸 모두 S-box",
    note: "상수 더하기 → S-box → mix 순서입니다. Full round는 모든 coordinate에 S-box를 적용하고, mix에서는 각 output이 세 칸의 S-box 결과를 모두 받습니다.",
  },
  {
    label: "Partial round",
    summary: "지정한 칸만 S-box",
    note: "Partial round는 profile이 지정한 coordinate에만 S-box를 적용하고 나머지 칸은 상수만 더한 채 mix로 갑니다. 그림에서 x0을 고른 것은 예시입니다(가정). Mix는 full round처럼 세 칸을 모두 섞습니다.",
  },
  {
    label: "thread 하나가 state 하나",
    summary: "mix 재료가 한 thread 안에",
    note: "한 thread가 세 칸을 모두 가지면 mix에 필요한 값이 이미 자기 손에 있습니다. 이렇게 thread-local인 state에는 barrier가 필요 없을 수 있습니다.",
  },
  {
    label: "lane 셋이 칸을 나눔",
    summary: "mix 앞에서 barrier",
    note: "칸마다 다른 lane이 맡으면 주황 선처럼 다른 lane에서 값이 넘어와야 합니다. 예를 들어 x0′을 만들 lane 0은 lane 1·2가 만든 S-box 결과가 필요하므로, 그 값을 만드는 lane들이 모두 끝날 때까지 barrier에서 기다립니다. 둘 중 어느 mapping이 나은지는 batch·width·register pressure·matrix traffic을 재서 정합니다.",
  },
] as const;

const COLS = [118, 208, 298] as const;
const BOX_W = 62;
const BOX_H = 26;
const ROW = { input: 34, ark: 84, sbox: 134, mix: 222 } as const;
const BARRIER_Y = 180;
const PARTIAL_SBOX = 0;

const INK = "#334155";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const ACCENT = "#2563eb";
const CROSS = "#d97706";

function Box({ cx, cy, label, sub, prime = false, strong = false, dashed = false }: { cx: number; cy: number; label: string; sub?: number; prime?: boolean; strong?: boolean; dashed?: boolean }) {
  return (
    <g>
      <rect
        x={cx - BOX_W / 2}
        y={cy - BOX_H / 2}
        width={BOX_W}
        height={BOX_H}
        rx={6}
        fill={strong ? "#dbeafe" : "#f8fafc"}
        stroke={strong ? ACCENT : LINE}
        strokeWidth={1}
        strokeDasharray={dashed ? "3 3" : undefined}
      />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={strong ? 700 : 500} fill={strong ? "#1e3a8a" : INK}>
        {label}
        {sub === undefined ? null : <tspan fontSize={8} dy={3}>{sub}</tspan>}
        {prime ? <tspan dy={sub === undefined ? 0 : -3}>′</tspan> : null}
      </text>
    </g>
  );
}

export default function RoundLaneViz() {
  return (
    <SceneShell
      eyebrow="02 · round와 mapping"
      title="S-box를 받는 칸과 mix 앞의 기다림"
      description="세로줄 하나가 state의 coordinate 하나입니다. width 3은 위 F17 예와 같은 폭이고, 위에서 아래로 한 round가 진행됩니다. Coordinate는 state를 이루는 field element 한 칸, lane은 GPU에서 함께 움직이는 thread 하나입니다."
      ariaLabel="full round와 partial round의 S-box 범위, thread 하나 또는 lane 셋에 state를 나눌 때 barrier 위치"
      scenes={SCENES}
      render={(active) => {
        const partial = active === 1;
        const lanes = active === 3;
        const oneThread = active === 2;
        const showMapping = active >= 2;
        return (
          <svg viewBox="0 0 360 262" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {oneThread && (
              <g>
                <rect x={80} y={12} width={256} height={234} rx={10} fill="none" stroke={ACCENT} strokeWidth={1.25} />
                <text x={208} y={258} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>thread 0 · state 하나 전체</text>
              </g>
            )}
            {lanes &&
              COLS.map((cx, i) => (
                <g key={`lane-${cx}`}>
                  <rect x={cx - 40} y={12} width={80} height={234} rx={8} fill="none" stroke={ACCENT} strokeWidth={1} strokeDasharray="4 3" />
                  <text x={cx} y={258} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>lane {i}</text>
                </g>
              ))}

            {[
              ["입력", ROW.input],
              ["1 상수", ROW.ark],
              ["2 S-box", ROW.sbox],
              ["3 mix", ROW.mix],
            ].map(([label, y]) => (
              <text key={label} x={8} y={Number(y) + 4} fontSize={11} fontWeight={700} fill={MUTED}>{label}</text>
            ))}

            {COLS.map((cx) => (
              <line key={`v1-${cx}`} x1={cx} x2={cx} y1={ROW.input + BOX_H / 2} y2={ROW.ark - BOX_H / 2} stroke={LINE} strokeWidth={1} />
            ))}
            {COLS.map((cx) => (
              <line key={`v2-${cx}`} x1={cx} x2={cx} y1={ROW.ark + BOX_H / 2} y2={ROW.sbox - BOX_H / 2} stroke={LINE} strokeWidth={1} />
            ))}

            {COLS.map((from, j) =>
              COLS.map((to, i) => {
                const cross = i !== j;
                const highlight = lanes && cross;
                const dim = oneThread || (showMapping && !lanes);
                return (
                  <line
                    key={`m-${j}-${i}`}
                    x1={from}
                    y1={ROW.sbox + BOX_H / 2}
                    x2={to}
                    y2={ROW.mix - BOX_H / 2}
                    stroke={highlight ? CROSS : dim ? LINE : MUTED}
                    strokeWidth={highlight ? 1.25 : 1}
                    opacity={highlight ? 1 : 0.7}
                  />
                );
              }),
            )}

            {lanes && (
              <g>
                <line x1={80} x2={336} y1={BARRIER_Y} y2={BARRIER_Y} stroke={CROSS} strokeWidth={1.25} strokeDasharray="6 3" />
                <rect x={160} y={BARRIER_Y - 9} width={96} height={18} rx={4} fill="#fff7ed" stroke={CROSS} strokeWidth={1} />
                <text x={208} y={BARRIER_Y + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#9a3412">barrier: 셋 다 준비</text>
              </g>
            )}

            {COLS.map((cx, i) => (
              <Box key={`in-${cx}`} cx={cx} cy={ROW.input} label="x" sub={i} />
            ))}
            {COLS.map((cx, i) => (
              <Box key={`ark-${cx}`} cx={cx} cy={ROW.ark} label="+C" sub={i} />
            ))}
            {COLS.map((cx, i) => {
              const applies = !partial || i === PARTIAL_SBOX;
              return <Box key={`sb-${cx}`} cx={cx} cy={ROW.sbox} label={applies ? "S-box" : "그대로"} strong={applies && active < 2} dashed={!applies} />;
            })}
            {COLS.map((cx, i) => (
              <Box key={`mix-${cx}`} cx={cx} cy={ROW.mix} label="x" sub={i} prime strong={lanes && i === 0} />
            ))}
          </svg>
        );
      }}
    />
  );
}
