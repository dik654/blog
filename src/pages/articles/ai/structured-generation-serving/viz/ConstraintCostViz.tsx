import SceneShell from "./SceneShell";

/**
 * 본문 대응: #constraint-overhead — vocabulary 32,000개면 순진하게는 step마다 최대 32,000번 전이 검사,
 * 미리 compile하면 decoding 중에는 전이표 조회만 하고 매 step 비용이 compile 1회 비용으로 옮겨 간다.
 * Step 4개는 가정. 누적 최대 검사 = 32,000 × step 수 → 32,000 · 64,000 · 96,000 · 128,000.
 * Compile 1회 비용과 조회 비용은 본문에 수치가 없어 크기를 그리지 않습니다.
 */
const VOCAB = 32_000;
const STEPS = [1, 2, 3, 4] as const;

const SCENES = [
  {
    label: "순진한 방식 · step 1",
    summary: "최대 32,000번 전이 검사",
    note: "Decoding step은 token 하나를 고르는 한 번의 생성입니다. 미리 compile하지 않으면 matcher가 이번 step에서 vocabulary 32,000개 token 각각이 유효한 다음 token인지 FSM 상태 전이로 검사해 mask를 만듭니다.",
  },
  {
    label: "순진한 방식 · step이 쌓이면",
    summary: "4 step → 최대 128,000번",
    note: "같은 검사가 step마다 반복됩니다. 그림의 4 step은 가정이고, 누적 최대 검사 수는 32,000 × 4 = 128,000번입니다. 생성이 길수록 이 합이 계속 커집니다.",
  },
  {
    label: "미리 compile",
    summary: "검사를 compile 1회로 옮김",
    note: "Token 전이를 decoding 전에 한 번 compile해 두면 각 step에서는 전이표를 조회만 합니다. 비용이 사라진 것이 아니라 매 step에서 compile 시점의 1회로 옮겨 갔습니다. Compile 1회의 크기는 본문에 수치가 없어 그리지 않았습니다.",
  },
] as const;

const fmt = (n: number) => n.toLocaleString("en-US");

export default function ConstraintCostViz() {
  return (
    <SceneShell
      eyebrow="constraint overhead"
      title="매 step 검사가 compile 한 번으로 옮겨 가는 모습"
      description="가로로 decoding step이 흐릅니다. 위 줄은 미리 compile하지 않은 방식, 아래 줄은 미리 compile한 방식이며 step 4개는 가정입니다."
      ariaLabel="vocabulary 32,000개에서 step마다 전이 검사를 반복하는 방식과 compile 뒤 조회만 하는 방식 비교"
      scenes={SCENES}
      render={(active) => {
        const naiveShown = active === 0 ? 1 : 4;
        const total = VOCAB * naiveShown;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[3rem_repeat(5,minmax(0,1fr))] gap-1 text-center text-[10px] leading-4 sm:grid-cols-[5rem_repeat(5,minmax(0,1fr))] sm:text-xs">
              <span />
              <span className="text-muted-foreground">decoding 전</span>
              {STEPS.map((s) => (
                <span key={s} className="text-muted-foreground">step {s}</span>
              ))}

              <span className="self-center text-left font-semibold">순진</span>
              <div className="rounded-md border border-dashed border-border/50 px-1 py-2 text-muted-foreground/60">없음</div>
              {STEPS.map((s) => {
                const on = s <= naiveShown;
                return (
                  <div key={s} className={`min-w-0 rounded-md border px-0.5 py-2 ${on ? "border-amber-600 bg-amber-500/10" : "border-dashed border-border/50 text-muted-foreground/50"}`}>
                    {on ? (
                      <>
                        <span className="block whitespace-nowrap font-mono text-[9px] font-bold sm:text-xs">≤{fmt(VOCAB)}</span>
                        <span className="block">검사</span>
                      </>
                    ) : (
                      "·"
                    )}
                  </div>
                );
              })}

              <span className="self-center text-left font-semibold">미리 compile</span>
              <div className={`min-w-0 rounded-md border px-0.5 py-2 ${active === 2 ? "border-primary bg-primary/10 font-semibold" : "border-dashed border-border/50 text-muted-foreground/50"}`}>
                {active === 2 ? (
                  <>
                    <span className="block">전이표</span>
                    <span className="block">compile</span>
                    <span className="block">1회</span>
                  </>
                ) : (
                  "·"
                )}
              </div>
              {STEPS.map((s) => (
                <div key={s} className={`min-w-0 rounded-md border px-0.5 py-2 ${active === 2 ? "border-primary/60" : "border-dashed border-border/50 text-muted-foreground/50"}`}>
                  {active === 2 ? (
                    <>
                      <span className="block font-semibold">표 조회</span>
                      <span className="block text-muted-foreground">검사 없음</span>
                    </>
                  ) : (
                    "·"
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] leading-4 sm:text-xs">
              <div className="rounded-md border border-border px-2 py-1.5">
                <p className="text-muted-foreground">순진한 방식 누적 최대 검사</p>
                <p className="font-mono font-bold">{fmt(VOCAB)} × {naiveShown} = {fmt(total)}</p>
              </div>
              <div className={`rounded-md border px-2 py-1.5 ${active === 2 ? "border-primary/60" : "border-border"}`}>
                <p className="text-muted-foreground">미리 compile한 방식</p>
                <p className="font-bold">{active === 2 ? "decoding 중 전이 검사 대신 조회" : "−"}</p>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
