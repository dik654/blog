import ClawSceneShell from "./ClawSceneShell";

/**
 * 본문 대응: #session-control "Pinned SessionStore는 workspace별 namespace를 만듭니다".
 * .claw/sessions/<workspace_hash> 아래 managed session. 명시 ID/path는 workspace_root가 다르면 mismatch로 거부.
 * latest·last·recent alias는 현재 namespace에 유효한 session이 없으면 다른 workspace까지 찾아 note와 함께 load할 수 있다.
 */
const SCENES = [
  {
    label: "workspace마다 폴더",
    summary: ".claw/sessions/<workspace_hash>",
    note: "SessionStore는 canonical workspace path의 fingerprint(경로에서 계산한 짧은 고정 값)를 폴더 이름으로 씁니다. 이름 충돌은 줄지만 tenant authorization은 아닙니다. Project B 폴더에는 유효한 session이 없다고 둡니다(가정).",
  },
  {
    label: "명시 ID로 열기",
    summary: "workspace_root 불일치 → 거부",
    note: "Project B에서 Project A의 session ID나 path를 직접 지정하면, 저장된 workspace_root(A)가 현재 workspace(B)와 달라 mismatch로 거부됩니다.",
  },
  {
    label: "latest alias로 열기",
    summary: "B에 없음 → A까지 검색 → note와 함께 load",
    note: "latest·last·recent 같은 alias는 현재 namespace에 유효한 session이 없으면 다른 workspace까지 검색하고, workspace mismatch를 note로 알린 뒤 load할 수 있습니다. 같은 A의 session이 경로에 따라 거부되기도, 열리기도 합니다.",
  },
  {
    label: "열렸다고 써도 되는 것은 아님",
    summary: "실행 전 target 재선택 또는 fail-closed",
    note: "Alias는 편리한 검색 규칙일 뿐 B에서 A의 file을 수정해도 된다는 승인이 아닙니다. 글은 실행 전에 target을 다시 고르거나 unsafe write를 fail-closed하라고 권하며, pinned source가 이를 구현했다는 뜻은 아닙니다.",
  },
] as const;

const RED = "#dc2626";
const AMBER = "#d97706";
const BLUE = "#2563eb";
const GRAY = "#94a3b8";

export default function AliasResolveViz() {
  return (
    <ClawSceneShell
      eyebrow="Session 찾기"
      title="같은 Project A의 session도 어떻게 부르느냐에 따라 거부되거나 열립니다"
      description="현재 위치는 Project B입니다. 왼쪽 위 상자가 resume을 요청하는 현재 workspace, 아래 두 상자가 workspace별 session 폴더입니다."
      ariaLabel="명시 session ID는 workspace mismatch로 거부되고 latest alias는 다른 workspace까지 찾아 load하는 경로 비교"
      scenes={SCENES}
      render={(active) => {
        const explicit = active === 1;
        const alias = active >= 2;
        return (
          <svg viewBox="0 0 360 222" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={10} y={8} width={150} height={52} rx={8} fill="none" stroke={BLUE} strokeWidth={1} />
            <text x={20} y={27} fontSize={11} fontWeight={700} fill={BLUE}>
              현재: Project B
            </text>
            <text x={20} y={45} fontSize={10} fill="#64748b">
              {active === 0 ? "resume 요청 전" : explicit ? "resume <A의 session ID>" : "resume latest"}
            </text>

            <rect x={186} y={8} width={164} height={52} rx={8} fill="none" stroke={active === 3 ? AMBER : GRAY} strokeWidth={1} strokeDasharray={active === 3 ? undefined : "3 2"} />
            <text x={196} y={27} fontSize={11} fontWeight={700} fill={active === 3 ? AMBER : GRAY}>
              {active === 3 ? "write 전 확인 (권장)" : "결과"}
            </text>
            <text x={196} y={45} fontSize={10} fill={active === 1 ? RED : active >= 2 ? AMBER : GRAY}>
              {active === 0 ? "—" : explicit ? "mismatch로 거부" : active === 2 ? "load + mismatch note" : "target 재선택 / write 차단"}
            </text>

            <text x={10} y={88} fontSize={10} fill="#64748b">
              .claw/sessions/
            </text>
            {[
              { x: 10, name: "<hash(A)>/", body: "session · root = A", has: true },
              { x: 186, name: "<hash(B)>/", body: "유효한 session 없음", has: false },
            ].map((folder) => {
              const lit = folder.has ? explicit || alias : alias;
              return (
                <g key={folder.name}>
                  <rect x={folder.x} y={96} width={folder.has ? 150 : 164} height={60} rx={8} fill="none" stroke={lit ? (folder.has ? AMBER : BLUE) : GRAY} strokeWidth={lit ? 1.25 : 1} />
                  <text x={folder.x + 10} y={116} fontSize={11} fontWeight={700} fill="#64748b">
                    {folder.name}
                  </text>
                  <text x={folder.x + 10} y={136} fontSize={10} fill={folder.has ? "#64748b" : GRAY}>
                    {folder.body}
                  </text>
                  {!folder.has && (
                    <text x={folder.x + 10} y={150} fontSize={9} fill={GRAY}>
                      (가정)
                    </text>
                  )}
                </g>
              );
            })}

            {explicit && (
              <g>
                <line x1={85} y1={60} x2={85} y2={96} stroke={RED} strokeWidth={1.25} />
                <text x={92} y={82} fontSize={10} fontWeight={700} fill={RED}>
                  A ≠ B
                </text>
              </g>
            )}
            {alias && (
              <g>
                <line x1={140} y1={60} x2={240} y2={96} stroke={BLUE} strokeWidth={1} strokeDasharray="3 2" />
                <text x={186} y={176} fontSize={10} fill={BLUE}>
                  ① 현재 namespace 먼저: 없음
                </text>
                <line x1={186} y1={126} x2={160} y2={126} stroke={AMBER} strokeWidth={1.25} />
                <text x={10} y={176} fontSize={10} fill={AMBER}>
                  ② 다른 workspace까지 검색
                </text>
              </g>
            )}
            {active === 3 && (
              <text x={10} y={204} fontSize={10} fontWeight={700} fill={AMBER}>
                load된 session ≠ A의 file을 고쳐도 된다는 승인
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
