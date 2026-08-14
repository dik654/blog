const card = "min-w-0 rounded-lg border border-border/70 bg-background p-4";

export function EvmosTxViz() {
  const steps = [["Ethereum tx", "chain ID·nonce·to·value·gas"], ["EVM ante chain", "sender recovery·fee·sequence"], ["MsgEthereumTx", "Cosmos message routing"], ["EVM transition", "code·storage·logs·refund"], ["Cosmos commit", "KV state root in AppHash"]];
  return <figure data-viz="evmos-tx" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-6"><figcaption className="mb-5"><p className="text-xs font-bold text-primary">Evmos v20 transaction boundary</p><p className="mt-1 text-sm text-muted-foreground">CometBFT는 ordered bytes를 전달하고, Evmos application이 Ethereum semantics를 실행한 뒤 Cosmos store에 commit합니다.</p></figcaption><div data-viz-canvas className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-5">{steps.map(([name, detail], i) => <div className={card} key={name}><span className="text-xs font-bold text-primary">0{i + 1}</span><p className="mt-2 font-semibold">{name}</p><p className="mt-2 text-sm text-muted-foreground">{detail}</p></div>)}</div></figure>;
}

export function RepresentationViz() {
  const rows = [["native Cosmos coin", "bank module balance", "bank keeper"], ["ERC-20 contract", "EVM storage balance", "EVM StateDB"], ["IBC voucher", "denom trace·packet receipt", "IBC + ERC-20 middleware"]];
  return <figure data-viz="evmos-representation" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-6"><figcaption className="mb-5"><p className="text-xs font-bold text-primary">Token representation은 balance 표시가 아니라 state owner를 바꿘다</p><p className="mt-1 text-sm text-muted-foreground">동일한 이름과 수량이 보여도 authoritative store와 rollback owner를 대조해야 합니다.</p></figcaption><div data-viz-canvas className="grid min-w-0 gap-3 md:grid-cols-3">{rows.map(([repr, state, owner]) => <div className={card} key={repr}><p className="break-words font-semibold">{repr}</p><p className="mt-2 text-sm text-muted-foreground">State · {state}</p><p className="mt-3 border-t border-border pt-3 text-sm">Owner · {owner}</p></div>)}</div></figure>;
}
