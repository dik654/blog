import VizFrame from "@/components/viz/VizFrame";
import TimeLanes, { LaneLegend, type LaneSpan } from "./TimeLanes";
import { PREP, SEND, WORK } from "./laneColors";

/**
 * 본문 대응: #replay-diagnosis — S=2, L=1, E=3, 두 kernel, G=1 (가정).
 * eager CPU: 준비 0–2, 제출 2–3, 3–4 … 제출 종료 12. GPU: 3–6, 6–9, 9–12, 12–15, 15–18, 18–21.
 * graph CPU: 준비 0–2, 제출 2–3, 준비 3–5, 제출 5–6, 준비 6–8, 제출 8–9. GPU는 같음.
 */
const prep = (from: number, to: number): LaneSpan => ({ from, to, color: PREP });
const send = (from: number, to: number): LaneSpan => ({ from, to, color: SEND });
const work = (from: number): LaneSpan => ({ from, to: from + 3, color: WORK, dark: true, text: "3" });

const EAGER_CPU = [prep(0, 2), send(2, 3), send(3, 4), prep(4, 6), send(6, 7), send(7, 8), prep(8, 10), send(10, 11), send(11, 12)];
const GRAPH_CPU = [prep(0, 2), send(2, 3), prep(3, 5), send(5, 6), prep(6, 8), send(8, 9)];
const GPU = [3, 6, 9, 12, 15, 18].map(work);

export default function ReplaySameEndViz() {
  return (
    <VizFrame
      eyebrow="다른 가정의 반례"
      title="CPU 제출이 줄어도 GPU 계산이 속도를 제한하면 완료는 같습니다"
      description="(가정) 준비 2, kernel당 제출 1, kernel당 계산 3, graph 제출 1 μs인 세 회입니다. 네 줄이 같은 시간축을 씁니다."
      note="두 GPU 줄의 칸이 같습니다. 이 그림만으로는 graph 경로가 선택됐는지 판별할 수 없습니다. 실제 경로는 호출과 실행 작업을 따로 확인합니다."
      documentFlow
    >
      <TimeLanes
        max={22}
        ticks={[0, 3, 9, 12, 15, 21]}
        lanes={[
          { label: "eager CPU", spans: EAGER_CPU },
          { label: "eager GPU", spans: GPU },
          { label: "graph CPU", spans: GRAPH_CPU },
          { label: "graph GPU", spans: GPU },
        ]}
      />
      <LaneLegend items={[{ color: PREP, label: "준비" }, { color: SEND, label: "제출" }, { color: WORK, label: "kernel 계산" }]} />
      <dl className="mt-4 grid grid-cols-2 gap-2 font-mono text-xs">
        <div>
          <dt className="text-muted-foreground">CPU 제출 종료</dt>
          <dd className="font-bold">12 → 9 μs</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">회별 완료 (두 경우 같음)</dt>
          <dd className="font-bold">9 · 15 · 21 μs</dd>
        </div>
      </dl>
    </VizFrame>
  );
}
