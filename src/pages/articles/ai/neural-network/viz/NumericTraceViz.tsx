export default function NumericTraceViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 440" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">3층 순전파 — 구체 수치 계산</text>
        <text x={320} y={42} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          입력 x=[1.0, 0.5] → Layer1(3, sigmoid) → Layer2(2, sigmoid) → Output(1, identity)
        </text>

        <defs>
          <marker id="nt-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L7,4 L0,8" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Layer 1 */}
        <rect x={20} y={60} width={190} height={90} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.8} />
        <text x={115} y={80} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">Layer 1</text>
        <text x={115} y={95} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          W₁: 2×3, b₁: 3
        </text>
        <text x={115} y={113} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--foreground)">
          z₁ = x·W₁ + b₁
        </text>
        <text x={115} y={127} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#3b82f6">
          = [0.3, 0.7, 1.1]
        </text>
        <text x={115} y={141} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#f59e0b">
          a₁ = σ(z₁) = [0.574, 0.668, 0.750]
        </text>

        <line x1={215} y1={105} x2={240} y2={105} stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#nt-arr)" />

        {/* Layer 2 */}
        <rect x={245} y={60} width={190} height={90} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={340} y={80} textAnchor="middle" fontSize={13} fontWeight={700} fill="#3b82f6">Layer 2</text>
        <text x={340} y={95} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          W₂: 3×2, b₂: 2
        </text>
        <text x={340} y={113} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--foreground)">
          z₂ = a₁·W₂ + b₂
        </text>
        <text x={340} y={127} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#3b82f6">
          = [0.516, 1.214]
        </text>
        <text x={340} y={141} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#f59e0b">
          a₂ = σ(z₂) = [0.626, 0.771]
        </text>

        <line x1={440} y1={105} x2={465} y2={105} stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#nt-arr)" />

        {/* Output */}
        <rect x={470} y={60} width={150} height={90} rx={8}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1.8} />
        <text x={545} y={80} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ef4444">Output</text>
        <text x={545} y={95} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          W₃: 2×1, b₃: 1
        </text>
        <text x={545} y={113} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--foreground)">
          z₃ = a₂·W₃ + b₃
        </text>
        <text x={545} y={127} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#3b82f6">
          = 0.317
        </text>
        <text x={545} y={141} textAnchor="middle" fontSize={10} fontFamily="monospace" fontWeight={700} fill="#10b981">
          y = 0.317
        </text>

        {/* Layer 1 상세 전개 */}
        <rect x={20} y={168} width={600} height={72} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.8} />
        <text x={32} y={186} fontSize={12} fontWeight={700} fill="#10b981">Layer 1 상세 전개:</text>
        <text x={40} y={204} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          W₁ = [[0.1, 0.3, 0.5], [0.2, 0.4, 0.6]],  b₁ = [0.1, 0.2, 0.3]
        </text>
        <text x={40} y={219} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          z₁ = [1.0·0.1+0.5·0.2, 1.0·0.3+0.5·0.4, 1.0·0.5+0.5·0.6] + [0.1, 0.2, 0.3]
        </text>
        <text x={40} y={234} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
          &nbsp;&nbsp;&nbsp;= [0.2, 0.5, 0.8] + [0.1, 0.2, 0.3] = [0.3, 0.7, 1.1]
        </text>

        {/* Layer 2 상세 전개 */}
        <rect x={20} y={250} width={600} height={72} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.8} />
        <text x={32} y={268} fontSize={12} fontWeight={700} fill="#3b82f6">Layer 2 상세 전개:</text>
        <text x={40} y={286} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          W₂ = [[0.1, 0.4], [0.2, 0.5], [0.3, 0.6]],  b₂ = [0.1, 0.2]
        </text>
        <text x={40} y={301} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          z₂ = [0.574·0.1+0.668·0.2+0.750·0.3, 0.574·0.4+0.668·0.5+0.750·0.6] + b₂
        </text>
        <text x={40} y={316} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
          &nbsp;&nbsp;&nbsp;= [0.416, 1.014] + [0.1, 0.2] = [0.516, 1.214]
        </text>

        {/* Output 상세 */}
        <rect x={20} y={332} width={600} height={56} rx={6}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.8} />
        <text x={32} y={350} fontSize={12} fontWeight={700} fill="#ef4444">Output 상세 전개:</text>
        <text x={40} y={368} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          W₃ = [[0.1], [0.2]],  b₃ = [0.1]
        </text>
        <text x={40} y={382} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
          z₃ = 0.626·0.1 + 0.771·0.2 + 0.1 = 0.217 + 0.1 = 0.317
        </text>

        {/* 배치 처리 노트 */}
        <rect x={20} y={398} width={600} height={34} rx={6}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={1} />
        <text x={32} y={420} fontSize={11} fontWeight={700} fill="#8b5cf6">
          배치 처리: X.shape=(batch, 2), Z₁=X@W₁+b₁, A₁=σ(Z₁), ... — GPU 병렬화로 수백 샘플 동시 계산
        </text>
      </svg>
    </div>
  );
}
