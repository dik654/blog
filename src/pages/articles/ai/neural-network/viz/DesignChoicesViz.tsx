export default function DesignChoicesViz() {
  const dimensions = [
    {
      name: '깊이 (Depth)',
      icon: '📏',
      color: '#3b82f6',
      values: [
        { label: '얕은', val: '1~3 layers', note: '간단 태스크' },
        { label: '중간', val: '5~20', note: 'CNN, MLP' },
        { label: '깊은', val: '50~200', note: 'ResNet, Transformer' },
        { label: '매우 깊은', val: '1000+', note: '연구용' },
      ],
    },
    {
      name: '너비 (Width)',
      icon: '📐',
      color: '#10b981',
      values: [
        { label: '표준', val: '64 / 128 / 256', note: 'MLP 일반' },
        { label: '큰 모델', val: '512 / 1024', note: '복잡 태스크' },
        { label: '주의', val: '과적합 위험', note: '너무 넓으면' },
      ],
    },
    {
      name: '활성화',
      icon: '⚡',
      color: '#f59e0b',
      values: [
        { label: 'Hidden', val: 'ReLU, GELU, SwiGLU', note: '' },
        { label: 'Output', val: 'Softmax / Sigmoid / Linear', note: '태스크별' },
      ],
    },
    {
      name: '초기화',
      icon: '🎯',
      color: '#8b5cf6',
      values: [
        { label: 'Xavier', val: 'Sigmoid, Tanh', note: '분산 ∝ 1/n' },
        { label: 'He', val: 'ReLU 계열', note: '분산 ∝ 2/n' },
        { label: 'Orthogonal', val: 'RNN', note: '직교 행렬' },
      ],
    },
    {
      name: '정규화',
      icon: '🔧',
      color: '#ef4444',
      values: [
        { label: 'BatchNorm', val: '배치 단위', note: 'CNN 표준' },
        { label: 'LayerNorm', val: '층 단위', note: 'Transformer' },
        { label: 'Dropout', val: '0.1~0.5', note: '랜덤 제거' },
        { label: 'Weight decay', val: 'L2', note: '가중치 축소' },
      ],
    },
    {
      name: '구조',
      icon: '🏗️',
      color: '#06b6d4',
      values: [
        { label: 'Dense', val: 'FC / Conv / Attn', note: '' },
        { label: 'Skip', val: 'residual', note: 'ResNet' },
        { label: 'Gating', val: 'LSTM, gMLP', note: '' },
      ],
    },
  ];

  const rowSpacing = 46;
  const boxHeight = 58 + 4 * rowSpacing + 12; // 58 header + 4 rows + 12 padding = 254
  const viewBoxH = 48 + 2 * boxHeight + 36; // 600

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 640 ${viewBoxH}`} className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={26} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">신경망 설계 6차원</text>

        {dimensions.map((dim, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 20 + col * 207;
          const y = 48 + row * (boxHeight + 14);
          return (
            <g key={dim.name}>
              <rect x={x} y={y} width={195} height={boxHeight} rx={10}
                fill={dim.color} fillOpacity={0.08} stroke={dim.color} strokeWidth={2} />

              {/* 제목 */}
              <text x={x + 14} y={y + 26} fontSize={16}>{dim.icon}</text>
              <text x={x + 40} y={y + 28} fontSize={13} fontWeight={700} fill={dim.color}>
                {dim.name}
              </text>
              <line x1={x + 14} y1={y + 38} x2={x + 181} y2={y + 38} stroke={dim.color} strokeOpacity={0.3} strokeWidth={1} />

              {/* 값 목록 — 간격 46px로 확대 */}
              {dim.values.map((v, j) => {
                const rowY = y + 60 + j * rowSpacing;
                return (
                  <g key={j}>
                    <text x={x + 14} y={rowY} fontSize={11} fontWeight={700} fill="var(--foreground)">
                      {v.label}
                    </text>
                    <text x={x + 14} y={rowY + 15} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
                      {v.val}
                    </text>
                    {v.note && (
                      <text x={x + 14} y={rowY + 29} fontSize={9} fill="var(--muted-foreground)" opacity={0.8}>
                        {v.note}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        <text x={320} y={viewBoxH - 12} textAnchor="middle" fontSize={11}
          fill="var(--muted-foreground)">태스크·데이터·컴퓨팅 예산에 따라 6차원 값 조합이 결정됨</text>
      </svg>
    </div>
  );
}
