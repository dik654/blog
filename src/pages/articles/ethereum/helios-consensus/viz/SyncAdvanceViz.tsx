import HeliosSceneShell from "./HeliosSceneShell";

/**
 * 본문 대응: #sync-loop — 처음 동기화하는 sync와 이미 동기화된 뒤의 advance가 밟는 순서, 그리고 실패 종류별 재시도 의미.
 * 단계와 분기는 본문 두 문단과 "Endpoint timeout이면 ..." 문단만 옮깁니다.
 */
type StepState = "run" | "skip" | "idle";
type Step = { text: string; state: StepState };

const SYNC_STEPS: readonly Step[] = [
  { text: "Store 초기화", state: "run" },
  { text: "checkpoint로 bootstrap", state: "run" },
  { text: "update 목록을 차례로 검증·적용", state: "run" },
  { text: "finality update 반영", state: "run" },
  { text: "새 checkpoint가 있으면 channel로 알림", state: "run" },
];

const ADVANCE_WITH_NEXT: readonly Step[] = [
  { text: "finality update 검증·적용", state: "run" },
  { text: "Store에 next committee가 있는가? → 있음", state: "run" },
  { text: "현재 period update 추가 요청", state: "skip" },
];

const ADVANCE_NO_NEXT: readonly Step[] = [
  { text: "finality update 검증·적용", state: "run" },
  { text: "Store에 next committee가 있는가? → 없음", state: "run" },
  { text: "현재 period update를 하나 더 요청해 채우기 시도", state: "run" },
];

const SCENES = [
  {
    label: "처음: sync",
    summary: "초기화 → bootstrap → update들 → finality",
    note: "처음 동기화할 때 sync는 Store를 초기화하고 checkpoint로 bootstrap한 뒤 update 목록을 차례로 검증·적용합니다. 마지막에 finality update를 반영하고, 새 checkpoint가 있으면 channel로 알립니다.",
  },
  {
    label: "동기화 뒤: advance (next 있음)",
    summary: "finality update만",
    note: "이미 동기화된 뒤 advance는 finality update를 먼저 검증·적용합니다. Store에 next committee가 이미 있으면 추가 update를 요청하지 않습니다.",
  },
  {
    label: "동기화 뒤: advance (next 없음)",
    summary: "finality + 현재 period update 1개",
    note: "Store에 next committee가 없을 때만 현재 period의 update를 하나 더 요청해 committee를 채우려고 시도합니다.",
  },
  {
    label: "실패가 났을 때",
    summary: "다시 묻기가 의미 있는 실패만 재시도",
    note: "Endpoint timeout이면 다른 endpoint에 같은 요청을 보낼 수 있습니다. Invalid signature·wrong branch·future slot은 같은 payload를 다시 받아도 바뀌지 않습니다. Local clock이 크게 어긋나면 future·stale 판정의 기준 자체가 흔들립니다.",
  },
] as const;

function StepList({ steps, tag }: { steps: readonly Step[]; tag: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 font-mono text-[11px] font-bold text-muted-foreground">{tag}</p>
      <ol className="space-y-1.5">
        {steps.map((step, i) => (
          <li
            key={step.text}
            className={`grid grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-2 rounded-md border px-2 py-1.5 text-xs leading-5 sm:text-sm ${
              step.state === "run"
                ? "border-primary/60 bg-primary/[0.05]"
                : step.state === "skip"
                  ? "border-dashed border-border text-muted-foreground line-through"
                  : "border-border"
            }`}
          >
            <span className="font-mono text-[11px] font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
            <span className="break-keep">
              {step.text}
              {step.state === "skip" ? " (건너뜀)" : ""}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const FAILURES = [
  { kind: "endpoint timeout", retry: "다른 endpoint에 같은 요청 가능", ok: true },
  { kind: "invalid signature", retry: "같은 payload면 결과 동일", ok: false },
  { kind: "wrong branch", retry: "같은 payload면 결과 동일", ok: false },
  { kind: "future slot", retry: "같은 payload면 결과 동일 · local clock이 기준", ok: false },
] as const;

export default function SyncAdvanceViz() {
  return (
    <HeliosSceneShell
      eyebrow="sync · advance"
      title="처음 한 번은 sync, 그 뒤로는 advance가 Store를 전진시킵니다"
      description="실선 칸은 그 경로에서 실행하는 단계, 점선은 건너뛰는 단계입니다. 마지막 장면은 실패 종류마다 다시 요청하는 것이 의미가 있는지 나누며, 거기서는 실선이 재시도할 만한 실패, 빨간 점선이 같은 payload로는 결과가 바뀌지 않는 실패입니다."
      note="이 경로가 바꾸는 LightClientStore는 확인한 snapshot에서 memory 구조입니다. 적용이 끝났다는 사실을 disk 저장이나 restart 뒤 복구로 읽지 않습니다."
      ariaLabel="sync와 advance의 순서, 실패별 재시도를 보여 주는 네 장면"
      scenes={SCENES}
      render={(active) => {
        if (active === 3) {
          return (
            <ul className="space-y-1.5">
              {FAILURES.map((f) => (
                <li
                  key={f.kind}
                  className={`grid gap-1 rounded-md border px-3 py-2 text-xs leading-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:text-sm ${
                    f.ok ? "border-primary/60 bg-primary/[0.05]" : "border-dashed border-red-600"
                  }`}
                >
                  <span className="font-mono font-bold">{f.kind}</span>
                  <span className={`break-keep ${f.ok ? "" : "text-red-700 dark:text-red-400"}`}>{f.retry}</span>
                </li>
              ))}
            </ul>
          );
        }
        const steps = active === 0 ? SYNC_STEPS : active === 1 ? ADVANCE_WITH_NEXT : ADVANCE_NO_NEXT;
        return <StepList steps={steps} tag={active === 0 ? "sync · 처음 동기화" : "advance · 이미 동기화됨"} />;
      }}
    />
  );
}
