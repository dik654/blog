import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 1,350×(1+0.03×0.25)÷(1+0.05×0.25) ≈ 1,343원.
 * 원화 길: 1,350원 × 1.0075 = 1,360.125원. 달러 길: 1달러 × 1.0125 = 1.0125달러.
 * 두 금액은 오늘 같은 값에서 출발했으므로 1달러 = 1,360.125 ÷ 1.0125 ≈ 1,343.3원, 현물보다 약 6.7원 낮다.
 */
const SPOT = 1350;
const KRW_RATE = 0.03;
const USD_RATE = 0.05;
const YEARS = 0.25;
const KRW_GROWTH = 1 + KRW_RATE * YEARS;
const USD_GROWTH = 1 + USD_RATE * YEARS;
const KRW_LATER = SPOT * KRW_GROWTH;
const FORWARD = KRW_LATER / USD_GROWTH;
const POINTS = FORWARD - SPOT;

const fmt = (value: number, digits: number) => value.toLocaleString("ko-KR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

const SCENES = [
  { label: "같은 출발점", summary: "오늘 1,350원 = 1달러", step: 0, note: "오늘 현물환율로는 1,350원과 1달러가 같은 값입니다. 이 같은 값을 원화로 석 달 두는 길과 달러로 바꿔 석 달 두는 길을 나란히 놓습니다." },
  { label: "원화로 석 달", summary: `1,350 × ${fmt(KRW_GROWTH, 4)} = ${fmt(KRW_LATER, 3)}원`, step: 1, note: "원화 금리 3%를 석 달(0.25년) 단리로 붙이면 3% × 0.25 = 0.75%가 붙어 1,350원은 1,360.125원이 됩니다." },
  { label: "달러로 석 달", summary: `1 × ${fmt(USD_GROWTH, 4)} = ${fmt(USD_GROWTH, 4)}달러`, step: 2, note: "같은 돈을 오늘 1달러로 바꿔 달러 금리 5%로 석 달 두면 5% × 0.25 = 1.25%가 붙어 1.0125달러가 됩니다." },
  { label: "석 달 뒤를 맞춤", summary: `${fmt(KRW_LATER, 3)} ÷ ${fmt(USD_GROWTH, 4)} ≈ ${fmt(FORWARD, 1)}원`, step: 3, note: `두 길의 끝 금액은 같은 출발점에서 나왔으므로 1.0125달러 = 1,360.125원으로 맞춥니다. 1달러로 나누면 약 ${fmt(FORWARD, 1)}원이고, 현물 1,350원보다 약 ${fmt(Math.abs(POINTS), 1)}원 낮습니다. 이 차이(선도환율 − 현물환율)를 6절에서 선도포인트라고 부릅니다. 설명용 단리 계산이며 실제 은행 호가는 매수·매도 차이, 신용 한도, 결제일과 통화 베이시스 때문에 다를 수 있습니다.` },
] as const;

function Lane({ title, start, rate, end, show, color }: { title: string; start: string; rate: string; end: string; show: boolean; color: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold" style={{ color }}>{title}</p>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)] items-center gap-2 text-center text-xs sm:text-sm">
        <div className="rounded-lg border border-border bg-background px-1 py-2 font-mono font-bold">{start}</div>
        <div className={`flex flex-col items-center leading-5 ${show ? "" : "opacity-30"}`}>
          <span className="text-[11px] text-muted-foreground sm:text-xs">{rate}</span>
          <svg viewBox="0 0 80 8" className="h-2 w-full max-w-[96px]" aria-hidden>
            <line x1={2} x2={72} y1={4} y2={4} stroke={color} strokeWidth={1.25} />
            <polygon points="72,0 80,4 72,8" fill={color} />
          </svg>
        </div>
        <div
          className={`whitespace-nowrap rounded-lg border px-0.5 py-2 font-mono text-[11px] font-bold sm:text-sm ${show ? "" : "border-dashed text-muted-foreground/60"}`}
          style={{ borderColor: show ? color : undefined }}
        >
          {show ? end : "?"}
        </div>
      </div>
    </div>
  );
}

export default function ForwardReplicationViz() {
  return (
    <SceneShell
      eyebrow="선도환율의 두 길"
      title="같은 돈을 원화로 두느냐 달러로 두느냐가 석 달 선도를 만듭니다"
      description="위는 원화로 석 달, 아래는 오늘 달러로 바꿔 석 달 두는 길입니다. 왼쪽 칸이 오늘, 오른쪽 칸이 석 달 뒤 금액이며 3절의 현물 1,350원·원화 3%·달러 5%를 단리로 씁니다."
      ariaLabel="원화와 달러 두 길의 석 달 뒤 금액을 맞춰 선도환율 약 1,343원을 구하는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)] gap-2 text-center text-[11px] text-muted-foreground sm:text-xs">
              <span>오늘</span>
              <span>석 달(0.25년)</span>
              <span>석 달 뒤</span>
            </div>
            <Lane title="원화 길 · 금리 3%" start="1,350원" rate="× 1.0075" end={`${fmt(KRW_LATER, 3)}원`} show={scene.step >= 1} color="#2563eb" />
            <Lane title="달러 길 · 금리 5%" start="1달러" rate="× 1.0125" end={`${fmt(USD_GROWTH, 4)}달러`} show={scene.step >= 2} color="#d97706" />
            <div className={`rounded-lg border px-3 py-2 text-center text-xs leading-6 sm:text-sm ${scene.step === 3 ? "border-[#16a34a]" : "border-dashed border-border/60 text-muted-foreground/60"}`}>
              {scene.step === 3 ? (
                <>
                  <span className="block font-mono font-bold">1.0125달러 = 1,360.125원 → 1달러 ≈ {fmt(FORWARD, 1)}원</span>
                  <span className="block">현물 1,350원과의 차이 ≈ −{fmt(Math.abs(POINTS), 1)}원 (선도포인트)</span>
                </>
              ) : (
                <>
                  <span className="block">두 길의 끝 금액을 맞추면</span>
                  <span className="block">석 달 뒤 1달러의 원화 가격이 나옵니다</span>
                </>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
