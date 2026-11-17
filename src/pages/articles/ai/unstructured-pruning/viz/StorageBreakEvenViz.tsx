import SceneShell from "./SceneShell";

/**
 * 본문 대응: #storage-break-even — FP16 value 2 byte, 32-bit index 4 byte, metadata 0.
 * 원래 원소 하나당 dense = 2 byte, sparse = ρ × (2 + 4) = 6ρ byte → ρ = 1/3에서 같아집니다.
 * ρ 0.5 → 3 byte, ρ 1/3 → 2 byte, ρ 0.2 → 1.2 byte.
 */
const BV = 2;
const BI = 4;

const SCENES = [
  { label: "절반을 지웠을 때", summary: "ρ 0.5 → sparse 3 > dense 2", rho: 0.5, note: "남은 값마다 value 2 + index 4 byte를 적어 0.5 × 6 = 3 byte입니다. 0까지 적는 dense 2 byte보다 큽니다." },
  { label: "손익분기", summary: "ρ 1/3 → 2 = 2", rho: 1 / 3, note: "6ρ = 2가 되는 ρ = 1/3, 즉 sparsity 66.7%에서 두 선이 만납니다." },
  { label: "80%를 지웠을 때", summary: "ρ 0.2 → sparse 1.2 < dense 2", rho: 0.2, note: "0.2 × 6 = 1.2 byte로 dense 2보다 작습니다. ρ 0.5와 0.2는 예시로 고른 값입니다(가정)." },
] as const;

const W = 360;
const H = 196;
const X0 = 44;
const X1 = 340;
const Y0 = 160;
const Y1 = 20;
const YMAX = 6;
const px = (rho: number) => X0 + rho * (X1 - X0);
const py = (bytes: number) => Y0 - (bytes / YMAX) * (Y0 - Y1);
const fmt = (value: number) => (Number.isInteger(value) ? String(value) : value.toFixed(1));

export default function StorageBreakEvenViz() {
  return (
    <SceneShell
      eyebrow="저장량 손익분기"
      title="남긴 비율이 1/3보다 클 때는 sparse 쪽이 더 큽니다"
      description="가로축 density ρ는 남긴 weight 비율, 세로축은 원래 원소 하나당 byte입니다. 본문 값 FP16 value 2 byte, index(남은 값의 원래 자리 주소) 4 byte, metadata 0을 씁니다."
      note="Value마다 index 하나를 두는 단순 근사이며, 작은 payload가 빠른 kernel을 뜻하지는 않습니다."
      ariaLabel="density에 따른 dense와 sparse 저장량 비교"
      scenes={SCENES}
      render={(active) => {
        const rho = SCENES[active].rho;
        const sparse = rho * (BV + BI);
        const sparseWins = sparse < BV - 1e-9;
        const tie = Math.abs(sparse - BV) < 1e-9;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={X0} y={Y1} width={px(1 / 3) - X0} height={Y0 - Y1} fill="#16a34a" opacity={0.07} />
            <text x={X0 + 4} y={Y1 + 12} fontSize={10} fill="#15803d">sparse가 작은 구간</text>
            {[0, 2, 4, 6].map((b) => (
              <g key={b}>
                <line x1={X0} x2={X1} y1={py(b)} y2={py(b)} stroke="#cbd5e1" strokeWidth={0.5} />
                <text x={X0 - 6} y={py(b) + 4} fontSize={10} textAnchor="end" fill="#64748b">{b}</text>
              </g>
            ))}
            {[0, 1 / 3, 0.5, 1].map((r) => (
              <text key={r} x={px(r)} y={Y0 + 15} fontSize={10} textAnchor="middle" fill="#64748b">{r === 1 / 3 ? "1/3" : String(r)}</text>
            ))}
            <text x={X1} y={Y0 + 32} fontSize={10} textAnchor="end" fill="#64748b">density ρ →</text>
            <text x={X0 - 6} y={Y1 - 8} fontSize={10} fill="#64748b">byte/원소</text>
            <line x1={X0} x2={X0} y1={Y1} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={px(0)} x2={px(1)} y1={py(BV)} y2={py(BV)} stroke="#475569" strokeWidth={1.25} />
            <text x={X1} y={py(BV) - 6} fontSize={10} textAnchor="end" fill="#475569">dense 2</text>
            <line x1={px(0)} x2={px(1)} y1={py(0)} y2={py(BV + BI)} stroke="#2563eb" strokeWidth={1.25} />
            <text x={px(0.82)} y={py(6 * 0.82) - 8} fontSize={10} textAnchor="end" fill="#2563eb">sparse 6ρ</text>
            <line x1={px(rho)} x2={px(rho)} y1={Y1} y2={Y0} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={px(rho)} cy={py(BV)} r={4} fill="#475569" />
            <circle cx={px(rho)} cy={py(sparse)} r={4.5} fill={tie ? "#475569" : sparseWins ? "#16a34a" : "#dc2626"} />
            <text x={px(rho) + 8} y={py(sparse) + (sparse > BV ? -6 : 14)} fontSize={11} fontWeight={700} fill={tie ? "#334155" : sparseWins ? "#15803d" : "#b91c1c"}>
              {fmt(sparse)} byte
            </text>
          </svg>
        );
      }}
    />
  );
}
