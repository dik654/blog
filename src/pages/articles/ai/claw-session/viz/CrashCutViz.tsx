import ClawSceneShell from "./ClawSceneShell";

/**
 * 본문 대응: #conversation-runtime "Crash는 정확한 cut에서 분석합니다".
 * Pinned run_turn 순서: user append → assistant(ToolUse) append → permission·tool 실행(effect) → ToolResult append.
 * 다섯 crash cut마다 session 기록 줄과 workspace 파일 상태가 어떻게 어긋나는지 보여 줍니다.
 */
const EVENTS = [
  { name: "user", kind: "기록 추가", record: true },
  { name: "assistant", kind: "ToolUse 기록", record: true },
  { name: "edit 실행", kind: "effect", record: false },
  { name: "ToolResult", kind: "기록 추가", record: true },
] as const;

const EVENT_X: readonly number[] = [64, 144, 224, 304];
const CUT_X: readonly number[] = [24, 104, 184, 264, 340];

const FILE_STATE: readonly { text: string; color: string }[] = [
  { text: "auth.ts · 아직 수정 전", color: "#64748b" },
  { text: "auth.ts · 아직 수정 전", color: "#64748b" },
  { text: "auth.ts · 실행 시작 전", color: "#64748b" },
  { text: "auth.ts · 바뀌었을 수 있음, 성공 기록은 없음", color: "#d97706" },
  { text: "auth.ts · 실행 결과가 ToolResult로 기록됨", color: "#2563eb" },
];

const SCENES = [
  {
    label: "user 기록 전",
    summary: "session에 요청 없음",
    note: "Session에는 요청이 없습니다. Client request ID가 없다면 사용자가 같은 요청을 재전송했는지 구분하기 어렵습니다.",
  },
  {
    label: "user 기록 후 · assistant 전",
    summary: "요청 O · 응답 ?",
    note: "요청은 저장됐지만 provider attempt가 끝났는지는 불명확합니다. 다시 시작한다면 새 attempt로 처리하고 이전 stream을 섞지 않습니다.",
  },
  {
    label: "ToolUse 기록 후 · 실행 전",
    summary: "제안 O · 실행 X",
    note: "Call 제안은 남았지만 실행은 시작되지 않았습니다. 파일은 그대로이므로 현재 policy로 다시 승인하고 precondition이 맞을 때만 실행합니다.",
  },
  {
    label: "실행 후 · ToolResult 전",
    summary: "기록과 파일이 어긋남",
    note: "가장 위험한 자리입니다. 기록만 보면 결과가 없지만 파일은 이미 바뀌었을 수 있습니다. 기록만 믿고 다시 실행하면 같은 수정이 두 번 적용될 수 있어 digest·status 조회 없이 재실행하지 않습니다.",
  },
  {
    label: "ToolResult 기록 후",
    summary: "call ↔ 결과 연결됨",
    note: "Call과 결과의 대응은 복원할 수 있습니다. 다음 model attempt부터 이어 가되 그 결과가 충분한 receipt인지는 다시 확인합니다.",
  },
] as const;

export default function CrashCutViz() {
  return (
    <ClawSceneShell
      eyebrow="Crash cut"
      title="같은 crash라도 어느 칸 사이에서 멈췄는지에 따라 남는 사실이 다릅니다"
      description="위 줄은 pinned loop가 한 tool call을 처리하는 순서이고, 빨간 점선이 process가 멈춘 자리입니다. 가운데 줄은 session 파일에 남은 기록, 아래 줄은 workspace의 auth.ts입니다."
      ariaLabel="user 기록, assistant(ToolUse) 기록, edit 실행, ToolResult 기록 사이 다섯 crash 지점에서 session 기록과 파일 상태 비교"
      scenes={SCENES}
      render={(active) => {
        const cutX = CUT_X[active];
        const file = FILE_STATE[active];
        return (
          <svg viewBox="0 0 360 190" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={10} x2={350} y1={48} y2={48} stroke="#94a3b8" strokeWidth={1} />
            {EVENTS.map((event, index) => {
              const done = index < active;
              return (
                <g key={event.name}>
                  <text x={EVENT_X[index]} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={done ? "#2563eb" : "#94a3b8"}>
                    {event.name}
                  </text>
                  <text x={EVENT_X[index]} y={33} textAnchor="middle" fontSize={10} fill="#94a3b8">
                    {event.kind}
                  </text>
                  <circle cx={EVENT_X[index]} cy={48} r={4} fill={done ? "#2563eb" : "#ffffff"} stroke={done ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                </g>
              );
            })}
            <text x={10} y={88} fontSize={11} fill="#64748b">
              session 파일에 남은 기록
            </text>
            {EVENTS.map((event, index) =>
              event.record ? (
                <g key={event.name}>
                  <rect
                    x={EVENT_X[index] - 34}
                    y={94}
                    width={68}
                    height={28}
                    rx={5}
                    fill={index < active ? "#2563eb" : "none"}
                    fillOpacity={index < active ? 0.1 : 0}
                    stroke={index < active ? "#2563eb" : "#94a3b8"}
                    strokeWidth={1}
                    strokeDasharray={index < active ? undefined : "3 2"}
                  />
                  <text x={EVENT_X[index]} y={112} textAnchor="middle" fontSize={10} fill={index < active ? "#2563eb" : "#94a3b8"}>
                    {index < active ? event.name : "없음"}
                  </text>
                </g>
              ) : (
                <text key={event.name} x={EVENT_X[index]} y={112} textAnchor="middle" fontSize={10} fill="#94a3b8">
                  message 아님
                </text>
              ),
            )}
            <text x={10} y={146} fontSize={11} fill="#64748b">
              workspace의 파일
            </text>
            <rect x={10} y={154} width={340} height={30} rx={5} fill="none" stroke={file.color} strokeWidth={active === 3 ? 1.25 : 1} />
            <text x={180} y={173} textAnchor="middle" fontSize={11} fontWeight={700} fill={file.color}>
              {file.text}
            </text>
            <line x1={cutX} x2={cutX} y1={38} y2={60} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={Math.min(Math.max(cutX, 26), 334)} y={73} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">
              crash
            </text>
          </svg>
        );
      }}
    />
  );
}
