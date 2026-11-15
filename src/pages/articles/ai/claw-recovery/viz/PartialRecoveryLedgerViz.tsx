import SceneShell from "./SceneShell";

/**
 * 본문 대응: #recipes "partial recovery는 성공이 아니라 새 state다".
 * ledger 한 장의 값이 attempt마다 어떻게 바뀌는지 보인다.
 * L=2는 본문 공식의 예(L=2, A=1 → R=1)와 같고, recipe step 3개는 가정이다.
 * R = max(0, L − A): A=1 → 1, A=2 → 0.
 */
const LIMIT = 2;

type StepState = "todo" | "done" | "skip";

const STEP_TEXT: Record<StepState, string> = {
  todo: "미적용",
  done: "적용됨",
  skip: "다시 안 함",
};

const STEP_CLASS: Record<StepState, string> = {
  todo: "border-dashed border-border text-muted-foreground",
  done: "border-emerald-600 text-emerald-700 dark:text-emerald-400",
  skip: "border-slate-400 text-muted-foreground",
};

const SCENES = [
  {
    label: "attempt #1 시작",
    summary: `A=1 · R=max(0, ${LIMIT}−1)=1`,
    attempts: 1,
    state: "실패",
    version: "v1",
    steps: ["todo", "todo", "todo"] as const,
    record: "attempt #1을 ledger에 먼저 기록",
    note: "시작한 attempt는 결과와 관계없이 A에 셉니다. 한도 L=2에서 하나를 썼으므로 남은 자동 시도 R은 1입니다.",
  },
  {
    label: "일부만 적용",
    summary: "PartiallyRecovered · v2",
    attempts: 1,
    state: "PartiallyRecovered",
    version: "v2",
    steps: ["done", "done", "todo"] as const,
    record: "적용된 action · 남은 side effect · rollback 방법",
    note: "세 step 중 두 개만 적용됐습니다. 이것은 성공도 원래 실패 상태도 아닌 새 state입니다. 무엇이 적용됐고 무엇이 남았는지 기록하고 state version을 v2로 올립니다.",
  },
  {
    label: "다음 evaluation",
    summary: "v2를 읽음 · A=2 · R=0",
    attempts: 2,
    state: "PartiallyRecovered",
    version: "v2",
    steps: ["skip", "skip", "todo"] as const,
    record: "attempt #2 = 남은 부분만 다루는 제한된 recipe",
    note: "다음 evaluation은 v1이 아니라 v2를 읽으므로 이미 적용된 step 1·2를 실패 전 상태로 오해해 반복하지 않습니다. 추가 recipe 하나를 시작하면 A=2, R=0입니다.",
  },
  {
    label: "갈래 A · verifier 통과",
    summary: "Recovered",
    attempts: 2,
    state: "Recovered",
    version: "v3",
    steps: ["done", "done", "done"] as const,
    record: "verifier가 성공 조건을 확인한 뒤에만 전환",
    note: "Recovered terminal state는 verifier가 성공 조건을 확인한 다음에야 기록합니다. step이 모두 실행됐다는 사실만으로 전환하지 않습니다.",
  },
  {
    label: "갈래 B · verifier 불일치",
    summary: "R=0 → escalation",
    attempts: 2,
    state: "escalation",
    version: "v3",
    steps: ["done", "done", "done"] as const,
    record: "evidence bundle과 함께 다음 주체에게",
    note: "갈래 A와 같은 지점에서 갈라진 다른 결과입니다. 성공 조건이 확인되지 않았고 R=0이라 자동으로 더 시도할 수 없습니다. 기록한 action·side effect·rollback 방법을 evidence로 묶어 escalation합니다.",
  },
] as const;

function Field({ name, value, strong = false }: { name: string; value: string; strong?: boolean }) {
  return (
    <div className="min-w-0 rounded-md border border-border/70 px-2 py-1.5">
      <span className="block text-[11px] text-muted-foreground">{name}</span>
      <span className={`block truncate font-mono text-xs sm:text-sm ${strong ? "font-bold text-primary" : ""}`}>{value}</span>
    </div>
  );
}

export default function PartialRecoveryLedgerViz() {
  return (
    <SceneShell
      eyebrow="Recovery ledger"
      title="일부만 적용된 recovery는 새 version의 state로 기록합니다"
      description="한 장의 ledger 값이 attempt마다 바뀌는 모습입니다. L=2는 위 공식의 예와 같고, recipe가 step 세 개로 이뤄졌다는 것과 version 번호는 가정입니다. 마지막 두 장면(갈래 A·B)은 같은 지점에서 갈라지는 두 결과입니다."
      ariaLabel="partial recovery 이후 state version, attempt 수, 남은 budget이 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const remaining = Math.max(0, LIMIT - scene.attempts);
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
              <div className="col-span-3 min-w-0 sm:col-span-1">
                <Field name="state" value={scene.state} strong />
              </div>
              <Field name="version" value={scene.version} />
              <Field name="A / L" value={`${scene.attempts} / ${LIMIT}`} />
              <Field name="남은 R" value={String(remaining)} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {scene.steps.map((step, i) => (
                <div key={i} className={`rounded-md border px-2 py-2 text-center text-xs leading-5 ${STEP_CLASS[step]}`}>
                  <span className="block font-semibold text-foreground">step {i + 1}</span>
                  <span className="block">{STEP_TEXT[step]}</span>
                </div>
              ))}
            </div>
            <p className="rounded-md border border-border/70 px-3 py-2 text-xs leading-5 sm:text-sm">
              <span className="font-semibold">기록 · </span>
              {scene.record}
            </p>
          </div>
        );
      }}
    />
  );
}
