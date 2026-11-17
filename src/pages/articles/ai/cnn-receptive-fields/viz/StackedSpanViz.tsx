import ReceptiveRows from "./ReceptiveRows";
import SceneShell from "./ReceptiveSceneShell";

/**
 * 본문 대응: #theoretical — stride 1, dilation 1인 k=3 layer를 쌓으면 한 축 범위가 3→5→7.
 * r_l = r_{l-1} + (k−1)·d·j_{l-1}, j는 stride 1이라 계속 1 → 층마다 (3−1)×1×1 = 2칸 추가.
 * 맨 위 unit 좌표 4에서 거꾸로 내려가면 원본 3~5, 2~6, 1~7.
 */
const ROWS = [
  { label: "입력", d: 1 },
  { label: "층 1", d: 1 },
  { label: "층 2", d: 1 },
  { label: "층 3", d: 1 },
] as const;

const SCENES = [
  {
    label: "층 1개",
    summary: "r₁ = 1 + (3−1)×1 = 3",
    top: 1,
    note: "층 1의 unit 하나는 원본 입력 3·4·5, 세 칸과 연결됩니다. 시작값 r₀=1은 입력 한 칸 자신입니다. Jump j는 이웃 unit 사이의 원 input 간격이며, stride가 1이라 층을 지나도 1로 남습니다.",
  },
  {
    label: "층 2개",
    summary: "r₂ = 3 + (3−1)×1 = 5",
    top: 2,
    note: "층 2의 unit은 층 1의 세 칸을 읽고, 그 세 칸이 각각 원본 세 칸을 읽습니다. 겹치는 칸을 한 번씩만 세면 2~6의 다섯 칸입니다. 층 하나가 양 끝에 한 칸씩, 곧 (k−1)×j = 2칸을 더합니다.",
  },
  {
    label: "층 3개",
    summary: "r₃ = 5 + (3−1)×1 = 7",
    top: 3,
    note: "같은 규칙으로 1~7의 일곱 칸이 됩니다. 이것은 계산 graph에서 연결된 이론상 범위입니다. 일곱 칸이 output에 실제로 얼마나 기여하는지는 다음 절처럼 gradient나 perturbation으로 따로 측정합니다.",
  },
] as const;

export default function StackedSpanViz() {
  return (
    <SceneShell
      eyebrow="층마다 누적"
      title="위 unit 하나에서 원본 칸까지 연결선을 거꾸로 따라갑니다"
      description="칸 하나가 한 축의 좌표 하나이고, 모든 층은 k=3·stride 1·dilation 1입니다. 좌표 0~8의 아홉 칸은 그림 폭을 위한 선택입니다(가정)."
      ariaLabel="3×3 layer를 한 개, 두 개, 세 개 쌓았을 때 한 축의 연결 범위가 3, 5, 7칸으로 넓어지는 과정"
      scenes={SCENES}
      render={(active) => (
        <ReceptiveRows
          rows={ROWS}
          topLayer={SCENES[active].top}
          topPos={4}
          ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`}
        />
      )}
    />
  );
}
