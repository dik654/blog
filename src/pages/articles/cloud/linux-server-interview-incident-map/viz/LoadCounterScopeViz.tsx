import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — r, ps의 D, vmstat b, load가 같은 task를 어느 범위까지 세는가.
 * (가정) r 8, 디스크 D 18, lock D 4 → D 22, b 18, r + D = 30, r + b = 26.
 */
const R = 8;
const DISK_D = 18;
const LOCK_D = 4;
const TOTAL = R + DISK_D + LOCK_D;

interface Range {
  name: string;
  from: number;
  to: number;
  value: number;
}

const RANGES: readonly Range[] = [
  { name: "vmstat r", from: 1, to: R, value: R },
  { name: "ps -eo state의 D", from: R + 1, to: TOTAL, value: DISK_D + LOCK_D },
  { name: "vmstat b", from: R + 1, to: R + DISK_D, value: DISK_D },
  { name: "load에 더하는 수", from: 1, to: TOTAL, value: TOTAL },
];

const SCENES = [
  { label: "r", summary: "r = 8", note: "CPU를 쓰거나 차례를 기다리는 task의 줄, 곧 실행 대기열(run queue)의 길이입니다. 디스크나 lock을 기다리는 task는 여기에 없습니다." },
  { label: "ps의 D", summary: "18 + 4 = 22", note: "디스크 응답이나 일부 lock 같은 사건만 기다리는 끊김 없는 잠입니다. 무엇을 기다리든 ps의 상태 열에는 D로 찍히므로 세면 22입니다." },
  { label: "vmstat b", summary: "b = 18 · lock 4개 빠짐", note: "b는 /proc/stat의 procs_blocked, 곧 I/O 완료를 기다리는 수입니다. 디스크를 기다리는 D는 대개 여기에 들어가고(이 그림은 18개 모두로 가정) lock을 기다리는 4개는 나오지 않습니다." },
  { label: "load", summary: "8 + 22 = 30", note: "load는 D를 모두 셉니다. r과 b만 더하면 26이라 4가 모자랍니다. 화면의 load는 이 수의 지수 감쇠 평균이라 순간 합과 대략만 맞습니다." },
];

const TONE = ["#2563eb", "#f59e0b", "#b45309"];
const colorOf = (slot: number) => (slot <= R ? TONE[0] : slot <= R + DISK_D ? TONE[1] : TONE[2]);

export default function LoadCounterScopeViz() {
  return (
    <SceneShell
      eyebrow="네 숫자의 범위"
      title="r, D, b, load는 같은 task를 서로 다른 범위로 셉니다"
      description="칸 하나가 task입니다. 파랑은 CPU 줄, 주황은 디스크를 기다리는 D, 진한 갈색은 lock을 기다리는 D입니다. 아래 막대가 각 숫자가 세는 칸입니다. 칸 30개와 그 배분은 설명용 가정입니다(가정)."
      ariaLabel="task 30개 중 r, ps D, vmstat b, load가 세는 범위"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-[repeat(30,minmax(0,1fr))] gap-px text-[11px] leading-4 text-muted-foreground">
            <span style={{ gridColumn: `1 / span ${R}` }}>CPU 줄 {R}</span>
            <span style={{ gridColumn: `${R + 1} / span ${DISK_D}` }}>D · 디스크 {DISK_D}</span>
            <span className="whitespace-nowrap" style={{ gridColumn: `${R + DISK_D + 1} / span ${LOCK_D}` }}>lock {LOCK_D}</span>
          </div>
          <div className="mt-1 grid grid-cols-[repeat(30,minmax(0,1fr))] gap-px">
            {Array.from({ length: TOTAL }, (_, index) => {
              const range = RANGES[active];
              const slot = index + 1;
              const inside = slot >= range.from && slot <= range.to;
              return <span key={slot} className="h-5 rounded-[2px]" style={{ backgroundColor: colorOf(slot), opacity: inside ? 1 : 0.22 }} />;
            })}
          </div>
          <div className="mt-4 space-y-2">
            {RANGES.map((range, index) => {
              const on = index === active;
              return (
                <div key={range.name} className={on ? "" : "opacity-45"}>
                  <p className={`flex justify-between text-xs ${on ? "font-bold" : "text-muted-foreground"}`}>
                    <span>{range.name}</span>
                    <span className="font-mono">{range.value}</span>
                  </p>
                  <div className="mt-0.5 grid grid-cols-[repeat(30,minmax(0,1fr))]">
                    <span className="h-1.5 rounded-sm" style={{ gridColumn: `${range.from} / span ${range.to - range.from + 1}`, backgroundColor: on ? "#475569" : "#94a3b8" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
