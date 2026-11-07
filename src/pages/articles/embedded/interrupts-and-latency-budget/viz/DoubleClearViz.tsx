import EdgeTrace from "./EdgeTrace";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-dispatch — 기본 처리기가 소거한 뒤 콜백을 부른다.
 * 콜백 실행 중 새 에지가 오면 두 번째 소거가 그 기록을 없앨 수 있다.
 */
const ACK = { x: 150, label: "SDK 소거", color: "#16a34a" };
const CALLBACK = { x: 212, label: "콜백", color: "#64748b" };
const FIRST = { x: 96, color: "#2563eb" };
const NEXT = { x: 256, color: "#2563eb" };

const SCENES = [
  { label: "첫 에지", summary: "비트 1", edges: [FIRST], bit: [96], end: 130, marks: [], note: "GPIO2의 상승 에지가 비트를 1로 만듭니다." },
  { label: "소거 후 콜백", summary: "acknowledge → callback", edges: [FIRST], bit: [96, 150], end: 228, marks: [ACK, CALLBACK], note: "기본 처리기는 gpio_acknowledge_irq(2,8)로 비트를 지운 다음 callback(2,8)을 부릅니다. 콜백은 이미 접수된 사건을 전달받습니다." },
  { label: "콜백 도중 새 에지", summary: "비트 다시 1", edges: [FIRST, NEXT], bit: [96, 150, 256], end: 290, marks: [ACK, CALLBACK], note: "첫 소거 이후 새 에지가 들어온 경우입니다. 비트가 다시 1이 되어 새 사건을 기록합니다." },
  { label: "갈래 A: 또 지움", summary: "새 기록이 사라질 수 있음", edges: [FIRST, { x: 256, color: "#dc2626" }], bit: [96, 150, 256, 310], end: 350, marks: [ACK, CALLBACK, { x: 310, label: "또 소거", color: "#dc2626" }], note: "콜백이 같은 비트를 무조건 다시 지우면 두 번째 소거가 새 기록을 없앨 수 있습니다." },
  { label: "갈래 B: 지우지 않음", summary: "새 기록이 남음", edges: [FIRST, NEXT], bit: [96, 150, 256], end: 350, marks: [ACK, CALLBACK], note: "기본 콜백 경로에서는 다시 지우지 않으므로 새 기록이 남습니다. 원시 처리기를 직접 등록한 경로는 자신이 원인 확인과 소거를 맡습니다." },
] as const;

export default function DoubleClearViz() {
  return (
    <SceneShell
      eyebrow="기본 콜백 경로 · 소거 순서"
      title="두 번째 소거가 새 에지 기록을 지우는 순간"
      description="위 줄은 들어온 상승 에지, 아래 선은 GPIO2의 에지 비트입니다. 가로 위치는 순서만 나타내며 간격은 시간 값이 아닙니다(가정)."
      ariaLabel="SDK 소거 뒤 콜백 도중 들어온 에지 기록이 두 번째 소거로 사라지는 경우와 남는 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <EdgeTrace
            edges={scene.edges}
            bit={scene.bit}
            end={scene.end}
            marks={scene.marks}
            bitColor={active === 3 ? "#dc2626" : "#2563eb"}
            ariaLabel={`${scene.label}: ${scene.summary}`}
          />
        );
      }}
    />
  );
}
