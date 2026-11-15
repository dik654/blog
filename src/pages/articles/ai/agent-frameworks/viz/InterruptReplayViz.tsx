import SceneShell from "./SceneShell";

/**
 * 본문 대응: #langchain "Replay가 가능하면 side effect는 idempotent해야 한다".
 * checkpoint 앞의 node 결과는 건너뛸 수 있지만, interrupt가 있는 node는 resume할 때
 * node 시작부터 다시 실행될 수 있다 → interrupt 앞의 side effect도 반복될 수 있다.
 * node 안의 "알림 호출"은 interrupt 앞 side effect를 보이려는 가정이다.
 */
type StepState = "idle" | "done" | "skipped" | "paused" | "rerun" | "resumed";

interface Step {
  key: string;
  label: string;
}

const NODES: readonly Step[] = [
  { key: "order", label: "주문 조회" },
  { key: "policy", label: "정책 판정" },
];

const INNER: readonly Step[] = [
  { key: "effect", label: "① 외부 호출 (가정)" },
  { key: "interrupt", label: "② interrupt" },
  { key: "after", label: "③ 승인 결과 기록" },
];

interface Scene {
  label: string;
  summary: string;
  note: string;
  nodes: readonly StepState[];
  inner: readonly StepState[];
  effectCount: number;
  checkpoint: boolean;
}

const SCENES: readonly Scene[] = [
  {
    label: "첫 실행: interrupt에서 멈춥니다",
    summary: "외부 호출 1회 → checkpoint",
    note: "승인 node 안에서 ① 외부 호출이 먼저 실행되고 ② interrupt에서 state를 checkpoint에 저장한 뒤 멈춥니다.",
    nodes: ["done", "done"],
    inner: ["done", "paused", "idle"],
    effectCount: 1,
    checkpoint: true,
  },
  {
    label: "resume: 앞 node는 건너뜁니다",
    summary: "저장된 결과 재사용",
    note: "Checkpoint에 결과가 남은 주문 조회와 정책 판정은 다시 실행하지 않고 저장된 값을 씁니다.",
    nodes: ["skipped", "skipped"],
    inner: ["idle", "idle", "idle"],
    effectCount: 1,
    checkpoint: true,
  },
  {
    label: "resume: 승인 node는 처음부터",
    summary: "외부 호출 2회째 가능",
    note: "Interrupt가 있는 node는 node 시작부터 다시 실행될 수 있습니다. 그러면 interrupt 앞의 ① 외부 호출도 한 번 더 나갈 수 있습니다.",
    nodes: ["skipped", "skipped"],
    inner: ["rerun", "resumed", "done"],
    effectCount: 2,
    checkpoint: true,
  },
];

const TONE: Record<StepState, { box: string; tag: string }> = {
  idle: { box: "border-dashed border-border/60 text-muted-foreground/60", tag: "대기" },
  done: { box: "border-border bg-background", tag: "실행" },
  skipped: { box: "border-dashed border-border text-muted-foreground", tag: "건너뜀" },
  paused: { box: "border-amber-600 bg-background", tag: "멈춤" },
  rerun: { box: "border-red-600 bg-background", tag: "다시 실행" },
  resumed: { box: "border-emerald-600 bg-background", tag: "승인 받음" },
};

function Box({ step, state }: { step: Step; state: StepState }) {
  const tone = TONE[state];
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 text-xs leading-5 ${tone.box}`}>
      <span className="block break-keep font-semibold">{step.label}</span>
      <span className="block text-[11px]">{tone.tag}</span>
    </div>
  );
}

export default function InterruptReplayViz() {
  return (
    <SceneShell
      eyebrow="interrupt와 resume"
      title="재개는 멈춘 줄이 아니라 그 node의 시작에서 다시 돌 수 있습니다"
      description="왼쪽 두 칸은 앞 node, 오른쪽 묶음은 interrupt가 있는 승인 node 하나입니다. 승인 node 안의 ① 외부 호출은 interrupt 앞 side effect를 보이려는 예입니다(가정)."
      ariaLabel="interrupt가 있는 node가 resume 때 처음부터 다시 실행되어 interrupt 앞의 외부 호출이 반복될 수 있는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div className="grid min-w-0 grid-cols-2 gap-2 self-start">
                {NODES.map((step, index) => (
                  <Box key={step.key} step={step} state={scene.nodes[index]} />
                ))}
              </div>
              <div className="min-w-0 rounded-lg border border-blue-600 p-2">
                <p className="mb-2 text-xs font-bold text-blue-700 dark:text-blue-400">승인 node</p>
                <div className="grid min-w-0 grid-cols-3 gap-2">
                  {INNER.map((step, index) => (
                    <Box key={step.key} step={step} state={scene.inner[index]} />
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <p className="rounded border border-border/70 px-3 py-2">
                checkpoint <span className="font-bold">{scene.checkpoint ? "저장됨" : "없음"}</span>
              </p>
              <p className={`rounded border px-3 py-2 ${scene.effectCount > 1 ? "border-red-600" : "border-border/70"}`}>
                외부 호출 횟수 <span className="font-mono font-bold">{scene.effectCount}</span>
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
