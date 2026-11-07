import SceneShell from "./SceneShell";

/**
 * 본문 대응: #semantic-threshold — cosine 값을 실제 각도로 바꿔 평면에 그린다.
 * 0.99 → 8.1°, 0.95 → 18.2°, 0.90 → 25.8°. 환불 쌍 0.97(도입부 값) → 14.1°.
 * 서울 쌍은 글이 값을 주지 않아 0.92로 가정 → 23.1°.
 */
const SCENES = [
  { label: "τ = 0.99", tau: 0.99, summary: "두 쌍 모두 miss", note: "기준선이 너무 높으면 같은 뜻의 환불 질문도 miss입니다. Semantic cache가 exact-match cache와 다를 바 없어집니다." },
  { label: "τ = 0.95", tau: 0.95, summary: "환불 hit · 서울 miss", note: "0.97인 환불 질문은 부채꼴 안에 들어와 hit입니다. 0.92로 가정한 서울 질문은 밖에 있어 miss이고 다시 계산합니다." },
  { label: "τ = 0.90", tau: 0.9, summary: "두 쌍 모두 hit · 서울은 오답", note: "기준선을 낮추면 부채꼴이 넓어져 hit이 늘어납니다. 뜻이 다른 면적 질문까지 들어오면 저장된 인구 답을 돌려주는 오답이 됩니다. 이 값들은 실측이 아닙니다." },
] as const;

const PANELS = [
  { x: 8, sim: 0.97, value: "0.97", color: "#16a34a", pair: "환불 기간 질문의 두 표현", same: "뜻이 같음" },
  { x: 190, sim: 0.92, value: "0.92(가정)", color: "#dc2626", pair: "서울 인구는? → 서울 면적은?", same: "뜻이 다름" },
] as const;

const R = 150;
const CY = 74;

export default function ThresholdConeViz() {
  return (
    <SceneShell
      eyebrow="기준선의 모양"
      title="Threshold는 저장된 요청 둘레의 부채꼴입니다"
      description="Cosine similarity는 두 vector의 방향이 가까울수록 커지는 값입니다. 이 값을 각도로 옮긴 평면 모식도입니다. 회색 선이 저장된 요청, 색 선이 새 요청, 부채꼴이 기준선 τ(threshold) 안쪽입니다."
      ariaLabel="threshold가 낮아질수록 넓어지는 부채꼴과 두 질문 쌍의 hit 여부"
      scenes={SCENES}
      render={(active) => {
        const tau = SCENES[active].tau;
        const half = Math.acos(tau);
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {PANELS.map((panel) => {
                const angle = Math.acos(panel.sim);
                const inside = panel.sim >= tau;
                const tipX = panel.x + R * Math.cos(angle);
                const tipY = CY - R * Math.sin(angle);
                const wedge = `M${panel.x} ${CY} L${(panel.x + R * Math.cos(half)).toFixed(1)} ${(CY - R * Math.sin(half)).toFixed(1)} A${R} ${R} 0 0 1 ${(panel.x + R * Math.cos(half)).toFixed(1)} ${(CY + R * Math.sin(half)).toFixed(1)} Z`;
                return (
                  <g key={panel.x}>
                    <path d={wedge} fill="#2563eb" fillOpacity={0.12} stroke="#2563eb" strokeWidth={1} />
                    <line x1={panel.x} y1={CY} x2={panel.x + R} y2={CY} stroke="#64748b" strokeWidth={1.25} />
                    <line x1={panel.x} y1={CY} x2={tipX} y2={tipY} stroke={panel.color} strokeWidth={1.25} strokeDasharray={inside ? undefined : "4 3"} />
                    <circle cx={tipX} cy={tipY} r={3.5} fill={panel.color} />
                    <text x={tipX - 2} y={tipY - 7} textAnchor="end" fontSize={12} fontWeight={700} fill={panel.color}>{panel.value}</text>
                  </g>
                );
              })}
            </svg>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs leading-5">
              {PANELS.map((panel) => (
                <div key={panel.x} className="min-w-0">
                  <p className="font-semibold">{panel.pair}</p>
                  <p className="text-muted-foreground">{`${panel.same} · `}<span className="font-bold text-foreground">{panel.sim >= SCENES[active].tau ? "hit" : "miss"}</span></p>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
