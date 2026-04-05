export default function ModernMLPViz() {
  const archs = [
    {
      name: 'Transformer FFN',
      color: '#3b82f6',
      struct: 'Linear → GELU → Linear',
      detail: '4x 확장 → 원복',
      usage: 'attention 뒤 2층 MLP',
      note: '파라미터 ≈ 2/3',
    },
    {
      name: 'MoE',
      color: '#8b5cf6',
      struct: 'Router → 전문가 MLP_i',
      detail: 'Top-k 선택 (예: k=2)',
      usage: 'GPT-4, Mixtral',
      note: '조건부 활성화',
    },
    {
      name: 'MLP-Mixer',
      color: '#10b981',
      struct: 'Token MLP ↔ Channel MLP',
      detail: 'attention 없음',
      usage: 'ViT 대안',
      note: '순수 MLP만으로 비전',
    },
    {
      name: 'gMLP',
      color: '#f59e0b',
      struct: 'MLP + Spatial Gating',
      detail: '게이팅 메커니즘',
      usage: '언어·비전',
      note: 'attention 유사 효과',
    },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 290" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={26} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">현대 아키텍처 속 MLP</text>

        {archs.map((arch, i) => {
          const x = 18 + i * 155;
          return (
            <g key={arch.name}>
              <rect x={x} y={48} width={145} height={210} rx={8}
                fill={arch.color} fillOpacity={0.08} stroke={arch.color} strokeWidth={1.8} />

              {/* 이름 */}
              <text x={x + 72} y={72} textAnchor="middle" fontSize={13} fontWeight={700} fill={arch.color}>
                {arch.name}
              </text>

              {/* 구분선 */}
              <line x1={x + 12} y1={82} x2={x + 133} y2={82} stroke={arch.color} strokeOpacity={0.3} strokeWidth={1} />

              {/* 구조 */}
              <text x={x + 10} y={100} fontSize={10} fontWeight={700} fill="var(--foreground)">구조</text>
              <text x={x + 10} y={116} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
                {arch.struct}
              </text>
              <text x={x + 10} y={131} fontSize={10} fill="var(--muted-foreground)">
                {arch.detail}
              </text>

              {/* 사용처 */}
              <text x={x + 10} y={155} fontSize={10} fontWeight={700} fill="var(--foreground)">사용처</text>
              <text x={x + 10} y={171} fontSize={10} fill="var(--muted-foreground)">
                {arch.usage}
              </text>

              {/* 특징 */}
              <text x={x + 10} y={195} fontSize={10} fontWeight={700} fill="var(--foreground)">특징</text>
              <text x={x + 10} y={211} fontSize={10} fill="var(--muted-foreground)">
                {arch.note}
              </text>

              {/* MLP 구성 요소 뱃지 */}
              <rect x={x + 10} y={228} width={125} height={24} rx={5}
                fill={arch.color} fillOpacity={0.15} stroke={arch.color} strokeWidth={0.8} />
              <text x={x + 72} y={244} textAnchor="middle" fontSize={10} fontWeight={700} fill={arch.color}>
                ← MLP가 핵심
              </text>
            </g>
          );
        })}

        <text x={320} y={280} textAnchor="middle" fontSize={11}
          fill="var(--muted-foreground)">MLP는 옛날 개념이 아님 — 현대 모델도 내부에서 MLP를 쌓고 조합하고 게이팅</text>
      </svg>
    </div>
  );
}
