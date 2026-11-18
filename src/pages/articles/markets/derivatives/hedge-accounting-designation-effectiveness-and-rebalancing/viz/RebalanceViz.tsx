import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 차입 100억·스왑 80억(80%) → 조기상환으로 차입 50억, 스왑 80억이면 160%
 * → 목적이 유지되면 지정 수량을 50억에 맞추는 재조정, 목적이 끝났으면 중단 판단(5·6·7절, 용어 정리).
 * 금리 +1%p 단순 계산(억 원): 시작 차입 +1.0·스왑 +0.8 → 순 +0.2 / 상환 뒤 차입 +0.5·스왑 +0.8 → 순 −0.3.
 * 재조정은 지정만 바꾸므로 스왑 80억의 현금 수취는 그대로(지정 0.5 + 지정 밖 0.3). 남는 30억의 처리는 본문에 없다.
 */
const SHOCK = 0.01;

const SCENES = [
  {
    label: "시작: 80% 지정",
    summary: "스왑 80 ÷ 차입 100 = 80%",
    loan: 100, designated: 80, outside: 0, ended: false, branch: "none",
    note: "차입 100억 원의 기준금리 위험 중 80%를 스왑 80억 원으로 줄인다고 지정했습니다. 금리가 1%포인트 오르면 차입 이자는 1억 원, 스왑 수취는 8,000만 원 늘어 회사 순부담은 2,000만 원 늘어납니다.",
  },
  {
    label: "조기상환: 차입 50억",
    summary: "스왑 80 ÷ 차입 50 = 160%",
    loan: 50, designated: 80, outside: 0, ended: false, branch: "none",
    note: "차입이 50억 원으로 줄었는데 스왑은 80억 원 그대로입니다. 금리가 1%포인트 오르면 차입 이자는 5,000만 원 늘지만 스왑 수취는 8,000만 원 늘어, 회사는 오히려 3,000만 원 이익을 봅니다. 금리가 내리면 반대로 손실입니다. 헤지 대상 밖의 30억 원이 새 금리 방향을 만든 것입니다.",
  },
  {
    label: "목적 유지 → 재조정",
    summary: "지정 스왑 50 ↔ 차입 50",
    loan: 50, designated: 50, outside: 30, ended: false, branch: "rebalance",
    note: "위험관리 목적이 그대로이고 경제적 관계가 이어지면 지정 수량을 50억 원에 맞추는 재조정을 검토합니다. 재조정은 회계상 지정 수량을 바꾸는 일이라 스왑 80억 원의 현금 수취 자체는 그대로이고, 지정에서 빠진 30억 원은 관계 밖에 남습니다. 그 30억 원을 어떻게 할지는 본문이 다루지 않습니다.",
  },
  {
    label: "목적 종료 → 중단 판단",
    summary: "재조정이 아니라 중단을 따로 판단",
    loan: 50, designated: 80, outside: 0, ended: true, branch: "discontinue",
    note: "위험관리 목적 자체가 끝났거나 대상 거래가 더는 예상되지 않으면 재조정 이름으로 관계를 잇지 않습니다. 헤지회계 중단 문제를 따로 판단하고, 중단 시점과 누적 금액의 후속 회계 처리를 기록합니다.",
  },
] as const;

const SCALE = 100;
const eok = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${Number(Math.abs(value).toFixed(2))}억`;

function QtyBar({ label, value, color, dashed = false, muted = false }: { label: string; value: number; color: string; dashed?: boolean; muted?: boolean }) {
  return (
    <div className={`grid grid-cols-[5.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:text-sm ${muted ? "opacity-40" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div
          className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${(value / SCALE) * 100}%`, backgroundColor: dashed ? "transparent" : color, border: dashed && value > 0 ? `1px dashed ${color}` : undefined }}
        />
      </div>
      <span className="text-right font-mono">{value}억</span>
    </div>
  );
}

export default function RebalanceViz() {
  return (
    <SceneShell
      eyebrow="헤지비율 재조정"
      title="차입이 줄면 160%가 되고, 목적에 따라 재조정과 중단이 갈립니다"
      description="막대 길이는 금액(억 원)이고 가장 긴 칸이 100억 원입니다. 아래 숫자는 기준금리가 1%포인트 오를 때의 연 이자 변화이며, 날짜·이자 계산 방식 차이를 뺀 단순 계산입니다."
      ariaLabel="차입 100억과 스왑 80억에서 차입 50억으로 줄 때 160퍼센트, 재조정과 중단의 갈림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const loanUp = scene.loan * SHOCK;
        const swapUp = (scene.designated + scene.outside) * SHOCK;
        const net = loanUp - swapUp;
        return (
          <div className="min-w-0 space-y-4">
            <div className="space-y-2">
              <QtyBar label="차입(대상)" value={scene.loan} color="#475569" />
              <QtyBar label={scene.outside > 0 ? "지정 스왑" : "스왑"} value={scene.designated} color="#2563eb" muted={scene.ended} />
              <QtyBar label="지정 밖 스왑" value={scene.outside} color="#d97706" dashed muted={scene.outside === 0} />
            </div>
            <div className="rounded-lg border border-border px-3 py-2 font-mono text-xs leading-6 sm:text-sm">
              <p className="text-muted-foreground">금리 +1%p일 때 연 이자 변화</p>
              <p>차입 이자 {eok(loanUp)} · 스왑 수취 {eok(swapUp)}{scene.outside > 0 ? ` (지정 ${eok(scene.designated * SHOCK)} + 밖 ${eok(scene.outside * SHOCK)})` : ""}</p>
              <p className={`font-bold ${net < 0 ? "text-amber-700 dark:text-amber-400" : ""}`}>
                회사 순부담 {eok(net)}{net < 0 ? " · 금리가 오르면 이익, 내리면 손실" : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs leading-5">
              <div className={`rounded-lg border px-2 py-2 ${scene.branch === "rebalance" ? "border-primary bg-primary/5" : "border-dashed border-border text-muted-foreground"}`}>
                <span className="block font-bold">목적 유지 · 관계 지속</span>
                지정 수량 재조정
              </div>
              <div className={`rounded-lg border px-2 py-2 ${scene.branch === "discontinue" ? "border-red-600 bg-red-600/5" : "border-dashed border-border text-muted-foreground"}`}>
                <span className="block font-bold">목적 종료 · 거래 예상 안 됨</span>
                헤지회계 중단 판단
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
