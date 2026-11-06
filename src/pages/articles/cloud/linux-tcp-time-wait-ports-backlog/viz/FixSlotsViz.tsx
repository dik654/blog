import SceneShell from "./SceneShell";

/**
 * 본문 대응: #fixes — 도착률 λ와 상한 k × P ÷ T를 같은 로그 축에 놓고 해법마다 어느 값이 움직이는지 본다.
 * 현재 1×28,232÷60≈470, 목적지 4개 ≈1,882, 범위 1024–65535 ≈1,075, tw_reuse=1 ≥28,232, keep-alive는 λ가 한 자릿수(가정).
 */
const W = 360;
const H = 118;
const LEFT = 14;
const RIGHT = 346;
const MAX_LOG = 5;
const BAR_Y = 42;
const BAR_H = 24;
const lx = (value: number) => LEFT + (Math.log10(value) / MAX_LOG) * (RIGHT - LEFT);

const TICKS: readonly { value: number; label: string }[] = [
  { value: 1, label: "1" },
  { value: 10, label: "10" },
  { value: 100, label: "100" },
  { value: 1000, label: "1,000" },
  { value: 10000, label: "10,000" },
  { value: 100000, label: "100,000" },
];

type Slot = "lambda" | "k" | "P" | "T";

interface FixState {
  slot: Slot | null;
  lambda: string;
  k: string;
  P: string;
  T: string;
  limit: number;
  limitLabel: string;
  atLeast?: boolean;
  singleDigit?: boolean;
}

const STATES: readonly FixState[] = [
  { slot: null, lambda: "600", k: "1", P: "28,232", T: "60", limit: 470, limitLabel: "상한 ≈ 470" },
  { slot: "lambda", lambda: "한 자릿수", k: "1", P: "28,232", T: "60", limit: 470, limitLabel: "상한 ≈ 470", singleDigit: true },
  { slot: "k", lambda: "600", k: "4", P: "28,232", T: "60", limit: 1882, limitLabel: "상한 ≈ 1,882" },
  { slot: "P", lambda: "600", k: "1", P: "64,512", T: "60", limit: 1075, limitLabel: "상한 ≈ 1,075" },
  { slot: "T", lambda: "600", k: "1", P: "28,232", T: "≤ 1", limit: 28232, limitLabel: "상한 ≥ 28,232", atLeast: true },
];

const SCENES = [
  { label: "지금", summary: "λ 600 > 상한 470", note: "막대 끝이 상한, 세로 선이 초당 여는 수 λ입니다. 선이 막대 밖에 있으니 포트가 모자랍니다." },
  { label: "연결 재사용: λ를 줄입니다", summary: "λ 600 → 한 자릿수 (가정)", note: "keep-alive는 연결 하나로 요청을 여러 번 보내는 재사용입니다. pool에 연결 32개를 열어 두면 새 연결이 드물게만 생겨 상한은 그대로이고 선이 움직입니다." },
  { label: "목적지 늘리기: k를 키웁니다", summary: "4 × 28,232 ÷ 60 ≈ 1,882", note: "IP 4개로 고르게 나누면 포트를 따로 셉니다. load balancer 뒤의 VIP 하나만 부른다면 k는 1이라 통하지 않습니다." },
  { label: "범위 넓히기: P를 키웁니다", summary: "64,512 ÷ 60 ≈ 1,075", note: "1024–65535로 잡으면 65535 − 1024 + 1 = 64,512개입니다. 나중에 listen할 포트는 자동 배정에서 빼 두어야 합니다." },
  { label: "tcp_tw_reuse = 1: 실질 T를 줄입니다", summary: "28,232 ÷ 1 → 28,232 이상", note: "같은 4-tuple의 TIME_WAIT를 넘겨받습니다. timestamp가 있을 때만 길어야 1초, 없으면 60초 그대로입니다. 커널 문서는 전문가 조언 없이 바꾸지 말라고 적습니다." },
] as const;

const SLOT_CELLS: readonly { key: Slot; label: string; field: "lambda" | "k" | "P" | "T" }[] = [
  { key: "lambda", label: "λ 새 연결/초", field: "lambda" },
  { key: "k", label: "k 목적지", field: "k" },
  { key: "P", label: "P 포트", field: "P" },
  { key: "T", label: "T 초", field: "T" },
];

export default function FixSlotsViz() {
  return (
    <SceneShell
      eyebrow="식의 어느 자리인가"
      title="해법마다 움직이는 자리가 다릅니다"
      description="파란 막대는 상한 k × P ÷ T, 세로 선은 초당 여는 수 λ입니다. 선이 막대 안쪽에 있어야 포트가 모자라지 않습니다. 눈금은 로그라서 한 칸마다 10배입니다."
      note="설명용 계산이며 측정값이 아닙니다."
      ariaLabel="해법별로 도착률과 포트 상한이 어떻게 달라지는지 로그 축 비교"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        const limitX = lx(state.limit);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-1">
              {SLOT_CELLS.map((cell) => {
                const isActive = state.slot === cell.key;
                return (
                  <div
                    key={cell.key}
                    className="min-w-0 rounded-lg border px-1.5 py-1.5"
                    style={{ borderColor: isActive ? "#2563eb" : undefined }}
                  >
                    <p className="text-[11px] leading-4 text-muted-foreground">{cell.label}</p>
                    <p className={`font-mono text-xs sm:text-sm ${isActive ? "font-bold" : ""}`} style={{ color: isActive ? "#2563eb" : undefined }}>{state[cell.field]}</p>
                  </div>
                );
              })}
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={LEFT} y={BAR_Y} width={limitX - LEFT} height={BAR_H} fill="#2563eb" fillOpacity={0.75} />
              {state.atLeast && (
                <g>
                  <rect x={limitX} y={BAR_Y} width={RIGHT - limitX} height={BAR_H} fill="#2563eb" fillOpacity={0.2} stroke="#2563eb" strokeWidth={1} strokeDasharray="2 2" />
                  <polyline points={`${RIGHT - 9},${BAR_Y + 4} ${RIGHT - 3},${BAR_Y + 12} ${RIGHT - 9},${BAR_Y + 20}`} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                </g>
              )}
              <text x={limitX} y={BAR_Y - 8} textAnchor={state.limit > 1000 ? "end" : "middle"} fontSize={11} fontWeight={700} fill="#2563eb">{state.limitLabel}</text>

              {state.singleDigit ? (
                <g>
                  <rect x={lx(1)} y={BAR_Y - 6} width={lx(9) - lx(1)} height={BAR_H + 12} fill="#dc2626" fillOpacity={0.25} stroke="#dc2626" strokeWidth={1} strokeDasharray="2 2" />
                  <text x={lx(9) + 5} y={BAR_Y + 16} fontSize={11} fontWeight={700} fill="#ffffff">λ 한 자릿수 (가정)</text>
                </g>
              ) : (
                <g>
                  <line x1={lx(600)} x2={lx(600)} y1={BAR_Y - 6} y2={BAR_Y + BAR_H + 6} stroke="#dc2626" strokeWidth={1.25} />
                  <text x={lx(600) - 5} y={BAR_Y + BAR_H + 17} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">λ 600</text>
                </g>
              )}

              <line x1={LEFT} x2={RIGHT} y1={BAR_Y + BAR_H + 24} y2={BAR_Y + BAR_H + 24} stroke="#94a3b8" strokeWidth={1} />
              {TICKS.map((tick, index) => (
                <text
                  key={tick.value}
                  x={lx(tick.value)}
                  y={BAR_Y + BAR_H + 38}
                  textAnchor={index === 0 ? "start" : index === TICKS.length - 1 ? "end" : "middle"}
                  fontSize={11}
                  fill="currentColor"
                >
                  {tick.label}
                </text>
              ))}
            </svg>
          </div>
        );
      }}
    />
  );
}
