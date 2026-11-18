import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison "같은 조건으로 비교할 실패와 지표" — API 성공 직후 process crash와 duplicate resume.
 * 같은 crash 지점에서 재개 방식만 바꾸면 외부 환불 횟수가 2회(중복) 또는 1회가 된다.
 * 마지막 저장 지점을 '승인' 뒤로 둔 것은 설명용 가정이다.
 */

type Tone = "idle" | "done" | "saved" | "effect" | "lost" | "dup" | "check";

interface Step {
  state: string;
  tone: Tone;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  steps: readonly [Step, Step, Step, Step, Step];
  refunds: number;
  process: string;
}

const STEP_NAMES = ["환불 조회", "승인", "환불 API", "영수증 기록", "완료 표시"] as const;

const TONE_CLASS: Record<Tone, string> = {
  idle: "border-dashed border-border text-muted-foreground",
  done: "border-border",
  saved: "border-sky-600 bg-sky-50 dark:bg-sky-950/40",
  effect: "border-amber-600 bg-amber-50 dark:bg-amber-950/40",
  lost: "border-dashed border-red-600 text-red-700 dark:text-red-400",
  dup: "border-red-600 bg-red-50 dark:bg-red-950/40",
  check: "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
};

const SCENES: readonly Scene[] = [
  {
    label: "정상 실행",
    summary: "외부 환불 1회 · 완료 기록",
    note: "조회→승인→API 순서가 끝까지 실행되면 환불은 한 번 일어나고 영수증과 완료 표시가 남습니다. 저장 지점(checkpoint)은 실행 중에 진행 상태를 저장해 둔 곳이며, 여기서는 승인 뒤에 있다고 가정합니다. (가정)",
    steps: [
      { state: "완료", tone: "done" },
      { state: "완료 · 저장됨", tone: "saved" },
      { state: "성공", tone: "effect" },
      { state: "기록함", tone: "done" },
      { state: "완료", tone: "done" },
    ],
    refunds: 1,
    process: "실행 중 → 정상 종료",
  },
  {
    label: "API 성공 직후 crash",
    summary: "외부 환불 1회 · 내부 기록은 승인까지",
    note: "환불 API가 성공한 직후 프로세스가 죽으면 바깥 결제 쪽에서는 환불이 이미 한 번 일어났지만, 저장된 진행 상태는 승인까지만 압니다. 영수증과 완료 표시는 남지 않았습니다.",
    steps: [
      { state: "완료", tone: "done" },
      { state: "마지막 저장 지점", tone: "saved" },
      { state: "성공 · 기록 전 종료", tone: "effect" },
      { state: "남지 않음", tone: "lost" },
      { state: "남지 않음", tone: "lost" },
    ],
    refunds: 1,
    process: "API 직후 종료",
  },
  {
    label: "재개: 저장 지점 뒤 다시 실행",
    summary: "외부 환불 2회 (중복)",
    note: "재개할 때 마지막 저장 지점 뒤의 단계를 그대로 다시 실행하면 이미 성공한 환불 API를 한 번 더 부를 수 있습니다. 본문이 주입 목록에 둔 'API 성공 직후 process crash'를 이렇게 재개하면 생길 수 있는 결과이며, 본문의 지표는 duplicate refund가 0인지입니다. (가정)",
    steps: [
      { state: "완료", tone: "done" },
      { state: "여기서 재개", tone: "saved" },
      { state: "다시 호출", tone: "dup" },
      { state: "기록함", tone: "done" },
      { state: "완료", tone: "done" },
    ],
    refunds: 2,
    process: "재개",
  },
  {
    label: "재개: 작업 키로 기존 결과 확인",
    summary: "외부 환불 1회 · 기존 결과 검증 뒤 완료",
    note: "같은 작업 키(이 환불 작업에 붙인 고정 식별자)로 결제 쪽에 이미 생긴 환불 결과를 먼저 찾으면 API를 다시 부르지 않고 그 결과를 검증해 영수증 기록과 완료로 이어 갈 수 있습니다. 이 확인(idempotency, 같은 요청을 여러 번 보내도 효과가 한 번만 나게 하는 성질)을 framework와 애플리케이션 중 누가 책임지는지가 비교 항목입니다. 후보별 결과는 [M] 미측정입니다.",
    steps: [
      { state: "완료", tone: "done" },
      { state: "여기서 재개", tone: "saved" },
      { state: "기존 결과 발견 · 호출 생략", tone: "check" },
      { state: "검증 뒤 기록함", tone: "check" },
      { state: "완료", tone: "done" },
    ],
    refunds: 1,
    process: "재개",
  },
];

function Flow({ scene }: { scene: Scene }) {
  return (
    <div className="min-w-0">
      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        {scene.steps.map((step, slot) => (
          <li
            key={STEP_NAMES[slot]}
            className={`flex min-w-0 items-baseline justify-between gap-2 rounded-lg border px-3 py-2 text-xs leading-5 sm:block sm:px-2 ${TONE_CLASS[step.tone]}`}
          >
            <span className="block shrink-0 font-bold text-foreground">
              <span className="mr-1 font-mono text-[10px] text-muted-foreground">{slot + 1}</span>
              {STEP_NAMES[slot]}
            </span>
            <span className="block break-keep text-right sm:mt-1 sm:text-left">{step.state}</span>
          </li>
        ))}
      </ol>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border pt-4">
        <div className="min-w-0 text-xs leading-5">
          <p className="font-bold">바깥 결제 쪽에서 실제로 일어난 환불</p>
          <p className="text-muted-foreground">프로세스: {scene.process}</p>
        </div>
        <div className="flex items-center gap-2" aria-label={`환불 ${scene.refunds}회`}>
          {[0, 1].map((slot) => (
            <span
              key={slot}
              className={`flex h-9 w-14 items-center justify-center rounded-md border text-[11px] font-bold ${
                slot < scene.refunds ? (slot === 0 ? "border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300" : "border-red-600 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400") : "border-dashed border-border text-muted-foreground"
              }`}
            >
              {slot < scene.refunds ? (slot === 0 ? "환불 1" : "중복 2") : "—"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CrashResumeViz() {
  return (
    <SceneShell
      eyebrow="A-104 · 장애 주입"
      title="API 성공 직후 멈춘 환불을 두 방식으로 재개합니다"
      description="칸은 환불 workflow의 다섯 단계이고, 아래 두 칸은 바깥 결제 쪽에서 실제로 일어난 환불 횟수입니다. 같은 지점에서 프로세스를 끝낸 뒤 재개 방식만 바꿉니다. 단계 구성과 저장 지점 위치는 설명용입니다. (가정)"
      note="이 그림은 비교할 실험 조건을 보인 것이며 어떤 후보가 어느 쪽으로 동작한다는 측정 결과가 아닙니다."
      ariaLabel="환불 API 성공 직후 프로세스가 종료된 뒤 재개 방식에 따라 환불이 한 번 또는 두 번 일어나는 과정"
      scenes={SCENES}
      render={(index) => <Flow scene={SCENES[index]} />}
    />
  );
}
