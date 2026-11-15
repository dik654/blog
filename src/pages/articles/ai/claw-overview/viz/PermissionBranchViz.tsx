import SceneShell from "./SceneShell";

/**
 * 본문 대응: #crate-map "Registry, permission, executor는 연속되지만 같은 판정이 아닙니다".
 * 같은 edit_file 호출이 permission 판정(allow·ask·deny)에 따라 어디까지 도달하는지 단계별로 표시합니다.
 * deny의 typed error 반환은 #overview "제안하는 주체와 실행하는 주체를 분리합니다",
 * approval-required의 뜻은 #parity-harness의 실패 주입 설명에서 가져왔습니다.
 */
type Mark = "pass" | "stop" | "wait" | "keep";

const STAGES = [
  "Registry: 이름이 등록됐고 input이 schema에 맞는가",
  "Permission: mode · user approval · canonical target path",
  "Executor 생성 · process 시작 · file handle 열기",
  "Workspace file",
  "Runtime으로 돌아가는 것",
] as const;

const SCENES = [
  {
    label: "allow",
    summary: "executor까지 도달",
    note: "allow된 canonical operation만 executor가 workspace 안에서 실행합니다. Executor의 typed result는 runtime으로 돌아가 session observation이 되지만, executor가 session을 직접 고치지는 않습니다.",
    cells: [
      ["pass", "통과"],
      ["pass", "allow"],
      ["pass", "workspace 안에서 실행"],
      ["pass", "diff 생김"],
      ["pass", "typed result → runtime이 observation으로 commit"],
    ] as const,
  },
  {
    label: "ask",
    summary: "approval 전까지 멈춤",
    note: "ask라면 사용자가 결정하기 전까지 run을 멈춥니다. 그동안 side effect는 생기지 않습니다(approval-required 상태).",
    cells: [
      ["pass", "통과"],
      ["wait", "ask"],
      ["wait", "approval 전까지 하지 않음"],
      ["keep", "변경 없음 (수정 전 hash 그대로)"],
      ["wait", "approval-required · 사용자 결정 대기"],
    ] as const,
  },
  {
    label: "deny",
    summary: "executor에 도달하지 않음",
    note: "deny라면 executor를 만들거나 process를 시작하거나 file handle을 열어서는 안 됩니다. 거부된 호출은 file을 건드리지 않은 채 typed error로 돌아가므로 model은 다른 방법을 제안하거나 사용자 승인을 요청할 수 있습니다.",
    cells: [
      ["pass", "통과"],
      ["stop", "deny"],
      ["stop", "하지 않음 (호출 0)"],
      ["keep", "변경 없음 (수정 전 hash 그대로)"],
      ["stop", "typed error → session"],
    ] as const,
  },
] as const;

const STYLE: Record<Mark, { box: string; dot: string; sign: string }> = {
  pass: { box: "border-primary/50", dot: "#2563eb", sign: "✓" },
  wait: { box: "border-amber-500/60 border-dashed", dot: "#d97706", sign: "‖" },
  stop: { box: "border-red-600/60 border-dashed", dot: "#dc2626", sign: "✕" },
  keep: { box: "border-border", dot: "#64748b", sign: "=" },
};

export default function PermissionBranchViz() {
  return (
    <SceneShell
      eyebrow="같은 edit_file 호출, 세 가지 판정"
      title="permission 판정이 executor에 닿을지를 가릅니다"
      description="위에서 아래로 한 tool call이 지나가는 단계입니다. Registry 확인은 세 경우 모두 같고, permission이 allow·ask·deny 중 무엇을 내느냐에 따라 아래 단계의 도달 여부가 갈립니다."
      ariaLabel="edit_file 호출이 permission allow, ask, deny에 따라 executor와 workspace에 도달하는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <ol className="grid min-w-0 gap-2">
            {STAGES.map((stage, index) => {
              const [mark, text] = scene.cells[index];
              const style = STYLE[mark as Mark];
              return (
                <li key={stage} className={`grid min-h-[3.25rem] min-w-0 grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-2 rounded-lg border bg-background px-3 py-2 sm:grid-cols-[1.5rem_minmax(0,1.1fr)_minmax(0,1fr)] ${style.box}`}>
                  <span aria-hidden className="text-center font-mono text-sm font-bold" style={{ color: style.dot }}>{style.sign}</span>
                  <span className="min-w-0 break-keep text-xs leading-5 text-muted-foreground">{stage}</span>
                  <strong className="col-start-2 min-w-0 break-keep text-xs leading-5 sm:col-start-3 sm:text-sm" style={{ color: style.dot }}>{text}</strong>
                </li>
              );
            })}
          </ol>
        );
      }}
    />
  );
}
