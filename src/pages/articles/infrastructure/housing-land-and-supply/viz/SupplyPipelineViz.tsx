import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 수요 증가가 입주로 이어지는 시간과, 허가 건수 ≠ 완공 물량.
 * 사업 10칸과 단계별 칸 수는 구별을 보이려는 가정(3+4+3=10). 칸 간격은 기간이 아니다.
 */
const STAGES = ["권리·인허가", "기반 시설", "시공", "입주"] as const;
const LAYOUTS: readonly (readonly [number, number, number, number])[] = [
  [10, 0, 0, 0],
  [0, 10, 0, 0],
  [0, 3, 4, 3],
];
const COL = 84;
const X0 = 8;
const COLORS = ["#94a3b8", "#94a3b8", "#94a3b8", "#2563eb"] as const;

const SCENES = [
  { label: "수요가 늘어난 때", summary: "허가 0 · 입주 0 (가정)", note: "칸 하나가 사업 하나입니다(가정). 사고 싶은 사람이 늘어도 사업은 이제 권리 확인과 인허가를 시작한 단계이고, 입주할 집은 아직 없습니다." },
  { label: "허가가 났을 때", summary: "허가 10 · 입주 0 (가정)", note: "허가 통계에는 이미 10건이 잡히지만 집은 아직 지어지지 않았습니다. 허가 건수가 늘었다는 통계만 보면 입주 물량을 잘못 읽게 됩니다." },
  { label: "시간이 더 지난 뒤", summary: "허가 10 · 입주 3 (가정)", note: "수요 증가에서 입주까지 걸리는 이 시간을 글은 공급의 허가 시간이라 부릅니다. 칸 사이 간격은 실제 기간이 아니고, 칸 수도 설명용 가정입니다." },
] as const;

export default function SupplyPipelineViz() {
  return (
    <SceneShell
      eyebrow="허가와 완공"
      title="허가 건수와 입주 물량은 다른 단계에서 셉니다"
      description="칸 수와 단계별 분포는 구별을 보이기 위한 가정이며 실제 통계가 아닙니다."
      ariaLabel="사업이 권리 확인, 기반 시설, 시공, 입주 단계를 지나는 동안의 허가 건수와 입주 물량"
      scenes={SCENES}
      render={(active) => {
        const layout = LAYOUTS[active];
        const permits = active === 0 ? 0 : 10;
        return (
          <svg viewBox="0 0 360 188" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {STAGES.map((stage, index) => {
              const x = X0 + index * COL + index * 3;
              return (
                <g key={stage}>
                  <rect x={x} y={8} width={COL} height={124} rx={6} fill="none" stroke={index === 3 ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  <text x={x + COL / 2} y={25} textAnchor="middle" fontSize={13} fontWeight={700} fill={index === 3 ? "#2563eb" : "#64748b"}>{stage}</text>
                  {Array.from({ length: layout[index] }, (_, cell) => (
                    <rect key={cell} x={x + 12 + (cell % 2) * 33} y={34 + Math.floor(cell / 2) * 19} width={29} height={15} rx={2} fill={COLORS[index]} />
                  ))}
                </g>
              );
            })}
            <text x={X0} y={152} fontSize={13} fontWeight={700} fill="#64748b">허가 통계 {permits}건</text>
            <text x={352} y={152} textAnchor="end" fontSize={13} fontWeight={700} fill="#2563eb">입주 {layout[3]}칸</text>
            <line x1={X0} x2={346} y1={166} y2={166} stroke="#94a3b8" strokeWidth={1} />
            <path d="M352 166 l-7 -4 v8 z" fill="#94a3b8" />
            <text x={180} y={183} textAnchor="middle" fontSize={13} fill="#64748b">단계 순서 (기간 비례 아님)</text>
          </svg>
        );
      }}
    />
  );
}
