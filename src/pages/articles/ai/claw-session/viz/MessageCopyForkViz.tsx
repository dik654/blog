import ClawSceneShell from "./ClawSceneShell";

/**
 * 본문 대응: #fork-compaction "Pinned fork가 실제로 하는 일은 message-copy fork입니다".
 * Session::fork = 새 session ID + messages 복제 + parent_session_id·branch name + workspace_root 상속.
 * 별도 worktree가 없으므로 두 후보가 같은 auth.ts를 수정하면 결과가 섞일 수 있습니다.
 */
const SCENES = [
  {
    label: "fork 직후",
    summary: "messages 복제 · workspace_root 상속",
    note: "Fork는 새 session ID를 만들고 messages를 복제한 뒤 parent_session_id와 선택적인 branch name을 붙입니다. workspace_root는 같은 값을 물려받을 뿐 별도 worktree가 생기지 않습니다.",
  },
  {
    label: "양쪽이 따로 이어짐",
    summary: "공통 base를 가리키는 pointer 없음",
    note: "두 session은 각자 message를 덧붙입니다. parent_session_id는 어느 session에서 갈라졌는지만 알려 줄 뿐 부모의 어느 시점이 공통 base였는지는 가리키지 않습니다.",
  },
  {
    label: "같은 파일을 수정",
    summary: "workspace는 하나 · 수정이 섞일 수 있음",
    note: "대화는 둘로 나뉘었지만 파일은 하나라서 두 후보가 같은 auth.ts를 수정하는 순간 결과가 섞일 수 있습니다. 그래서 conversation provenance와 workspace isolation을 따로 설계해야 합니다.",
  },
] as const;

const COPIED = ["user: 401 수정 요청", "assistant: read·search", "tool result"];

export default function MessageCopyForkViz() {
  return (
    <ClawSceneShell
      eyebrow="Message-copy fork"
      title="대화는 둘로 나뉘어도 파일은 하나입니다"
      description="Pinned Session::fork가 실제로 만드는 구조입니다. 원본에서 A(null guard), fork에서 B(token refresh)를 시도한다고 둔 배치와 복제된 message 세 줄은 설명을 위한 가정입니다."
      ariaLabel="원본 session과 fork session이 messages를 복제한 채 같은 workspace의 auth.ts를 가리키는 구조"
      scenes={SCENES}
      render={(active) => {
        const sessions = [
          { x: 10, title: "session 1 (원본)", meta: "id s1", added: "A: null guard 제안", color: "#2563eb" },
          { x: 184, title: "session 2 (fork)", meta: "새 id s2 · parent_session_id = s1", added: "B: token refresh 제안", color: "#7c3aed" },
        ];
        return (
          <svg viewBox="0 0 360 236" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {sessions.map((session) => (
              <g key={session.title}>
                <rect x={session.x} y={8} width={166} height={128} rx={8} fill="none" stroke={session.color} strokeWidth={1} />
                <text x={session.x + 10} y={26} fontSize={11} fontWeight={700} fill={session.color}>
                  {session.title}
                </text>
                <text x={session.x + 10} y={40} fontSize={9} fill="#64748b">
                  {session.meta}
                </text>
                {COPIED.map((line, index) => (
                  <g key={line}>
                    <rect x={session.x + 10} y={48 + index * 20} width={146} height={16} rx={3} fill="#94a3b8" fillOpacity={0.12} stroke="#94a3b8" strokeWidth={1} />
                    <text x={session.x + 16} y={60 + index * 20} fontSize={9} fill="#64748b">
                      {line}
                    </text>
                  </g>
                ))}
                {active >= 1 && (
                  <g>
                    <rect x={session.x + 10} y={110} width={146} height={18} rx={3} fill={session.color} fillOpacity={0.1} stroke={session.color} strokeWidth={1} />
                    <text x={session.x + 16} y={123} fontSize={9} fontWeight={700} fill={session.color}>
                      {session.added}
                    </text>
                  </g>
                )}
              </g>
            ))}

            {sessions.map((session) => (
              <line
                key={`link-${session.title}`}
                x1={session.x + 83}
                y1={136}
                x2={session.x === 10 ? 150 : 210}
                y2={176}
                stroke={active === 2 ? session.color : "#94a3b8"}
                strokeWidth={active === 2 ? 1.25 : 1}
                strokeDasharray={active === 2 ? undefined : "3 2"}
              />
            ))}
            <text x={180} y={160} textAnchor="middle" fontSize={9} fill="#64748b">
              {active === 2 ? "둘 다 여기에 edit" : "같은 workspace_root"}
            </text>
            <rect x={80} y={176} width={200} height={52} rx={8} fill="none" stroke={active === 2 ? "#dc2626" : "#94a3b8"} strokeWidth={active === 2 ? 1.25 : 1} />
            <text x={180} y={196} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">
              workspace 하나 · auth.ts
            </text>
            <text x={180} y={214} textAnchor="middle" fontSize={10} fontWeight={active === 2 ? 700 : 400} fill={active === 2 ? "#dc2626" : "#94a3b8"}>
              {active === 2 ? "A와 B의 수정이 섞일 수 있음" : "별도 worktree 없음"}
            </text>
          </svg>
        );
      }}
    />
  );
}
