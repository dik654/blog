export default function AccrueInternalViz() {
  // Timeline showing lazy accrual - interactions trigger index updates
  const events = [
    { t: 0, type: 'init', label: '초기', index: 1.0, lastUpdate: 0 },
    { t: 10, type: 'supply', label: 'Alice supply', index: 1.002, lastUpdate: 10 },
    { t: 25, type: 'skip', label: '(no update)', index: 1.002, lastUpdate: 10 },
    { t: 40, type: 'borrow', label: 'Bob borrow', index: 1.008, lastUpdate: 40 },
    { t: 60, type: 'skip', label: '(no update)', index: 1.008, lastUpdate: 40 },
    { t: 80, type: 'withdraw', label: 'Alice withdraw', index: 1.016, lastUpdate: 80 },
  ];

  const w = 440;
  const padLeft = 50;
  const toX = (t: number) => padLeft + (t / 90) * w;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxWidth: 700 }}>
        <text x={260} y={22} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--foreground)">accrueInternal() — Lazy Index Update</text>

        {/* 핵심 원리 */}
        <rect x={20} y={42} width={480} height={46} rx={8}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={260} y={62} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          매 블록 업데이트 ✗ · 사용자 interaction 시에만 갱신 ✓
        </text>
        <text x={260} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          timeElapsed = now - lastAccrualTime · 복리 근사 한 번에 적용
        </text>

        {/* 타임라인 */}
        <line x1={padLeft} y1={148} x2={padLeft + w} y2={148} stroke="var(--foreground)" strokeWidth={1} />

        {/* 눈금 */}
        {[0, 20, 40, 60, 80].map(t => {
          const x = toX(t);
          return (
            <g key={t}>
              <line x1={x} y1={144} x2={x} y2={152} stroke="var(--foreground)" strokeWidth={0.6} />
              <text x={x} y={166} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                {t}s
              </text>
            </g>
          );
        })}

        {/* 이벤트 마커 */}
        {events.map((e, i) => {
          const x = toX(e.t);
          const isUpdate = e.type !== 'skip' && e.type !== 'init';
          const isSkip = e.type === 'skip';
          return (
            <g key={i}>
              <circle cx={x} cy={148} r={isSkip ? 3 : 7}
                fill={isSkip ? '#6b7280' : isUpdate ? '#10b981' : '#3b82f6'}
                stroke="var(--card)" strokeWidth={1.5} />
              <text x={x} y={128} textAnchor="middle" fontSize={9} fontWeight={700}
                fill={isSkip ? '#6b7280' : isUpdate ? '#10b981' : '#3b82f6'}>
                {e.label}
              </text>
              {!isSkip && (
                <text x={x} y={186} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="var(--foreground)">
                  index={e.index.toFixed(3)}
                </text>
              )}
              {isSkip && (
                <text x={x} y={186} textAnchor="middle" fontSize={8} fontStyle="italic" fill="#6b7280">
                  skip
                </text>
              )}
            </g>
          );
        })}

        {/* 범례 */}
        <g transform="translate(30, 102)">
          <circle cx={0} cy={0} r={6} fill="#10b981" />
          <text x={12} y={4} fontSize={10} fontWeight={600} fill="#10b981">interaction (index 갱신)</text>
          <circle cx={180} cy={0} r={3} fill="#6b7280" />
          <text x={192} y={4} fontSize={10} fontWeight={600} fill="#6b7280">중간 블록 (skip)</text>
        </g>

        {/* 공식 */}
        <rect x={20} y={208} width={480} height={66} rx={8}
          fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.8} />
        <text x={260} y={228} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
          interaction 시 갱신 공식
        </text>
        <text x={260} y={248} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          newIndex = oldIndex × (1 + rate × timeElapsed)
        </text>
        <text x={260} y={265} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          timeElapsed = block.timestamp − lastAccrualTime_
        </text>

        {/* 이점 */}
        <rect x={20} y={286} width={480} height={44} rx={6}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={0.6} />
        <text x={36} y={306} fontSize={11} fontWeight={700} fill="#10b981">이점:</text>
        <text x={78} y={306} fontSize={10} fill="var(--foreground)">
          가스 절감 (매 블록 X) · 누적 정확성 (연속 근사)
        </text>
        <text x={36} y={322} fontSize={9} fill="var(--muted-foreground)">
          50초 동안 아무도 호출 안 하면 → 다음 호출이 50초치 이자 한 번에 적용
        </text>
      </svg>
    </div>
  );
}
