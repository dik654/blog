import SceneShell from "./SceneShell";

/**
 * 본문 대응: #registry(create 재시도)와 #team-cron(여러 scheduler instance).
 * 왼쪽 = 요청을 보내는 쪽, 오른쪽 = registry에 실제로 생긴 task 칸.
 * task 번호 #41·#42, key 이름, schedule 이름·시각은 모두 그림용 가정입니다.
 */
type Step = { who: string; text: string; tone: "plain" | "lost" | "dup" | "reuse" };

const SCENES = [
  {
    label: "순차 번호만 발급하면",
    summary: "재시도 1번 → task 2개",
    steps: [
      { who: "client", text: "create 요청", tone: "plain" },
      { who: "registry", text: "task #41 생성 · 응답 보냄", tone: "plain" },
      { who: "client", text: "응답 못 받음 (timeout)", tone: "lost" },
      { who: "client", text: "같은 내용으로 재시도", tone: "plain" },
      { who: "registry", text: "새 번호 #42 생성", tone: "dup" },
    ],
    tasks: ["#41", "#42"],
    note: "registry는 요청을 처리했지만 응답이 client에 닿지 않았습니다. client는 실패로 보고 다시 보내고, 순차 번호만 보는 registry는 이를 새 요청으로 받아 같은 작업이 두 번 생깁니다.",
  },
  {
    label: "idempotency key를 받으면",
    summary: "같은 key → 기존 #41",
    steps: [
      { who: "client", text: "create 요청 · key k1", tone: "plain" },
      { who: "registry", text: "k1 → task #41 생성", tone: "plain" },
      { who: "client", text: "응답 못 받음 (timeout)", tone: "lost" },
      { who: "client", text: "재시도 · 같은 key k1", tone: "plain" },
      { who: "registry", text: "k1 이미 있음 → #41 돌려줌", tone: "reuse" },
    ],
    tasks: ["#41"],
    note: "idempotency key는 ‘이 요청이 앞의 그 요청과 같은 것’이라고 client가 붙여 보내는 이름입니다. registry는 같은 key를 다시 보면 새 task를 만들지 않고 기존 task와 맞춰 돌려줍니다.",
  },
  {
    label: "cron instance가 둘이어도",
    summary: "schedule ID + 예정 시각 = key",
    steps: [
      { who: "scheduler 1", text: "nightly · 03:00 run 실행 시각 도달", tone: "plain" },
      { who: "scheduler 2", text: "같은 run 실행 시각 도달", tone: "plain" },
      { who: "registry", text: "key nightly@03:00 → #41 생성", tone: "plain" },
      { who: "registry", text: "같은 key → #41 돌려줌", tone: "reuse" },
      { who: "", text: "", tone: "plain" },
    ],
    tasks: ["#41"],
    note: "logical run은 ‘이 schedule의 몇 시 회차’라는 논리적 실행 한 번입니다. schedule ID와 예정 시각을 key로 쓰면 두 scheduler instance가 같은 회차를 동시에 처리해도 task는 하나만 생깁니다. 이름과 시각은 가정입니다.",
  },
] as const satisfies readonly { label: string; summary: string; steps: readonly Step[]; tasks: readonly string[]; note: string }[];

const TONE: Record<Step["tone"], string> = {
  plain: "border-border/70",
  lost: "border-dashed border-amber-600/70 text-amber-700 dark:text-amber-400",
  dup: "border-red-600/60 text-red-700 dark:text-red-400",
  reuse: "border-emerald-600/60 text-emerald-700 dark:text-emerald-400",
};

export default function IdempotentCreateViz() {
  return (
    <SceneShell
      eyebrow="create 재시도"
      title="응답이 사라진 재시도가 task를 하나 더 만드는가"
      description="왼쪽은 위에서 아래로 일어난 순서이고, 오른쪽 칸은 그 결과 registry에 실제로 남은 task입니다. 번호와 key 이름은 가정입니다."
      ariaLabel="timeout 뒤 재시도에서 순차 번호와 idempotency key가 만드는 task 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const tasks: readonly string[] = scene.tasks;
        const steps: readonly Step[] = scene.steps;
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
            <ol className="min-w-0 space-y-2">
              {steps.map((step, index) =>
                step.who ? (
                  <li key={index} className={`grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2 rounded-md border bg-background px-2 py-1.5 text-xs leading-5 ${TONE[step.tone]}`}>
                    <span className="font-mono text-[11px] text-muted-foreground">{step.who}</span>
                    <span className="min-w-0 break-words font-semibold">{step.text}</span>
                  </li>
                ) : (
                  <li key={index} aria-hidden className="min-h-[2.25rem]" />
                ),
              )}
            </ol>
            <div className="min-w-0 rounded-lg border border-border/70 bg-background p-3">
              <p className="text-xs font-bold text-primary">registry에 남은 task</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[0, 1].map((slot) => {
                  const id: string | undefined = tasks[slot];
                  return (
                    <div
                      key={slot}
                      className={`flex h-12 items-center justify-center rounded-md border font-mono text-sm font-bold ${
                        id ? (slot === 1 ? "border-red-600/60 text-red-700 dark:text-red-400" : "border-border") : "border-dashed border-border/40 text-muted-foreground/50"
                      }`}
                    >
                      {id ?? "빈 칸"}
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-xs font-semibold">{tasks.length === 2 ? "같은 작업 2개 (중복 실행)" : "작업 1개"}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
