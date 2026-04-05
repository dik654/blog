export default function DropoutViz() {
  // 네트워크 뉴런 배치
  const layers = [
    { n: 4, x: 80 },
    { n: 6, x: 240 },
    { n: 6, x: 400 },
    { n: 3, x: 560 },
  ];

  // Dropout mask (랜덤 0) - 50% drop
  const dropMask = [
    [1, 1, 1, 1], // input 유지
    [1, 0, 1, 0, 1, 0], // hidden1 절반 drop
    [0, 1, 1, 0, 1, 1], // hidden2 drop
    [1, 1, 1], // output 유지
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 640 320" className="w-full h-auto" style={{ maxWidth: 820 }}>
        <text x={320} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">Dropout — 훈련 시 뉴런 랜덤 비활성화 (p=0.5)</text>

        <defs>
          <marker id="d-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#94a3b8" />
          </marker>
        </defs>

        {/* 연결선 */}
        {layers.slice(0, -1).map((layer, li) => {
          const next = layers[li + 1];
          const lines: JSX.Element[] = [];
          for (let i = 0; i < layer.n; i++) {
            const yA = 80 + ((220 - 40) * i) / (layer.n - 1) + 20;
            for (let j = 0; j < next.n; j++) {
              const yB = 80 + ((220 - 40) * j) / (next.n - 1) + 20;
              const isActive = dropMask[li][i] === 1 && dropMask[li + 1][j] === 1;
              lines.push(
                <line key={`${li}-${i}-${j}`}
                  x1={layer.x + 14} y1={yA} x2={next.x - 14} y2={yB}
                  stroke={isActive ? '#94a3b8' : '#cbd5e1'}
                  strokeWidth={isActive ? 0.6 : 0.3}
                  opacity={isActive ? 0.5 : 0.15} />
              );
            }
          }
          return <g key={li}>{lines}</g>;
        })}

        {/* 뉴런들 */}
        {layers.map((layer, li) => (
          <g key={li}>
            {Array.from({ length: layer.n }).map((_, i) => {
              const cy = 80 + ((220 - 40) * i) / (layer.n - 1) + 20;
              const isDropped = dropMask[li][i] === 0;
              const color = li === 0 ? '#3b82f6' : li === layers.length - 1 ? '#10b981' : '#f59e0b';
              return (
                <g key={i}>
                  <circle cx={layer.x} cy={cy} r={12}
                    fill={isDropped ? 'var(--muted)' : color}
                    fillOpacity={isDropped ? 0.2 : 0.25}
                    stroke={isDropped ? '#94a3b8' : color}
                    strokeWidth={isDropped ? 1.5 : 2}
                    strokeDasharray={isDropped ? '3 2' : undefined} />
                  {isDropped && (
                    <g>
                      <line x1={layer.x - 8} y1={cy - 8} x2={layer.x + 8} y2={cy + 8}
                        stroke="#ef4444" strokeWidth={2} />
                      <line x1={layer.x + 8} y1={cy - 8} x2={layer.x - 8} y2={cy + 8}
                        stroke="#ef4444" strokeWidth={2} />
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        ))}

        {/* 층 라벨 */}
        {['Input', 'Hidden 1', 'Hidden 2', 'Output'].map((name, li) => (
          <text key={li} x={layers[li].x} y={60} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            {name}
          </text>
        ))}

        {/* 범례 */}
        <g transform="translate(30, 270)">
          <circle cx={10} cy={0} r={10} fill="#f59e0b" fillOpacity={0.25} stroke="#f59e0b" strokeWidth={2} />
          <text x={26} y={4} fontSize={11} fontWeight={600} fill="var(--foreground)">활성 뉴런</text>

          <circle cx={130} cy={0} r={10} fill="var(--muted)" fillOpacity={0.2} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 2" />
          <line x1={122} y1={-8} x2={138} y2={8} stroke="#ef4444" strokeWidth={2} />
          <line x1={138} y1={-8} x2={122} y2={8} stroke="#ef4444" strokeWidth={2} />
          <text x={146} y={4} fontSize={11} fontWeight={600} fill="var(--foreground)">Dropped (0으로)</text>

          <text x={320} y={4} fontSize={10} fill="var(--muted-foreground)">
            출력 스케일: × 1/(1−p) (inverted dropout)
          </text>
        </g>

        <text x={320} y={308} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          추론 시엔 Dropout 비활성화 — 전체 네트워크 사용 · 일반적: FC=0.5, Conv=0.1~0.2, Transformer=0.1
        </text>
      </svg>
    </div>
  );
}
