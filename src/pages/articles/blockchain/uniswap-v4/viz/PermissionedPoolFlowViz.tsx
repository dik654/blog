import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const flow = [
  ["기관 wallet", "Issuer allowlist의 실제 trader/LP identity"],
  ["Universal Router", "Adapter wrap/unwrap와 첫 permission check"],
  ["Permissions Adapter", "Underlying RWA를 pool currency representation으로 변환"],
  ["Permissioned Hook", "beforeSwap·beforeAddLiquidity에서 action flag 확인"],
  ["PoolManager", "허용된 action만 AMM accounting과 atomic settlement"],
] as const;

export default function PermissionedPoolFlowViz() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => { if (reduce) return; const id = window.setInterval(() => setStep((v) => (v + 1) % flow.length), 1600); return () => window.clearInterval(id); }, [reduce]);
  return <figure data-viz="permissioned-pool-flow" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
    <figcaption><p className="text-sm font-bold">기관의 swap이 허용되기까지</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Identity policy는 issuer가 관리하고, adapter·router·hook이 서로 다른 우회 경로를 막습니다.</p></figcaption>
    <div data-viz-canvas className="mt-5 grid min-w-0 gap-2 lg:grid-cols-5">{flow.map(([name,note], i) => <div key={name} className="relative min-w-0"><motion.div animate={{ opacity: i <= step ? 1 : .42, y: i === step ? -3 : 0 }} className={`min-h-32 rounded-xl border p-4 ${i === step ? "border-primary bg-primary/10" : "border-border bg-background"}`}><p className="text-xs font-bold text-primary">0{i+1}</p><p className="mt-2 text-sm font-semibold">{name}</p><p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{note}</p></motion.div>{i < flow.length-1 && <span className="absolute -right-2 top-14 hidden text-primary lg:block">→</span>}</div>)}</div>
    <div className="mt-4 grid gap-2 sm:grid-cols-3"><div className="rounded-md border border-border p-3 text-sm"><strong>SWAP_ALLOWED</strong><br/><span className="text-muted-foreground">거래 가능</span></div><div className="rounded-md border border-border p-3 text-sm"><strong>LIQUIDITY_ALLOWED</strong><br/><span className="text-muted-foreground">LP position 생성 가능</span></div><div className="rounded-md border border-destructive/40 p-3 text-sm"><strong>둘 다 없음</strong><br/><span className="text-muted-foreground">Core action 전에 revert</span></div></div>
  </figure>;
}
