import CircuitDiagram from "./CircuitDiagram";
import type { CircuitHighlight, CircuitLabels, CircuitMerge } from "./CircuitDiagram";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #two-paths — 바꾼 회로를 줄였다가 다시 펼친다.
 * 2∥1 = 2×1/(2+1) = 2/3 kΩ → 1 + 2/3 = 5/3 kΩ → 12 V ÷ 5/3 kΩ = 7.2 mA
 * → 첫 1 kΩ 낙차 7.2 V → 갈림길 12 − 7.2 = 4.8 V → 4.8/2 = 2.4 mA, 4.8/1 = 4.8 mA (합 7.2 mA).
 */
const BASE: CircuitLabels = { r1: "첫 1 kΩ", r2: "왼쪽 2 kΩ", r3: "오른쪽 1 kΩ" };

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  highlight: CircuitHighlight;
  merge: CircuitMerge;
  labels: CircuitLabels;
}[] = [
  {
    label: "1. 두 갈래를 하나로",
    summary: "2×1 ÷ (2+1) = 2/3 kΩ",
    highlight: "branches",
    merge: "branches",
    labels: { ...BASE, merged: "두 갈래 → 2/3 kΩ" },
    note: "두 갈래는 같은 전압을 받고 전류가 더해지므로, 입구에서 보면 2/3 kΩ 하나와 같습니다.",
  },
  {
    label: "2. 첫 1 kΩ을 더하기",
    summary: "1 + 2/3 = 5/3 kΩ → 7.2 mA",
    highlight: "common",
    merge: "all",
    labels: { ...BASE, merged: "전체 → 5/3 kΩ", i1: "7.2 mA" },
    note: "첫 1 kΩ과 두 갈래 묶음은 차례로 놓였으므로 더해 5/3 kΩ입니다. 전원에서는 12 V ÷ 5/3 kΩ = 7.2 mA가 흐릅니다.",
  },
  {
    label: "3. 첫 부품의 낙차를 빼기",
    summary: "12 − 7.2 = 4.8 V",
    highlight: "common",
    merge: "none",
    labels: { ...BASE, i1: "7.2 mA · 7.2 V", node: "갈림길 4.8 V" },
    note: "7.2 mA가 첫 1 kΩ을 지나며 7.2 V를 씁니다. 남은 4.8 V가 갈림길 위쪽 점의 전압입니다. 원래 회로에서는 6 V였습니다.",
  },
  {
    label: "4. 두 갈래로 다시 펼치기",
    summary: "2.4 + 4.8 = 7.2 mA",
    highlight: "branches",
    merge: "none",
    labels: { ...BASE, i1: "7.2 mA", node: "갈림길 4.8 V", i2: "4.8÷2 = 2.4 mA", i3: "4.8÷1 = 4.8 mA" },
    note: "두 갈래는 같은 4.8 V를 받으므로 왼쪽 2.4 mA, 오른쪽 4.8 mA입니다. 합은 첫 길의 7.2 mA와 같습니다. 왼쪽은 원래 3 mA에서 줄었습니다.",
  },
];

export default function CircuitReduceViz() {
  return (
    <SceneShell
      eyebrow="줄였다가 다시 펼치기"
      title="7.2·2.4·4.8 mA가 나오는 네 걸음"
      description="오른쪽만 1 kΩ으로 바꾼 가정 회로입니다. 초록 점선은 입구에서 하나로 본 범위입니다."
      ariaLabel="두 갈래 합성, 첫 저항 더하기, 낙차 빼기, 다시 펼치기의 네 단계"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return <CircuitDiagram highlight={scene.highlight} merge={scene.merge} labels={scene.labels} />;
      }}
    />
  );
}
