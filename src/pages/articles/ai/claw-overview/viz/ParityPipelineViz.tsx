export default function ParityPipelineViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 340" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Rust ↔ Python 패리티 검증 파이프라인</text>

        <defs>
          <marker id="pp-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Mock service (top center) */}
        <rect x={190} y={48} width={180} height={44} rx={6}
          fill="#6366f1" fillOpacity={0.15} stroke="#6366f1" strokeWidth={1.8} />
        <text x={280} y={66} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6366f1">
          mock-anthropic-service
        </text>
        <text x={280} y={82} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          localhost:3070 · scenario #N
        </text>

        {/* Fan-out to two runtimes */}
        <line x1={230} y1={92} x2={150} y2={112} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#pp-arr)" />
        <line x1={330} y1={92} x2={410} y2={112} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#pp-arr)" />

        {/* Left: Rust runtime */}
        <rect x={46} y={116} width={208} height={96} rx={6}
          fill="#f97316" fillOpacity={0.12} stroke="#f97316" strokeWidth={1.8} />
        <rect x={46} y={116} width={4} height={96} fill="#f97316" rx={1} />
        <text x={150} y={136} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f97316">
          Rust runtime
        </text>
        <text x={150} y={152} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          ANTHROPIC_BASE_URL → mock
        </text>
        <text x={60} y={172} fontSize={9} fill="var(--foreground)">• SSE 수신 · 파싱</text>
        <text x={60} y={186} fontSize={9} fill="var(--foreground)">• 도구 실행 (실제 crates)</text>
        <text x={60} y={200} fontSize={9} fill="var(--foreground)">• 최종 Session 상태 기록</text>

        {/* Right: Python PortRuntime */}
        <rect x={306} y={116} width={208} height={96} rx={6}
          fill="#3b82f6" fillOpacity={0.12} stroke="#3b82f6" strokeWidth={1.8} />
        <rect x={306} y={116} width={4} height={96} fill="#3b82f6" rx={1} />
        <text x={410} y={136} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          Python PortRuntime
        </text>
        <text x={410} y={152} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          같은 scenario #N
        </text>
        <text x={320} y={172} fontSize={9} fill="var(--foreground)">• MockFs 시뮬레이션</text>
        <text x={320} y={186} fontSize={9} fill="var(--foreground)">• 도구 시뮬레이션 (Mock)</text>
        <text x={320} y={200} fontSize={9} fill="var(--foreground)">• 최종 Session 상태 기록</text>

        {/* Fan-in to diff */}
        <line x1={150} y1={212} x2={230} y2={244} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#pp-arr)" />
        <line x1={410} y1={212} x2={330} y2={244} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#pp-arr)" />

        {/* Diff node */}
        <rect x={180} y={248} width={200} height={48} rx={6}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={1.8} />
        <text x={280} y={268} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          diff (Session 상태)
        </text>
        <text x={280} y={284} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          messages · tool_calls · permissions
        </text>

        {/* PASS/FAIL branches */}
        <line x1={240} y1={296} x2={140} y2={316} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#pp-arr)" />
        <rect x={64} y={314} width={100} height={20} rx={4}
          fill="#10b981" fillOpacity={0.2} stroke="#10b981" strokeWidth={1.5} />
        <text x={114} y={328} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          ✓ PASS (빈 diff)
        </text>

        <line x1={320} y1={296} x2={420} y2={316} stroke="#ef4444" strokeWidth={1.5} markerEnd="url(#pp-arr)" />
        <rect x={396} y={314} width={124} height={20} rx={4}
          fill="#ef4444" fillOpacity={0.2} stroke="#ef4444" strokeWidth={1.5} />
        <text x={458} y={328} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
          ✗ FAIL + diff 리포트
        </text>
      </svg>
    </div>
  );
}
