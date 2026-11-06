import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 화면만 보고 전체 분포를 역으로 확정할 수 없다.
 * 화면 10칸 중 반대 1칸은 같게 두고 전체 반대 글을 10개/50개로 바꾼 예시(수치는 모두 가정).
 */
const CELL = 13;
const STEP = 15;
const GX = 16;
const GY = 32;
const SHOWN = new Set([13, 1, 5, 10, 12, 21, 25, 30, 32, 41]);

const isOpposedA = (index: number) => index % 10 === 3;
const isOpposedB = (index: number) => (Math.floor(index / 10) + (index % 10)) % 2 === 0;

const SCENES = [
  { label: "화면에서 보이는 것", summary: "10칸 중 반대 의견 1칸 (가정)", note: "이용자가 볼 수 있는 것은 오른쪽 10칸입니다. 왼쪽 100개가 어떻게 나뉘어 있는지는 이 화면에 나오지 않습니다." },
  { label: "설명 하나: 실제로 적게 썼다", summary: "전체 10개 → 화면 1칸 (가정)", note: "전체 100개 중 반대 글이 10개뿐이었다면 화면의 10칸 중 1칸은 전체 비중과 같습니다. 작성량이 적어 적게 보인 경우입니다." },
  { label: "설명 둘: 배치 기준이 밀어냈다", summary: "전체 50개 → 화면 1칸 (가정)", note: "전체에 반대 글이 50개여도 고르는 기준에 따라 화면은 똑같이 1칸일 수 있습니다. 같은 화면에서 두 전체가 모두 가능하니, 화면만으로 전체를 확정할 수 없습니다." },
] as const;

export default function ScreenInferenceViz() {
  return (
    <SceneShell
      eyebrow="보이는 표본과 전체"
      title="같은 화면 뒤에 서로 다른 전체가 있을 수 있습니다"
      description="두 경우의 반대 글 수와 칸 자리는 설명을 위한 가정입니다."
      ariaLabel="같은 화면 10칸이 서로 다른 전체 게시물 분포에서 나올 수 있음을 비교"
      scenes={SCENES}
      render={(active) => {
        const opposed = active === 1 ? isOpposedA : isOpposedB;
        const screen = [true, ...Array.from({ length: 9 }, () => false)];
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={GX} y={20} fontSize={13} fontWeight={700} fill="#64748b">전체 게시물 100개</text>
            {Array.from({ length: 100 }, (_, index) => {
              const x = GX + (index % 10) * STEP;
              const y = GY + Math.floor(index / 10) * STEP;
              if (active === 0) return <rect key={index} x={x} y={y} width={CELL} height={CELL} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />;
              const shown = SHOWN.has(index);
              return <rect key={index} x={x} y={y} width={CELL} height={CELL} rx={2} fill={opposed(index) ? "#d97706" : "#cbd5e1"} stroke={shown ? "#2563eb" : "none"} strokeWidth={1.25} opacity={shown ? 1 : 0.7} />;
            })}
            {active === 0 && <text x={GX + 75} y={GY + 80} textAnchor="middle" fontSize={22} fontWeight={700} fill="#64748b">?</text>}
            <line x1={178} x2={232} y1={106} y2={106} stroke="#64748b" strokeWidth={1} />
            <path d="M232 106 l-6 -4 v8 z" fill="#64748b" />
            <text x={205} y={98} textAnchor="middle" fontSize={13} fill="#64748b">선택</text>
            <text x={244} y={20} fontSize={13} fontWeight={700} fill="#2563eb">이용자 화면 10칸</text>
            {screen.map((isOpp, index) => (
              <rect key={index} x={244 + (index % 2) * 28} y={GY + Math.floor(index / 2) * 29} width={24} height={25} rx={2} fill={isOpp ? "#d97706" : "#cbd5e1"} stroke="#2563eb" strokeWidth={1} />
            ))}
            <rect x={GX} y={194} width={10} height={10} rx={2} fill="#d97706" />
            <text x={GX + 14} y={203} fontSize={13} fill="#64748b">반대 의견</text>
            <rect x={GX + 76} y={194} width={10} height={10} rx={2} fill="#cbd5e1" />
            <text x={GX + 90} y={203} fontSize={13} fill="#64748b">그 밖의 글</text>
            <rect x={GX + 158} y={194} width={10} height={10} rx={2} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            <text x={GX + 172} y={203} fontSize={13} fill="#64748b">테두리 = 화면에 오른 글</text>
          </svg>
        );
      }}
    />
  );
}
