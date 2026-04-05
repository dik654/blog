export default function LSTMGateViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 280" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">LSTM — Sigmoid(Gate) + Tanh(Candidate) 역할 분담</text>

        {/* Sigmoid gates */}
        <rect x={20} y={50} width={290} height={210} rx={10}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={2} />
        <text x={165} y={72} textAnchor="middle" fontSize={13} fontWeight={700} fill="#3b82f6">
          Sigmoid = "얼마나 통과시킬까" (0~1)
        </text>
        <text x={165} y={88} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          밸브 역할 — 범위 (0, 1)
        </text>

        {/* 3 gates */}
        {[
          { name: 'Forget Gate', formula: 'f_t = σ(W_f·[h,x])', y: 108, color: '#ef4444' },
          { name: 'Input Gate', formula: 'i_t = σ(W_i·[h,x])', y: 150, color: '#f59e0b' },
          { name: 'Output Gate', formula: 'o_t = σ(W_o·[h,x])', y: 192, color: '#10b981' },
        ].map((g, i) => (
          <g key={i}>
            <rect x={35} y={g.y} width={260} height={34} rx={5}
              fill={g.color} fillOpacity={0.15} stroke={g.color} strokeWidth={1.2} />
            <text x={48} y={g.y + 20} fontSize={11} fontWeight={700} fill={g.color}>
              {g.name}
            </text>
            <text x={165} y={g.y + 20} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
              {g.formula}
            </text>
          </g>
        ))}

        <text x={165} y={250} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          0 = "전부 차단", 1 = "전부 통과"
        </text>

        {/* Tanh candidates */}
        <rect x={330} y={50} width={290} height={210} rx={10}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={2} />
        <text x={475} y={72} textAnchor="middle" fontSize={13} fontWeight={700} fill="#8b5cf6">
          Tanh = "무엇을 표현할까" (−1~1)
        </text>
        <text x={475} y={88} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          값 생성 — 범위 (−1, 1)
        </text>

        {/* 2 usages */}
        {[
          { name: 'Candidate Cell', formula: 'C̃_t = tanh(W_C·[h,x])', y: 108, color: '#06b6d4' },
          { name: 'Hidden State', formula: 'h_t = o_t ⊙ tanh(C_t)', y: 150, color: '#ec4899' },
        ].map((g, i) => (
          <g key={i}>
            <rect x={345} y={g.y} width={260} height={34} rx={5}
              fill={g.color} fillOpacity={0.15} stroke={g.color} strokeWidth={1.2} />
            <text x={358} y={g.y + 20} fontSize={11} fontWeight={700} fill={g.color}>
              {g.name}
            </text>
            <text x={475} y={g.y + 20} fontSize={10} fontFamily="monospace" fill="var(--foreground)">
              {g.formula}
            </text>
          </g>
        ))}

        <text x={475} y={206} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
          역할: 새 정보의 부호·강도 표현
        </text>
        <text x={475} y={222} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          − 정보 빼기 가능, + 정보 추가
        </text>
        <text x={475} y={250} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Zero-centered → 셀 상태 폭주 방지
        </text>
      </svg>
    </div>
  );
}
