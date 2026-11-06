import SceneShell from "./SceneShell";
import TimeLanes, { type LaneRow } from "./TimeLanes";

/**
 * 본문 대응: #peer-copy — GPU 하나 20ms, 둘로 나눠 계산 10ms + 차례로 통신 12ms = 22ms(가정).
 * 겹치는 장면의 통신 위치는 본문에 숫자가 없어 합계를 적지 않았습니다.
 */
const ONE: LaneRow = { name: "GPU 1개", segs: [{ from: 0, to: 20, label: "전체 일 20", tone: "send" }] };

const SCENES: readonly { label: string; summary: string; note: string; lanes: readonly LaneRow[]; ticks: readonly number[] }[] = [
  { label: "GPU 하나", summary: "20ms", note: "같은 전체 일을 GPU 하나로 20ms에 끝내던 경우를 놓습니다(가정).", lanes: [ONE, { name: "GPU 2개", segs: [] }], ticks: [0, 20] },
  { label: "2배라고 상상하면", summary: "20 ÷ 2 = 10ms?", note: "계산을 둘로 나누면 계산 시간은 10ms가 됩니다. 이것만 보면 2배 빠른 것 같지만, 나눈 조각 사이의 통신이 아직 없습니다.", lanes: [ONE, { name: "GPU 2개", segs: [{ from: 0, to: 10, label: "계산 10", tone: "run" }] }], ticks: [0, 10, 20] },
  { label: "통신을 차례로", summary: "10 + 12 = 22ms > 20ms", note: "계산 뒤 통신 12ms를 반드시 차례로 수행한다면 전체는 22ms로 GPU 하나보다 느립니다. 2배 속도라는 결론은 장치 개수만으로 나오지 않습니다.", lanes: [ONE, { name: "GPU 2개", segs: [{ from: 0, to: 10, label: "계산 10", tone: "run" }, { from: 10, to: 22, label: "통신 12", tone: "fetch" }] }], ticks: [0, 10, 22] },
  { label: "겹칠 수 있다면", summary: "시간표가 바뀜", note: "계산과 통신을 겹칠 수 있으면 시간표가 바뀌지만, 어떤 결과가 다음 통신에 필요한지 먼저 따져야 합니다. 겹치는 양은 정해지지 않았으므로 합계를 적지 않습니다.", lanes: [ONE, { name: "계산", segs: [{ from: 0, to: 10, label: "계산 10", tone: "run" }] }, { name: "통신", segs: [{ from: 4, to: 16, label: "통신 12 · 위치 미정", tone: "wait" }] }], ticks: [0, 20] },
];

export default function ScaleOutViz() {
  return (
    <SceneShell
      eyebrow="GPU를 둘로"
      title="GPU를 둘로 나눴는데 왜 더 느려질 수 있을까요"
      description="모든 장면이 같은 0–22ms 축입니다. 20ms·10ms·12ms는 설명을 위한 가정이며 측정값이 아닙니다."
      ariaLabel="GPU 하나의 20밀리초와 둘로 나눈 계산 10밀리초에 통신 12밀리초를 더한 22밀리초 비교"
      scenes={SCENES}
      render={(index) => <TimeLanes lanes={SCENES[index].lanes} max={22} ticks={SCENES[index].ticks} unit="ms" />}
    />
  );
}
