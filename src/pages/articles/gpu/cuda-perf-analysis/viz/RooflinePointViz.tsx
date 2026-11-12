import SceneShell from "./SceneShell";

/**
 * 본문 대응: #throughput-ledger 두 번째 공식 — P ≤ min(P_compute, I·B_memory).
 * 고정 fixture: F=120GFLOPs, Q=160GB → I=0.75 FLOP/B, B=3TB/s → memory roof 2.25TFLOP/s,
 * achieved = 120GFLOPs ÷ 0.06s = 2TFLOP/s (2 ÷ 2.25 ≈ 0.89).
 * L2 hit 0.8 가정(본문 #counter-correlation): Q≈40GB → I=3 → memory roof 9TFLOP/s.
 * P_compute는 본문에 값이 없으므로 높이를 그리지 않는다.
 */
const B_MEMORY = 3;

const W = 360;
const H = 212;
const X0 = 46;
const X1 = 340;
const Y0 = 176;
const Y1 = 22;

const NOW_I = 120 / 160;
const NOW_ROOF = NOW_I * B_MEMORY;
const NOW_ACHIEVED = 120 / 60;
const NEXT_I = 120 / 40;
const NEXT_ROOF = NEXT_I * B_MEMORY;

/** 앞 네 장면은 0.75 근처를 크게 보고, 마지막 장면만 I=3까지 축을 넓힌다. */
type Axis = { iMax: number; pMax: number; iTicks: readonly number[]; pTicks: readonly number[] };
const NEAR: Axis = { iMax: 1.1, pMax: 3.3, iTicks: [0, 0.25, 0.5, 0.75, 1], pTicks: [0, 1, 2, 3] };
const WIDE: Axis = { iMax: 3.5, pMax: 10.5, iTicks: [0, 1, 2, 3], pTicks: [0, 3, 6, 9] };

const SCENES = [
  {
    label: "memory roof는 기울어진 선입니다",
    summary: "P 상한 = I × 3TB/s",
    note: "Intensity I는 실제로 옮긴 byte 하나가 운반하는 useful FLOPs입니다. I가 클수록 같은 3TB/s로 낼 수 있는 FLOP/s 상한도 비례해 올라가므로, 이 상한은 원점에서 올라가는 직선입니다.",
  },
  {
    label: "지금 kernel의 위치",
    summary: "120GFLOPs ÷ 160GB = 0.75 FLOP/B",
    note: "고정 fixture의 kernel은 I=0.75에 서 있습니다. 그 세로선이 memory roof와 만나는 높이 0.75×3=2.25TFLOP/s가 이 intensity에서 memory가 허용하는 상한입니다.",
  },
  {
    label: "achieved 점은 지붕 바로 아래",
    summary: "2 ÷ 2.25 ≈ 0.89",
    note: "60ms에 120GFLOPs를 처리했으니 achieved는 2TFLOP/s, memory roof 2.25의 약 89%입니다. 'memory roof 근처'라는 가설이 생기지만 원인은 아직 확정되지 않습니다.",
  },
  {
    label: "다른 지붕 P_compute",
    summary: "P ≤ min(P_compute, I·B)",
    note: "Compute roof는 precision·instruction path마다 정해지는 수평 상한이고, 이 글은 값을 주지 않아 높이를 그리지 않았습니다. 같은 세로선 위에서 두 상한 중 낮은 쪽에 먼저 닿습니다.",
  },
  {
    label: "L2 hit가 0.8로 오른다면",
    summary: "40GB → I=3 → memory roof 9TFLOP/s",
    note: "L2 요청 200GB가 같고 hit만 0.8로 오른다고 가정하면 DRAM 근사 40GB, I=120÷40=3, memory roof 9TFLOP/s입니다. Achieved는 다시 재야 해 점을 찍지 않았고, compute roof가 9보다 낮다면 이제 그쪽에 먼저 닿습니다.",
  },
] as const;

export default function RooflinePointViz() {
  return (
    <SceneShell
      eyebrow="Roofline 위의 한 점"
      title="같은 kernel이 어느 지붕 아래 서 있는지 좌표로 봅니다"
      description="가로축은 byte 하나가 운반하는 useful FLOPs(I), 세로축은 FLOP/s입니다. 모든 수치는 이 글의 설명용 fixture(peak 3TB/s, 120GFLOPs, 160GB, 60ms)이고 실제 장비 측정값이 아닙니다."
      ariaLabel="memory roof 직선 위에서 intensity 0.75 FLOP/B kernel의 상한 2.25와 achieved 2 TFLOP/s, hit 0.8 가정 시 intensity 3과 상한 9"
      scenes={SCENES}
      render={(active) => {
        const axis = active === 4 ? WIDE : NEAR;
        const sx = (i: number) => X0 + (i / axis.iMax) * (X1 - X0);
        const sy = (p: number) => Y0 - (p / axis.pMax) * (Y0 - Y1);
        const roofLabelI = axis.iMax * 0.32;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke="#94a3b8" strokeWidth={1} />
            {axis.iTicks.map((i) => (
              <text key={i} x={sx(i)} y={Y0 + 14} textAnchor="middle" fontSize={10} fontWeight={i === NOW_I && active >= 1 ? 700 : 400} fill={i === NOW_I && active >= 1 ? "#2563eb" : "#64748b"}>{i}</text>
            ))}
            <text x={X1} y={Y0 + 30} textAnchor="end" fontSize={10} fill="#64748b">I (FLOP/byte)</text>
            <text x={X0 - 6} y={Y1 - 8} fontSize={10} fill="#64748b">P (TFLOP/s)</text>
            {axis.pTicks.map((p) => (
              <text key={p} x={X0 - 6} y={sy(p) + 3} textAnchor="end" fontSize={10} fill="#64748b">{p}</text>
            ))}
            {active === 4 && <text x={X0 + 4} y={Y0 + 30} fontSize={9} fill="#64748b">축 범위를 I=3까지 넓힘</text>}

            <line x1={sx(0)} y1={sy(0)} x2={sx(axis.iMax)} y2={sy(Math.min(axis.iMax * B_MEMORY, axis.pMax))} stroke="#7c3aed" strokeWidth={1.25} />
            <text x={sx(roofLabelI) + 10} y={sy(roofLabelI * B_MEMORY) + 6} fontSize={10} fontWeight={700} fill="#7c3aed">memory roof = I × 3</text>

            {active >= 1 && (
              <g>
                <line x1={sx(NOW_I)} y1={Y0} x2={sx(NOW_I)} y2={sy(NOW_ROOF)} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={sx(NOW_I)} cy={sy(NOW_ROOF)} r={3.5} fill="#ffffff" stroke="#7c3aed" strokeWidth={1.25} />
                {active < 4 && <text x={sx(NOW_I) - 8} y={sy(NOW_ROOF) - 4} textAnchor="end" fontSize={10} fontWeight={700} fill="#7c3aed">상한 2.25</text>}
              </g>
            )}

            {active >= 2 && (
              <g>
                <circle cx={sx(NOW_I)} cy={sy(NOW_ACHIEVED)} r={4} fill="#2563eb" />
                {active < 4 && <text x={sx(NOW_I) + 9} y={sy(NOW_ACHIEVED) + 8} fontSize={10} fontWeight={700} fill="#2563eb">achieved 2 (약 89%)</text>}
                {active === 4 && <text x={sx(NOW_I) + 8} y={sy(NOW_ACHIEVED) + 4} fontSize={9} fill="#2563eb">지금: 상한 2.25 · achieved 2</text>}
              </g>
            )}

            {active === 3 && (
              <g>
                <rect x={X0 + 10} y={Y1 + 2} width={150} height={32} rx={6} fill="#ffffff" stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
                <text x={X0 + 85} y={Y1 + 15} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b45309">P_compute: 이 글에 값 없음</text>
                <text x={X0 + 85} y={Y1 + 28} textAnchor="middle" fontSize={9} fill="#64748b">수평 상한, 높이는 그리지 않음</text>
              </g>
            )}

            {active === 4 && (
              <g>
                <line x1={sx(NEXT_I)} y1={Y0} x2={sx(NEXT_I)} y2={sy(NEXT_ROOF)} stroke="#0f766e" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={sx(NEXT_I)} cy={sy(NEXT_ROOF)} r={3.5} fill="#ffffff" stroke="#0f766e" strokeWidth={1.25} />
                <text x={sx(NEXT_I) - 8} y={sy(NEXT_ROOF) - 2} textAnchor="end" fontSize={10} fontWeight={700} fill="#0f766e">상한 9</text>
                <line x1={sx(NOW_I) + 6} y1={Y0 - 10} x2={sx(NEXT_I) - 6} y2={Y0 - 10} stroke="#0f766e" strokeWidth={1} />
                <polygon points={`${sx(NEXT_I) - 6},${Y0 - 13} ${sx(NEXT_I)},${Y0 - 10} ${sx(NEXT_I) - 6},${Y0 - 7}`} fill="#0f766e" />
                <text x={(sx(NOW_I) + sx(NEXT_I)) / 2} y={Y0 - 15} textAnchor="middle" fontSize={9} fill="#0f766e">bytes 160 → 40GB (가정) · achieved는 재측정</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
