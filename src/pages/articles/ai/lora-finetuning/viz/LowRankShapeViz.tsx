import SceneShell from "./SceneShell";

/**
 * 본문 대응: #lora — d_in = d_out = 4096, r = 8 예시.
 * Full update 4096×4096 = 16,777,216개, A 8×4096 = 32,768개, B 4096×8 = 32,768개.
 * 합 65,536개 = full의 0.390625%(약 0.39%). BA의 rank는 중간 폭 r = 8을 넘지 못합니다.
 * 띠 두께는 보이도록 과장했습니다. 실제 비율이면 8/4096, 정사각형 폭의 약 0.2%입니다.
 */
const FULL = 4096 * 4096;
const PART = 8 * 4096;
const LORA = 2 * PART;

const SCENES = [
  {
    label: "제한 없는 full update",
    summary: "4096 × 4096 = 16,777,216개",
    note: "Base weight W와 같은 크기의 변화량 ΔW를 직접 학습하면 칸 하나하나가 따로 움직이는 값이라 1,678만 개를 모두 학습해야 합니다.",
  },
  {
    label: "B와 A의 곱으로 바꿉니다",
    summary: "B[4096×8] · A[8×4096]",
    note: "세로로 긴 B와 가로로 긴 A를 곱하면 다시 4096×4096 정사각형이 나옵니다. 그래서 base 출력에 더할 수 있습니다. 띠 두께는 보이도록 과장했고, 실제 비율이면 정사각형 폭의 약 0.2%입니다.",
  },
  {
    label: "학습하는 값은 두 띠뿐입니다",
    summary: "32,768 + 32,768 = 65,536개",
    note: "학습하는 칸은 A와 B에만 있습니다. 8·(4096+4096) = 65,536개로 full update의 약 0.39%입니다. 가운데 정사각형의 값은 이 두 띠에서 계산될 뿐 따로 학습하지 않습니다.",
  },
  {
    label: "변화 방향은 최대 8개",
    summary: "rank(BA) ≤ 8",
    note: "BA는 B의 k번째 열과 A의 k번째 행을 곱한 판 8장의 합입니다. 판 하나는 한 방향의 변화(rank 1)만 담으므로, 1,678만 칸이 있어도 독립 변화 방향은 최대 8개입니다.",
  },
] as const;

const S = 150;
const X0 = 70;
const Y0 = 44;
const STRIP = 14;

export default function LowRankShapeViz() {
  return (
    <SceneShell
      eyebrow="Low-rank 모양"
      title="얇은 두 띠를 곱해 큰 정사각형 update를 만듭니다"
      description="d_in = d_out = 4096, r = 8 예시입니다. 정사각형은 update 행렬 ΔW, 세로 띠는 B, 가로 띠는 A입니다. 띠 두께는 실제 비율보다 과장했습니다."
      ariaLabel="4096 곱하기 4096 full update와 B 4096 곱하기 8, A 8 곱하기 4096의 모양과 parameter 수 비교"
      scenes={SCENES}
      render={(active) => {
        const showFactors = active >= 1;
        const trainFactors = active >= 2;
        const fullTrain = active === 0;
        const factorColor = trainFactors ? "#2563eb" : "#64748b";
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 340 238" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {showFactors && (
                <g>
                  <rect x={X0 - STRIP - 12} y={Y0} width={STRIP} height={S} rx={2} fill={trainFactors ? "#dbeafe" : "#f1f5f9"} stroke={factorColor} strokeWidth={1.25} />
                  <text x={X0 - STRIP / 2 - 12} y={Y0 + S + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill={factorColor}>B</text>
                  <text x={X0 - STRIP - 16} y={Y0 + S / 2} textAnchor="end" fontSize={10} fill="#64748b">4096</text>
                  <rect x={X0} y={Y0 - STRIP - 8} width={S} height={STRIP} rx={2} fill={trainFactors ? "#dbeafe" : "#f1f5f9"} stroke={factorColor} strokeWidth={1.25} />
                  <text x={X0 + S + 6} y={Y0 - 11} fontSize={11} fontWeight={700} fill={factorColor}>A</text>
                  <text x={X0 + S / 2} y={Y0 - STRIP - 12} textAnchor="middle" fontSize={10} fill="#64748b">4096</text>
                </g>
              )}
              <rect
                x={X0}
                y={Y0}
                width={S}
                height={S}
                rx={2}
                fill={fullTrain ? "#dbeafe" : "#f8fafc"}
                stroke={fullTrain ? "#2563eb" : "#94a3b8"}
                strokeWidth={fullTrain ? 1.25 : 1}
                strokeDasharray={showFactors ? "4 3" : undefined}
              />
              {active === 3 && (
                <text x={X0 + S / 2} y={232} textAnchor="middle" fontSize={11} fill="#2563eb">
                  ΔW = B열1·A행1 + … + B열8·A행8
                </text>
              )}
              <text x={X0 + S / 2} y={Y0 + S / 2 - 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={fullTrain ? "#2563eb" : "#475569"}>
                ΔW
              </text>
              <text x={X0 + S / 2} y={Y0 + S / 2 + 12} textAnchor="middle" fontSize={10} fill="#64748b">
                {active === 3 ? "판 8장의 합" : fullTrain ? "칸마다 학습" : "= B · A (계산값)"}
              </text>
              {!showFactors && (
                <>
                  <text x={X0 + S / 2} y={Y0 - 8} textAnchor="middle" fontSize={10} fill="#64748b">4096</text>
                  <text x={X0 - 6} y={Y0 + S / 2} textAnchor="end" fontSize={10} fill="#64748b">4096</text>
                </>
              )}
              <g transform="translate(244 40)">
                <text x={0} y={0} fontSize={10} fill="#64748b">{active === 1 ? "곱의 모양" : "학습하는 값"}</text>
                <text x={0} y={20} fontSize={14} fontWeight={700} fill="#2563eb">
                  {active === 1 ? "4096 × 4096" : (active === 0 ? FULL : LORA).toLocaleString("en-US")}
                </text>
                <text x={0} y={38} fontSize={10} fill="#64748b">
                  {active === 0 ? "full update 전체" : active === 1 ? "W와 같은 크기" : "A·B 두 띠"}
                </text>
                {active >= 2 && (
                  <>
                    <text x={0} y={66} fontSize={10} fill="#64748b">full 대비</text>
                    <text x={0} y={84} fontSize={14} fontWeight={700} fill="#2563eb">
                      약 {((LORA / FULL) * 100).toFixed(2)}%
                    </text>
                  </>
                )}
                {active === 3 && (
                  <>
                    <text x={0} y={112} fontSize={10} fill="#64748b">독립 변화 방향</text>
                    <text x={0} y={130} fontSize={14} fontWeight={700} fill="#2563eb">최대 8개</text>
                  </>
                )}
              </g>
            </svg>
          </div>
        );
      }}
    />
  );
}
