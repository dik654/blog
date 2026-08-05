import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, StatusBox } from '@/components/viz/boxes';

const STRATEGY_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#a855f7'];
const ETH = '#10b981';
const NEU = '#94a3b8';

const STEPS = [
  { label: 'Resource Proof', body: 'PoW · storage · bandwidth — 노드 생성 자체에 비용 부과. 확장 불가능하게 만든다.' },
  { label: 'Identity Verification', body: 'social graph (Freenet) · trusted introducers · KYC — 외부 신뢰 결합.' },
  { label: 'Network Locality', body: 'IP /24, /16, ASN, 지리 다양성. Ethereum이 채택한 접근법.' },
  { label: 'Economic Stake', body: 'PoS · deposit · slashing — 공격 비용 >> 공격 이익.' },
  { label: 'Certification Authority', body: '중앙 CA / PKI — 강하지만 P2P 철학과 상충.' },
  { label: 'Ethereum 채택: IP Quota', body: 'bucket·table 별 /24 한도. 256 IP=10 nodes, 65536 IP=2560 nodes.' },
  { label: '한계 + 보완', body: '~1000 노드 테이블에서 50% 점유 가능. PeerID, peer scoring, anchor peers 등 보완.' },
];

const STRATEGIES = [
  { label: 'Resource Proof', sub: 'PoW · storage · bandwidth' },
  { label: 'Identity Verify', sub: 'social graph · KYC' },
  { label: 'Network Locality', sub: 'IP /24 · ASN · geo' },
  { label: 'Economic Stake', sub: 'PoS · deposit · slashing' },
  { label: 'Cert. Authority', sub: 'CA · PKI · 중앙화' },
];

const QUOTA_TABLE = [
  { ips: '256 IP (1 /24)', nodes: '최대 10' },
  { ips: '2560 IP (10 /24)', nodes: '최대 100' },
  { ips: '65536 IP (256 /24)', nodes: '최대 2560' },
];

export default function SybilDefenseStrategyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step <= 4 && (
            <>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Sybil 방어 전략 5가지
              </text>
              {STRATEGIES.map((s, i) => {
                const active = step === i;
                const color = STRATEGY_COLORS[i];
                return (
                  <motion.g key={s.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0, scale: active ? 1.02 : 1 }}
                    transition={{ delay: i * 0.06 }}>
                    <ActionBox x={50} y={36 + i * 36} w={380} h={28}
                      label={s.label} sub={s.sub} color={color} />
                    {active && (
                      <motion.circle cx={36} cy={50 + i * 36} r={5}
                        fill={color}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
                    )}
                  </motion.g>
                );
              })}
              {/* Eth highlight indicator */}
              <text x={240} y={228} textAnchor="middle" fontSize={9} fill={ETH}>
                ✓ Ethereum 채택: Network Locality (IP Quota)
              </text>
            </>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={ETH}>
                Ethereum discv4 — IP Quota 계산
              </text>
              <DataBox x={140} y={36} w={200} h={28} label="bucket: /24당 2개" color={ETH} outlined />
              <DataBox x={140} y={70} w={200} h={28} label="table: /24당 10개" color={ETH} outlined />
              <text x={240} y={118} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
                공격자 IP N → /24 subnet 수 = N / 256
              </text>
              {QUOTA_TABLE.map((q, i) => (
                <motion.g key={q.ips}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}>
                  <rect x={70} y={132 + i * 28} width={340} height={22} rx={4}
                    fill={`${ETH}08`} stroke={`${ETH}40`} strokeWidth={0.5} />
                  <text x={90} y={147 + i * 28} fontSize={9} fontWeight={600} fill="var(--foreground)">
                    {q.ips}
                  </text>
                  <text x={400} y={147 + i * 28} textAnchor="end" fontSize={9} fill={ETH}>
                    {q.nodes}
                  </text>
                </motion.g>
              ))}
              <text x={240} y={228} textAnchor="middle" fontSize={9} fill={NEU}>
                전체 테이블 ~1000개 — 65536 IP면 50% 점유 가능
              </text>
            </motion.g>
          )}

          {step === 6 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={NEU}>
                IP Quota 한계 + 추가 보완 layer
              </text>
              <StatusBox x={70} y={40} w={340} h={42}
                label="대규모 cloud / botnet 시 50% 점유 위협" sub="65536 IP → 2560 nodes / 1000 table"
                color="#ef4444" progress={0.5} />
              {[
                { label: 'PeerID ≠ network ID', sub: 'identity 분리' },
                { label: 'Behavior filtering', sub: '응답·전파 패턴 점수' },
                { label: 'GossipSub peer scoring', sub: 'pubsub layer 신뢰' },
                { label: 'Anchor peers', sub: '명시적 trusted set' },
              ].map((c, i) => (
                <motion.g key={c.label}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}>
                  <ActionBox x={70} y={100 + i * 30} w={340} h={24}
                    label={c.label} sub={c.sub} color={ETH} />
                </motion.g>
              ))}
              <text x={240} y={228} textAnchor="middle" fontSize={9} fill={NEU}>
                연구: S/Kademlia · SybilGuard · SybilLimit · Whānau
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
