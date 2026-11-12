import SceneShell from "./SceneShell";

/**
 * 본문 대응: "질문: risk가 0에서 1로 커질 때 얼마만큼 낮춥니까?"
 * S(r)=1-(1-m)·log(1+(s-1)r)/log s, m=0.5.
 * r=0.5에서 s=2 → 0.708, s=10 → 0.630(본문 예), s=100 → 0.574.
 * s=2·100과 "같은 계수 0.5"는 비교용 가정입니다.
 */
const M = 0.5;
const scale = (r: number, s: number) => 1 - (1 - M) * (Math.log(1 + (s - 1) * r) / Math.log(s));

const W = 360;
const H = 210;
const X0 = 44;
const X1 = 340;
const Y_TOP = 16;
const Y_BASE = 170;
const S_MIN = 0.4;
const S_MAX = 1.05;
const px = (r: number) => X0 + r * (X1 - X0);
const py = (value: number) => Y_BASE - ((value - S_MIN) / (S_MAX - S_MIN)) * (Y_BASE - Y_TOP);

const SAMPLES = Array.from({ length: 61 }, (_, index) => index / 60);
const curvePath = (s: number) =>
  SAMPLES.map((r, index) => `${index === 0 ? "M" : "L"}${px(r).toFixed(1)},${py(scale(r, s)).toFixed(1)}`).join(" ");

const CURVES = [
  { s: 2, color: "#94a3b8", label: "s=2 (가정)" },
  { s: 10, color: "#2563eb", label: "s=10 (본문 예)" },
  { s: 100, color: "#d97706", label: "s=100 (가정)" },
] as const;

const SCENES = [
  {
    label: "모든 관련 token에 같은 계수",
    summary: "r=0.1도 r=1도 0.5배 (가정)",
    note: "관련 token 전체에 같은 계수(여기서는 0.5로 가정)를 곱하면, risk가 조금 있는 subword 조각과 명백한 목표 문자가 똑같이 깎입니다. 가로축 r은 token이 목표 문자군으로 decode될 위험도, 세로축 S는 lm_head 행에 곱할 배율입니다.",
  },
  {
    label: "로그 곡선 · s=10",
    summary: "r=0.5 → S≈0.630",
    note: "논문 곡선은 r=0이면 1(그대로), r=1이면 min_scale m=0.5에서 멈춥니다. 그 사이는 smoothness s가 휘는 정도를 정하며, s=10에서 r=0.5면 1−0.5·0.74≈0.630입니다. 가장 위험한 token도 0이 아니라 0.5배까지만 내려갑니다.",
  },
  {
    label: "s를 바꾸면",
    summary: "r=0.5: 0.708 · 0.630 · 0.574",
    note: "양 끝점 1과 m은 그대로이고 중간만 달라집니다. s가 클수록 중간 risk에서 배율이 더 빨리 m 쪽으로 내려갑니다. s=2와 s=100은 비교를 위한 가정값이며, 어느 값이 적절한지는 suppression·정확도·정상 번역 보존 결과로 정해야 합니다.",
  },
] as const;

export default function ScaleCurveViz() {
  return (
    <SceneShell
      eyebrow="risk → 행 배율"
      title="risk가 커질수록 배율이 1에서 min_scale까지 휘며 내려갑니다"
      description="가로축은 token risk r(0~1), 세로축은 그 token의 lm_head 행에 곱할 배율 S입니다. 점선 m은 min_scale, 곧 risk가 1인 token에도 남겨 둘 배율의 하한이며 0.5는 본문 예시 값입니다."
      note="S는 weight 배율이며, token의 생성 확률이 같은 비율로 줄어든다는 뜻이 아닙니다."
      ariaLabel="token risk에 따른 lm_head 행 배율 곡선 비교"
      scenes={SCENES}
      controlLabels={["같은 계수", "s=10", "s 비교"]}
      render={(active) => {
        const shown: readonly (typeof CURVES)[number][] = active === 0 ? [] : active === 1 ? CURVES.filter((curve) => curve.s === 10) : CURVES;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {[0.5, 0.75, 1].map((tick) => (
                <g key={tick}>
                  <line x1={X0} x2={X1} y1={py(tick)} y2={py(tick)} stroke="#e2e8f0" strokeWidth={1} />
                  <text x={X0 - 6} y={py(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">{tick.toFixed(2)}</text>
                </g>
              ))}
              {[0, 0.5, 1].map((tick) => (
                <text key={tick} x={px(tick)} y={Y_BASE + 16} textAnchor="middle" fontSize={10} fill="#64748b">{`r=${tick}`}</text>
              ))}
              <line x1={X0} x2={X1} y1={Y_BASE} y2={Y_BASE} stroke="#94a3b8" strokeWidth={1} />
              <line x1={X0} x2={X0} y1={Y_TOP} y2={Y_BASE} stroke="#94a3b8" strokeWidth={1} />
              <text x={X1} y={Y_BASE + 32} textAnchor="end" fontSize={10} fill="#64748b">token risk r →</text>
              <text x={X0 + 4} y={Y_TOP + 2} fontSize={10} fill="#64748b">배율 S</text>
              <line x1={X0} x2={X1} y1={py(M)} y2={py(M)} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
              <text x={X1} y={py(M) + 13} textAnchor="end" fontSize={10} fill="#64748b">min_scale m=0.5</text>

              {active === 0 && (
                <g>
                  <circle cx={px(0)} cy={py(1)} r={3.5} fill="#2563eb" />
                  <line x1={px(0.02)} x2={X1} y1={py(M)} y2={py(M)} stroke="#dc2626" strokeWidth={1.25} />
                  <circle cx={px(0.1)} cy={py(M)} r={3.5} fill="#dc2626" />
                  <circle cx={px(1)} cy={py(M)} r={3.5} fill="#dc2626" />
                  <text x={px(0.1)} y={py(M) - 8} textAnchor="middle" fontSize={10} fill="#dc2626">r=0.1</text>
                  <text x={px(1) - 4} y={py(M) - 8} textAnchor="end" fontSize={10} fill="#dc2626">r=1</text>
                  <text x={px(0) + 8} y={py(1) + 4} fontSize={10} fill="#2563eb">r=0: 관련 없음, 1배</text>
                </g>
              )}

              {shown.map((curve) => (
                <path key={curve.s} d={curvePath(curve.s)} fill="none" stroke={curve.color} strokeWidth={1.25} />
              ))}
              {shown.map((curve) => (
                <circle key={`p-${curve.s}`} cx={px(0.5)} cy={py(scale(0.5, curve.s))} r={3.5} fill={curve.color} />
              ))}
              {active === 1 && (
                <g>
                  <line x1={px(0.5)} x2={px(0.5)} y1={py(scale(0.5, 10))} y2={Y_BASE} stroke="#2563eb" strokeWidth={1} strokeDasharray="2 3" />
                  <text x={px(0.5) + 8} y={py(scale(0.5, 10)) - 6} fontSize={11} fontWeight={700} fill="#2563eb">S≈0.630</text>
                  <text x={px(0) + 8} y={py(1) + 14} fontSize={10} fill="#2563eb">S(0)=1</text>
                  <text x={px(1) - 4} y={py(M) - 8} textAnchor="end" fontSize={10} fill="#2563eb">S(1)=m</text>
                </g>
              )}
            </svg>
            <div className="mt-2 flex flex-col gap-1 text-xs sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5">
              {CURVES.map((curve) => {
                const visible = shown.some((item) => item.s === curve.s);
                return (
                  <span key={curve.s} className={`flex items-center gap-2 whitespace-nowrap ${visible ? "" : "invisible"}`}>
                    <span className="inline-block h-0.5 w-5" style={{ backgroundColor: curve.color }} />
                    <span>{curve.label}</span>
                    <span className="font-mono font-bold">r=0.5 → {scale(0.5, curve.s).toFixed(3)}</span>
                  </span>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
