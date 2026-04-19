import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '7가지 언어 구현체' },
  { label: 'Blockchain Production Users' },
  { label: 'Other Production Users' },
  { label: 'Transport / Security / Mux 모듈' },
  { label: 'Core Protocol 모듈' },
  { label: '공통 개념 5가지' },
];

const LANGS = [
  { name: 'go-libp2p', sub: 'reference, IPFS Kubo, Lotus', color: '#06b6d4' },
  { name: 'rust-libp2p', sub: 'Parity, Substrate, Forest', color: '#ef4444' },
  { name: 'js-libp2p', sub: 'Helia (IPFS v2), browser', color: '#f59e0b' },
  { name: 'py-libp2p', sub: 'Python (less mature)', color: '#10b981' },
  { name: 'jvm-libp2p', sub: 'Lodestar (Java/Kotlin)', color: '#6366f1' },
  { name: 'nim-libp2p', sub: 'Nimbus ETH', color: '#8b5cf6' },
  { name: 'zig-libp2p', sub: 'experimental', color: '#94a3b8' },
];

const BCHAIN = [
  { name: 'IPFS / Filecoin', color: '#10b981' },
  { name: 'Eth2 (Lighthouse, Prysm, Teku)', color: '#6366f1' },
  { name: 'Polkadot / Kusama', color: '#ec4899' },
  { name: 'Near Protocol', color: '#f59e0b' },
  { name: 'Solana (partial)', color: '#8b5cf6' },
  { name: 'Celestia', color: '#06b6d4' },
];

const OTHER = [
  { name: 'Radicle (P2P git)', color: '#10b981' },
  { name: 'Berty (messaging)', color: '#ec4899' },
  { name: 'Drand (randomness beacon)', color: '#f59e0b' },
  { name: 'iroh (alt IPFS)', color: '#6366f1' },
];

const CONCEPTS = [
  { name: 'PeerId = hash(public_key)', color: '#10b981' },
  { name: 'Multiaddr = layered addressing', color: '#6366f1' },
  { name: 'Multistream-select = protocol negotiation', color: '#f59e0b' },
  { name: 'Swarm = central event loop', color: '#ec4899' },
  { name: 'NetworkBehaviour + ConnectionHandler', color: '#8b5cf6' },
];

export default function EcosystemViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: languages */}
          {step === 0 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Language Implementations
              </text>
              {LANGS.map((l, i) => (
                <motion.g key={l.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <rect x={30} y={32 + i * 28} width={420} height={22} rx={4}
                    fill={l.color + '0a'} stroke={l.color + '50'} strokeWidth={0.6} />
                  <text x={50} y={47 + i * 28} fontSize={9.5} fontWeight={700} fill={l.color}>{l.name}</text>
                  <text x={170} y={47 + i * 28} fontSize={9} fill="var(--muted-foreground)">{l.sub}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 1: blockchain users */}
          {step === 1 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Blockchain Users
              </text>
              {BCHAIN.map((u, i) => (
                <motion.g key={u.name} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
                  <DataBox x={20 + (i % 2) * 230} y={40 + Math.floor(i / 2) * 56}
                    w={220} h={48} label={u.name} color={u.color} outlined />
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 2: other users */}
          {step === 2 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Other Users
              </text>
              {OTHER.map((u, i) => (
                <motion.g key={u.name} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                  <DataBox x={20 + (i % 2) * 230} y={50 + Math.floor(i / 2) * 60}
                    w={220} h={50} label={u.name} color={u.color} outlined />
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 3: T/S/M modules */}
          {step === 3 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Transport / Security / Muxer
              </text>
              {[
                { name: 'Transport', items: ['tcp', 'quic', 'websocket', 'webtransport', 'memory'], color: '#8b5cf6' },
                { name: 'Security', items: ['noise', 'tls'], color: '#ec4899' },
                { name: 'Muxer', items: ['yamux', 'mplex'], color: '#f59e0b' },
              ].map((c, i) => (
                <motion.g key={c.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={20} y={40 + i * 60} width={440} height={50} rx={6}
                    fill={c.color + '0a'} stroke={c.color + '50'} strokeWidth={0.7} />
                  <text x={36} y={62 + i * 60} fontSize={10} fontWeight={700} fill={c.color}>{c.name}</text>
                  <text x={36} y={78 + i * 60} fontSize={9} fill="var(--muted-foreground)">
                    {c.items.join(' · ')}
                  </text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 4: core protocols */}
          {step === 4 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Core Protocols
              </text>
              {[
                'identify, ping, autonat',
                'kad (Kademlia DHT)',
                'gossipsub, floodsub',
                'rendezvous',
                'relay (circuit), dcutr',
                'mdns',
                'request-response, stream',
                'upnp (port forwarding)',
              ].map((p, i) => (
                <motion.g key={p} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <rect x={30} y={35 + i * 24} width={420} height={20} rx={3}
                    fill="#6366f10a" stroke="#6366f140" strokeWidth={0.6} />
                  <text x={50} y={49 + i * 24} fontSize={9.5} fontWeight={600} fill="#6366f1"
                    style={{ fontFamily: 'monospace' }}>{p}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 5: concepts */}
          {step === 5 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                libp2p 공통 개념
              </text>
              {CONCEPTS.map((c, i) => (
                <motion.g key={c.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={30} y={45 + i * 38} width={420} height={30} rx={5}
                    fill={c.color + '0a'} stroke={c.color + '50'} strokeWidth={0.7} />
                  <text x={50} y={64 + i * 38} fontSize={10} fontWeight={600} fill={c.color}>{c.name}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
