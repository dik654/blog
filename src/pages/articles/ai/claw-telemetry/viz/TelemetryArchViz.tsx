import { ModuleBox } from '@/components/viz/boxes';

export default function TelemetryArchViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 330" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Telemetry — 3계층 파이프라인</text>

        <defs>
          <marker id="tl-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Sources */}
        <text x={280} y={54} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          Sources
        </text>
        <g transform="translate(30, 62)">
          {[
            { label: 'SessionTracer', color: '#3b82f6' },
            { label: 'UsageTracker', color: '#8b5cf6' },
            { label: 'ToolMetrics', color: '#10b981' },
            { label: 'ErrorCollector', color: '#ef4444' },
          ].map((src, i) => (
            <g key={src.label} transform={`translate(${i * 125}, 0)`}>
              <rect x={0} y={0} width={118} height={34} rx={4}
                fill={src.color} fillOpacity={0.1} stroke={src.color} strokeWidth={0.6} />
              <text x={59} y={22} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={src.color}>{src.label}</text>
            </g>
          ))}
        </g>

        {/* Arrows to Sink */}
        {[0, 1, 2, 3].map(i => (
          <line key={i}
            x1={89 + i * 125} y1={96}
            x2={280} y2={128}
            stroke="#3b82f6" strokeWidth={0.6} opacity={0.5} />
        ))}

        {/* TelemetrySink */}
        <ModuleBox x={170} y={130} w={220} h={50}
          label="TelemetrySink"
          sub="버퍼링 · 필터링 · 변환"
          color="#f59e0b" />

        {/* Arrows to Exporters */}
        {[0, 1, 2].map(i => (
          <line key={i}
            x1={280} y1={180}
            x2={113 + i * 165} y2={228}
            stroke="#3b82f6" strokeWidth={0.6} opacity={0.5} />
        ))}

        {/* Exporters */}
        <text x={280} y={210} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
          Exporters
        </text>
        <g transform="translate(30, 228)">
          {[
            { label: 'Stdout', sub: '디버그', color: '#6b7280' },
            { label: 'File (JSONL)', sub: '로컬 저장', color: '#3b82f6' },
            { label: 'HTTP', sub: '원격 서버', color: '#10b981' },
          ].map((exp, i) => (
            <g key={exp.label} transform={`translate(${i * 165}, 0)`}>
              <rect x={0} y={0} width={155} height={46} rx={4}
                fill={exp.color} fillOpacity={0.1} stroke={exp.color} strokeWidth={0.6} />
              <text x={77.5} y={20} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={exp.color}>{exp.label}</text>
              <text x={77.5} y={35} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">{exp.sub}</text>
            </g>
          ))}
        </g>

        <text x={280} y={315} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">기본 비활성 (opt-in) · 10초 주기 flush · 민감 정보 필터</text>
      </svg>
    </div>
  );
}
