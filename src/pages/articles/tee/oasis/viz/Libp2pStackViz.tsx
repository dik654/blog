import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Transport — TCP + QUIC', body: '두 transport 동시 listen.\nTCP 26656 + UDP 26656 quic-v1 — NAT 친화적 QUIC 우선.' },
  { label: 'Security — Noise', body: 'noise.New 로 암호화된 channel.\nIdentity 기반 mutual auth.' },
  { label: 'Muxer — Yamux', body: '하나의 connection 위에 여러 stream 다중화.\nstream 단위 backpressure.' },
  { label: 'Identity — Ed25519 nodekey', body: 'libp2p.Identity(privKey) — node 의 영구 신원.\nPeer ID 가 pubkey hash.' },
  { label: 'NAT/Relay/Holepunching', body: 'EnableNATService + EnableRelay + EnableHolePunching.\n방화벽 너머 노드도 P2P 참여 가능.' },
  { label: 'GossipSub PubSub', body: 'StrictSign 으로 모든 메시지 서명 검증.\nFloodPublish + PeerExchange — 빠른 전파.' },
];

const LAYERS = [
  { name: 'Transport',  sub: 'TCP / QUIC',     color: '#6366f1' },
  { name: 'Security',   sub: 'Noise',          color: '#10b981' },
  { name: 'Muxer',      sub: 'Yamux',          color: '#f59e0b' },
  { name: 'Identity',   sub: 'Ed25519',        color: '#a855f7' },
  { name: 'NAT/Relay',  sub: 'holepunching',   color: '#ec4899' },
  { name: 'PubSub',     sub: 'GossipSub',      color: '#3b82f6' },
];

export default function Libp2pStackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Stack */}
          {LAYERS.map((l, i) => {
            const y = 30 + i * 32;
            const active = step === i;
            return (
              <g key={l.name}>
                <motion.g animate={{ opacity: active ? 1 : 0.4 }}>
                  <ModuleBox x={20} y={y} w={210} h={26}
                    label={l.name} color={l.color} />
                  <DataBox x={240} y={y + 1} w={120} h={24}
                    label={l.sub} color={l.color} outlined={active} />
                </motion.g>
              </g>
            );
          })}

          {/* Right side detail */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={370} y={32} w={100} h={24} label="tcp/26656" color="#6366f1" outlined />
              <DataBox x={370} y={62} w={100} h={24} label="udp/quic-v1" color="#6366f1" outlined />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={370} y={120} w={100} h={24} label="NATService" color="#ec4899" outlined />
              <DataBox x={370} y={148} w={100} h={24} label="Relay"      color="#ec4899" outlined />
              <DataBox x={370} y={176} w={100} h={24} label="HolePunch"  color="#ec4899" outlined />
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={370} y={170} w={100} h={24} label="StrictSign" color="#3b82f6" outlined />
              <DataBox x={370} y={200} w={100} h={24} label="PeerExch"   color="#3b82f6" outlined />
            </motion.g>
          )}

          <text x={240} y={232} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            libp2p.New(...) — go/p2p/p2p.go
          </text>
        </svg>
      )}
    </StepViz>
  );
}
