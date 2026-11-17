import AutobahnSceneShell from "./AutobahnSceneShell";

/**
 * 본문 대응: #lanes-cut cut 문단 — 이전 cut [1,1,1,1] 뒤 cut [2,2,2,3]이면 A2, B2, C2, D2·D3을 처리하고,
 * 나중 cut에 더 낮은 과거 위치가 들어 있어도 차선별 마지막 커밋 위치 이하는 다시 출력하지 않는다.
 * 두 번째 cut [3,3,2,2]는 그 규칙을 보이려는 가정이다.
 * 계산: 차선마다 새로 출력할 위치 = (기록 위치, cut 위치]. cut 위치 ≤ 기록 위치면 출력 없음, 기록 위치는 그대로.
 */
const LANES = ["A", "B", "C", "D"] as const;
const MAX_POSITION = 3;

interface WatermarkScene {
  label: string;
  summary: string;
  note: string;
  /** 이 장면을 처리하기 전 차선별 마지막 커밋 위치 */
  before: readonly number[];
  /** 이 장면에서 받은 cut. null이면 아직 비교하지 않음 */
  cut: readonly number[] | null;
  /** 출력까지 반영했는지 */
  applied: boolean;
}

const SCENES: readonly WatermarkScene[] = [
  {
    label: "cut [2,2,2,3] 도착",
    summary: "기록 [1,1,1,1]",
    note: "각 노드는 차선마다 마지막으로 커밋한 위치를 적어 둡니다. 지금은 네 차선 모두 1입니다. 새 cut은 A·B·C의 끝점을 2, D의 끝점을 3으로 가리킵니다.",
    before: [1, 1, 1, 1],
    cut: [2, 2, 2, 3],
    applied: false,
  },
  {
    label: "기록 뒤 부분만 출력",
    summary: "A2 B2 C2 D2 D3 → 기록 [2,2,2,3]",
    note: "차선마다 '기록 위치 다음부터 cut 위치까지'만 새로 처리합니다. A·B·C는 한 칸씩, D는 두 칸이라 모두 다섯 칸이고, 처리 뒤 기록은 [2,2,2,3]이 됩니다. 다섯 칸을 한 줄로 섞는 순서는 논문의 zipper 규칙이 정합니다.",
    before: [1, 1, 1, 1],
    cut: [2, 2, 2, 3],
    applied: true,
  },
  {
    label: "다음 cut [3,3,2,2] 도착",
    summary: "D: cut 2 < 기록 3",
    note: "다음 cut이 [3,3,2,2]라고 해 봅시다(가정). A·B는 기록보다 앞으로 갔지만 C는 기록과 같고, D는 이미 커밋한 3보다 낮은 과거 위치 2를 가리킵니다.",
    before: [2, 2, 2, 3],
    cut: [3, 3, 2, 2],
    applied: false,
  },
  {
    label: "기록 이하는 다시 내지 않음",
    summary: "A3 B3만 출력 → 기록 [3,3,2,3]",
    note: "C와 D에서는 새로 낼 칸이 없습니다. D2를 다시 출력하면 같은 거래가 두 번 실행되므로 건너뛰고, D의 기록도 2로 내리지 않고 3에 둡니다. 결과 기록은 [3,3,2,3]입니다.",
    before: [2, 2, 2, 3],
    cut: [3, 3, 2, 2],
    applied: true,
  },
];

function cellState(scene: WatermarkScene, laneIndex: number, position: number): "committed" | "new" | "pending" | "empty" {
  const before = scene.before[laneIndex];
  const cutPosition = scene.cut ? scene.cut[laneIndex] : 0;
  if (position <= before) return "committed";
  if (position <= cutPosition) return scene.applied ? "new" : "pending";
  return "empty";
}

const CELL_CLASS = {
  committed: "border-border bg-muted text-muted-foreground",
  new: "border-primary bg-primary text-primary-foreground",
  pending: "border-primary border-dashed text-primary",
  empty: "border-dashed border-border/40 text-muted-foreground/30",
} as const;

export default function CommitWatermarkViz() {
  return (
    <AutobahnSceneShell
      eyebrow="차선별 커밋 기록 · 두 cut 연속 처리"
      title="나중 cut이 과거 위치를 가리켜도 같은 자동차를 두 번 내지 않습니다"
      description="한 줄이 한 차선이고 칸 번호가 차선 위치입니다. 회색은 이미 커밋한 칸, 점선 테두리는 cut이 새로 가리킨 칸, 진하게 채운 칸은 이번에 출력한 칸입니다."
      note="두 번째 cut [3,3,2,2]는 규칙을 보이기 위한 가정입니다. 출력한 칸을 차선 사이에서 한 줄로 섞는 zipper 순서는 그리지 않았습니다."
      ariaLabel="cut 두 개를 연속 처리하며 차선별 마지막 커밋 위치 이하를 건너뛰는 네 장면"
      playLabel="커밋 기록 비교 재생"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const after = scene.before.map((before, index) => (scene.cut && scene.applied ? Math.max(before, scene.cut[index]) : before));
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_3.25rem_3.25rem] items-center gap-x-2 text-[11px] font-semibold text-muted-foreground">
              <span />
              <span>위치 1 · 2 · 3</span>
              <span className="text-center">cut</span>
              <span className="text-center">기록</span>
            </div>
            {LANES.map((lane, laneIndex) => {
              const cutPosition = scene.cut ? scene.cut[laneIndex] : null;
              const stale = cutPosition !== null && cutPosition <= scene.before[laneIndex];
              return (
                <div key={lane} className="grid grid-cols-[1.5rem_minmax(0,1fr)_3.25rem_3.25rem] items-center gap-x-2">
                  <span className="text-center text-sm font-black">{lane}</span>
                  <div className="grid min-w-0 grid-cols-3 gap-1">
                    {Array.from({ length: MAX_POSITION }, (_, offset) => {
                      const position = offset + 1;
                      const state = cellState(scene, laneIndex, position);
                      return (
                        <span key={position} className={`rounded border px-1 py-1.5 text-center text-xs font-bold ${CELL_CLASS[state]}`}>
                          {lane}
                          {position}
                        </span>
                      );
                    })}
                  </div>
                  <span className={`rounded border px-1 py-1.5 text-center font-mono text-xs font-bold ${stale ? "border-red-600 text-red-700 dark:text-red-400" : "border-border"}`}>
                    {cutPosition ?? "−"}
                    {stale ? " ✕" : ""}
                  </span>
                  <span className="rounded border border-border bg-muted px-1 py-1.5 text-center font-mono text-xs font-bold">{after[laneIndex]}</span>
                </div>
              );
            })}
            <p className="text-[11px] leading-5 text-muted-foreground">✕ = cut 위치가 기록 이하라서 그 차선은 이번에 출력할 칸이 없음</p>
          </div>
        );
      }}
    />
  );
}
