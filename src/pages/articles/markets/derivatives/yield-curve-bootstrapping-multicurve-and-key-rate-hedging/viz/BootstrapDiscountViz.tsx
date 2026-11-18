import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 100 = 5×0.96 + 105×DF₂ → DF₂ = 95.2÷105 ≈ 0.9067.
 * 가로축 = 시점(오늘·1년·2년), 막대 높이 = 금액(같은 축척). 오늘 칸에 할인한 값이 쌓여 100이 된다.
 * 마지막 장면: 무이표 (1÷0.9067)^(1÷2)−1 ≈ 5.02%, 선도 0.96÷0.9067−1 ≈ 5.88%, 스왑 5%를 각자 묻는 구간 위에 놓는다.
 */
const W = 360;
const H = 222;
const BASE = 188;
const X0 = 58;
const X1 = 185;
const X2 = 308;
const BAR = 34;
const S = 1.3;
const top = (amount: number) => BASE - amount * S;

const DF1 = 0.96;
const PV1 = 5 * DF1;
const REST = 100 - PV1;
const DF2 = REST / 105;
const ZERO = (Math.sqrt(1 / DF2) - 1) * 100;
const FWD = (DF1 / DF2 - 1) * 100;

const SCENES = [
  { label: "지급 두 개를 시점에 놓기", summary: "1년 5 · 2년 105", note: "2년 스왑의 연 고정금리 5%를 명목 100에 적용하면 1년 뒤 5, 2년 뒤 105의 고정 지급이 됩니다. 이 지급 묶음의 오늘 가치를 100으로 둡니다. 막대 높이는 금액입니다." },
  { label: "아는 1년 계수로 먼저 할인", summary: `5 × 0.96 = ${PV1.toFixed(1)}`, note: "할인계수는 미래 1원을 오늘 얼마로 보는지입니다. 1년 무이표채 가격 96에서 1년 할인계수 0.96을 이미 압니다. 첫 지급 5의 오늘값은 4.8입니다." },
  { label: "남은 몫을 마지막 지급이 설명", summary: `${REST.toFixed(1)} ÷ 105 ≈ ${DF2.toFixed(4)}`, note: "100에서 4.8을 빼면 95.2가 남습니다. 이 몫이 2년 뒤 105의 오늘값이어야 하므로 2년 할인계수는 95.2÷105≈0.9067입니다. 4.8과 95.2를 더해 100을 되찾는 것이 4절의 재가격 검사입니다." },
  { label: "같은 두 점, 세 가지 금리", summary: `5% · ${ZERO.toFixed(2)}% · ${FWD.toFixed(2)}%`, note: "스왑 5%는 1년·2년 지급에 함께 쓰는 쿠폰이고, 무이표 5.02%는 2년 뒤 한 번 받는 돈의 연복리 금리, 선도 5.88%는 1년과 2년 사이 한 해만 본 설명용 값(0.96÷0.9067−1)입니다. 묻는 구간이 달라 숫자가 다릅니다." },
] as const;

function Bracket({ x1, x2, y, label, color, dots }: { x1: number; x2: number; y: number; label: string; color: string; dots: readonly number[] }) {
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <line x1={x1} x2={x1} y1={y - 5} y2={y + 5} stroke={color} strokeWidth={1} />
      <line x1={x2} x2={x2} y1={y - 5} y2={y + 5} stroke={color} strokeWidth={1} />
      {dots.map((x) => (
        <circle key={x} cx={x} cy={y} r={4} fill={color} />
      ))}
      <text x={(x1 + x2) / 2} y={y - 9} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function BootstrapDiscountViz() {
  return (
    <SceneShell
      eyebrow="할인계수 부트스트랩"
      title="1년 지급을 먼저 떼어 내면 2년 할인계수가 남습니다"
      description="가로축은 시점, 막대 높이는 금액입니다. 1년 무이표채 가격 96과 2년 스왑 고정금리 5%(명목 100)를 그대로 씁니다. 실제 시장 곡선의 관측값이 아닌 설명용 숫자입니다."
      ariaLabel="2년 스왑 지급 5와 105를 할인해 오늘값 100을 맞추고 2년 할인계수 0.9067을 구한 뒤 스왑금리, 무이표금리, 선도금리를 비교하는 과정"
      scenes={SCENES}
      render={(active) => {
        const rates = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={24} x2={W - 16} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {[
              { x: X0, t: "오늘" },
              { x: X1, t: "1년" },
              { x: X2, t: "2년" },
            ].map((tick) => (
              <g key={tick.t}>
                <line x1={tick.x} x2={tick.x} y1={BASE} y2={BASE + 5} stroke="#94a3b8" strokeWidth={1} />
                <text x={tick.x} y={BASE + 19} textAnchor="middle" fontSize={12} fill="#64748b">{tick.t}</text>
              </g>
            ))}

            {!rates && (
            <g>
              {/* 1년 지급 5 */}
              <rect x={X1 - BAR / 2} y={top(5)} width={BAR} height={5 * S} fill="#64748b" opacity={active >= 1 ? 0.35 : 1} />
              <text x={X1} y={top(5) - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">5</text>
              {/* 2년 지급 105 */}
              <rect x={X2 - BAR / 2} y={top(105)} width={BAR} height={105 * S} fill={active === 2 ? "none" : "#64748b"} stroke="#64748b" strokeWidth={1} opacity={active === 2 ? 1 : 0.85} />
              <text x={X2} y={top(105) - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">105</text>

              {/* 오늘 칸: 100으로 둔 오늘값 */}
              <rect x={X0 - BAR / 2} y={top(100)} width={BAR} height={100 * S} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
              <text x={X0} y={top(100) - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">{active >= 2 ? "4.8 + 95.2 = 100" : "오늘값 100"}</text>

              {active >= 1 && <rect x={X0 - BAR / 2} y={top(PV1)} width={BAR} height={PV1 * S} fill="#16a34a" />}
              {active === 1 && (
                <g>
                  <line x1={X1 - BAR / 2 - 4} x2={X0 + BAR / 2 + 6} y1={BASE - 4} y2={BASE - 4} stroke="#16a34a" strokeWidth={1} markerEnd="url(#bs-arrow)" />
                  <text x={(X0 + X1) / 2 + 4} y={BASE - 14} textAnchor="middle" fontSize={12} fontWeight={700} fill="#16a34a">5 × 0.96 = 4.8</text>
                </g>
              )}
              {active === 2 && (
                <g>
                  <rect x={X0 - BAR / 2} y={top(100)} width={BAR} height={REST * S} fill="#2563eb" />
                  <text x={X0} y={top(52)} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">95.2</text>
                  <line x1={X2 - BAR / 2 - 4} x2={X0 + BAR / 2 + 6} y1={top(70)} y2={top(70)} stroke="#2563eb" strokeWidth={1} markerEnd="url(#bs-arrow)" />
                  <text x={(X0 + X2) / 2 + 8} y={top(70) - 26} textAnchor="middle" fontSize={12} fill="#2563eb">105의 오늘값 = 95.2</text>
                  <text x={(X0 + X2) / 2 + 8} y={top(70) - 9} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">DF₂ = 95.2 ÷ 105 ≈ 0.9067</text>
                </g>
              )}
            </g>
            )}

            {rates && (
              <g>
                <Bracket x1={X0} x2={X2} y={52} label="2년 스왑 고정금리 5% · 해마다 지급" color="#475569" dots={[X1, X2]} />
                <Bracket x1={X0} x2={X2} y={104} label={`2년 무이표금리 ≈ ${ZERO.toFixed(2)}% · 2년에 한 번`} color="#2563eb" dots={[X2]} />
                <Bracket x1={X1} x2={X2} y={156} label={`1→2년 선도 ≈ ${FWD.toFixed(2)}%`} color="#d97706" dots={[X2]} />
              </g>
            )}

            <defs>
              <marker id="bs-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0 0L7 3.5L0 7Z" fill="#64748b" />
              </marker>
            </defs>
          </svg>
        );
      }}
    />
  );
}
