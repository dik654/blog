import MdbxSceneShell from "./MdbxSceneShell";

/**
 * 본문 대응: #reclaim — reuse(p)는 retiredTx(p) ≤ min(active readerTx)일 때만.
 * R1=100, R2=103 → horizon 100. Writer가 105까지 가도 100. R1 종료 → min(103)=103.
 * 103에서 retiredTx 101·102·103이 ≤ 103 → 재사용 후보, 104·105는 보존.
 * 매 commit마다 빠진 page 묶음이 있다는 것은 설명용 가정입니다.
 */
const GENS = [100, 101, 102, 103, 104, 105] as const;
const RETIRED = [101, 102, 103, 104, 105] as const;

const SCENES = [
  {
    label: "두 reader가 snapshot을 고정",
    summary: "min(100, 103) = 100",
    now: 103,
    r1Open: true,
    horizon: 100,
    note: "R1은 txid 100, R2는 103을 고정했습니다. 회수 horizon은 열린 snapshot 중 가장 오래된 100입니다. 101~103에 current graph에서 빠진 page는 retiredTx가 100보다 크므로 모두 보존합니다.",
  },
  {
    label: "Writer가 105까지 진행",
    summary: "commit 105 · horizon 100",
    now: 105,
    r1Open: true,
    horizon: 100,
    note: "새 commit 104·105가 생겨도 R1이 열려 있는 한 horizon은 100에 머뭅니다. 보존할 page 묶음이 쌓이므로 writer는 retired page를 곧바로 되돌려 쓰지 못하고 새 page를 더 필요로 할 수 있습니다.",
  },
  {
    label: "R1 종료 뒤 horizon 전진",
    summary: "min(103) = 103",
    now: 105,
    r1Open: false,
    horizon: 103,
    note: "R1이 끝나면 열린 reader는 R2(103)만 남아 horizon이 103으로 전진합니다. retiredTx가 103 이하인 101·102·103의 page가 재사용 후보가 되고, R2가 열려 있는 동안 104·105에 빠진 page는 계속 보존합니다.",
  },
] as const;

const W = 372;
const H = 206;
const X0 = 104;
const STEP = 48;
const x = (gen: number) => X0 + (gen - 100) * STEP;
const Y_R1 = 44;
const Y_R2 = 74;
const Y_COMMIT = 104;
const Y_RET = 136;
const Y_AXIS = 194;

export default function ReaderHorizonViz() {
  return (
    <MdbxSceneShell
      eyebrow="회수 horizon"
      title="가장 오래된 reader가 끝나야 retired page가 돌아옵니다"
      description="가로축은 transaction generation입니다. 회수 horizon은 열린 reader가 고정한 txid 중 가장 작은 값이고, 맨 아래 칸은 그 세대에 current graph에서 빠진 page 묶음입니다. 매 commit마다 빠지는 page가 있다고 두었고 칸 크기는 page 수가 아닙니다(가정)."
      note="본문의 식을 그대로 따른 모형입니다. 경계 비교(≤)는 libmdbx v0.14.3의 GC 재사용 조건을 따랐고, reader slot·process liveness 처리는 고정한 release의 구현에 따릅니다."
      ariaLabel="두 reader가 txid 100과 103을 고정한 동안 writer가 105까지 진행하고, R1 종료 뒤 회수 horizon이 103으로 전진하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const hx = x(scene.horizon);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={4} y={Y_R1 + 4} fontSize={12} fontWeight={700} fill="#475569">R1 · 100</text>
            <text x={4} y={Y_R2 + 4} fontSize={12} fontWeight={700} fill="#475569">R2 · 103</text>
            <text x={4} y={Y_COMMIT + 4} fontSize={12} fill="#64748b">commit</text>
            <text x={4} y={Y_RET - 2} fontSize={12} fill="#64748b">빠진 page</text>
            <text x={4} y={Y_RET + 12} fontSize={12} fill="#64748b">묶음</text>

            {scene.r1Open ? (
              <>
                <rect x={x(100)} y={Y_R1 - 4} width={x(scene.now) - x(100)} height={8} rx={4} fill="#2563eb" />
                <text x={x(scene.now) + 4} y={Y_R1 - 8} textAnchor="end" fontSize={11} fill="#2563eb">열림</text>
              </>
            ) : (
              <>
                <line x1={x(100)} x2={x(103) + 20} y1={Y_R1} y2={Y_R1} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
                <text x={x(103) + 26} y={Y_R1 + 4} fontSize={11} fill="#64748b">종료</text>
              </>
            )}
            <circle cx={x(100)} cy={Y_R1} r={4} fill={scene.r1Open ? "#2563eb" : "#94a3b8"} />

            {scene.now > 103 && (
              <rect x={x(103)} y={Y_R2 - 4} width={x(scene.now) - x(103)} height={8} rx={4} fill="#2563eb" />
            )}
            <circle cx={x(103)} cy={Y_R2} r={4} fill="#2563eb" />
            <text x={x(103) - 6} y={Y_R2 + 4} textAnchor="end" fontSize={11} fill="#2563eb">열림</text>

            {RETIRED.map((gen) => (
              gen <= scene.now ? <circle key={`c${gen}`} cx={x(gen)} cy={Y_COMMIT} r={3.5} fill="#475569" /> : null
            ))}

            {RETIRED.map((gen) => {
              if (gen > scene.now) return null;
              const reusable = gen <= scene.horizon;
              return (
                <g key={`r${gen}`}>
                  <rect
                    x={x(gen) - 22}
                    y={Y_RET - 14}
                    width={44}
                    height={30}
                    rx={4}
                    fill={reusable ? "#2563eb" : "none"}
                    fillOpacity={reusable ? 0.12 : 1}
                    stroke={reusable ? "#2563eb" : "#d97706"}
                    strokeWidth={1}
                    strokeDasharray={reusable ? undefined : "3 2"}
                  />
                  <text x={x(gen)} y={Y_RET + 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={reusable ? "#2563eb" : "#b45309"}>
                    {reusable ? "후보" : "보존"}
                  </text>
                </g>
              );
            })}

            <line x1={hx} x2={hx} y1={20} y2={Y_COMMIT + 10} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="5 3" />
            <line x1={hx + STEP / 2} x2={hx + STEP / 2} y1={Y_RET - 20} y2={Y_RET + 22} stroke="#dc2626" strokeWidth={1.25} />
            <text x={hx + STEP / 2} y={Y_RET + 34} textAnchor="middle" fontSize={11} fill="#dc2626">≤ {scene.horizon}</text>
            <text x={hx} y={14} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">horizon {scene.horizon}</text>

            <line x1={x(100) - 14} x2={x(105) + 14} y1={Y_AXIS - 12} y2={Y_AXIS - 12} stroke="#94a3b8" strokeWidth={1} />
            {GENS.map((gen) => (
              <text key={`a${gen}`} x={x(gen)} y={Y_AXIS + 2} textAnchor="middle" fontSize={12} fill={gen <= scene.now ? "#475569" : "#cbd5e1"}>
                {gen}
              </text>
            ))}
            <text x={4} y={Y_AXIS + 2} fontSize={11} fill="#64748b">txid</text>
          </svg>
        );
      }}
    />
  );
}
