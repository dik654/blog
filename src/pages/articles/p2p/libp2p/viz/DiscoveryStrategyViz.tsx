import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '5단계 Discovery 시퀀스' },
  { label: '1) Bootstrap — hard-coded 진입점' },
  { label: '2) mDNS — LAN 자동 발견' },
  { label: '3) Kademlia DHT — 글로벌 조회' },
  { label: '4) PubSub PX — gossipsub v1.1' },
  { label: '5) Rendezvous — 명명된 만남' },
  { label: 'Trade-off 비교 테이블' },
];

const SEQUENCE = [
  { id: 'bootstrap', label: 'Bootstrap', sub: 'multiaddr 목록', color: '#ef4444' },
  { id: 'mdns', label: 'mDNS', sub: 'UDP 224.0.0.251', color: '#10b981' },
  { id: 'kad', label: 'Kademlia', sub: 'O(log n) lookup', color: '#6366f1' },
  { id: 'pex', label: 'PubSub PX', sub: 'mesh peers', color: '#f59e0b' },
  { id: 'rendezvous', label: 'Rendezvous', sub: 'topic register', color: '#ec4899' },
];

const TRADE_OFFS = [
  { name: 'mDNS', scope: 'LAN', setup: 'Auto', overhead: 'Low', color: '#10b981' },
  { name: 'Kademlia', scope: 'Global', setup: 'Complex', overhead: 'Medium', color: '#6366f1' },
  { name: 'Bootstrap', scope: 'Fixed', setup: 'Manual', overhead: 'Zero', color: '#ef4444' },
];

export default function DiscoveryStrategyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: All sequence */}
          {step === 0 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Startup Sequence
              </text>
              {SEQUENCE.map((s, i) => (
                <motion.g key={s.id} initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                  <ModuleBox x={20 + i * 92} y={70} w={86} h={56}
                    label={s.label} sub={s.sub} color={s.color} />
                  {i < SEQUENCE.length - 1 && (
                    <line x1={106 + i * 92} y1={98} x2={112 + i * 92} y2={98}
                      stroke="#94a3b8" strokeWidth={1.2} />
                  )}
                </motion.g>
              ))}
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                일반적으로 모두 활성화 — 메커니즘 간 보완
              </text>
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                IPFS: Bootstrap → Kad → mDNS, Eth2: discv5 + GossipSub PX
              </text>
            </g>
          )}

          {/* Steps 1-5: focused on each */}
          {step >= 1 && step <= 5 && (() => {
            const i = step - 1;
            const s = SEQUENCE[i];
            const desc: Record<string, { rows: string[] }> = {
              bootstrap: { rows: ['hard-coded reliable peers', 'multiaddr list in config', '예: IPFS bootstrap nodes', 'DHT 시작점으로 필수'] },
              mdns: { rows: ['UDP multicast 224.0.0.251:5353', '"_p2p._udp.local" service query', '자동 설정 (zero-config)', 'Dev/LAN 환경 친화'] },
              kad: { rows: ['iterative FIND_NODE lookup', 'random walk discovery', 'Provider records (content)', 'Bootstrap peers 필요'] },
              pex: { rows: ['gossipsub v1.1 feature', 'mesh 내 peers 공유', 'transitive discovery', 'Bandwidth 효율'] },
              rendezvous: { rows: ['Named meeting points', 'Topic-based REGISTER/DISCOVER', '중앙 server 필요', 'App-specific peers'] },
            };
            return (
              <g>
                <ModuleBox x={170} y={20} w={140} h={42} label={s.label} sub={s.sub} color={s.color} />
                {desc[s.id].rows.map((r, ri) => (
                  <motion.g key={ri} initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }} transition={{ delay: ri * 0.1 }}>
                    <rect x={50} y={85 + ri * 32} width={380} height={26} rx={5}
                      fill={s.color + '0a'} stroke={s.color + '50'} strokeWidth={0.7} />
                    <text x={70} y={102 + ri * 32} fontSize={10} fill="var(--foreground)">{r}</text>
                  </motion.g>
                ))}
              </g>
            );
          })()}

          {/* Step 6: trade-off table */}
          {step === 6 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                메커니즘 비교
              </text>
              {/* header */}
              <text x={50} y={50} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">메커니즘</text>
              <text x={170} y={50} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">Scope</text>
              <text x={260} y={50} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">Setup</text>
              <text x={350} y={50} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">Overhead</text>
              {TRADE_OFFS.map((t, i) => (
                <motion.g key={t.name} initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={40} y={65 + i * 44} width={400} height={36} rx={5}
                    fill={t.color + '08'} stroke={t.color + '40'} strokeWidth={0.7} />
                  <text x={50} y={87 + i * 44} fontSize={10} fontWeight={700} fill={t.color}>{t.name}</text>
                  <text x={170} y={87 + i * 44} fontSize={9} fill="var(--foreground)">{t.scope}</text>
                  <text x={260} y={87 + i * 44} fontSize={9} fill="var(--foreground)">{t.setup}</text>
                  <text x={350} y={87 + i * 44} fontSize={9} fill="var(--foreground)">{t.overhead}</text>
                </motion.g>
              ))}
              <text x={240} y={220} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                실전: 여러 메커니즘 조합으로 censorship resistance + cold-start 양립
              </text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
