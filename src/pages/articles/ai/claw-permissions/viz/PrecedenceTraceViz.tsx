import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./ClawSceneShell";

/**
 * 본문 대응: #policy precedence 1~6단계와 바로 아래 예시 문단
 * (hook Allow가 denied_tools·deny rule을 뒤집지 못함, ask rule은 여전히 묻고 prompter가 없으면 Deny,
 *  Allow는 ask rule과 충족되지 않은 mode를 우회하지 못함, 6단계는 Prompt mode·WorkspaceWrite→DangerFullAccess만 묻는다).
 * 호출은 모두 edit_file(src/auth.ts)이고 requirement는 WorkspaceWrite입니다. 설정 조합은 설명용 가정입니다.
 */
const GATES = ["denied_tools", "deny rule", "context override", "ask rule", "allow rule · mode", "escalation · final deny"] as const;

type State = "pass" | "deny" | "allow" | "skip";
type Step = readonly [State, string];

const SCENES = [
  {
    label: "deny rule이 hook Allow보다 먼저",
    summary: "2단계에서 Deny",
    inputs: ["WorkspaceWrite", "deny edit_file(src:*)", "Allow", "있음"],
    steps: [
      ["pass", "edit_file이 목록에 없음"],
      ["deny", "src/auth.ts가 prefix src로 시작해 match → Deny"],
      ["skip", "도달하지 않음"],
      ["skip", "도달하지 않음"],
      ["skip", "도달하지 않음"],
      ["skip", "도달하지 않음"],
    ] as readonly Step[],
    note: "deny rule은 context override보다 앞 단계입니다. 2단계에서 Deny로 결론이 나므로 hook이 보낸 Allow로는 뒤집지 못합니다. prefix rule edit_file(src:*)는 subject가 src로 시작하면 match합니다.",
  },
  {
    label: "ask rule은 hook Allow로 건너뛰지 못함",
    summary: "4단계에서 묻지만 prompter 없음 → Deny",
    inputs: ["WorkspaceWrite", "ask edit_file(src/auth.ts)", "Allow", "없음"],
    steps: [
      ["pass", "edit_file이 목록에 없음"],
      ["pass", "deny rule 없음"],
      ["pass", "Allow지만 여기서 끝내지 않음"],
      ["deny", "물어야 하는데 prompter 없음 → Deny"],
      ["skip", "도달하지 않음"],
      ["skip", "도달하지 않음"],
    ] as readonly Step[],
    note: "hook Allow는 ask rule을 우회하지 못하므로 4단계에서 사용자에게 물어야 합니다. 그런데 prompter가 전달되지 않았으면 prompt_or_deny가 Deny를 반환합니다. 이것이 policy 수준의 fail-closed입니다.",
  },
  {
    label: "Allow는 부족한 mode를 채우지 못함",
    summary: "6단계에서 Deny",
    inputs: ["ReadOnly", "rule 없음", "Allow", "있음"],
    steps: [
      ["pass", "edit_file이 목록에 없음"],
      ["pass", "deny rule 없음"],
      ["pass", "Allow지만 여기서 끝내지 않음"],
      ["pass", "ask rule 없음"],
      ["pass", "allow rule 없음 · ReadOnly < WorkspaceWrite"],
      ["deny", "Prompt mode도 WorkspaceWrite→DangerFullAccess도 아님 → Deny"],
    ] as readonly Step[],
    note: "edit_file(src/auth.ts)는 WorkspaceWrite가 필요한데 active mode는 ReadOnly입니다. hook Allow가 있어도 5단계를 충족하지 못하고, 6단계에서 묻는 경우는 Prompt mode와 WorkspaceWrite→DangerFullAccess뿐이므로 나머지 불충족은 Deny입니다.",
  },
  {
    label: "rule 없이 mode가 충분",
    summary: "5단계에서 Allow",
    inputs: ["WorkspaceWrite", "rule 없음", "없음", "있음"],
    steps: [
      ["pass", "edit_file이 목록에 없음"],
      ["pass", "deny rule 없음"],
      ["pass", "override 없음"],
      ["pass", "ask rule 없음"],
      ["allow", "WorkspaceWrite가 requirement 충족 → Allow"],
      ["skip", "도달하지 않음"],
    ] as readonly Step[],
    note: "active mode가 requirement를 충족하면 5단계에서 Allow입니다. 이 Allow도 실행을 시도해도 된다는 뜻일 뿐이며, sandbox나 OS 권한, 그리고 실제 성공은 별개입니다.",
  },
] as const;

const INPUT_LABELS = ["active mode", "rule", "hook override", "prompter"] as const;

const MARK: Record<State, { sign: string; color: string; text: string }> = {
  pass: { sign: "→", color: "#64748b", text: "text-muted-foreground" },
  deny: { sign: "✕", color: "#dc2626", text: "font-semibold text-red-700 dark:text-red-400" },
  allow: { sign: "✓", color: "#16a34a", text: "font-semibold text-emerald-700 dark:text-emerald-400" },
  skip: { sign: "·", color: "#cbd5e1", text: "text-muted-foreground/50" },
};

export default function PrecedenceTraceViz() {
  return (
    <SceneShell
      eyebrow="판정 순서 따라가기"
      title="위 단계에서 결론이 나면 아래 단계는 읽지 않습니다"
      description="네 장면 모두 같은 호출 edit_file(src/auth.ts)이며, 이 호출에 필요한 mode는 WorkspaceWrite입니다. 장면마다 바뀌는 것은 위쪽 네 칸의 설정뿐이고, 그 조합은 설명용입니다(가정)."
      ariaLabel="같은 edit_file 호출이 설정에 따라 precedence 여섯 단계 중 어디에서 판정되는지 네 사례"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="min-w-0">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {INPUT_LABELS.map((label, index) => (
                  <div key={label} className="min-w-0 rounded-lg border border-border px-2 py-1.5">
                    <span className="block text-[11px] text-muted-foreground">{label}</span>
                    <code className="block break-words text-xs font-semibold [overflow-wrap:anywhere]">{scene.inputs[index]}</code>
                  </div>
                ))}
              </div>
              <ol className="mt-3 divide-y divide-border border-y border-border">
                {GATES.map((gate, index) => {
                  const [state, text] = scene.steps[index];
                  const mark = MARK[state];
                  return (
                    <li key={gate} className="grid min-w-0 grid-cols-[1rem_1rem_minmax(0,6.5rem)_minmax(0,1fr)] sm:grid-cols-[1.25rem_1.25rem_minmax(0,9rem)_minmax(0,1fr)] items-start gap-2 py-1.5 text-xs leading-5">
                      <span className="font-mono text-muted-foreground">{index + 1}</span>
                      <span className="text-center font-bold" style={{ color: mark.color }}>{mark.sign}</span>
                      <span className={`break-words ${state === "skip" ? "text-muted-foreground/50" : "font-semibold"}`}>{gate}</span>
                      <span className={`break-words ${mark.text}`}>{text}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        />
      )}
    />
  );
}
