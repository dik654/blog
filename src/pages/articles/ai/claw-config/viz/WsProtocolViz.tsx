export default function WsProtocolViz() {
  const c2s = [
    { type: 'user_input',      desc: '사용자 메시지 전송' },
    { type: 'abort',           desc: '진행 중 작업 취소' },
    { type: 'resize_terminal', desc: '터미널 크기 변경' },
    { type: 'heartbeat',       desc: '연결 유지 ping' },
  ];

  const s2c = [
    { type: 'assistant_delta',    desc: 'LLM 응답 청크' },
    { type: 'tool_event',         desc: '도구 호출/결과' },
    { type: 'permission_prompt',  desc: '사용자 확인 요청' },
    { type: 'error',              desc: '오류 알림' },
  ];

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 560 360" className="w-full h-auto" style={{ maxWidth: 720 }}>
        <text x={280} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">WebSocket 메시지 프로토콜 — 8 타입 양방향</text>

        <defs>
          <marker id="ws-arr-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
          </marker>
          <marker id="ws-arr-l" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L5,3 L0,6" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Local client (left) */}
        <rect x={24} y={44} width={140} height={52} rx={6}
          fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.8} />
        <text x={94} y={64} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
          로컬 CLI
        </text>
        <text x={94} y={82} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          user terminal
        </text>

        {/* Remote runtime (right) */}
        <rect x={396} y={44} width={140} height={52} rx={6}
          fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={1.8} />
        <text x={466} y={64} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">
          원격 claw-code
        </text>
        <text x={466} y={82} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          runtime + LLM
        </text>

        {/* Arrow: client → server */}
        <line x1={164} y1={60} x2={396} y2={60} stroke="#3b82f6" strokeWidth={2} markerEnd="url(#ws-arr-r)" />
        <text x={280} y={55} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
          local → remote
        </text>

        {/* Arrow: server → client */}
        <line x1={396} y1={82} x2={164} y2={82} stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#ws-arr-l)" />
        <text x={280} y={95} textAnchor="middle" fontSize={9} fontWeight={700} fill="#8b5cf6">
          remote → local
        </text>

        {/* C2S messages */}
        <text x={94} y={122} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
          로컬 → 원격 (4)
        </text>
        {c2s.map((m, i) => {
          const y = 132 + i * 48;
          return (
            <g key={i}>
              <rect x={24} y={y} width={220} height={40} rx={5}
                fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1.2} />
              <rect x={24} y={y} width={3} height={40} fill="#3b82f6" rx={1} />
              {/* Direction arrow icon */}
              <text x={34} y={y + 25} fontSize={11} fontWeight={700} fill="#3b82f6">→</text>
              {/* Type name */}
              <text x={48} y={y + 18} fontSize={10} fontWeight={700} fontFamily="monospace" fill="#3b82f6">
                {m.type}
              </text>
              {/* Description */}
              <text x={48} y={y + 32} fontSize={9} fill="var(--muted-foreground)">
                {m.desc}
              </text>
            </g>
          );
        })}

        {/* S2C messages */}
        <text x={466} y={122} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
          원격 → 로컬 (4)
        </text>
        {s2c.map((m, i) => {
          const y = 132 + i * 48;
          return (
            <g key={i}>
              <rect x={316} y={y} width={220} height={40} rx={5}
                fill="#8b5cf6" fillOpacity={0.1} stroke="#8b5cf6" strokeWidth={1.2} />
              <rect x={316} y={y} width={3} height={40} fill="#8b5cf6" rx={1} />
              <text x={326} y={y + 25} fontSize={11} fontWeight={700} fill="#8b5cf6">←</text>
              <text x={340} y={y + 18} fontSize={10} fontWeight={700} fontFamily="monospace" fill="#8b5cf6">
                {m.type}
              </text>
              <text x={340} y={y + 32} fontSize={9} fill="var(--muted-foreground)">
                {m.desc}
              </text>
            </g>
          );
        })}

        {/* Bottom schema */}
        <rect x={24} y={330} width={512} height={22} rx={4}
          fill="var(--muted)" opacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
        <text x={34} y={345} fontSize={9.5} fontFamily="monospace" fill="var(--muted-foreground)">
          {`{ type: "...", id: <req_id>, payload: {...} }  // id로 요청-응답 매칭`}
        </text>
      </svg>
    </div>
  );
}
