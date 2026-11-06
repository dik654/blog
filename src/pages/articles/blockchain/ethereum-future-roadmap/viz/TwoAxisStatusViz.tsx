import ArrowPath from "./ArrowPath";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — EIP 문서 상태(가로)와 특정 업그레이드의 포함 단계(세로)는 다른 축이다.
 * 7732·7928의 칸은 4절 표의 "Review / Glamsterdam SFI"다. 다른 EIP는 이 글에 문서 상태가 없어 찍지 않는다.
 */
const SCENES = [
  { label: "축이 둘입니다", summary: "문서 진행 × 업그레이드 포함", note: "EIP는 Ethereum의 표준 제안 문서입니다. 가로는 그 문서의 표준화 진행 상태이고, 세로는 특정 업그레이드가 그 기능을 어떻게 다루는지입니다. 두 축을 한 줄의 성숙도 점수로 합치지 않습니다." },
  { label: "Review이면서 SFI", summary: "7732 · 7928 → 모순 아님", note: "ePBS 7732와 BAL 7928은 문서로는 Review이고 Glamsterdam에서는 SFI입니다. 다른 축의 값이라 함께 적혀도 모순이 아닙니다." },
  { label: "SFI에서도 빠질 수 있습니다", summary: "SFI ≠ 활성화 확정", note: "SFI는 포함하려는 강한 의도와 준비 조건을 뜻하지만 시험 중 문제가 생기면 제외될 수 있습니다. Included는 해당 업그레이드의 활성화를 가리키므로 SFI 칸과 구분합니다." },
  { label: "Final도 행을 정하지 않습니다", summary: "Final ≠ 모든 네트워크 활성화", note: "Final은 가로축의 값일 뿐입니다. Final인 일반 문서라도 모든 네트워크에 새 기능이 활성화된 것은 아닙니다. 위아래 어느 칸인지는 문서 상태만으로 정해지지 않습니다." },
] as const;

const COLS = ["Draft", "Review", "Last Call", "Final"];
const ROWS = [
  ["Included", "활성화"],
  ["SFI", "포함 예정"],
  ["CFI", "포함 고려"],
  ["PFI", "포함 제안"],
];
const GRID_X = 72;
const GRID_Y = 34;
const CELL_W = 70;
const CELL_H = 32;
const ACCENT = "#2563eb";
const RED = "#dc2626";
const TEXT = "#64748b";

export default function TwoAxisStatusViz() {
  return (
    <SceneShell
      eyebrow="상태의 두 축"
      title="문서의 상태와 업그레이드의 포함 단계는 칸을 따로 정합니다"
      description="확인일은 2026-10-04입니다. 표시한 칸은 이 글의 표에 두 축이 함께 적힌 사례이고, 비어 있는 칸은 해당 사례가 없다는 뜻이 아닙니다."
      ariaLabel="EIP 문서 상태와 업그레이드 포함 단계의 이차원 격자"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 216" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={GRID_X} y={12} fontSize={11} fontWeight={700} fill={active === 0 ? ACCENT : TEXT}>EIP 문서 상태 →</text>
          {COLS.map((col, c) => (
            <text key={col} x={GRID_X + c * CELL_W + CELL_W / 2} y={GRID_Y - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>{col}</text>
          ))}
          {ROWS.map(([name, gloss], r) => (
            <g key={name}>
              <text x={GRID_X - 6} y={GRID_Y + r * CELL_H + 14} textAnchor="end" fontSize={11} fontWeight={700} fill={active === 2 && r === 0 ? ACCENT : TEXT}>{name}</text>
              <text x={GRID_X - 6} y={GRID_Y + r * CELL_H + 27} textAnchor="end" fontSize={10} fill={TEXT}>{gloss}</text>
              {COLS.map((col, c) => (
                <rect key={col} x={GRID_X + c * CELL_W} y={GRID_Y + r * CELL_H} width={CELL_W} height={CELL_H} fill="#64748b" fillOpacity={0.06} stroke={TEXT} strokeOpacity={0.5} strokeWidth={1} />
              ))}
            </g>
          ))}
          {(active === 1 || active === 2) && (
            <g>
              <rect x={GRID_X + CELL_W} y={GRID_Y + CELL_H} width={CELL_W} height={CELL_H} fill={ACCENT} fillOpacity={0.16} stroke={ACCENT} strokeWidth={1.25} />
              <text x={GRID_X + CELL_W + CELL_W / 2} y={GRID_Y + CELL_H + 20} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>7732·7928</text>
            </g>
          )}
          {active === 2 && (
            <>
              <ArrowPath points={[[GRID_X + CELL_W + CELL_W / 2, GRID_Y + 2 * CELL_H], [GRID_X + CELL_W + CELL_W / 2, 182]]} color={RED} dashed />
              <text x={GRID_X + CELL_W + CELL_W / 2} y={198} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>시험 중 문제가 생기면 제외될 수 있음</text>
            </>
          )}
          {active === 3 && (
            <>
              <rect x={GRID_X + 3 * CELL_W} y={GRID_Y} width={CELL_W} height={4 * CELL_H} fill={ACCENT} fillOpacity={0.12} stroke={ACCENT} strokeWidth={1.25} strokeDasharray="3 3" />
              <text x={GRID_X + 3.5 * CELL_W} y={GRID_Y + 2 * CELL_H + 4} textAnchor="middle" fontSize={22} fontWeight={700} fill={ACCENT}>?</text>
              <text x={GRID_X + 4 * CELL_W} y={186} textAnchor="end" fontSize={11} fontWeight={700} fill={ACCENT}>Final만으로는 세로 칸을 못 정함</text>
            </>
          )}
          {active === 0 && (
            <text x={GRID_X} y={186} fontSize={11} fontWeight={700} fill={ACCENT}>↑ 세로: 특정 업그레이드의 포함 단계</text>
          )}
        </svg>
      )}
    />
  );
}
