import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 16노드 클러스터에 8노드씩 동시에 필요한 학습 작업 A·B·C·D(가정).
 * 흩어 주기: 노드를 한 대씩 돌아가며 나누면(가정) 2바퀴 뒤 작업마다 2대, 4바퀴 뒤 4대에서 노드가 바닥난다.
 *   16대가 모두 잡혔지만 8대를 채운 작업은 없다 → 실행 0개.
 * 묶음 할당: A·B가 8대씩 받아 실행, C·D는 자원 반환 대기. 8시간 뒤 A·B가 끝나면 C·D가 8대씩 받는다.
 */
type Job = "A" | "B" | "C" | "D";
const JOBS: readonly Job[] = ["A", "B", "C", "D"];
const NODE_COUNT = 16;
const NEED = 8;

const JOB_COLOR: Record<Job, string> = {
  A: "#2563eb",
  B: "#0d9488",
  C: "#d97706",
  D: "#9333ea",
};

/** 노드 i를 i % 4번째 작업에 주는 돌림 배분에서 앞의 n대만 배분한 상태 */
const roundRobin = (dealt: number): readonly (Job | null)[] =>
  Array.from({ length: NODE_COUNT }, (_, i) => (i < dealt ? JOBS[i % JOBS.length] : null));

const gang = (first: Job, second: Job): readonly (Job | null)[] =>
  Array.from({ length: NODE_COUNT }, (_, i) => (i < NEED ? first : second));

type JobState = "요청" | "대기" | "실행" | "완료";

interface Scene {
  label: string;
  summary: string;
  note: string;
  nodes: readonly (Job | null)[];
  states: Record<Job, JobState>;
  clock: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "네 작업이 동시에 도착",
    summary: "요청 32대 · 노드 16대",
    note: "작업마다 노드 8대를 한꺼번에 요구합니다. 네 작업을 합치면 32대인데 클러스터는 16대이므로 동시에 실행할 수 있는 것은 두 개뿐입니다.",
    nodes: roundRobin(0),
    states: { A: "요청", B: "요청", C: "요청", D: "요청" },
    clock: "0시간",
  },
  {
    label: "한 대씩 흩어 주기 · 2바퀴",
    summary: "작업마다 2/8대",
    note: "(가정) 공평하게 나눈다며 노드를 작업마다 한 대씩 돌아가며 줍니다. 두 바퀴가 돌면 8대가 잡혔지만 어느 작업도 8대에 닿지 않아 시작하지 못합니다.",
    nodes: roundRobin(8),
    states: { A: "대기", B: "대기", C: "대기", D: "대기" },
    clock: "0시간",
  },
  {
    label: "네 바퀴 뒤 노드가 바닥남",
    summary: "16/16대 할당 · 실행 0개",
    note: "(가정) 같은 방식으로 16대를 모두 나누면 작업마다 4대입니다. 노드는 전부 할당됐지만 8대를 채운 작업이 없어 모두 시작하지 못할 수 있습니다.",
    nodes: roundRobin(16),
    states: { A: "대기", B: "대기", C: "대기", D: "대기" },
    clock: "0시간",
  },
  {
    label: "묶음이 다 준비될 때만 할당",
    summary: "A·B 실행 · C·D 대기",
    note: "필요한 8대가 모두 준비될 때 한 작업에 통째로 줍니다. A와 B가 8대씩 받아 실행하고, C와 D는 자원이 반환될 때까지 기다립니다.",
    nodes: gang("A", "B"),
    states: { A: "실행", B: "실행", C: "대기", D: "대기" },
    clock: "0시간",
  },
  {
    label: "8시간 뒤 자원 반환",
    summary: "C·D가 8대씩 받음",
    note: "A와 B가 8시간 실행을 마치고 자원을 반환하면 C와 D가 8대씩 받아 시작합니다. C·D가 언제 끝나는지는 이 사례에 정해져 있지 않습니다.",
    nodes: gang("C", "D"),
    states: { A: "완료", B: "완료", C: "실행", D: "실행" },
    clock: "8시간",
  },
];

const STATE_STYLE: Record<JobState, string> = {
  요청: "text-muted-foreground",
  대기: "text-red-700 dark:text-red-400",
  실행: "font-bold text-emerald-700 dark:text-emerald-400",
  완료: "text-muted-foreground",
};

export default function GangAllocationViz() {
  return (
    <SceneShell
      eyebrow="공동 시작"
      title="노드를 흩어 주면 16대가 다 잡혀도 아무 작업도 시작하지 못합니다"
      description="칸 하나가 노드 한 대(GPU 8개)이고, 칸 안 글자는 그 노드를 잡은 작업입니다. 16노드에 8노드짜리 작업 네 개가 들어온 3절의 사례(가정)를 그대로 씁니다."
      ariaLabel="16개 노드를 흩어 주는 방식과 8개 묶음으로 할당하는 방식의 작업 상태 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const held = (job: Job) => scene.nodes.filter((owner) => owner === job).length;
        const allocated = scene.nodes.filter((owner) => owner !== null).length;
        const running = JOBS.filter((job) => scene.states[job] === "실행").length;
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-6">
            <div className="min-w-0">
              <div className="grid grid-cols-4 gap-1.5" role="img" aria-label={`할당된 노드 ${allocated}/16, 실행 중인 작업 ${running}개`}>
                {scene.nodes.map((owner, index) => (
                  <div
                    key={index}
                    className="flex h-10 items-center justify-center rounded-md border text-sm font-bold transition-colors duration-300 motion-reduce:transition-none"
                    style={
                      owner
                        ? { borderColor: JOB_COLOR[owner], backgroundColor: `${JOB_COLOR[owner]}22`, color: JOB_COLOR[owner] }
                        : { borderColor: "#cbd5e1", borderStyle: "dashed", color: "#94a3b8" }
                    }
                  >
                    {owner ?? "빈"}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap justify-between gap-x-3 gap-y-1 font-mono text-xs">
                <span>할당 노드 {allocated}/16</span>
                <span>실행 작업 {running}개</span>
                <span className="text-muted-foreground">경과 {scene.clock}</span>
              </div>
            </div>
            <div className="min-w-0 space-y-2">
              {JOBS.map((job) => {
                const count = scene.states[job] === "완료" ? 0 : held(job);
                return (
                  <div key={job} className="grid grid-cols-[1.5rem_minmax(0,1fr)_3rem_2.5rem] items-center gap-2 text-xs sm:text-sm">
                    <span className="font-bold" style={{ color: JOB_COLOR[job] }}>{job}</span>
                    <div className="grid h-4 min-w-0 grid-cols-8 gap-px rounded-sm bg-muted/40">
                      {Array.from({ length: NEED }, (_, slot) => (
                        <span
                          key={slot}
                          className="rounded-[2px] transition-colors duration-300 motion-reduce:transition-none"
                          style={{ backgroundColor: slot < count ? JOB_COLOR[job] : "transparent" }}
                        />
                      ))}
                    </div>
                    <span className="text-right font-mono">{scene.states[job] === "완료" ? "반환" : `${count}/8`}</span>
                    <span className={`text-right ${STATE_STYLE[scene.states[job]]}`}>{scene.states[job]}</span>
                  </div>
                );
              })}
              <p className="pt-1 text-xs leading-5 text-muted-foreground">막대 한 칸 = 작업이 잡은 노드 1대 · 8칸을 다 채워야 시작</p>
            </div>
          </div>
        );
      }}
    />
  );
}
