const rows = [
  ["Workload", "Field-native Poseidon", "SHA·BLAKE·Keccak 유지"],
  ["바꾸는 층", "Hash primitive", "Proof representation·prover"],
  ["얻는 것", "Prime-field circuit 비용 감소", "기존 표준·구현 생태계 재사용"],
  ["남는 위험", "Profile·신생 cryptanalysis", "Binary prover·batch·hardware 성숙도"],
] as const;

export default function PoseidonSecurityShiftViz() {
  return <figure data-viz="poseidon-security-shift" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-6">
    <figcaption><p className="text-sm font-bold">ZK-friendly primitive ↔ conventional-hash-friendly proof</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Hash만 비교하지 않고 어느 층을 바꾸는지 같은 축에서 봅니다.</p></figcaption>
    <div data-viz-canvas className="mt-5 overflow-x-auto"><div className="min-w-[38rem] overflow-hidden rounded-xl border border-border"><div className="grid grid-cols-[8rem_1fr_1fr] bg-muted/40 text-xs font-bold"><div className="p-3">비교축</div><div className="border-l border-border p-3">Poseidon 경로</div><div className="border-l border-border p-3">Binary proving 경로</div></div>{rows.map(([axis,left,right]) => <div key={axis} className="grid grid-cols-[8rem_1fr_1fr] border-t border-border text-sm"><div className="p-3 font-semibold">{axis}</div><div className="border-l border-border p-3 text-muted-foreground">{left}</div><div className="border-l border-border p-3 text-muted-foreground">{right}</div></div>)}</div></div>
  </figure>;
}
