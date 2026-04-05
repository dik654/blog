import { ActionBox } from '@/components/viz/boxes';

export default function SummaryCompressorViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">SummaryCompressor — 4단계 2차 압축</text>

        <defs>
          <marker id="sc-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        <ActionBox x={16} y={90} w={108} h={56}
          label="Summary"
          sub="(비대해진)"
          color="#ef4444" />

        <line x1={124} y1={118} x2={140} y2={118} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#sc-arr)" />

        {/* 4단계 */}
        {[
          { label: 'Extract', sub: 'key_facts', color: '#3b82f6' },
          { label: 'Clean', sub: 'remove_noise', color: '#8b5cf6' },
          { label: 'Rank', sub: 'by_relevance', color: '#f59e0b' },
          { label: 'Truncate', sub: 'to_budget', color: '#10b981' },
        ].map((step, i) => (
          <g key={i}>
            <rect x={140 + i * 98} y={90} width={86} height={56} rx={6}
              fill={step.color} fillOpacity={0.1} stroke={step.color} strokeWidth={0.8} />
            <text x={140 + i * 98 + 43} y={114} textAnchor="middle" fontSize={10} fontWeight={700}
              fill={step.color}>{step.label}</text>
            <text x={140 + i * 98 + 43} y={130} textAnchor="middle" fontSize={8.5}
              fill="var(--muted-foreground)">{step.sub}</text>
            {i < 3 && (
              <line x1={226 + i * 98} y1={118} x2={238 + i * 98} y2={118}
                stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#sc-arr)" />
            )}
          </g>
        ))}

        <line x1={534} y1={118} x2={548} y2={118} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#sc-arr)" />

        {/* Fact 5종류 */}
        <rect x={40} y={180} width={480} height={80} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={200} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">Fact 타입 5종 (extract 대상)</text>

        <g transform="translate(55, 210)">
          {[
            { label: 'FilePath', color: '#3b82f6' },
            { label: 'ErrorEvent', color: '#ef4444' },
            { label: 'Milestone', color: '#10b981' },
            { label: 'CurrentWork', color: '#f59e0b' },
            { label: 'Pending', color: '#8b5cf6' },
          ].map((fact, i) => (
            <g key={fact.label} transform={`translate(${i * 90}, 0)`}>
              <rect x={0} y={0} width={86} height={26} rx={3}
                fill={fact.color} fillOpacity={0.15} stroke={fact.color} strokeWidth={0.5} />
              <text x={43} y={17} textAnchor="middle" fontSize={8.5} fontWeight={600}
                fill={fact.color}>{fact.label}</text>
            </g>
          ))}
        </g>

        <text x={280} y={252} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">우선순위: CurrentWork(3.0) &gt; ErrorEvent(2.5) &gt; Milestone(2.0) &gt; 기타(1.0)</text>
      </svg>
    </div>
  );
}
