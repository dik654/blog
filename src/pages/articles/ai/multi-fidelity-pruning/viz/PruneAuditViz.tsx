import SceneShell from "./SceneShell";

/**
 * 본문 대응: #false-prune-audit — 중단 100개 중 무작위 20개를 끝까지 실행, 4개가 채택 가능.
 * 관측 비율 = 4/20 = 20%. 나머지 80개는 관측하지 않았으므로 4/100으로 쓰지 않는다.
 * 점 하나 = 중단된 후보 하나. 표본·채택 가능 점의 위치는 그림용 배치다(가정).
 */
const SAMPLED: readonly number[] = [3, 8, 11, 17, 24, 29, 32, 38, 41, 46, 53, 57, 60, 66, 72, 75, 81, 88, 94, 97];
const ADOPTABLE: readonly number[] = [17, 46, 72, 94];

const SCENES = [
  { label: "중단된 후보 100개", summary: "최종 결과 모름 100", note: "규칙에 따라 중단한 후보 100개입니다. 끝까지 갔다면 채택 가능했는지는 아직 모릅니다. (가정)" },
  { label: "무작위 20개를 끝까지", summary: "끝까지 실행 20 · 미관측 80", note: "무작위로 20개를 골라 최종 예산까지 실행합니다. 최종 기준과 필수 조건은 결과를 보기 전에 정해 둡니다." },
  { label: "20개 중 4개가 채택 가능", summary: "4 / 20 = 20%", note: "끝까지 실행한 20개 중 기준을 통과한 4개가 놓친 후보입니다. 분모는 실제로 확인한 20개입니다." },
  { label: "분모를 100으로 쓰면", summary: "4 / 100 ✗ · 80개는 모름", note: "실행하지 않은 80개 안에 놓친 후보가 몇 개인지 모르므로 4/100이나 ‘전체 4개’로 쓰지 않습니다. 유망한 후보만 골랐다면 20%를 전체로 넓힐 수도 없습니다." },
] as const;

const COLS = 10;
const GAP = 22;
const LEFT = 20;
const TOP = 16;
const W = LEFT * 2 + (COLS - 1) * GAP + 112;
const H = TOP * 2 + (COLS - 1) * GAP;

export default function PruneAuditViz() {
  return (
    <SceneShell
      eyebrow="놓친 후보 감사"
      title="분모는 끝까지 확인한 20개입니다"
      description="점 하나가 중단된 후보 하나입니다. 빈 원은 끝까지 실행하지 않은 후보, 채운 원은 끝까지 실행한 후보, 체크 표시 사각형은 그중 최종 기준을 통과한 후보입니다."
      note="100·20·4는 본문 10절의 가정입니다. 표본 점의 위치는 무작위 추출을 흉내 낸 그림용 배치입니다."
      ariaLabel="중단 100개 중 끝까지 실행한 20개와 그중 채택 가능 4개, 관측 비율 4/20"
      scenes={SCENES}
      render={(active) => {
        const sampledSet = new Set(active >= 1 ? SAMPLED : []);
        const adoptSet = new Set(active >= 2 ? ADOPTABLE : []);
        const legendX = LEFT + (COLS - 1) * GAP + 24;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[380px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: 100 }, (_, index) => {
              const cx = LEFT + (index % COLS) * GAP;
              const cy = TOP + Math.floor(index / COLS) * GAP;
              if (adoptSet.has(index)) {
                return (
                  <g key={index}>
                    <rect x={cx - 8} y={cy - 8} width={16} height={16} rx={3} fill="#16a34a" />
                    <path d={`M ${cx - 4} ${cy} L ${cx - 1} ${cy + 3} L ${cx + 4} ${cy - 3}`} fill="none" stroke="#ffffff" strokeWidth={1.25} />
                  </g>
                );
              }
              if (sampledSet.has(index)) {
                return <circle key={index} cx={cx} cy={cy} r={6.5} fill="#2563eb" fillOpacity={0.8} />;
              }
              return (
                <g key={index}>
                  <circle cx={cx} cy={cy} r={6.5} fill="none" stroke="#94a3b8" strokeWidth={1} />
                  {active === 3 && <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize={9} fill="#94a3b8">?</text>}
                </g>
              );
            })}
            <g fontSize={12}>
              <text x={legendX} y={TOP + 24} fill="#64748b">미관측</text>
              <text x={legendX} y={TOP + 40} fontWeight={700} fill="#334155">{active === 0 ? 100 : 80}개</text>
              <text x={legendX} y={TOP + 72} fill="#2563eb">끝까지 실행</text>
              <text x={legendX} y={TOP + 88} fontWeight={700} fill="#334155">{active === 0 ? 0 : 20}개</text>
              <text x={legendX} y={TOP + 120} fill="#16a34a">채택 가능</text>
              <text x={legendX} y={TOP + 136} fontWeight={700} fill="#334155">{active >= 2 ? "4개" : active === 1 ? "확인 중" : "−"}</text>
              <text x={legendX} y={TOP + 168} fill="#64748b">관측 비율</text>
              <text x={legendX} y={TOP + 184} fontWeight={700} fill={active === 3 ? "#dc2626" : "#334155"}>
                {active < 2 ? "−" : active === 2 ? "4/20 = 20%" : "4/100 ✗"}
              </text>
            </g>
          </svg>
        );
      }}
    />
  );
}
