import { ModuleBox } from '@/components/viz/boxes';

export default function ProviderViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">ProviderClient — 4 프로바이더, 2 구현</text>

        {/* Trait */}
        <rect x={175} y={54} width={210} height={48} rx={8}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={280} y={76} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          trait ProviderClient
        </text>
        <text x={280} y={92} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          send_message · count_tokens · model_info
        </text>

        <defs>
          <marker id="pv-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Implementations */}
        <line x1={230} y1={102} x2={118} y2={130} stroke="#3b82f6" strokeWidth={1.1} />
        <line x1={330} y1={102} x2={442} y2={130} stroke="#3b82f6" strokeWidth={1.1} />

        <ModuleBox x={48} y={136} w={150} h={58}
          label="AnthropicClient"
          sub="Claude (native)"
          color="#3b82f6" />

        <ModuleBox x={362} y={136} w={150} h={58}
          label="OpenAICompatClient"
          sub="OpenAI 호환"
          color="#10b981" />

        {/* Providers using OpenAICompatClient */}
        <text x={437} y={218} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="var(--foreground)">
          OpenAIKind enum
        </text>
        <g transform="translate(362, 226)">
          {['OpenAI', 'xAI', 'Azure', 'Custom'].map((kind, i) => (
            <g key={kind} transform={`translate(${(i % 4) * 38}, 0)`}>
              <rect x={0} y={0} width={36} height={22} rx={2}
                fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={0.7} />
              <text x={18} y={15} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="#10b981">{kind}</text>
            </g>
          ))}
        </g>

        {/* Anthropic */}
        <text x={123} y={218} textAnchor="middle" fontSize={9.5} fontWeight={600} fill="var(--foreground)">
          전용 구현
        </text>
        <g transform="translate(83, 226)">
          <rect x={0} y={0} width={80} height={22} rx={2}
            fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={0.7} />
          <text x={40} y={15} textAnchor="middle" fontSize={9} fontWeight={600}
            fill="#3b82f6">Anthropic</text>
        </g>

        <text x={280} y={270} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">base_url만 바꾸면 다른 프로바이더 — 4개 지원 with 2 구현</text>
      </svg>
    </div>
  );
}
