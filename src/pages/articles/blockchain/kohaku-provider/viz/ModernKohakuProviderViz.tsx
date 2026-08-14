const methods = [
  { group: "read", examples: "balance · code · receipt", boundary: "adapter가 결과 type을 정규화" },
  { group: "request", examples: "call · estimateGas · raw RPC", boundary: "backend별 신뢰·지원 범위 유지" },
  { group: "sign", examples: "signMessage · sendTransaction", boundary: "별도 TxSigner만 권한 보유" },
] as const;

export function KohakuProviderSurfaceViz() {
  return (
    <figure data-viz="kohaku-provider-surface" className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
      <figcaption className="mb-4 text-sm font-semibold">하나의 호출 모양, 서로 다른 backend 책임</figcaption>
      <div className="grid min-w-0 gap-3 lg:grid-cols-[1fr_1.3fr_1fr]">
        <section className="min-w-0 rounded-lg border border-border bg-background p-4">
          <p className="text-xs font-semibold text-primary">application</p>
          <p className="mt-2 break-words font-mono text-sm">EthereumProvider&lt;T&gt;</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">공통 method와 result type을 호출합니다.</p>
        </section>
        <section className="min-w-0 rounded-lg border border-border bg-background p-4">
          <p className="text-xs font-semibold text-primary">adapter boundary</p>
          <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-3">
            {methods.map((method) => <div key={method.group} className="min-w-0 rounded-md border border-border p-3"><p className="font-mono text-xs font-semibold">{method.group}</p><p className="mt-2 break-words text-xs leading-5">{method.examples}</p><p className="mt-2 break-words text-[11px] leading-4 text-muted-foreground">{method.boundary}</p></div>)}
          </div>
        </section>
        <section className="min-w-0 rounded-lg border border-border bg-background p-4">
          <p className="text-xs font-semibold text-primary">backend</p>
          <p className="mt-2 break-words font-mono text-sm">Ethers · Viem · Helios · Colibri</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">동일 API가 동일한 검증 provenance를 뜻하지는 않습니다.</p>
        </section>
      </div>
    </figure>
  );
}

const trustRows = [
  { path: "Helios normal", method: "verified read", evidence: "light-client verification 범위", result: "정책이 요구하면 허용" },
  { path: "Helios getLogs bypass", method: "execution RPC 직접 호출", evidence: "backend RPC trust", result: "verified-only 정책이면 거부" },
  { path: "Ethers / Viem", method: "provider RPC", evidence: "configured endpoint trust", result: "type parity와 trust parity를 분리" },
] as const;

export function KohakuMethodTrustViz() {
  return (
    <figure data-viz="kohaku-method-trust" className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
      <figcaption className="mb-4 text-sm font-semibold">Method마다 provenance를 따로 기록하는 이유</figcaption>
      <div className="grid min-w-0 gap-3 lg:grid-cols-3">
        {trustRows.map((row) => <section key={row.path} className="min-w-0 rounded-lg border border-border bg-background p-4"><p className="break-words text-sm font-semibold">{row.path}</p><p className="mt-3 break-words font-mono text-xs">{row.method}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">근거: {row.evidence}</p><p className="mt-3 border-t border-border pt-3 text-xs font-medium text-primary">{row.result}</p></section>)}
      </div>
    </figure>
  );
}
