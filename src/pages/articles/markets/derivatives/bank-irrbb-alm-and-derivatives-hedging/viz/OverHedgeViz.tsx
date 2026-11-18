import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — "예금이 예상보다 빨리 빠져나가면 명목 80의 스왑이 오히려 과해질 수 있다".
 * 예금 80: ±1%p → 예금 비용 ∓0.8, 스왑 변동 수취 ±0.8 → 순 0.
 * 예금 60(가정): +1%p → −0.6 + 0.8 = +0.2, −1%p → +0.6 − 0.8 = −0.2.
 * 예금금리와 스왑 기준금리가 같은 폭으로 움직인다는 3절의 설명용 가정을 그대로 씁니다.
 */
const NOTIONAL = 80;
const MAX_BALANCE = 100;

const SCENES = [
  { label: "예금 80 · 금리 +1%p", summary: "−0.8 + 0.8 = 0", deposit: 80, move: 1, note: "3절의 사례입니다. 예금 잔액과 스왑 명목금액이 모두 80이라 예금 비용 증가 0.8과 변동 수취 증가 0.8이 맞습니다." },
  { label: "예금 60 · 금리 +1%p", summary: "−0.6 + 0.8 = +0.2", deposit: 60, move: 1, note: "예금이 60으로 줄었다고 놓으면(가정) 예금 비용은 60×1% = 0.6만 늘지만 스왑 변동 수취는 명목 80 기준으로 여전히 0.8 늡니다. 남는 0.2는 상쇄가 아니라 스왑이 새로 만든 노출입니다." },
  { label: "예금 60 · 금리 −1%p", summary: "+0.6 − 0.8 = −0.2", deposit: 60, move: -1, note: "같은 상태에서 금리가 1%포인트 내리면 예금 비용은 0.6 줄지만 변동 수취는 0.8 줄어 순영향이 −0.2입니다. 예금 잔액보다 큰 스왑은 그 차이만큼 반대 방향의 금리 위험을 만들 수 있습니다." },
] as const;

function ChangeBar({ label, value, strong }: { label: string; value: number; strong: boolean }) {
  const width = Math.abs(value) * 50;
  const color = value < 0 ? "#dc2626" : "#16a34a";
  const text = Math.abs(value) < 1e-9 ? "0" : `${value > 0 ? "+" : "−"}${Math.abs(value).toFixed(1)}`;
  return (
    <div className="grid grid-cols-[6.75rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
        <span className="absolute inset-y-0 left-1/2 w-px bg-[#94a3b8]" />
        {width > 0 ? <span className="absolute inset-y-0 rounded-sm" style={{ width: `${width}%`, left: value < 0 ? `${50 - width}%` : "50%", backgroundColor: color }} /> : null}
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{text}</span>
    </div>
  );
}

export default function OverHedgeViz() {
  return (
    <SceneShell
      eyebrow="과한 헤지"
      title="예금이 줄었는데 스왑이 80 그대로면 상쇄가 새 위험이 됩니다"
      description="위 막대는 예금 잔액과 스왑 명목금액, 아래 막대는 금리 변화가 은행의 연간 이자 차이에 주는 영향입니다. 예금 60은 설명용 가정이며, 예금금리와 스왑 기준금리가 같은 폭으로 움직인다고 놓았습니다(가정)."
      ariaLabel="예금 잔액이 80에서 60으로 줄 때 명목 80 스왑의 과잉 헤지"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const depositEffect = (-scene.deposit * scene.move) / 100;
        const swapEffect = (NOTIONAL * scene.move) / 100;
        const net = depositEffect + swapEffect;
        return (
          <div className="min-w-0 space-y-4">
            <div className="space-y-2">
              {[
                { name: "예금 잔액", value: scene.deposit, color: "#d97706" },
                { name: "스왑 명목", value: NOTIONAL, color: "#2563eb" },
              ].map((row) => (
                <div key={row.name} className="grid grid-cols-[6.75rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">{row.name}</span>
                  <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                    <div className="h-full rounded-sm" style={{ width: `${(row.value / MAX_BALANCE) * 100}%`, backgroundColor: row.color }} />
                  </div>
                  <span className="text-right font-mono">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-border pt-3">
              <p className="text-[11px] text-muted-foreground">금리 {scene.move > 0 ? "+1%p" : "−1%p"}의 연간 영향 (왼쪽 = 이자 차이 줄어듦)</p>
              <ChangeBar label="예금 비용" value={depositEffect} strong={false} />
              <ChangeBar label="스왑 변동 수취" value={swapEffect} strong={false} />
              <ChangeBar label="순영향" value={net} strong />
            </div>
          </div>
        );
      }}
    />
  );
}
