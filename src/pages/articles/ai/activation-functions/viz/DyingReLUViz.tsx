export default function DyingReLUViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 360" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Dying ReLU — 죽음의 사이클 + 방지책</text>

        <defs>
          <marker id="dr-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L7,4 L0,8" fill="#ef4444" />
          </marker>
        </defs>

        {/* 5단계 사이클 */}
        {[
          { step: 1, x: 60, y: 70, text: '초기화/학습 중', sub: 'w 크게 음수 됨', color: '#ef4444' },
          { step: 2, x: 200, y: 70, text: 'x·W + b 항상 음수', sub: '', color: '#ef4444' },
          { step: 3, x: 340, y: 70, text: 'ReLU 출력 = 0', sub: 'dead neuron', color: '#ef4444' },
          { step: 4, x: 480, y: 70, text: 'Gradient = 0', sub: '', color: '#ef4444' },
          { step: 5, x: 600, y: 70, text: '영구 dead', sub: 'W 업데이트 X', color: '#94a3b8' },
        ].map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r={32} fill={s.color} fillOpacity={0.15} stroke={s.color} strokeWidth={2} />
            <text x={s.x} y={s.y - 4} textAnchor="middle" fontSize={16} fontWeight={700} fill={s.color}>{s.step}</text>
            <text x={s.x} y={s.y + 46} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
              {s.text}
            </text>
            {s.sub && (
              <text x={s.x} y={s.y + 60} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {s.sub}
              </text>
            )}
            {/* 화살표 */}
            {i < 4 && (
              <line x1={s.x + 34} y1={s.y} x2={s.x + 98} y2={s.y} stroke="#ef4444" strokeWidth={1.8} markerEnd="url(#dr-arr)" />
            )}
          </g>
        ))}

        {/* 발생 조건 */}
        <rect x={20} y={158} width={290} height={92} rx={10}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1.8} />
        <text x={165} y={180} textAnchor="middle" fontSize={13} fontWeight={700} fill="#f59e0b">
          발생 조건
        </text>
        <text x={35} y={200} fontSize={11} fill="var(--muted-foreground)">• Large learning rate (overshoot)</text>
        <text x={35} y={216} fontSize={11} fill="var(--muted-foreground)">• Poor initialization (He init 아님)</text>
        <text x={35} y={232} fontSize={11} fill="var(--muted-foreground)">• Extreme gradients (no clipping)</text>
        <text x={35} y={248} fontSize={10} fontWeight={700} fill="#f59e0b">→ 전체 뉴런의 20~40%가 dead</text>

        {/* 방지책 */}
        <rect x={330} y={158} width={290} height={92} rx={10}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.8} />
        <text x={475} y={180} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">
          방지책 5가지
        </text>
        <text x={345} y={200} fontSize={11} fill="var(--muted-foreground)">✓ He initialization (W~N(0, 2/n_in))</text>
        <text x={345} y={216} fontSize={11} fill="var(--muted-foreground)">✓ LeakyReLU/PReLU (음수도 작은 gradient)</text>
        <text x={345} y={232} fontSize={11} fill="var(--muted-foreground)">✓ Low lr / BatchNorm / Gradient clip</text>

        {/* 2012 AlexNet 역사 */}
        <rect x={20} y={270} width={600} height={78} rx={10}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={1.8} />
        <text x={320} y={292} textAnchor="middle" fontSize={13} fontWeight={700} fill="#8b5cf6">
          2012 AlexNet의 비밀 — ReLU가 딥러닝 혁명을 일으킨 이유
        </text>
        <text x={35} y={312} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          1) 학습 속도: sigmoid 대비 6배 빠름 (단순 max 연산)
        </text>
        <text x={35} y={328} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          2) Gradient 보존: 양수 구간 f'(x)=1 → 깊은 망 학습 가능
        </text>
        <text x={35} y={344} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          3) Sparsity: ~50% 뉴런 활성 → 생물학적으로 현실적
        </text>
      </svg>
    </div>
  );
}
