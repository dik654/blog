import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundary — 글이 인용한 Feast 0.66.0 문서의 구분.
 * 기본 시점 일치 결합은 사건 시각만 제한하고, filter_by_created_timestamp=True가 생성 시각까지 제한합니다.
 * 그 옵션도 생성 시각 필드가 실제 도착 시각을 뜻해야 효과가 있습니다.
 * 활력 기록(사건 09:40, 첫 도착 09:42)에 10:30 수정본이 생긴다는 설정과 09:55 기록값은 가정입니다.
 */
const START = 9 * 60 + 30;
const SPAN = 70;
const W = 340;
const PAD = 16;
const tx = (minute: number) => PAD + ((minute - START) / SPAN) * (W - 2 * PAD);
const CUTOFF = 600;
const EVENT = 580;
const V1 = 582;
const V2_REAL = 630;
const V2_STAMP = 595;

const SCENES = [
  {
    label: "한 사건, 수정본 두 개",
    summary: "v1 09:42 · v2 10:30 (가정)",
    note: "09:40 활력 사건의 첫 값 v1은 09:42에, 수정본 v2는 10:30에 생겼다고 둡니다(가정). 둘 다 사건 시각은 09:40입니다.",
  },
  {
    label: "사건 시각만 제한하면",
    summary: "v2를 고를 수 있음",
    note: "사건 시각 09:40은 10:00 이전이라 두 수정본 모두 통과합니다. 사건 시각만 보는 기본 결합은 10시에 없던 v2를 고를 수 있습니다.",
  },
  {
    label: "생성 시각까지 제한하면",
    summary: "v1만 남음",
    note: "filter_by_created_timestamp=True로 생성 시각도 10:00 이하로 제한하면 v2가 빠지고 그때 있던 v1이 남습니다.",
  },
  {
    label: "생성 시각이 도착 시각과 다르면",
    summary: "v2가 다시 통과",
    note: "v2의 생성 시각 필드에 실제 도착 10:30 대신 09:55가 적혀 있다면(가정) 옵션을 켜도 v2가 통과합니다. 생성 시각이 실제 도착 시각을 뜻해야 합니다.",
  },
] as const;

function Version({
  x,
  y,
  label,
  color,
  faded,
}: {
  x: number;
  y: number;
  label: string;
  color: string;
  faded: boolean;
}) {
  return (
    <g opacity={faded ? 0.35 : 1}>
      <rect x={x - 15} y={y - 10} width={30} height={20} rx={4} fill="#ffffff" stroke={color} strokeWidth={1.25} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function RevisionJoinViz() {
  return (
    <SceneShell
      eyebrow="수정본과 결합"
      title="사건 시각만 보면 10시에 없던 수정본이 들어올 수 있습니다"
      description="가로축은 시각, 세로선은 입력 마감 10:00입니다. 위 줄은 사건 시각, 아래 줄은 수정본이 생긴 시각입니다. v2와 그 시각들은 설명용 가정입니다."
      ariaLabel="같은 사건의 두 수정본이 사건 시각 제한과 생성 시각 제한에서 어떻게 결합되는지"
      scenes={SCENES}
      render={(active) => {
        const stamped = active === 3;
        const v2x = stamped ? tx(V2_STAMP) : tx(V2_REAL);
        const pick = active === 0 ? null : active === 2 ? "v1" : "v2";
        const leak = pick === "v2";
        const v2Color = active === 0 ? "#475569" : leak ? "#dc2626" : "#94a3b8";
        const v1Color = pick === "v1" ? "#2563eb" : "#475569";
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 150`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={PAD} y={30} fontSize={10} fill="#64748b">사건 시각</text>
              <text x={PAD} y={82} fontSize={10} fill="#64748b">생성 시각</text>
              <line x1={PAD} x2={W - PAD} y1={44} y2={44} stroke="#e2e8f0" strokeWidth={1} />
              <line x1={PAD} x2={W - PAD} y1={96} y2={96} stroke="#e2e8f0" strokeWidth={1} />
              <line x1={tx(CUTOFF)} x2={tx(CUTOFF)} y1={18} y2={120} stroke="#2563eb" strokeWidth={1} />
              <text x={tx(CUTOFF)} y={13} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">마감 10:00</text>
              <circle cx={tx(EVENT)} cy={44} r={5} fill="#475569" />
              <text x={tx(EVENT)} y={62} textAnchor="middle" fontSize={10} fill="#475569">09:40</text>
              {active >= 1 && (
                <rect x={PAD} y={36} width={tx(CUTOFF) - PAD} height={16} fill="#2563eb" opacity={0.08} />
              )}
              {active >= 2 && (
                <rect x={PAD} y={88} width={tx(CUTOFF) - PAD} height={16} fill="#2563eb" opacity={0.08} />
              )}
              <line x1={tx(EVENT)} x2={tx(V1)} y1={49} y2={86} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
              <line x1={tx(EVENT)} x2={v2x} y1={49} y2={86} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
              <Version x={tx(V1)} y={96} label="v1" color={v1Color} faded={pick === "v2"} />
              {stamped && (
                <g>
                  <circle cx={tx(V2_REAL)} cy={96} r={4} fill="#ffffff" stroke="#dc2626" strokeWidth={1} strokeDasharray="2 2" />
                  <text x={tx(V2_REAL)} y={118} textAnchor="middle" fontSize={10} fill="#dc2626">실제 도착 10:30</text>
                </g>
              )}
              <Version x={v2x} y={96} label="v2" color={v2Color} faded={pick === "v1"} />
              <text x={tx(V1)} y={120} textAnchor="middle" fontSize={10} fill="#475569">09:42</text>
              {!stamped && <text x={v2x} y={120} textAnchor="middle" fontSize={10} fill="#475569">10:30</text>}
              {/* 점선 연결선·마감선(y 120까지)·v1의 09:42와 겹치지 않게 한 줄 더 아래에 둡니다. */}
              {stamped && <text x={v2x} y={132} textAnchor="middle" fontSize={10} fill="#dc2626">기록값 09:55</text>}
              <text x={PAD} y={144} fontSize={9} fill="#64748b">09:30</text>
              <text x={W - PAD} y={144} textAnchor="end" fontSize={9} fill="#64748b">10:40</text>
            </svg>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border px-3 py-2">
                <span className="block text-muted-foreground">제한하는 시각</span>
                <strong className="block">{active === 0 ? "—" : active === 1 ? "사건 시각만" : "사건 + 생성 시각"}</strong>
              </div>
              <div className={`rounded-lg border px-3 py-2 ${leak ? "border-red-600" : pick === "v1" ? "border-primary" : "border-border"}`}>
                <span className="block text-muted-foreground">10시 입력 값</span>
                <strong className={`block ${leak ? "text-red-700 dark:text-red-400" : pick === "v1" ? "text-primary" : ""}`}>
                  {pick === null ? "—" : leak ? "v2일 수 있음" : "v1"}
                </strong>
                <span className="block text-muted-foreground">{pick === null ? "\u00a0" : leak ? "10시에 없던 값" : "10시에 있던 값"}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
