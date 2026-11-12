import ClawSceneShell from "./ClawSceneShell";

/**
 * 본문 대응: #conversation-runtime "Effect 뒤 result 저장 전의 빈틈에는 reconciliation이 필요합니다".
 * 실행 전 planned record(before digest·expected after digest)를 남기고, resume 때 현재 파일과 비교해
 * completed / failed / unknown 셋 중 하나로 판정합니다. 이 protocol은 글이 제안하는 hardening이며 pinned 구현이 아닙니다.
 */
const OUTCOMES = [
  { key: "completed", lines: ["기존 effect에 연결", "다시 수정 안 함"], color: "#16a34a" },
  { key: "failed", lines: ["failed로 기록", "새 attempt 허용 가능"], color: "#d97706" },
  { key: "unknown", lines: ["자동 재실행 막음", "probe·보상·사람 검토"], color: "#dc2626" },
] as const;

const CURRENT: readonly { digest: string; executor: string }[] = [
  { digest: "(crash 전이라 아직 비교 안 함)", executor: "" },
  { digest: "현재 digest = expected after", executor: "→ 수정이 이미 적용됨" },
  { digest: "현재 digest = before 그대로", executor: "executor가 실패를 확정" },
  { digest: "어느 쪽으로도 확인 불가", executor: "예: 실패 확정도 after 일치도 없음" },
];

const SCENES = [
  {
    label: "실행 전에 남기는 계획",
    summary: "planned record",
    note: "edit_file을 실행하기 전에 operation_id, tool call ID, target path, 수정 전 digest, 기대하는 수정 후 digest(또는 patch)와 승인된 policy binding을 durable record로 남깁니다. digest는 파일 내용에서 계산한 짧은 지문이라 내용이 같으면 같은 값이 나옵니다.",
  },
  {
    label: "after digest가 일치",
    summary: "→ completed",
    note: "Resume 때 현재 auth.ts의 digest가 기대한 after digest와 같으면 수정은 이미 적용된 것입니다. 기존 effect에 result를 연결하고 다시 수정하지 않습니다.",
  },
  {
    label: "before 그대로 + 실패 확정",
    summary: "→ failed",
    note: "Before digest가 그대로이고 executor가 실패를 확정했다면 failed로 기록합니다. 그 뒤에는 같은 precondition에서 새 attempt를 허용할 수 있습니다.",
  },
  {
    label: "어느 쪽도 확인할 수 없음",
    summary: "→ unknown",
    note: "어느 쪽도 확인할 수 없으면 unknown입니다. 자동 재실행을 막고 status probe, compensation 또는 사람 검토로 보냅니다. 이 protocol은 중복을 줄이지만 모든 filesystem·process·remote API에 exactly-once를 만들어 주지는 않습니다.",
  },
] as const;

const BOX_X: readonly number[] = [10, 127, 244];

export default function ReconcileViz() {
  return (
    <ClawSceneShell
      eyebrow="Reconciliation"
      title="Resume은 다시 실행하기 전에 파일이 어느 쪽에 있는지부터 봅니다"
      description="edit_file이 auth.ts를 바꾼 직후 process가 종료된 경우입니다. 글이 제안하는 hardening protocol이며, pinned source에서 확인된 구현은 아닙니다."
      ariaLabel="planned record의 before·after digest와 현재 파일을 비교해 completed, failed, unknown으로 판정하는 분기"
      scenes={SCENES}
      render={(active) => {
        const current = CURRENT[active];
        const chosen = active - 1;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={10} y={8} width={340} height={56} rx={6} fill="none" stroke={active === 0 ? "#2563eb" : "#94a3b8"} strokeWidth={active === 0 ? 1.25 : 1} />
            <text x={20} y={26} fontSize={11} fontWeight={700} fill="#2563eb">
              실행 전 planned record
            </text>
            <text x={20} y={42} fontSize={10} fill="#64748b">
              operation_id · call ID · target: auth.ts · policy binding
            </text>
            <text x={20} y={56} fontSize={10} fill="#64748b">
              before digest · expected after digest(또는 patch)
            </text>

            <rect x={10} y={76} width={340} height={44} rx={6} fill="none" stroke={active === 0 ? "#cbd5e1" : "#64748b"} strokeWidth={1} strokeDasharray={active === 0 ? "3 2" : undefined} />
            <text x={20} y={94} fontSize={11} fontWeight={700} fill="#64748b">
              Resume 때 현재 auth.ts
            </text>
            <text x={20} y={111} fontSize={10} fill="#64748b">
              {current.digest}
              {current.executor ? ` · ${current.executor}` : ""}
            </text>

            {OUTCOMES.map((outcome, index) => {
              const on = index === chosen;
              return (
                <g key={outcome.key}>
                  <line x1={180} y1={120} x2={BOX_X[index] + 53} y2={140} stroke={on ? outcome.color : "#cbd5e1"} strokeWidth={on ? 1.25 : 1} />
                  <rect x={BOX_X[index]} y={140} width={106} height={66} rx={6} fill={on ? outcome.color : "none"} fillOpacity={on ? 0.08 : 0} stroke={on ? outcome.color : "#cbd5e1"} strokeWidth={on ? 1.25 : 1} />
                  <text x={BOX_X[index] + 53} y={160} textAnchor="middle" fontSize={11} fontWeight={700} fill={on ? outcome.color : "#94a3b8"}>
                    {outcome.key}
                  </text>
                  {outcome.lines.map((line, lineIndex) => (
                    <text key={line} x={BOX_X[index] + 53} y={177 + lineIndex * 14} textAnchor="middle" fontSize={9} fill={on ? "#64748b" : "#94a3b8"}>
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
