import CompactionSceneShell from "./CompactionSceneShell";

/**
 * 본문 대응: #compact-pipeline "Recovery retry는 줄어드는 payload와 같은 요청 identity를 함께 지켜야 합니다".
 * 오류 문자열이 context overflow 계열이면 최근 보존량 4→2→1→0으로 최대 4 round 재시도.
 * Source: 두 번째 round 이후 제거할 message가 0이면 멈춤. 더 안전한 구현: 어느 round에서든 0이면 중단.
 */
const ROUNDS = [4, 2, 1, 0] as const;

const SCENES = [
  {
    label: "진입: 오류 문자열 분류",
    summary: "context overflow 계열?",
    round: -1,
    note: "Recovery는 정상 budget check가 아니라 실패 문자열을 보고 시작합니다. context_window, “no parseable body”, decode failure 같은 문자열도 context overflow 후보로 분류합니다. 오류가 window를 알려 주면 그 70%를 이후 threshold로 씁니다.",
  },
  {
    label: "Round 1",
    summary: "최근 4개 보존",
    round: 0,
    note: "최근 4개 message를 남기고 그 앞을 줄인 뒤 같은 요청을 다시 보냅니다. 또 context overflow로 실패하면 보존량을 줄여 다음 round로 갑니다.",
  },
  {
    label: "Round 2",
    summary: "최근 2개 보존",
    round: 1,
    note: "보존량이 2개로 줄어듭니다. Source는 두 번째 round 이후 제거할 message가 0이면 멈춥니다. 더 줄일 것이 없으면 같은 payload를 다시 보내는 셈이기 때문입니다.",
  },
  {
    label: "Round 3",
    summary: "최근 1개 보존",
    round: 2,
    note: "보존량이 1개입니다. 실패하면 마지막 round로 갑니다. retry 내내 원 user request와 session branch는 그대로 유지하고 permission 범위는 넓히지 않습니다.",
  },
  {
    label: "Round 4 뒤에도 실패",
    summary: "4→2→1→0 · 오류 반환",
    round: 3,
    note: "최근 원문을 하나도 남기지 않은 네 번째 시도까지 실패하면 더 반복하지 않습니다. 마지막 오류와 시도한 preserve schedule을 숨기지 않고 사용자에게 반환합니다.",
  },
] as const;

export default function RecoveryRetryViz() {
  return (
    <CompactionSceneShell
      eyebrow="Recovery 재시도"
      title="실패할 때마다 남기는 최근 message를 4→2→1→0으로 줄입니다"
      description="칸 하나가 retry round 하나이고, 칸 안 숫자는 원문으로 남기는 최근 message 개수입니다. 아래 두 줄은 ‘제거할 message가 0이면 멈춤’ 검사가 어느 round에 걸리는지 비교합니다."
      ariaLabel="CLI recovery의 4 round 재시도와 removed 0 중단 검사 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const entry = scene.round === -1;
        return (
          <div className="min-w-0 space-y-4">
            <div
              className={`rounded-md border px-3 py-2 text-xs leading-5 ${
                entry ? "border-[#2563eb] bg-blue-500/5" : "border-border bg-background"
              }`}
            >
              <span className="font-bold">오류 문자열</span> → context overflow 계열이면 진입
              <span className="block text-muted-foreground">
                아니면(인증·rate limit·permission 실패) 이 재시도를 반복하지 않는 편이 안전
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ROUNDS.map((keep, index) => {
                const done = !entry && index < scene.round;
                const current = index === scene.round;
                return (
                  <div
                    key={index}
                    className={`min-w-0 rounded-md border px-1 py-2 text-center ${
                      current
                        ? active === 4
                          ? "border-[#dc2626] bg-red-500/5"
                          : "border-[#2563eb] bg-blue-500/5"
                        : done
                          ? "border-border bg-muted/40"
                          : "border-dashed border-border/70"
                    }`}
                  >
                    <p className="text-[11px] text-muted-foreground">round {index + 1}</p>
                    <p className={`font-mono text-2xl font-bold ${current ? "text-foreground" : "text-muted-foreground"}`}>{keep}</p>
                    <p className="text-[11px] text-muted-foreground">개 보존</p>
                    <p className={`mt-1 text-[11px] font-semibold ${done ? "text-amber-700 dark:text-amber-300" : current && active === 4 ? "text-red-700 dark:text-red-400" : "text-transparent"}`}>
                      {done ? "실패 → 다음" : current && active === 4 ? "실패 → 반환" : "·"}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2 text-xs">
              {[
                { name: "Source", checks: [false, true, true, true], tail: "두 번째 round 이후" },
                { name: "더 안전한 구현", checks: [true, true, true, true], tail: "어느 round에서든" },
              ].map((row) => (
                <div key={row.name} className="grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2">
                  <span className="font-semibold">{row.name}</span>
                  <div className="grid grid-cols-4 gap-2">
                    {row.checks.map((check, index) => (
                      <span
                        key={index}
                        className={`rounded border px-1 py-1 text-center text-[11px] ${
                          check ? "border-[#0f766e] font-semibold text-teal-700 dark:text-teal-300" : "border-dashed border-border/70 text-muted-foreground"
                        } ${index === scene.round ? "ring-1 ring-[#2563eb]" : ""}`}
                      >
                        {check ? "0이면 멈춤" : "검사 없음"}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-[11px] leading-5 text-muted-foreground">
                ‘0이면 멈춤’ = 제거할 message가 0개라 더 줄여도 payload가 바뀌지 않으면 중단
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
