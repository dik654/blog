import SceneShell from "./SceneShell";

/**
 * 본문 대응: #window — W=4096 window 를 layer k 개 쌓으면 이론적 수신 범위가 W×k 로 늘어난다.
 * n=32,768 sequence 의 마지막 query 기준. k=1: 4,096 · k=2: 8,192 · k=4: 16,384 · k=8: 32,768(=n) · k=32: 131,072.
 * 맨 앞 token 의 사실은 "멀리 있는 사실 하나" 를 그림에 놓은 가정이다.
 */
const N = 32768;
const W = 4096;
const ROWS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

const SCENES = [
  { label: "Layer 1", summary: "4,096 token · n 의 1/8", k: 1, note: "첫 layer 의 query 는 직전 4,096 개만 봅니다. 맨 앞 token 의 사실(가정)은 window 밖이라 신호가 오지 않습니다." },
  { label: "Layer 2", summary: "4,096 × 2 = 8,192", k: 2, note: "다음 layer 도 직전 4,096 개만 보지만, 그 위치들이 앞 layer 에서 이미 4,096 개씩 본 결과를 담고 있어 범위가 window 하나만큼 더 뻗습니다." },
  { label: "Layer 4", summary: "4,096 × 4 = 16,384", k: 4, note: "4 layer 를 지나도 sequence 의 절반입니다. 맨 앞 사실은 아직 닿지 않습니다." },
  { label: "Layer 8", summary: "4,096 × 8 = 32,768 = n", k: 8, note: "8 layer 를 지나야 겨우 32,768 token 전체를 덮고 맨 앞 사실에 닿습니다. 그 전 layer 에서는 이 사실의 신호를 받지 못합니다." },
  { label: "Layer 32", summary: "4,096 × 32 = 131,072", k: 32, note: "32 layer 전부를 지난 이론적 수신 범위는 131,072 token 으로, 32K 문맥(32,768)의 4 배입니다. 그림의 축은 sequence 길이까지만 그렸습니다." },
] as const;

const VW = 360;
const LEFT = 58;
const RIGHT = 344;
const TOP = 40;
const ROW_H = 13;
const ROW_GAP = 5;
const xOf = (pos: number) => LEFT + (pos / N) * (RIGHT - LEFT);
const rowY = (index: number) => TOP + index * (ROW_H + ROW_GAP);
const LAST_ROW_Y = rowY(ROWS.length);
const AXIS_Y = LAST_ROW_Y + ROW_H + 12;
const VH = AXIS_Y + 30;

export default function ReceptiveFieldStackViz() {
  return (
    <SceneShell
      eyebrow="Sliding-window · layer 쌓기"
      title="Layer 를 하나 쌓을 때마다 window 하나만큼 더 멀리 닿습니다"
      description="가로축은 n=32,768 token sequence 이고 오른쪽 끝이 지금 query 입니다. 줄 하나가 layer 하나이며, 색칠한 폭이 그 layer 까지 쌓았을 때의 이론적 수신 범위(정보가 전달될 수 있는 최대 거리)입니다. Window 는 W=4,096 입니다."
      ariaLabel="Window 4096 을 layer 1, 2, 4, 8, 32 개 쌓았을 때 수신 범위가 늘어나는 모습"
      scenes={SCENES}
      render={(active) => {
        const k = SCENES[active].k;
        const reached = k * W >= N;
        return (
          <svg viewBox={`0 0 ${VW} ${VH}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <circle cx={xOf(0) + 4} cy={20} r={4} fill={reached ? "#16a34a" : "#ffffff"} stroke={reached ? "#16a34a" : "#94a3b8"} strokeWidth={1} />
            <text x={xOf(0) + 12} y={24} fontSize={11} fill={reached ? "#16a34a" : "#64748b"} fontWeight={reached ? 700 : 400}>
              맨 앞 사실(가정) · {reached ? "도달" : "미도달"}
            </text>
            <text x={RIGHT} y={24} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">query ▼</text>
            {ROWS.map((layer, index) => {
              const on = layer <= k;
              const span = Math.min(layer * W, N);
              const y = rowY(index);
              return (
                <g key={layer}>
                  <text x={LEFT - 6} y={y + ROW_H - 3} textAnchor="end" fontSize={11} fill={on ? "#334155" : "#94a3b8"}>
                    layer {layer}
                  </text>
                  <rect x={LEFT} y={y} width={RIGHT - LEFT} height={ROW_H} fill="none" stroke="#cbd5e1" strokeWidth={1} />
                  {on && <rect x={xOf(N - span)} y={y} width={xOf(N) - xOf(N - span)} height={ROW_H} fill="#2563eb" fillOpacity={layer === Math.min(k, 8) ? 0.75 : 0.35} stroke="#2563eb" strokeWidth={1} />}
                </g>
              );
            })}
            <g>
              <text x={LEFT - 6} y={LAST_ROW_Y + ROW_H - 3} textAnchor="end" fontSize={11} fill={k === 32 ? "#334155" : "#94a3b8"}>
                ⋯ 32
              </text>
              <rect x={LEFT} y={LAST_ROW_Y} width={RIGHT - LEFT} height={ROW_H} fill={k === 32 ? "#2563eb" : "none"} fillOpacity={0.75} stroke={k === 32 ? "#2563eb" : "#cbd5e1"} strokeWidth={1} strokeDasharray={k === 32 ? undefined : "3 3"} />
              {k === 32 && (
                <text x={(LEFT + RIGHT) / 2} y={LAST_ROW_Y + ROW_H - 3} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">
                  131,072 · 축 밖까지 4 배
                </text>
              )}
            </g>
            <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {Array.from({ length: 9 }, (_, tick) => (
              <line key={tick} x1={xOf(tick * W)} x2={xOf(tick * W)} y1={AXIS_Y - 3} y2={AXIS_Y + 3} stroke="#94a3b8" strokeWidth={1} />
            ))}
            <text x={LEFT} y={AXIS_Y + 16} fontSize={11} fill="#64748b">위치 0</text>
            <text x={RIGHT} y={AXIS_Y + 16} textAnchor="end" fontSize={11} fill="#64748b">32,768</text>
            <text x={(LEFT + RIGHT) / 2} y={AXIS_Y + 16} textAnchor="middle" fontSize={11} fill="#64748b">눈금 1칸 = 4,096</text>
          </svg>
        );
      }}
    />
  );
}
