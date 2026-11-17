import SceneShell from "./SceneShell";

/**
 * 본문 대응: #purpose-retention-ledger 두 번째 문단 — legal hold는 자동 연장이 아니라 별도 state.
 * 글의 계산 예: 채용 종료 8월 14일 + 정책 30일 → 9월 13일 (14 + 30 = 44 → 8월 31일을 넘겨 9월 13일).
 * Hold의 시작·해제 시점은 글에 없으므로 축척 없이 순서만 그립니다(가정).
 */
const SCENES = [
  {
    label: "시계 시작",
    summary: "8월 14일 + 30일 = 9월 13일",
    note: "보유기한은 기간만이 아니라 시계를 시작하는 사건과 함께 정합니다. 채용 절차가 8월 14일 끝나고 적용 정책이 30일이면 deadline은 9월 13일입니다. 30일은 글의 예시이며 법정 공통 보유기간이 아닙니다.",
  },
  {
    label: "hold가 없을 때",
    summary: "9월 13일 → 삭제·검증",
    note: "유효한 hold가 없으면 그 시각에 artifact manifest 전체를 삭제하고 검증합니다.",
  },
  {
    label: "hold가 걸릴 때",
    summary: "deadline은 그대로 · 실행만 제한",
    note: "Legal hold는 분쟁·조사 같은 근거로 특정 자료의 파기를 멈추게 하는 보존 지시입니다. 이 글에서 hold는 deadline을 뒤로 미는 연장이 아니라 권한·사유·최소 항목·해제 조건·접근 제한을 가진 별도 기록이며, 원래 목적 처리와 섞지 않습니다.",
  },
  {
    label: "hold 해제",
    summary: "즉시 기존 deletion workflow로",
    note: "보존 근거가 끝나면 새 보유 기간을 다시 세지 않고 곧바로 기존 deletion workflow에 다시 넣습니다.",
  },
  {
    label: "해제 조건이 없는 hold",
    summary: "무기한 flag → fail closed 검토",
    note: "Authority·최소 범위·해제 조건이 없는 hold는 끝이 없는 flag가 됩니다. 이 글의 release gate는 이런 hold를 통과시키지 않고 fail closed 검토로 보냅니다.",
  },
] as const;

const W = 340;
const H = 156;
const Y = 70;
const X_EVENT = 34;
const X_DEADLINE = 160;
const X_BREAK = 192;
const X_RELEASE = 272;

export default function HoldDeadlineTimelineViz() {
  return (
    <SceneShell
      eyebrow="보유 시계와 legal hold"
      title="Hold는 deadline을 미루지 않고, 그 시각의 실행만 막습니다"
      description="8월 14일에서 9월 13일까지는 30일을 실제 길이로 그렸습니다. 물결 뒤의 hold 구간은 시작·해제 시점이 정해지지 않아 길이에 의미가 없습니다(가정)."
      ariaLabel="보유기한 계산과 legal hold의 시작, 해제, 무기한 hold의 차단"
      scenes={SCENES}
      render={(active) => {
        const hold = active >= 2;
        const released = active === 3;
        const endless = active === 4;
        const deleted = active === 1 || released;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={X_EVENT} x2={X_DEADLINE} y1={Y} y2={Y} stroke="#94a3b8" strokeWidth={1.25} />
            <text x={(X_EVENT + X_DEADLINE) / 2} y={Y - 8} textAnchor="middle" fontSize={12} fill="#475569">정책 보유 기간 30일</text>
            <circle cx={X_EVENT} cy={Y} r={4} fill="#475569" />
            <text x={X_EVENT} y={Y + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#334155">8월 14일</text>
            <text x={X_EVENT} y={Y + 32} textAnchor="middle" fontSize={11} fill="#64748b">채용 종료</text>
            <line x1={X_DEADLINE} x2={X_DEADLINE} y1={Y - 22} y2={Y + 8} stroke="#2563eb" strokeWidth={1.25} />
            <text x={X_DEADLINE} y={Y + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">9월 13일</text>
            <text x={X_DEADLINE} y={Y + 32} textAnchor="middle" fontSize={11} fill="#64748b">deadline</text>

            {active === 1 && (
              <g>
                <rect x={X_DEADLINE + 8} y={Y - 36} width={104} height={22} rx={4} fill="none" stroke="#16a34a" strokeWidth={1} />
                <text x={X_DEADLINE + 60} y={Y - 20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#16a34a">삭제·검증 실행</text>
              </g>
            )}

            {hold && (
              <g>
                <path d={`M${X_DEADLINE + 6} ${Y} L${X_BREAK} ${Y}`} stroke="#d97706" strokeWidth={1.25} />
                <path d={`M${X_BREAK} ${Y} l5 -5 l5 10 l5 -10 l5 5`} fill="none" stroke="#d97706" strokeWidth={1} />
                <path d={`M${X_BREAK + 20} ${Y} L${endless ? W - 12 : X_RELEASE} ${Y}`} stroke="#d97706" strokeWidth={1.25} strokeDasharray={endless ? "4 3" : undefined} />
                <rect x={X_DEADLINE - 6} y={Y - 56} width={174} height={22} rx={4} fill="none" stroke="#d97706" strokeWidth={1} />
                <text x={X_DEADLINE + 81} y={Y - 40} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">
                  {endless ? "hold · 해제 조건 없음" : "hold · 최소 항목만 · 별도 권한"}
                </text>
                <text x={X_DEADLINE - 2} y={Y + 52} fontSize={11} fill="#b45309">✕ deadline 실행 제한</text>
              </g>
            )}

            {released && (
              <g>
                <line x1={X_RELEASE} x2={X_RELEASE} y1={Y - 22} y2={Y + 8} stroke="#16a34a" strokeWidth={1.25} />
                <text x={X_RELEASE} y={Y + 18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#16a34a">hold 해제</text>
                <text x={X_RELEASE} y={Y + 32} textAnchor="middle" fontSize={11} fill="#16a34a">즉시 삭제 workflow</text>
              </g>
            )}

            {endless && (
              <text x={W - 8} y={Y + 18} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">끝 없음 → 검토로 차단</text>
            )}

            <text x={12} y={H - 8} fontSize={11} fill="#64748b">
              {deleted ? "● 삭제 실행" : hold ? "○ hold 범위는 실행 보류" : "○ 아직 보유 중"}
            </text>
          </svg>
        );
      }}
    />
  );
}
