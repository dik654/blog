import EdgeTrace from "./EdgeTrace";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 비트가 1인 동안 들어온 에지는 합쳐져 ISR이 한 번만 센다.
 * 에지 세 번은 설명용 가정이다.
 */
const E1 = { x: 110, color: "#2563eb" };
const E2 = { x: 170, color: "#d97706" };
const E3 = { x: 230, color: "#d97706" };
const CLEAR = { x: 290, label: "ISR 소거", color: "#16a34a" };

const SCENES = [
  { label: "첫 에지", summary: "비트 1", edges: [E1], bit: [110], end: 150, marks: [], real: 1, counted: 0, fix: false, note: "첫 상승 에지가 비트를 1로 만듭니다. ISR은 아직 돌지 않았습니다." },
  { label: "같은 에지가 더 들어옴", summary: "에지 3번 · 비트는 그대로 1", edges: [E1, E2, E3], bit: [110], end: 262, marks: [], real: 3, counted: 0, fix: false, note: "비트가 1인 동안 같은 에지가 더 들어와도 상태는 여전히 1일 수 있습니다. 비트에는 횟수를 담을 자리가 없습니다." },
  { label: "ISR이 한 번 셉니다", summary: "실제 3번 · 센 횟수 1", edges: [E1, E2, E3], bit: [110, 290], end: 350, marks: [CLEAR], real: 3, counted: 1, fix: false, note: "ISR에서 횟수를 하나 올려도 그 전에 합쳐진 사건까지 복원하지는 못합니다." },
  { label: "모두 세야 한다면", summary: "다른 기록 경로 고려", edges: [E1, E2, E3], bit: [110, 290], end: 350, marks: [CLEAR], real: 3, counted: 1, fix: true, note: "모든 사건이 중요하다면 센서가 보관하는 순번·FIFO나 별도 하드웨어 계수·캡처를 고려해야 합니다. 새 값 하나가 필요하다는 뜻으로만 쓰는 경우도 있습니다." },
] as const;

export default function MergedEdgesViz() {
  return (
    <SceneShell
      eyebrow="에지 비트와 사건 횟수"
      title="에지가 세 번 와도 비트는 1 하나로 남을 수 있습니다"
      description="에지 세 번은 설명용 가정입니다. 가로 위치는 순서만 나타냅니다."
      ariaLabel="에지 세 번이 비트 하나로 합쳐져 ISR이 한 번만 세는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <EdgeTrace edges={scene.edges} bit={scene.bit} end={scene.end} marks={scene.marks} ariaLabel={`${scene.label}: ${scene.summary}`} />
            <div className="mx-auto mt-3 grid max-w-[560px] grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg border border-border px-2 py-2">
                <span className="block text-muted-foreground">실제 에지 (가정)</span>
                <span className="font-mono text-base font-bold">{scene.real}</span>
              </div>
              <div className="rounded-lg border border-border px-2 py-2">
                <span className="block text-muted-foreground">ISR이 센 횟수</span>
                <span className="font-mono text-base font-bold" style={{ color: scene.counted > 0 ? "#dc2626" : undefined }}>{scene.counted}</span>
              </div>
              <div className={`col-span-2 rounded-lg border px-2 py-2 ${scene.fix ? "border-primary/60" : "border-dashed border-border/50"}`}>
                <span className={scene.fix ? "font-semibold" : "text-muted-foreground/50"}>{scene.fix ? "순번·FIFO · 하드웨어 계수·캡처" : "횟수를 따로 남기는 경로 없음"}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
