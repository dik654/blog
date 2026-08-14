const steps = [
  ["RPC / P2P", "Alice transaction", "EL admission"],
  ["execution client", "EVM + state", "payload validity"],
  ["Engine API", "payload + forkchoice", "typed handoff"],
  ["consensus client", "fork choice + finality", "canonical choice"],
] as const;

export function EngineBoundaryViz(){return <figure className="rounded-xl border border-border bg-card p-4 sm:p-6"><figcaption className="mb-4 text-sm font-semibold">같은 transaction이 EL과 CL에서 맡는 역할</figcaption><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([t,d,o],i)=><div key={t} className="rounded-lg border border-border bg-background p-4"><p className="text-xs font-semibold text-primary">0{i+1}</p><p className="mt-2 font-semibold">{t}</p><p className="mt-2 break-words font-mono text-xs">{d}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{o}</p></div>)}</div></figure>}

export function PayloadStateViz(){return <figure className="rounded-xl border border-border bg-card p-4 sm:p-6"><figcaption className="mb-4 text-sm font-semibold">Payload status는 canonical finality가 아니다</figcaption><div className="grid gap-3 sm:grid-cols-2">{[["VALID","EL이 payload를 실행·검증함"],["INVALID","EL이 invalid ancestor/transition을 식별함"],["SYNCING","필요한 state·ancestor가 아직 없음"],["ACCEPTED","비동기 검증 경로에 받아들였으나 valid 확정 아님"]].map(([t,d])=><div key={t} className="rounded-lg border border-border bg-background p-4"><p className="font-mono text-sm font-semibold text-primary">{t}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{d}</p></div>)}</div><p className="mt-4 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground">VALID payload도 CL fork choice가 head로 고르지 않을 수 있고, head도 finalized checkpoint와 다릅니다.</p></figure>}
