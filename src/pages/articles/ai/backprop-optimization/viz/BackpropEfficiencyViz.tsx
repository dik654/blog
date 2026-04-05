export default function BackpropEfficiencyViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 350" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">왜 Backprop인가 — 효율성 비교</text>

        {/* Naive (Finite Differences) */}
        <rect x={20} y={48} width={290} height={140} rx={10}
          fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={2} />
        <text x={165} y={70} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ef4444">
          ❌ Finite Differences (순진한 방법)
        </text>
        <line x1={32} y1={78} x2={298} y2={78} stroke="#ef4444" strokeOpacity={0.3} strokeWidth={1} />

        <text x={32} y={98} fontSize={11} fontFamily="monospace" fill="var(--foreground)">
          dL/dWᵢ ≈ (L(Wᵢ+ε) − L(Wᵢ)) / ε
        </text>
        <text x={32} y={118} fontSize={11} fill="var(--muted-foreground)">
          파라미터 N개마다 forward pass 1번 필요
        </text>
        <text x={32} y={138} fontSize={12} fontWeight={700} fill="#ef4444">
          복잡도: O(N × forward cost)
        </text>
        <text x={32} y={158} fontSize={10} fill="var(--muted-foreground)">
          GPT-4 (1.7T params):
        </text>
        <text x={32} y={174} fontSize={11} fontFamily="monospace" fontWeight={700} fill="#ef4444">
          → 1조 7천억 번 forward pass
        </text>

        {/* Backprop */}
        <rect x={330} y={48} width={290} height={140} rx={10}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={2} />
        <text x={475} y={70} textAnchor="middle" fontSize={14} fontWeight={700} fill="#10b981">
          ✅ Backpropagation
        </text>
        <line x1={342} y1={78} x2={608} y2={78} stroke="#10b981" strokeOpacity={0.3} strokeWidth={1} />

        <text x={342} y={98} fontSize={11} fontFamily="monospace" fill="var(--foreground)">
          Chain Rule + Dynamic Programming
        </text>
        <text x={342} y={118} fontSize={11} fill="var(--muted-foreground)">
          Forward 1회 + Backward 1회 = 전체 gradient
        </text>
        <text x={342} y={138} fontSize={12} fontWeight={700} fill="#10b981">
          복잡도: O(forward cost)
        </text>
        <text x={342} y={158} fontSize={10} fill="var(--muted-foreground)">
          GPT-4 (1.7T params):
        </text>
        <text x={342} y={174} fontSize={11} fontFamily="monospace" fontWeight={700} fill="#10b981">
          → Forward 1번 + Backward 1번
        </text>

        {/* 속도 비교 */}
        <rect x={20} y={200} width={600} height={46} rx={8}
          fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={1.8} />
        <text x={320} y={222} textAnchor="middle" fontSize={14} fontWeight={700} fill="#8b5cf6">
          Backprop이 수조 배 빠름 → 딥러닝 혁명의 핵심
        </text>
        <text x={320} y={238} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          Reverse mode autodiff — output 차원(scalar) ≪ parameter 차원일 때 압도적 우위
        </text>

        {/* 역사 타임라인 */}
        <text x={320} y={272} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          역사 타임라인
        </text>

        {/* timeline */}
        <line x1={50} y1={300} x2={590} y2={300} stroke="var(--border)" strokeWidth={1.5} />

        {[
          { year: '1970s', event: '기본 아이디어', who: 'Linnainmaa, Werbos', x: 90 },
          { year: '1986', event: '재발견', who: 'Rumelhart/Hinton/Williams', x: 240 },
          { year: '2010s', event: 'GPU 혁명', who: '딥러닝 부흥', x: 400 },
          { year: '현재', event: '모든 프레임워크', who: 'PyTorch, TF', x: 550 },
        ].map((t, i) => (
          <g key={i}>
            <circle cx={t.x} cy={300} r={5} fill="#8b5cf6" stroke="#8b5cf6" strokeWidth={1.5} />
            <text x={t.x} y={290} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">{t.year}</text>
            <text x={t.x} y={318} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">{t.event}</text>
            <text x={t.x} y={332} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{t.who}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
