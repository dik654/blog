import ToolSceneShell from "./ToolSceneShell";

/**
 * 본문 대응: #dispatch "Timeout·cancel·retry는 이미 생긴 effect부터 확인합니다".
 * Timeout 하나가 call 종류와 이미 생긴 effect에 따라 다섯 갈래로 나뉜다.
 * 위 칸 = timeout된 call과 먼저 던질 질문, 아래 칸 = 갈래. 장면마다 한 갈래만 진하게 보인다.
 */
const BRANCHES: readonly { tag: string; title: string; result: string; verdict: string; count: string }[] = [
  { tag: "READ", title: "Read timeout", result: "같은 snapshot에서 bounded retry", verdict: "retry 가능", count: "read라 해당 없음" },
  { tag: "EDIT", title: "Edit timeout을 무조건 반복", result: "patch가 두 번 적용될 수 있음", verdict: "금지", count: "이미 1회였다면 반복 시 2회" },
  { tag: "EDIT", title: "완료 여부가 모호", result: "같은 idempotency key·effect receipt로 기존 operation 조회", verdict: "조회 뒤에만 retry", count: "receipt 조회로 확인" },
  { tag: "EDIT", title: "File이 일부만 쓰임", result: "partial_effect와 남은 diff 기록 → rollback 또는 사람 검토", verdict: "success commit 보류", count: "일부 적용 · 남은 diff 기록" },
  { tag: "LATE", title: "Deadline 뒤 늦게 온 result", result: "attempt와 generation을 확인", verdict: "확인 뒤 수용", count: "result의 attempt로 구분" },
];

const SCENES = [
  { label: "Read가 timeout됐을 때", summary: "workspace 변경 없음", note: "Read는 workspace를 바꾸지 않으므로 같은 snapshot에서 횟수를 제한해 다시 시도할 수 있습니다." },
  { label: "Edit를 그냥 반복하면", summary: "patch 적용 1회 → 2회", note: "Timeout은 effect가 없었다는 뜻이 아닙니다. 첫 시도가 이미 patch를 적용했는데 같은 call을 반복하면 같은 patch가 한 번 더 들어갈 수 있습니다." },
  { label: "완료 여부가 모호할 때", summary: "조회 → 그 뒤 retry", note: "같은 idempotency key와 effect receipt로 기존 operation이 이미 끝났는지 먼저 조회합니다. Retry는 그 조회 뒤에만 합니다." },
  { label: "일부만 쓰였을 때", summary: "partial_effect", note: "남은 diff를 먼저 기록하고, rollback 또는 사람 검토가 끝날 때까지 success로 commit하지 않습니다." },
  { label: "늦게 도착한 result", summary: "attempt · generation 확인", note: "Executor는 cancellation을 child process에 전달하고 종료를 기다립니다. Deadline 뒤에 온 result도 버리지 않고, 어느 attempt와 generation의 결과인지 확인한 뒤 받아들입니다." },
] as const;

function Branch({ index, active }: { index: number; active: number }) {
  const item = BRANCHES[index];
  const on = index === active;
  const danger = index === 1;
  return (
    <div
      className={`min-w-0 rounded-lg border px-3 py-2.5 text-xs leading-5 transition-opacity motion-reduce:transition-none ${
        on ? (danger ? "border-red-600 bg-background" : "border-primary bg-background") : "border-border/60 opacity-45"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-bold text-muted-foreground">{item.tag}</span>
        <span className={`font-semibold ${on ? (danger ? "text-red-700 dark:text-red-400" : "text-primary") : "text-muted-foreground"}`}>{item.verdict}</span>
      </div>
      <p className="mt-1 break-words font-semibold">{item.title}</p>
      <p className="mt-0.5 break-words text-muted-foreground">{item.result}</p>
    </div>
  );
}

export default function TimeoutRetryViz() {
  return (
    <ToolSceneShell
      eyebrow="Timeout 갈래"
      title="Timeout 뒤에는 이미 생긴 effect부터 확인합니다"
      description="Timeout은 결과가 제때 오지 않았다는 사실일 뿐입니다. Call이 read인지 edit인지, 이미 바뀐 것이 있는지에 따라 다음 행동이 갈립니다. Idempotency key는 같은 operation을 다시 보내도 한 번만 적용되게 묶는 식별자입니다."
      ariaLabel="Read timeout, edit 반복, 모호한 완료, 일부 쓰기, 늦은 result의 다섯 갈래"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="rounded-lg border border-border bg-background px-3 py-2.5 text-xs leading-5">
            <p className="font-semibold">Timeout된 call</p>
            <p className="text-muted-foreground">먼저 묻는 질문: 이미 생긴 effect가 있는가?</p>
          </div>
          <div className="ml-4 h-4 w-px bg-border" aria-hidden />
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {BRANCHES.map((item, index) => (
              <Branch key={item.title} index={index} active={active} />
            ))}
            <div className="min-w-0 rounded-lg border border-dashed border-border/60 px-3 py-2.5 text-xs leading-5 text-muted-foreground">
              <p className="font-semibold">Patch 적용 횟수</p>
              <p className="mt-1 font-mono">{BRANCHES[active].count}</p>
            </div>
          </div>
        </div>
      )}
    />
  );
}
