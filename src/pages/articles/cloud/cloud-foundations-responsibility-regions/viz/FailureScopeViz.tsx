import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 한 지역 안의 독립 장소 두 곳(3대씩, 6절 용어 예시)과 다른 지역의 데이터 복구본.
 * 건물 하나의 전력·냉각·망 장애는 다른 장소가 받을 수 있고, 큰 자연재해·지역 연결 문제는
 * 같은 지역의 여러 장소에 함께 영향을 줄 수 있다. 그래서 무엇을 어디까지 분리했는지 따로 적는다.
 */
const W = 360;
const H = 164;

const SCENES = [
  {
    label: "배치",
    summary: "한 지역 두 장소 + 다른 지역 복구본",
    note: "독립 장소는 전력·냉각·망을 따로 쓰도록 묶은 데이터센터이고, 6절에서 가용 영역이라고 부릅니다. 지역은 리전입니다. 실행 자원 6대를 두 장소에 3대씩 나누고 다른 지역에 데이터 복구본을 둔 배치를 가정합니다.",
  },
  {
    label: "건물 하나가 멈춤",
    summary: "장소 1 장애 → 장소 2가 받음",
    note: "장소 1의 전력·냉각·망이 멈춰도 같은 지역의 장소 2에 있는 3대가 요청을 받을 수 있습니다. 두 장소에 나눠 둔 효과가 여기서 나옵니다.",
  },
  {
    label: "지역 전체 문제",
    summary: "두 장소가 함께 멈출 수 있음",
    note: "큰 자연재해나 지역 연결 문제는 같은 지역의 여러 장소에 함께 영향을 줄 수 있습니다. 이때 남는 것은 다른 지역의 복구본뿐이므로, 두 장소 배포만으로는 이 장애를 견딘다고 말할 수 없습니다.",
  },
  {
    label: "따로 적을 세 가지",
    summary: "나눔 · 복구본 · 전환 시험",
    note: "‘여러 곳에 배포했다’ 대신 세 가지를 따로 적습니다. 두 독립 장소에 실행 자원을 나눴는가, 다른 지역에도 데이터 복구본이 있는가, 그 복구본으로 전환하는 일을 실제로 시험했는가.",
  },
] as const;

const CHECKS = [
  { text: "두 장소에 나눴나", known: true },
  { text: "다른 지역 복구본", known: true },
  { text: "전환을 시험했나", known: false },
] as const;

const BLUE = "#2563eb";
const RED = "#dc2626";
const GRAY = "#94a3b8";
const MUTED = "#64748b";
// 이름 글자는 다크 모드에서도 읽히도록 본문 글자색을 따릅니다.
const INK = "currentColor";

function Place({ x, label, down, taking }: { x: number; label: string; down: boolean; taking: boolean }) {
  const color = down ? RED : taking ? BLUE : GRAY;
  return (
    <g>
      <rect x={x} y={52} width={98} height={92} rx={8} fill="none" stroke={color} strokeWidth={down || taking ? 1.25 : 1} strokeDasharray={down ? "4 3" : undefined} />
      <text x={x + 49} y={70} textAnchor="middle" fontSize={11} fontWeight={700} fill={down ? RED : INK}>{label}</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={x + 10 + i * 27} y={82} width={23} height={26} rx={4} fill={down ? "none" : "#dbeafe"} stroke={down ? RED : BLUE} strokeWidth={1} strokeDasharray={down ? "3 2" : undefined} />
          {down && (
            <>
              <line x1={x + 14 + i * 27} y1={86} x2={x + 29 + i * 27} y2={104} stroke={RED} strokeWidth={1.25} />
              <line x1={x + 29 + i * 27} y1={86} x2={x + 14 + i * 27} y2={104} stroke={RED} strokeWidth={1.25} />
            </>
          )}
        </g>
      ))}
      <text x={x + 49} y={128} textAnchor="middle" fontSize={10.5} fill={down ? RED : taking ? BLUE : MUTED} fontWeight={down || taking ? 700 : 400}>
        {down ? "멈춤" : taking ? "요청을 받음" : "서버 3대"}
      </text>
    </g>
  );
}

export default function FailureScopeViz() {
  return (
    <SceneShell
      eyebrow="장애 범위"
      title="건물 하나의 고장과 지역 전체의 고장은 남는 것이 다릅니다"
      description="큰 상자가 지역, 안쪽 상자가 독립 장소입니다. 칸 하나가 실행 자원 한 대이며, 배치 자체는 설명을 위한 예입니다(가정)."
      ariaLabel="한 지역의 두 독립 장소와 다른 지역 복구본이 장애 범위에 따라 어떻게 남는지"
      scenes={SCENES}
      render={(active) => {
        const placeOneDown = active === 1 || active === 2;
        const regionDown = active === 2;
        const checklist = active === 3;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={6} y={22} width={226} height={136} rx={10} fill="none" stroke={regionDown ? RED : MUTED} strokeWidth={regionDown ? 1.25 : 1} />
              <text x={14} y={16} fontSize={11} fontWeight={700} fill={regionDown ? RED : INK}>지역 A</text>
              <text x={228} y={16} textAnchor="end" fontSize={10.5} fill={regionDown ? RED : MUTED}>{regionDown ? "자연재해·지역 연결 문제" : "리전"}</text>
              <text x={16} y={42} fontSize={10.5} fill={MUTED}>독립 장소(가용 영역) 두 곳</text>
              <Place x={16} label="장소 1" down={placeOneDown} taking={false} />
              <Place x={124} label="장소 2" down={regionDown} taking={active === 1} />

              <rect x={250} y={22} width={104} height={136} rx={10} fill="none" stroke={regionDown ? BLUE : MUTED} strokeWidth={regionDown ? 1.25 : 1} />
              <text x={258} y={16} fontSize={11} fontWeight={700} fill={INK}>지역 B</text>
              <rect x={262} y={74} width={80} height={44} rx={6} fill={regionDown ? "#dbeafe" : "none"} stroke={BLUE} strokeWidth={1} />
              <text x={302} y={93} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={BLUE}>데이터</text>
              <text x={302} y={108} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={BLUE}>복구본</text>
              <text x={302} y={138} textAnchor="middle" fontSize={10.5} fill={regionDown ? BLUE : MUTED} fontWeight={regionDown ? 700 : 400}>
                {regionDown ? "남은 것" : "다른 지역"}
              </text>

              <line x1={234} y1={96} x2={258} y2={96} stroke={checklist ? "#d97706" : GRAY} strokeWidth={1} strokeDasharray="3 3" />
              <path d="M254 92 L260 96 L254 100" fill="none" stroke={checklist ? "#d97706" : GRAY} strokeWidth={1} />

            </svg>
            <ol className={`mt-3 grid grid-cols-3 gap-2 text-xs leading-5 ${checklist ? "" : "opacity-40"}`}>
              {CHECKS.map((item, index) => (
                <li key={item.text} className={`rounded-md border px-2 py-1.5 ${checklist ? (item.known ? "border-blue-600" : "border-amber-600") : "border-border"}`}>
                  <span className="block font-semibold">{index + 1}. {item.text}</span>
                  <span className={`block ${item.known ? "text-blue-700 dark:text-blue-300" : "text-amber-800 dark:text-amber-300"}`}>
                    {item.known ? "그림에 있음" : "그림만으론 모름"}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        );
      }}
    />
  );
}
