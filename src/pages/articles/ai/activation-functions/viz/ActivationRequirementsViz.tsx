export default function ActivationRequirementsViz() {
  const reqs = [
    { n: 1, name: '비선형성', icon: '🔀', color: '#3b82f6', req: '필수', detail: '복잡 패턴 학습', exception: '-' },
    { n: 2, name: '미분 가능', icon: '∂', color: '#3b82f6', req: '필수', detail: 'Gradient descent', exception: 'subgradient OK' },
    { n: 3, name: '단조성', icon: '📈', color: '#10b981', req: '선호', detail: '학습 안정', exception: 'Swish/GELU 예외' },
    { n: 4, name: '기울기 보존', icon: '⚡', color: '#10b981', req: '선호', detail: '깊은 망 학습', exception: 'Sigmoid/Tanh 취약' },
    { n: 5, name: '계산 효율', icon: '⏱️', color: '#f59e0b', req: '실용', detail: '매 layer 호출', exception: 'exp/trig 느림' },
    { n: 6, name: '상한 없음', icon: '↗', color: '#f59e0b', req: '선호', detail: 'Saturation 방지', exception: 'ReLU 만족' },
    { n: 7, name: 'Zero-centered', icon: '⊙', color: '#f59e0b', req: '선호', detail: 'Zig-zag 방지', exception: 'Sigmoid 위반' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 500" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">좋은 활성화 함수의 7가지 조건</text>

        {reqs.map((r, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 20 + col * 310;
          const y = 44 + row * 94;
          return (
            <g key={r.n}>
              <rect x={x} y={y} width={300} height={78} rx={8}
                fill={r.color} fillOpacity={0.06} stroke={r.color} strokeWidth={1.5} />

              {/* 번호 원 */}
              <circle cx={x + 24} cy={y + 24} r={14} fill={r.color} fillOpacity={0.2} stroke={r.color} strokeWidth={1.5} />
              <text x={x + 24} y={y + 29} textAnchor="middle" fontSize={13} fontWeight={700} fill={r.color}>{r.n}</text>

              {/* 아이콘 + 이름 */}
              <text x={x + 52} y={y + 22} fontSize={14}>{r.icon}</text>
              <text x={x + 76} y={y + 24} fontSize={13} fontWeight={700} fill="var(--foreground)">{r.name}</text>

              {/* 우선순위 뱃지 */}
              <rect x={x + 225} y={y + 10} width={60} height={20} rx={10}
                fill={r.color} fillOpacity={0.2} stroke={r.color} strokeWidth={0.8} />
              <text x={x + 255} y={y + 24} textAnchor="middle" fontSize={10} fontWeight={700} fill={r.color}>{r.req}</text>

              {/* 디테일 */}
              <text x={x + 14} y={y + 52} fontSize={11} fill="var(--muted-foreground)">
                {r.detail}
              </text>
              {/* 예외 */}
              {r.exception !== '-' && (
                <text x={x + 14} y={y + 66} fontSize={10} fill="var(--muted-foreground)" opacity={0.7}>
                  ⚠ {r.exception}
                </text>
              )}
            </g>
          );
        })}

        {/* UAT 박스 */}
        <rect x={20} y={428} width={600} height={60} rx={10}
          fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={2} />
        <text x={320} y={450} textAnchor="middle" fontSize={13} fontWeight={700} fill="#8b5cf6">
          Universal Approximation Theorem (1989)
        </text>
        <text x={320} y={468} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--muted-foreground)">
          단일 은닉층 + 비선형 활성화 → 임의의 연속 함수 근사 가능 (단, 충분한 뉴런 필요)
        </text>
        <text x={320} y={482} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          실전: 깊이와 너비 trade-off, 깊은 망이 경험적으로 유리
        </text>
      </svg>
    </div>
  );
}
