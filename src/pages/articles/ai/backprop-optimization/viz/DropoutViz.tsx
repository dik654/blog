export default function DropoutViz() {
  const layers = [
    { n: 4, x: 80 },
    { n: 5, x: 220 },
    { n: 5, x: 360 },
    { n: 3, x: 500 },
  ];

  const dropMask = [
    [1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [0, 1, 1, 0, 1],
    [1, 1, 1],
  ];

  const neuronY = (li: number, i: number) => {
    const count = layers[li].n;
    const totalH = (count - 1) * 34;
    return 130 - totalH / 2 + i * 34;
  };

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 580 280" className="w-full h-auto" style={{ maxWidth: 780 }}>
        <text x={290} y={20} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">Dropout — 훈련 시 뉴런 랜덤 비활성화 (p=0.5)</text>

        {/* 층 라벨 */}
        {['Input', 'Hidden 1', 'Hidden 2', 'Output'].map((name, li) => (
          <text key={li} x={layers[li].x} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            {name}
          </text>
        ))}

        {/* 연결선 — 뉴런 뒤에 렌더링되도록 먼저 그림 */}
        {layers.slice(0, -1).map((layer, li) => {
          const next = layers[li + 1];
          const lines: JSX.Element[] = [];
          for (let i = 0; i < layer.n; i++) {
            const yA = neuronY(li, i);
            for (let j = 0; j < next.n; j++) {
              const yB = neuronY(li + 1, j);
              const isActive = dropMask[li][i] === 1 && dropMask[li + 1][j] === 1;
              lines.push(
                <line key={`${li}-${i}-${j}`}
                  x1={layer.x + 16} y1={yA} x2={next.x - 16} y2={yB}
                  stroke={isActive ? '#94a3b8' : '#e2e8f0'}
                  strokeWidth={isActive ? 0.8 : 0.3}
                  opacity={isActive ? 0.4 : 0.12} />
              );
            }
          }
          return <g key={li}>{lines}</g>;
        })}

        {/* 뉴런들 — 연결선 위에 렌더링 */}
        {layers.map((layer, li) => (
          <g key={li}>
            {Array.from({ length: layer.n }).map((_, i) => {
              const cy = neuronY(li, i);
              const isDropped = dropMask[li][i] === 0;
              const color = li === 0 ? '#3b82f6' : li === layers.length - 1 ? '#10b981' : '#f59e0b';
              return (
                <g key={i}>
                  {/* 불투명 배경으로 선 가림 */}
                  <circle cx={layer.x} cy={cy} r={12} fill="var(--card)" />
                  <circle cx={layer.x} cy={cy} r={12}
                    fill={isDropped ? 'var(--muted)' : color}
                    fillOpacity={isDropped ? 0.15 : 0.25}
                    stroke={isDropped ? '#94a3b8' : color}
                    strokeWidth={isDropped ? 1.5 : 2}
                    strokeDasharray={isDropped ? '3 2' : undefined} />
                  {isDropped && (
                    <g>
                      <line x1={layer.x - 6} y1={cy - 6} x2={layer.x + 6} y2={cy + 6}
                        stroke="#ef4444" strokeWidth={1.8} />
                      <line x1={layer.x + 6} y1={cy - 6} x2={layer.x - 6} y2={cy + 6}
                        stroke="#ef4444" strokeWidth={1.8} />
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        ))}

        {/* 범례 — 하단 분리 */}
        <g transform="translate(0, 218)">
          <rect x={30} y={0} width={520} height={28} rx={6}
            fill="var(--muted)" fillOpacity={0.15} stroke="var(--border)" strokeWidth={0.5} />
          <circle cx={50} cy={14} r={8} fill="#f59e0b" fillOpacity={0.25} stroke="#f59e0b" strokeWidth={1.5} />
          <text x={64} y={18} fontSize={10} fill="var(--foreground)">활성 뉴런</text>

          <circle cx={145} cy={14} r={8} fill="var(--muted)" fillOpacity={0.15} stroke="#94a3b8" strokeWidth={1.2} strokeDasharray="3 2" />
          <line x1={139} y1={8} x2={151} y2={20} stroke="#ef4444" strokeWidth={1.5} />
          <line x1={151} y1={8} x2={139} y2={20} stroke="#ef4444" strokeWidth={1.5} />
          <text x={160} y={18} fontSize={10} fill="var(--foreground)">Dropped</text>

          <text x={290} y={18} fontSize={9} fill="var(--muted-foreground)">
            출력 스케일: ×1/(1−p) (inverted dropout)
          </text>
          <text x={490} y={18} fontSize={9} fill="var(--muted-foreground)">
            FC=0.5 Conv=0.1
          </text>
        </g>

        <text x={290} y={268} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          추론 시엔 Dropout 비활성화 — 전체 네트워크 사용
        </text>
      </svg>
    </div>
  );
}
