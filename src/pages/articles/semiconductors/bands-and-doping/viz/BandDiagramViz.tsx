import SceneShell from "./SceneShell";

/**
 * 본문 대응: #states — 세로축이 에너지인 그림. 위·아래 구간의 자리와 사이 간격.
 * 아래가 가득 차면 옮겨 갈 빈자리가 부족하고, 위로 올라간 전자와 아래 빈자리가 이동에 참여한다.
 * 7절과 맞춰 이웃 전자가 메우면 빈자리는 전자와 반대쪽으로 간다(전자 3→4칸, 빈자리 3→2칸).
 * 칸 수와 세로 간격은 그림용이며, 1.1 eV만 본문의 수치다.
 */
const W = 360;
const H = 192;
const COUNT = 9;
const SLOT_X = (index: number) => 66 + index * 30;
const UPPER_Y = 44;
const LOWER_Y = 148;

interface BandState {
  upper: readonly number[];
  lowerEmpty: readonly number[];
  lowerFilled: boolean;
}

const STATES: readonly BandState[] = [
  { upper: [], lowerEmpty: [], lowerFilled: false },
  { upper: [], lowerEmpty: [], lowerFilled: true },
  { upper: [3], lowerEmpty: [3], lowerFilled: true },
  { upper: [4], lowerEmpty: [2], lowerFilled: true },
  { upper: [4], lowerEmpty: [2], lowerFilled: true },
];

const SCENES = [
  { label: "차지할 수 있는 구간과 없는 간격", summary: "구간 둘 · 사이는 비어 있음", note: "결정에는 전자가 차지할 수 있는 에너지 자리가 구간으로 모입니다. 그 묶음이 에너지띠이고, 차지할 수 없는 간격이 띠틈입니다." },
  { label: "아래 구간이 가득 찬 경우", summary: "옮겨 갈 빈자리 부족", note: "작은 전기장을 걸어도 같은 구간 안에 옮겨 갈 빈자리가 부족합니다. 가득 찬 구간의 전자가 곧바로 전류를 만드는 것은 아닙니다." },
  { label: "전자 하나가 위로 올라간 뒤", summary: "위에 전자 1 · 아래에 빈자리 1", note: "위 구간에 올라온 전자는 움직일 자리가 있습니다. 아래 구간에는 빈자리가 하나 남았습니다. 어떻게 올라가는지는 7절에서 봅니다." },
  { label: "둘 다 이동에 참여합니다", summary: "위 전자 → · 아래 빈자리 ←", note: "위 전자는 옆 자리로 옮겨 갑니다. 아래에서는 이웃 전자가 빈자리를 메우고, 그 결과 빈자리는 전자와 반대쪽으로 옮겨 갑니다. 화살표 방향은 예시입니다(가정)." },
  { label: "간격의 크기", summary: "띠틈 약 1.1 eV (300 K 부근)", note: "순수한 실리콘의 300 K 부근 기준값입니다. 1 eV는 전하량 1 e가 1 V 차이를 지날 때 주고받는 에너지입니다." },
] as const;

export default function BandDiagramViz() {
  return (
    <SceneShell
      eyebrow="에너지띠"
      title="가득 찬 구간에서는 전자가 많아도 옮겨 갈 자리가 부족합니다"
      description="세로축이 에너지입니다. 동그라미 하나가 전자가 차지할 수 있는 자리이고 채운 칸은 전자입니다. 가로 배열은 원자가 놓인 공간 위치가 아닙니다."
      note="칸 수와 세로 높이는 실제 비율이 아니라 그림용입니다(가정)."
      ariaLabel="위와 아래 에너지 구간에서 전자와 빈자리가 움직이는 과정"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={18} x2={18} y1={H - 16} y2={16} stroke="#64748b" strokeWidth={1} />
            <polyline points="14,23 18,16 22,23" fill="none" stroke="#64748b" strokeWidth={1} />
            <text x={26} y={22} fontSize={11} fill="#64748b">에너지</text>

            <text x={66} y={UPPER_Y - 22} fontSize={11} fontWeight={700} fill="currentColor">위 구간 (에너지띠)</text>
            <rect x={48} y={UPPER_Y - 15} width={W - 66} height={30} rx={6} fill="#64748b" fillOpacity={0.08} stroke="#94a3b8" strokeWidth={1} />
            <text x={52} y={LOWER_Y + 30} fontSize={11} fontWeight={700} fill="currentColor">아래 구간 (에너지띠)</text>
            <rect x={48} y={LOWER_Y - 15} width={W - 66} height={30} rx={6} fill="#64748b" fillOpacity={0.08} stroke="#94a3b8" strokeWidth={1} />

            <line x1={306} x2={306} y1={UPPER_Y + 19} y2={LOWER_Y - 19} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            <text x={298} y={(UPPER_Y + LOWER_Y) / 2 - 3} textAnchor="end" fontSize={11} fontWeight={active === 4 ? 700 : 400} fill="currentColor">
              {active === 4 ? "약 1.1 eV" : "차지할 수 없는 간격"}
            </text>
            <text x={298} y={(UPPER_Y + LOWER_Y) / 2 + 12} textAnchor="end" fontSize={11} fill="#64748b">(띠틈)</text>

            {Array.from({ length: COUNT }, (_, index) => {
              const hasUpper = state.upper.includes(index);
              const isEmptyBelow = state.lowerEmpty.includes(index);
              const hasLower = state.lowerFilled && !isEmptyBelow;
              return (
                <g key={index}>
                  <circle cx={SLOT_X(index)} cy={UPPER_Y} r={8} fill={hasUpper ? "#2563eb" : "none"} stroke={hasUpper ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  <circle
                    cx={SLOT_X(index)}
                    cy={LOWER_Y}
                    r={8}
                    fill={hasLower ? "#2563eb" : "none"}
                    stroke={isEmptyBelow ? "#d97706" : hasLower ? "#2563eb" : "#94a3b8"}
                    strokeWidth={isEmptyBelow ? 1.25 : 1}
                    strokeDasharray={isEmptyBelow ? "2 2" : undefined}
                  />
                </g>
              );
            })}

            {active === 1 && (
              <g>
                <text x={SLOT_X(4)} y={LOWER_Y - 24} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">옮겨 갈 빈자리가 부족합니다</text>
              </g>
            )}

            {active === 2 && (
              <g>
                <line x1={SLOT_X(3)} x2={SLOT_X(3)} y1={LOWER_Y - 11} y2={UPPER_Y + 13} stroke="#2563eb" strokeWidth={1.25} />
                <polyline points={`${SLOT_X(3) - 4},${UPPER_Y + 20} ${SLOT_X(3)},${UPPER_Y + 13} ${SLOT_X(3) + 4},${UPPER_Y + 20}`} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                <text x={SLOT_X(3) - 8} y={(UPPER_Y + LOWER_Y) / 2 + 4} textAnchor="end" fontSize={11} fill="currentColor">올라감</text>
              </g>
            )}

            {(active === 3 || active === 4) && (
              <g opacity={active === 3 ? 1 : 0.5}>
                <line x1={SLOT_X(3) + 2} x2={SLOT_X(4) - 2} y1={UPPER_Y + 21} y2={UPPER_Y + 21} stroke="#2563eb" strokeWidth={1} />
                <polyline points={`${SLOT_X(4) - 7},${UPPER_Y + 18} ${SLOT_X(4) - 2},${UPPER_Y + 21} ${SLOT_X(4) - 7},${UPPER_Y + 24}`} fill="none" stroke="#2563eb" strokeWidth={1} />
                <text x={SLOT_X(4) + 10} y={UPPER_Y + 29} fontSize={11} fill="currentColor">전자 이동</text>
                <line x1={SLOT_X(3) - 2} x2={SLOT_X(2) + 2} y1={LOWER_Y - 21} y2={LOWER_Y - 21} stroke="#d97706" strokeWidth={1} />
                <polyline points={`${SLOT_X(2) + 7},${LOWER_Y - 24} ${SLOT_X(2) + 2},${LOWER_Y - 21} ${SLOT_X(2) + 7},${LOWER_Y - 18}`} fill="none" stroke="#d97706" strokeWidth={1} />
                <text x={SLOT_X(3) + 4} y={LOWER_Y - 22} fontSize={11} fill="currentColor">빈자리 이동</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
