import SceneShell from "./SceneShell";

/**
 * 본문 대응: #csi-path — 노드에서는 NodeStage가 한 번, NodePublish가 Pod마다 일어나고, 해제는 역순이다.
 * 같은 노드의 Pod 두 개가 같은 PV를 쓰면 stage 1회, publish 2회. 마지막 Pod가 사라져야 NodeUnstage, 그다음 ControllerUnpublish.
 */
type Disk = "attached" | "detached";

interface Scene {
  label: string;
  summary: string;
  disk: Disk;
  staged: boolean;
  pods: readonly [boolean, boolean];
  calls: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "attach만",
    summary: "stage 0 · publish 0",
    disk: "attached",
    staged: false,
    pods: [false, false],
    calls: "ControllerPublishVolume (이전 계단)",
    note: "ControllerPublishVolume으로 디스크가 이 노드에 붙은 상태(NODE_READY)입니다. 아직 포맷도 마운트도 되지 않아 어떤 Pod도 파일을 쓸 수 없습니다.",
  },
  {
    label: "NodeStage",
    summary: "stage 1 · publish 0",
    disk: "attached",
    staged: true,
    pods: [false, false],
    calls: "MountDevice → NodeStageVolume",
    note: "kubelet의 MountDevice가 NodeStageVolume을 불러 디스크를 포맷하고 노드 전역 staging 경로에 한 번 마운트합니다(VOL_READY). 이 마운트는 Pod가 아니라 노드에 속합니다.",
  },
  {
    label: "Pod 1 publish",
    summary: "stage 1 · publish 1",
    disk: "attached",
    staged: true,
    pods: [true, false],
    calls: "SetUpAt → NodePublishVolume (Pod 1)",
    note: "SetUpAt이 NodePublishVolume을 불러 staging 경로를 Pod 1의 volumes 디렉터리에 bind mount합니다(PUBLISHED). 컨테이너가 파일을 쓰는 곳이 이 디렉터리입니다.",
  },
  {
    label: "Pod 2 publish",
    summary: "stage 1 · publish 2",
    disk: "attached",
    staged: true,
    pods: [true, true],
    calls: "SetUpAt → NodePublishVolume (Pod 2)",
    note: "(가정) 같은 PV를 쓰는 두 번째 Pod가 같은 노드에 왔습니다. staging은 이미 있으니 publish만 한 번 더 합니다. 붙는 단위가 노드라서 RWO는 같은 노드의 Pod 둘을 막지 않습니다.",
  },
  {
    label: "Pod 1 종료",
    summary: "stage 1 · publish 1",
    disk: "attached",
    staged: true,
    pods: [false, true],
    calls: "NodeUnpublish (Pod 1)",
    note: "해제는 역순입니다. Pod 1이 사라지면 그 Pod의 bind mount만 NodeUnpublish로 풉니다. Pod 2가 아직 쓰므로 staging 마운트와 attach는 그대로입니다.",
  },
  {
    label: "마지막 Pod",
    summary: "stage 0 · publish 0",
    disk: "detached",
    staged: false,
    pods: [false, false],
    calls: "NodeUnpublish → NodeUnstage → ControllerUnpublish",
    note: "이 노드의 마지막 Pod가 사라지면 NodeUnpublish 뒤에 NodeUnstage로 staging 마운트를 풀고, ControllerUnpublish로 디스크를 노드에서 뗍니다. PVC까지 지워지고 reclaimPolicy가 Delete면 그다음이 DeleteVolume입니다.",
  },
];

const ON = "#2563eb";
const OFF = "#94a3b8";

function Row({ name, path, on, onText, offText, inline = false }: { name: string; path: string; on: boolean; onText: string; offText: string; inline?: boolean }) {
  return (
    <div
      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border px-3 py-1.5"
      style={{ borderColor: on ? ON : OFF, borderStyle: on ? "solid" : "dashed" }}
    >
      <div className={`min-w-0 ${inline ? "sm:flex sm:items-baseline sm:gap-3" : ""}`}>
        <p className="text-sm font-bold">{name}</p>
        <p className="break-all font-mono text-[11px] leading-5 text-muted-foreground">{path}</p>
      </div>
      <span className="whitespace-nowrap text-xs font-bold" style={{ color: on ? ON : OFF }}>
        {on ? onText : offText}
      </span>
    </div>
  );
}

export default function StagePublishViz() {
  return (
    <SceneShell
      eyebrow="노드 안의 두 겹 마운트"
      title="디스크는 노드에 한 번 마운트되고, Pod마다 그 자리를 다시 묶습니다"
      description="한 노드 안을 위에서 아래로 그렸습니다. staging 경로는 노드 전역에 한 번 마운트하는 자리이고, bind mount는 이미 마운트된 디렉터리를 다른 경로에서도 그대로 보이게 하는 마운트입니다. 실선은 연결된 상태, 점선은 비어 있는 상태입니다."
      ariaLabel="같은 노드의 Pod 두 개가 한 PV를 쓸 때 stage와 publish 횟수, 그리고 역순 해제"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0 rounded-xl border border-border p-3 sm:p-4">
            <p className="mb-2 text-xs font-bold text-muted-foreground">노드 하나 (가정)</p>
            <div className="space-y-2">
              <Row name="디스크" path="ControllerPublish로 attach" on={s.disk === "attached"} onText="붙음" offText="떨어짐" inline />
              <div className="pl-3 sm:pl-6">
                <Row name="staging 경로 (노드당 1개)" path="…/csi/pv-hash/globalmount" on={s.staged} onText="마운트됨" offText="없음" inline />
              </div>
              <div className="grid gap-2 pl-6 sm:grid-cols-2 sm:pl-12">
                <Row name="Pod 1 디렉터리" path="…/pods/<uid>/volumes/…/mount" on={s.pods[0]} onText="bind mount" offText="없음" />
                <Row name="Pod 2 디렉터리" path="…/pods/<uid>/volumes/…/mount" on={s.pods[1]} onText="bind mount" offText="없음" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 border-t border-border pt-3 text-xs leading-5">
              <span className="text-muted-foreground">이번 호출</span>
              <span className="break-words font-mono font-bold" style={{ color: ON }}>{s.calls}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
