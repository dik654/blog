const Lane = ({ label, nodes }: { label: string; nodes: readonly string[] }) => (
  <div className="rounded-lg border border-border bg-background p-4">
    <p className="text-xs font-semibold text-primary">{label}</p>
    <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-3">
      {nodes.map((node, index) => <div key={node} className="min-w-0 rounded-md border border-border bg-muted/20 p-3 text-xs leading-5"><span className="mr-1 font-semibold text-foreground">{index + 1}.</span>{node}</div>)}
    </div>
  </div>
);

export function IpcFinalityViz() {
  return (
    <figure data-viz="ipc-asymmetric-finality" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
      <figcaption className="mb-5"><p className="text-sm font-bold">Parent↔child는 대칭 복사가 아니다</p><p className="mt-1 text-xs leading-5 text-muted-foreground">
            Top-down은 parent finality를 child가 받아들이는 길이고 bottom-up은 child quorum checkpoint를 relayer가 parent에
            제출하는 길입니다.
          </p></figcaption>
      <div className="space-y-3">
        <Lane label="TOP-DOWN" nodes={["parent에서 message·power change 기록", "child consensus가 parent finality에 합의", "child가 queue와 validator changes 실행"]} />
        <Lane label="BOTTOM-UP" nodes={["child가 checkpoint commitment 작성", "validator power quorum 서명", "relayer 제출 뒤 parent가 포함·검증"]} />
      </div>
    </figure>
  );
}
