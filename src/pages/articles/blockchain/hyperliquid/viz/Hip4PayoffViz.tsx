import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — Yes 100개를 0.60에 산 지급 구조.
 * 100×0.60=60, 1,000−60=940. Yes: 100−60=+40, No: 0−60=−60. Yes 0.60 매수는 No 0.40 매도와 대응(0.60+0.40=1).
 */
const SCENES = [
  { label: "60만 씁니다", summary: "100 × 0.60 = 60 · 940 미사용", step: 0, note: "1,000 USDC 중 60으로 Yes 100개를 개당 0.60에 샀다고 합시다. 나머지 940은 이 단순 사례에서 쓰지 않았습니다. 모두 가정입니다." },
  { label: "결과가 Yes", summary: "100 − 60 = +40", step: 1, note: "Yes로 끝나면 100을 받습니다. 수수료 전 손익은 +40입니다." },
  { label: "결과가 No", summary: "0 − 60 = −60", step: 2, note: "No로 끝나면 0을 받습니다. 수수료 전 손익은 −60이고, 담보가 충분하다는 사실이 60 회수를 보장하지는 않습니다." },
  { label: "같은 주문을 No로 읽으면", summary: "0.60 + 0.40 = 1", step: 3, note: "Yes가 받는 몫과 No가 받는 몫을 합치면 1이므로, Yes 0.60 매수는 No 0.40 매도와 대응합니다. 0·1 정산 외 일반 범위 정산도 있으니 상품의 실제 조건을 읽습니다." },
] as const;

function Split({ left, right, leftLabel, rightLabel, leftColor, rightColor, on }: { left: number; right: number; leftLabel: string; rightLabel: string; leftColor: string; rightColor: string; on: boolean }) {
  return (
    <div className={on ? "" : "opacity-30"}>
      <div className="flex h-5 w-full overflow-hidden rounded-sm border border-border" role="img" aria-label={`${leftLabel}, ${rightLabel}`}>
        <div style={{ width: `${left}%`, backgroundColor: leftColor }} />
        <div style={{ width: `${right}%`, backgroundColor: rightColor }} />
      </div>
      <div className="mt-1 flex flex-wrap justify-between gap-x-3 text-xs">
        <span className="font-semibold">{leftLabel}</span>
        <span className="text-muted-foreground">{rightLabel}</span>
      </div>
    </div>
  );
}

function Outcome({ name, received, pnl, color, on }: { name: string; received: string; pnl: string; color: string; on: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${on ? "bg-background" : "border-dashed opacity-40"}`} style={{ borderColor: on ? color : undefined }}>
      <p className="text-sm font-bold">결과 {name}</p>
      <p className="mt-1 text-xs text-muted-foreground">받는 돈 {received}</p>
      <p className="mt-1 font-mono text-base font-bold" style={{ color: on ? color : undefined }}>{pnl}</p>
    </div>
  );
}

export default function Hip4PayoffViz() {
  return (
    <SceneShell
      eyebrow="(가정) 결과 시장의 지급 구조"
      title="Yes 100개를 60에 사면 결과별로 얼마가 남을까요"
      description="결과 시장은 결과에 따라 정해진 금액을 지급하는 계약입니다. 손익은 수수료 전입니다."
      note="HIP-4 원문 개요는 레버리지와 청산이 없다고 설명합니다. 앞의 BTC 0.1 무기한 계약이 5,000달러 노출로 유지 요구액과 청산 경로를 갖는 것과 다른 구조입니다."
      ariaLabel="Yes 100개 매수의 비용과 결과별 손익, No 측과의 대응"
      scenes={SCENES}
      render={(active) => {
        const { step } = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <Split left={6} right={94} leftLabel="Yes 구입 60" rightLabel="사용 안 함 940 (합계 1,000)" leftColor="#2563eb" rightColor="#94a3b833" on={step <= 2} />
            <div className="grid grid-cols-2 gap-2">
              <Outcome name="Yes" received="100" pnl="+40" color="#16a34a" on={step === 1} />
              <Outcome name="No" received="0" pnl="−60" color="#dc2626" on={step === 2} />
            </div>
            <Split left={60} right={40} leftLabel="Yes 매수 0.60" rightLabel="No 매도 0.40" leftColor="#2563eb" rightColor="#d97706" on={step === 3} />
          </div>
        );
      }}
    />
  );
}
