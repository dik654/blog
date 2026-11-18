import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 설명용 100건 가운데 60건이 의무청산, 40건이 비청산(가정).
 * 청산 비율의 분모와 보고의 출발점은 서로 다른 질문이라 같은 100칸에 겹쳐 그린다.
 * 칸 하나 = 계약 1건. 위 6줄 = 청산 60, 아래 4줄 = 비청산 40.
 */
const CLEARED = 60;
const TOTAL = 100;
const COLS = 10;
const CELL = 18;
const GAP = 3;
const LEFT = 8;
const TOP = 8;
const GRID_W = COLS * CELL + (COLS - 1) * GAP;
const W = LEFT + GRID_W + 108;
const H = TOP + 10 * CELL + 9 * GAP + 10;
const rowY = (row: number) => TOP + row * (CELL + GAP);

const SCENES = [
  { label: "계약 100건, 아직 분류 전", summary: "100건", note: "은행이 맺은 금리·신용·통화 파생상품 100건입니다(설명용 가정). 칸 하나가 계약 한 건이고, 아직 어느 의무가 붙는지 정하지 않았습니다." },
  { label: "청산 의무 60건", summary: "60 ÷ 100 = 60%", note: "계약 종류와 거래상대 조건을 대입해 60건이 의무 중앙청산 대상이라고 가정합니다. 이 60건은 청산소가 양쪽 계약 사이에 들어가는 경로로 갑니다." },
  { label: "남은 40건도 규칙 아래", summary: "40건 → 양자 위험 완화", note: "나머지 40건은 두 회사가 직접 확인·평가·분쟁 처리와 담보를 운영하는 비청산 계약입니다. 청산소로 가지 않았다고 무규제 계약이 되는 것은 아닙니다." },
  { label: "보고는 100건에서 출발", summary: "청산 60 + 비청산 40 = 보고 100", note: "EU EMIR처럼 청산·비청산 계약을 모두 저장소에 보고하는 틀에서는 보고의 출발점이 100입니다. 다만 위임 보고, 생애주기 사건과 양쪽 보고 방식 때문에 실제 제출 메시지 수는 계약 수와 같지 않을 수 있습니다." },
] as const;

export default function ContractDenominatorViz() {
  return (
    <SceneShell
      eyebrow="서로 다른 분모"
      title="같은 100칸에 청산 60과 보고 100이 겹칩니다"
      description="칸 하나가 계약 한 건입니다. 꽉 찬 파란 칸은 청산소 경로, 노란 점선 칸은 두 회사가 직접 담보를 관리하는 비청산 경로, 칸 안의 점은 거래정보저장소 보고 대상입니다. 60건과 100건은 본문의 설명용 가정입니다."
      ariaLabel="계약 100건 가운데 청산 60건과 비청산 40건, 그리고 100건 모두가 보고 대상이 되는 모습"
      scenes={SCENES}
      render={(active) => {
        const classified = active >= 1;
        const reported = active === 3;
        const focusBilateral = active === 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: TOTAL }, (_, index) => {
              const row = Math.floor(index / COLS);
              const col = index % COLS;
              const x = LEFT + col * (CELL + GAP);
              const y = rowY(row);
              const cleared = index < CLEARED;
              const fill = !classified ? "#cbd5e1" : cleared ? "#2563eb" : "none";
              const stroke = !classified ? "#94a3b8" : cleared ? "#2563eb" : "#d97706";
              const dim = focusBilateral && cleared ? 0.3 : 1;
              return (
                <g key={index} opacity={dim}>
                  <rect
                    x={x + 0.5}
                    y={y + 0.5}
                    width={CELL - 1}
                    height={CELL - 1}
                    rx={3}
                    fill={fill}
                    fillOpacity={classified && cleared ? 0.85 : 0.6}
                    stroke={stroke}
                    strokeWidth={1}
                    strokeDasharray={classified && !cleared ? "3 2" : undefined}
                  />
                  {reported && <circle cx={x + CELL / 2} cy={y + CELL / 2} r={3} fill={cleared ? "#ffffff" : "#64748b"} />}
                </g>
              );
            })}
            {classified && (
              <>
                <line x1={LEFT + GRID_W + 8} x2={LEFT + GRID_W + 8} y1={rowY(0)} y2={rowY(6) - GAP} stroke="#2563eb" strokeWidth={1} />
                <text x={LEFT + GRID_W + 14} y={rowY(3) - 4} fontSize={12} fontWeight={700} fill="#2563eb">청산 60건</text>
                <text x={LEFT + GRID_W + 14} y={rowY(3) + 12} fontSize={11} fill="#64748b">청산소 경로</text>
                <line x1={LEFT + GRID_W + 8} x2={LEFT + GRID_W + 8} y1={rowY(6)} y2={rowY(10) - GAP} stroke="#d97706" strokeWidth={1} strokeDasharray="3 2" />
                <text x={LEFT + GRID_W + 14} y={rowY(8) - 4} fontSize={12} fontWeight={700} fill="#b45309">비청산 40건</text>
                <text x={LEFT + GRID_W + 14} y={rowY(8) + 12} fontSize={11} fill="#64748b">양자 위험 완화</text>
              </>
            )}
            {!classified && (
              <text x={LEFT + GRID_W + 14} y={rowY(5)} fontSize={12} fontWeight={700} fill="#475569">계약 100건</text>
            )}
            {reported && (
              <text x={LEFT + GRID_W + 14} y={H - 6} fontSize={11} fontWeight={700} fill="#64748b">● 보고 100건</text>
            )}
          </svg>
        );
      }}
    />
  );
}
