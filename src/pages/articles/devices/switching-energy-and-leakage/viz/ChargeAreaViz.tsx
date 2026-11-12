import SceneShell from "./SceneShell";

/**
 * 본문 대응: #energy-ledger, #source-integral — 10 pF·3.3 V(가정) 한 왕복의 에너지 장부.
 * 가로 = 옮긴 전하 0→33 pC, 세로 = 전압. 넓이(전압×전하)가 에너지다.
 * 직사각형 3.3×33 = 108.9 pJ(공급), 아래 삼각형 ½×3.3×33 = 54.45 pJ(저장),
 * 위 삼각형 108.9 − 54.45 = 54.45 pJ(위쪽 소자 열), 방전 때 저장분 54.45 pJ → 아래쪽 소자 열.
 */
const W = 360;
const H = 210;
const X0 = 46;
const X1 = 326;
const Y_ZERO = 172;
const Y_TOP = 46;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const SLATE = "#64748b";

type Fill = "none" | "supply" | "stored" | "upperHeat" | "lowerHeat";

const SCENES = [
  { label: "충전: 공급원이 낸 에너지", summary: "3.3 V × 33 pC = 108.9 pJ", upper: "supply", lower: "supply", note: "공급선은 충전 내내 3.3 V이므로, 33 pC를 옮기는 동안 공급원이 낸 에너지는 3.3 V 높이의 직사각형 전체입니다." },
  { label: "충전: 용량에 남는 몫", summary: "½ × 3.3 V × 33 pC = 54.45 pJ", upper: "none", lower: "stored", note: "출력 전압은 0 V에서 시작해 전하가 쌓일수록 3.3 V까지 올라갑니다. 그래서 용량에 남는 에너지는 대각선 아래 삼각형, 직사각형의 절반입니다." },
  { label: "충전: 위쪽 소자의 열", summary: "108.9 − 54.45 = 54.45 pJ", upper: "upperHeat", lower: "stored", note: "직사각형에서 삼각형을 뺀 나머지 절반은 위쪽 소자의 저항성 경로에서 열이 됩니다. 충전 직후 저장량만 보면 이 몫을 빠뜨립니다." },
  { label: "방전: 공급원은 0", summary: "저장된 54.45 pJ → 아래쪽 소자의 열", upper: "upperHeat", lower: "lowerHeat", note: "출력이 내려갈 때 이 이상 모형의 공급원은 새 에너지를 내지 않습니다. 같은 33 pC가 아래쪽 길로 빠지며 저장했던 삼각형이 아래쪽 소자에서 열이 됩니다." },
  { label: "한 왕복의 합계", summary: "54.45 + 54.45 = 108.9 pJ", upper: "upperHeat", lower: "lowerHeat", note: "왕복의 시작과 끝에서 저장량은 0입니다. 공급원이 낸 108.9 pJ와 두 소자의 열을 더한 값이 같고, 이것이 CV²입니다." },
] as const satisfies readonly { label: string; summary: string; upper: Fill; lower: Fill; note: string }[];

const FILL_COLOR: Record<Fill, string> = { none: "transparent", supply: BLUE, stored: BLUE, upperHeat: AMBER, lowerHeat: RED };
const FILL_OPACITY: Record<Fill, number> = { none: 0, supply: 0.14, stored: 0.32, upperHeat: 0.3, lowerHeat: 0.3 };
const FILL_LABEL: Record<Fill, string> = { none: "", supply: "", stored: "저장 54.45 pJ", upperHeat: "위쪽 열 54.45 pJ", lowerHeat: "아래쪽 열 54.45 pJ" };
const TEXT_COLOR: Record<Fill, string> = { none: SLATE, supply: BLUE, stored: BLUE, upperHeat: "#b45309", lowerHeat: "#b91c1c" };

export default function ChargeAreaViz() {
  return (
    <SceneShell
      eyebrow="넓이로 보는 에너지 장부"
      title="공급한 108.9 pJ 중 절반만 용량에 남습니다"
      description="가로는 옮긴 전하, 세로는 그 순간의 전압입니다. 전압×전하가 에너지이므로 칠한 넓이가 에너지입니다. 10 pF·3.3 V는 본문의 가정값입니다."
      note="일정한 3.3 V 공급원에서 저항성 경로로 0 V와 3.3 V 사이를 완전히 충전·방전하는 이상 모형입니다. 전환 중 두 소자가 함께 켜지는 단락 전류와 내부 노드 손실은 뺐습니다."
      ariaLabel="전하-전압 평면에서 공급 에너지 직사각형, 저장 에너지 삼각형, 위쪽과 아래쪽 소자의 열을 차례로 보여 주는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const upper: Fill = scene.upper;
        const lower: Fill = scene.lower;
        const showRect = upper === "supply";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {/* 위 삼각형: 공급선과 출력 전압 사이 */}
            <polygon points={`${X0},${Y_ZERO} ${X0},${Y_TOP} ${X1},${Y_TOP}`} fill={FILL_COLOR[upper]} fillOpacity={FILL_OPACITY[upper]} />
            {/* 아래 삼각형: 출력 전압 아래 */}
            <polygon points={`${X0},${Y_ZERO} ${X1},${Y_ZERO} ${X1},${Y_TOP}`} fill={FILL_COLOR[lower]} fillOpacity={FILL_OPACITY[lower]} />
            {showRect && (
              <text x={(X0 + X1) / 2} y={(Y_TOP + Y_ZERO) / 2 + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>공급 108.9 pJ</text>
            )}
            {!showRect && (upper as string) !== "none" && (
              <text x={X0 + (X1 - X0) * 0.3} y={Y_TOP + 26} textAnchor="middle" fontSize={12} fontWeight={700} fill={TEXT_COLOR[upper]}>{FILL_LABEL[upper]}</text>
            )}
            {!showRect && (lower as string) !== "none" && (
              <text x={X0 + (X1 - X0) * 0.72} y={Y_ZERO - 14} textAnchor="middle" fontSize={12} fontWeight={700} fill={TEXT_COLOR[lower]}>{FILL_LABEL[lower]}</text>
            )}
            {/* 축 */}
            <line x1={X0} x2={X1 + 8} y1={Y_ZERO} y2={Y_ZERO} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X0} y1={Y_ZERO} y2={Y_TOP - 14} stroke="#94a3b8" strokeWidth={1} />
            {/* 공급선 전압 3.3 V (일정) */}
            <line x1={X0} x2={X1} y1={Y_TOP} y2={Y_TOP} stroke={BLUE} strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={X1} y={Y_TOP - 7} textAnchor="end" fontSize={11} fill={BLUE}>공급선 3.3 V (일정)</text>
            {/* 출력 전압 v: 전하에 비례해 0→3.3 V */}
            <line x1={X0} x2={X1} y1={Y_ZERO} y2={Y_TOP} stroke="#0f172a" strokeWidth={1.25} className="dark:stroke-slate-200" />
            <text x={X0 + (X1 - X0) * 0.5 + 6} y={(Y_ZERO + Y_TOP) / 2 + 22} fontSize={11} fill={SLATE} transform={`rotate(-24 ${X0 + (X1 - X0) * 0.5 + 6} ${(Y_ZERO + Y_TOP) / 2 + 22})`}>출력 전압 v</text>
            {/* 눈금 */}
            <text x={X0 - 6} y={Y_ZERO + 4} textAnchor="end" fontSize={11} fill={SLATE}>0</text>
            <text x={X0 - 6} y={Y_TOP + 4} textAnchor="end" fontSize={11} fill={SLATE}>3.3</text>
            <text x={X0 - 6} y={Y_TOP - 18} textAnchor="end" fontSize={11} fill={SLATE}>V</text>
            <text x={X1} y={Y_ZERO + 15} textAnchor="middle" fontSize={11} fill={SLATE}>33 pC</text>
            <text x={(X0 + X1) / 2} y={Y_ZERO + 30} textAnchor="middle" fontSize={11} fill={SLATE}>옮긴 전하 (0 → 33 pC)</text>
          </svg>
        );
      }}
    />
  );
}
