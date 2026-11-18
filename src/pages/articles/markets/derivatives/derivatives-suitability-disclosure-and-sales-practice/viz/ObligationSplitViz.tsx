import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case (3절) — 수출대금 1억 달러, 환율 상승 시 약정 환율 매도 의무 2억 달러(설명용 조건).
 * 초과분 = 2억 − 1억 = 1억 달러. 시장가 − 약정가 = 200원이면 1억 × 200원 = 200억 원(단순 차액).
 * 칸 하나 = 1억 달러.
 */
const EXPORT_USD = 1; // 억 달러
const OBLIGATION_USD = 2; // 억 달러
const EXCESS_USD = OBLIGATION_USD - EXPORT_USD; // 1억 달러
const GAP_KRW = 200; // 원/달러
const EXCESS_LOSS = EXCESS_USD * GAP_KRW; // 억 원

type Mode = "exposure" | "down" | "up" | "gap";

interface Scene {
  label: string;
  summary: string;
  note: string;
  mode: Mode;
}

const SCENES: readonly Scene[] = [
  { label: "실제 노출", summary: `한 달 뒤 수취 ${EXPORT_USD}억 달러`, mode: "exposure", note: "기업은 한 달 뒤 수출대금 1억 달러를 받을 예정이고, 원화 강세(환율 하락)를 걱정합니다." },
  { label: "환율이 내려가면", summary: "보호받는 쪽", mode: "down", note: "제안된 구조는 환율이 내려갈 때 기업을 보호합니다. 보호 금액과 조건은 이 설명용 사례에 적혀 있지 않아 칸으로 그리지 않았습니다." },
  { label: "환율이 오르면", summary: `매도 의무 ${OBLIGATION_USD}억 달러`, mode: "up", note: "환율이 오르면 2억 달러를 약정 환율로 팔아야 합니다. 수출대금으로 1억 달러를 덮고, 나머지 1억 달러는 시장에서 새로 사서 넘겨야 할 수 있습니다." },
  { label: "200원 차이", summary: `${EXCESS_USD}억 달러 × ${GAP_KRW}원 = ${EXCESS_LOSS}억 원`, mode: "gap", note: "달러당 시장가격이 약정가격보다 200원 높으면 초과 1억 달러에서 단순 차액은 200억 원입니다. 실제 금액은 관측일·배수·상한·중도 종료가격에 따라 달라집니다." },
];

function Block({ label, sub, tone }: { label: string; sub: string; tone: "export" | "covered" | "excess" | "empty" }) {
  const cls = {
    export: "border-sky-600 bg-sky-600/10",
    covered: "border-sky-600 bg-sky-600/10",
    excess: "border-dashed border-red-600 text-red-700 dark:text-red-400",
    empty: "border-dashed border-border/50 text-muted-foreground/60",
  }[tone];
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 text-center text-xs leading-5 ${cls}`}>
      <span className="block font-semibold">{label}</span>
      <span className="block">{sub}</span>
    </div>
  );
}

export default function ObligationSplitViz() {
  return (
    <SceneShell
      eyebrow="과다 헤지"
      title="받을 달러보다 팔 의무가 크면 남는 1억 달러는 시장에서 구해야 합니다"
      description="칸 하나가 1억 달러입니다. 실제 상품 조건이 아니라 3절의 설명용 월별 장부입니다(가정)."
      ariaLabel="수출대금 1억 달러와 환율 상승 시 매도 의무 2억 달러, 초과 1억 달러의 200원 차액"
      scenes={SCENES}
      render={(index) => {
        const { mode } = SCENES[index];
        const showObligation = mode === "up" || mode === "gap";
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">받을 달러</span>
              <Block label="수출대금" sub="1억 달러" tone="export" />
              <Block label="없음" sub="받을 달러 밖" tone="empty" />
            </div>
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">팔 의무</span>
              {showObligation ? (
                <>
                  <Block label="1억 달러" sub="수출대금으로 덮음" tone="covered" />
                  <Block label="1억 달러" sub="시장에서 사야 할 수 있음" tone="excess" />
                </>
              ) : (
                <div className="col-span-2 rounded-lg border border-dashed border-border/60 px-3 py-2 text-center text-xs leading-5 text-muted-foreground">
                  {mode === "down" ? "환율 하락: 보호받는 쪽 (금액 미기재)" : "환율 방향이 정해지기 전"}
                </div>
              )}
            </div>
            <div className={`rounded-lg border px-3 py-2 text-sm ${mode === "gap" ? "border-red-600" : "border-transparent"}`}>
              {mode === "gap" ? (
                <span className="font-mono">
                  초과 1억 달러 × (시장가 − 약정가) 200원 = <b className="text-red-700 dark:text-red-400">200억 원</b>
                </span>
              ) : (
                <span className="text-muted-foreground">&nbsp;</span>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
