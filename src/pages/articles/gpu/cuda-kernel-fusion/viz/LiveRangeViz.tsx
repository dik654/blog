import FusionSceneShell from "./FusionSceneShell";

/**
 * 본문 대응: #megakernel 첫 문단 — 서로 다른 stage를 합치면 A output의 live range와 B·C temporaries가 겹치고,
 * thread당 register와 shared memory가 늘어 resident warps가 줄며 더 심하면 spill이 생긴다.
 * 가로 = 프로그램 순서(A → B → C 계산). 막대 = 값이 register에 살아 있는 구간. 길이는 개념도용 가정.
 * 맨 아래 칸 = 그 구간에 동시에 살아 있는 값 묶음 수(그림의 막대 개수를 센 값).
 */
const SCENES = [
  {
    label: "따로 실행하면 각 kernel이 자기 값만 붙잡습니다",
    summary: "구간마다 묶음 1개",
    note: "A kernel은 output을 HBM에 쓰고 끝납니다. B와 C kernel은 각자 자기 temporaries만 register에 둡니다. 어느 순간에도 살아 있는 묶음은 하나입니다.",
  },
  {
    label: "합치면 A output이 B·C 계산 동안 살아 있습니다",
    summary: "B·C 구간에서 묶음 2개",
    note: "live range는 값이 만들어진 뒤 마지막으로 쓰일 때까지 register를 차지하는 구간입니다. 한 kernel 안에서 A output을 계속 쓰면 그 구간이 B·C temporaries와 겹칩니다.",
  },
  {
    label: "thread당 register는 가장 많이 겹친 구간을 감당해야 합니다",
    summary: "겹침 → thread당 register ↑",
    note: "합친 kernel 하나가 세 단계를 모두 실행하므로 thread당 register는 겹침이 가장 큰 구간에 맞춰 늘어납니다. block shared memory도 같은 이유로 늘 수 있습니다.",
  },
  {
    label: "SM에 머무는 warp가 줄고, 더 심하면 spill이 납니다",
    summary: "resident warps ↓ · spill 가능",
    note: "thread당 register가 늘면 SM에 함께 머무는 block이 줄어듭니다. 아래 본문의 단순 계산(SM당 register 65,536개·block당 256 threads 가정)에서 32 registers/thread는 block 8개, 72는 3개가 상한이며, 실제 residency는 다른 한도도 받는 교육용 ceiling입니다. 한도를 넘는 값은 local memory로 밀려나는 spill이 됩니다.",
  },
] as const;

const W = 340;
const H = 196;
const SEG = [
  { name: "A 계산", x: 80 },
  { name: "B 계산", x: 165 },
  { name: "C 계산", x: 250 },
] as const;
const SEG_W = 85;
const ROWS = [
  { name: "A output", y: 46, color: "#2563eb", light: "#dbeafe" },
  { name: "B temp", y: 72, color: "#7c3aed", light: "#ede9fe" },
  { name: "C temp", y: 98, color: "#0f766e", light: "#ccfbf1" },
] as const;

export default function LiveRangeViz() {
  return (
    <FusionSceneShell
      eyebrow="Live range"
      title="합친 kernel에서는 앞 단계의 값이 뒤 단계 값과 동시에 register를 차지합니다"
      description="가로는 프로그램 순서, 막대는 값이 register에 살아 있는 구간입니다. 막대 길이는 개념을 보이려는 가정이며 실제 register 수가 아닙니다."
      ariaLabel="분리 kernel과 fused kernel에서 A output과 B·C temporaries의 live range 겹침"
      scenes={SCENES}
      render={(active) => {
        const fused = active >= 1;
        const aEnd = fused ? 335 : 160;
        const counts = fused ? [1, 2, 2] : [1, 1, 1];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {SEG.map((seg) => (
              <text key={seg.name} x={seg.x + SEG_W / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">{seg.name}</text>
            ))}
            {fused ? (
              <rect x={80} y={22} width={255} height={92} rx={6} fill="none" stroke="#475569" strokeWidth={1.25} />
            ) : (
              SEG.map((seg) => <rect key={seg.name} x={seg.x + 3} y={22} width={SEG_W - 6} height={92} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1} />)
            )}
            {!fused && (
              <>
                <text x={165} y={124} textAnchor="middle" fontSize={10} fill="#b45309">HBM</text>
                <text x={250} y={124} textAnchor="middle" fontSize={10} fill="#b45309">HBM</text>
              </>
            )}
            {fused && <text x={330} y={124} textAnchor="end" fontSize={10} fill="#475569">fused kernel 하나</text>}
            {ROWS.map((row) => (
              <text key={row.name} x={6} y={row.y + 4} fontSize={11} fill="#334155">{row.name}</text>
            ))}
            <rect x={118} y={ROWS[0].y - 7} width={aEnd - 118} height={14} rx={3} fill={ROWS[0].light} stroke={ROWS[0].color} strokeWidth={1} />
            <rect x={178} y={ROWS[1].y - 7} width={62} height={14} rx={3} fill={ROWS[1].light} stroke={ROWS[1].color} strokeWidth={1} />
            <rect x={262} y={ROWS[2].y - 7} width={62} height={14} rx={3} fill={ROWS[2].light} stroke={ROWS[2].color} strokeWidth={1} />

            <text x={6} y={148} fontSize={10} fill="#64748b">동시에 산</text>
            <text x={6} y={161} fontSize={10} fill="#64748b">묶음 수</text>
            {SEG.map((seg, index) => {
              const peak = fused && index > 0 && active >= 2;
              return (
                <g key={seg.name}>
                  {Array.from({ length: counts[index] }, (_, unit) => (
                    <rect key={unit} x={seg.x + SEG_W / 2 - 14} y={164 - (unit + 1) * 13} width={28} height={11} rx={2} fill={peak ? "#f59e0b" : "#cbd5e1"} />
                  ))}
                  <text x={seg.x + SEG_W / 2 + 20} y={160} fontSize={11} fontWeight={700} fill={peak ? "#b45309" : "#475569"}>{counts[index]}</text>
                </g>
              );
            })}
            <line x1={80} x2={335} y1={166} y2={166} stroke="#94a3b8" strokeWidth={1} />
            {active >= 2 && (
              <text x={335} y={186} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">
                {active === 2 ? "kernel 전체의 register 요구 = 겹친 구간 기준" : "register ↑ → resident warps ↓ · 넘치면 spill"}
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
