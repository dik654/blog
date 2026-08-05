import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Transport Trait — Associated Types' },
  { label: 'Transport Trait — Methods (4)' },
  { label: 'TransportEvent 종류' },
  { label: 'Combinator Pattern — TCP+Noise+Yamux' },
  { label: 'OrTransport — multi-protocol 라우팅' },
  { label: '구현체 카탈로그' },
];

const TYPES = [
  { name: 'Output', desc: '연결 성공 시 산출 타입', color: '#10b981' },
  { name: 'Error', desc: 'Send + Sync error', color: '#ef4444' },
  { name: 'ListenerUpgrade', desc: 'Future<Output = Output>', color: '#6366f1' },
  { name: 'Dial', desc: 'Future<Output = Output>', color: '#f59e0b' },
];

const METHODS = [
  { name: 'listen_on(id, addr)', desc: '리스닝 시작 — Result<()>', color: '#10b981' },
  { name: 'remove_listener(id)', desc: '리스너 제거', color: '#ef4444' },
  { name: 'dial(addr, opts)', desc: 'Dial future 반환', color: '#f59e0b' },
  { name: 'poll(cx)', desc: 'TransportEvent 산출', color: '#8b5cf6' },
];

const EVENTS = [
  { name: 'Incoming', sub: 'upgrade Future + addrs', color: '#10b981' },
  { name: 'NewAddress', sub: 'listen_addr 추가', color: '#6366f1' },
  { name: 'AddressExpired', sub: 'addr 만료', color: '#f59e0b' },
  { name: 'ListenerClosed', sub: 'listener 종료', color: '#94a3b8' },
  { name: 'ListenerError', sub: 'listener 에러', color: '#ef4444' },
];

const IMPLS = [
  { name: 'libp2p-tcp', desc: 'TCP', color: '#ef4444' },
  { name: 'libp2p-quic', desc: 'QUIC', color: '#06b6d4' },
  { name: 'libp2p-websocket', desc: 'WS / WSS', color: '#10b981' },
  { name: 'libp2p-webtransport', desc: 'QUIC-based 브라우저', color: '#6366f1' },
  { name: 'libp2p-memory', desc: '테스트용 in-memory', color: '#94a3b8' },
  { name: 'libp2p-dns', desc: 'DNS resolver wrapper', color: '#f59e0b' },
];

export default function TransportTraitDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: assoc types */}
          {step === 0 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                trait Transport — Associated Types
              </text>
              {TYPES.map((t, i) => (
                <motion.g key={t.name} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                  <DataBox x={30 + (i % 2) * 230} y={50 + Math.floor(i / 2) * 70}
                    w={210} h={56} label={t.name} sub={t.desc} color={t.color} outlined />
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 1: methods */}
          {step === 1 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                trait Transport — 4 Methods
              </text>
              {METHODS.map((m, i) => (
                <motion.g key={m.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={30} y={45 + i * 44} width={420} height={36} rx={5}
                    fill={m.color + '0a'} stroke={m.color + '60'} strokeWidth={0.7} />
                  <text x={50} y={62 + i * 44} fontSize={10} fontWeight={700} fill={m.color}
                    style={{ fontFamily: 'monospace' }}>{m.name}</text>
                  <text x={50} y={75 + i * 44} fontSize={8.5} fill="var(--muted-foreground)">{m.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 2: events */}
          {step === 2 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                enum TransportEvent
              </text>
              {EVENTS.map((e, i) => (
                <motion.g key={e.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={30} y={45 + i * 36} width={420} height={28} rx={4}
                    fill={e.color + '0a'} stroke={e.color + '50'} strokeWidth={0.7} />
                  <text x={50} y={62 + i * 36} fontSize={10} fontWeight={700} fill={e.color}>{e.name}</text>
                  <text x={170} y={62 + i * 36} fontSize={9} fill="var(--muted-foreground)">{e.sub}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 3: combinator */}
          {step === 3 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Combinator Pattern
              </text>
              {[
                { y: 45, code: 'tcp::Transport', sub: 'TCP only', color: '#8b5cf6' },
                { y: 78, code: '.upgrade(Version::V1)', sub: 'Upgrade layer 추가', color: '#94a3b8' },
                { y: 111, code: '.authenticate(noise)', sub: '+ Security', color: '#ec4899' },
                { y: 144, code: '.multiplex(yamux)', sub: '+ Mux', color: '#f59e0b' },
                { y: 177, code: '.timeout(20s).boxed()', sub: '+ Timeout, type erasure', color: '#10b981' },
              ].map((s, i) => (
                <motion.g key={s.y} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.13 }}>
                  <rect x={30} y={s.y} width={420} height={26} rx={4}
                    fill={s.color + '0a'} stroke={s.color + '60'} strokeWidth={0.7} />
                  <text x={50} y={s.y + 17} fontSize={10} fontWeight={700} fill={s.color}
                    style={{ fontFamily: 'monospace' }}>{s.code}</text>
                  <text x={250} y={s.y + 17} fontSize={9} fill="var(--muted-foreground)">{s.sub}</text>
                </motion.g>
              ))}
              <text x={240} y={224} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                최종 output: (PeerId, StreamMuxerBox)
              </text>
            </g>
          )}

          {/* Step 4: OrTransport */}
          {step === 4 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                OrTransport — multi-protocol 라우팅
              </text>
              <ModuleBox x={170} y={50} w={140} h={42} label="OrTransport" sub="addr 별 라우팅" color="#ec4899" />
              {[
                { x: 30, label: 'TCP', color: '#ef4444' },
                { x: 175, label: 'WebSocket', color: '#10b981' },
                { x: 320, label: 'QUIC', color: '#06b6d4' },
              ].map((t, i) => (
                <motion.g key={t.label} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <line x1={240} y1={92} x2={t.x + 65} y2={130} stroke="#94a3b8" strokeWidth={0.8} />
                  <ModuleBox x={t.x} y={130} w={130} h={40} label={t.label} color={t.color} />
                </motion.g>
              ))}
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                각 Multiaddr 에 맞는 transport 자동 선택
              </text>
            </g>
          )}

          {/* Step 5: implementations */}
          {step === 5 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                주요 구현체 (Rust)
              </text>
              {IMPLS.map((c, i) => (
                <motion.g key={c.name} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
                  <rect x={20 + (i % 2) * 230} y={42 + Math.floor(i / 2) * 36}
                    width={220} height={28} rx={4}
                    fill={c.color + '0a'} stroke={c.color + '50'} strokeWidth={0.7} />
                  <text x={36 + (i % 2) * 230} y={60 + Math.floor(i / 2) * 36}
                    fontSize={9.5} fontWeight={700} fill={c.color}
                    style={{ fontFamily: 'monospace' }}>{c.name}</text>
                  <text x={150 + (i % 2) * 230} y={60 + Math.floor(i / 2) * 36}
                    fontSize={8.5} fill="var(--muted-foreground)">{c.desc}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
