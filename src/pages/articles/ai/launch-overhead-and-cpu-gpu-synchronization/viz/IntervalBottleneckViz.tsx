import SceneShell from "./SceneShell";
import TimeLanes from "./TimeLanes";
import { GOOD, SEND, WORK } from "./laneColors";

/**
 * 본문 대응: #finite-and-steady — eager: S+NL=2+2×3=8, NE=2×2=4 → 간격 8, 첫 완료 10 → 10·18·26.
 * graph: S+G=2+1=3, NE=4 → 간격 4, 첫 완료 S+G+NE=7 → 7·11·15.
 */
const SCENES: readonly { label: string; summary: string; cpu: number; cpuText: string; gpu: number; done: readonly number[]; limit: string; note: string }[] = [
  { label: "하나씩 제출 (eager)", summary: "max(8, 4) = 8 μs", cpu: 8, cpuText: "S+NL = 2+2×3", gpu: 4, done: [10, 18, 26], limit: "CPU", note: "CPU 한 회 제출이 8 μs로 더 길어 완료 간격도 8 μs입니다. GPU는 한 회를 4 μs면 끝내고 다음 지시를 기다립니다. 첫 완료 10은 이 간격과 별개의 값입니다." },
  { label: "묶어서 제출 (graph)", summary: "max(3, 4) = 4 μs", cpu: 3, cpuText: "S+G = 2+1", gpu: 4, done: [7, 11, 15], limit: "GPU", note: "제출이 3 μs로 줄면 이번에는 GPU 실행 4 μs가 더 깁니다. 간격은 4 μs이고 첫 완료는 S+G+NE = 7 μs입니다." },
];

function Bar({ label, text, value, color, limit }: { label: string; text: string; value: number; color: string; limit: boolean }) {
  return (
    <div className="grid grid-cols-[5.25rem_minmax(0,1fr)_2.75rem] items-center gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)_3rem]">
      <span className="text-xs font-bold leading-4">
        {label}
        <span className="block font-mono text-[10px] font-normal text-muted-foreground sm:text-[11px]">{text}</span>
      </span>
      <div className="h-7 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${(value / 8) * 100}%`, backgroundColor: color }} />
      </div>
      <span className={`text-right font-mono text-sm ${limit ? "font-bold" : "text-muted-foreground"}`}>{value} μs</span>
    </div>
  );
}

export default function IntervalBottleneckViz() {
  return (
    <SceneShell
      eyebrow="한 회의 두 양"
      title="완료 간격은 CPU 한 회 제출과 GPU 한 회 실행 중 긴 쪽입니다"
      description="(가정) S=2, L=3, E=2 μs, N=2이고 두 kernel을 graph로 묶어 제출하는 시간 G=1 μs입니다. 위 막대가 한 회의 두 양이고, 아래 줄의 눈금이 세 회의 완료 시각입니다."
      note="미리 정해진 일을 무한히 앞서 제출할 수 있는 이상 모형입니다. 시간의 변동, 다음 답을 보고 고르는 분기, 유한한 미완료 작업 한도가 생기면 그대로 적용하지 않습니다."
      ariaLabel="CPU 한 회 제출량과 GPU 한 회 실행량 비교와 완료 시각"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-3">
            <div className="space-y-2">
              <Bar label="CPU 제출" text={scene.cpuText} value={scene.cpu} color={SEND} limit={scene.limit === "CPU"} />
              <Bar label="GPU 실행" text="NE = 2×2" value={scene.gpu} color={WORK} limit={scene.limit === "GPU"} />
            </div>
            <TimeLanes
              max={28}
              ticks={[0, ...scene.done]}
              lanes={[{ label: "완료", spans: scene.done.map((t) => ({ from: t - 0.3, to: t + 0.3, color: GOOD })) }]}
            />
          </div>
        );
      }}
    />
  );
}
