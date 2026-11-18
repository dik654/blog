import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case 둘째 문단 — "상류 겨울 발전과 하류 여름 관개". 물은 같은 시점으로 완전히 바꿔 쓸 수 없다.
 * 7절: 물·전력 교환이 끊기면 한 나라의 결정이 이웃의 식량·전력에 전달된다. 8절: 1998년 3월 17일 3국 협정.
 * 물의 양과 협정의 조건은 글에 없어 숫자·굵기로 그리지 않는다. 강 하나를 단순화한 약도(가정).
 */
const WATER = "#0284c7";
const POWER = "#d97706";
const FIELD = "#16a34a";
const DIM = "#94a3b8";

const SCENES = [
  { label: "겨울: 상류는 발전에 쓰려 합니다", summary: "겨울 방류 → 전력", season: "winter", note: "상류 저수지의 물을 겨울에 흘려보내면 발전기를 돌려 전력을 만듭니다. 3절이 짚은 '상류 겨울 발전'입니다." },
  { label: "여름: 하류는 관개에 쓰려 합니다", summary: "여름 방류 → 관개", season: "summer", note: "하류의 밭은 여름에 물이 필요합니다. 3절이 짚은 '하류 여름 관개'입니다." },
  { label: "같은 저수지, 다른 계절", summary: "언제 흘릴지가 충돌", season: "both", note: "실제 물은 같은 시점으로 완전히 바꿔 쓸 수 없어서, 물 100의 칸처럼 바로 맞바꾸지 못합니다. 7절은 이 자리에 물·전력 교환을 놓고, 8절은 그 교환이 제도로 맺어진 예로 1998년 3월 17일 카자흐스탄·키르기스스탄·우즈베키스탄 협정을 듭니다. 협정의 조건과 물의 양은 글에 없어 그리지 않았습니다." },
] as const;

function Season({ x, label, on }: { x: number; label: string; on: boolean }) {
  return (
    <g>
      <rect x={x + 0.5} y={8.5} width={79} height={23} rx={8} fill={on ? "#0284c7" : "none"} fillOpacity={0.12} stroke={on ? WATER : DIM} strokeWidth={1} />
      <text x={x + 40} y={24} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 500} fill="currentColor" opacity={on ? 1 : 0.55}>{label}</text>
    </g>
  );
}

export default function UpstreamDownstreamSeasonViz() {
  return (
    <SceneShell
      eyebrow="상류와 하류의 계절"
      title="같은 강물을 상류는 겨울에, 하류는 여름에 원합니다"
      description="강 하나를 단순하게 그린 약도입니다(가정). 왼쪽이 상류, 오른쪽이 하류이고 선 굵기는 물의 양이 아닙니다."
      ariaLabel="상류 저수지의 겨울 발전 방류와 하류의 여름 관개 수요가 시점에서 충돌하는 구조"
      scenes={SCENES}
      render={(active) => {
        const season = SCENES[active].season;
        const winter = season === "winter" || season === "both";
        const summer = season === "summer" || season === "both";
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Season x={60} label="겨울" on={winter} />
            <Season x={220} label="여름" on={summer} />

            <path d="M8,150 L44,70 L66,98 L92,52 L132,150 Z" fill={DIM} fillOpacity={0.12} stroke={DIM} strokeWidth={1} />
            <text x={70} y={142} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.75}>상류 산지</text>

            <rect x={104.5} y={104.5} width={45} height={31} rx={4} fill={WATER} fillOpacity={0.18} stroke={WATER} strokeWidth={1} />
            <text x={127} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">저수지</text>
            <line x1={152} y1={100} x2={152} y2={140} stroke="currentColor" strokeWidth={1.25} />

            <g opacity={winter ? 1 : 0.35}>
              <circle cx={172} cy={86} r={13} fill="none" stroke={winter ? POWER : DIM} strokeWidth={1.25} />
              <path d="M166,86 L172,78 L172,86 L178,86 L172,94 L172,86" fill="none" stroke={winter ? POWER : DIM} strokeWidth={1} />
              <text x={192} y={82} fontSize={11.5} fontWeight={700} fill={winter ? POWER : "currentColor"}>발전</text>
              <text x={192} y={96} fontSize={11} fill="currentColor">겨울 방류</text>
            </g>

            <path d="M152,128 C200,128 220,150 260,150 L352,150" fill="none" stroke={WATER} strokeWidth={1.25} strokeDasharray={season === "both" ? "5 3" : undefined} />
            <text x={206} y={168} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.75}>강 → 하류</text>

            <g opacity={summer ? 1 : 0.35}>
              {[0, 1, 2].map((row) => (
                <rect key={row} x={272.5} y={92.5 + row * 16} width={79} height={11} rx={2} fill={summer ? FIELD : DIM} fillOpacity={0.2} stroke={summer ? FIELD : DIM} strokeWidth={1} />
              ))}
              <text x={312} y={82} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={summer ? FIELD : "currentColor"}>관개 밭</text>
              <text x={312} y={178} textAnchor="middle" fontSize={11} fill="currentColor">여름 방류</text>
            </g>

            {season === "both" && (
              <g>
                <rect x={8.5} y={170.5} width={150} height={23} rx={8} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                <text x={83} y={186} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">한 물, 두 시점</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
