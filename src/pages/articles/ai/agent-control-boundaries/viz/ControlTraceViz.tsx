import SceneShell from "./SceneShell";

/**
 * 본문 대응: #selection — 읽기 예산 6회, 검사 2개, 허용 대상 test-1(모두 가정).
 * 1회째 연결 파일, 2회째 원인 → 6 − 2 = 4회 남음 → 검사 2개 통과 → prod-1 제안 거부 → test-1 반영·버전 기록.
 */
const READ_BUDGET = 6;
const FILES = 20;

const SCENES = [
  {
    label: "시작 조건",
    summary: "읽기 6회 · 검사 2개 · 대상 test-1",
    reads: 0,
    checks: 0,
    gate: "idle",
    note: "파일 20개 중 원인은 1곳에 있습니다. 읽기 횟수, 검사 개수, 반영 대상은 작업을 시작하기 전에 정해 둡니다(가정).",
  },
  {
    label: "읽기 1회째",
    summary: "연결 파일 발견 · 남은 읽기 5회",
    reads: 1,
    checks: 0,
    gate: "idle",
    note: "첫 파일에서는 원인 대신 연결된 파일을 찾았습니다. 다음에 무엇을 읽을지는 이 관측에 따라 달라집니다.",
  },
  {
    label: "읽기 2회째",
    summary: "원인 발견 · 6 − 2 = 4회 남음",
    reads: 2,
    checks: 0,
    gate: "idle",
    note: "agent loop는 첫 결과를 보고 두 번째 파일을 골랐고 거기서 원인을 찾았습니다. 쓰지 않은 읽기 4회는 남겨 둡니다.",
  },
  {
    label: "검사 2개",
    summary: "workflow가 순서대로 실행 → 모두 통과",
    reads: 2,
    checks: 2,
    gate: "idle",
    note: "수정안을 만든 뒤 정해 둔 검사 2개를 순서대로 돌립니다. 하나라도 통과하지 못하면 반영하지 않고 실패로 끝냅니다. 이 조건은 탐색 중의 판단으로 바뀌지 않습니다.",
  },
  {
    label: "prod-1을 제안하면",
    summary: "검사는 통과했지만 대상이 달라 거부",
    reads: 2,
    checks: 2,
    gate: "denied",
    note: "checkpoint는 대상이 test-1인지, 버전이 수정안의 버전인지 다시 봅니다. 검사를 통과한 수정안이어도 운영 대상 prod-1은 허용 범위 밖이라 실행하지 않습니다.",
  },
  {
    label: "test-1에 반영",
    summary: "반영 후 실제 버전 기록",
    reads: 2,
    checks: 2,
    gate: "applied",
    note: "허가된 test-1에만 반영하고 실제로 올라간 버전을 기록합니다. 위의 파일 선택은 경로가 불확실해서 agent loop에 맡겼고, 이 대상 확인은 실패 영향 때문에 둔 자리입니다.",
  },
] as const;

const READ_LABELS = ["연결 파일", "원인 파일"] as const;

function RowLabel({ title, who }: { title: string; who: string }) {
  return (
    <div className="min-w-0">
      <span className="block text-sm font-bold">{title}</span>
      <span className="block text-xs text-muted-foreground">{who}</span>
    </div>
  );
}

export default function ControlTraceViz() {
  return (
    <SceneShell
      eyebrow="한 작업의 진행"
      title="읽기 2회, 검사 2개, 대상 확인 한 번"
      description="3절의 가정(파일 20개, 읽기 최대 6회, 검사 2개, 반영 대상 test-1)으로 한 작업을 따라갑니다. 칸 하나가 읽기 1회입니다. 숫자와 대상 이름은 설명을 위한 가정입니다."
      ariaLabel="읽기 예산, 검사, 반영 대상 확인이 장면마다 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const left = READ_BUDGET - scene.reads;
        return (
          <div className="min-w-0 space-y-5">
            <div className="grid gap-2 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
              <RowLabel title="탐색" who="agent loop가 다음 파일을 고름" />
              <div className="min-w-0">
                <div className="grid grid-cols-6 gap-1.5">
                  {Array.from({ length: READ_BUDGET }, (_, slot) => {
                    const used = slot < scene.reads;
                    return (
                      <div
                        key={slot}
                        className={`flex h-12 min-w-0 flex-col items-center justify-center rounded-md border px-0.5 text-center text-[11px] leading-4 ${
                          used ? (slot === 1 ? "border-blue-600 bg-blue-600/10 font-bold" : "border-slate-500 bg-slate-500/10") : "border-dashed border-border"
                        }`}
                      >
                        <span className="font-mono text-muted-foreground">{slot + 1}</span>
                        <span className="break-keep">{used ? READ_LABELS[slot] : "미사용"}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  읽은 파일 {scene.reads}/{FILES} · 남은 읽기 {left}회
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
              <RowLabel title="검사" who="workflow가 정한 순서" />
              <div className="grid min-w-0 grid-cols-2 gap-2">
                {[1, 2].map((n) => {
                  const done = n <= scene.checks;
                  return (
                    <div
                      key={n}
                      className={`flex h-12 items-center justify-between rounded-md border px-3 text-sm ${
                        done ? "border-green-600 bg-green-600/10" : "border-dashed border-border"
                      }`}
                    >
                      <span className="font-semibold">검사 {n}</span>
                      <span className={done ? "font-bold text-green-700 dark:text-green-400" : "text-muted-foreground"}>{done ? "통과" : "대기"}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
              <RowLabel title="반영" who="checkpoint가 대상·버전 확인" />
              <div className="grid min-w-0 grid-cols-2 gap-2">
                <div
                  className={`flex h-16 flex-col justify-center rounded-md border px-3 text-sm ${
                    scene.gate === "applied" ? "border-blue-600 bg-blue-600/10" : "border-border"
                  }`}
                >
                  <span className="font-mono font-semibold">test-1</span>
                  <span className={scene.gate === "applied" ? "text-xs font-bold text-blue-700 dark:text-blue-400" : "text-xs text-muted-foreground"}>
                    {scene.gate === "applied" ? "반영 · 실제 버전 기록" : "허용 대상"}
                  </span>
                </div>
                <div
                  className={`flex h-16 flex-col justify-center rounded-md border px-3 text-sm ${
                    scene.gate === "denied" ? "border-red-600 bg-red-600/10" : "border-dashed border-border"
                  }`}
                >
                  <span className="font-mono font-semibold">prod-1</span>
                  <span className={scene.gate === "denied" ? "text-xs font-bold text-red-700 dark:text-red-400" : "text-xs text-muted-foreground"}>
                    {scene.gate === "denied" ? "제안됨 → 거부" : "허용 범위 밖"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
