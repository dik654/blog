import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 첫 문단 — 현물 −2%, 선물 −1.6%인 하루.
 * 재고 1억 × 2% = 200만 원 손실.
 * 32계약: 명목 32 × 250만 = 8,000만 × 1.6% = 128만 이익 → 남은 손실 72만.
 * 40계약: 명목 40 × 250만 = 1억 × 1.6% = 160만 이익 → 남은 손실 40만.
 */
const INVENTORY = 10000;
const CONTRACT_VALUE = 250;
const SPOT_MOVE = 0.02;
const FUTURES_MOVE = 0.016;
const SCALE = 200;

const SCENES = [
  { label: "재고만 있을 때", summary: "1억 × 2% = 200만 원 손실", contracts: 0, note: "현물이 2% 떨어지면 1억 원어치 재고에서 200만 원을 잃습니다. 아직 선물을 팔지 않았으므로 이 손실이 그대로 남습니다." },
  { label: "선물 32계약 매도", summary: "−200 + 128 = −72만 원", contracts: 32, note: "32계약의 선물 명목은 32 × 250만 = 8,000만 원입니다. 선물이 1.6% 떨어지면 매도 쪽에서 128만 원을 벌어 72만 원의 손실이 남습니다." },
  { label: "선물 40계약 매도", summary: "−200 + 160 = −40만 원", contracts: 40, note: "40계약이면 명목이 1억 원이라 선물 이익이 160만 원이고 남은 손실은 40만 원입니다. 이 하루만 보면 40계약이 더 작게 남깁니다. 하지만 수량은 하루가 아니라 표본 전체의 흔들림으로 정합니다(다음 그림)." },
] as const;

function Row({ label, value, strong = false }: { label: string; value: number | null; strong?: boolean }) {
  const width = value === null ? 0 : (Math.abs(value) / SCALE) * 50;
  const color = value !== null && value < 0 ? "#dc2626" : "#16a34a";
  const text = value === null ? "−" : value === 0 ? "0" : `${value > 0 ? "+" : "−"}${Math.abs(value)}만`;
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_3.75rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
        <span className="absolute inset-y-0 left-1/2 w-px bg-[#94a3b8]" />
        {width > 0 ? <span className="absolute inset-y-0 rounded-sm" style={{ width: `${width}%`, left: value !== null && value < 0 ? `${50 - width}%` : "50%", backgroundColor: color }} /> : null}
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{text}</span>
    </div>
  );
}

export default function HedgeDayViz() {
  return (
    <SceneShell
      eyebrow="하루 장부"
      title="같은 하락일에 32계약과 40계약이 남기는 손실"
      description="막대는 현물 −2%, 선물 −1.6%인 4절의 하루에서 각 칸의 손익(만 원)입니다. 가운데 선 왼쪽이 손실, 오른쪽이 이익이고, 계약 하나의 가치는 250만 원입니다."
      ariaLabel="재고 1억 원이 2퍼센트 떨어진 날 선물 32계약과 40계약 매도 뒤 남는 손실 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const inventory = -INVENTORY * SPOT_MOVE;
        const notional = scene.contracts * CONTRACT_VALUE;
        const futures = Math.round(notional * FUTURES_MOVE);
        const residual = inventory + futures;
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-center text-xs leading-5">
              <div className="rounded-lg border border-border px-2 py-2">
                <span className="block text-muted-foreground">재고 가치</span>
                <span className="block font-mono font-semibold">1억 원</span>
              </div>
              <div className={`rounded-lg border px-2 py-2 ${scene.contracts > 0 ? "border-border" : "border-dashed border-border/50"}`}>
                <span className="block text-muted-foreground">선물 매도 명목</span>
                <span className={`block font-mono font-semibold ${scene.contracts > 0 ? "" : "text-muted-foreground/60"}`}>
                  {scene.contracts > 0 ? `${scene.contracts} × 250만 = ${notional.toLocaleString("ko-KR")}만` : "아직 없음"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Row label="재고 (−2%)" value={inventory} />
              <Row label="선물 매도 (−1.6%)" value={scene.contracts > 0 ? futures : null} />
              <Row label="남은 손익" value={residual} strong />
            </div>
          </div>
        );
      }}
    />
  );
}
