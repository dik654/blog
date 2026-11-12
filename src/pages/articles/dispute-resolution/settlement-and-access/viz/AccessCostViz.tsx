import SceneShell from "./SceneShell";

/**
 * 본문 대응: #access — M의 부담 C_M이 3 → 8(백만원)으로 늘면 R_M = 0.90×0.70×12 − C_M 이 4.56 → −0.44.
 * 이미 시작된 협상에서는 범위가 −44만~848만원으로 넓어질 수 있지만, 대안값이 음수라 단순 모형상 소송을 시작하지 않는 편이 낫다.
 */
const EXPECTED = 0.9 * 0.7 * 12;
const V_MAX = 8.48;

const SCENES = [
  { label: "부담 300만원", cost: 3, summary: "M 최저선 456만원", note: "0.90×0.70×12−3=4.56입니다. M의 최저선이 0보다 위에 있어, 456만원보다 낮은 제안을 받으면 재판으로 가겠다는 선택이 M에게 실제 대안이 됩니다." },
  { label: "부담 800만원", cost: 8, summary: "M 최저선 456만 → −44만원", note: "자료 확보와 대리 비용 때문에 부담이 800만원이 되면 0.90×0.70×12−8=−0.44입니다. 이미 협상이 시작됐다면 M의 최저선이 내려가 V의 최고선 848만원까지의 범위가 오히려 넓어질 수 있습니다." },
  { label: "시작 여부까지 보면", cost: 8, summary: "재판 대안값 −44만원 < 0", note: "재판해서 남는 값이 음수라 이 단순 모형에서는 소송을 시작하지 않는 편이 낫습니다. V가 이를 알면 더 낮은 제안을 하거나 아무것도 제안하지 않을 수 있습니다." },
] as const;

const W = 360;
const H = 150;
const LEFT = 20;
const RIGHT = 340;
const MIN_V = -2;
const MAX_V = 12;
const AXIS_Y = 92;
const x = (value: number) => LEFT + ((value - MIN_V) / (MAX_V - MIN_V)) * (RIGHT - LEFT);
const TICKS = [0, 3, 6, 9, 12] as const;

const OWNER = "#0284c7";
const VENDOR = "#d97706";
const OVERLAP = "#059669";
const DANGER = "#dc2626";
const MUTED = "#64748b";

export default function AccessCostViz() {
  return (
    <SceneShell
      eyebrow="접근 비용"
      title="범위가 넓어져도 M의 재판 대안은 약해집니다"
      description="가로축은 금액(백만원)입니다. 승소 전망 70%·60%, 판결액 1,200만원, 시간 할인 0.90, V 부담 200만원은 그대로 두고 M의 부담만 바꿉니다(가정)."
      ariaLabel="M의 소송부담이 늘 때 합의 범위와 소송 시작 여부가 어떻게 달라지는지 보는 도식"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const m = Math.round((EXPECTED - scene.cost) * 100) / 100;
        const negative = m < 0;
        const startView = active === 2;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <rect
                x={x(m)}
                y={AXIS_Y - 14}
                width={x(V_MAX) - x(m)}
                height={28}
                rx={4}
                fill={startView ? "#64748b10" : "#05966922"}
                stroke={startView ? "#94a3b8" : OVERLAP}
                strokeWidth={1}
                strokeDasharray={startView ? "4 3" : undefined}
              />
              <text x={(x(Math.max(m, 0)) + x(V_MAX)) / 2} y={AXIS_Y + 34} textAnchor="middle" fontSize={12} fontWeight={700} fill={startView ? MUTED : OVERLAP}>
                {startView ? "재판 대안이 약해짐" : negative ? "범위가 아래로 넓어짐" : "합의 가능 범위"}
              </text>
              {startView && (
                <g>
                  <rect x={x(-2)} y={AXIS_Y - 14} width={x(0) - x(-2)} height={28} fill="#dc262614" />
                  <text x={x(-1)} y={AXIS_Y + 34} textAnchor="middle" fontSize={11} fontWeight={700} fill={DANGER}>0 미만</text>
                </g>
              )}
              <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(tick)} y={AXIS_Y + 52} textAnchor="middle" fontSize={11} fill={MUTED}>{tick}</text>
                </g>
              ))}
              <line x1={x(0)} x2={x(0)} y1={AXIS_Y - 22} y2={AXIS_Y + 22} stroke="#475569" strokeWidth={1} />
              {negative && <line x1={x(4.56)} x2={x(4.56)} y1={30} y2={AXIS_Y + 14} stroke={OWNER} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />}
              <line x1={x(m)} x2={x(m)} y1={30} y2={AXIS_Y + 14} stroke={negative ? DANGER : OWNER} strokeWidth={1.25} />
              <text x={x(m)} y={22} textAnchor="start" dx={-4} fontSize={12} fontWeight={700} fill={negative ? DANGER : OWNER}>
                {negative ? "M 최저 −44만 (전 456만)" : "M 최저 456만"}
              </text>
              <line x1={x(V_MAX)} x2={x(V_MAX)} y1={48} y2={AXIS_Y + 14} stroke={VENDOR} strokeWidth={1.25} />
              <text x={x(V_MAX)} y={44} textAnchor="start" dx={-4} fontSize={12} fontWeight={700} fill={VENDOR}>V 최고 848만</text>
            </svg>
            <div className="mt-2 grid gap-1 font-mono text-xs leading-6 sm:grid-cols-2 sm:text-sm">
              <span style={{ color: negative ? DANGER : OWNER }}>{`M: 0.90×0.70×12−${scene.cost} = ${m.toFixed(2)}`}</span>
              <span style={{ color: VENDOR }}>V: 0.90×0.60×12+2 = 8.48</span>
            </div>
          </div>
        );
      }}
    />
  );
}
