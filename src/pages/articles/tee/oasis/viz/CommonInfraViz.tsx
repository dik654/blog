import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Identity — 노드 신원', body: 'Ed25519 서명 키 + libp2p Peer ID + TLS 인증서.\n노드 등록 시 Registry 에 공개키 게시.' },
  { label: 'P2P (libp2p) — 네트워킹', body: 'GossipSub 으로 Tx·Commitment 전파.\nKademlia DHT 로 peer discovery, Yamux 로 stream multiplex.' },
  { label: 'IPC — Host ↔ Runtime 통신', body: 'Unix socket + length-prefixed CBOR.\n로컬이라 암호화 불필요 — 단, sandbox 내부.' },
  { label: 'Metrics — 운영 가시성', body: 'Prometheus exporter + Health endpoint.\n스크레이핑으로 노드 건강 상태 모니터링.' },
];

const COMPONENTS = [
  { name: 'Identity', sub: 'Ed25519 + TLS', color: '#6366f1', x: 20,  y: 20 },
  { name: 'P2P',      sub: 'libp2p stack',  color: '#10b981', x: 130, y: 20 },
  { name: 'IPC',      sub: 'CBOR + UDS',    color: '#f59e0b', x: 240, y: 20 },
  { name: 'Metrics',  sub: 'Prometheus',    color: '#a855f7', x: 350, y: 20 },
];

const SUB = [
  // Identity
  [
    { x: 30,  y: 110, label: 'sign key',  c: '#6366f1' },
    { x: 30,  y: 142, label: 'peer ID',   c: '#6366f1' },
    { x: 30,  y: 174, label: 'TLS cert',  c: '#6366f1' },
  ],
  // P2P
  [
    { x: 140, y: 110, label: 'GossipSub', c: '#10b981' },
    { x: 140, y: 142, label: 'Kad-DHT',   c: '#10b981' },
    { x: 140, y: 174, label: 'Yamux',     c: '#10b981' },
  ],
  // IPC
  [
    { x: 250, y: 110, label: 'Unix sock', c: '#f59e0b' },
    { x: 250, y: 142, label: 'CBOR',      c: '#f59e0b' },
    { x: 250, y: 174, label: 'len-pref',  c: '#f59e0b' },
  ],
  // Metrics
  [
    { x: 360, y: 110, label: 'Prom exp',  c: '#a855f7' },
    { x: 360, y: 142, label: 'health',    c: '#a855f7' },
    { x: 360, y: 174, label: 'logs',      c: '#a855f7' },
  ],
];

export default function CommonInfraViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {COMPONENTS.map((c, i) => {
            const active = step === i;
            return (
              <motion.g key={c.name} animate={{ opacity: active ? 1 : 0.4 }}>
                <ModuleBox x={c.x} y={c.y} w={100} h={48}
                  label={c.name} sub={c.sub} color={c.color} />
              </motion.g>
            );
          })}

          {/* details for each */}
          {SUB[step].map((s, i) => (
            <motion.g key={s.label}
              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}>
              <DataBox x={s.x} y={s.y} w={100} h={26} label={s.label} color={s.c} outlined />
              {/* connector from header */}
              <motion.line x1={COMPONENTS[step].x + 50} y1={68} x2={s.x + 50} y2={s.y}
                stroke={s.c} strokeWidth={0.6} strokeDasharray="3,2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }} />
            </motion.g>
          ))}

          <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            모든 노드 유형이 공유하는 기반 서비스
          </text>
        </svg>
      )}
    </StepViz>
  );
}
