import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * USE 격자(자원 × 사용률·포화·오류)를 (가정) 4 vCPU 서버 한 대에 적용해 칸마다 명령과 /proc 파일을 짝짓는다.
 * 한 mechanism: 사용률(40%)이 낮아 보여도 포화(PSI cpu some 25%, r 12 > 4)가 높을 수 있으므로
 * 칸을 건너뛰지 않고 자원마다 U → S → E 순서로 읽는다.
 */
type Resource = "CPU" | "메모리" | "디스크" | "네트워크";
type Axis = "U" | "S" | "E";

interface Cell {
  cmd: string;
  proc: string;
  value: string;
}

const RESOURCES: readonly Resource[] = ["CPU", "메모리", "디스크", "네트워크"];
const AXES: readonly { key: Axis; label: string }[] = [
  { key: "U", label: "사용률" },
  { key: "S", label: "포화" },
  { key: "E", label: "오류" },
];

const GRID: Record<Resource, Record<Axis, Cell>> = {
  CPU: {
    U: { cmd: "mpstat -P ALL 1", proc: "/proc/stat cpu 줄", value: "40%" },
    S: { cmd: "cat /proc/pressure/cpu · vmstat 1 (r)", proc: "/proc/pressure/cpu · procs_running", value: "some 25% · r 12" },
    E: { cmd: "dmesg -T | grep -i mce", proc: "/sys/devices/system/machinecheck", value: "0" },
  },
  메모리: {
    U: { cmd: "free -m (available)", proc: "/proc/meminfo MemAvailable", value: "9.8 GiB 남음" },
    S: { cmd: "cat /proc/pressure/memory · vmstat 1 (si so)", proc: "/proc/pressure/memory · /proc/vmstat", value: "some 0.0% · si/so 0" },
    E: { cmd: "dmesg -T | grep -i 'out of memory'", proc: "memory.events oom_kill", value: "0" },
  },
  디스크: {
    U: { cmd: "iostat -xz 1 (%util)", proc: "/proc/diskstats 10번째 열", value: "12%" },
    S: { cmd: "iostat -xz 1 (aqu-sz · await) · /proc/pressure/io", proc: "/proc/diskstats 12번째 열", value: "aqu-sz 0.3 · some 1%" },
    E: { cmd: "dmesg -T | grep -i 'I/O error'", proc: "/sys/block/*/device/ioerr_cnt", value: "0" },
  },
  네트워크: {
    U: { cmd: "sar -n DEV 1 (rxkB/s txkB/s ÷ 대역폭)", proc: "/proc/net/dev bytes", value: "6%" },
    S: { cmd: "ip -s link (dropped overruns) · nstat (TcpRetransSegs)", proc: "/proc/net/dev drop · /proc/net/snmp", value: "drop 0 · retrans 3/s" },
    E: { cmd: "ip -s link (errors)", proc: "/proc/net/dev errs", value: "0" },
  },
};

interface Scene {
  label: string;
  focus: readonly [Resource, Axis][];
  verdict: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "CPU 사용률",
    focus: [["CPU", "U"]],
    verdict: "40% — 여유 있어 보임",
    note: "mpstat가 10초 동안 /proc/stat의 cpu 줄을 두 번 읽어 뺀 값입니다. idle이 아닌 tick이 40%라 '아직 60%가 남았다'고 읽기 쉽습니다. 그러나 사용률은 평균이고, 지연은 평균이 아니라 순간 대기에서 옵니다.",
  },
  {
    label: "CPU 포화",
    focus: [["CPU", "S"]],
    verdict: "some 25% · r 12 > 4 vCPU — 포화",
    note: "/proc/pressure/cpu의 some avg10이 25%입니다. 최근 10초(시정수) 동안 네 번에 한 번꼴로 어떤 task가 CPU를 기다렸다는 뜻입니다. vmstat의 r 열도 폭주 순간에 12로 vCPU 수 4를 넘습니다. 사용률 40%와 모순이 아니라, 1초 폭주와 3초 한가함이 번갈아 온 결과입니다.",
  },
  {
    label: "CPU 오류",
    focus: [["CPU", "E"]],
    verdict: "MCE 0 — 하드웨어 문제 아님",
    note: "오류 칸은 보통 비어 있지만 건너뛰면 안 됩니다. 기계 검사 예외(MCE)나 열 제한(thermal throttling) 로그가 있으면 포화의 원인이 소프트웨어가 아닐 수 있습니다.",
  },
  {
    label: "메모리 U·S·E",
    focus: [["메모리", "U"], ["메모리", "S"], ["메모리", "E"]],
    verdict: "available 9.8 GiB · PSI 0% · OOM 0 — 깨끗",
    note: "메모리는 세 칸을 한 번에 봅니다. available이 넉넉하고 /proc/pressure/memory가 0에 가까우며 si/so도 0이라 회수 압력이 없습니다. CPU 포화의 원인이 메모리 쪽(회수·swap)으로 번진 것이 아님을 여기서 지웁니다.",
  },
  {
    label: "디스크 U·S·E",
    focus: [["디스크", "U"], ["디스크", "S"], ["디스크", "E"]],
    verdict: "%util 12% · aqu-sz 0.3 — 한가함",
    note: "iostat의 %util·aqu-sz·await는 모두 /proc/diskstats의 열을 두 번 읽어 계산한 값입니다. 대기열이 0.3이면 디스크가 요청을 쌓아 두지 않습니다. PSI io도 1%라 I/O를 기다리는 task가 거의 없습니다.",
  },
  {
    label: "네트워크 U·S·E",
    focus: [["네트워크", "U"], ["네트워크", "S"], ["네트워크", "E"]],
    verdict: "6% · drop 0 · 재전송 3/s — 주의만",
    note: "대역폭 사용률은 낮고 drop·errors도 0입니다. TCP 재전송 초당 3건은 CPU 폭주 때 응답이 늦어 상대가 재전송한 것일 수 있어, 원인이 아니라 증상 쪽에 적어 둡니다.",
  },
  {
    label: "결론 → 아래로 내려감",
    focus: [["CPU", "S"]],
    verdict: "병목은 CPU 포화 하나 — perf top · bpftrace로",
    note: "열두 칸 가운데 빨간 칸은 CPU 포화뿐입니다. 사용률 40%만 봤다면 서버를 늘리거나 엉뚱한 곳을 봤을 것입니다. 다음 질문은 '1초마다 폭주하는 것이 무엇인가'이고, 그 답은 perf top과 bpftrace가 줍니다(9절).",
  },
];

export default function UseGridViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const scene = SCENES[scenes.active];
  const isFocused = (r: Resource, a: Axis) => scene.focus.some(([fr, fa]) => fr === r && fa === a);
  const isHot = (r: Resource, a: Axis) => r === "CPU" && a === "S";
  const seen = new Set<string>();
  SCENES.slice(0, scenes.active + 1).forEach((s) => s.focus.forEach(([r, a]) => seen.add(`${r}-${a}`)));

  return (
    <VizFrame
      eyebrow="USE grid · 4 vCPU 서버"
      title="자원마다 사용률·포화·오류 세 칸을 다 읽어야 40%에 숨은 포화가 보입니다"
      description="행은 자원, 열은 USE의 세 질문입니다. 칸마다 그 숫자를 보여 주는 명령과, 그 명령이 읽는 /proc 파일을 적었습니다. 빨간 칸이 이 서버의 유일한 병목입니다."
      note="(가정) 4 vCPU 서버에서 12스레드 배치 작업이 4초마다 1초씩 폭주하고 나머지 시간엔 웹 앱이 20%를 쓰는 상황입니다. 0.25 × 100% + 0.75 × 20% = 40% 사용률, PSI cpu some ≈ 25%입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="USE 격자: 자원별 사용률·포화·오류 명령과 /proc 파일"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          {/* 장면마다 길이가 다른 제목·판정을 같은 칸에 겹쳐 가장 긴 장면이 높이를 정한다 */}
          <div className="grid">
            {SCENES.map((s, i) => (
              <div key={s.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 ${i === scenes.active ? "" : "invisible"}`}>
                <h4 className="text-base font-bold">{s.label}</h4>
                <span className="font-mono text-xs font-bold text-primary">{s.verdict}</span>
              </div>
            ))}
          </div>

          <div className="mt-2 overflow-x-auto">
            <div className="grid min-w-[18rem] grid-cols-[3.2rem_repeat(3,minmax(0,1fr))] gap-1 text-[10px]">
              <span />
              {AXES.map((a) => (
                <span key={a.key} className="text-center font-bold text-muted-foreground">
                  {a.key} · {a.label}
                </span>
              ))}
              {RESOURCES.map((r) => (
                <div key={r} className="contents">
                  <span className="flex items-center font-bold text-foreground">{r}</span>
                  {AXES.map((a) => {
                    const cell = GRID[r][a.key];
                    const focused = isFocused(r, a.key);
                    const hot = isHot(r, a.key);
                    const visited = seen.has(`${r}-${a.key}`);
                    const bg = focused ? (hot ? "#dc2626" : "#2563eb") : visited ? (hot ? "#fecaca" : "#dbeafe") : "transparent";
                    const fg = focused ? "#ffffff" : undefined;
                    return (
                      <div
                        key={a.key}
                        className={`flex flex-col rounded-sm border px-1 py-0.5 transition-colors duration-300 ${focused ? "border-transparent" : "border-border"}`}
                        style={{ backgroundColor: bg, color: fg }}
                        title={`${cell.cmd} ← ${cell.proc}`}
                      >
                        <span className={`font-mono leading-[1.15] ${focused ? "" : "text-foreground"}`}>{cell.cmd}</span>
                        <span className={`mt-0.5 font-mono text-[9px] leading-[1.15] ${focused ? "opacity-80" : "text-muted-foreground"}`}>{cell.proc}</span>
                        <span className={`mt-0.5 font-bold leading-[1.15] tabular-nums ${focused ? "" : hot ? "text-[#dc2626]" : "text-foreground"}`}>{cell.value}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 grid border-l border-primary/50 pl-4">
            {SCENES.map((s, i) => (
              <p key={s.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 text-sm leading-6 text-muted-foreground sm:leading-5 ${i === scenes.active ? "" : "invisible"}`}>
                {s.note}
              </p>
            ))}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
