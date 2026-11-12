import BashSceneShell from "./BashSceneShell";

/**
 * 본문 대응: #sandbox "Crash 뒤에는 먼저 effect를 reconciliation하고 같은 command를 재실행합니다".
 * 위 줄 = crash까지 실제로 일어난 일(본문 가정 사례), 아래 칸 = 복구가 그 사실을 어떻게 읽는지.
 */

type Tone = "done" | "warn" | "crash" | "unknown";

interface SceneData {
  label: string;
  summary: string;
  note: string;
  known: boolean;
  steps: readonly { text: string; tone: "bad" | "step" | "ok" | "stop" }[];
}

const EVENTS: readonly { text: string; tone: Tone }[] = [
  { text: "src/auth.ts 수정 완료", tone: "done" },
  { text: "login test 중 timeout", tone: "warn" },
  { text: "result 저장 전 host crash", tone: "crash" },
];

const SCENES: readonly SceneData[] = [
  {
    label: "crash 직후",
    summary: "완료 상태 ambiguous",
    note: "수정은 끝났지만 test가 timeout되고 result를 저장하기 전에 host가 멈췄습니다. 저장된 result가 없을 뿐 edit가 실행되지 않았다는 증거는 없으므로 완료 상태는 ambiguous입니다.",
    known: false,
    steps: [{ text: "저장된 result 없음 → 무엇이 끝났는지 모름", tone: "stop" }],
  },
  {
    label: "하지 말아야 할 복구",
    summary: "result 없음 ≠ edit 없음",
    note: "저장된 result가 없다는 이유만으로 edit가 실행되지 않았다고 판단하고 같은 mutation을 곧바로 다시 실행하면, 이미 적용된 effect를 중복할 수 있습니다.",
    known: false,
    steps: [
      { text: "‘result가 없으니 edit도 안 됐다’고 가정", tone: "bad" },
      { text: "같은 edit를 blindly rerun → 중복 effect 가능", tone: "bad" },
    ],
  },
  {
    label: "durable 기록으로 다시 찾기",
    summary: "effect receipt 재구성",
    note: "Planned operation ID, canonical command·cwd·environment digest와 authorization receipt가 durable하게 남아 있어야 이 attempt를 다시 찾습니다. Stable idempotency key로 process-group·cleanup status를 조회하고 남은 child는 먼저 정리합니다.",
    known: true,
    steps: [
      { text: "operation ID · command·cwd·env digest · authorization receipt", tone: "step" },
      { text: "idempotency key로 process-group·cleanup status 조회", tone: "step" },
      { text: "남은 child가 있으면 먼저 정리", tone: "step" },
      { text: "before/after digest와 실제 diff로 effect receipt 재구성", tone: "step" },
    ],
  },
  {
    label: "확인한 상태에 따라 갈라짐",
    summary: "test만 새 attempt / 폐기·escalation",
    note: "Edit가 이미 적용됐으면 같은 mutation은 다시 실행하지 않고 deterministic login test만 새 attempt로 실행합니다. 상태를 판정할 수 없거나 안전한 compensation이 없으면 baseline worktree를 폐기하거나 사람에게 escalation합니다. 이 계약도 exactly-once를 보장하지는 않습니다.",
    known: true,
    steps: [
      { text: "edit 적용됨 → mutation 재실행 없음 · login test만 새 attempt", tone: "ok" },
      { text: "판정 불가 · 안전한 compensation 없음 → baseline worktree 폐기 또는 사람 escalation", tone: "stop" },
    ],
  },
];

const EVENT_COLOR: Record<Tone, string> = {
  done: "#059669",
  warn: "#d97706",
  crash: "#dc2626",
  unknown: "#94a3b8",
};

const STEP_COLOR = { bad: "#dc2626", step: "#2563eb", ok: "#059669", stop: "#d97706" } as const;

export default function CrashReconcileViz() {
  return (
    <BashSceneShell
      eyebrow="CRASH · RECONCILIATION"
      title="Crash 뒤에는 저장된 결과가 아니라 실제 effect부터 다시 맞춥니다"
      description="위 줄은 crash까지 실제로 일어난 일이고, 아래 칸은 복구 쪽이 그 상황을 어떻게 읽는지입니다. 본문의 로그인 수정 가정 사례입니다."
      note="이 절차는 hardening 계약이며 pinned runtime이 이미 수행한다는 뜻이 아닙니다. Reconciliation은 중복 effect를 줄일 뿐 exactly-once를 보장하지 않습니다."
      ariaLabel="crash 뒤 effect reconciliation 순서와 분기"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="grid min-w-0 gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground">
                실제로 일어난 일 · {scene.known ? "복구 쪽이 receipt로 재구성 시도" : "복구 쪽은 아직 모름"}
              </p>
              <ol className="mt-1 grid min-w-0 grid-cols-3 gap-1.5">
                {EVENTS.map((event) => (
                  <li
                    key={event.text}
                    className={`min-w-0 rounded-md border px-2 py-1.5 text-[11px] font-semibold leading-4 sm:text-xs sm:leading-5 ${scene.known ? "" : "border-dashed"}`}
                    style={{ borderColor: scene.known || event.tone === "crash" ? EVENT_COLOR[event.tone] : EVENT_COLOR.unknown }}
                  >
                    <span className="break-keep">{event.text}</span>
                  </li>
                ))}
              </ol>
            </div>
            <ol className="grid min-w-0 gap-1.5 border-t border-border pt-3" aria-label="복구 쪽 판단">
              {scene.steps.map((step, stepIndex) => (
                <li
                  key={step.text}
                  className="grid min-w-0 grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-2 border-l-2 pl-2 text-xs leading-5"
                  style={{ borderColor: STEP_COLOR[step.tone] }}
                >
                  <span className="font-mono text-[10px] font-bold text-muted-foreground">{scene.label.startsWith("확인한") ? (stepIndex === 0 ? "A" : "B") : stepIndex + 1}</span>
                  <span className="break-keep font-semibold">{step.text}</span>
                </li>
              ))}
            </ol>
          </div>
        );
      }}
    />
  );
}
