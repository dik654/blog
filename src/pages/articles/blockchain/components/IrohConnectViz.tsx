import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { label: 'DNS/DHT', x: 50, y: 30, color: '#6366f1' },
  { label: 'STUN', x: 155, y: 30, color: '#10b981' },
  { label: 'QUIC', x: 260, y: 30, color: '#f59e0b' },
];
const PA = { x: 80, y: 78 }, PB = { x: 230, y: 78 };

const STEPS = [
  { label: '① 노드 발견 — DNS/DHT 조회', body: 'NodeId(Ed25519 공개키)로 DNS, PKARR DHT, mDNS 동시 탐색.' },
  { label: '② 홀 펀칭 — STUN + NAT 통과', body: 'MagicSock으로 QUIC 소켓 추상화. STUN 공개IP 확인, UDP 홀 펀칭.' },
  { label: '③ QUIC 연결 — TLS 1.3 암호화', body: 'NodeId로 서버 인증. ALPN 프로토콜 협상. 다중 스트림 멀티플렉싱.' },
  { label: '④ 프로토콜 실행 — Blob/Gossip', body: 'BlobProtocol(Hash 검증 스트리밍), Gossip(topic pub-sub) 실행.' },
];

export default function IrohConnectViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 320 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ic" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {/* peers */}
          {[PA, PB].map((p, i) => (
            <g key={i}>
              <motion.circle cx={p.x} cy={p.y} r={12}
                animate={{ fill: step === 3 ? '#8b5cf620' : '#ffffff08',
                  stroke: step === 3 ? '#8b5cf6' : 'var(--border)', strokeWidth: 1.5 }}
                transition={sp} />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--foreground)">P{i + 1}</text>
            </g>
          ))}
          {/* middle nodes */}
          {NODES.map((n, i) => {
            const cur = i === step || (step === 3 && i === 2);
            return (
              <g key={n.label}>
                <motion.rect x={n.x - 28} y={n.y - 10} width={56} height={20} rx={5}
                  animate={{ fill: cur ? `${n.color}22` : `${n.color}06`,
                    stroke: n.color, strokeWidth: cur ? 2 : 0.6 }} transition={sp} />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={n.color} opacity={cur ? 1 : 0.35}>{n.label}</text>
              </g>
            );
          })}
          {/* arrows from peers to active node */}
          {step <= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp}>
              <line x1={PA.x} y1={PA.y - 14} x2={NODES[step].x - 10} y2={NODES[step].y + 12}
                stroke={NODES[step].color} strokeWidth={1} markerEnd="url(#ic)" />
              <line x1={PB.x} y1={PB.y - 14} x2={NODES[step].x + 10} y2={NODES[step].y + 12}
                stroke={NODES[step].color} strokeWidth={1} markerEnd="url(#ic)" />
            </motion.g>
          )}
          {/* direct link step 3 */}
          {step === 3 && (
            <motion.line x1={PA.x + 14} y1={PA.y} x2={PB.x - 14} y2={PB.y}
              stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 2"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
