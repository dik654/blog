import { ModuleBox } from '@/components/viz/boxes';

export default function RemoteViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 280" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={24} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">원격 세션 아키텍처 — 3계층</text>

        <defs>
          <marker id="rm-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Local CLI */}
        <ModuleBox x={35} y={70} w={150} h={60}
          label="로컬 CLI"
          sub="사용자 터미널"
          color="#3b82f6" />

        {/* Remote proxy */}
        <ModuleBox x={205} y={70} w={150} h={60}
          label="원격 프록시"
          sub="wss://server:8443"
          color="#f59e0b" />

        {/* Remote claw-code */}
        <ModuleBox x={375} y={70} w={150} h={60}
          label="원격 claw-code"
          sub="전체 세션 실행"
          color="#10b981" />

        {/* WebSocket arrows */}
        <line x1={185} y1={100} x2={205} y2={100} stroke="#3b82f6" strokeWidth={1.6} markerEnd="url(#rm-arr)" />
        <text x={195} y={92} textAnchor="middle" fontSize={9} fill="#3b82f6">WS</text>

        <line x1={355} y1={100} x2={375} y2={100} stroke="#3b82f6" strokeWidth={1.6} markerEnd="url(#rm-arr)" />
        <text x={365} y={92} textAnchor="middle" fontSize={9} fill="#3b82f6">IPC</text>

        {/* Data flows */}
        <rect x={35} y={158} width={490} height={82} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={280} y={180} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">데이터 흐름</text>

        <g transform="translate(52, 192)">
          <text x={0} y={12} fontSize={9} fontWeight={600} fill="#3b82f6">로컬 → 원격:</text>
          <text x={94} y={12} fontSize={9} fill="var(--muted-foreground)">user_input · permission_response · heartbeat</text>

          <text x={0} y={30} fontSize={9} fontWeight={600} fill="#10b981">원격 → 로컬:</text>
          <text x={94} y={30} fontSize={9} fill="var(--muted-foreground)">assistant_delta · tool_event · permission_prompt</text>
        </g>

        <text x={280} y={262} textAnchor="middle" fontSize={8.5}
          fill="var(--muted-foreground)">자동 재연결 · 지수 백오프 (1s → 60s 상한) · 세션 상태 원격 보존</text>
      </svg>
    </div>
  );
}
