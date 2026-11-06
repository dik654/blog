import SceneShell from "./SceneShell";

/**
 * 본문 대응: #error-sampling-debugging — timeout 62%, invalid output 21%, tool failure 17%로 나누고(합 100%),
 * 늘어난 범주가 무엇이냐에 따라 원인 쪽이 갈리며, 그 범주의 trace를 열어 span을 확인한다.
 * “timeout이 가장 많이 늘었다”는 설명용 가정이다. queue time 확인은 본문 예시.
 */
const SHARES = [
  { name: "timeout", value: 62, color: "#2563eb" },
  { name: "invalid output", value: 21, color: "#d97706" },
  { name: "tool failure", value: 17, color: "#64748b" },
] as const;

const SCENES = [
  { label: "실패를 범주로 나눕니다", summary: "62 + 21 + 17 = 100%", note: "실패 요청 전체를 원인 범주로 나눕니다. Trace tree의 어느 span이 실패 status를 냈는지로 범주를 정합니다. 비율은 본문의 예입니다." },
  { label: "범주가 원인 쪽을 가릅니다", summary: "같은 실패율 2%, 다른 갈래", note: "같은 “실패율 2%”라도 어느 범주가 대부분이냐에 따라 조사할 쪽이 갈립니다." },
  { label: "그 범주의 trace를 엽니다", summary: "어느 span이 만들었나", note: "늘어난 범주의 trace를 열어 실패를 만든 span과 시점을 확인합니다. 이 범주는 sampling rate와 무관하게 열람할 수 있어야 합니다. 아래는 timeout이 늘었다는 가정입니다." },
] as const;

export default function ErrorTriageViz() {
  return (
    <SceneShell
      eyebrow="실패를 좁히는 순서"
      title="어떤 종류가 늘었는지 먼저 좁히고, 그다음 trace에서 span을 찾습니다"
      description="Error classification은 실패 요청을 원인별 범주로 나누는 절차입니다. 막대 길이는 비율에 비례합니다."
      ariaLabel="실패를 범주로 나누고 범주에 따라 원인 쪽을 가른 뒤 trace를 열어 span을 찾는 순서"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-3">
          <div className="flex h-8 w-full overflow-hidden rounded-sm border border-border/70">
            {SHARES.map((share) => (
              <div key={share.name} style={{ width: `${share.value}%`, backgroundColor: share.color, opacity: active === 0 || share.name === "timeout" ? 0.8 : 0.25 }} className="flex items-center justify-center text-xs font-bold text-white">
                {share.value}%
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
            {SHARES.map((share) => (
              <p key={share.name} className="flex items-center gap-1.5">
                <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 shrink-0" aria-hidden="true"><rect width={10} height={10} fill={share.color} /></svg>
                {share.name} {share.value}%
              </p>
            ))}
          </div>
          {active === 1 && (
            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <p className="rounded border border-border bg-background p-2 break-keep"><strong>timeout이 대부분</strong>(이 막대) → queue·GPU 쪽</p>
              <p className="rounded border border-border bg-background p-2 break-keep"><strong>invalid output이 대부분</strong>(다른 분포) → model·prompt 쪽</p>
            </div>
          )}
          {active === 2 && (
            <div className="rounded border border-border bg-background p-2 text-xs leading-5">
              <p className="font-bold">sampled trace · timeout 범주</p>
              <p className="mt-1 pl-3 text-muted-foreground">request span</p>
              <p className="pl-6 font-semibold text-primary">└ 시작 구간 queue time 증가 ← 여기서 확인</p>
            </div>
          )}
        </div>
      )}
    />
  );
}
