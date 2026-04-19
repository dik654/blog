import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'libp2p 프로토콜 카탈로그' },
  { label: 'Discovery 계층' },
  { label: 'Connectivity 계층' },
  { label: 'Pub/Sub 계층' },
  { label: 'Stream + Transport 계층' },
  { label: 'Protocol ID 규칙' },
  { label: '실제 사용: Eth2 vs IPFS' },
];

const CATEGORIES = [
  { name: 'Discovery', items: ['Kademlia', 'mDNS', 'Rendezvous', 'Bootstrap'], color: '#10b981' },
  { name: 'Connectivity', items: ['Ping', 'Identify', 'AutoNAT', 'Relay v2', 'DCUtR'], color: '#6366f1' },
  { name: 'Pub/Sub', items: ['GossipSub v1.1', 'FloodSub'], color: '#ec4899' },
  { name: 'Stream', items: ['Yamux', 'Mplex', 'Noise', 'TLS 1.3'], color: '#f59e0b' },
  { name: 'Transport', items: ['TCP', 'QUIC', 'WebSocket', 'WebTransport', 'WebRTC'], color: '#8b5cf6' },
];

const PROTO_IDS = [
  '/libp2p/identify/1.0.0',
  '/libp2p/ping/1.0.0',
  '/libp2p/circuit/relay/0.2.0/hop',
  '/libp2p/dcutr',
  '/meshsub/1.1.0',
  '/kad/1.0.0',
];

const USAGE = [
  { app: 'Ethereum 2.0', items: ['TCP+Noise+Yamux', 'discv5', 'GossipSub v1.1', 'libp2p-identity (secp256k1)'], color: '#6366f1' },
  { app: 'IPFS', items: ['TCP/QUIC/WebTransport', 'Kademlia DHT', 'Bitswap', 'GossipSub'], color: '#10b981' },
];

export default function ProtocolCatalogViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: All categories */}
          {step === 0 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                5계층 프로토콜
              </text>
              {CATEGORIES.map((c, i) => (
                <motion.g key={c.name} initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={40 + i * 38} width={440} height={32} rx={5}
                    fill={c.color + '0a'} stroke={c.color + '50'} strokeWidth={0.7} />
                  <text x={36} y={60 + i * 38} fontSize={10} fontWeight={700} fill={c.color}>{c.name}</text>
                  <text x={130} y={60 + i * 38} fontSize={9} fill="var(--muted-foreground)">
                    {c.items.join(' · ')}
                  </text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Steps 1-4: focus on each layer */}
          {step >= 1 && step <= 4 && (() => {
            const c = [CATEGORIES[0], CATEGORIES[1], CATEGORIES[2], [CATEGORIES[3], CATEGORIES[4]]][step - 1];
            const cats = Array.isArray(c) ? c : [c];
            return (
              <g>
                {cats.map((cat, ci) => (
                  <g key={cat.name}>
                    <ModuleBox x={170} y={20 + ci * 110} w={140} h={40}
                      label={cat.name} color={cat.color} />
                    {cat.items.map((item, ii) => (
                      <motion.g key={item} initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }} transition={{ delay: ii * 0.08 }}>
                        <DataBox x={30 + (ii % 5) * 90} y={70 + ci * 110}
                          w={84} h={26} label={item} color={cat.color} outlined />
                      </motion.g>
                    ))}
                  </g>
                ))}
              </g>
            );
          })()}

          {/* Step 5: protocol ID */}
          {step === 5 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Protocol ID 규칙 — 다중 버전 지원
              </text>
              {PROTO_IDS.map((p, i) => (
                <motion.g key={p} initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={50} y={45 + i * 28} width={380} height={22} rx={4}
                    fill="#6366f10a" stroke="#6366f140" strokeWidth={0.6} />
                  <text x={70} y={60 + i * 28} fontSize={10} fontWeight={600} fill="#6366f1"
                    style={{ fontFamily: 'monospace' }}>{p}</text>
                </motion.g>
              ))}
              <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                multistream-select 가 버전을 협상 — upgrade path 자동
              </text>
            </g>
          )}

          {/* Step 6: usage */}
          {step === 6 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                실전 사용 비교
              </text>
              {USAGE.map((u, i) => (
                <motion.g key={u.app} initial={{ opacity: 0, x: i === 0 ? -8 : 8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}>
                  <rect x={20 + i * 230} y={45} width={220} height={170} rx={8}
                    fill={u.color + '08'} stroke={u.color} strokeWidth={0.8} />
                  <text x={130 + i * 230} y={68} textAnchor="middle" fontSize={11}
                    fontWeight={700} fill={u.color}>{u.app}</text>
                  {u.items.map((item, ii) => (
                    <text key={item} x={40 + i * 230} y={95 + ii * 22} fontSize={9}
                      fill="var(--foreground)">• {item}</text>
                  ))}
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
