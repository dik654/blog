export default function NNCompositionViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 340" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={26} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">신경망 = 함수 합성 — NN(x) = f⁽ᴸ⁾ ∘ ... ∘ f⁽¹⁾(x)</text>

        <defs>
          <marker id="nn-arr" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
            <path d="M0,0 L8,4.5 L0,9" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* 입력 x */}
        <circle cx={50} cy={130} r={28} fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={2.5} />
        <text x={50} y={125} textAnchor="middle" fontSize={16} fontWeight={700} fill="#3b82f6">x</text>
        <text x={50} y={142} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">a⁽⁰⁾</text>

        <line x1={80} y1={130} x2={115} y2={130} stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#nn-arr)" />

        {/* Layer 1 박스 */}
        <rect x={115} y={60} width={155} height={140} rx={10}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={2} />
        <text x={192} y={84} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">Layer 1</text>

        {/* z^(1) */}
        <rect x={128} y={96} width={130} height={34} rx={6}
          fill="var(--muted)" fillOpacity={0.5} stroke="var(--border)" strokeWidth={1} />
        <text x={193} y={112} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--foreground)">
          z⁽¹⁾ = W⁽¹⁾·x + b⁽¹⁾
        </text>
        <text x={193} y={124} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          선형 변환
        </text>

        {/* 화살표 */}
        <line x1={193} y1={132} x2={193} y2={148} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#nn-arr)" />

        {/* a^(1) */}
        <rect x={128} y={150} width={130} height={34} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={193} y={166} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--foreground)">
          a⁽¹⁾ = f⁽¹⁾(z⁽¹⁾)
        </text>
        <text x={193} y={178} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">
          비선형 활성화
        </text>

        <line x1={270} y1={130} x2={305} y2={130} stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#nn-arr)" />

        {/* ··· 중간 층 ··· */}
        <text x={340} y={136} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--muted-foreground)">···</text>
        <text x={340} y={160} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">(L-2 층)</text>

        <line x1={370} y1={130} x2={405} y2={130} stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#nn-arr)" />

        {/* Layer L 박스 */}
        <rect x={405} y={60} width={155} height={140} rx={10}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={2} />
        <text x={482} y={84} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ef4444">Layer L (출력)</text>

        {/* z^(L) */}
        <rect x={418} y={96} width={130} height={34} rx={6}
          fill="var(--muted)" fillOpacity={0.5} stroke="var(--border)" strokeWidth={1} />
        <text x={483} y={112} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--foreground)">
          z⁽ᴸ⁾ = W⁽ᴸ⁾·a⁽ᴸ⁻¹⁾ + b⁽ᴸ⁾
        </text>

        <line x1={483} y1={132} x2={483} y2={148} stroke="#8b5cf6" strokeWidth={1.5} markerEnd="url(#nn-arr)" />

        {/* a^(L) */}
        <rect x={418} y={150} width={130} height={34} rx={6}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={483} y={166} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--foreground)">
          a⁽ᴸ⁾ = f⁽ᴸ⁾(z⁽ᴸ⁾)
        </text>

        <line x1={555} y1={130} x2={578} y2={130} stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#nn-arr)" />

        {/* 출력 ŷ */}
        <circle cx={608} cy={130} r={28} fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={2.5} />
        <text x={608} y={125} textAnchor="middle" fontSize={16} fontWeight={700} fill="#10b981">ŷ</text>
        <text x={608} y={142} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">a⁽ᴸ⁾</text>

        {/* 하단 기호 설명 */}
        <rect x={20} y={224} width={600} height={100} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.8} />
        <text x={32} y={246} fontSize={12} fontWeight={700} fill="var(--foreground)">기호 정의</text>
        <text x={40} y={266} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          W⁽ˡ⁾: l층 가중치 행렬 (크기 n_l × n_(l-1))
        </text>
        <text x={40} y={282} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          b⁽ˡ⁾: l층 편향 벡터 (크기 n_l)
        </text>
        <text x={40} y={298} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          f⁽ˡ⁾: l층 활성화 함수 (sigmoid, ReLU, softmax ...)
        </text>
        <text x={40} y={314} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          a⁽⁰⁾ = x (입력),  a⁽ᴸ⁾ = ŷ (출력)
        </text>
      </svg>
    </div>
  );
}
