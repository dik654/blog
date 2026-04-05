export default function MnistArchViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 380" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={26} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">MNIST 2층 신경망 — 784 → 128 → 10</text>

        <defs>
          <marker id="ma-arr" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
            <path d="M0,0 L8,4.5 L0,9" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* MNIST 이미지 */}
        <rect x={30} y={90} width={80} height={80} rx={6}
          fill="var(--muted)" fillOpacity={0.4} stroke="var(--border)" strokeWidth={1.5} />
        {/* pseudo 7x7 grid */}
        {Array.from({ length: 49 }, (_, i) => {
          const col = i % 7;
          const row = Math.floor(i / 7);
          const isOn = [8, 9, 10, 15, 17, 22, 24, 29, 31, 36, 37, 38].includes(i);
          return (
            <rect key={i} x={35 + col * 10.5} y={95 + row * 10.5} width={9} height={9}
              fill={isOn ? '#3b82f6' : 'var(--card)'} fillOpacity={isOn ? 0.7 : 0.3} />
          );
        })}
        <text x={70} y={185} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">28×28 이미지</text>
        <text x={70} y={200} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">x ∈ ℝ⁷⁸⁴</text>

        <line x1={115} y1={130} x2={155} y2={130} stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#ma-arr)" />

        {/* Layer 1: 128 hidden units */}
        <rect x={160} y={48} width={150} height={210} rx={10}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={2} />
        <text x={235} y={70} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">Layer 1</text>
        <text x={235} y={86} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">128 hidden units</text>

        {/* 128 뉴런 줄임 표시 */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <circle key={i} cx={235} cy={110 + i * 15} r={5}
            fill="#10b981" fillOpacity={0.25} stroke="#10b981" strokeWidth={1} />
        ))}
        <text x={235} y={236} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--muted-foreground)">⋮</text>

        {/* z1 = W1·x + b1 */}
        <text x={235} y={254} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--foreground)">
          z₁ = W₁·x + b₁
        </text>

        <line x1={315} y1={150} x2={355} y2={150} stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#ma-arr)" />
        <text x={335} y={140} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">ReLU</text>

        {/* Layer 2: 10 output classes */}
        <rect x={360} y={48} width={150} height={210} rx={10}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={2} />
        <text x={435} y={70} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ef4444">Layer 2 (출력)</text>
        <text x={435} y={86} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">10 classes (0~9)</text>

        {/* 10 뉴런 */}
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i}>
            <circle cx={435} cy={108 + i * 14} r={5}
              fill="#ef4444" fillOpacity={0.25} stroke="#ef4444" strokeWidth={1} />
            <text x={450} y={112 + i * 14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">{i}</text>
          </g>
        ))}

        <line x1={515} y1={150} x2={555} y2={150} stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#ma-arr)" />
        <text x={535} y={140} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">Softmax</text>

        {/* 출력 ŷ */}
        <rect x={558} y={115} width={68} height={70} rx={8}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={2} />
        <text x={592} y={138} textAnchor="middle" fontSize={14} fontWeight={700} fill="#10b981">ŷ</text>
        <text x={592} y={156} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">P(y=k|x)</text>
        <text x={592} y={174} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">확률 분포</text>

        {/* 파라미터 수 계산 */}
        <rect x={20} y={280} width={600} height={90} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.8} />
        <text x={32} y={304} fontSize={13} fontWeight={700} fill="var(--foreground)">파라미터 수 계산</text>

        <text x={40} y={326} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          W₁: 128 × 784 = 100,352
        </text>
        <text x={240} y={326} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          b₁: 128
        </text>
        <text x={340} y={326} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          W₂: 10 × 128 = 1,280
        </text>
        <text x={540} y={326} fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          b₂: 10
        </text>

        <line x1={40} y1={338} x2={600} y2={338} stroke="var(--border)" strokeWidth={0.8} />

        <text x={40} y={358} fontSize={13} fontFamily="monospace" fontWeight={700} fill="#3b82f6">
          총 파라미터: 101,770개 (≈ 100K, 대부분이 W₁)
        </text>
      </svg>
    </div>
  );
}
