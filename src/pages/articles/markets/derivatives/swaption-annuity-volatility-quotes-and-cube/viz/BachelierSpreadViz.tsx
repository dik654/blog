import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 아래 Bachelier 식 — 외가격 지급 스왑션이 왜 0보다 비싼가.
 * 만기 선도금리 ~ 정규분포(중심 4.00%, 표준편차 70bp×√0.25 = 35bp), 행사가 4.10%(+10bp).
 * d = −10/35 = −0.2857, Φ(d) = 0.3875(행사가 위로 갈 확률), φ(d) = 0.3830.
 * −10×0.3875 = −3.88bp, 35×0.3830 = 13.40bp, 합 9.53bp.
 * 현금: 1억×8.5 = 8.5억 → −3.88bp ≈ −33만, 13.40bp ≈ +114만, 9.53bp ≈ 81만 원. 선도 기준 차이 −10bp ≈ −85만 원.
 */
const SD = 35;
const K = 10;
const X0 = 24;
const X1 = 336;
const BASE = 150;
const PEAK = 112;
const RANGE = 105; // ±3σ
const px = (bp: number) => X0 + ((bp + RANGE) / (2 * RANGE)) * (X1 - X0);
const density = (bp: number) => Math.exp(-0.5 * (bp / SD) ** 2);
const py = (bp: number) => BASE - density(bp) * PEAK;
const STEPS = 84;
const CURVE = Array.from({ length: STEPS + 1 }, (_, i) => -RANGE + (2 * RANGE * i) / STEPS);
const CURVE_PATH = CURVE.map((bp, i) => `${i === 0 ? "M" : "L"} ${px(bp).toFixed(1)} ${py(bp).toFixed(1)}`).join(" ");
const TAIL = CURVE.filter((bp) => bp >= K);
const TAIL_PATH = `M ${px(K).toFixed(1)} ${BASE} L ${px(K).toFixed(1)} ${py(K).toFixed(1)} ${TAIL.map((bp) => `L ${px(bp).toFixed(1)} ${py(bp).toFixed(1)}`).join(" ")} L ${px(RANGE).toFixed(1)} ${BASE} Z`;

const BLUE = "#2563eb";
const GRAY = "#64748b";
const LINE = "#94a3b8";
const AMBER = "#d97706";
const GREEN = "#16a34a";

const PARTS = [
  { label: "선도 기준 내재가치 몫", bp: -3.88, won: "−33만 원", color: AMBER },
  { label: "남은 3개월 흔들림 몫", bp: 13.4, won: "+114만 원", color: GREEN },
  { label: "합: 프리미엄", bp: 9.53, won: "≈ 81만 원", color: BLUE },
] as const;
const BAR_SCALE = 15; // bp

const SCENES = [
  { label: "만기 때 선도금리의 퍼짐", summary: "중심 4.00% · 표준편차 35bp", step: 0, note: "normal 변동성 70bp(가정)를 3개월로 줄이면 70×√0.25 = 35bp입니다. 오늘 4.00%인 선도금리가 만기에 이 폭으로 흩어진다고 봅니다." },
  { label: "행사가 오른쪽만 행사", summary: "4.10% 위로 갈 확률 38.75%", step: 1, note: "지급 스왑션은 만기 금리가 4.10%보다 높을 때만 행사합니다. 오늘 선도 4.00%가 행사가보다 10bp 낮아 지금 상태로는 행사 이득이 없는 외가격입니다. d = −10/35 = −0.2857이고, 표준정규 누적확률 Φ(d) = 0.3875가 색칠한 면적입니다." },
  { label: "두 몫의 합", summary: "−3.88 + 13.40 = 9.53bp", step: 2, note: "내재가치 몫은 −10×0.3875 = −3.88bp, 흔들림 몫은 35×φ(d) = 35×0.3830 = 13.40bp입니다(φ: 표준정규 밀도). 흔들림 몫이 더 커서 합이 양수입니다." },
  { label: "현금으로 옮기기", summary: "1억 × 8.5 × 9.53bp ≈ 81만 원", step: 3, note: "bp 값에 1억×8.5를 곱하면 약 81만 원입니다. 3절의 85만 원은 행사가 차이 10bp를 옮긴 값이고 이 스왑션에는 불리한 쪽입니다." },
] as const;

export default function BachelierSpreadViz() {
  return (
    <SceneShell
      eyebrow="Bachelier 한 점"
      title="외가격 지급 스왑션도 흔들림 때문에 값이 생깁니다"
      description="가로축은 만기 때 선도스왑금리가 오늘의 4.00%에서 몇 bp 움직였는지입니다. 명목 1억·연금계수 8.5·normal 70bp는 글의 가정입니다."
      ariaLabel="만기 선도금리의 정규분포, 행사가 위 면적, 두 몫의 합과 현금 환산"
      scenes={SCENES}
      render={(active) => {
        const step = SCENES[active].step;
        const showBars = step >= 2;
        return (
          <svg viewBox="0 0 360 250" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g opacity={showBars ? 0.35 : 1}>
              {step >= 1 && <path d={TAIL_PATH} fill={BLUE} opacity={0.25} />}
              <path d={CURVE_PATH} fill="none" stroke={GRAY} strokeWidth={1.25} />
              <line x1={X0} x2={X1} y1={BASE} y2={BASE} stroke={LINE} strokeWidth={1} />
              {[-SD, SD].map((bp) => (
                <g key={bp}>
                  <line x1={px(bp)} x2={px(bp)} y1={py(bp)} y2={BASE} stroke={LINE} strokeWidth={1} strokeDasharray="2 2" />
                  <text x={px(bp)} y={BASE + 13} textAnchor="middle" fontSize={10.5} fill={GRAY}>{bp > 0 ? "+35bp" : "−35bp"}</text>
                </g>
              ))}
              <line x1={px(0)} x2={px(0)} y1={BASE - PEAK - 6} y2={BASE} stroke={GRAY} strokeWidth={1} />
              <text x={px(0)} y={BASE + 26} textAnchor="middle" fontSize={11} fontWeight={700} fill={GRAY}>선도 4.00%</text>
              <line x1={px(K)} x2={px(K)} y1={BASE - PEAK - 6} y2={BASE} stroke={BLUE} strokeWidth={1.25} />
              <text x={px(K) + 4} y={BASE - PEAK - 8} fontSize={11} fontWeight={700} fill={BLUE}>행사가 4.10%</text>
              {step >= 1 && (
                <text x={px(40)} y={70} textAnchor="start" fontSize={11.5} fontWeight={700} fill={BLUE}>행사 확률 38.75%</text>
              )}
            </g>
            {showBars && (
              <g>
                <line x1={px(0)} x2={px(0)} y1={180} y2={246} stroke={LINE} strokeWidth={1} />
                {PARTS.map((part, i) => {
                  const y = 184 + i * 22;
                  const w = (Math.abs(part.bp) / BAR_SCALE) * 120;
                  const x = part.bp < 0 ? px(0) - w : px(0);
                  return (
                    <g key={part.label}>
                      <rect x={x} y={y} width={w} height={14} rx={2} fill={part.color} opacity={0.85} />
                      <text x={part.bp < 0 ? px(0) + 4 : X0} y={y + 11} textAnchor="start" fontSize={11} fontWeight={i === 2 ? 700 : 400} fill={GRAY}>
                        {part.bp < 0 ? part.label : ""}
                      </text>
                      <text x={part.bp < 0 ? x - 4 : x + w + 4} y={y + 11} textAnchor={part.bp < 0 ? "end" : "start"} fontSize={11} fontWeight={700} fill={part.color}>
                        {step === 3 ? part.won : `${part.bp > 0 ? "+" : "−"}${Math.abs(part.bp).toFixed(2)}bp`}
                      </text>
                      {part.bp > 0 && (
                        <text x={px(0) - 4} y={y + 11} textAnchor="end" fontSize={11} fontWeight={i === 2 ? 700 : 400} fill={GRAY}>{part.label}</text>
                      )}
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
