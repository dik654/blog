import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need (5절) — 같은 2억 달러 매도 의무를
 * 월 10억 달러 확정 수출대금 기업과 월 1억 달러 불확실 주문 기업에 붙입니다.
 * 2억 ÷ 10억 = 20%, 2억 ÷ 1억 = 200% → 초과 1억 달러.
 * 가로축 끝 = 10억 달러.
 */
const AXIS_MAX = 10; // 억 달러
const CONTRACT = 2; // 억 달러

const FIRMS = [
  { name: "A 기업", exposure: 10, certain: true, tag: "월 10억 달러 · 확정" },
  { name: "B 기업", exposure: 1, certain: false, tag: "월 1억 달러 · 불확실" },
] as const;

const SCENES: readonly { label: string; summary: string; show: readonly boolean[]; note: string }[] = [
  { label: "확정 수출대금 10억 달러", summary: "2억 ÷ 10억 = 20%", show: [true, false], note: "확정된 수출대금 10억 달러 안에 2억 달러 의무가 들어갑니다. 환율이 올라도 팔 달러를 받을 돈에서 낼 수 있습니다." },
  { label: "불확실한 주문 1억 달러", summary: "2억 ÷ 1억 = 200% · 초과 1억", show: [false, true], note: "같은 2억 달러 의무가 받을 돈의 두 배입니다. 1억 달러는 처음부터 받을 돈 밖에 있고, 주문이 불확실하니 1억 달러 칸 자체도 확정이 아닙니다(점선)." },
  { label: "같은 계약, 다른 감당", summary: "20% vs 200%", show: [true, true], note: "상품은 같아도 고객의 실제 노출이 달라 감당 능력이 다릅니다. 위험등급만 보고 적합한 고객을 자동 판정할 수 없는 이유입니다." },
];

const pct = (v: number) => `${(v / AXIS_MAX) * 100}%`;

function FirmRow({ firm, visible }: { firm: (typeof FIRMS)[number]; visible: boolean }) {
  const over = Math.max(0, CONTRACT - firm.exposure);
  const covered = CONTRACT - over;
  return (
    <div className={`space-y-1 ${visible ? "" : "opacity-20"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
        <span className="font-semibold">{firm.name}</span>
        <span className="text-muted-foreground">{firm.tag}</span>
      </div>
      <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-2 text-[11px] sm:text-xs">
        <span className="text-muted-foreground">받을 돈</span>
        <div className="relative h-4 rounded-sm bg-muted/40">
          <div
            className={`absolute inset-y-0 left-0 rounded-sm border ${firm.certain ? "border-sky-600 bg-sky-600/30" : "border-dashed border-sky-600 bg-sky-600/10"}`}
            style={{ width: pct(firm.exposure) }}
          />
        </div>
        <span className="text-muted-foreground">팔 의무</span>
        <div className="relative h-4 rounded-sm bg-muted/40">
          <div className="absolute inset-y-0 left-0 rounded-sm bg-slate-500" style={{ width: pct(covered) }} />
          {over > 0 ? (
            <div className="absolute inset-y-0 rounded-sm border border-dashed border-red-600 bg-red-600/20" style={{ left: pct(covered), width: pct(over) }} />
          ) : null}
        </div>
      </div>
      <p className="text-right text-xs">
        {over > 0 ? <span className="text-red-700 dark:text-red-400">초과 {over}억 달러</span> : <span>받을 돈 안에 들어감</span>}
      </p>
    </div>
  );
}

export default function ExposureFitViz() {
  return (
    <SceneShell
      eyebrow="같은 2억 달러 계약"
      title="같은 계약도 받을 돈이 얼마냐에 따라 무게가 달라집니다"
      description="두 막대 모두 가로축 끝이 10억 달러입니다. 팔 의무는 환율이 오를 때의 2억 달러(3절의 설명용 조건)이고, 빨간 점선은 받을 돈을 넘는 부분입니다."
      ariaLabel="월 10억 달러 확정 수출 기업과 월 1억 달러 불확실 주문 기업에 같은 2억 달러 매도 의무를 붙인 비교"
      scenes={SCENES}
      render={(index) => (
        <div className="min-w-0 space-y-4">
          {FIRMS.map((firm, i) => (
            <FirmRow key={firm.name} firm={firm} visible={SCENES[index].show[i]} />
          ))}
          {/* 눈금은 막대와 같은 열에 둬 0이 막대 시작점 바로 아래에 오게 합니다. */}
          <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2 font-mono text-[11px] text-muted-foreground">
            <span />
            <div className="flex justify-between border-t border-border pt-0.5">
              <span>0</span>
              <span>10억 달러</span>
            </div>
          </div>
        </div>
      )}
    />
  );
}
