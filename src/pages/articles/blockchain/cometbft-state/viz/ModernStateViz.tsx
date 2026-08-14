const card = "min-w-0 rounded-lg border border-border/70 bg-background p-4";

export function DurableStoresViz() {
  const stores = [
    ["BlockStore", "block·parts·commit", "Base…Height", "합의한 원본 bytes"],
    ["State store", "State·validator sets·params", "next-height inputs", "다음 block 검증 기준"],
    ["ABCI result", "FinalizeBlock response", "height index + latest", "replay·query 근거"],
    ["Application", "business state", "committed height + AppHash", "실행 결과의 권위"],
  ];
  return <figure data-viz="cometbft-durable-stores" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-6">
    <figcaption className="mb-5"><p className="text-xs font-bold text-primary">한 node 안의 네 durable receipt</p><p className="mt-1 text-sm text-muted-foreground">모두 ‘상태’라고 부르지만 저장하는 사실과 복구 owner가 다릅니다.</p></figcaption>
    <div data-viz-canvas className="grid min-w-0 gap-3 sm:grid-cols-2">{stores.map(([title, data, key, meaning]) => <div key={title} className={card}><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{title}</p><span className="rounded-md bg-muted px-2 py-1 text-xs">{key}</span></div><p className="mt-3 text-sm text-muted-foreground">{data}</p><p className="mt-3 border-t border-border pt-3 text-sm">{meaning}</p></div>)}</div>
  </figure>;
}

export function RecoveryMatrixViz() {
  const rows = [
    ["새 node", "trusted header", "snapshot chunks", "Bootstrap 후 blocks로 전진"],
    ["정상 restart", "local block/state/app heights", "ABCI Info", "차이만 replay"],
    ["Commit 뒤 crash", "block h + result h + app h", "State h−1", "mock app으로 state만 재구성"],
    ["손상/불일치", "AppHash mismatch", "검증 실패", "자동 진행 금지"],
  ];
  return <figure data-viz="cometbft-recovery-matrix" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-6">
    <figcaption className="mb-5"><p className="text-xs font-bold text-primary">state sync와 crash replay는 출발점이 다르다</p><p className="mt-1 text-sm text-muted-foreground">snapshot을 받는 일, header를 신뢰·검증하는 일, local store 차이를 복구하는 일을 한 단계로 뭉치지 않습니다.</p></figcaption>
    <div data-viz-canvas className="grid min-w-0 gap-3 lg:grid-cols-2">{rows.map(([caseName, evidence, action, end]) => <div key={caseName} className={card}><p className="text-xs font-bold text-primary">{caseName}</p><dl className="mt-3 grid grid-cols-[5rem_1fr] gap-x-3 gap-y-2 text-sm"><dt className="text-muted-foreground">근거</dt><dd className="min-w-0 break-words">{evidence}</dd><dt className="text-muted-foreground">동작</dt><dd>{action}</dd><dt className="text-muted-foreground">종료</dt><dd>{end}</dd></dl></div>)}</div>
  </figure>;
}
