import SceneShell from "./SceneShell";

/**
 * 본문 대응: #guarantee — 과반이 필요한 저장소를 두 지역에 나누면 한쪽 상실만 견딘다.
 * 복제본 3개를 A 지역 2개, B 지역 1개로 둔다(가정). 과반 = 3개 중 2개 이상.
 * B를 잃으면 2/3 → 과반 유지, A를 잃으면 1/3 → 과반 없음.
 */
const REGIONS = [
  { name: "A 지역", count: 2 },
  { name: "B 지역", count: 1 },
] as const;
const TOTAL = REGIONS.reduce<number>((sum, region) => sum + region.count, 0);
const MAJORITY = Math.floor(TOTAL / 2) + 1;

const SCENES = [
  {
    label: "두 지역에 나눔",
    summary: `복제본 ${TOTAL}개 · 과반 ${MAJORITY}개`,
    lost: -1,
    note: "과반은 전체 복제본의 절반을 넘는 수입니다. 복제본 3개를 A에 2개, B에 1개 둔다고 가정하면 3개 중 2개가 응답해야 저장소가 일을 계속합니다.",
  },
  {
    label: "B 지역을 잃음",
    summary: "남은 2개 ≥ 2 · 계속 동작",
    lost: 1,
    note: "B 지역이 통째로 사라져도 A의 2개가 남습니다. 2개는 과반이므로 견딥니다.",
  },
  {
    label: "A 지역을 잃음",
    summary: "남은 1개 < 2 · 과반 없음",
    lost: 0,
    note: "A 지역을 잃으면 B의 1개만 남아 과반을 모으지 못합니다. 두 지역에 나눴지만 견디는 것은 한쪽 상실뿐이라, 이중화되었다는 문장은 보장이 아닙니다.",
  },
] as const;

const W = 360;
const OK = "#059669";
const BAD = "#dc2626";
const NODE = "#2563eb";
const MUTED = "#94a3b8";
const INK = "#64748b";
const BOX_W = 150;
const BOX_Y = 30;
const BOX_H = 96;
const boxX = (i: number) => (i === 0 ? 20 : W - 20 - BOX_W);

export default function QuorumSplitViz() {
  return (
    <SceneShell
      eyebrow="두 지역 이중화"
      title="과반이 필요한 저장소는 두 곳에 나눠도 한쪽 상실만 견딥니다"
      description="원 하나가 저장소 복제본 하나입니다. 복제본 수와 2대 1 배치는 그림을 위한 가정이며, 어느 지역을 잃느냐에 따라 결과가 갈립니다."
      ariaLabel="두 지역에 나눈 복제본 셋에서 지역 하나를 잃었을 때 과반이 남는지"
      scenes={SCENES}
      render={(active) => {
        const { lost } = SCENES[active];
        const alive = REGIONS.reduce<number>((sum, region, i) => (i === lost ? sum : sum + region.count), 0);
        const ok = alive >= MAJORITY;
        return (
          <svg viewBox={`0 0 ${W} 196`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {REGIONS.map((region, i) => {
              const gone = i === lost;
              const x = boxX(i);
              return (
                <g key={region.name}>
                  <rect x={x} y={BOX_Y} width={BOX_W} height={BOX_H} rx={8} fill="none" stroke={gone ? BAD : MUTED} strokeWidth={1} strokeDasharray={gone ? "4 3" : undefined} />
                  <text x={x + 10} y={BOX_Y - 8} fontSize={13} fontWeight={700} fill={gone ? BAD : INK}>
                    {region.name}
                    {gone ? " · 상실" : ""}
                  </text>
                  {Array.from({ length: region.count }, (_, n) => {
                    const cx = x + BOX_W / 2 + (n - (region.count - 1) / 2) * 46;
                    const cy = BOX_Y + BOX_H / 2;
                    return (
                      <g key={n}>
                        <circle cx={cx} cy={cy} r={16} fill={gone ? "none" : NODE} fillOpacity={0.85} stroke={gone ? MUTED : NODE} strokeWidth={1} strokeDasharray={gone ? "3 2" : undefined} />
                        {gone ? (
                          <g stroke={BAD} strokeWidth={1.25}>
                            <line x1={cx - 8} y1={cy - 8} x2={cx + 8} y2={cy + 8} />
                            <line x1={cx + 8} y1={cy - 8} x2={cx - 8} y2={cy + 8} />
                          </g>
                        ) : (
                          <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
                            복제
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
            <text x={20} y={158} fontSize={13} fontWeight={700} fill={lost < 0 ? INK : ok ? OK : BAD}>
              응답하는 복제본 {alive} / {TOTAL} · 필요한 과반 {MAJORITY}
            </text>
            <text x={20} y={180} fontSize={12} fill={INK}>
              {lost < 0 ? "어느 한 지역이 통째로 사라지면?" : ok ? "과반이 남아 계속 동작합니다" : "과반을 모으지 못합니다"}
            </text>
          </svg>
        );
      }}
    />
  );
}
