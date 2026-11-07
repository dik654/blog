import SceneShell from "./SceneShell";

/**
 * 본문 대응: #retry-idempotent — outcome=unknown 뒤의 세 갈래.
 * 같은 키는 보장이 있을 때 첫 결과를 재사용(10,000원 한 번), 새 키는 연결이 끊길 수 있음, 보장 미확인은 중단.
 */
type Entry = { key: string; result: string; dashed?: boolean; tone?: string };

const SCENES: readonly (
  { label: string; summary: string; note: string; request: string; requestKey: string; condition: string; panel: string; entries: Entry[]; outcome: string; outcomeTone: string }
)[] = [
  {
    label: "먼저 모른다고 기록합니다",
    summary: "outcome=unknown",
    note: "응답 없음은 unknown으로 적습니다. 조회가 빈 결과를 돌려줘도 미실행이라는 보장은 없습니다. (가정)",
    request: "order=42 · amount=10000",
    requestKey: "key=pay-42",
    condition: "첫 호출 · 응답 없음",
    panel: "요청 쪽에 보이는 것",
    entries: [{ key: "조회 결과", result: "일시적으로 비어 있을 수 있음", dashed: true }],
    outcome: "청구 결과 미확인",
    outcomeTone: "",
  },
  {
    label: "같은 키로 재요청",
    summary: "청구 10,000원 한 번",
    note: "서비스가 같은 키·같은 인자의 중복 실행 방지를 보장하고 키가 유효할 때 첫 결과가 재사용됩니다. (가정)",
    request: "order=42 · amount=10000",
    requestKey: "key=pay-42",
    condition: "보장 있음 · 키 유효",
    panel: "서버 기록",
    entries: [{ key: "pay-42", result: "10,000원 · 첫 결과 재사용" }],
    outcome: "10,000원 한 번",
    outcomeTone: "text-primary",
  },
  {
    label: "새 키로 재요청",
    summary: "연결이 끊길 수 있음",
    note: "새 키를 만들면 같은 업무라는 연결이 끊겨 청구가 한 번 더 남을 수 있습니다. (가정)",
    request: "order=42 · amount=10000",
    requestKey: "key=pay-43",
    condition: "새 키를 만듦",
    panel: "서버 기록",
    entries: [
      { key: "pay-42", result: "10,000원" },
      { key: "pay-43", result: "10,000원이 더 남을 수 있음", dashed: true, tone: "text-red-700 dark:text-red-400" },
    ],
    outcome: "20,000원이 될 수 있음",
    outcomeTone: "text-red-700 dark:text-red-400",
  },
  {
    label: "보장을 확인할 수 없으면",
    summary: "추가 청구 중단",
    note: "최대 2회라는 재시도 상한은 안전성을 대신하지 않습니다. 안전 조건을 만족하는 요청에만 적용합니다. (가정)",
    request: "보내지 않음",
    requestKey: "",
    condition: "보장 확인 불가",
    panel: "요청 쪽의 다음 행동",
    entries: [{ key: "다음 행동", result: "거래 상태 조회 또는 담당자 인계" }],
    outcome: "청구 추가 없음",
    outcomeTone: "",
  },
];

export default function SameKeyRetryViz() {
  return (
    <SceneShell
      eyebrow="재요청과 키"
      title="키를 유지하는지에 따라 서버의 기록이 달라질 수 있습니다"
      description="pay-42는 이 청구 업무를 가리키는 식별자입니다. 서버가 같은 업무로 알아보도록 함께 보내는 값이며, 아래 경우는 모두 가정입니다."
      ariaLabel="결과 미확인 뒤 같은 키, 새 키, 보장 미확인 세 경우의 서버 기록"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)] sm:items-stretch">
            <div className="rounded-lg border border-border bg-background p-2.5">
              <p className="text-xs font-bold text-muted-foreground">보내는 요청</p>
              <p className="mt-1 font-mono text-xs font-semibold leading-5">{scene.request}</p>
              <p className="min-h-5 font-mono text-xs font-semibold leading-5">{scene.requestKey}</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-primary">{scene.condition}</p>
            </div>
            <span className="hidden self-center text-center text-muted-foreground sm:block" aria-hidden="true">→</span>
            <div className="min-w-0 rounded-lg border border-border bg-background p-2.5">
              <p className="text-xs font-bold text-muted-foreground">{scene.panel}</p>
              <div className="mt-1 space-y-1">
                {scene.entries.map((entry) => (
                  <p key={entry.key} className={`rounded border px-2 py-1 text-xs leading-5 ${entry.dashed ? "border-dashed border-amber-600" : "border-border"} ${entry.tone ?? ""}`}>
                    <strong className="font-mono">{entry.key}</strong> {entry.result}
                  </p>
                ))}
              </div>
              <p className={`mt-2 text-sm font-bold leading-5 ${scene.outcomeTone}`}>{scene.outcome}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
