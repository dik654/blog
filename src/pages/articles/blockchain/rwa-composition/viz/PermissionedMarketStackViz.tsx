const layers = [
  ["법률·규제", "어떤 권리인가", "Jurisdiction · securities law · insolvency"],
  ["Issuer·KYC", "누가 보유·거래 가능한가", "Allowlist · transfer agent · sanctions"],
  ["Token·Adapter", "법적 claim을 어떤 onchain unit으로 옮기는가", "Underlying token · wrapped pool currency"],
  ["Hook·AMM", "어떤 action을 허용하고 어떤 가격으로 체결하는가", "Swap · LP · fee · liquidity"],
  ["Ethereum settlement", "현금 leg와 asset leg가 함께 끝났는가", "Atomic DvP · receipt · finality"],
] as const;

export default function PermissionedMarketStackViz() {
  return <figure data-viz="permissioned-rwa-stack" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6"><figcaption><p className="text-sm font-bold">Permissionless infrastructure 위의 permissioned market</p><p className="mt-1 text-sm leading-6 text-muted-foreground">각 층의 질문과 책임자가 다르며, AMM 성공이 법적 권리까지 자동 생성하지 않습니다.</p></figcaption><div data-viz-canvas className="mt-5 space-y-2">{layers.map(([layer,question,detail],i) => <div key={layer} className="grid min-w-0 gap-2 rounded-lg border border-border bg-background p-4 md:grid-cols-[3rem_10rem_1fr_1fr] md:items-center"><span className="grid h-8 w-8 place-items-center rounded-full border border-primary text-xs font-bold text-primary">{i+1}</span><p className="font-semibold">{layer}</p><p className="text-sm leading-6">{question}</p><p className="break-words text-sm leading-6 text-muted-foreground">{detail}</p></div>)}</div></figure>;
}
