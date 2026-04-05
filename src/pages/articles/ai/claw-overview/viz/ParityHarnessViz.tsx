import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

export default function ParityHarnessViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 330" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Parity Harness — Rust ↔ Python 크로스 검증</text>

        <defs>
          <marker id="ph-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Mock Service */}
        <ModuleBox x={205} y={50} w={150} h={52}
          label="mock-anthropic"
          sub="localhost:3070 · 12 시나리오"
          color="#f59e0b" />

        {/* Rust runtime */}
        <ModuleBox x={30} y={140} w={160} h={58}
          label="Rust runtime"
          sub="실제 구현"
          color="#3b82f6" />

        {/* Python engine */}
        <ModuleBox x={370} y={140} w={160} h={58}
          label="Python PortRuntime"
          sub="명세 (behavioral spec)"
          color="#10b981" />

        {/* 화살표 SSE */}
        <line x1={230} y1={102} x2={115} y2={140} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#ph-arr)" />
        <line x1={330} y1={102} x2={445} y2={140} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#ph-arr)" />

        <text x={158} y={124} textAnchor="middle" fontSize={9} fill="#3b82f6">SSE stream</text>
        <text x={402} y={124} textAnchor="middle" fontSize={9} fill="#3b82f6">SSE stream</text>

        {/* Session outputs */}
        <DataBox x={30} y={228} w={160} h={46}
          label="Session 상태"
          sub="messages · tool_calls"
          color="#3b82f6" />

        <DataBox x={370} y={228} w={160} h={46}
          label="Session 상태"
          sub="messages · tool_calls"
          color="#10b981" />

        <line x1={110} y1={198} x2={110} y2={228} stroke="var(--border)" strokeWidth={0.8} markerEnd="url(#ph-arr)" />
        <line x1={450} y1={198} x2={450} y2={228} stroke="var(--border)" strokeWidth={0.8} markerEnd="url(#ph-arr)" />

        {/* Diff */}
        <ActionBox x={225} y={234} w={110} h={40}
          label="diff"
          sub="바이트 단위 비교"
          color="#ef4444" />

        <line x1={190} y1={251} x2={225} y2={251} stroke="#ef4444" strokeWidth={1.2} markerEnd="url(#ph-arr)" />
        <line x1={370} y1={251} x2={335} y2={251} stroke="#ef4444" strokeWidth={1.2} markerEnd="url(#ph-arr)" />

        <text x={280} y={310} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">불일치 시 빌드 실패 — 명세와 구현 자동 동기화 검증</text>
      </svg>
    </div>
  );
}
