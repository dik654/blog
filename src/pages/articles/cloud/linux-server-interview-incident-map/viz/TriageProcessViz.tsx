import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 첫 60초 점검 의사코드를 한 줄씩 실행한다. 왼쪽에는 의사코드 전체가 늘 보이고,
 * 오른쪽에는 그 줄이 Gregg 글의 실제 출력에서 읽은 값과 다섯 자원의 판정 상태가 바뀐다.
 * 한 mechanism: 오류 → 포화 → 사용률 순서로 자원을 하나씩 의심하거나 풀어 준다.
 */
const LINES = [
  "uptime              # 수요가 오르는 중인가",
  "dmesg | tail        # 커널이 남긴 오류",
  "vmstat 1            # r·b·si·so·wa",
  "mpstat -P ALL 1     # CPU 하나만 뜨거운가",
  "pidstat 1           # 누가 CPU를 쓰는가",
  "iostat -xz 1        # 디스크 대기·포화",
  "free -m             # cache가 0에 가까운가",
  "sar -n DEV 1        # NIC 처리량 한도",
  "sar -n TCP,ETCP 1   # 재전송",
  "top                 # 앞의 값과 같은가",
] as const;

const RESOURCES = ["CPU", "메모리", "디스크", "네트워크", "오류"] as const;
type Mark = "?" | "의심" | "정상" | "원인";

interface Scene {
  line: number;
  output: string;
  reading: string;
  marks: readonly Mark[];
}

const STATES: readonly Scene[] = [
  { line: 0, output: "load average: 30.02, 26.43, 19.02", reading: "1분 값이 15분 값보다 큽니다. 수요가 최근에 올랐고 아직 진행 중입니다. 무엇의 수요인지는 아직 모릅니다.", marks: ["?", "?", "?", "?", "?"] },
  { line: 1, output: "perl invoked oom-killer … TCP: Possible SYN flooding on port 7001", reading: "과거에 OOM kill과 SYN 대기열 넘침이 있었습니다. 지금 원인인지 따로 확인해야 하므로 메모리와 네트워크에 표시를 남깁니다.", marks: ["?", "의심", "?", "의심", "의심"] },
  { line: 2, output: "r 32~34 · b 0 · si/so 0 · us 96~99 · wa 0", reading: "CPU 32개에 r이 32~34라 CPU가 막 포화되는 경계입니다. b와 wa가 0이라 디스크 대기는 아니고, swap 출입이 없어 메모리 압박도 지금은 없습니다.", marks: ["의심", "정상", "정상", "의심", "의심"] },
  { line: 3, output: "all %usr 98.47 · CPU 0~3 96~98%", reading: "모든 CPU가 고르게 바쁩니다. CPU 하나만 뜨거운 단일 스레드 병목은 아닙니다.", marks: ["의심", "정상", "정상", "의심", "의심"] },
  { line: 4, output: "java 6521 %CPU 1591 · java 6564 %CPU 1583", reading: "java 두 개가 각각 CPU 약 16개 몫을 씁니다. CPU 수요의 주인이 나왔습니다.", marks: ["원인", "정상", "정상", "의심", "의심"] },
  { line: 5, output: "xvdb await 0.43 ms · w/s 8.94", reading: "주요 디스크의 대기 시간이 1 ms 아래이고 요청도 적습니다. 디스크를 용의선에서 뺍니다.", marks: ["원인", "정상", "정상", "의심", "의심"] },
  { line: 6, output: "buffers 59 MB · cached 541 MB · free 221,453 MB", reading: "cache가 0에 가깝지 않고 남은 메모리도 넉넉합니다. dmesg의 OOM은 과거 일로 둡니다.", marks: ["원인", "정상", "정상", "의심", "의심"] },
  { line: 7, output: "eth0 rxkB/s 21,999 ≈ 176 Mbit/s", reading: "1 Gbit/s 한도에 한참 못 미칩니다. NIC 처리량은 원인이 아닙니다.", marks: ["원인", "정상", "정상", "의심", "의심"] },
  { line: 8, output: "retrans/s 0.00 · active/s 1.00", reading: "재전송이 없습니다. SYN flooding 기록은 과거 일이고 지금 연결은 초당 하나입니다.", marks: ["원인", "정상", "정상", "정상", "정상"] },
  { line: 9, output: "%Cpu 96.8 us · java 3090% · 2 zombie", reading: "앞의 값과 같습니다. 원인은 사용자 코드의 CPU 사용이고, 다음 단계는 java의 profile입니다.", marks: ["원인", "정상", "정상", "정상", "정상"] },
];

const MARK_TONE: Record<Mark, string> = {
  "?": "border-border text-muted-foreground",
  의심: "border-amber-500 text-amber-700 dark:text-amber-400",
  정상: "border-emerald-600 text-emerald-700 dark:text-emerald-400",
  원인: "border-primary bg-primary/10 text-foreground",
};

export default function TriageProcessViz() {
  const scenes = useAnimatedScenes(STATES.length, 4200);
  const scene = scenes.active;
  const state = STATES[scene];
  const labels = ["uptime", "dmesg", "vmstat", "mpstat", "pidstat", "iostat", "free", "sar DEV", "sar TCP", "top"];

  return (
    <VizFrame
      eyebrow="60-second triage"
      title="열 줄을 차례로 실행하며 다섯 자원을 하나씩 풀어 줍니다"
      description="왼쪽은 의사코드 전체입니다. 진한 줄이 지금 실행하는 줄이고 흐린 표시가 붙은 줄은 이미 실행했습니다. 오른쪽은 그 줄의 실제 출력과 자원별 판정입니다."
      note="출력은 Gregg의 Netflix 글(2015-11-30)에 실린 같은 서버의 예시입니다. 명령마다 찍은 시각이 조금씩 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="60초 점검 의사코드 실행"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="grid min-w-0 shrink-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ol className="min-w-0 overflow-x-auto rounded-md border border-border bg-muted/20 p-3 font-mono text-[11px] leading-6">
            {LINES.map((line, index) => (
              <li
                key={line}
                className={`whitespace-pre ${index === state.line ? "font-bold text-foreground" : index < state.line ? "text-muted-foreground" : "text-muted-foreground/60"}`}
              >
                <span className="mr-2 inline-block w-5 text-right">{index === state.line ? "▶" : index < state.line ? "✓" : String(index + 1)}</span>
                {line}
              </li>
            ))}
          </ol>

          <div className="min-w-0">
            <p className="text-[11px] font-black text-primary">출력</p>
            <p className="mt-1 min-h-[3rem] break-words font-mono text-xs leading-6 text-foreground">{state.output}</p>
            <p className="mt-3 min-h-[10.5rem] text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] lg:min-h-[8.5rem]">{state.reading}</p>
            <div className="mt-3 grid grid-cols-5 gap-1">
              {RESOURCES.map((resource, index) => (
                <div key={resource} className={`rounded-sm border px-1 py-1.5 text-center ${MARK_TONE[state.marks[index]]}`}>
                  <p className="text-[10px] leading-4">{resource}</p>
                  <p className="text-[11px] font-bold leading-4">{state.marks[index]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={labels} />
      </div>
    </VizFrame>
  );
}
