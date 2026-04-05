export default function PartitioningViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 640 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TDX 1.5 Partitioning — L1 TD 안의 L2 TD</text>

        {/* Outer L1 TD */}
        <rect x={40} y={40} width={400} height={200} rx={12}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.8} strokeDasharray="4 2" />
        <text x={240} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          L1 TD (Trust Domain Partitioning Manager)
        </text>
        <text x={240} y={71} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          예: Confidential Kubernetes worker node
        </text>

        {/* L2 TDs */}
        <rect x={60} y={85} width={160} height={100} rx={8}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.5} />
        <text x={140} y={102} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">L2 TD #1</text>
        <text x={140} y={116} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">workload A (Rust)</text>
        <text x={140} y={128} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">자체 MRTD · 독립 측정</text>
        <text x={140} y={142} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">L1이 스케줄링</text>
        <text x={140} y={158} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="#3b82f6">TDG.VP.ENTER (L1→L2)</text>
        <text x={140} y={172} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="#3b82f6">TD_EXIT → L1 복귀</text>

        <rect x={260} y={85} width={160} height={100} rx={8}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={340} y={102} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">L2 TD #2</text>
        <text x={340} y={116} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">workload B (Python)</text>
        <text x={340} y={128} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">다른 테넌트</text>
        <text x={340} y={142} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">L1에게만 노출</text>
        <text x={340} y={158} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="#f59e0b">격리 S-EPT</text>
        <text x={340} y={172} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="#f59e0b">고유 KeyID</text>

        {/* L1 management */}
        <rect x={60} y={195} width={360} height={35} rx={6}
          fill="var(--muted)" opacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={210} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--foreground)">
          L1 TD가 수행: L2 생성(TDCS 관리), vCPU 스케줄링, 인터럽트 injection
        </text>
        <text x={240} y={222} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          장점: L2는 L1만 신뢰하면 됨 · Host VMM은 TCB 밖
        </text>
      </svg>
    </div>
  );
}
