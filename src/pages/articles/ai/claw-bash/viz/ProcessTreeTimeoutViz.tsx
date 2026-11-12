import BashSceneShell from "./BashSceneShell";

/**
 * 본문 대응: #sandbox "Timeout은 observation이지 descendant process cleanup의 증거가 아닙니다"와
 * "Release executor는 process tree와 resource를 하나의 lifecycle로 닫습니다".
 * 왼쪽 = sh -lc 아래 process tree(child·grandchild는 설명용 가정), 오른쪽 = runtime이 돌려주는 observation.
 */

type NodeStatus = "run" | "unknown" | "reaped";

interface SceneData {
  label: string;
  summary: string;
  note: string;
  timer: number;
  status: NodeStatus;
  group: boolean;
  observation: readonly string[];
}

const TREE = [
  { name: "sh -lc command", depth: 0 },
  { name: "child (가정)", depth: 1 },
  { name: "grandchild (가정)", depth: 2 },
] as const;

const SCENES: readonly SceneData[] = [
  {
    label: "시작",
    summary: "deadline까지 대기",
    note: "Foreground path는 requested milliseconds로 command.output() future를 감쌉니다. Shell 아래에 child와 grandchild가 생길 수 있고, runtime은 결과를 기다립니다.",
    timer: 55,
    status: "run",
    group: false,
    observation: ["아직 반환 없음"],
  },
  {
    label: "deadline 초과",
    summary: "interrupted output 반환",
    note: "Deadline을 넘으면 runtime은 interrupted timeout output을 반환합니다. Test로 분류된 command는 test.hung, 나머지는 timeout interpretation이고, stdout·stderr는 각각 16 KiB에서 잘려 marker가 붙습니다.",
    timer: 100,
    status: "run",
    group: false,
    observation: ["interrupted · test.hung 또는 timeout", "stdout 16 KiB에서 잘림 · 잘리면 marker", "stderr 16 KiB에서 잘림 · 잘리면 marker", "full-output digest 없음"],
  },
  {
    label: "그 뒤 process tree",
    summary: "정리 여부 확인 안 됨",
    note: "Pinned Bash·sandbox source에서는 process group 생성, group signal, descendant enumeration·reaping 코드가 확인되지 않습니다. 결과가 돌아왔다는 사실만으로 child와 grandchild가 사라졌다고 볼 수 없습니다.",
    timer: 100,
    status: "unknown",
    group: false,
    observation: ["interrupted · test.hung 또는 timeout", "stdout·stderr 16 KiB truncation", "남은 descendant 수 · 기록 항목 없음"],
  },
  {
    label: "HARDENING · group 단위 종료",
    summary: "descendant 0까지 reap",
    note: "Spawn 전에 process group 또는 job object를 만들고 attempt ID와 leader identity를 기록합니다. Timeout이면 group 전체에 graceful signal을 보내고 짧은 deadline 뒤 강제 종료하며, descendant가 0이 될 때까지 reap합니다.",
    timer: 100,
    status: "reaped",
    group: true,
    observation: ["process created", "timeout signaled", "force killed (필요할 때)", "descendants remaining 0", "exit/signal · truncation 별도 항목"],
  },
];

const STATUS: Record<NodeStatus, { text: string; color: string }> = {
  run: { text: "실행 중", color: "#2563eb" },
  unknown: { text: "확인 안 됨", color: "#d97706" },
  reaped: { text: "종료·reap", color: "#059669" },
};

export default function ProcessTreeTimeoutViz() {
  return (
    <BashSceneShell
      eyebrow="TIMEOUT · PROCESS TREE"
      title="Timeout 결과가 돌아와도 아래쪽 process가 정리됐다는 뜻은 아닙니다"
      description="위 막대는 requested timeout까지 흐른 시간, 왼쪽은 sh -lc 아래 process tree, 오른쪽은 runtime이 돌려주는 observation입니다."
      note="child와 grandchild 구성은 설명용 가정입니다. 마지막 장면은 pinned runtime의 동작이 아니라 release executor가 추가할 hardening 계약입니다."
      ariaLabel="timeout 뒤 observation과 process tree 상태"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const status = STATUS[scene.status];
        return (
          <div className="grid min-w-0 gap-4">
            <div className="min-w-0">
              <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                <span>시작</span>
                <span>requested deadline</span>
              </div>
              <div className="mt-1 h-3 min-w-0 rounded-sm bg-muted/40">
                <div className="h-full rounded-sm" style={{ width: `${scene.timer}%`, backgroundColor: scene.timer >= 100 ? "#dc2626" : "#2563eb" }} />
              </div>
            </div>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <div
                className={`min-w-0 rounded-md p-2 ${scene.group ? "border" : "border border-transparent"}`}
                style={scene.group ? { borderColor: "#059669" } : undefined}
              >
                <p className="mb-2 text-[11px] font-bold text-muted-foreground">
                  {scene.group ? "process group (attempt ID · leader 기록)" : "process tree"}
                </p>
                <ul className="grid gap-1.5" aria-label="process tree">
                  {TREE.map((node) => (
                    <li
                      key={node.name}
                      className={`flex min-w-0 items-center justify-between gap-2 rounded-md border px-2 py-1.5 ${scene.status === "unknown" ? "border-dashed" : ""}`}
                      style={{ borderColor: status.color, marginLeft: `${node.depth * 1.25}rem` }}
                    >
                      <span className="min-w-0 break-all font-mono text-xs font-bold">
                        {node.depth > 0 ? "└ " : ""}
                        {node.name}
                      </span>
                      <span className="shrink-0 text-[11px] font-bold" style={{ color: status.color }}>{status.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="min-w-0 rounded-md border border-border p-2">
                <p className="mb-2 text-[11px] font-bold text-muted-foreground">runtime이 돌려준 observation</p>
                <ul className="grid gap-1 text-xs leading-5">
                  {scene.observation.map((line) => (
                    <li key={line} className="break-keep border-l-2 border-border pl-2">{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
