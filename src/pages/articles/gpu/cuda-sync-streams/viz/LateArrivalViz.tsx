import SceneShell from "./SceneShell";
import TimeLanes, { type LaneRow } from "./TimeLanes";

/**
 * 본문 대응: #sync-overhead-divergence — 3μs와 8μs 도착이면 먼저 온 쪽이 적어도 8 − 3 = 5μs 기다린다(가정).
 * 늦는 것과 오지 않는 것은 다른 문제이며, fence 실패와 barrier 실패의 점검 대상도 다르다.
 */
const SCENES: readonly { label: string; summary: string; note: string; lanes?: readonly LaneRow[] }[] = [
  {
    label: "늦게 오는 상대",
    summary: "8 − 3 = 5μs 대기",
    note: "먼저 온 쪽은 적어도 5μs를 기다립니다. 작업 불균형에서 생긴 대기라 barrier 명령의 고정 비용이 아니며, 명령 처리량과 memory ordering 비용은 따로 있습니다.",
    lanes: [
      { name: "참여자 1", segs: [{ from: 0, to: 3, label: "일 3", tone: "send" }, { from: 3, to: 8, label: "대기 5", tone: "wait" }] },
      { name: "참여자 2", segs: [{ from: 0, to: 8, label: "일 8", tone: "send" }] },
    ],
  },
  {
    label: "오지 않는 상대",
    summary: "대기가 아니라 정확성 문제",
    note: "참여해야 하는 thread가 끝나지 않은 채 다른 경로를 반복하며 barrier에 오지 않는 경우입니다. 더 오래 기다리거나 더 빠른 barrier로 바꿔도 해결되지 않습니다.",
    lanes: [
      { name: "참여자 1", segs: [{ from: 0, to: 3, label: "일 3", tone: "send" }, { from: 3, to: 12, label: "끝나지 않는 대기", tone: "bad" }] },
      { name: "참여자 2", segs: [{ from: 0, to: 12, label: "다른 경로 반복", tone: "bad" }] },
    ],
  },
  { label: "무엇을 점검하나", summary: "실패 종류마다 다름", note: "두 문제를 분리해야 어떤 수정이 필요한지 정할 수 있습니다. 정상적인 불균형은 작업 분배나 필요 없는 동기화 제거로 줄입니다." },
];

const BRANCHES: readonly (readonly [string, readonly string[]])[] = [
  ["Fence만 쓴 실패", ["읽기·쓰기의 순서", "publication"]],
  ["Barrier 실패", ["참여 집합", "분기", "반복 회차", "기대 도착 수"]],
];

export default function LateArrivalViz() {
  return (
    <SceneShell
      eyebrow="barrier에서 기다리는 시간"
      title="늦는 상대와 오지 않는 상대는 어떻게 다를까요"
      description="3μs와 8μs는 설명을 위한 가정입니다. 세로선이 barrier입니다."
      ariaLabel="barrier에 늦게 도착하는 경우와 도착하지 않는 경우, 실패 종류별 점검 대상"
      scenes={SCENES}
      render={(index) => {
        const lanes = SCENES[index].lanes;
        if (lanes) {
          return <TimeLanes lanes={lanes} max={12} ticks={index === 0 ? [0, 3, 8] : [0, 3]} unit="μs" marks={index === 0 ? [{ at: 8, label: "barrier" }] : [{ at: 12, label: "barrier 통과 없음" }]} />;
        }
        return (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {BRANCHES.map(([name, items]) => (
              <div key={name} className="rounded-lg border border-border p-2 sm:p-3">
                <p className="text-sm font-bold">{name}</p>
                <ul className="mt-2 space-y-1 text-xs sm:text-sm">
                  {items.map((item) => <li key={item} className="rounded border border-border/70 px-2 py-1">{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
