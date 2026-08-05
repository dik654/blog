import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'ConnectionHandler 트레이트 구조' },
  { label: 'Handler vs Behaviour — 책임 분리' },
  { label: '예: Kademlia 1000 peers' },
  { label: 'Substream Negotiation 흐름' },
  { label: 'Keep-Alive 정책 비교' },
];

const ASSOC_TYPES = [
  { name: 'FromBehaviour', desc: 'Behaviour → Handler 메시지', color: '#6366f1' },
  { name: 'ToBehaviour', desc: 'Handler → Behaviour 이벤트', color: '#10b981' },
  { name: 'InboundProtocol', desc: '인바운드 upgrade 타입', color: '#f59e0b' },
  { name: 'OutboundProtocol', desc: '아웃바운드 upgrade 타입', color: '#ec4899' },
];

const KEEP_ALIVE = [
  { proto: 'Kademlia', value: 'query 진행 중만 true', color: '#6366f1' },
  { proto: 'Identify', value: '항상 false (one-shot)', color: '#94a3b8' },
  { proto: 'GossipSub', value: 'mesh peer 면 true', color: '#10b981' },
  { proto: 'Ping', value: 'interval 마다 toggle', color: '#f59e0b' },
];

export default function ConnectionHandlerDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: trait structure */}
          {step === 0 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                trait ConnectionHandler — 6 Associated Types + 4 Methods
              </text>
              {ASSOC_TYPES.map((t, i) => (
                <motion.g key={t.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <DataBox x={30 + (i % 2) * 220} y={45 + Math.floor(i / 2) * 44}
                    w={210} h={36} label={t.name} sub={t.desc} color={t.color} />
                </motion.g>
              ))}
              {[
                { x: 30, label: 'listen_protocol()', color: '#10b981' },
                { x: 145, label: 'poll()', color: '#6366f1' },
                { x: 235, label: 'on_behaviour_event()', color: '#f59e0b' },
                { x: 360, label: 'on_connection_event()', color: '#ec4899' },
              ].map((m, i) => (
                <motion.g key={m.label} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
                  <rect x={m.x} y={155} width={110} height={26} rx={4}
                    fill={m.color + '0a'} stroke={m.color + '60'} strokeWidth={0.7} />
                  <text x={m.x + 55} y={171} textAnchor="middle" fontSize={9}
                    fontWeight={700} fill={m.color}>{m.label}</text>
                </motion.g>
              ))}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                연결 1개당 Handler 1개 — substream I/O 담당
              </text>
            </g>
          )}

          {/* Step 1: Handler vs Behaviour */}
          {step === 1 && (
            <g>
              <ModuleBox x={40} y={40} w={170} h={48} label="Behaviour" sub="모든 peer / global state" color="#6366f1" />
              <ModuleBox x={270} y={40} w={170} h={48} label="Handler" sub="1 peer / local state" color="#ec4899" />

              {[
                { left: 'Protocol logic', right: 'Substream I/O', y: 110 },
                { left: 'Routing table', right: 'Per-peer RPC state', y: 138 },
                { left: 'Event coordination', right: 'Protocol framing', y: 166 },
                { left: 'NetworkBehaviour 구현', right: 'Keep-alive 결정', y: 194 },
              ].map((r, i) => (
                <motion.g key={r.y} initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <rect x={40} y={r.y} width={170} height={22} rx={3}
                    fill="#6366f10a" stroke="#6366f140" strokeWidth={0.6} />
                  <text x={50} y={r.y + 14} fontSize={8.5} fill="#6366f1">{r.left}</text>
                  <rect x={270} y={r.y} width={170} height={22} rx={3}
                    fill="#ec48990a" stroke="#ec489940" strokeWidth={0.6} />
                  <text x={280} y={r.y + 14} fontSize={8.5} fill="#ec4899">{r.right}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 2: Kademlia 1000 example */}
          {step === 2 && (
            <g>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Kademlia 로 1000 peers 연결 시
              </text>
              <ModuleBox x={150} y={50} w={180} h={50} label="1 Kademlia Behaviour" sub="routing table, queries" color="#6366f1" />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <line x1={240} y1={100} x2={240} y2={130} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#chr)" />
              </motion.g>
              <g>
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.g key={i} initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.04 }}>
                    <rect x={30 + i * 42} y={140} width={36} height={36} rx={5}
                      fill="#ec48990a" stroke="#ec4899" strokeWidth={0.7} />
                    <text x={48 + i * 42} y={161} textAnchor="middle" fontSize={9}
                      fontWeight={700} fill="#ec4899">H</text>
                  </motion.g>
                ))}
                <text x={448} y={161} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">×100</text>
              </g>
              <text x={240} y={205} textAnchor="middle" fontSize={9.5} fill="var(--foreground)">
                1000 ConnectionHandler instances (1 per peer)
              </text>
              <text x={240} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Handler = per-peer RPC state · Behaviour = shared routing
              </text>
              <defs>
                <marker id="chr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#94a3b8" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 3: Negotiation flow */}
          {step === 3 && (
            <g>
              <ActionBox x={20} y={30} w={130} h={42} label="OutboundReq" sub='"/ipfs/kad/1.0.0"' color="#ec4899" />
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }}
                x1={150} y1={51} x2={180} y2={51} stroke="#94a3b8" strokeWidth={1.4} markerEnd="url(#nra)" />
              <ActionBox x={180} y={30} w={130} h={42} label="muxer" sub="poll_outbound" color="#10b981" />
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }}
                x1={310} y1={51} x2={340} y2={51} stroke="#94a3b8" strokeWidth={1.4} markerEnd="url(#nra)" />
              <ActionBox x={340} y={30} w={130} h={42} label="ms-select" sub="협상" color="#6366f1" />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <line x1={405} y1={72} x2={405} y2={120} stroke="#10b981" strokeWidth={1.4} markerEnd="url(#nra)" />
                <rect x={250} y={120} width={180} height={40} rx={6}
                  fill="#10b9810a" stroke="#10b981" strokeWidth={0.8} />
                <text x={340} y={138} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
                  FullyNegotiatedOutbound
                </text>
                <text x={340} y={152} textAnchor="middle" fontSize={8.5} fill="var(--muted-foreground)">
                  Handler.on_connection_event()
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <line x1={250} y1={140} x2={170} y2={185} stroke="#6366f1" strokeWidth={1.4} markerEnd="url(#nra)" />
                <ActionBox x={30} y={170} w={140} h={42} label="Protocol I/O" sub="framed messages" color="#f59e0b" />
              </motion.g>
              <defs>
                <marker id="nra" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#94a3b8" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 4: keep alive */}
          {step === 4 && (
            <g>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                connection_keep_alive() 정책
              </text>
              {KEEP_ALIVE.map((k, i) => (
                <motion.g key={k.proto} initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={40} y={50 + i * 40} width={400} height={32} rx={5}
                    fill={k.color + '0a'} stroke={k.color + '50'} strokeWidth={0.7} />
                  <text x={60} y={71 + i * 40} fontSize={10} fontWeight={700} fill={k.color}>{k.proto}</text>
                  <text x={170} y={71 + i * 40} fontSize={9} fill="var(--foreground)">{k.value}</text>
                </motion.g>
              ))}
              <text x={240} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                false 면 idle timeout 후 close — 리소스 회수
              </text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
