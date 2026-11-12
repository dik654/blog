import BashSceneShell from "./BashSceneShell";

/**
 * 본문 대응: #validation-pipeline "Pinned production dispatch와 validation module은 같은 경로가 아닙니다".
 * 왼쪽 = pinned tools dispatch가 실제로 거치는 순서, 오른쪽 = 호출 경로가 확인되지 않은 bash_validation.rs.
 * 장면마다 어느 칸까지 진행하는지, 어디서 멈추거나 건너뛰는지만 바뀝니다.
 */

type NodeState = "on" | "off" | "stop" | "skip";

const CHAIN = [
  { name: "JSON input", sub: "model이 낸 Bash arguments" },
  { name: "BashCommandInput", sub: "deserialize" },
  { name: "classify_bash_permission", sub: "첫 word basename · path처럼 보이는 token" },
  { name: "required mode", sub: "WorkspaceWrite 또는 DangerFullAccess" },
  { name: "enforcer 검사", sub: "enforcer가 주입된 경우에만" },
  { name: "run_bash", sub: "runtime 호출" },
  { name: "sh -lc command", sub: "unshare launcher 안 또는 직접" },
] as const;

const VALIDATORS = ["mode", "sed", "destructive", "path"] as const;

interface SceneData {
  label: string;
  summary: string;
  note: string;
  states: readonly NodeState[];
  side: boolean;
  outcome: string;
}

const SCENES: readonly SceneData[] = [
  {
    label: "연결된 경로",
    summary: "7칸 · process 생성까지",
    note: "Pinned tools dispatch는 input을 deserialize한 뒤 첫 token과 간단한 path heuristic으로 required mode를 정하고, enforcer가 있으면 검사한 다음 run_bash를 호출합니다.",
    states: ["on", "on", "on", "on", "on", "on", "on"],
    side: false,
    outcome: "검사를 통과하면 process가 생깁니다.",
  },
  {
    label: "enforcer 있음 · mode 부족",
    summary: "Denied · process 0",
    note: "Active mode가 required mode보다 낮으면 enforcer가 Denied를 반환하고 dispatch는 run_bash를 호출하지 않습니다. 그래서 process와 stdout이 만들어지지 않습니다.",
    states: ["on", "on", "on", "on", "stop", "off", "off"],
    side: false,
    outcome: "Denied에서 멈춥니다. run_bash 호출 0회.",
  },
  {
    label: "enforcer 없음 (None)",
    summary: "검사 없이 통과",
    note: "Enforcer 인자는 Option이고 execute_tool은 enforcer 없이 같은 dispatch를 호출할 수 있습니다. 이때 다섯째 칸은 아무것도 비교하지 않고 그대로 통과합니다.",
    states: ["on", "on", "on", "on", "skip", "on", "on"],
    side: false,
    outcome: "mode를 비교하지 않고 process가 생길 수 있습니다.",
  },
  {
    label: "옆에 있는 validation module",
    summary: "호출 경로 미확인",
    note: "bash_validation.rs의 validate_command는 mode → sed → destructive → path 순서로 검사해 첫 non-Allow 결과를 반환합니다. 같은 commit의 production code에서 이 함수를 부르는 경로는 확인되지 않고 unit test만 확인됩니다.",
    states: ["off", "off", "off", "off", "off", "off", "off"],
    side: true,
    outcome: "왼쪽 경로와 연결선이 확인되지 않습니다.",
  },
];

const STATE_STYLE: Record<NodeState, { border: string; tag: string; tagColor: string }> = {
  on: { border: "#2563eb", tag: "", tagColor: "#2563eb" },
  off: { border: "#cbd5e1", tag: "", tagColor: "#94a3b8" },
  stop: { border: "#dc2626", tag: "Denied", tagColor: "#dc2626" },
  skip: { border: "#d97706", tag: "건너뜀", tagColor: "#d97706" },
};

export default function PinnedDispatchViz() {
  return (
    <BashSceneShell
      eyebrow="PINNED DISPATCH"
      title="실제 Bash dispatch 경로와 validation module은 따로 있습니다"
      description="왼쪽은 pinned tools/src/lib.rs가 command를 process로 보내는 순서이고, 오른쪽은 같은 commit의 runtime/src/bash_validation.rs입니다. 파란 칸이 그 장면에서 지나는 칸입니다."
      note="Commit b71afdd… snapshot 기준입니다. 오른쪽 검사가 현재 Bash executor 앞에서 강제된다는 뜻으로 읽지 않습니다."
      ariaLabel="pinned Bash dispatch 순서와 연결되지 않은 validation module"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <ol className="grid min-w-0 gap-1" aria-label="pinned tools dispatch 순서">
              {CHAIN.map((node, nodeIndex) => {
                const state = scene.states[nodeIndex];
                const style = STATE_STYLE[state];
                return (
                  <li
                    key={node.name}
                    className={`grid min-w-0 grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-md border px-2 py-1.5 ${state === "off" ? "opacity-45" : ""} ${state === "skip" ? "border-dashed" : ""}`}
                    style={{ borderColor: style.border }}
                  >
                    <span className="font-mono text-[10px] font-bold text-muted-foreground">{nodeIndex + 1}</span>
                    <span className="min-w-0">
                      <span className="block break-all font-mono text-xs font-bold text-foreground">{node.name}</span>
                      <span className="block break-keep text-[11px] leading-4 text-muted-foreground">{node.sub}</span>
                    </span>
                    <span className="text-[11px] font-bold" style={{ color: style.tagColor }}>{style.tag}</span>
                  </li>
                );
              })}
            </ol>
            <div className="flex min-w-0 flex-col gap-3">
              <section
                aria-label="bash_validation.rs"
                className={`min-w-0 rounded-md border border-dashed px-3 py-3 ${scene.side ? "" : "opacity-55"}`}
                style={{ borderColor: scene.side ? "#7c3aed" : "#94a3b8" }}
              >
                <p className="break-all font-mono text-xs font-bold text-foreground">bash_validation.rs · validate_command</p>
                <ol className="mt-2 flex flex-wrap items-center gap-1 text-[11px]">
                  {VALIDATORS.map((name, vIndex) => (
                    <li key={name} className="flex items-center gap-1">
                      {vIndex > 0 && <span aria-hidden className="text-muted-foreground">→</span>}
                      <span className="rounded border border-border px-1.5 py-0.5 font-mono">{name}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-2 break-keep text-[11px] leading-5 text-muted-foreground">
                  첫 non-Allow 결과를 반환 · 확인된 호출은 module 자체의 unit test뿐
                </p>
              </section>
              <p className="break-keep border-l-2 pl-3 text-sm font-semibold leading-6" style={{ borderColor: STATE_STYLE[scene.states.includes("stop") ? "stop" : scene.states.includes("skip") ? "skip" : "on"].border }}>
                {scene.outcome}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
