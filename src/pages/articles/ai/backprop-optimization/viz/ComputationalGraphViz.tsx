export default function ComputationalGraphViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 320" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Computational Graph — f(x) = sin(x² + 1)</text>

        <defs>
          <marker id="cg-fwd" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L7,4 L0,8" fill="#3b82f6" />
          </marker>
          <marker id="cg-bwd" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L7,4 L0,8" fill="#ef4444" />
          </marker>
        </defs>

        {/* Forward Pass 라벨 */}
        <text x={320} y={50} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          ① Forward Pass (파란색)
        </text>

        {/* 노드들 */}
        {/* x */}
        <circle cx={65} cy={120} r={32} fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={2.2} />
        <text x={65} y={120} textAnchor="middle" fontSize={13} fontWeight={700} fill="#3b82f6">x</text>
        <text x={65} y={135} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">입력</text>

        {/* a = x^2 */}
        <circle cx={200} cy={120} r={32} fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={2.2} />
        <text x={200} y={116} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">a = x²</text>
        <text x={200} y={132} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">square</text>

        {/* b = a + 1 */}
        <circle cx={340} cy={120} r={32} fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={2.2} />
        <text x={340} y={116} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">b = a+1</text>
        <text x={340} y={132} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">add</text>

        {/* c = sin(b) */}
        <circle cx={480} cy={120} r={32} fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={2.2} />
        <text x={480} y={116} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">c=sin(b)</text>
        <text x={480} y={132} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">sin</text>

        {/* output */}
        <circle cx={585} cy={120} r={28} fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={2.2} />
        <text x={585} y={124} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">f(x)</text>

        {/* Forward 화살표 */}
        <line x1={97} y1={115} x2={166} y2={115} stroke="#3b82f6" strokeWidth={1.8} markerEnd="url(#cg-fwd)" />
        <line x1={232} y1={115} x2={306} y2={115} stroke="#3b82f6" strokeWidth={1.8} markerEnd="url(#cg-fwd)" />
        <line x1={372} y1={115} x2={446} y2={115} stroke="#3b82f6" strokeWidth={1.8} markerEnd="url(#cg-fwd)" />
        <line x1={512} y1={115} x2={555} y2={115} stroke="#3b82f6" strokeWidth={1.8} markerEnd="url(#cg-fwd)" />

        {/* Backward 화살표 */}
        <line x1={555} y1={135} x2={512} y2={135} stroke="#ef4444" strokeWidth={1.8} markerEnd="url(#cg-bwd)" />
        <line x1={446} y1={135} x2={372} y2={135} stroke="#ef4444" strokeWidth={1.8} markerEnd="url(#cg-bwd)" />
        <line x1={306} y1={135} x2={232} y2={135} stroke="#ef4444" strokeWidth={1.8} markerEnd="url(#cg-bwd)" />
        <line x1={166} y1={135} x2={97} y2={135} stroke="#ef4444" strokeWidth={1.8} markerEnd="url(#cg-bwd)" />

        <text x={320} y={180} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
          ② Backward Pass — Chain Rule (빨간색)
        </text>

        {/* Backward 계산 테이블 */}
        <rect x={20} y={196} width={600} height={110} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.8} />

        <text x={32} y={216} fontSize={11} fontWeight={700} fill="var(--foreground)">
          각 노드의 Local Gradient × Upstream Gradient = Downstream Gradient
        </text>

        <line x1={32} y1={222} x2={608} y2={222} stroke="var(--border)" strokeOpacity={0.5} strokeWidth={0.6} />

        {[
          { x: 40, label: 'dc/dc', val: '= 1', why: '출발점' },
          { x: 170, label: 'dc/db', val: '= cos(b)', why: 'sin 미분' },
          { x: 320, label: 'dc/da', val: '= cos(b)·1', why: '덧셈 local=1' },
          { x: 470, label: 'dc/dx', val: '= cos(b)·1·2x', why: '제곱 local=2x' },
        ].map((step, i) => (
          <g key={i}>
            <text x={step.x} y={244} fontSize={11} fontFamily="monospace" fontWeight={700} fill="#ef4444">
              {step.label}
            </text>
            <text x={step.x} y={262} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
              {step.val}
            </text>
            <text x={step.x} y={278} fontSize={9} fill="var(--muted-foreground)">
              ({step.why})
            </text>
          </g>
        ))}

        <text x={320} y={299} textAnchor="middle" fontSize={10} fontFamily="monospace" fontWeight={700} fill="#8b5cf6">
          최종: df/dx = cos(x² + 1) · 2x
        </text>
      </svg>
    </div>
  );
}
