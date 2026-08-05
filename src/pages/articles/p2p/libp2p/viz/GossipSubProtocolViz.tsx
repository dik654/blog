import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Per Topic Peer States — Fanout/Mesh/Gossip' },
  { label: 'Mesh Maintenance — heartbeat 1초' },
  { label: 'Control Messages — GRAFT/PRUNE/IHAVE/IWANT' },
  { label: 'Message Flow — full vs IHAVE 분리' },
  { label: 'Validation Pipeline — 6단계' },
  { label: 'Eth2 사용 토픽' },
];

export default function GossipSubProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: peer states */}
          {step === 0 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Topic 별 Peer 상태 3종
              </text>
              {[
                { x: 30, label: 'Fanout', sub: '구독 안 함, publishing 만', color: '#f59e0b' },
                { x: 175, label: 'Mesh', sub: 'subscribed inner peers', color: '#10b981' },
                { x: 320, label: 'Gossip', sub: 'outer (metadata 만)', color: '#6366f1' },
              ].map((s, i) => (
                <motion.g key={s.label} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }}>
                  <ModuleBox x={s.x} y={55} w={130} h={70} label={s.label} sub={s.sub} color={s.color} />
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  Mesh: full message · Gossip: IHAVE metadata
                </text>
                <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  대역폭 vs 신뢰성 균형 — D=6 mesh 유지가 핵심
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 1: mesh maintenance */}
          {step === 1 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                heartbeat 매 1초 — 4단계
              </text>
              {[
                { y: 50, label: '1) PRUNE excess', desc: 'if |mesh| > D_hi → random 제거', color: '#ef4444' },
                { y: 90, label: '2) GRAFT new', desc: 'if |mesh| < D_lo → gossip에서 추가', color: '#10b981' },
                { y: 130, label: '3) Gossip IHAVE', desc: 'recent msgs metadata to non-mesh', color: '#6366f1' },
                { y: 170, label: '4) Opportunistic graft (v1.1)', desc: 'low-perf peers 교체', color: '#ec4899' },
              ].map((s, i) => (
                <motion.g key={s.y} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={30} y={s.y} width={420} height={32} rx={5}
                    fill={s.color + '0a'} stroke={s.color + '50'} strokeWidth={0.7} />
                  <text x={50} y={s.y + 14} fontSize={10} fontWeight={700} fill={s.color}>{s.label}</text>
                  <text x={50} y={s.y + 27} fontSize={8.5} fill="var(--muted-foreground)">{s.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 2: control messages */}
          {step === 2 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Control Messages
              </text>
              {[
                { name: 'GRAFT', desc: '"Add me to your mesh"', color: '#10b981' },
                { name: 'PRUNE', desc: '"Remove me. Try these peers." + backoff', color: '#ef4444' },
                { name: 'IHAVE', desc: '"I have these messages [ids]"', color: '#6366f1' },
                { name: 'IWANT', desc: '"Send me these messages"', color: '#ec4899' },
              ].map((m, i) => (
                <motion.g key={m.name} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.12 }}>
                  <DataBox x={20 + (i % 2) * 230} y={45 + Math.floor(i / 2) * 60}
                    w={220} h={50} label={m.name} sub={m.desc} color={m.color} outlined />
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 3: message flow */}
          {step === 3 && (
            <g>
              <ModuleBox x={20} y={30} w={100} h={40} label="Publisher" color="#10b981" />
              <ModuleBox x={170} y={30} w={100} h={40} label="Mesh A" color="#6366f1" />
              <ModuleBox x={320} y={30} w={100} h={40} label="Mesh B" color="#6366f1" />

              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }}
                x1={120} y1={50} x2={170} y2={50} stroke="#10b981" strokeWidth={2} markerEnd="url(#gar1)" />
              <motion.text x={145} y={42} textAnchor="middle" fontSize={8} fill="#10b981"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>full</motion.text>

              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }}
                x1={270} y1={50} x2={320} y2={50} stroke="#10b981" strokeWidth={2} markerEnd="url(#gar1)" />
              <motion.text x={295} y={42} textAnchor="middle" fontSize={8} fill="#10b981"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>full</motion.text>

              <ModuleBox x={170} y={120} w={100} h={40} label="non-mesh" color="#94a3b8" />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <line x1={220} y1={70} x2={220} y2={120} stroke="#6366f1" strokeWidth={1.4}
                  strokeDasharray="3 2" markerEnd="url(#gar2)" />
                <text x={240} y={97} fontSize={8} fill="#6366f1">IHAVE</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                <line x1={170} y1={140} x2={130} y2={140} stroke="#ec4899" strokeWidth={1.4}
                  strokeDasharray="3 2" markerEnd="url(#gar3)" />
                <text x={150} y={134} fontSize={8} fill="#ec4899">IWANT</text>
              </motion.g>
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Full = mesh peers · Gossip = non-mesh on demand
              </text>
              <defs>
                <marker id="gar1" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#10b981" />
                </marker>
                <marker id="gar2" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#6366f1" />
                </marker>
                <marker id="gar3" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#ec4899" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 4: validation pipeline */}
          {step === 4 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Validation Pipeline (6 stages)
              </text>
              {[
                'Syntax check',
                'Signature verification',
                'Topic subscription check',
                'App-level validation hook',
                'Duplicate check (mcache LRU)',
                'Forward to subscribers',
              ].map((s, i) => (
                <motion.g key={s} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={50} y={45 + i * 30} width={380} height={24} rx={4}
                    fill="#6366f10a" stroke="#6366f140" strokeWidth={0.6} />
                  <text x={70} y={61 + i * 30} fontSize={9} fontWeight={700} fill="#6366f1">{i + 1}.</text>
                  <text x={92} y={61 + i * 30} fontSize={9.5} fill="var(--foreground)">{s}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 5: Eth2 topics */}
          {step === 5 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Ethereum 2.0 GossipSub Topics
              </text>
              {[
                { name: 'beacon_block', color: '#ef4444' },
                { name: 'beacon_attestation_{subnet}', color: '#10b981' },
                { name: 'beacon_aggregate_and_proof', color: '#6366f1' },
                { name: 'voluntary_exit', color: '#f59e0b' },
                { name: 'proposer_slashing', color: '#ec4899' },
                { name: 'sync_committee_contribution', color: '#8b5cf6' },
              ].map((t, i) => (
                <motion.g key={t.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={40} y={45 + i * 28} width={400} height={22} rx={4}
                    fill={t.color + '0a'} stroke={t.color + '50'} strokeWidth={0.6} />
                  <text x={56} y={60 + i * 28} fontSize={9.5} fontWeight={600} fill={t.color}
                    style={{ fontFamily: 'monospace' }}>{t.name}</text>
                </motion.g>
              ))}
              <text x={240} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                수십만 validators · 수천/sec messages · 분 단위 전파
              </text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
