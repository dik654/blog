import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ephemeral-lifecycle — 임시 비밀과 공유값은 대화 뒤 지우고 장기 서명 키는 남습니다.
 * 장기 키가 유출돼도 임시 비밀을 복원할 수 없다면 녹음을 풀지 못하지만, 스냅샷에 a=6이 남으면 19⁶으로 2를 다시 계산합니다.
 */
const INK = "#64748b";
const KEEP = "#2563eb";
const LEAK = "#b91c1c";
const X0 = 8;
const PHASE_W = (360 - 2 * X0) / 3;
const PHASES = ["대화 중", "대화가 끝난 뒤", "훗날"] as const;

const SCENES = [
  { label: "대화 중", summary: "임시 비밀 a=6 · 공유값 2", note: "대화마다 새 a·b를 만들고 인증용 장기 서명 키와 분리합니다. 연결망의 공개값 8·19와 암호화된 대화는 누군가 녹음할 수 있습니다." },
  { label: "끝나면 지웁니다", summary: "a=6과 공유값 2 삭제", note: "성공하거나 실패한 뒤에는 임시 비밀과 필요가 끝난 공유값을 지웁니다. 남는 것은 장기 서명 키와 밖에 있는 녹음입니다." },
  { label: "훗날 장기 키가 유출되면", summary: "장기 키 하나로는 못 풂", note: "과거 임시 비밀을 복원할 수 없다면 녹음해 둔 과거 통신을 이 키 하나로 풀지 못합니다. 이 성질이 전방향 안전성입니다." },
  { label: "스냅샷에 a=6이 남았다면", summary: "19⁶ mod 23 = 2", note: "가상머신 스냅샷이나 오류 덤프에 a=6이 남으면 녹음의 공개값 19와 함께 과거 공유값 2를 다시 계산할 수 있습니다. 이 계산에는 장기 키가 필요 없습니다." },
] as const;

function Bar({ y, label, end, color, dashedTo }: { y: number; label: string; end: number; color: string; dashedTo?: number }) {
  return (
    <g>
      <text x={X0 + 5} y={y - 5} fontSize={12} fontWeight={600} fill={INK}>{label}</text>
      <rect x={X0} y={y} width={end * PHASE_W - 4} height={13} rx={2} fill={color} />
      {dashedTo !== undefined && (
        <rect x={X0 + end * PHASE_W} y={y + 0.5} width={(dashedTo - end) * PHASE_W - 4} height={12} rx={2} fill="none" stroke={LEAK} strokeWidth={1} strokeDasharray="4 3" />
      )}
    </g>
  );
}

const DROP = [1, 1, 1, 1] as const;
const NOW = [1, 2, 3, 3] as const;

export default function SecretLifetimeViz() {
  return (
    <SceneShell
      eyebrow="임시 비밀의 수명"
      title="임시 비밀이 남아 있는 기간이 과거 대화의 안전을 가릅니다"
      description="막대 하나가 그 값이 존재하는 기간입니다. 가로 길이는 순서만 나타내며 실제 시간이 아닙니다. 숫자는 8·19 사례라 흐름만 보여 주며, 안전성 설명은 충분히 큰 실제 설정과 고전 계산 공격을 기준으로 합니다."
      ariaLabel="임시 비밀, 공유값, 장기 서명 키, 녹음의 존재 기간과 장기 키 유출 시점"
      scenes={SCENES}
      render={(active) => {
        const now = NOW[active];
        const snapshot = active === 3;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {PHASES.map((phase, index) => (
              <g key={phase}>
                <line x1={X0 + index * PHASE_W} x2={X0 + index * PHASE_W} y1={22} y2={204} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
                <text x={X0 + index * PHASE_W + 4} y={14} fontSize={12} fontWeight={700} fill={index < now ? INK : "#94a3b8"}>{phase}</text>
              </g>
            ))}
            <Bar y={46} label="임시 비밀 a=6" end={DROP[active]} color={KEEP} dashedTo={snapshot ? 3 : undefined} />
            <Bar y={90} label="공유값 2" end={DROP[active]} color={KEEP} />
            <Bar y={134} label="장기 서명 키 (인증용)" end={now} color={INK} />
            {active === 2 && <rect x={X0 + 2 * PHASE_W} y={134} width={PHASE_W - 4} height={13} rx={2} fill={LEAK} />}
            <Bar y={178} label="녹음: 공개값 8·19, 암호화된 대화" end={now} color={INK} />
            {active === 2 && <text x={352} y={129} textAnchor="end" fontSize={12} fontWeight={700} fill={LEAK}>유출</text>}
            {active >= 1 && !snapshot && <text x={X0 + PHASE_W + 6} y={57} fontSize={12} fontWeight={700} fill={INK}>삭제</text>}
            {active >= 1 && <text x={X0 + PHASE_W + 6} y={101} fontSize={12} fontWeight={700} fill={INK}>삭제</text>}
            {snapshot && <text x={X0 + 2 * PHASE_W} y={41} fontSize={12} fontWeight={700} fill={LEAK}>스냅샷에 남음</text>}
          </svg>
        );
      }}
    />
  );
}
