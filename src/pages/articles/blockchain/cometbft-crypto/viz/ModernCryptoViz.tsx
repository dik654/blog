const card = "min-w-0 rounded-lg border border-border/70 bg-background p-4";

export function CryptoBoundaryViz() {
  const rows = [
    ["Alice user key", "Cosmos/EVM app가 검증", "transaction authorization"],
    ["validator consensus key", "CometBFT가 검증", "proposal·vote·commit evidence"],
    ["block commitments", "TMHash·Merkle", "bytes가 바뀌지 않았다는 요약"],
  ];
  return <figure data-viz="cometbft-crypto-boundary" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-6">
    <figcaption className="mb-5"><p className="text-xs font-bold text-primary">Alice→Bob trace의 key owner</p><p className="mt-1 text-sm text-muted-foreground">CometBFT crypto는 validator가 consensus message에 서명했는지 검증하지, Alice의 account 서명 policy를 정하지 않습니다.</p></figcaption>
    <div data-viz-canvas className="grid min-w-0 gap-3 md:grid-cols-3">{rows.map(([who, owner, receipt], i) => <div key={who} className={card}><span className="text-xs font-bold text-primary">0{i + 1}</span><p className="mt-2 break-words font-semibold">{who}</p><p className="mt-2 text-sm text-muted-foreground">Owner · {owner}</p><p className="mt-3 border-t border-border pt-3 text-sm">Receipt · {receipt}</p></div>)}</div>
  </figure>;
}

export function HashCommitmentViz() {
  const steps = [["raw bytes", "canonical encoding 선행"], ["leaf/inner hash", "0x00/0x01 prefix로 domain 분리"], ["Merkle root", "ordered leaves의 commitment"], ["header·proof", "root 비교후 path 검증"]];
  return <figure data-viz="cometbft-hash-commitment" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-6">
    <figcaption className="mb-5"><p className="text-xs font-bold text-primary">Bytes에서 verification receipt까지</p><p className="mt-1 text-sm text-muted-foreground">Hash가 의미를 만들지는 않습니다. 무엇을 어떤 순서로 encoding했는지가 먼저 고정돼야 합니다.</p></figcaption>
    <div data-viz-canvas className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">{steps.map(([name, detail], i) => <div key={name} className={card}><span className="text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span><p className="mt-2 font-semibold">{name}</p><p className="mt-2 text-sm text-muted-foreground">{detail}</p></div>)}</div>
  </figure>;
}
