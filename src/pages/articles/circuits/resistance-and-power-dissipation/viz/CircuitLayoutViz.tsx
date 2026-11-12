import CircuitDiagram from "./CircuitDiagram";
import type { CircuitHighlight } from "./CircuitDiagram";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 바꾼 회로에서 모두 지나는 첫 길과, 같은 두 점을 공유하는 두 갈래를 구분한다.
 * 숫자는 3절의 가정(12 V, 1 kΩ, 2 kΩ, 바꾼 1 kΩ)만 쓴다. 전류값은 7절에서 계산하므로 여기서는 적지 않는다.
 */
const SCENES: readonly { label: string; summary: string; note: string; highlight: CircuitHighlight }[] = [
  {
    label: "바꾼 회로의 모양",
    summary: "12 V → 첫 1 kΩ → 두 갈래 → 0 V",
    highlight: "none",
    note: "전원의 + 쪽에서 나온 흐름은 첫 1 kΩ을 지나 갈림길 위쪽 점에 닿고, 왼쪽 2 kΩ과 오른쪽 1 kΩ으로 나뉜 뒤 아래쪽 점에서 다시 합쳐 기준 0 V로 돌아옵니다(값은 모두 가정).",
  },
  {
    label: "함께 지나는 길",
    summary: "같은 총량이 차례로 통과",
    highlight: "common",
    note: "갈림길 이전의 첫 1 kΩ은 모든 흐름이 지납니다. 첫 부품과 갈림길 전체는 차례로 놓여 같은 총량이 통과하고, 두 구간의 양끝 차이를 더하면 전원의 12 V가 됩니다.",
  },
  {
    label: "나눠 지나는 길",
    summary: "같은 두 점 · 흐름은 합침",
    highlight: "branches",
    note: "두 갈래는 위쪽 점과 아래쪽 점을 함께 씁니다. 그래서 두 갈래가 받는 차이는 같고, 두 갈래로 지나가는 양을 합치면 첫 길을 지난 총량이 됩니다.",
  },
];

export default function CircuitLayoutViz() {
  return (
    <SceneShell
      eyebrow="회로의 연결"
      title="모두 지나는 길과 나뉘어 지나는 길"
      description="오른쪽만 1 kΩ으로 바꾼 3절의 회로를 그렸습니다. 네모 하나가 저항 하나, 선은 도선입니다(값은 가정)."
      ariaLabel="첫 저항을 모두 지나고 두 갈래가 같은 두 점을 공유하는 회로 구조"
      scenes={SCENES}
      render={(active) => (
        <CircuitDiagram
          highlight={SCENES[active].highlight}
          merge="none"
          labels={{ r1: "첫 1 kΩ", r2: "왼쪽 2 kΩ", r3: "오른쪽 1 kΩ" }}
        />
      )}
    />
  );
}
