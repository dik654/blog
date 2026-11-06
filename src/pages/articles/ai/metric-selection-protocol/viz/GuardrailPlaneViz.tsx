import SceneShell from "./SceneShell";

/**
 * 본문 대응: #guardrails — recall ≥ .80, p95 ≤ 100ms를 모두 통과한 정책끼리만 비용을 비교한다.
 * 가로축 최저 집단 recall, 세로축 p95 지연. 네 정책의 값은 글의 가정이다.
 * P17 .86·92·38 / P24-H .74·91·31 / P24-L .81·91·42 / P29 .83·121·35.
 */
const POLICIES = [
  { id: "P17", recall: 0.86, p95: 92, cost: 38 },
  { id: "P24-H", recall: 0.74, p95: 91, cost: 31 },
  { id: "P24-L", recall: 0.81, p95: 91, cost: 42 },
  { id: "P29", recall: 0.83, p95: 121, cost: 35 },
] as const;

const SCENES = [
  { label: "네 정책과 비용", summary: "비용만 보면 P24-H 31", stage: 0, note: "점 옆 숫자가 1,000건당 비용입니다. 비용만 비교하면 31인 P24-H가 가장 낮습니다." },
  { label: "안전 하한", summary: "recall ≥ .80 → P24-H 탈락", stage: 1, note: "P24-H의 최저 집단 recall은 .74라서 사전 하한 .80을 넘지 못합니다. 비용이 가장 낮아도 여기서 빠집니다." },
  { label: "지연 상한", summary: "p95 ≤ 100ms → P29 탈락", stage: 2, note: "P29는 recall .83이지만 p95가 121ms로 100ms 상한을 넘습니다. 3회 평균 실행으로 지연이 길어진 경우입니다." },
  { label: "남은 칸 안에서만 비교", summary: "38 < 42 → P17 선택", stage: 3, note: "두 기준을 모두 통과한 P17과 P24-L만 비용을 비교합니다. 이 순서 때문에 비용 31인 P24-H가 다시 후보로 들어오지 못합니다." },
] as const;

const W = 360;
const H = 232;
const LEFT = 42;
const RIGHT = 348;
const TOP = 16;
const BOTTOM = 190;
const R_MIN = 0.7;
const R_MAX = 0.9;
const L_MIN = 80;
const L_MAX = 130;
const x = (recall: number) => LEFT + ((recall - R_MIN) / (R_MAX - R_MIN)) * (RIGHT - LEFT);
const y = (p95: number) => BOTTOM - ((p95 - L_MIN) / (L_MAX - L_MIN)) * (BOTTOM - TOP);

const out = (id: string, stage: number) => (stage >= 1 && id === "P24-H") || (stage >= 2 && id === "P29");

export default function GuardrailPlaneViz() {
  return (
    <SceneShell
      eyebrow="필수 기준이 만드는 칸"
      title="비용이 가장 낮은 후보가 왜 먼저 탈락하는가"
      description="recall은 실제 긴급 문의 가운데 잡아낸 비율이고, 최저 집단 recall은 사전에 정한 집단 중 가장 낮은 값입니다. p95는 요청 95%가 이 시간 안에 끝나는 지연 경계입니다. 수치는 validation-v7의 설명용 가정입니다."
      ariaLabel="최저 집단 recall과 p95 지연 평면에 네 정책을 찍고 기준으로 거르는 그림"
      scenes={SCENES}
      render={(active) => {
        const { stage, label, summary } = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${label}: ${summary}`}>
            {stage >= 3 && <rect x={x(0.8)} y={y(100)} width={RIGHT - x(0.8)} height={BOTTOM - y(100)} fill="#2563eb" opacity={0.1} />}
            <line x1={LEFT} x2={RIGHT} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT} x2={LEFT} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            {[0.7, 0.8, 0.9].map((tick) => (
              <text key={tick} x={x(tick)} y={BOTTOM + 15} textAnchor="middle" fontSize={12} fill="#64748b">{tick.toFixed(2).replace("0.", ".")}</text>
            ))}
            {[80, 100, 130].map((tick) => (
              <text key={tick} x={LEFT - 6} y={y(tick) + 4} textAnchor="end" fontSize={12} fill="#64748b">{tick}</text>
            ))}
            <text x={RIGHT} y={BOTTOM + 34} textAnchor="end" fontSize={12} fill="#64748b">최저 집단 recall (오른쪽이 더 많이 잡음)</text>
            <text x={LEFT + 6} y={TOP + 4} fontSize={12} fill="#64748b">p95 ms (위가 더 느림)</text>
            {stage >= 1 && <line x1={x(0.8)} x2={x(0.8)} y1={TOP} y2={BOTTOM} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />}
            {stage >= 2 && <line x1={LEFT} x2={RIGHT} y1={y(100)} y2={y(100)} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />}
            {POLICIES.map((policy) => {
              const px = x(policy.recall);
              const py = y(policy.p95);
              const gone = out(policy.id, stage);
              const chosen = stage >= 3 && policy.id === "P17";
              const color = gone ? "#94a3b8" : chosen ? "#2563eb" : "#475569";
              return (
                <g key={policy.id}>
                  {gone ? (
                    <path d={`M${px - 5} ${py - 5} L${px + 5} ${py + 5} M${px + 5} ${py - 5} L${px - 5} ${py + 5}`} stroke={color} strokeWidth={1.25} />
                  ) : (
                    <circle cx={px} cy={py} r={chosen ? 6 : 5} fill={color} />
                  )}
                  <text x={policy.id === "P24-L" ? px - 8 : px} y={policy.id === "P24-L" ? py + 19 : py - 11} textAnchor={policy.id === "P24-L" ? "start" : "middle"} fontSize={12} fontWeight={700} fill={gone ? "#94a3b8" : chosen ? "#2563eb" : "#64748b"}>
                    {`${policy.id} · ${policy.cost}${gone ? " 탈락" : chosen ? " 선택" : ""}`}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
