import { ActionBox, DataBox } from '@/components/viz/boxes';

export default function ObserveViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 300" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">observe() — 화면 텍스트 기반 상태 추론</text>

        <defs>
          <marker id="ob-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L4,2.5 L0,5" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Worker process (pty) */}
        <rect x={20} y={56} width={164} height={96} rx={8}
          fill="var(--card)" stroke="#8b5cf6" strokeWidth={1} />
        <text x={102} y={76} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
          Worker 프로세스
        </text>
        <text x={102} y={92} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          pty (pseudo-terminal)
        </text>

        <rect x={30} y={102} width={144} height={40} rx={3}
          fill="#1f2937" />
        <text x={40} y={118} fontSize={9} fontFamily="monospace" fill="#10b981">
          $ cargo test
        </text>
        <text x={40} y={132} fontSize={9} fontFamily="monospace" fill="#10b981">
          running 42 tests...
        </text>

        {/* Screen capture */}
        <ActionBox x={216} y={68} w={118} h={72}
          label="get_screen"
          sub="최근 10줄"
          color="#3b82f6" />

        <line x1={184} y1={104} x2={216} y2={104} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#ob-arr)" />

        {/* Pattern matching */}
        <ActionBox x={366} y={68} w={164} h={72}
          label="infer_status"
          sub="패턴 매칭"
          color="#f59e0b" />

        <line x1={334} y1={104} x2={366} y2={104} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#ob-arr)" />

        {/* 4개 패턴 */}
        <g transform="translate(20, 174)">
          <rect x={0} y={0} width={520} height={110} rx={8}
            fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
          <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">4 가지 패턴 인식</text>

          <g transform="translate(15, 32)">
            <rect x={0} y={0} width={240} height={28} rx={3}
              fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={0.5} />
            <text x={10} y={18} fontSize={9} fontWeight={700} fill="#10b981">Completed:</text>
            <text x={82} y={18} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&apos;Task completed&apos;</text>
          </g>

          <g transform="translate(265, 32)">
            <rect x={0} y={0} width={240} height={28} rx={3}
              fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth={0.5} />
            <text x={10} y={18} fontSize={9} fontWeight={700} fill="#ef4444">Failed:</text>
            <text x={58} y={18} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&apos;Error:&apos;, &apos;panic:&apos;</text>
          </g>

          <g transform="translate(15, 68)">
            <rect x={0} y={0} width={240} height={28} rx={3}
              fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={0.5} />
            <text x={10} y={18} fontSize={9} fontWeight={700} fill="#f59e0b">WaitingInput:</text>
            <text x={95} y={18} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&apos;(y/n)&apos;, ends &apos;$&apos;</text>
          </g>

          <g transform="translate(265, 68)">
            <rect x={0} y={0} width={240} height={28} rx={3}
              fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={0.5} />
            <text x={10} y={18} fontSize={9} fontWeight={700} fill="#3b82f6">Working:</text>
            <text x={68} y={18} fontSize={9} fontFamily="monospace" fill="var(--foreground)">&apos;Running&apos;, &apos;...&apos;</text>
          </g>
        </g>
      </svg>
    </div>
  );
}
