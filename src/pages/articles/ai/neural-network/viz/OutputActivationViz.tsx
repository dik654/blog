export default function OutputActivationViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 400" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">출력층 활성화 — 3가지</text>

        {/* Identity */}
        <rect x={20} y={50} width={195} height={160} rx={10}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={2} />
        <text x={117} y={72} textAnchor="middle" fontSize={14} fontWeight={700} fill="#3b82f6">Identity</text>
        <text x={117} y={88} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">회귀 (Regression)</text>

        {/* mini chart */}
        <line x1={40} y1={140} x2={190} y2={140} stroke="var(--border)" strokeWidth={0.8} />
        <line x1={115} y1={110} x2={115} y2={170} stroke="var(--border)" strokeWidth={0.8} />
        <line x1={45} y1={170} x2={185} y2={110} stroke="#3b82f6" strokeWidth={2.5} />

        <text x={117} y={190} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--foreground)">
          f(z) = z
        </text>
        <text x={117} y={204} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          범위 (-∞, +∞) · 손실: MSE
        </text>

        {/* Sigmoid */}
        <rect x={225} y={50} width={195} height={160} rx={10}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={2} />
        <text x={322} y={72} textAnchor="middle" fontSize={14} fontWeight={700} fill="#10b981">Sigmoid</text>
        <text x={322} y={88} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">2클래스 분류</text>

        {/* mini chart */}
        <line x1={245} y1={160} x2={395} y2={160} stroke="var(--border)" strokeWidth={0.8} />
        <line x1={320} y1={110} x2={320} y2={175} stroke="var(--border)" strokeWidth={0.8} />
        {/* sigmoid curve */}
        <path d={`M ${245} ${168} Q ${300} ${168} ${320} ${135} Q ${340} ${118} ${395} ${118}`}
          fill="none" stroke="#10b981" strokeWidth={2.5} />

        <text x={322} y={190} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--foreground)">
          σ(z) = 1/(1+e⁻ᶻ)
        </text>
        <text x={322} y={204} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          범위 (0, 1) · 손실: BCE
        </text>

        {/* Softmax */}
        <rect x={430} y={50} width={195} height={160} rx={10}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={2} />
        <text x={527} y={72} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ef4444">Softmax</text>
        <text x={527} y={88} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">다중 클래스 분류</text>

        {/* Softmax bar chart */}
        {[
          { x: 450, label: 'c₀', p: 0.659, color: '#ef4444' },
          { x: 505, label: 'c₁', p: 0.242, color: '#ef4444' },
          { x: 560, label: 'c₂', p: 0.099, color: '#ef4444' },
        ].map((bar) => (
          <g key={bar.label}>
            <rect x={bar.x} y={170 - bar.p * 60} width={28} height={bar.p * 60}
              fill={bar.color} fillOpacity={0.4} stroke={bar.color} strokeWidth={1.2} />
            <text x={bar.x + 14} y={184} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">
              {bar.label}
            </text>
            <text x={bar.x + 14} y={170 - bar.p * 60 - 4} textAnchor="middle" fontSize={8} fontWeight={700} fill={bar.color}>
              {bar.p.toFixed(2)}
            </text>
          </g>
        ))}

        <text x={527} y={204} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          합=1 · 손실: CCE
        </text>

        {/* Softmax 예시 전개 */}
        <rect x={20} y={224} width={600} height={88} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.8} />
        <text x={32} y={244} fontSize={13} fontWeight={700} fill="#ef4444">Softmax 계산 예시 (3 클래스)</text>
        <text x={40} y={262} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          logits z = [2.0, 1.0, 0.1]
        </text>
        <text x={40} y={278} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          exp(z) = [7.389, 2.718, 1.105],  sum = 11.212
        </text>
        <text x={40} y={296} fontSize={11} fontFamily="monospace" fontWeight={700} fill="#ef4444">
          softmax = [0.659, 0.242, 0.099]  →  class 0 (66% 확률) 예측
        </text>

        {/* 수학적 필연: 같은 gradient */}
        <rect x={20} y={324} width={600} height={62} rx={8}
          fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={32} y={344} fontSize={13} fontWeight={700} fill="#f59e0b">수학적 필연 — Gradient 단순화</text>
        <text x={40} y={362} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          Sigmoid + BCE:   ∂L/∂z = ŷ − y
        </text>
        <text x={40} y={378} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          Softmax + CCE:   ∂L/∂z = ŷ − y   ← 같은 형태!
        </text>
      </svg>
    </div>
  );
}
