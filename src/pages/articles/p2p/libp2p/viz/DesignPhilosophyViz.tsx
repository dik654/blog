import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'IPFS 에서 분리된 P2P 스택' },
  { label: '5가지 핵심 철학' },
  { label: '주요 사용자 — Blockchain' },
  { label: 'vs 다른 P2P 프레임워크' },
];

const PHILOSOPHY = [
  { name: 'Modularity', desc: '독립 module 조합', color: '#10b981' },
  { name: 'Interoperability', desc: 'go/rust/js/py/jvm 호환', color: '#6366f1' },
  { name: 'Peer Identity', desc: 'self-sovereign PeerID', color: '#ec4899' },
  { name: 'Multiaddress', desc: 'layered address format', color: '#f59e0b' },
  { name: 'Protocol Negotiation', desc: 'multistream-select', color: '#8b5cf6' },
];

const USERS = [
  { name: 'IPFS / Filecoin', sub: 'Protocol Labs (originated)', color: '#10b981' },
  { name: 'Ethereum 2.0', sub: 'Lighthouse, Prysm, Teku', color: '#6366f1' },
  { name: 'Polkadot / Kusama', sub: 'Parity', color: '#ec4899' },
  { name: 'Near Protocol', sub: 'consensus + state', color: '#f59e0b' },
  { name: 'Celestia', sub: 'data availability', color: '#8b5cf6' },
  { name: 'Iroh / Berty', sub: 'alt IPFS, messaging', color: '#06b6d4' },
];

const COMPARE = [
  { name: 'libp2p', desc: '표준, 다언어, modular', color: '#10b981' },
  { name: 'devp2p', desc: 'Ethereum-specific', color: '#6366f1' },
  { name: 'Noise', desc: '프로토콜 framework', color: '#ec4899' },
  { name: 'QUIC', desc: '전송 프로토콜', color: '#06b6d4' },
  { name: 'Tor', desc: 'Anonymity 중심', color: '#8b5cf6' },
];

export default function DesignPhilosophyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: origin */}
          {step === 0 && (
            <g>
              <ModuleBox x={40} y={50} w={140} h={50} label="IPFS (2015)" sub="P2P 파일 시스템" color="#6366f1" />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <line x1={180} y1={75} x2={290} y2={75} stroke="#94a3b8" strokeWidth={1.4} markerEnd="url(#dr)" />
                <text x={235} y={68} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">P2P 추출</text>
              </motion.g>
              <ModuleBox x={295} y={50} w={140} h={50} label="libp2p" sub="독립 프로젝트" color="#10b981" />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <text x={240} y={140} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                  목표: P2P 네트워킹 복잡성 분리 + 재사용
                </text>
                <text x={240} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  Transport / Security / Mux / Discovery / Pub-Sub
                </text>
                <text x={240} y={183} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  각자 plug-and-play 가능
                </text>
              </motion.g>
              <defs>
                <marker id="dr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#94a3b8" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 1: 5 principles */}
          {step === 1 && (
            <g>
              {PHILOSOPHY.map((p, i) => (
                <motion.g key={p.name} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                  <rect x={30} y={30 + i * 40} width={420} height={32} rx={5}
                    fill={p.color + '0a'} stroke={p.color + '50'} strokeWidth={0.7} />
                  <text x={50} y={49 + i * 40} fontSize={10} fontWeight={700} fill={p.color}>
                    {i + 1}. {p.name}
                  </text>
                  <text x={200} y={49 + i * 40} fontSize={9} fill="var(--foreground)">{p.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 2: Users */}
          {step === 2 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Production Users
              </text>
              {USERS.map((u, i) => (
                <motion.g key={u.name} initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <DataBox x={20 + (i % 2) * 230} y={45 + Math.floor(i / 2) * 56}
                    w={220} h={46} label={u.name} sub={u.sub} color={u.color} outlined />
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 3: comparison */}
          {step === 3 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                vs 다른 P2P 프레임워크
              </text>
              {COMPARE.map((c, i) => (
                <motion.g key={c.name} initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={40} y={45 + i * 38} width={400} height={30} rx={5}
                    fill={c.color + '0a'} stroke={c.color + '50'} strokeWidth={0.7} />
                  <text x={56} y={64 + i * 38} fontSize={10} fontWeight={700} fill={c.color}>{c.name}</text>
                  <text x={170} y={64 + i * 38} fontSize={9} fill="var(--foreground)">{c.desc}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
