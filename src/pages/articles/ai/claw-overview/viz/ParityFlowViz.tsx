export default function ParityFlowViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Python 패리티 검증 — Rust ↔ Python 교차 체크</text>

        <defs>
          <marker id="pf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Input scenario */}
        <rect x={210} y={50} width={140} height={40} rx={6}
          fill="#ec4899" fillOpacity={0.15} stroke="#ec4899" strokeWidth={1.8} />
        <text x={280} y={75} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ec4899">
          Mock Scenario
        </text>

        <line x1={210} y1={80} x2={160} y2={120} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#pf-arr)" />
        <line x1={350} y1={80} x2={400} y2={120} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#pf-arr)" />

        {/* Python engine */}
        <rect x={40} y={124} width={220} height={80} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={150} y={147} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          Python PortRuntime
        </text>
        <text x={150} y={164} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          behavioral spec
        </text>
        <text x={150} y={178} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          MockFs · MockShell
        </text>
        <text x={150} y={194} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          ~1,700 LOC
        </text>

        {/* Rust engine */}
        <rect x={300} y={124} width={220} height={80} rx={6}
          fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={1.8} />
        <text x={410} y={147} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
          Rust runtime
        </text>
        <text x={410} y={164} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          production impl
        </text>
        <text x={410} y={178} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          real I/O · async
        </text>
        <text x={410} y={194} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          ~55K LOC
        </text>

        <line x1={150} y1={204} x2={240} y2={240} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#pf-arr)" />
        <line x1={410} y1={204} x2={320} y2={240} stroke="#8b5cf6" strokeWidth={1.3} markerEnd="url(#pf-arr)" />

        {/* Comparator */}
        <rect x={170} y={244} width={220} height={40} rx={6}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.8} />
        <text x={280} y={264} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
          Byte-level Comparator
        </text>
        <text x={280} y={278} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          CI: 불일치 시 build fail
        </text>
      </svg>
    </div>
  );
}
