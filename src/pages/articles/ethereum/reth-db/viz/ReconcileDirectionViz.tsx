import SceneShell from "./SceneShell";
import { StoreLanes, type Cell } from "./StoreLanes";

/**
 * 본문 대응: #recovery — 재시작 때 각 저장소를 MDBX의 보이는 tip과 비교한다.
 * 앞섬(ahead)은 잘라 내거나 지우고, 뒤처짐(behind)은 prune으로 채울 수 없어 RocksDB는 unwind·rebuild, static files는 오류로 중단.
 * 장면 1~2는 본문의 999/1,000 예, 장면 3~4의 뒤처진 블록 번호는 설명용 가정이다.
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
  statTag: string;
  rocksTag: string;
  verdict: string;
  bad?: boolean;
}

const BASE: readonly Cell[] = ["has", "has", "none"];
const AHEAD: readonly Cell[] = ["has", "has", "ahead"];
const FULL: readonly Cell[] = ["has", "has", "has"];
const CUT: readonly Cell[] = ["has", "has", "cut"];
const GAP: readonly Cell[] = ["has", "has", "gap"];

const SCENES: readonly SceneDef[] = [
  {
    short: "종료",
    label: "MDBX commit 전에 종료",
    summary: "1,000 / 1,000 / 999",
    note: "본문의 예입니다. Static files와 RocksDB에 블록 1,000 자료가 반영된 뒤 MDBX commit 전에 프로세스가 끝났습니다. 재시작 시 공개 지점은 여전히 999입니다.",
    stat: AHEAD, rocks: AHEAD, mdbx: BASE, tip: 1,
    statTag: "앞섬", rocksTag: "앞섬",
    verdict: "공개 지점 999 · 1,000은 공개하지 않음",
  },
  {
    short: "맞춤",
    label: "앞선 자료를 tip에 맞춤",
    summary: "999 / 999 / 999",
    note: "Static files는 MDBX의 highest uninterrupted block까지 잘라 내고, RocksDB는 MDBX stage checkpoint를 기준으로 stale history·index를 지웁니다. 1,000 자료는 새 canonical state로 공개되지 않습니다.",
    stat: CUT, rocks: CUT, mdbx: BASE, tip: 1,
    statTag: "999까지 잘라 냄", rocksTag: "stale 자료 지움",
    verdict: "앞섬 → 잘라 내거나 지우면 맞춰짐",
  },
  {
    short: "rocks 뒤",
    label: "RocksDB가 뒤처짐 (가정)",
    summary: "1,000 / 999 / 1,000",
    note: "MDBX checkpoint가 1,000인데 RocksDB에는 999까지만 있다고 가정합니다. 없는 자료는 지워서 만들 수 없으므로 단순 prune으로는 채울 수 없고, pipeline unwind와 rebuild가 필요합니다.",
    stat: FULL, rocks: GAP, mdbx: FULL, tip: 2,
    statTag: "맞음", rocksTag: "prune으로 못 채움",
    verdict: "뒤처짐 → pipeline unwind와 rebuild",
    bad: true,
  },
  {
    short: "static 뒤",
    label: "Static files가 뒤처짐 (가정)",
    summary: "999 / 1,000 / 1,000",
    note: "MDBX가 1,000을 공개했는데 static files에 그 immutable history가 없다고 가정합니다. 필요한 자료가 없으므로 정상으로 가장하지 않고 오류로 중단합니다.",
    stat: GAP, rocks: FULL, mdbx: FULL, tip: 2,
    statTag: "필요한 history 없음", rocksTag: "맞음",
    verdict: "뒤처짐 → 오류로 중단",
    bad: true,
  },
];

export default function ReconcileDirectionViz() {
  return (
    <SceneShell
      eyebrow="재시작 재조정 · 앞섬과 뒤처짐"
      title="MDBX의 보이는 tip보다 앞선 자료는 잘라 내고, 뒤처진 자료는 지워서 채울 수 없습니다"
      description="행은 저장소, 열은 블록 번호, ▼는 MDBX가 commit한 공개 지점입니다. 같은 “불일치”라도 tip을 넘는 자료가 남았는지(앞섬), tip까지 있어야 할 자료가 비었는지(뒤처짐)에 따라 복구 방향이 갈립니다."
      note="첫 두 장면은 본문의 999/1,000 예이고, 뒤처짐 두 장면의 블록 번호는 설명용 가정입니다."
      ariaLabel="재시작 때 저장소가 MDBX tip보다 앞섰는지 뒤처졌는지에 따라 복구 방향이 갈리는 장면"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <StoreLanes
              columns={COLUMNS}
              tipIndex={scene.tip}
              lanes={[
                { name: "Static files", cells: scene.stat, tag: scene.statTag },
                { name: "RocksDB", cells: scene.rocks, tag: scene.rocksTag },
                { name: "MDBX", cells: scene.mdbx, tag: "복구 기준" },
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
