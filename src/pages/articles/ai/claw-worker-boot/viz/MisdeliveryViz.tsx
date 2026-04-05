import { ActionBox, AlertBox } from '@/components/viz/boxes';

export default function MisdeliveryViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Prompt Misdelivery — 4단계 복구</text>

        <defs>
          <marker id="md-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* 정상 흐름 */}
        <ActionBox x={30} y={58} w={118} h={42}
          label="send prompt"
          sub="write_input()"
          color="#3b82f6" />

        <AlertBox x={170} y={58} w={118} h={42}
          label="에코백 대기"
          sub="max 2s timeout"
          color="#f59e0b" />

        <line x1={148} y1={79} x2={170} y2={79} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#md-arr)" />

        {/* 타임아웃 발생 */}
        <AlertBox x={310} y={58} w={220} h={42}
          label="Misdelivery 감지"
          sub="screen에 prompt 없음"
          color="#ef4444" />

        <line x1={288} y1={79} x2={310} y2={79} stroke="#ef4444" strokeWidth={1.2} markerEnd="url(#md-arr)" />

        {/* 복구 4단계 */}
        {[
          { label: '1. 재시도 (3회)', sub: '지수 백오프 500ms, 1s, 1.5s', color: '#3b82f6' },
          { label: '2. Enter 키 전송', sub: 'Prompt 대기 상태 풀기', color: '#8b5cf6' },
          { label: '3. 재전송 시도', sub: 'send_with_verification()', color: '#f59e0b' },
          { label: '4. Worker 재시작', sub: 'SIGTERM → SIGKILL', color: '#ef4444' },
        ].map((step, i) => (
          <g key={i}>
            <rect x={40} y={128 + i * 34} width={480} height={28} rx={4}
              fill={step.color} fillOpacity={0.1} stroke={step.color} strokeWidth={0.6} />
            <rect x={40} y={128 + i * 34} width={3} height={28} fill={step.color} rx={1} />
            <text x={55} y={146 + i * 34} fontSize={10} fontWeight={700} fill={step.color}>
              {step.label}
            </text>
            <text x={505} y={146 + i * 34} textAnchor="end" fontSize={9}
              fill="var(--muted-foreground)">{step.sub}</text>
          </g>
        ))}

        <text x={280} y={288} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">Misdelivery rate &gt; 5% 시 경고 — 환경 문제 시그널</text>
      </svg>
    </div>
  );
}
