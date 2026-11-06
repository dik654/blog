import SceneShell from "./SceneShell";
import TimeLanes, { type LaneRow } from "./TimeLanes";

/**
 * 본문 대응: #sync-overhead-divergence — cudaDeviceSynchronize의 위치. 끝에서 한 번이면 14ms, A마다 호출하면 18ms 모양.
 * 2·5·2ms 모형의 앞선 시간표를 그대로 씁니다.
 */
const A = [{ from: 0, to: 2, label: "H", tone: "send" }, { from: 2, to: 7, label: "A 계산", tone: "run" }, { from: 7, to: 9, label: "D", tone: "fetch" }] as const;

const SCENES: readonly { label: string; summary: string; note: string; lanes: readonly LaneRow[]; ticks: readonly number[] }[] = [
  {
    label: "모두 제출한 뒤 한 번",
    summary: "A·B 겹침 → 14ms",
    note: "A와 B를 모두 제출한 뒤 호출하면 앞서 요청한 작업의 완료를 기다릴 뿐입니다. 이미 제출된 독립 작업의 겹침을 소급해서 없애지 않습니다.",
    lanes: [
      { name: "A", segs: A },
      { name: "B", segs: [{ from: 2, to: 4, label: "H", tone: "send" }, { from: 4, to: 7, label: "대기", tone: "wait" }, { from: 7, to: 12, label: "B 계산", tone: "run" }, { from: 12, to: 14, label: "D", tone: "fetch" }] },
      { name: "host", segs: [{ from: 0, to: 14, label: "한 번 기다림", tone: "wait" }] },
    ],
    ticks: [0, 9, 14],
  },
  {
    label: "A마다 호출",
    summary: "B 제출이 9ms로 → 18ms",
    note: "A마다 호출하고 나서 B를 제출하면 B의 제출 자체가 9ms로 늦어져 앞의 18ms 순차 모양이 될 수 있습니다. 전체 완료 확인과 중간마다 세우는 대기는 위치를 구별해서 봅니다.",
    lanes: [
      { name: "A", segs: A },
      { name: "B", segs: [{ from: 9, to: 11, label: "H", tone: "send" }, { from: 11, to: 16, label: "B 계산", tone: "run" }, { from: 16, to: 18, label: "D", tone: "fetch" }] },
      { name: "host", segs: [{ from: 0, to: 9, label: "A 대기", tone: "wait" }, { from: 9, to: 18, label: "B 대기", tone: "wait" }] },
    ],
    ticks: [0, 9, 18],
  },
];

export default function DeviceSyncPlacementViz() {
  return (
    <SceneShell
      eyebrow="대기의 위치"
      title="같은 호출을 어디에 두느냐로 14ms가 18ms가 될 수 있습니다"
      description="두 장면 모두 0–18ms 축이고 2·5·2ms는 글의 모형입니다. H는 H2D, D는 D2H입니다."
      ariaLabel="cudaDeviceSynchronize를 끝에 한 번 둘 때와 작업마다 둘 때의 시간표 비교"
      scenes={SCENES}
      render={(index) => <TimeLanes lanes={SCENES[index].lanes} max={18} ticks={SCENES[index].ticks} unit="ms" />}
    />
  );
}
