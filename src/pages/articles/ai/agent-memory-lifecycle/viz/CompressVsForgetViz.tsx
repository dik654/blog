import SceneShell from "./SceneShell";

/**
 * 본문 대응: #lifecycle — compression은 tool log 100개를 20개 요약 문장으로 손실 압축해 남기고,
 * forgetting은 만료·철회된 기억 5건을 완전히 지워 복원 대상에서 제외한다.
 * 압축한 기억은 원문을 다시 열어 검증할 여지가 남지만 잊은 기억에는 그 여지가 없다.
 */
const LOGS = 100;
const SUMMARIES = 20;
const EXPIRED = 5;

const SCENES = [
  {
    label: "줄일 대상 두 묶음",
    summary: `tool log ${LOGS}개 · 만료·철회 기억 ${EXPIRED}건`,
    note: "왼쪽은 긴 tool log 100개, 오른쪽은 만료되거나 사용자가 동의를 철회한 기억 5건입니다. 둘 다 ‘줄이기’ 대상처럼 보이지만 다음 두 장면의 연산이 다릅니다.",
  },
  {
    label: "Compression",
    summary: `${LOGS}개 → 요약 ${SUMMARIES}문장`,
    note: "Compression은 100개를 20개 요약 문장으로 줄여 손실된 형태로나마 남깁니다. 흐리게 남은 칸처럼 원문을 다시 열어 요약이 맞는지 검증할 여지가 남습니다.",
  },
  {
    label: "Forgetting",
    summary: `${EXPIRED}건 → 0건 · 복원 대상 아님`,
    note: "Forgetting은 5건을 완전히 지워 복원 대상에서 뺍니다. 빈 칸에는 다시 열 원문이 없습니다. 그래서 forgetting 대상은 expiry나 동의 철회처럼 되돌릴 필요가 없는 항목으로 좁힙니다.",
  },
] as const;

function Cell({ tone }: { tone: "log" | "faded" | "summary" | "memory" | "gone" }) {
  const cls = {
    log: "border-slate-500 bg-slate-400/40",
    faded: "border-slate-400/40 bg-transparent",
    summary: "border-blue-600 bg-blue-500/40",
    memory: "border-amber-600 bg-amber-500/40",
    gone: "border-dashed border-slate-400/50 bg-transparent",
  }[tone];
  return <span className={`block aspect-square rounded-[2px] border ${cls}`} />;
}

export default function CompressVsForgetViz() {
  return (
    <SceneShell
      eyebrow="Compression vs forgetting"
      title="압축은 원문을 다시 열 길을 남기고, 잊기는 그 길까지 지웁니다"
      description="칸 하나가 log 한 개, 요약 한 문장 또는 기억 한 건입니다. 숫자는 본문의 예시 그대로입니다."
      ariaLabel="tool log 100개를 요약 20문장으로 압축하는 것과 만료된 기억 5건을 지우는 것의 차이"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <p className="text-xs font-semibold">긴 tool log</p>
            <div className="mt-2 grid gap-[3px]" style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }} aria-hidden="true">
              {Array.from({ length: LOGS }, (_, i) => (
                <Cell key={i} tone={active === 1 ? "faded" : "log"} />
              ))}
            </div>
            <div className="mt-3 grid gap-[3px]" style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }} aria-hidden="true">
              {Array.from({ length: SUMMARIES }, (_, i) => (
                <span key={i} className={active === 1 ? "" : "invisible"}>
                  <Cell tone="summary" />
                </span>
              ))}
            </div>
            <p className={`mt-2 text-xs leading-5 ${active === 1 ? "text-blue-700 dark:text-blue-400" : "invisible"}`}>
              요약 20문장 · 원문을 다시 열어 검증할 여지 있음
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold">만료·철회된 기억</p>
            <div className="mt-2 grid max-w-[10rem] gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }} aria-hidden="true">
              {Array.from({ length: EXPIRED }, (_, i) => (
                <Cell key={i} tone={active === 2 ? "gone" : "memory"} />
              ))}
            </div>
            <p className={`mt-2 text-xs leading-5 ${active === 2 ? "text-amber-700 dark:text-amber-400" : "invisible"}`}>
              0건 · 다시 열 원문 없음
            </p>
          </div>
        </div>
      )}
    />
  );
}
