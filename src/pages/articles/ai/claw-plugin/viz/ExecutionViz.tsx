import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

export default function ExecutionViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">플러그인 도구 실행 — 7단계</text>

        <defs>
          <marker id="ex-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {[
          { label: '1. Command 조립', sub: 'entrypoint + --tool arg', color: '#3b82f6' },
          { label: '2. rlimit 적용', sub: 'CPU, 메모리, 파일 크기', color: '#f59e0b' },
          { label: '3. 환경 변수 설정', sub: 'CLAW_PLUGIN, CLAW_TOOL', color: '#8b5cf6' },
          { label: '4. spawn()', sub: 'tokio::process::Command', color: '#10b981' },
          { label: '5. stdin JSON 전송', sub: 'serde_json::to_vec', color: '#3b82f6' },
          { label: '6. timeout 30s', sub: 'tokio::time::timeout', color: '#f59e0b' },
          { label: '7. 결과 파싱', sub: 'exit code + stdout JSON', color: '#10b981' },
        ].map((step, i) => (
          <g key={i}>
            <rect x={40} y={56 + i * 32} width={480} height={28} rx={4}
              fill={step.color} fillOpacity={0.08} stroke={step.color} strokeWidth={0.5} />
            <rect x={40} y={56 + i * 32} width={3} height={28} fill={step.color} rx={1} />
            <text x={55} y={74 + i * 32} fontSize={10} fontWeight={700}
              fill={step.color}>{step.label}</text>
            <text x={505} y={74 + i * 32} textAnchor="end" fontSize={9} fontFamily="monospace"
              fill="var(--muted-foreground)">{step.sub}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
