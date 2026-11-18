import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundaries — 네 줄의 평가점 1→22→96→75→1 (22⁴ ≡ 1 mod 97).
 * 올바른 표의 누적값 Z: 1, 50, 67, 76, 그리고 마지막 줄 비율을 곱하면 1로 닫힘 (#permutation 표).
 * 틀린 표: 76·67/14 ≡ 45 ≠ 1. Z(1)=1을 빼면 모든 값 0이 재귀식을 만족합니다.
 */
const PTS = [1, 22, 96, 75] as const;

type Scene = { label: string; summary: string; note: string; z: readonly string[]; closing: string; closeOk: boolean | null; badEdge: number };
const SCENES: readonly Scene[] = [
  { label: "22를 곱하면 다음 줄", summary: "1 → 22 → 96 → 75 → 1", z: ["", "", "", ""], closing: "22⁴ = 1", closeOk: null, badEdge: -1, note: "Z(X)의 다음 줄은 Z(22X)입니다. 22⁴=1이므로 마지막 줄 75의 다음은 다시 첫 점 1입니다." },
  { label: "두 조건을 모두 둘 때", summary: "Z: 1 → 50 → 67 → 76 → 1", z: ["1", "50", "67", "76"], closing: "76 × 64/14 = 1", closeOk: true, badEdge: -1, note: "Z(1)=1에서 출발해 네 화살표 모두에서 Z(X)U(X)−Z(22X)D(X)=0을 검사하면 곱이 1로 닫힙니다." },
  { label: "Z(1)=1을 빼면", summary: "Z = 0, 0, 0, 0도 통과", z: ["0", "0", "0", "0"], closing: "0 × U − 0 × D = 0", closeOk: true, badEdge: -1, note: "시작값 조건이 없으면 Z를 모두 0으로 놓아 복사가 틀린 표도 재귀식을 맞출 수 있습니다." },
  { label: "마지막 줄 관계를 빼면", summary: "틀린 표: 76 → 45 ≠ 1", z: ["1", "50", "67", "76"], closing: "76 × 67/14 = 45", closeOk: false, badEdge: 3, note: "마지막 줄을 11+4=15로 바꾼 표는 앞의 세 화살표를 만족하고 75→1에서만 45가 됩니다. 이 관계를 빼면 통과합니다." },
];

const W = 360;
const H = 232;
const CX = 180;
const CY = 112;
const R = 82;
const ang = (k: number) => -Math.PI / 2 + (Math.PI / 2) * k;
const px = (k: number) => CX + R * Math.cos(ang(k));
const py = (k: number) => CY + R * Math.sin(ang(k));

export default function BoundaryRingViz() {
  return (
    <SceneShell
      eyebrow="누적 곱의 시작과 끝"
      title="네 줄은 고리로 닫히고, 두 경계 조건이 각자 다른 구멍을 막습니다"
      description="원 위의 네 점은 줄 0~3의 평가점이고, 화살표 하나가 '22를 곱해 다음 줄로' 가는 관계입니다. 점 안의 수는 그 줄의 누적값 Z입니다(97로 나눈 나머지)."
      ariaLabel="평가점 1, 22, 96, 75의 고리와 Z(1)=1, 마지막 줄 관계가 각각 막는 실패"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            {PTS.map((_, k) => {
              const a0 = ang(k) + 0.32;
              const a1 = ang(k + 1) - 0.32;
              const x0 = CX + R * Math.cos(a0);
              const y0 = CY + R * Math.sin(a0);
              const x1 = CX + R * Math.cos(a1);
              const y1 = CY + R * Math.sin(a1);
              const bad = s.badEdge === k;
              const last = k === 3;
              const color = bad ? "#dc2626" : last && s.closeOk === true ? "#059669" : "#2563eb";
              const t = a1 + Math.PI / 2;
              const h = (d: number) => `${x1 - 7 * Math.cos(t + d)} ${y1 - 7 * Math.sin(t + d)}`;
              return (
                <g key={k}>
                  <path d={`M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`} fill="none" stroke={color} strokeWidth={bad || last ? 1.25 : 1} strokeDasharray={bad ? "4 3" : undefined} />
                  <path d={`M ${x1} ${y1} L ${h(0.45)} L ${h(-0.45)} Z`} fill={color} />
                </g>
              );
            })}
            {PTS.map((p, k) => {
              const start = k === 0 && active === 2;
              return (
                <g key={p}>
                  <circle cx={px(k)} cy={py(k)} r={21} fill={start ? "#fee2e2" : "#ffffff"} stroke={start ? "#dc2626" : "#475569"} strokeWidth={1} />
                  <text x={px(k)} y={py(k) - 3} textAnchor="middle" fontSize={9} fill="#64748b">X={p}</text>
                  <text x={px(k)} y={py(k) + 11} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">{s.z[k] || "·"}</text>
                </g>
              );
            })}
            <text x={CX} y={CY - 2} textAnchor="middle" fontSize={10} fill="#64748b">75 → 1 화살표</text>
            <text x={CX} y={CY + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.closeOk === false ? "#b91c1c" : s.closeOk ? "#047857" : "#334155"}>{s.closing}</text>
          </svg>
        );
      }}
    />
  );
}
