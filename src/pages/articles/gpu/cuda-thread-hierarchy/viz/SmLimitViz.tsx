import SceneShell from "./SceneShell";

/**
 * 본문 대응: #placement — block을 올릴 때 여러 한도를 함께 만족해야 하고, 먼저 닿는 한도가 수를 정한다.
 * 칸 수는 모두 설명용 가정이며 실제 한도가 아니다. 12칸 자원 세 개와 block 개수 6칸.
 * 보통: thread 3 → 4 block / register 무거움: 6 → 2 block / shared 무거움: 6 → 2 block / 작은 block: 1칸씩 → 개수 한도 6.
 * occupancy 장면: 머무는 warp 10칸 / 전체 12칸(가정), 그중 준비된 warp 2.
 */
interface LimitScene {
  label: string;
  summary: string;
  note: string;
  blocks: number;
  thread: number;
  register: number;
  shared: number;
  limiter: string | null;
}

const SCENES: readonly LimitScene[] = [
  { label: "기준 block", summary: "4 block · thread 칸이 먼저 참", blocks: 4, thread: 3, register: 2, shared: 2, limiter: "thread 수", note: "SM 하나에 block을 올릴 때 thread 수, register, shared memory, block 개수를 함께 셉니다. 칸 수는 비교를 위한 가정입니다. 이 경우에는 thread 칸이 먼저 차서 4 block에서 멈춥니다." },
  { label: "register를 많이 쓰면", summary: "4 block → 2 block", blocks: 2, thread: 3, register: 6, shared: 2, limiter: "register", note: "Thread 수는 그대로여도 block 하나가 register를 많이 쓰면 같은 SM에 머무는 block 수가 줄 수 있습니다. 장치 한도 안의 block이어도 그렇습니다." },
  { label: "shared memory를 많이 쓰면", summary: "4 block → 2 block", blocks: 2, thread: 3, register: 2, shared: 6, limiter: "shared memory", note: "같은 이치로 shared memory를 많이 쓰면 그 칸이 먼저 찰 수 있습니다. 어느 칸이 실제로 먼저 찰지는 이 그림의 칸 수로 정해지지 않습니다." },
  { label: "아주 작은 block이면", summary: "개수 한도가 먼저", blocks: 6, thread: 1, register: 1, shared: 1, limiter: "block 개수", note: "반대로 아주 작은 block은 thread와 저장 공간이 남아도, SM이 수용할 수 있는 block 개수 한도에 먼저 걸릴 수 있습니다." },
  { label: "머무는 것과 일하는 것", summary: "occupancy 10/12 · 준비 2 (가정)", blocks: 0, thread: 0, register: 0, shared: 0, limiter: null, note: "동시에 머무는 warp의 비율이 occupancy입니다. 이 비율이 높아도 다음 명령의 입력을 기다리는 warp만 많다면 일을 내보내지 못합니다. Profiler의 eligible warps는 다음 명령을 실행할 준비가 된 warp를 확인하는 데 씁니다." },
];

const WARPS = 12;
const RESIDENT = 10;
const READY = 2;

function Gauge({ name, used, cap, hit, color }: { name: string; used: number; cap: number; hit: boolean; color: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs">
      <span className={hit ? "font-bold" : "text-muted-foreground"}>{name}</span>
      <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(12, minmax(0, 1fr))` }}>
        {Array.from({ length: 12 }, (_, cell) => {
          const inCap = cap === 12 || cell < cap;
          return (
            <span
              key={cell}
              className="h-4 rounded-[1px] border"
              style={{
                backgroundColor: cell < used ? color : "transparent",
                borderColor: !inCap ? "transparent" : cell < used ? color : "#94a3b8",
              }}
            />
          );
        })}
      </div>
      <span className={`text-right font-mono ${hit ? "font-bold" : "text-muted-foreground"}`}>{used}/{cap}</span>
    </div>
  );
}

function Resources({ scene }: { scene: LimitScene }) {
  const rows = [
    { name: "thread 수", used: scene.thread * scene.blocks, cap: 12 },
    { name: "register", used: scene.register * scene.blocks, cap: 12 },
    { name: "shared memory", used: scene.shared * scene.blocks, cap: 12 },
    { name: "block 개수", used: scene.blocks, cap: 6 },
  ];
  return (
    <div>
      <p className="mb-2 text-xs font-semibold">
        SM 하나에 올린 block {scene.blocks}개 · 칸은 block 하나가 쓰는 양을 쌓은 것
      </p>
      <div className="space-y-2">
        {rows.map((row) => (
          <Gauge key={row.name} {...row} hit={row.name === scene.limiter} color={row.name === scene.limiter ? "#d97706" : "#64748b"} />
        ))}
      </div>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">주황 줄이 먼저 찬 한도: {scene.limiter}</p>
    </div>
  );
}

function Occupancy() {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold">SM의 warp 자리 12칸 (가정)</p>
      <div className="grid grid-cols-6 gap-1">
        {Array.from({ length: WARPS }, (_, cell) => {
          const ready = cell < READY;
          const resident = cell < RESIDENT;
          return (
            <span
              key={cell}
              className={`flex h-10 items-center justify-center rounded border text-xs ${ready ? "border-emerald-600 bg-emerald-50 font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" : resident ? "border-amber-600 text-amber-700 dark:text-amber-400" : "border-dashed border-border text-muted-foreground"}`}
            >
              {ready ? "준비" : resident ? "대기" : "빈"}
            </span>
          );
        })}
      </div>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">준비: 다음 명령 실행 가능 · 대기: 다음 명령의 입력을 기다림 · 빈: warp 없음. 머무는 warp는 준비 2 + 대기 8 = 10칸입니다.</p>
    </div>
  );
}

export default function SmLimitViz() {
  return (
    <SceneShell
      eyebrow="SM에 올리는 한도"
      title="먼저 차는 칸이 SM에 머무는 block 수를 정합니다"
      description="SM은 묶음을 실제로 실행하는 처리 구역입니다. 네 줄 중 하나라도 차면 그 SM에는 block을 더 올리지 못한다고 놓은 모형입니다."
      note="칸 수와 block당 사용량은 모두 비교를 위한 가정입니다. 실제 한도는 장치에서 조회하고 profiler로 확인합니다."
      ariaLabel="thread 수, register, shared memory, block 개수 한도와 occupancy의 관계"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return scene.limiter ? <Resources scene={scene} /> : <Occupancy />;
      }}
    />
  );
}
