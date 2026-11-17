import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cell-architecture — output(모든 step)과 마지막 (h_n, c_n)을 구분하고,
 * bidirectional output은 sequence 뒤쪽까지 읽으므로 online forecasting에서는 leakage가 된다.
 * 강조한 step k=t−2는 설명용 가정.
 */
const STEPS = ["t−5", "t−4", "t−3", "t−2", "t−1", "t"] as const;
const K = 3;

const SCENES = [
  {
    label: "Many-to-one",
    summary: "마지막 (h_n, c_n)만 head로",
    note: "왼쪽에서 오른쪽으로 window를 끝까지 읽은 뒤 마지막 state 하나만 forecast head에 넘깁니다. 중간 step의 output은 쓰지 않습니다.",
  },
  {
    label: "Sequence labeling",
    summary: "step마다 output",
    note: "모든 step의 output을 씁니다. 한 방향 LSTM에서 step k의 output은 k와 그 앞의 step만 읽은 결과입니다.",
  },
  {
    label: "Bidirectional",
    summary: "step k가 k 뒤쪽까지 읽음",
    note: "반대 방향 LSTM이 오른쪽 끝에서 왼쪽으로도 읽으므로, step k의 output에는 k 뒤 step의 값이 섞여 있습니다.",
  },
  {
    label: "Online forecasting",
    summary: "k 뒤 step은 아직 없음 → leakage",
    note: "관측이 한 점씩 들어오는 online 상황에서 step k 시점에는 k 뒤의 값이 아직 도착하지 않았습니다. k 뒤의 값을 읽는 bidirectional output을 그대로 쓰면 운영에서 알 수 없는 정보를 쓰게 되어 leakage가 됩니다.",
  },
] as const;

const W = 360;
const H = 168;
const LEFT = 24;
const CELL = 40;
const GAP = 12;
const ROW_Y = 70;
const x = (i: number) => LEFT + i * (CELL + GAP);

function Arrow({ x1, x2, y, color }: { x1: number; x2: number; y: number; color: string }) {
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={`M ${x2} ${y} l ${-5 * dir} -3 l 0 6 z`} fill={color} />
    </g>
  );
}

export default function OutputReadViz() {
  return (
    <SceneShell
      eyebrow="Output이 읽은 범위"
      title="Bidirectional output은 그 step 뒤의 값까지 읽습니다"
      description="칸 하나가 input window의 한 step입니다. 파란 화살표는 정방향, 주황 화살표는 역방향 읽기입니다. 굵은 칸이 지금 보는 step k(가정: t−2)이고, 빨간 점선 칸은 아직 도착하지 않은 step입니다."
      ariaLabel="many-to-one, sequence labeling, bidirectional output이 각각 어느 step까지 읽는지 비교"
      scenes={SCENES}
      render={(active) => {
        const perStep = active >= 1;
        const bidi = active >= 2;
        const online = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {STEPS.map((step, i) => {
              const after = i > K;
              const missing = online && after;
              const focus = perStep && i === K;
              const read = !perStep || i <= K || bidi;
              return (
                <g key={step}>
                  <rect
                    x={x(i)}
                    y={ROW_Y}
                    width={CELL}
                    height={28}
                    rx={4}
                    fill={missing ? "none" : "#64748b"}
                    fillOpacity={missing ? 0 : read && perStep ? 0.3 : 0.18}
                    stroke={missing ? "#dc2626" : focus ? "#0f172a" : "#94a3b8"}
                    strokeWidth={focus ? 1.25 : 1}
                    strokeDasharray={missing ? "3 3" : undefined}
                  />
                  <text x={x(i) + CELL / 2} y={ROW_Y + 18} textAnchor="middle" fontSize={10} fill={missing ? "#dc2626" : "#334155"} fontWeight={focus ? 700 : 400}>
                    {missing ? "미도착" : step}
                  </text>
                </g>
              );
            })}
            {STEPS.slice(1).map((step, i) => (
              <g key={`f-${step}`} opacity={online && i + 1 > K ? 0.25 : 1}>
                <Arrow x1={x(i) + CELL - 2} x2={x(i + 1) + 2} y={ROW_Y - 14} color="#2563eb" />
              </g>
            ))}
            <text x={LEFT} y={ROW_Y - 24} fontSize={10} fill="#2563eb">정방향</text>
            {bidi && (
              <>
                {STEPS.slice(1).map((step, i) => (
                  <Arrow key={`b-${step}`} x1={x(i + 1) + 2} x2={x(i) + CELL - 2} y={ROW_Y + 42} color="#d97706" />
                ))}
                <text x={LEFT} y={ROW_Y + 58} fontSize={10} fill="#d97706">역방향</text>
              </>
            )}
            {!perStep && (
              <>
                <line x1={x(5) + CELL / 2} x2={x(5) + CELL / 2} y1={ROW_Y + 30} y2={ROW_Y + 64} stroke="#0f172a" strokeWidth={1} />
                <text x={x(5) + CELL / 2} y={ROW_Y + 78} textAnchor="middle" fontSize={10} fontWeight={700} fill="#0f172a">(h_n, c_n) → head</text>
              </>
            )}
            {perStep && (
              <>
                <rect x={x(0)} y={ROW_Y - 8} width={bidi ? x(5) + CELL - LEFT : x(K) + CELL - LEFT} height={44} rx={6} fill="none" stroke="#0f172a" strokeWidth={1} strokeDasharray="2 3" />
                <text x={x(K) + CELL / 2} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={online ? "#dc2626" : "#0f172a"}>
                  {online ? "bidirectional output이 읽으려는 범위: t−5 ~ t" : bidi ? "step k output이 읽은 범위: t−5 ~ t" : "step k output이 읽은 범위: t−5 ~ t−2"}
                </text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
