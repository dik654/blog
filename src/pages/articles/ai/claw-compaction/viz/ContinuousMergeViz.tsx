export default function ContinuousMergeViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 320" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Continuous Compaction — 연속 압축 & 병합</text>

        {/* Timeline axis */}
        <line x1={40} y1={180} x2={520} y2={180} stroke="#94a3b8" strokeWidth={1.5} />

        {/* Checkpoint markers */}
        {[
          { x: 55, label: 't=0', desc: 'start' },
          { x: 185, label: 't=T1', desc: 'compact #1' },
          { x: 315, label: 't=T2', desc: 'compact #2' },
          { x: 445, label: 't=T3', desc: 'compact #3' },
          { x: 510, label: 'now', desc: '' },
        ].map((m, i) => (
          <g key={i}>
            <line x1={m.x} y1={174} x2={m.x} y2={186} stroke="#94a3b8" strokeWidth={1.3} />
            <text x={m.x} y={166} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
              {m.label}
            </text>
            {m.desc && (
              <text x={m.x} y={200} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                {m.desc}
              </text>
            )}
          </g>
        ))}

        {/* Session bars showing evolution */}
        {/* Before compact 1: 100 messages */}
        <rect x={55} y={74} width={130} height={28} rx={4}
          fill="#3b82f6" fillOpacity={0.45} stroke="#3b82f6" strokeWidth={1} />
        <text x={120} y={92} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">100 msgs</text>

        {/* After compact 1: S1 + 30 recent */}
        <rect x={185} y={74} width={34} height={28} rx={4}
          fill="#8b5cf6" fillOpacity={0.55} stroke="#8b5cf6" strokeWidth={1} />
        <text x={202} y={92} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">S1</text>
        <rect x={219} y={74} width={80} height={28} rx={4}
          fill="#3b82f6" fillOpacity={0.45} stroke="#3b82f6" strokeWidth={1} />
        <text x={259} y={92} textAnchor="middle" fontSize={9} fill="#fff">30 recent</text>

        {/* After compact 2: merge(S1, S2) + 30 recent */}
        <rect x={315} y={74} width={44} height={28} rx={4}
          fill="#8b5cf6" fillOpacity={0.75} stroke="#8b5cf6" strokeWidth={1} />
        <text x={337} y={92} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">S1+S2</text>
        <rect x={359} y={74} width={80} height={28} rx={4}
          fill="#3b82f6" fillOpacity={0.45} stroke="#3b82f6" strokeWidth={1} />
        <text x={399} y={92} textAnchor="middle" fontSize={9} fill="#fff">30 recent</text>

        {/* After compact 3: merged + 30 recent */}
        <rect x={445} y={74} width={50} height={28} rx={4}
          fill="#ec4899" fillOpacity={0.75} stroke="#ec4899" strokeWidth={1} />
        <text x={470} y={92} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">merged</text>

        {/* Arrows from bars down to timeline */}
        {[120, 259, 377, 470].map((x, i) => (
          <line key={i} x1={x} y1={102} x2={x} y2={174} stroke="#94a3b8" strokeWidth={0.9} strokeDasharray="2 2" />
        ))}

        {/* Evolution labels above bars */}
        <text x={120} y={66} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">raw messages</text>
        <text x={259} y={66} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">summary + window</text>
        <text x={377} y={66} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">merged + window</text>
        <text x={470} y={66} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">cumulative</text>

        {/* Legend & explanation */}
        <rect x={40} y={220} width={480} height={86} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={240} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          Merge 전략
        </text>
        <text x={56} y={260} fontSize={9.5} fontFamily="monospace" fill="var(--muted-foreground)">
          <tspan fontWeight={700} fill="#8b5cf6">S1 (prev summary)</tspan>
          <tspan> + </tspan>
          <tspan fontWeight={700} fill="#3b82f6">new messages</tspan>
          <tspan> → </tspan>
          <tspan fontWeight={700} fill="#8b5cf6">S2 (raw merged)</tspan>
        </text>
        <text x={56} y={278} fontSize={9.5} fontFamily="monospace" fill="var(--muted-foreground)">
          merge_compact_summaries(S1, S2) → 중복 제거 · 최신 정보 우선 → unified
        </text>
        <text x={56} y={296} fontSize={9.5} fontFamily="monospace" fill="var(--muted-foreground)">
          이전 compact 결과를 버리지 않고 누적 → 긴 세션 연속성 유지
        </text>
      </svg>
    </div>
  );
}
