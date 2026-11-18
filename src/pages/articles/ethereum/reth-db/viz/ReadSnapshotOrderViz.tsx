import SceneShell from "./SceneShell";
import { StoreLanes, type Cell } from "./StoreLanes";

/**
 * 본문 대응: #read — consistent provider는 in-memory canonical head를 먼저 capture하고 그다음 DB snapshot을 연다.
 * 순서를 바꾸면 snapshot을 연 직후 flush가 일어나 두 범위 사이에 빈 구간이 생길 수 있다. 겹치는 최신 범위는 memory가 우선.
 * 디스크 999까지 · memory 1,000~1,002 · 읽는 도중 1,000~1,001 flush는 설명용 가정이다.
 */
const COLUMNS: readonly string[] = ["999", "1000", "1001", "1002"];

interface SceneDef {
  label: string;
  short: string;
  summary: string;
  note: string;
  disk: readonly Cell[];
  mem: readonly Cell[];
  snap: readonly Cell[];
  head: readonly Cell[];
  view: readonly Cell[];
  viewTag: string;
  verdict: string;
  bad?: boolean;
}

const NONE: readonly Cell[] = ["none", "none", "none", "none"];
const DISK_BEFORE: readonly Cell[] = ["has", "none", "none", "none"];
const DISK_AFTER: readonly Cell[] = ["has", "has", "has", "none"];
const MEM_BEFORE: readonly Cell[] = ["none", "has", "has", "has"];
const MEM_AFTER: readonly Cell[] = ["none", "none", "none", "has"];

const SCENES: readonly SceneDef[] = [
  {
    short: "snap 먼저",
    label: "DB snapshot 먼저 (뒤바뀐 순서)",
    summary: "snapshot = 999까지",
    note: "순서를 뒤집어 DB snapshot부터 엽니다. 이 순간 디스크에는 999까지, memory에는 아직 flush되지 않은 1,000~1,002가 있다고 가정합니다.",
    disk: DISK_BEFORE, mem: MEM_BEFORE, snap: DISK_BEFORE, head: NONE, view: NONE,
    viewTag: "아직 조합 전", verdict: "snapshot은 열린 순간의 디스크만 봅니다",
  },
  {
    short: "flush",
    label: "그 사이 flush",
    summary: "1,000~1,001 → 디스크",
    note: "Snapshot을 연 직후 memory의 1,000~1,001이 디스크로 flush됩니다(가정). 이미 연 snapshot은 999까지 그대로이고, memory에는 1,002만 남습니다.",
    disk: DISK_AFTER, mem: MEM_AFTER, snap: DISK_BEFORE, head: NONE, view: NONE,
    viewTag: "아직 조합 전", verdict: "옮겨 간 블록은 snapshot에도 memory에도 없음",
    bad: true,
  },
  {
    short: "capture",
    label: "그다음 memory capture",
    summary: "999 + 1,002 → 빈 구간",
    note: "이제 memory head를 capture하면 1,002만 잡힙니다. snapshot의 999까지와 합치면 1,000~1,001이 비는 빈 구간이 생깁니다.",
    disk: DISK_AFTER, mem: MEM_AFTER, snap: DISK_BEFORE, head: MEM_AFTER, view: ["has", "gap", "gap", "has"],
    viewTag: "1,000~1,001 빔", verdict: "두 범위 사이 빈 구간",
    bad: true,
  },
  {
    short: "head 먼저",
    label: "memory head 먼저 (Reth 순서)",
    summary: "head = 1,000~1,002",
    note: "같은 상황에서 Reth처럼 in-memory canonical head를 먼저 capture합니다. 그 순간 memory에 있던 1,000~1,002가 고정됩니다.",
    disk: DISK_BEFORE, mem: MEM_BEFORE, snap: NONE, head: MEM_BEFORE, view: NONE,
    viewTag: "아직 조합 전", verdict: "memory 범위를 먼저 고정",
  },
  {
    short: "같은 flush",
    label: "같은 flush가 일어나도",
    summary: "1,000~1,001 → 디스크",
    note: "같은 flush가 일어나도 이미 고정한 head는 1,000~1,002를 그대로 가리킵니다.",
    disk: DISK_AFTER, mem: MEM_AFTER, snap: NONE, head: MEM_BEFORE, view: NONE,
    viewTag: "아직 조합 전", verdict: "고정한 head는 바뀌지 않음",
  },
  {
    short: "snapshot",
    label: "그다음 DB snapshot",
    summary: "겹침 1,000~1,001 · 빈칸 없음",
    note: "이제 snapshot은 1,001까지 봅니다. 1,000~1,001은 두 쪽에 겹치고, 겹치는 최신 범위는 memory가 우선합니다. 한 query가 999~1,002를 빈칸 없이 읽습니다.",
    disk: DISK_AFTER, mem: MEM_AFTER, snap: DISK_AFTER, head: MEM_BEFORE, view: ["has", "has", "has", "has"],
    viewTag: "겹침은 memory 우선", verdict: "빈 구간 없이 한 chain frontier",
  },
];

export default function ReadSnapshotOrderViz() {
  return (
    <SceneShell
      eyebrow="읽기 순서 · memory head와 DB snapshot"
      title="memory head를 먼저 고정해야 flush가 끼어들어도 빈 구간이 생기지 않습니다"
      description="위 두 줄은 지금 실제 위치, 가운데 두 줄은 독자가 고정한 범위, 맨 아래 줄은 두 범위를 합쳐 query가 읽는 블록입니다. 앞 세 장면은 순서를 뒤집은 경우, 뒤 세 장면은 본문이 설명하는 Reth 순서입니다."
      note="디스크 999까지 · memory 1,000~1,002 · 읽는 도중 1,000~1,001 flush는 설명용 가정입니다."
      ariaLabel="memory head capture와 DB snapshot 열기의 순서에 따라 빈 구간이 생기거나 생기지 않는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <StoreLanes
              columns={COLUMNS}
              lanes={[
                { name: "디스크 (지금)", cells: scene.disk },
                { name: "Memory (지금)", cells: scene.mem, tag: "아직 flush 안 됨" },
                { name: "고정한 DB snapshot", cells: scene.snap },
                { name: "고정한 memory head", cells: scene.head },
                { name: "query가 읽는 범위", cells: scene.view, tag: scene.viewTag },
              ]}
            />
            <p
              className="mt-3 rounded border px-3 py-2 text-center text-xs font-bold"
              style={{ borderColor: scene.bad ? "#ef4444" : "#10b981", color: scene.bad ? "#dc2626" : "#047857" }}
            >
              {scene.verdict}
            </p>
          </div>
        );
      }}
    />
  );
}
