import SceneShell from "./SceneShell";

/**
 * 본문 대응: #controller-source — bind(1095행)의 네 번 저장.
 * PV.spec.claimRef(1105) → PV phase Bound(1111) → PVC.spec.volumeName·bind-completed(1117) → PVC phase Bound(1123).
 * 어느 저장이 실패해도 함수는 돌아가고 다음 syncClaim이 남은 단계를 잇는다.
 */
type Mark = "todo" | "done" | "fail";

interface Scene {
  label: string;
  summary: string;
  marks: readonly [Mark, Mark, Mark, Mark];
  note: string;
}

const WRITES = [
  { line: "1105행", object: "PV", field: "spec.claimRef → PVC" },
  { line: "1111행", object: "PV", field: "phase = Bound" },
  { line: "1117행", object: "PVC", field: "spec.volumeName → PV, bind-completed 주석" },
  { line: "1123행", object: "PVC", field: "phase = Bound" },
] as const;

const SCENES: readonly Scene[] = [
  {
    label: "묶기 전",
    summary: "PV Available · PVC Pending",
    marks: ["todo", "todo", "todo", "todo"],
    note: "(가정) 344행이 맞는 Available PV를 찾았습니다. 두 객체는 아직 서로를 가리키지 않습니다. 트랜잭션이 없는 API라 이 네 칸을 한 번에 바꿀 수 없습니다.",
  },
  {
    label: "① claimRef",
    summary: "PV Available · PVC Pending",
    marks: ["done", "todo", "todo", "todo"],
    note: "첫 저장은 PV.spec.claimRef입니다. 4절의 두 포인터 중 하나가 생겼지만 phase는 아직 둘 다 그대로입니다.",
  },
  {
    label: "② PV Bound",
    summary: "PV Bound · PVC Pending",
    marks: ["done", "done", "todo", "todo"],
    note: "PV의 phase가 Bound가 됐습니다. 이 순간 kubectl get pv는 Bound, kubectl get pvc는 Pending을 보입니다. 두 STATUS가 몇 초 어긋나 보이는 구간입니다.",
  },
  {
    label: "③ volumeName",
    summary: "PV Bound · PVC Pending",
    marks: ["done", "done", "done", "todo"],
    note: "PVC.spec.volumeName과 bind-completed 주석을 저장해 두 번째 포인터가 생겼습니다. PVC의 phase는 아직 Pending입니다.",
  },
  {
    label: "④ PVC Bound",
    summary: "PV Bound · PVC Bound",
    marks: ["done", "done", "done", "done"],
    note: "네 번째 저장으로 PVC도 Bound가 됩니다. 1절의 \"PVC Bound\"는 이 칸까지 끝났다는 뜻일 뿐, attach나 mount는 아직입니다.",
  },
  {
    label: "③ 실패",
    summary: "다음 syncClaim이 ③부터",
    marks: ["done", "done", "fail", "todo"],
    note: "(가정) ③ 저장이 실패했습니다. 함수는 그대로 돌아가고 PV는 Bound, PVC는 Pending인 채 남습니다. 다음 syncClaim이 남은 ③·④를 이어서 합니다.",
  },
];

const COLOR: Record<Mark, string> = { todo: "#94a3b8", done: "#2563eb", fail: "#dc2626" };
const TEXT: Record<Mark, string> = { todo: "대기", done: "저장됨", fail: "실패" };

export default function BindWritesViz() {
  return (
    <SceneShell
      eyebrow="bind의 네 번 저장"
      title="두 포인터는 네 번의 API 쓰기로 나뉘어 저장됩니다"
      description="위 네 줄이 저장 순서, 아래 두 칸이 그 순간 kubectl get pv와 kubectl get pvc가 보일 STATUS입니다. 행 번호는 Kubernetes v1.37.1 pv_controller.go입니다."
      ariaLabel="PV claimRef, PV phase, PVC volumeName, PVC phase 순으로 저장되며 중간에 두 STATUS가 어긋나는 과정"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const pv = s.marks[1] === "done" ? "Bound" : "Available";
        const pvc = s.marks[3] === "done" ? "Bound" : "Pending";
        return (
          <div className="min-w-0">
            <ol className="space-y-2">
              {WRITES.map((w, i) => {
                const m = s.marks[i];
                return (
                  <li
                    key={w.line}
                    className="grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border px-3 py-1.5"
                    style={{ borderColor: COLOR[m], borderStyle: m === "todo" ? "dashed" : "solid" }}
                  >
                    <span className="font-mono text-sm font-bold" style={{ color: COLOR[m] }}>{i + 1}</span>
                    <span className="min-w-0 text-sm leading-5">
                      <span className="font-bold">{w.object}</span> <span className="break-words font-mono text-xs">{w.field}</span>
                      <span className="block font-mono text-[11px] text-muted-foreground">{w.line}</span>
                    </span>
                    <span className="text-xs font-bold" style={{ color: COLOR[m] }}>{TEXT[m]}</span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm">
              {[["get pv", pv], ["get pvc", pvc]].map(([cmd, status]) => (
                <div key={cmd} className="rounded-lg border border-border px-2 py-2">
                  <span className="block font-mono text-[11px] text-muted-foreground">kubectl {cmd}</span>
                  <span className="font-bold" style={{ color: status === "Bound" ? "#2563eb" : "#64748b" }}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
