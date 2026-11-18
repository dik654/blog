import SceneShell from "./SceneShell";
import { StoreLanes, type Cell } from "./StoreLanes";

/**
 * 본문 대응: #commit — 정상 저장은 static files → RocksDB → MDBX, unwind는 MDBX → RocksDB → static files.
 * 공개 지점은 MDBX가 commit한 마지막 블록이다. 앞선 저장소가 MDBX보다 잠시 앞서는 것은 허용되고, MDBX만 앞서는 정상 경로는 없다.
 * Unwind 대상(1,000 → 999)과 마지막 장면의 거꾸로 된 순서는 설명용 가정이다.
 */
const COLUMNS: readonly string[] = ["998", "999", "1000"];

interface SceneDef {
  label: string;
  short: string;
  summary: string;
  note: string;
  stat: readonly Cell[];
  rocks: readonly Cell[];
  mdbx: readonly Cell[];
  tip: number;
  check: string;
  bad?: boolean;
}

const BASE: readonly Cell[] = ["has", "has", "none"];
const AHEAD: readonly Cell[] = ["has", "has", "ahead"];
const FULL: readonly Cell[] = ["has", "has", "has"];
const CUT: readonly Cell[] = ["has", "has", "cut"];
const GAP: readonly Cell[] = ["has", "has", "gap"];

const SCENES: readonly SceneDef[] = [
  {
    short: "전",
    label: "저장 전",
    summary: "공개 지점 999",
    note: "세 저장소 모두 999까지 갖고 있습니다. 공개 지점은 MDBX가 마지막으로 commit한 999입니다.",
    stat: BASE, rocks: BASE, mdbx: BASE, tip: 1,
    check: "MDBX만 앞선 저장소 없음",
  },
  {
    short: "static",
    label: "01 · Static files finalize",
    summary: "static 1,000 · 공개 999",
    note: "Static files가 블록 1,000 segment를 먼저 확정합니다. MDBX는 아직 999이므로 독자에게 1,000은 보이지 않습니다. 앞선 저장소가 잠시 앞서는 것은 허용됩니다.",
    stat: AHEAD, rocks: BASE, mdbx: BASE, tip: 1,
    check: "static이 MDBX보다 앞섬 · 허용",
  },
  {
    short: "rocks",
    label: "02 · RocksDB commit",
    summary: "rocks 1,000 · 공개 999",
    note: "RocksDB가 history와 lookup index batch를 commit합니다. 여전히 공개 지점은 999입니다.",
    stat: AHEAD, rocks: AHEAD, mdbx: BASE, tip: 1,
    check: "두 저장소가 앞섬 · 허용",
  },
  {
    short: "MDBX",
    label: "03 · MDBX commit",
    summary: "공개 지점 1,000",
    note: "마지막 MDBX commit으로 블록 1,000이 독자에게 보이게 됩니다. “블록 1,000이 저장됐다”는 말은 이 순간을 가리킵니다.",
    stat: FULL, rocks: FULL, mdbx: FULL, tip: 2,
    check: "세 저장소가 같은 지점",
  },
  {
    short: "unwind 1",
    label: "Unwind 1 · MDBX 먼저 (가정 1,000 → 999)",
    summary: "공개 지점 999",
    note: "Unwind는 거꾸로 MDBX를 먼저 되돌립니다. 공개 지점이 999로 내려가고, 나머지 두 저장소의 1,000 자료는 공개되지 않은 앞선 자료가 됩니다. 본문은 이 순서가 독자에게 이전 canonical frontier보다 새로운 과거 자료를 보이지 않게 한다고 설명합니다.",
    stat: AHEAD, rocks: AHEAD, mdbx: CUT, tip: 1,
    check: "MDBX만 앞선 저장소 없음",
  },
  {
    short: "unwind 2",
    label: "Unwind 2 · RocksDB",
    summary: "rocks 999",
    note: "RocksDB의 1,000 history·index를 되돌립니다. Static files만 아직 앞서 있습니다.",
    stat: AHEAD, rocks: CUT, mdbx: CUT, tip: 1,
    check: "static만 앞섬 · 허용",
  },
  {
    short: "unwind 3",
    label: "Unwind 3 · Static files",
    summary: "세 저장소 999",
    note: "마지막으로 static files를 되돌리면 세 저장소가 다시 999에서 만납니다. 어느 순간에도 MDBX가 공개한 지점보다 다른 저장소가 뒤처지지 않았습니다.",
    stat: CUT, rocks: CUT, mdbx: CUT, tip: 1,
    check: "세 저장소가 같은 지점",
  },
  {
    short: "거꾸로",
    label: "(가정) MDBX가 먼저 commit됐다면",
    summary: "공개 1,000인데 자료 없음",
    note: "본문의 순서를 뒤집어 MDBX가 먼저 1,000을 commit했다고 가정하면 공개 지점은 1,000인데 static files와 RocksDB에는 그 블록의 history가 없습니다. 본문이 만들지 않는다고 한 “MDBX만 앞서는” 상태입니다.",
    stat: GAP, rocks: GAP, mdbx: FULL, tip: 2,
    check: "MDBX만 앞섬 · 정상 경로에 없음",
    bad: true,
  },
];

export default function CommitUnwindOrderViz() {
  return (
    <SceneShell
      eyebrow="저장 순서 · 공개 지점"
      title="정상 저장은 MDBX를 마지막에, unwind는 MDBX를 먼저 움직입니다"
      description="행은 저장소, 열은 블록 번호입니다. ▼는 MDBX가 commit한 공개 지점입니다. 두 순서 모두 다른 저장소가 공개 지점보다 앞설 수는 있어도 뒤처지지는 않습니다."
      note="Unwind 대상 블록과 마지막 장면의 거꾸로 된 순서는 설명용 가정입니다. 순서 자체는 본문이 근거로 든 Reth v2.8.1 source에 귀속합니다."
      ariaLabel="정상 저장과 unwind에서 세 저장소의 블록 범위와 공개 지점이 바뀌는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <StoreLanes
              columns={COLUMNS}
              tipIndex={scene.tip}
              lanes={[
                { name: "Static files", cells: scene.stat },
                { name: "RocksDB", cells: scene.rocks },
                { name: "MDBX", cells: scene.mdbx, tag: "공개 지점을 정함" },
              ]}
            />
            <p
              className="mt-3 rounded border px-3 py-2 text-center text-xs font-bold"
              style={{ borderColor: scene.bad ? "#ef4444" : "#10b981", color: scene.bad ? "#dc2626" : "#047857" }}
            >
              {scene.check}
            </p>
          </div>
        );
      }}
    />
  );
}
