import SceneShell from "./SceneShell";

/**
 * 본문 대응: #batch-verification — 무작위 계수가 없으면 오류끼리 상쇄되는 batch를 고를 수 있고,
 * batch FAIL은 어느 item인지 알려 주지 않아 VerifyVerbosely가 각 signature를 다시 Verify한다.
 * item 2·3의 +Δ·−Δ 오차는 상쇄를 보이려는 설명용 입력(가정)이다.
 */
type Mark = "ok" | "bad" | "unknown" | "none";

interface Item {
  name: string;
  error: string;
  weighted: string;
  check: Mark;
}

const ITEMS_TAMPERED: readonly Omit<Item, "check">[] = [
  { name: "item 1", error: "0", weighted: "r₁·0" },
  { name: "item 2", error: "+Δ", weighted: "r₂·(+Δ)" },
  { name: "item 3", error: "−Δ", weighted: "r₃·(−Δ)" },
];

const ITEMS_CLEAN: readonly Omit<Item, "check">[] = [
  { name: "item 1", error: "0", weighted: "r₁·0" },
  { name: "item 2", error: "0", weighted: "r₂·0" },
  { name: "item 3", error: "0", weighted: "r₃·0" },
];

interface SceneView {
  items: readonly Omit<Item, "check">[];
  weighted: boolean;
  combined: string;
  verdict: string;
  verdictTone: "pass" | "fail" | "warn";
  checks: readonly Mark[];
  calls: string;
}

const VIEWS: readonly SceneView[] = [
  { items: ITEMS_TAMPERED, weighted: false, combined: "합친 오차: 0 + Δ − Δ = 0", verdict: "합친 식이 참처럼 보임", verdictTone: "warn", checks: ["none", "none", "none"], calls: "batch 1회" },
  { items: ITEMS_TAMPERED, weighted: true, combined: "합친 오차: r₂Δ − r₃Δ = (r₂ − r₃)Δ", verdict: "r₂ ≠ r₃이면 오차가 남아 FAIL", verdictTone: "fail", checks: ["none", "none", "none"], calls: "batch 1회" },
  { items: ITEMS_TAMPERED, weighted: true, combined: "verifier가 받는 결과: FAIL 하나", verdict: "어느 item인지 알 수 없음", verdictTone: "fail", checks: ["unknown", "unknown", "unknown"], calls: "batch 1회" },
  { items: ITEMS_TAMPERED, weighted: true, combined: "fallback: 각 signature를 단일 Verify", verdict: "invalid item: 2, 3", verdictTone: "fail", checks: ["ok", "bad", "bad"], calls: "batch 1회 + 단일 Verify 3회" },
  { items: ITEMS_CLEAN, weighted: true, combined: "합친 오차: r₁·0 + r₂·0 + r₃·0 = 0", verdict: "batch PASS · 함께 받아들임", verdictTone: "pass", checks: ["none", "none", "none"], calls: "batch 1회" },
];

const SCENES = [
  {
    label: "가중치 없이 더하면 (가정)",
    summary: "+Δ와 −Δ가 지워짐",
    note: "무작위 계수가 없다고 가정합니다. 입력자가 item 2와 item 3에 서로 반대인 오차 +Δ, −Δ를 넣으면 합에서 오차가 사라져 둘 다 틀린 batch가 참인 관계처럼 보입니다.",
  },
  {
    label: "새 nonzero 계수를 곱하면",
    summary: "(r₂ − r₃)Δ가 남음",
    note: "Prysm은 verifier가 이번 호출에서 새로 뽑은 nonzero scalar r_i를 각 식에 곱합니다(BLST 호출은 randBitsEntropy=64). 입력자는 r_i를 미리 알 수 없어 서로 지워지는 오차를 고르기 어렵습니다.",
  },
  {
    label: "Batch FAIL",
    summary: "결과는 하나뿐",
    note: "세 식을 하나의 가중 관계로 합쳤으므로 결과도 참·거짓 하나입니다. Batch FAIL만으로는 어느 item이 잘못됐는지 알 수 없습니다.",
  },
  {
    label: "VerifyVerbosely fallback",
    summary: "단일 Verify 3회 추가",
    note: "SignatureBatch.VerifyVerbosely()는 batch가 실패하면 각 signature를 단일 Verify로 다시 확인해 설명과 invalid item을 모읍니다. 실패 원인을 찾지만 공격 입력에서는 이만큼 계산이 늘어납니다.",
  },
  {
    label: "모두 올바른 batch (가정)",
    summary: "batch PASS",
    note: "다른 입력으로, 세 signature가 모두 올바르다고 둡니다. Batch PASS는 묶인 관계를 함께 받아들일 근거이며 개별 Verify는 돌지 않습니다.",
  },
] as const;

const TONE: Record<SceneView["verdictTone"], string> = {
  pass: "border-[#16a34a] text-[#15803d]",
  fail: "border-[#dc2626] text-[#dc2626]",
  warn: "border-[#d97706] text-[#b45309]",
};

const MARK_TEXT: Record<Mark, string> = { ok: "Verify ✓", bad: "Verify ✗", unknown: "?", none: "" };
const MARK_CLASS: Record<Mark, string> = { ok: "text-[#15803d]", bad: "text-[#dc2626]", unknown: "text-muted-foreground", none: "" };

export default function BatchWeightViz() {
  return (
    <SceneShell
      eyebrow="무작위 가중 batch와 fallback"
      title="계수가 없으면 오차가 서로 지워지고, FAIL은 범인을 알려 주지 않습니다"
      description="칸 하나가 서로 다른 signing root의 독립 signature 식 하나입니다. Δ는 올바른 signature에서 벗어난 양을 뜻하는 설명용 오차(가정)이며 값은 정하지 않았습니다. 주황 테두리 칸은 오차를 넣은 item, 아래 판정 칸의 주황은 잘못된 PASS처럼 보이는 상태, 빨강은 FAIL, 초록은 PASS입니다."
      ariaLabel="무작위 계수가 없을 때 오차 상쇄, 계수를 곱했을 때 남는 오차, batch 실패 뒤 개별 검증 fallback을 다섯 장면으로 보여 줍니다"
      scenes={SCENES}
      render={(active) => {
        const view = VIEWS[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {view.items.map((item, index) => {
                const tampered = item.error !== "0";
                const mark = view.checks[index];
                return (
                  <div key={item.name} className={`min-w-0 rounded-lg border bg-background px-2 py-2 text-center ${tampered ? "border-[#d97706]" : "border-border"}`}>
                    <span className="block text-xs font-bold">{item.name}</span>
                    <span className="mt-1 block font-mono text-[11px] leading-5 sm:text-xs">오차 {item.error}</span>
                    <span className="block font-mono text-[11px] leading-5 text-muted-foreground sm:text-xs">{view.weighted ? item.weighted : "계수 없음"}</span>
                    <span className={`mt-1 block min-h-5 font-mono text-[11px] font-bold leading-5 sm:text-xs ${MARK_CLASS[mark]}`}>{MARK_TEXT[mark]}</span>
                  </div>
                );
              })}
            </div>
            <div className={`rounded-lg border bg-background px-3 py-2 ${TONE[view.verdictTone]}`}>
              <p className="font-mono text-xs leading-6 text-foreground">{view.combined}</p>
              <p className="text-sm font-bold leading-6">{view.verdict}</p>
            </div>
            <p className="font-mono text-xs text-muted-foreground">검증 호출: {view.calls}</p>
          </div>
        );
      }}
    />
  );
}
