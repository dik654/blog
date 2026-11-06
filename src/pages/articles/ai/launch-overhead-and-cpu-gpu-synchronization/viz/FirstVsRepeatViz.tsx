import SceneShell from "./SceneShell";
import TimeLanes from "./TimeLanes";
import { GOOD, SEND } from "./laneColors";

/**
 * 본문 대응: #finite-and-steady ProgressiveDetail — 미리 제출: eager 3.005·5.505·8.005, graph 3.06·5.06·7.06.
 * 매회 대기: eager 3.005씩, graph 3.06씩 누적 → 3.005·6.01·9.015 / 3.06·6.12·9.18.
 */
const SCENES: readonly { label: string; summary: string; eager: readonly number[]; graph: readonly number[]; gaps: readonly string[]; note: string }[] = [
  { label: "미리 제출할 때", summary: "간격 2.5 ms ↔ 2 ms", eager: [3.005, 5.505, 8.005], graph: [3.06, 5.06, 7.06], gaps: ["+0.055", "−0.445", "−0.945"], note: "첫 결과는 graph가 0.055 ms 늦지만 간격이 더 짧아 둘째부터 앞섭니다." },
  { label: "매회 완료를 기다릴 때", summary: "회당 3.005 ms ↔ 3.06 ms", eager: [3.005, 6.01, 9.015], graph: [3.06, 6.12, 9.18], gaps: ["+0.055", "+0.11", "+0.165"], note: "미리 제출하는 겹침이 없으면 각 회가 첫 완료와 같은 시간을 다시 씁니다. 이 조건에서는 graph가 회마다 0.055 ms씩 더 느립니다." },
];

const marks = (times: readonly number[], color: string) => times.map((t) => ({ from: t - 0.08, to: t + 0.08, color }));

export default function FirstVsRepeatViz() {
  return (
    <SceneShell
      eyebrow="300개 kernel 사례 · 가정"
      title="첫 결과가 늦어도 뒤에서 앞설 수 있습니다"
      description="(가정) S=1, L=0.005, E=2/300, G=0.06 ms, N=300입니다. 눈금 하나가 한 회의 완료입니다. 0.055 ms 차이는 이 축에서 거의 보이지 않으므로 표의 차이(graph − eager)를 함께 읽습니다."
      ariaLabel="eager와 graph의 세 회 완료 시각 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <TimeLanes
              max={10}
              ticks={[0, 2, 4, 6, 8, 10]}
              unit="ms"
              lanes={[
                { label: "eager", spans: marks(scene.eager, SEND) },
                { label: "graph", spans: marks(scene.graph, GOOD) },
              ]}
            />
            <div className="mt-3 grid grid-cols-[3.2rem_repeat(3,minmax(0,1fr))] gap-x-2 gap-y-1 font-mono text-xs">
              <span className="text-muted-foreground" />
              {["1회", "2회", "3회"].map((name) => (
                <span key={name} className="font-bold">{name}</span>
              ))}
              <span className="font-bold">eager</span>
              {scene.eager.map((t) => <span key={t}>{t}</span>)}
              <span className="font-bold">graph</span>
              {scene.graph.map((t) => <span key={t}>{t}</span>)}
              <span className="font-bold">차이</span>
              {scene.gaps.map((gap) => <span key={gap} className="font-bold text-[#b45309]">{gap}</span>)}
            </div>
          </div>
        );
      }}
    />
  );
}
