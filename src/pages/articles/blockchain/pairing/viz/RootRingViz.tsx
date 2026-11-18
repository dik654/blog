import SceneShell from "./SceneShell";

/**
 * 본문 대응: #final-exponent — 0 아닌 원소 360개를 72제곱하면 다섯제곱이 1인 다섯 값으로 모입니다.
 * g=7+3u, g²=2+4u, g³=2+15u, g⁴=7+16u, g⁵=1 (19로 나누고 u²=−1로 직접 곱해 계산).
 * 각 출력에 72개씩 대응(360개 전수 계산). g의 72승 = g^(72 mod 5) = g².
 */
const OUTS = [
  { name: "1", value: "1" },
  { name: "g", value: "7+3u" },
  { name: "g²", value: "2+4u" },
  { name: "g³", value: "2+15u" },
  { name: "g⁴", value: "7+16u" },
] as const;

const SCENES = [
  { label: "360개를 다섯 묶음으로", summary: "360 = 5 × 72", note: "0이 아닌 원소 360개를 모두 72제곱하면 다섯 값에 정확히 72개씩 모입니다. 다섯 값은 모두 다섯제곱하면 1입니다." },
  { label: "f₅의 72승", summary: "15+14u → 7+3u = g", note: "Miller 반복이 남긴 f₅=15+14u는 g=7+3u 묶음에 들어갑니다. g≠1이고 g⁵=1인데 5가 소수이므로 출력의 위수는 정확히 5입니다." },
  { label: "g에 72승을 또 하면", summary: "72 ≡ 2 (mod 5) → g²", note: "g의 72제곱은 1에서 고리를 72칸 도는 것입니다. 14바퀴 뒤 2칸이 남아 g²=2+4u에 멈추므로 처음 g와 다릅니다." },
  { label: "0은 고리 밖", summary: "0의 72승 = 0", note: "0은 72제곱해도 0이며 곱셈 군의 원소가 아닙니다. 360개 묶음에도 고리에도 들어가지 않습니다." },
] as const;

const W = 360;
const H = 232;
const CX = 250;
const CY = 112;
const R = 76;
const ang = (k: number) => -Math.PI / 2 + (2 * Math.PI * k) / 5;
const px = (k: number) => CX + R * Math.cos(ang(k));
const py = (k: number) => CY + R * Math.sin(ang(k));
const BAR_X = 18;
const BAR_W = 92;
const BLOCK_H = 34;
const BAR_TOP = 26;

export default function RootRingViz() {
  return (
    <SceneShell
      eyebrow="마지막 거듭제곱"
      title="72제곱은 모든 값을 다섯 칸짜리 고리로 보냅니다"
      description="왼쪽 막대는 19²개 원소 중 0을 뺀 360개, 오른쪽 고리는 다섯제곱하면 1이 되는 다섯 값입니다. 고리를 한 칸 도는 것이 g를 한 번 곱하는 것입니다. 원 모양은 이 순환을 보이기 위한 배치입니다."
      ariaLabel="360개 원소가 72제곱으로 다섯 출력에 72개씩 모이고, g의 72승은 g²가 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const hi = active === 1 ? 1 : active === 2 ? 2 : -1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={BAR_X} y={BAR_TOP - 10} fontSize={11} fill={active === 1 ? "#1d4ed8" : "#475569"}>{active === 1 ? "f₅=15+14u는 g 묶음" : "0 아닌 원소 360개"}</text>
            {OUTS.map((o, k) => {
              const y = BAR_TOP + k * (BLOCK_H + 4);
              const lit = active === 0 || (active === 1 && k === 1);
              return (
                <g key={o.name} opacity={active === 3 ? 0.35 : lit ? 1 : 0.4}>
                  <rect x={BAR_X} y={y} width={BAR_W} height={BLOCK_H} rx={4} fill={active === 1 && k === 1 ? "#93c5fd" : "#e2e8f0"} stroke="#94a3b8" strokeWidth={1} />
                  <text x={BAR_X + BAR_W / 2} y={y + 21} textAnchor="middle" fontSize={11} fill="#334155">72개 → {o.name}</text>
                </g>
              );
            })}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#cbd5e1" strokeWidth={1} />
            {active === 2 && (
              <path d={`M ${px(0)} ${py(0)} A ${R} ${R} 0 0 1 ${px(2)} ${py(2)}`} fill="none" stroke="#2563eb" strokeWidth={1.25} strokeDasharray="4 3" />
            )}
            {OUTS.map((o, k) => {
              const on = hi === k;
              return (
                <g key={o.name} opacity={active === 3 ? 0.35 : 1}>
                  <circle cx={px(k)} cy={py(k)} r={20} fill={on ? "#dbeafe" : "#ffffff"} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  <text x={px(k)} y={py(k) - 2} textAnchor="middle" fontSize={11} fontWeight={700} fill={on ? "#1d4ed8" : "#334155"}>{o.name}</text>
                  <text x={px(k)} y={py(k) + 10} textAnchor="middle" fontSize={8} fill="#475569">{o.value}</text>
                </g>
              );
            })}
            {active === 2 && <text x={CX} y={CY + 4} textAnchor="middle" fontSize={10} fill="#1d4ed8">72칸 = 14바퀴 + 2칸</text>}
            {active === 1 && <text x={CX} y={CY + 4} textAnchor="middle" fontSize={10} fill="#1d4ed8">g ≠ 1, g⁵ = 1</text>}
            {active === 3 && (
              <g>
                <rect x={CX - 40} y={CY - 16} width={80} height={32} rx={6} fill="#ffffff" stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
                <text x={CX} y={CY + 4} textAnchor="middle" fontSize={11} fill="#b91c1c">0 → 0 (밖)</text>
              </g>
            )}
            <text x={CX} y={H - 8} textAnchor="middle" fontSize={10} fill="#64748b">한 칸 = g를 한 번 곱함</text>
          </svg>
        );
      }}
    />
  );
}
