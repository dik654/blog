import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 분배금이 손에 들어오기까지 줄어드는 과정과 환율 곱셈.
 * 300 − 45 − 5 = 250달러. 100 × 1.08 = 108, 108 × 0.90 = 97.2 → −2.8%.
 * 세금과 비용, 수익률과 환율은 모두 본문의 설명용 가정입니다.
 */
const SCENES = [
  { label: "세전 분배금", summary: "300달러", note: "세전 분배금을 300달러로 놓습니다(가정). 아직 세금과 비용을 빼기 전입니다." },
  { label: "세금과 거래비용", summary: "300 − 45 − 5 = 250달러", note: "세금 45달러와 거래비용 5달러를 빼면 현금은 250달러입니다. 특정 국가의 실제 세율은 아니며, NAV에 이미 반영된 운용보수는 여기서 다시 빼지 않습니다." },
  { label: "달러로는 8% 이익", summary: "100 × 1.08 = 108", note: "이제 다른 계산입니다. 달러 자산 총수익이 8%라면 처음 100이 달러 기준으로 108이 됩니다." },
  { label: "원화로 바꾸면", summary: "108 × 0.90 = 97.2 → −2.8%", note: "달러당 원화가 10% 내리면 108에 0.90을 곱해 97.2가 됩니다. 달러로는 이익인데 원화로는 비용 전 −2.8%입니다. 8%와 10%를 더하고 빼는 계산이 아니라 곱셈입니다." },
] as const;

function Row({ label, value, max, color, unit }: { label: string; value: number; max: number; color: string; unit: string }) {
  return (
    <div className="grid grid-cols-[6.25rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-5 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-semibold">{value}{unit}</span>
    </div>
  );
}

export default function NetCashFxViz() {
  return (
    <SceneShell
      eyebrow="손에 남는 돈"
      title="세금과 환율을 지나면 숫자가 달라집니다"
      description="앞의 두 장면은 분배금 현금, 뒤의 두 장면은 환율 계산입니다. 서로 다른 가정이라 이어서 계산하지 않습니다."
      ariaLabel="세전 분배금에서 현금까지, 달러 수익에서 원화 수익까지의 계산"
      scenes={SCENES}
      render={(active) =>
        active < 2 ? (
          <div className="space-y-2">
            <Row label="세전 분배금" value={300} max={300} color="#64748b" unit="달러" />
            <Row label="세금" value={active === 0 ? 0 : 45} max={300} color="#d97706" unit="달러" />
            <Row label="거래비용" value={active === 0 ? 0 : 5} max={300} color="#d97706" unit="달러" />
            <Row label="손에 남는 현금" value={active === 0 ? 300 : 250} max={300} color="#2563eb" unit="달러" />
          </div>
        ) : (
          <div className="space-y-2">
            <Row label="처음" value={100} max={108} color="#64748b" unit="" />
            <Row label="달러 기준" value={108} max={108} color="#16a34a" unit="" />
            <Row label="원화 기준" value={active === 2 ? 0 : 97.2} max={108} color="#dc2626" unit="" />
          </div>
        )
      }
    />
  );
}
