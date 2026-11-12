import V2SceneShell from "./V2SceneShell";

/**
 * 본문 대응: #swap-trace — 1000·1000 풀에 A100 입력.
 * 조정 A = 1100 − 100×0.003 = 1099.7, 정상 출력 뒤 B = 909.338911 → 조정 곱 ≈ 1000000.0004 (통과).
 * B100을 잘못 요청하면 1099.7 × 900 = 989730 < 1000000 (실패).
 */
const K = 1_000_000;
const X_MIN = 950;
const X_MAX = 1150;
const Y_MIN = 860;
const Y_MAX = 1060;

const W = 360;
const H = 236;
const L = 46;
const R = 346;
const T = 28;
const B = 200;

const px = (x: number) => L + ((x - X_MIN) / (X_MAX - X_MIN)) * (R - L);
const py = (y: number) => B - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (B - T);

const CURVE = Array.from({ length: 41 }, (_, i) => {
  const x = X_MIN + (i * (X_MAX - X_MIN)) / 40;
  return `${px(x).toFixed(1)},${py(K / x).toFixed(1)}`;
}).join(" ");
const PASS_AREA = `${px(X_MIN)},${T} ${CURVE} ${px(X_MAX)},${T}`;
const FAIL_AREA = `${px(X_MIN)},${B} ${CURVE} ${px(X_MAX)},${B}`;

const START = { x: 1000, y: 1000 };
const OK = { x: 1099.7, y: 909.338911 };
const WRONG = { x: 1099.7, y: 900 };

const SCENES = [
  {
    label: "거래 전",
    summary: "1000 × 1000 = 1,000,000",
    note: "곡선은 두 잔액의 곱이 거래 전과 같은 1,000,000인 점들입니다. 거래 뒤 점이 곡선 위쪽(초록)에 있으면 검사를 통과하고 아래쪽(빨강)이면 그 호출이 실패합니다.",
  },
  {
    label: "B 90.661089 출력",
    summary: "1099.7 × 909.338911 ≈ 1,000,000.0004",
    note: "가로축은 실제 A 1100에서 입력 100의 0.3%를 뺀 조정 A 1099.7을 씁니다. 정상 출력이면 점이 경계 곡선에 거의 붙은 채 곱이 1,000,000 이상이라 통과합니다. 조정하지 않은 실제 A 1100으로 곱하면 약 1,000,272.8로 더 큽니다.",
  },
  {
    label: "B 100 출력 요청",
    summary: "1099.7 × 900 = 989,730",
    note: "B를 100개 빼면 남은 B는 900이고 점이 곡선 아래로 내려갑니다. 989,730은 1,000,000보다 작으므로 Pair의 검사에서 실패합니다. 1대1로 100개를 빼는 계산이 틀린 이유입니다.",
  },
] as const;

function Dot({ x, y, color, label, anchor = "start", dy = -8 }: { x: number; y: number; color: string; label: string; anchor?: "start" | "end"; dy?: number }) {
  return (
    <g>
      <circle cx={px(x)} cy={py(y)} r={4} fill={color} />
      <text x={px(x) + (anchor === "start" ? 7 : -7)} y={py(y) + dy} textAnchor={anchor} fontSize={10} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function SwapProductCheckViz() {
  return (
    <V2SceneShell
      eyebrow="조정 곱 검사"
      title="거래 뒤 잔액이 곡선 위에 남아야 통과합니다"
      description="가로축은 수수료를 뺀 조정 A, 세로축은 남은 B입니다. 3절과 7절의 1000·1000 풀에 A 100을 넣는 산술 예이며 축은 950~1150, 860~1060 구간만 확대했습니다."
      ariaLabel="잔액의 곱 1,000,000 경계와 정상 출력, 잘못된 B 100 출력 요청의 위치 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <polygon points={PASS_AREA} fill="#16a34a" opacity={0.08} />
          <polygon points={FAIL_AREA} fill="#dc2626" opacity={0.08} />
          <polyline points={CURVE} fill="none" stroke="#64748b" strokeWidth={1.25} />
          <text x={L} y={13} fontSize={10} fill="#475569">회색 곡선: 조정 A × 남은 B = 1,000,000</text>
          <text x={R - 4} y={T + 12} textAnchor="end" fontSize={10} fill="#15803d">통과 영역</text>
          <text x={L + 6} y={B - 6} fontSize={10} fill="#b91c1c">실패 영역</text>
          <line x1={L} x2={R} y1={B} y2={B} stroke="#94a3b8" strokeWidth={1} />
          <line x1={L} x2={L} y1={T} y2={B} stroke="#94a3b8" strokeWidth={1} />
          {[1000, 1100].map((x) => (
            <g key={x}>
              <line x1={px(x)} x2={px(x)} y1={B} y2={B + 4} stroke="#94a3b8" strokeWidth={1} />
              <text x={px(x)} y={B + 15} textAnchor="middle" fontSize={9} fill="#64748b">{x}</text>
            </g>
          ))}
          {[900, 1000].map((y) => (
            <g key={y}>
              <line x1={L - 4} x2={L} y1={py(y)} y2={py(y)} stroke="#94a3b8" strokeWidth={1} />
              <text x={L - 7} y={py(y) + 3} textAnchor="end" fontSize={9} fill="#64748b">{y}</text>
            </g>
          ))}
          <text x={(L + R) / 2} y={H - 4} textAnchor="middle" fontSize={9} fill="#64748b">조정 A (실제 A − 입력 × 0.3%)</text>
          <text x={10} y={(T + B) / 2} fontSize={9} fill="#64748b" transform={`rotate(-90 10 ${(T + B) / 2})`} textAnchor="middle">남은 B</text>
          <Dot x={START.x} y={START.y} color={active === 0 ? "#2563eb" : "#94a3b8"} label="거래 전 1000·1000" />
          {active === 1 && (
            <>
              <line x1={px(START.x)} y1={py(START.y)} x2={px(OK.x)} y2={py(OK.y)} stroke="#16a34a" strokeWidth={1} strokeDasharray="3 3" />
              <Dot x={OK.x} y={OK.y} color="#15803d" label="1099.7 · 909.339" anchor="end" dy={-9} />
            </>
          )}
          {active === 2 && (
            <>
              <line x1={px(START.x)} y1={py(START.y)} x2={px(WRONG.x)} y2={py(WRONG.y)} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={px(OK.x)} cy={py(OK.y)} r={3} fill="none" stroke="#15803d" strokeWidth={1} />
              <Dot x={WRONG.x} y={WRONG.y} color="#b91c1c" label="1099.7 · 900" anchor="end" dy={14} />
            </>
          )}
        </svg>
      )}
    />
  );
}
