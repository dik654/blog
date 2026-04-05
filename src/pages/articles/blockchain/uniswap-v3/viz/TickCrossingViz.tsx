export default function TickCrossingViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 300" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Swap — Tick Crossing 과정</text>

        <text x={260} y={50} textAnchor="middle" fontSize={11}
          fill="var(--muted-foreground)">각 tick 경계에서 활성 L이 변함 → 구간별로 swap 계산</text>

        {/* 가격 축 (가로) */}
        <line x1={40} y1={180} x2={480} y2={180} stroke="var(--foreground)" strokeWidth={1} />

        {/* tick 마커들 */}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const x = 60 + i * 76;
          return (
            <line key={i} x1={x} y1={174} x2={x} y2={186}
              stroke="var(--foreground)" strokeWidth={0.8} />
          );
        })}

        {/* 활성 유동성 구간들 */}
        <rect x={60} y={124} width={152} height={56} fill="#10b981" opacity={0.3} stroke="#10b981" strokeWidth={1} />
        <text x={136} y={146} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">
          L = 1.0e21
        </text>
        <text x={136} y={162} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          구간 1
        </text>

        <rect x={212} y={96} width={152} height={84} fill="#3b82f6" opacity={0.3} stroke="#3b82f6" strokeWidth={1} />
        <text x={288} y={132} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          L = 1.5e21
        </text>
        <text x={288} y={148} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          구간 2 (겹침)
        </text>

        <rect x={364} y={138} width={96} height={42} fill="#f59e0b" opacity={0.3} stroke="#f59e0b" strokeWidth={1} />
        <text x={412} y={160} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">
          L = 0.8e21
        </text>

        {/* 시작 가격 */}
        <circle cx={92} cy={180} r={6} fill="#8b5cf6" stroke="var(--card)" strokeWidth={2} />
        <text x={92} y={204} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">Start √P₀</text>

        {/* 종료 가격 */}
        <circle cx={440} cy={180} r={6} fill="#ef4444" stroke="var(--card)" strokeWidth={2} />
        <text x={440} y={204} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">End √P₁</text>

        {/* 스왑 경로 */}
        <defs>
          <marker id="swap-arr-v3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Step 1 */}
        <line x1={98} y1={180} x2={210} y2={180} stroke="#10b981" strokeWidth={3} />
        {/* Crossing 1 */}
        <circle cx={212} cy={180} r={5} fill="#ef4444" stroke="var(--card)" strokeWidth={1.5} />
        {/* Step 2 */}
        <line x1={214} y1={180} x2={362} y2={180} stroke="#3b82f6" strokeWidth={3} />
        {/* Crossing 2 */}
        <circle cx={364} cy={180} r={5} fill="#ef4444" stroke="var(--card)" strokeWidth={1.5} />
        {/* Step 3 */}
        <line x1={366} y1={180} x2={434} y2={180} stroke="#f59e0b" strokeWidth={3} markerEnd="url(#swap-arr-v3)" />

        {/* Step 라벨 */}
        <text x={155} y={238} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">Step 1</text>
        <text x={155} y={252} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">L = 1.0e21</text>

        <text x={288} y={238} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">Step 2</text>
        <text x={288} y={252} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">L +0.5e21 (crossing)</text>

        <text x={400} y={238} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">Step 3</text>
        <text x={400} y={252} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">L -0.7e21 (crossing)</text>

        {/* cross 라벨 */}
        <text x={212} y={226} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">cross</text>
        <text x={364} y={226} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">cross</text>

        <text x={260} y={280} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">crossing 많을수록 swap 가스 ↑ (각 경계마다 L 재계산)</text>
      </svg>
    </div>
  );
}
