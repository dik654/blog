import PluginSceneShell from "./PluginSceneShell";

/**
 * 본문 대응: #tool-execution 둘째 문단 — input JSON은 stdin, CLAWD_* environment 네 개 추가,
 * plugin root가 있으면 cwd와 CLAWD_PLUGIN_ROOT, 부모 environment 기본 상속, stdout·stderr를 모아 종료까지 대기.
 * 이 함수에서는 permission enforcer 호출·timeout·output limit·process group·sandbox가 보이지 않는다.
 */
type Slot = { key: string; title: string; detail: string; scene: number };

const INPUTS: readonly Slot[] = [
  { key: "stdin", title: "stdin", detail: "input JSON", scene: 0 },
  { key: "env", title: "추가 environment", detail: "CLAWD_PLUGIN_ID · CLAWD_PLUGIN_NAME · CLAWD_TOOL_NAME · CLAWD_TOOL_INPUT", scene: 0 },
  { key: "root", title: "plugin root가 있으면", detail: "current directory = root · CLAWD_PLUGIN_ROOT", scene: 0 },
  { key: "parent", title: "부모 environment", detail: "기본으로 그대로 상속", scene: 1 },
];
const OUTPUTS: readonly Slot[] = [
  { key: "stdout", title: "stdout", detail: "모아 둠", scene: 2 },
  { key: "stderr", title: "stderr", detail: "모아 둠", scene: 2 },
  { key: "wait", title: "process 종료까지 대기", detail: "exit 뒤 결과", scene: 2 },
];
const MISSING = ["permission enforcer 호출", "timeout", "output limit", "process group", "sandbox"] as const;

const SCENES = [
  { label: "process로 들어가는 것", summary: "stdin + environment + cwd", note: "auth_lint를 부르면 host는 command와 args로 process를 시작하고 input JSON을 stdin에 씁니다. Environment에는 CLAWD_로 시작하는 값 네 개를 더하고, plugin root가 있으면 current directory와 CLAWD_PLUGIN_ROOT도 맞춥니다." },
  { label: "함께 따라가는 것", summary: "부모 environment 상속", note: "추가한 네 값만 넘어가는 것이 아닙니다. 부모 process의 environment가 기본으로 상속되므로 host가 가진 environment 값도 plugin process에서 보입니다." },
  { label: "나오는 것", summary: "stdout · stderr · exit", note: "stdout과 stderr를 모아 두고 process가 끝날 때까지 기다린 뒤 결과를 만듭니다." },
  { label: "이 함수에서 보이지 않는 것", summary: "점선 칸 다섯 개", note: "Manifest의 workspace-write는 선언입니다. Pinned PluginTool.execute 안에서는 이 label을 검사하는 enforcer 호출도, timeout·output limit·process group·sandbox도 보이지 않습니다. 다른 곳에서 막는지는 이 함수만으로 알 수 없습니다." },
] as const;

function SlotBox({ slot, active }: { slot: Slot; active: number }) {
  const on = slot.scene === active;
  return (
    <div
      className={`min-w-0 rounded-md border px-2.5 py-1.5 ${on ? "bg-background" : "border-border/60"}`}
      style={on ? { borderColor: "#2563eb" } : undefined}
    >
      <p className={`text-xs font-semibold ${on ? "" : "text-muted-foreground"}`}>{slot.title}</p>
      <p className={`break-words font-mono text-[11px] leading-4 ${on ? "text-foreground" : "text-muted-foreground/60"}`}>{slot.detail}</p>
    </div>
  );
}

export default function ProcessBoundaryViz() {
  return (
    <PluginSceneShell
      eyebrow="Process boundary"
      title="auth_lint process에 무엇이 들어가고 무엇이 빠져 있는가"
      description="왼쪽은 process에 넘기는 입력, 가운데는 plugin command가 도는 process, 오른쪽은 host가 받아 오는 출력입니다. 맨 위 점선 칸은 pinned execute 함수에서 보이지 않는 장치입니다."
      ariaLabel="plugin tool process의 stdin, environment, 출력과 이 함수에서 보이지 않는 제한 장치"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="mb-4 min-w-0">
            <p className={`text-xs font-semibold ${active === 3 ? "" : "text-muted-foreground"}`}>이 함수에서 보이지 않음</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {MISSING.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-dashed px-2 py-1 text-[11px] leading-4"
                  style={{ borderColor: active === 3 ? "#dc2626" : "#94a3b8", color: active === 3 ? "#dc2626" : "#94a3b8" }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="grid min-w-0 items-center gap-2 sm:grid-cols-[minmax(0,5fr)_auto_minmax(0,3fr)_auto_minmax(0,4fr)]">
            <div className="grid min-w-0 grid-cols-2 gap-1.5 sm:grid-cols-1">{INPUTS.map((slot) => <SlotBox key={slot.key} slot={slot} active={active} />)}</div>
            <span aria-hidden className="text-center text-sm text-muted-foreground"><span className="sm:hidden">↓</span><span className="hidden sm:inline">→</span></span>
            <div className="min-w-0 rounded-lg border px-3 py-2 text-center sm:py-4" style={{ borderColor: "#0f766e" }}>
              <p className="font-mono text-sm font-semibold">auth_lint process</p>
              <p className="mt-1 text-[11px] text-muted-foreground">command + args</p>
              <p className="mt-2 rounded border border-dashed border-border px-1.5 py-1 text-[11px] leading-4 text-muted-foreground">manifest 선언: workspace-write</p>
            </div>
            <span aria-hidden className="text-center text-sm text-muted-foreground"><span className="sm:hidden">↓</span><span className="hidden sm:inline">→</span></span>
            <div className="grid min-w-0 grid-cols-3 gap-1.5 sm:grid-cols-1">{OUTPUTS.map((slot) => <SlotBox key={slot.key} slot={slot} active={active} />)}</div>
          </div>
        </div>
      )}
    />
  );
}
