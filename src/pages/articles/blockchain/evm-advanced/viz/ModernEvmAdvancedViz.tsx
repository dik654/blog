import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";

const rows = [
  ["CALL", "callee", "caller", "callee", "allowed"],
  ["DELEGATECALL", "caller storage", "original caller", "unchanged", "allowed"],
  ["STATICCALL", "callee", "caller", "0", "forbidden"],
] as const;

export function CallContextMatrixViz(){return <figure data-viz className="rounded-xl border border-border bg-card p-4 sm:p-6"><figcaption className="mb-4 text-sm font-semibold">Opcode가 바꾸는 execution context</figcaption><ResponsiveVizTable columns={["opcode","storage owner","msg.sender","msg.value","state write"]} rows={rows} desktopMinWidthClassName="min-w-[620px]" firstColumnClassName="font-mono" /><p className="mt-3 text-xs leading-5 text-muted-foreground">DELEGATECALL의 code owner와 storage owner가 다르다는 점이 proxy의 힘이자 위험입니다.</p></figure>}

export function CreateLifecycleViz(){return <figure className="rounded-xl border border-border bg-card p-4 sm:p-6"><figcaption className="mb-4 text-sm font-semibold">CREATE 계열: init code와 runtime code를 분리</figcaption><div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">{[["candidate address","nonce 또는 salt·init hash"],["run init code","child frame + journal"],["store return bytes","runtime code"]].map((x,i)=><div key={x[0]} className="contents"><div className="rounded-lg border border-border bg-background p-4"><p className="text-xs font-semibold text-primary">0{i+1}</p><p className="mt-2 font-semibold">{x[0]}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{x[1]}</p></div>{i<2&&<span aria-hidden className="hidden text-muted-foreground md:block">→</span>}</div>)}</div></figure>}
