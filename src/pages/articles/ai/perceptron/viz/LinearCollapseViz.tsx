export default function LinearCollapseViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 320" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={26} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">비선형성 없으면 → 단일 선형으로 붕괴</text>

        <defs>
          <marker id="lc-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L7,4 L0,8" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* ───── 상단: 활성화 없는 2층 네트워크 ───── */}
        <text x={20} y={60} fontSize={13} fontWeight={700} fill="var(--foreground)">
          ❌ 활성화 함수 없음 (linear only)
        </text>

        {/* x */}
        <rect x={20} y={74} width={65} height={44} rx={7}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={52} y={102} textAnchor="middle" fontSize={14} fontWeight={700} fill="#3b82f6">x</text>

        <line x1={87} y1={96} x2={110} y2={96} stroke="#8b5cf6" strokeWidth={1.8} markerEnd="url(#lc-arr)" />

        {/* Layer 1 */}
        <rect x={110} y={74} width={135} height={44} rx={7}
          fill="var(--muted)" fillOpacity={0.5} stroke="var(--border)" strokeWidth={1.5} />
        <text x={177} y={94} textAnchor="middle" fontSize={12} fontFamily="monospace" fill="var(--foreground)">
          h = W₁·x + b₁
        </text>
        <text x={177} y={110} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Layer 1 (linear)
        </text>

        <line x1={247} y1={96} x2={270} y2={96} stroke="#8b5cf6" strokeWidth={1.8} markerEnd="url(#lc-arr)" />

        {/* Layer 2 */}
        <rect x={270} y={74} width={145} height={44} rx={7}
          fill="var(--muted)" fillOpacity={0.5} stroke="var(--border)" strokeWidth={1.5} />
        <text x={342} y={94} textAnchor="middle" fontSize={12} fontFamily="monospace" fill="var(--foreground)">
          y = W₂·h + b₂
        </text>
        <text x={342} y={110} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Layer 2 (linear)
        </text>

        <line x1={417} y1={96} x2={440} y2={96} stroke="#8b5cf6" strokeWidth={1.8} markerEnd="url(#lc-arr)" />

        {/* y */}
        <rect x={440} y={74} width={65} height={44} rx={7}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.8} />
        <text x={472} y={102} textAnchor="middle" fontSize={14} fontWeight={700} fill="#10b981">y</text>

        {/* ───── 중단: 수식 전개 ───── */}
        <rect x={20} y={140} width={600} height={90} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.8} />
        <text x={32} y={162} fontSize={13} fontWeight={700} fill="var(--foreground)">수식 전개:</text>
        <text x={40} y={184} fontSize={13} fontFamily="monospace" fill="var(--muted-foreground)">
          y = W₂·h + b₂
        </text>
        <text x={40} y={202} fontSize={13} fontFamily="monospace" fill="var(--muted-foreground)">
          &nbsp;&nbsp;= W₂·(W₁·x + b₁) + b₂
        </text>
        <text x={40} y={220} fontSize={13} fontFamily="monospace" fontWeight={700} fill="#ef4444">
          &nbsp;&nbsp;= (W₂W₁)·x + (W₂b₁ + b₂)   ← 단일 W·x + b 형태
        </text>

        {/* ───── 하단: 해결책 ───── */}
        <text x={20} y={256} fontSize={13} fontWeight={700} fill="var(--foreground)">
          ✅ 비선형 활성화 함수 추가 → 진짜 다층 효과
        </text>

        {/* x */}
        <rect x={20} y={270} width={60} height={38} rx={7}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={50} y={294} textAnchor="middle" fontSize={14} fontWeight={700} fill="#3b82f6">x</text>

        <line x1={82} y1={289} x2={105} y2={289} stroke="#8b5cf6" strokeWidth={1.8} markerEnd="url(#lc-arr)" />

        {/* Layer 1 with ReLU */}
        <rect x={105} y={270} width={200} height={38} rx={7}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.8} />
        <text x={205} y={293} textAnchor="middle" fontSize={12} fontFamily="monospace" fill="var(--foreground)">
          h = ReLU(W₁·x + b₁)
        </text>

        <line x1={307} y1={289} x2={330} y2={289} stroke="#8b5cf6" strokeWidth={1.8} markerEnd="url(#lc-arr)" />

        {/* Layer 2 with ReLU */}
        <rect x={330} y={270} width={195} height={38} rx={7}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.8} />
        <text x={427} y={293} textAnchor="middle" fontSize={12} fontFamily="monospace" fill="var(--foreground)">
          y = ReLU(W₂·h + b₂)
        </text>

        <line x1={527} y1={289} x2={550} y2={289} stroke="#8b5cf6" strokeWidth={1.8} markerEnd="url(#lc-arr)" />

        <rect x={550} y={270} width={75} height={38} rx={7}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.8} />
        <text x={587} y={293} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">비선형 y</text>
      </svg>
    </div>
  );
}
