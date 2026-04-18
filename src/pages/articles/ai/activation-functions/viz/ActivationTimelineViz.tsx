export default function ActivationTimelineViz() {
  /* 각 이벤트에 고정 x 위치를 할당하여 겹침 방지 */
  const events = [
    { year: 1943, fn: 'Step', who: 'McCulloch-Pitts', color: '#94a3b8', px: 40 },
    { year: 1958, fn: 'Sigmoid', who: 'Rosenblatt', color: '#3b82f6', px: 110 },
    { year: 1986, fn: 'Tanh', who: 'Rumelhart', color: '#10b981', px: 200 },
    { year: 2010, fn: 'ReLU', who: 'Nair-Hinton', color: '#ef4444', px: 290 },
    { year: 2012, fn: 'AlexNet', who: 'ImageNet', color: '#ef4444', px: 360 },
    { year: 2015, fn: 'Leaky/PReLU', who: 'He et al.', color: '#f59e0b', px: 430 },
    { year: 2017, fn: 'GELU/Swish', who: 'Transformer', color: '#8b5cf6', px: 505 },
    { year: 2020, fn: 'SwiGLU', who: 'LLM 표준', color: '#06b6d4', px: 575 },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 200" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={20} textAnchor="middle" fontSize={15} fontWeight={700}
          fill="var(--foreground)">활성화 함수 진화 타임라인</text>

        {/* 메인 라인 */}
        <line x1={30} y1={100} x2={610} y2={100} stroke="var(--border)" strokeWidth={2} />

        {/* 이벤트 노드 */}
        {events.map((e, i) => {
          const above = i % 2 === 0;
          const nodeY = above ? 68 : 132;
          const yearY = above ? 48 : 158;
          const fnY = above ? 60 : 146;
          const whoY = above ? 80 : 122;
          return (
            <g key={i}>
              {/* stem line */}
              <line x1={e.px} y1={100} x2={e.px} y2={nodeY}
                stroke={e.color} strokeWidth={1.2} strokeDasharray="2 2" opacity={0.5} />
              {/* dot on timeline */}
              <circle cx={e.px} cy={100} r={3} fill={e.color} />

              {/* year */}
              <text x={e.px} y={yearY} textAnchor="middle" fontSize={9} fontWeight={700} fill={e.color}>{e.year}</text>
              {/* function name */}
              <text x={e.px} y={fnY} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">{e.fn}</text>
              {/* who */}
              <text x={e.px} y={whoY} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{e.who}</text>
            </g>
          );
        })}

        {/* 2024 선택 기준 */}
        <rect x={20} y={174} width={600} height={20} rx={4}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.6} />
        <text x={320} y={188} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          CNN→ReLU | Transformer→GELU | LLM→SwiGLU | Mobile→Hard Swish | RNN→Tanh
        </text>
      </svg>
    </div>
  );
}
