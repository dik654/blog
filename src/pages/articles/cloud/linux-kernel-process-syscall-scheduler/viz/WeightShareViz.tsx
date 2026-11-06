import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #weights — nice → 가중치 → 같은 run queue 안의 CPU 몫.
 * 몫 = 자기 가중치 ÷ 가중치 합. 1024/1359, 335/1359의 표기 75.4%·24.6%는 본문과 같게 둔다. 15/1039 = 1.4%.
 * 셋째 작업(가정 nice 0): 2383이 분모 → 43.0% · 43.0% · 14.1%.
 */
const LADDER = [
  { nice: 0, weight: 1024, tag: "표" },
  { nice: 1, weight: 819, tag: "계산" },
  { nice: 2, weight: 655, tag: "계산" },
  { nice: 3, weight: 524, tag: "계산" },
  { nice: 4, weight: 419, tag: "계산" },
  { nice: 5, weight: 335, tag: "표" },
  { nice: 19, weight: 15, tag: "표" },
] as const;

interface Task {
  name: string;
  weight: number;
  color: string;
}

const WEB: Task = { name: "웹 서버 스레드 (nice 0)", weight: 1024, color: "#2563eb" };
const THIRD: Task = { name: "셋째 작업 (nice 0, 가정)", weight: 1024, color: "#64748b" };
const GZIP: Task = { name: "압축 (nice 5)", weight: 335, color: "#d97706" };
const NICE19: Task = { name: "압축 (nice 19였다면)", weight: 15, color: "#d97706" };

const SCENES = [
  { label: "nice 한 단계마다 ÷ 1.25", summary: "1024 → 335 (nice 5)", tasks: [] as readonly Task[], shares: [] as readonly string[], note: "1024를 1.25로 다섯 번 나누면 335.5이고 표에는 335로 적혀 있습니다. nice 1~4는 같은 나눗셈의 계산값이라 표와 조금 다를 수 있습니다. nice 6~18은 줄을 생략했습니다." },
  { label: "nice 0과 nice 5가 겨룰 때", summary: "335 ÷ 1359 = 24.6%", tasks: [WEB, GZIP], shares: ["75.4", "24.6"], note: "막대 전체가 CPU 하나입니다. 가중치 합 1359를 가중치대로 나눕니다. 압축은 혼자 돌 때보다 약 4배 오래 걸립니다." },
  { label: "압축이 nice 19였다면", summary: "15 ÷ 1039 = 1.4%", tasks: [WEB, NICE19], shares: ["98.6", "1.4"], note: "압축을 nice 19로 내리면 거의 남는 시간에만 돈다는 뜻이 됩니다. 조각이 너무 얇아 막대에서 겨우 보입니다." },
  { label: "셋째 작업이 같은 줄에 들어오면", summary: "분모 1359 → 2383", tasks: [WEB, THIRD, GZIP], shares: ["43.0", "43.0", "14.1"], note: "(가정) nice 0 작업 하나가 더 들어온 경우입니다. 분모가 늘어 웹 서버도 압축도 몫이 줄어듭니다. 반올림 때문에 합이 100.1%로 보입니다." },
  { label: "상대가 없으면", summary: "100%", tasks: [GZIP], shares: ["100"], note: "nice는 CPU 시간을 보장하지 않고 겨룰 때의 비율만 정합니다. 상대가 없으면 nice 5도 nice 19도 CPU 100%를 씁니다." },
] as const;

const shareOf = (task: Task, tasks: readonly Task[]) => (task.weight / tasks.reduce<number>((sum, t) => sum + t.weight, 0)) * 100;

function Ladder() {
  return (
    <div className="space-y-1">
      {LADDER.map((row) => (
        <div key={row.nice} className="grid grid-cols-[3.5rem_minmax(0,1fr)_5rem] items-center gap-2 text-xs">
          <span className="font-mono font-semibold">nice {row.nice}</span>
          <div className="h-3 rounded-sm bg-muted/40">
            <div className="h-full rounded-sm" style={{ width: `${(row.weight / 1024) * 100}%`, backgroundColor: row.tag === "표" ? "#2563eb" : "#94a3b8" }} />
          </div>
          <span className="text-right font-mono">
            {row.weight} <span className="text-[10px] text-muted-foreground">{row.tag}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function ShareBar({ tasks, shares }: { tasks: readonly Task[]; shares: readonly string[] }) {
  return (
    <div>
      <div className="flex h-10 overflow-hidden rounded-sm border border-border">
        {tasks.map((task, i) => (
          <div key={task.name} className={i > 0 ? "border-l-2 border-background" : ""} style={{ width: `${shareOf(task, tasks)}%`, minWidth: 2, backgroundColor: task.color }} />
        ))}
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">막대 전체 = CPU 하나의 시간</p>
      <ul className="mt-3 space-y-2">
        {tasks.map((task, i) => (
          <li key={task.name} className="grid grid-cols-[0.75rem_minmax(0,1fr)_auto] items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: task.color }} />
            <span className="min-w-0">
              {task.name} <span className="font-mono text-xs text-muted-foreground">가중치 {task.weight}</span>
            </span>
            <span className="font-mono font-bold">{shares[i]}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function WeightShareViz() {
  return (
    <SceneShell
      eyebrow="가중치 → 몫"
      title="nice는 가중치가 되고, 가중치는 겨룰 때의 몫이 됩니다"
      description="가중치는 CPU를 나눌 때 쓰는 비율 숫자입니다. 작업들은 CPU만 쓰고 잠들지 않으며 같은 run queue(CPU의 대기 줄)에 있습니다."
      note="CPU가 둘 이상이면 다른 CPU에 놓여 겨루지 않을 수 있어, 이 비율은 같은 run queue 안에서만 뜻이 있습니다."
      ariaLabel="nice 값에 따른 가중치 감소와 CPU 몫 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={SCENES.map((scene) => (scene.tasks.length === 0 ? <Ladder key={scene.label} /> : <ShareBar key={scene.label} tasks={scene.tasks} shares={scene.shares} />))} />
      )}
    />
  );
}
