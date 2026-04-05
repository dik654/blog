export default function ActivationTimelineViz() {
  const events = [
    { year: 1943, fn: 'Step', who: 'McCulloch-Pitts', note: '이진 출력 · 학습 불가', color: '#94a3b8' },
    { year: 1958, fn: 'Sigmoid', who: 'Rosenblatt', note: 'S커브 · 확률 해석', color: '#3b82f6' },
    { year: 1986, fn: 'Tanh 전성기', who: 'Rumelhart', note: 'Backprop 실용화', color: '#10b981' },
    { year: 2010, fn: 'ReLU', who: 'Nair-Hinton', note: '딥러닝 혁명 촉매', color: '#ef4444' },
    { year: 2012, fn: 'AlexNet + ReLU', who: 'ImageNet', note: 'CNN 혁명', color: '#ef4444' },
    { year: 2015, fn: 'Leaky/PReLU/ELU', who: '-', note: 'Dying ReLU 해결', color: '#f59e0b' },
    { year: 2016, fn: 'GELU', who: 'Transformer', note: 'BERT/GPT 채택', color: '#8b5cf6' },
    { year: 2017, fn: 'Swish', who: 'NAS 발견', note: 'EfficientNet', color: '#8b5cf6' },
    { year: 2020, fn: 'SwiGLU', who: 'LLaMA/PaLM', note: '현대 LLM 표준', color: '#06b6d4' },
  ];

  const yMin = 1940, yMax = 2025;
  const plotX = (y: number) => 50 + ((y - yMin) / (yMax - yMin)) * 540;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 360" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">활성화 함수 진화 타임라인 (1943 ~ 2020+)</text>

        {/* 메인 라인 */}
        <line x1={50} y1={280} x2={590} y2={280} stroke="var(--border)" strokeWidth={2} />

        {/* 연도 눈금 */}
        {[1950, 1970, 1990, 2010, 2020].map((y) => (
          <g key={y}>
            <line x1={plotX(y)} y1={276} x2={plotX(y)} y2={284} stroke="var(--border)" strokeWidth={1.2} />
            <text x={plotX(y)} y={300} fontSize={11} fontWeight={600} fill="var(--muted-foreground)" textAnchor="middle">{y}</text>
          </g>
        ))}

        {/* 이벤트 노드 */}
        {events.map((e, i) => {
          const x = plotX(e.year);
          const alt = i % 2 === 0;
          const yNode = alt ? 175 : 255;
          const yYear = alt ? 125 : 265;
          const yFn = alt ? 145 : 218;
          const yWho = alt ? 160 : 233;
          const yNote = alt ? 100 : 320;
          return (
            <g key={i}>
              <line x1={x} y1={280} x2={x} y2={yNode} stroke={e.color} strokeWidth={1.5} strokeDasharray="2 2" opacity={0.5} />
              <circle cx={x} cy={yNode} r={6} fill={e.color} fillOpacity={0.3} stroke={e.color} strokeWidth={2} />

              {/* 연도 */}
              <text x={x} y={yYear} textAnchor="middle" fontSize={10} fontWeight={700} fill={e.color}>{e.year}</text>
              {/* 함수명 */}
              <text x={x} y={yFn} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">{e.fn}</text>
              {/* 발견자 */}
              <text x={x} y={yWho} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{e.who}</text>
            </g>
          );
        })}

        {/* 2024 선택 기준 */}
        <rect x={20} y={333} width={600} height={22} rx={4}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.6} />
        <text x={320} y={349} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">
          2024 선택: CNN→ReLU | Transformer→GELU | LLM→SwiGLU | Mobile→Hard Swish | RNN gate→Tanh | Output→Sigmoid/Softmax
        </text>
      </svg>
    </div>
  );
}
