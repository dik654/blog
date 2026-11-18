import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism (7절) — 노출 확인 → 계산·비교 → 설명 → 되짚기
 * → 이해 부족이면 다시 설명 또는 권유 중단 / 충분하면 기록·승인·주문 → 실제 노출이 줄면 계약 규모 재검토.
 */
const STEPS = [
  { key: "check", title: "① 노출 확인", body: "수출계약 · 입금 통화 · 시점 · 취소 가능성 · 기존 헤지" },
  { key: "calc", title: "② 계산과 비교", body: "여러 환율에서 월별 최대 의무 · 중도 종료 손실 · 담보 요구 → 단순 선도 · 옵션 매수와 비교" },
  { key: "explain", title: "③ 설명", body: "계산한 시나리오와 대안의 차이를 전달" },
  { key: "recap", title: "④ 고객의 되짚기", body: "환율 상승 때 왜 2억 달러를 팔 수 있는지 · 필요한 현금" },
  { key: "record", title: "⑤ 기록 · 승인 · 주문", body: "상담 자료 · 확인 결과 · 승인 · 주문 보관" },
] as const;

type Key = (typeof STEPS)[number]["key"] | "branch" | "review";

const SCENES: readonly { label: string; summary: string; note: string; on: readonly Key[] }[] = [
  { label: "실제 노출부터", summary: "받을 달러가 얼마나 확실한가", on: ["check"], note: "담당자는 먼저 수출계약·입금 통화·시점·취소 가능성과 이미 걸어 둔 헤지를 확인합니다." },
  { label: "여러 환율에서 계산", summary: "최대 의무 · 중도 종료 · 담보", on: ["calc"], note: "제안 상품의 월별 최대 의무와 중도 종료 손실, 담보 요구를 여러 환율에서 계산하고 단순 선도·옵션 매수와 비교합니다." },
  { label: "설명하고 되짚게 함", summary: "고객 담당자의 말로", on: ["explain", "recap"], note: "설명 뒤에는 고객 담당자가 환율 상승 때 왜 2억 달러를 팔 수 있는지와 필요한 현금을 자기 말로 되짚게 합니다." },
  { label: "이해가 부족하면", summary: "다시 설명 ↺ 또는 권유 중단", on: ["branch"], note: "되짚기에서 이해가 부족하면 ③으로 돌아가 다시 설명하거나, 권유를 중단합니다." },
  { label: "이해했으면 기록", summary: "자료 · 확인 결과 · 승인 · 주문", on: ["record"], note: "상담 자료와 확인 결과, 승인과 주문을 보관합니다. 6절의 판매 과정의 증거가 여기서 만들어집니다." },
  { label: "판매 뒤에도", summary: "노출 감소 → 규모 재검토", on: ["review"], note: "실제 노출이 줄면 계약 규모도 다시 검토합니다." },
];

export default function SalesProcessLoopViz() {
  return (
    <SceneShell
      eyebrow="환헤지 상담 한 건"
      title="되짚기에서 막히면 다시 설명하거나 권유를 멈춥니다"
      description="위에서 아래로 7절의 업무 순서입니다. ④ 아래 점선 칸은 이해가 부족할 때의 두 길, 맨 아래는 판매 뒤 되돌아가는 점검입니다."
      ariaLabel="노출 확인, 계산과 비교, 설명, 되짚기, 이해 부족 시 재설명 또는 권유 중단, 기록과 주문, 판매 뒤 규모 재검토"
      scenes={SCENES}
      render={(index) => {
        const on = SCENES[index].on;
        const cls = (key: Key) => (on.includes(key) ? "border-primary bg-primary/10" : "border-border/60 text-muted-foreground");
        return (
          <div className="min-w-0 space-y-1.5">
            {STEPS.map((step) => (
              <div key={step.key}>
                <div className={`rounded-lg border px-3 py-1.5 text-xs leading-5 ${cls(step.key)}`}>
                  <span className="font-semibold text-foreground">{step.title}</span>
                  <span className="ml-2">{step.body}</span>
                </div>
                {step.key === "recap" ? (
                  <div className={`mt-1.5 grid grid-cols-2 gap-1.5 rounded-lg border border-dashed px-2 py-1.5 text-[11px] leading-5 sm:text-xs ${on.includes("branch") ? "border-amber-600" : "border-border/60 text-muted-foreground"}`}>
                    <span className={on.includes("branch") ? "font-semibold text-amber-700 dark:text-amber-400" : ""}>이해 부족 → ↺ ③ 다시 설명</span>
                    <span className={on.includes("branch") ? "font-semibold text-red-700 dark:text-red-400" : ""}>이해 부족 → 권유 중단</span>
                  </div>
                ) : null}
              </div>
            ))}
            <div className={`rounded-lg border border-dashed px-3 py-1.5 text-xs leading-5 ${cls("review")}`}>
              <span className="font-semibold text-foreground">판매 뒤</span>
              <span className="ml-2">실제 노출이 줄면 → ↺ 계약 규모 재검토</span>
            </div>
          </div>
        );
      }}
    />
  );
}
