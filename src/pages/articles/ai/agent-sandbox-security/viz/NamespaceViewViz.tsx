import SceneShell from "./SceneShell";

/**
 * 본문 대응: #namespace — 같은 host 자원을 namespace가 다른 이름과 범위로 보여 준다.
 * 본문 예: host PID 43120 → container 안 PID 12, host 전체 mount → /workspace.
 * 경계: namespace는 CPU·memory 사용량을 제한하지 않는다(그 일은 cgroup, 2절).
 */
const SCENES = [
  {
    label: "Host에서 본 자원",
    summary: "PID 43120 · 전체 mount",
    note: "Host에서는 agent process가 PID 43120으로 보이고, 다른 process와 host의 전체 mount도 함께 보입니다. 다른 process 칸은 자리만 표시한 것입니다.",
  },
  {
    label: "PID namespace 안에서",
    summary: "43120 → 12",
    note: "Namespace는 process가 볼 자원의 view를 분리합니다. 같은 process가 container 안에서는 PID 12로 보입니다. Process가 새로 생긴 것이 아니라 보이는 이름이 바뀐 것입니다.",
  },
  {
    label: "Mount namespace 안에서",
    summary: "전체 mount → /workspace",
    note: "Host의 전체 mount 대신 /workspace만 보일 수 있습니다. 보이는 목록과 범위가 줄어든 것입니다.",
  },
  {
    label: "Namespace가 하지 않는 일",
    summary: "사용량 제한 없음",
    note: "Namespace는 CPU·memory 사용량을 제한하지 않고, 허용된 system call을 대신 처리하지도 않습니다. 사용량 제한은 다음 절의 cgroup이 맡습니다.",
  },
] as const;

const ROWS = [
  { kind: "PID", host: "PID 43120", hostExtra: "다른 process ⋯", inner: "PID 12", scene: 1 },
  { kind: "mount", host: "host 전체 mount", hostExtra: null, inner: "/workspace만", scene: 2 },
  { kind: "CPU·memory", host: "사용량", hostExtra: null, inner: "제한하지 않음 · cgroup의 일", scene: 3 },
] as const;

export default function NamespaceViewViz() {
  return (
    <SceneShell
      eyebrow="Namespace resource view"
      title="같은 process가 host와 container 안에서 다른 이름으로 보입니다"
      description="왼쪽은 host에서 본 목록, 오른쪽은 namespace 안의 agent process가 보는 목록입니다. 가로줄 하나가 같은 자원입니다."
      ariaLabel="host PID 43120이 namespace 안에서 PID 12로, 전체 mount가 /workspace로 보이는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          <div className="grid grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)] gap-2 text-center text-[11px] font-bold text-muted-foreground">
            <span>host view</span>
            <span />
            <span>agent process view</span>
          </div>
          {ROWS.map((row) => {
            const shown = active >= row.scene;
            const current = active === row.scene;
            const boundary = row.scene === 3;
            return (
              <div key={row.kind} className="grid grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)] items-stretch gap-2">
                <div className={`min-w-0 rounded-lg border px-2 py-2 text-xs leading-5 ${active === 0 && !boundary ? "border-primary/60" : "border-border"}`}>
                  <span className="block text-[11px] text-muted-foreground">{row.kind}</span>
                  <span className="block break-words font-mono">{row.host}</span>
                  {row.hostExtra ? <span className="block text-muted-foreground">{row.hostExtra}</span> : null}
                </div>
                <span aria-hidden className={`self-center text-center text-base ${shown && !boundary ? "text-primary" : shown ? "text-amber-600" : "text-muted-foreground/30"}`}>
                  {boundary && shown ? "✕" : "→"}
                </span>
                <div
                  className={`min-w-0 rounded-lg border px-2 py-2 text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none ${
                    shown ? (current ? (boundary ? "border-dashed border-amber-600 opacity-100" : "border-primary bg-primary/10 opacity-100") : "border-border opacity-100") : "border-dashed border-border opacity-30"
                  }`}
                >
                  <span className="block text-[11px] text-muted-foreground">{row.kind}</span>
                  <span className="block break-words font-mono">{shown ? row.inner : "?"}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
