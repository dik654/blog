import SceneShell from "./SurveillanceSceneShell";

/**
 * 본문 대응: #information-order-boundary 첫 문단 — 정보 ledger(생성·공개 시각, 접근 가능 역할, 정책 version),
 * 실제 access log, 공지 20분 전 매수, account/KYC/device/funding 관계(source·confidence).
 * 글이 정한 시각은 "공지 20분 전" 하나뿐입니다. 생성·열람 시각은 순서만 가정하고 축 간격은 비례하지 않습니다.
 */
const SCENES = [
  { label: "정보 ledger", summary: "생성 → 비공개 구간 → 공개", note: "상장 일정 같은 비공개 정보에는 생성 시각과 공개 시각, 접근 가능한 역할, 정책 version을 기록합니다. 가로축은 순서만 나타내며 간격은 비례하지 않습니다." },
  { label: "실제 access log", summary: "접근 가능 ≠ 실제 열람", note: "접근 가능한 역할 목록과 실제로 열어 본 기록은 따로 둡니다. 여기서는 직원 계정이 공개 전에 일정을 열람했다고 가정합니다." },
  { label: "공지 20분 전 매수", summary: "T − 20분", note: "직원과 연결됐다고 의심되는 외부 계정이 공지 20분 전에 매수합니다. 공지 전 매수라는 시간 순서만으로는 내부자 접근을 추정하지 않습니다." },
  { label: "계정 연결 근거", summary: "account · KYC · device · funding", note: "두 계정을 잇는 관계마다 출처(source)와 확신도(confidence)를 남깁니다. 이 묶음은 사람이 검토할 alert의 근거일 뿐이며, 위법 판단은 권한 있는 조사 절차가 합니다." },
] as const;

const W = 360;
const H = 220;
const LANE_X = 92;
const COL = [118, 186, 254, 326] as const;
const LANE_Y = [40, 88, 136, 184] as const;
const LANES = ["정보 ledger", "access log", "거래", "계정 연결"] as const;
const LINKS = ["account", "KYC", "device", "funding"] as const;

export default function InfoAccessTimelineViz() {
  return (
    <SceneShell
      eyebrow="Event time"
      title="공지 20분 전 매수를 정보 접근·계정 연결과 같은 시계에 놓습니다"
      description="글의 사례(상장 예정 토큰 X)를 네 줄로 나눴습니다. 정해진 시각은 '공지 20분 전'뿐이며, 생성·열람 시점의 위치는 순서만 나타낸 가정입니다."
      ariaLabel="정보 ledger, access log, 거래, 계정 연결을 같은 시간 순서에 놓는 과정"
      scenes={SCENES}
      render={(active) => {
        const on = (lane: number) => active >= lane;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {LANES.map((name, i) => (
              <g key={name} opacity={on(i) ? 1 : 0.3}>
                <text x={4} y={LANE_Y[i] + 4} fontSize={10} fontWeight={700} fill="#334155">{name}</text>
                <line x1={LANE_X} x2={W - 6} y1={LANE_Y[i]} y2={LANE_Y[i]} stroke="#e2e8f0" strokeWidth={1} />
              </g>
            ))}
            <line x1={COL[3]} x2={COL[3]} y1={20} y2={H - 14} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={COL[3]} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">공지 T</text>
            <text x={COL[2]} y={14} textAnchor="middle" fontSize={10} fill={on(2) ? "#dc2626" : "#94a3b8"}>T − 20분</text>

            <rect x={COL[0]} y={LANE_Y[0] - 7} width={COL[3] - COL[0]} height={14} fill="#f1f5f9" />
            <circle cx={COL[0]} cy={LANE_Y[0]} r={4} fill="#475569" />
            <circle cx={COL[3]} cy={LANE_Y[0]} r={4} fill="#475569" />
            <text x={COL[0]} y={LANE_Y[0] + 20} textAnchor="middle" fontSize={9} fill="#475569">생성</text>
            <text x={(COL[0] + COL[3]) / 2} y={LANE_Y[0] + 3} textAnchor="middle" fontSize={9} fill="#64748b">비공개 구간 · 접근 가능 역할 · 정책 version</text>
            <text x={COL[3]} y={LANE_Y[0] + 20} textAnchor="middle" fontSize={9} fill="#475569">공개</text>

            <g opacity={on(1) ? 1 : 0.2}>
              <circle cx={COL[1]} cy={LANE_Y[1]} r={5} fill="#2563eb" />
              <text x={COL[1]} y={LANE_Y[1] - 10} textAnchor="middle" fontSize={9} fontWeight={700} fill="#1d4ed8">직원 계정 열람</text>
              <text x={COL[1]} y={LANE_Y[1] + 17} textAnchor="middle" fontSize={9} fill="#64748b">(가정) 매수 전</text>
            </g>

            <g opacity={on(2) ? 1 : 0.2}>
              <circle cx={COL[2]} cy={LANE_Y[2]} r={5} fill="#dc2626" />
              <text x={COL[2]} y={LANE_Y[2] - 10} textAnchor="middle" fontSize={9} fontWeight={700} fill="#b91c1c">외부 계정 매수</text>
              <line x1={COL[2] + 7} x2={COL[3] - 4} y1={LANE_Y[2] + 12} y2={LANE_Y[2] + 12} stroke="#dc2626" strokeWidth={1} />
              <text x={(COL[2] + COL[3]) / 2} y={LANE_Y[2] + 24} textAnchor="middle" fontSize={9} fill="#b91c1c">20분</text>
            </g>

            <g opacity={on(3) ? 1 : 0}>
              <line x1={COL[1]} x2={COL[1]} y1={LANE_Y[1] + 22} y2={LANE_Y[3] - 16} stroke="#2563eb" strokeWidth={1} />
              <line x1={COL[2]} x2={COL[2]} y1={LANE_Y[2] + 28} y2={LANE_Y[3] - 16} stroke="#dc2626" strokeWidth={1} />
              <line x1={104} x2={330} y1={LANE_Y[3] - 16} y2={LANE_Y[3] - 16} stroke="#64748b" strokeWidth={1} />
              {LINKS.map((name, i) => {
                const x = 104 + i * 58;
                return (
                  <g key={name}>
                    <rect x={x} y={LANE_Y[3] - 9} width={52} height={18} rx={8} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
                    <text x={x + 26} y={LANE_Y[3] + 4} textAnchor="middle" fontSize={9} fill="#334155">{name}</text>
                  </g>
                );
              })}
              <text x={(104 + 104 + 3 * 58 + 52) / 2} y={LANE_Y[3] + 24} textAnchor="middle" fontSize={9} fill="#475569">관계마다 source · confidence 기록</text>
            </g>
            {active === 2 && (
              <text x={(COL[1] + COL[2]) / 2} y={LANE_Y[3] + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b91c1c">시간 순서만으로 내부자 접근을 추정하지 않음</text>
            )}
          </svg>
        );
      }}
    />
  );
}
