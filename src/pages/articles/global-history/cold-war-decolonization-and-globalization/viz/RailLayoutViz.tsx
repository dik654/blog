import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 식민 정부의 철도·항만은 광산·농장·수출항에 맞춰진 경우가 많았고,
 * 독립 정부는 국내 지역을 잇고자 했지만 세입·기술자·외화가 부족했다.
 * 지도는 배치 관계만 보이는 가정이며 특정 나라의 지도나 축척이 아니다.
 */
const SCENES = [
  { label: "식민지기의 선", summary: "광산·농장 → 수출항", note: "철도와 항만을 광산·농장·수출항에 맞춘 경우가 많았습니다. 짐이 바다로 나가는 방향으로 선이 모입니다.", step: 0 },
  { label: "국내 지역 사이", summary: "지역끼리 잇는 선이 없음", note: "수출에 맞춘 선만 있는 경우를 그렸습니다. 지역 ㄱ·ㄴ·ㄷ은 어느 선에도 올라 있지 않고 서로 이어지지도 않습니다.", step: 1 },
  { label: "독립 정부의 계획", summary: "잇고 싶지만 세입·기술자·외화 부족", note: "점선은 독립 정부가 놓으려는 선입니다. 수입품을 직접 만들고 학교와 병원을 넓히려는 계획도 같은 부족에 부딪혔습니다.", step: 2 },
] as const;

const REGIONS = [
  { name: "지역 ㄱ", x: 150, y: 26 },
  { name: "지역 ㄴ", x: 150, y: 110 },
  { name: "지역 ㄷ", x: 150, y: 194 },
] as const;

const SOURCES = [
  { name: "광산", x: 54, y: 52 },
  { name: "농장", x: 54, y: 168 },
] as const;

const PORT = { x: 306, y: 110 };

export default function RailLayoutViz() {
  return (
    <SceneShell
      eyebrow="선이 놓인 방향"
      title="철도가 수출항으로 모이면 국내 지역은 어떻게 남을까요"
      description="특정 나라의 지도가 아니라 글의 설명을 배치로 옮긴 가정입니다. 실선은 이미 있는 철도, 점선은 새로 놓으려는 선입니다."
      ariaLabel="광산과 농장에서 수출항으로 모이는 철도와, 이어지지 않은 국내 지역, 독립 정부가 놓으려는 선"
      scenes={SCENES}
      render={(active) => {
        const { step } = SCENES[active];
        return (
          <svg viewBox="0 0 360 224" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={328} y={4} width={28} height={216} fill="#2563eb" opacity={0.14} />
            <text x={342} y={30} textAnchor="middle" fontSize={12} fill="#2563eb">바다</text>
            {SOURCES.map((source) => (
              <line key={source.name} x1={source.x} y1={source.y} x2={PORT.x} y2={PORT.y} stroke="#475569" strokeWidth={1.25} />
            ))}
            {step === 2 && (
              <>
                <line x1={150} y1={36} x2={150} y2={100} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
                <line x1={150} y1={120} x2={150} y2={184} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
              </>
            )}
            {SOURCES.map((source) => (
              <g key={source.name}>
                <rect x={source.x - 28} y={source.y - 14} width={56} height={28} rx={8} fill="#64748b" />
                <text x={source.x} y={source.y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">{source.name}</text>
              </g>
            ))}
            <rect x={PORT.x - 30} y={PORT.y - 14} width={52} height={28} rx={8} fill="#2563eb" />
            <text x={PORT.x - 4} y={PORT.y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">수출항</text>
            {REGIONS.map((region) => (
              <g key={region.name}>
                <circle cx={region.x} cy={region.y} r={9} fill={step === 0 ? "#94a3b8" : "#d97706"} />
                <text x={region.x + 15} y={region.y + 5} fontSize={13} fontWeight={step === 0 ? 400 : 700} fill="currentColor">{region.name}</text>
              </g>
            ))}
            {step === 2 && (
              <text x={142} y={216} textAnchor="end" fontSize={12} fontWeight={700} fill="#d97706">점선 = 놓으려는 선</text>
            )}
          </svg>
        );
      }}
    />
  );
}
