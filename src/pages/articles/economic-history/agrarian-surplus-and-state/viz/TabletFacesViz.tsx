import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 앞면에 거래별 곡물 양, 뒷면에 합계를 두는 관행과, MSVO 3, 75의 뒷면 기준값 칸.
 * 칸 수와 배치는 설명을 위한 모식(가정)이며 실제 점토판의 판독이 아니다. 1과 2/5 바리그만 본문의 값이다.
 */
const FRONT_CELLS = [0, 1, 2, 3].flatMap((row) => [0, 1].map((col) => ({ row, col })));
const FX = 12;
const FY = 28;
const FW = 150;
const FH = 138;
const BX = 198;

const SCENES = [
  { label: "앞면: 거래별 양", summary: "칸마다 거래 하나", mode: 0, note: "여러 원시 설형문자 장부는 앞면에 거래별 곡물 양을 적습니다. 원시 설형문자는 뒤의 설형문자보다 앞선 초기 문자입니다." },
  { label: "뒷면: 합계", summary: "앞면의 양을 모은 칸", mode: 1, note: "점토판을 뒤집으면 합계를 둡니다. 앞뒤를 맞춰 보면 장부의 계산 형식이 드러납니다." },
  { label: "한 장의 별난 칸: MSVO 3, 75", summary: "뒷면 한 칸 = 1과 2/5 바리그", mode: 2, note: "에머밀 배급 장부의 뒷면 한 칸이 기준값을 줍니다. 바리그는 곡물 부피 단위입니다. 저자는 이 값으로 가중평균(값마다 비중을 달리 매긴 평균)을 내면 다른 값들이 설명된다고 보고 이 칸을 열쇠라고 부릅니다." },
  { label: "그래서 연습판으로 분류됩니다", summary: "정규 행정 문서가 아님", mode: 3, note: "같은 방식을 쓴 장부가 달리 확인되지 않아, 이 점토판은 정규 행정 문서가 아니라 비정규 서기 연습으로 분류됩니다. 합계 관행과 이 칸을 같은 근거로 섞어 읽지 않습니다." },
] as const;

export default function TabletFacesViz() {
  return (
    <SceneShell
      eyebrow="점토판의 앞뒤"
      title="앞면의 거래와 뒷면의 칸이 어떻게 맞물리나"
      description="칸의 수와 배치는 설명을 위한 모식(가정)이며 실제 점토판의 판독이 아닙니다."
      ariaLabel="원시 설형문자 장부의 앞면 거래 칸과 뒷면 합계 칸, 기준값 칸의 관계"
      scenes={SCENES}
      render={(active) => {
        const mode = SCENES[active].mode;
        const key = mode >= 2;
        const accent = key ? "#d97706" : "#2563eb";
        return (
          <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={FX + FW / 2} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">앞면</text>
            <rect x={FX} y={FY} width={FW} height={FH} rx={12} fill="#94a3b8" fillOpacity={0.14} stroke="#94a3b8" />
            {FRONT_CELLS.map(({ row, col }) => (
              <rect key={`${row}-${col}`} x={FX + 12 + col * 66} y={FY + 12 + row * 29} width={60} height={23} rx={3} fill={mode === 0 ? "#2563eb" : key ? "#d97706" : "#94a3b8"} fillOpacity={mode === 0 ? 0.3 : key ? 0.22 : 0.3} stroke={mode === 0 ? "#2563eb" : key ? "#d97706" : "#94a3b8"} />
            ))}
            <text x={BX + FW / 2} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">뒷면</text>
            <rect x={BX} y={FY} width={FW} height={FH} rx={12} fill="#94a3b8" fillOpacity={0.14} stroke="#94a3b8" />
            <rect x={BX + 14} y={FY + 34} width={FW - 28} height={70} rx={4} fill={mode === 0 ? "none" : accent} fillOpacity={0.14} stroke={mode === 0 ? "#94a3b8" : accent} strokeDasharray={mode === 0 ? "3 3" : undefined} />
            {mode === 1 && <text x={BX + FW / 2} y={FY + 74} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">합계</text>}
            {key && (
              <>
                <text x={BX + FW / 2} y={FY + 62} textAnchor="middle" fontSize={13} fontWeight={700} fill="#d97706">기준값 칸</text>
                <text x={BX + FW / 2} y={FY + 84} textAnchor="middle" fontSize={12} fill="#d97706">1과 2/5 바리그</text>
              </>
            )}
            <text x={180} y={186} textAnchor="middle" fontSize={12} fontWeight={700} fill={key ? "#d97706" : "#64748b"}>{mode === 3 ? "MSVO 3, 75 한 장 · 비정규 서기 연습" : key ? "MSVO 3, 75 한 장" : "여러 장부의 관행"}</text>
            {mode > 0 && (
              <>
                <line x1={FX + FW + 4} x2={BX - 7} y1={FY + FH / 2} y2={FY + FH / 2} stroke={accent} strokeWidth={1.25} />
                <path d={mode === 1 ? `M ${BX - 2} ${FY + FH / 2} l -7 -4 v 8 Z` : `M ${FX + FW + 2} ${FY + FH / 2} l 7 -4 v 8 Z`} fill={accent} />
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
