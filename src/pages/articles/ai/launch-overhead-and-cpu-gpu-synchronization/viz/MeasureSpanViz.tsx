import SceneShell from "./SceneShell";
import TimeLanes, { LaneLegend, type LaneMark, type LaneSpan } from "./TimeLanes";
import { PREP, SEND, WAIT, WORK } from "./laneColors";

/**
 * 본문 대응: #measurement — 기본 eager 세 회: 호출 반환까지 24, 완료까지 26, GPU kernel 합 12.
 * 12/26=6/13≈46.15%. 반복 구간 회마다 4/8=50%. 별도 모형 L=5, E=4의 장기 비율 4/5=80%.
 */
const prep = (from: number, to: number): LaneSpan => ({ from, to, color: PREP });
const send = (from: number, to: number): LaneSpan => ({ from, to, color: SEND });
const work = (from: number, to: number): LaneSpan => ({ from, to, color: WORK });

const CPU: readonly LaneSpan[] = [prep(0, 2), send(2, 5), send(5, 8), prep(8, 10), send(10, 13), send(13, 16), prep(16, 18), send(18, 21), send(21, 24)];
const GPU: readonly LaneSpan[] = [work(5, 7), work(8, 10), work(13, 15), work(16, 18), work(21, 23), work(24, 26)];
const ALT_CPU: readonly LaneSpan[] = [send(0, 5), send(5, 10), send(10, 15), send(15, 20), send(20, 25)];
const ALT_GPU: readonly LaneSpan[] = [work(5, 9), work(10, 14), work(15, 19), work(20, 24)];
const range = (from: number, to: number, text: string): LaneSpan => ({ from, to, color: WAIT, dashed: true, text });

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  cpu: readonly LaneSpan[];
  gpu: readonly LaneSpan[];
  measured: readonly LaneSpan[];
  marks: readonly LaneMark[];
}[] = [
  { label: "동기화 없는 CPU 타이머", summary: "24 μs", cpu: CPU, gpu: GPU, measured: [range(0, 24, "24 μs")], marks: [{ at: 24, color: WAIT }], note: "제출 직전부터 마지막 호출 반환까지입니다. 마지막 계산은 24–26 μs에 실행되므로 이 값에는 그 구간이 들어가지 않습니다." },
  { label: "마지막 완료까지", summary: "26 μs", cpu: CPU, gpu: GPU, measured: [range(0, 26, "26 μs")], marks: [{ at: 26, color: WAIT }], note: "마지막 결과 완료까지 기다려 재면 26 μs입니다. 같은 실행인데 끝 지점만 옮겼으므로, 24가 더 작다고 더 빨리 마친 것은 아닙니다." },
  { label: "GPU kernel 시간의 합", summary: "2 × 6 = 12 μs", cpu: CPU, gpu: GPU, measured: GPU.map((s) => range(s.from, s.to, "")), marks: [], note: "파란 칸 여섯 개만 더한 값입니다. 칸 사이의 구간이 빠지므로 12를 마지막 완료 시각으로 읽을 수 없습니다." },
  { label: "전체 범위의 계산 비율", summary: "12/26 ≈ 46.15%", cpu: CPU, gpu: GPU, measured: [range(0, 26, "분모 26")], marks: [], note: "0–26 μs 전체를 분모로 삼으면 GPU가 계산한 비율은 12/26=6/13입니다. 첫 준비의 앞부분까지 분모에 들어갑니다." },
  { label: "반복 구간의 계산 비율", summary: "4/8 = 50%", cpu: CPU, gpu: GPU, measured: [range(10, 18, "8 μs")], marks: [{ at: 10, color: WAIT }, { at: 18, color: WAIT }], note: "첫 준비의 영향을 빼고 완료와 완료 사이 한 회만 보면 계산 4 μs에 간격 8 μs입니다. 앞의 46.15%와 구간이 다릅니다." },
  { label: "별도 모형의 장기 비율", summary: "4/5 = 80%", cpu: ALT_CPU, gpu: ALT_GPU, measured: [range(10, 15, "5 μs")], marks: [{ at: 10, color: WAIT }, { at: 15, color: WAIT }], note: "다른 조건입니다. (가정) 준비 없이 제출 5 μs, 실행 4 μs만 반복하면 5 μs마다 4 μs를 계산합니다. 이 비율을 앞의 두 값과 섞지 않습니다." },
];

export default function MeasureSpanViz() {
  return (
    <SceneShell
      eyebrow="측정 범위"
      title="24·26·12는 같은 실행의 다른 구간입니다"
      description="모두 설명용 시간표이며 실측이 아닙니다(가정). 점선 줄이 각 숫자가 세는 구간입니다."
      ariaLabel="같은 시간표에서 측정 범위에 따라 달라지는 값"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <TimeLanes
              max={26}
              ticks={[0, 5, 10, 15, 20, 26]}
              marks={scene.marks}
              lanes={[
                { label: "CPU", spans: scene.cpu },
                { label: "GPU", spans: scene.gpu },
                { label: "세는 구간", spans: scene.measured },
              ]}
            />
            <LaneLegend items={[{ color: PREP, label: "준비" }, { color: SEND, label: "제출" }, { color: WORK, label: "kernel 실행" }, { color: WAIT, label: "세는 구간", dashed: true }]} />
          </div>
        );
      }}
    />
  );
}
