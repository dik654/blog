import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — Urlichs의 예. 빠른 swap 디스크를 느린 디스크로 바꾸면 task가 CPU 대신 디스크 앞에서 기다린다.
 * CPU 줄만 세는 옛 계산은 7 → 2로 내려가고, 디스크 앞 수를 더한 계산은 10 → 10이다. task 수는 설명용 가정.
 */
interface Scene {
  label: string;
  summary: string;
  note: string;
  showSlow: boolean;
  addDisk: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "빠른 swap 디스크", summary: "CPU 줄 7 → 옛 숫자 7", showSlow: false, addDisk: false, note: "(가정) task 10개 중 7개가 CPU를 쓰거나 기다리고 3개만 디스크 앞에 있습니다. 옛 계산은 CPU 쪽 7개만 셉니다." },
  { label: "느린 디스크로 바꾼 뒤", summary: "옛 숫자 7 → 2", showSlow: true, addDisk: false, note: "(가정) task들이 CPU 대신 느린 디스크 앞에서 기다려 CPU 쪽은 2개로 줄어듭니다. 서버는 더 힘들어졌는데 숫자는 내려갑니다. Urlichs가 직관에 어긋난다고 본 장면입니다." },
  { label: "디스크 앞 수까지 더하면", summary: "7 + 3 = 10 · 2 + 8 = 10", showSlow: true, addDisk: true, note: "1993년 수정은 swap이나 빠른 I/O를 기다리는 task도 자원을 쓴다고 보고 더합니다. (가정) 두 경우 모두 10이라 디스크가 느려져도 숫자가 떨어지지 않습니다." },
];

const CPU_TONE = "#2563eb";
const DISK_TONE = "#f59e0b";

function Lane({ name, count, tone, faded }: { name: string; count: number | null; tone: string; faded: boolean }) {
  return (
    <div className="mt-2">
      <p className={`text-xs ${faded ? "text-muted-foreground/70" : "text-muted-foreground"}`}>
        {name} <span className="font-mono">{count === null ? "" : count}</span>
      </p>
      <div className="mt-1 grid grid-cols-5 gap-1 sm:grid-cols-10">
        {Array.from({ length: 10 }, (_, index) => (
          <span
            key={index}
            className="aspect-square rounded-sm border border-border"
            style={{ backgroundColor: count !== null && index < count ? tone : "transparent", opacity: faded ? 0.45 : 1 }}
          />
        ))}
      </div>
    </div>
  );
}

function Panel({ title, cpu, disk, shown, addDisk }: { title: string; cpu: number; disk: number; shown: boolean; addDisk: boolean }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background p-2.5 sm:p-3">
      <p className="text-xs font-bold sm:text-sm">{title}</p>
      <Lane name="CPU 쪽" count={shown ? cpu : null} tone={CPU_TONE} faded={false} />
      <Lane name="디스크 앞" count={shown ? disk : null} tone={DISK_TONE} faded={!addDisk} />
      <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-border pt-2">
        <span className="text-[11px] leading-4 text-muted-foreground sm:text-xs">{addDisk ? "더한 뒤 숫자" : "옛 부하 숫자"}</span>
        <span className="font-mono text-lg font-bold">{!shown ? "−" : addDisk ? cpu + disk : cpu}</span>
      </div>
    </div>
  );
}

export default function SwapCountViz() {
  return (
    <SceneShell
      eyebrow="1993년의 불만"
      title="느린 디스크로 바꾸면 옛 부하 숫자는 오히려 내려갑니다"
      description="칸 하나가 task입니다. 파란 칸은 CPU를 쓰거나 기다리고 주황 칸은 swap 디스크 앞에서 기다립니다. task 10개와 그 배분은 메일에 없는 설명용 수입니다(가정)."
      ariaLabel="swap 디스크를 느린 것으로 바꿨을 때 옛 계산과 수정된 계산의 부하 숫자 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-4">
            <Panel title="빠른 swap 디스크" cpu={7} disk={3} shown addDisk={scene.addDisk} />
            <Panel title="느린 디스크" cpu={2} disk={8} shown={scene.showSlow} addDisk={scene.addDisk} />
          </div>
        );
      }}
    />
  );
}
