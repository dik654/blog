import SceneShell from "./SceneShell";
import TimeLanes, { LaneLegend, type Lane } from "./TimeLanes";
import { GOOD, SEND, WAIT, WORK } from "./laneColors";

/**
 * 본문 대응: #why — 둘째 계산 시작은 지시 도착과 앞 계산 완료 중 늦은 쪽.
 * 하나씩 전달: 앞 결과 7, 지시 8 → 8. 목록 전달: 지시 3, 앞 결과 5 → 5. 값 읽기: 시도 8, 완료 10 → 10.
 */
const SCENES: readonly { label: string; summary: string; note: string; lanes: readonly Lane[] }[] = [
  {
    label: "하나씩 전달할 때",
    summary: "7과 8 중 늦은 쪽 → 8 μs",
    note: "첫 회 둘째 계산입니다. 앞 결과는 7 μs에 준비되지만 지시가 8 μs에 도착합니다. 여기서는 지시 쪽이 늦어 시작 시각을 정합니다.",
    lanes: [
      { label: "앞 계산", spans: [{ from: 5, to: 7, color: WORK, dark: true, text: "+1" }] },
      { label: "둘째 지시", spans: [{ from: 5, to: 8, color: SEND, dark: true, text: "전달" }] },
      { label: "둘째 계산", spans: [{ from: 8, to: 10, color: GOOD, dark: true, text: "×2" }] },
    ],
  },
  {
    label: "목록으로 함께 전달할 때",
    summary: "5와 3 중 늦은 쪽 → 5 μs",
    note: "두 지시가 모두 3 μs에 도착해 있어도 둘째 계산은 첫 결과가 나오는 5 μs부터입니다. 빠른 전달이 앞뒤 순서를 없애지는 않으며, 전달이 충분히 빠르면 기다림의 원인이 계산 쪽으로 이동합니다.",
    lanes: [
      { label: "앞 계산", spans: [{ from: 3, to: 5, color: WORK, dark: true, text: "+1" }] },
      { label: "둘째 지시", spans: [{ from: 2, to: 3, color: SEND, dark: true, text: "" }] },
      { label: "둘째 계산", spans: [{ from: 5, to: 7, color: GOOD, dark: true, text: "×2" }] },
    ],
  },
  {
    label: "준비하는 쪽이 답을 읽을 때",
    summary: "8과 10 중 늦은 쪽 → 10 μs",
    note: "읽기에도 같은 규칙이 있습니다. 첫 회의 답 8을 8 μs에 읽으려 하면 계산이 아직 끝나지 않았으므로 10 μs까지 기다려야 올바른 값을 읽습니다.",
    lanes: [
      { label: "답 계산", spans: [{ from: 8, to: 10, color: WORK, dark: true, text: "×2" }] },
      { label: "CPU 읽기", spans: [{ from: 5, to: 8, color: SEND, dark: true, text: "전달" }, { from: 8, to: 10, color: WAIT, dashed: true, text: "대기" }] },
      { label: "읽은 값", spans: [{ from: 10, to: 11, color: GOOD, dark: true, text: "8" }] },
    ],
  },
];

export default function StartRuleViz() {
  return (
    <SceneShell
      eyebrow="두 시계를 맞추는 규칙"
      title="둘 다 준비되어야 하므로 늦은 쪽이 시각을 정합니다"
      description="(가정) 3·4절의 시간표와 목록 전달 1 μs를 그대로 씁니다. 위 두 줄에서 실선 칸이 끝나는 때가 각 조건이 갖춰지는 시각이고 맨 아래 줄이 그 결과입니다."
      ariaLabel="지시 도착과 앞 결과 준비 중 늦은 쪽이 시작 시각을 정하는 세 사례"
      scenes={SCENES}
      render={(index) => (
        <div className="min-w-0">
          <TimeLanes max={11} ticks={[0, 2, 3, 5, 7, 8, 10]} lanes={SCENES[index].lanes} />
          <LaneLegend items={[{ color: WORK, label: "앞 계산" }, { color: SEND, label: "지시 전달" }, { color: WAIT, label: "기다림", dashed: true }, { color: GOOD, label: "이어지는 일" }]} />
        </div>
      )}
    />
  );
}
