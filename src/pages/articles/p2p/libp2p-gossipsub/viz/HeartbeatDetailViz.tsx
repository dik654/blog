import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'heartbeat() 매 1초 — 6 phases' },
  { label: 'Phase 1: Cleanup' },
  { label: 'Phase 2: Score Update' },
  { label: 'Phase 3: Mesh Rebalancing — per topic' },
  { label: 'Phase 4: Fanout Maintenance' },
  { label: 'Phase 5: Shift mcache' },
  { label: 'Phase 6: Emit Gossip (IHAVE)' },
  { label: '성능 — Eth2 mainnet 추정' },
];

const PHASES = [
  { name: 'Cleanup', sub: '카운터 리셋 + 만료 정리', color: '#94a3b8' },
  { name: 'Score Update', sub: 'P1~P4 재계산 + decay', color: '#6366f1' },
  { name: 'Mesh Rebalancing', sub: 'PRUNE/GRAFT per topic', color: '#10b981' },
  { name: 'Fanout Maintenance', sub: 'TTL 만료, 비활성 제거', color: '#f59e0b' },
  { name: 'Shift mcache', sub: '오래된 메시지 슬라이드', color: '#ec4899' },
  { name: 'Emit Gossip', sub: 'IHAVE to non-mesh', color: '#8b5cf6' },
];

const CLEANUP = [
  { label: 'iasked 카운터 리셋', color: '#94a3b8' },
  { label: 'backoff 만료 체크', color: '#6366f1' },
  { label: '오래된 peer info 정리', color: '#f59e0b' },
  { label: 'dead message 정리', color: '#ef4444' },
];

const REBALANCE = [
  { y: 40, label: 'Remove low-score peers', desc: 'mesh 에서 score<0 제거 + PRUNE', color: '#ef4444' },
  { y: 90, label: 'Add new peers', desc: 'if |mesh|<D_lo → GRAFT', color: '#10b981' },
  { y: 140, label: 'Prune excess', desc: 'if |mesh|>D_hi → keep top D by score', color: '#f59e0b' },
  { y: 190, label: 'Opportunistic graft (v1.1)', desc: 'avg_score 낮으면 high-score 승격', color: '#ec4899' },
];

export default function HeartbeatDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 6 phases overview */}
          {step === 0 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                heartbeat() pipeline
              </text>
              {PHASES.map((p, i) => (
                <motion.g key={p.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20 + i * 75} y={50} width={70} height={140} rx={6}
                    fill={p.color + '0a'} stroke={p.color + '50'} strokeWidth={0.7} />
                  <text x={55 + i * 75} y={75} textAnchor="middle" fontSize={9}
                    fontWeight={700} fill={p.color}>{i + 1}</text>
                  <text x={55 + i * 75} y={115} textAnchor="middle" fontSize={9}
                    fontWeight={700} fill={p.color}>{p.name}</text>
                  <text x={55 + i * 75} y={155} textAnchor="middle" fontSize={7.5}
                    fill="var(--muted-foreground)" style={{ width: 60 }}>{p.sub.split(' ').slice(0, 2).join(' ')}</text>
                  <text x={55 + i * 75} y={168} textAnchor="middle" fontSize={7.5}
                    fill="var(--muted-foreground)">{p.sub.split(' ').slice(2).join(' ')}</text>
                </motion.g>
              ))}
              <text x={240} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                기본 1초 주기 (Eth2)
              </text>
            </g>
          )}

          {/* Step 1: Cleanup */}
          {step === 1 && (
            <g>
              <ModuleBox x={170} y={20} w={140} h={42} label="Cleanup" sub="phase 1" color="#94a3b8" />
              {CLEANUP.map((c, i) => (
                <motion.g key={c.label} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={50} y={85 + i * 36} width={380} height={28} rx={4}
                    fill={c.color + '0a'} stroke={c.color + '60'} strokeWidth={0.7} />
                  <text x={70} y={103 + i * 36} fontSize={10} fontWeight={600} fill={c.color}>{c.label}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 2: Score Update */}
          {step === 2 && (
            <g>
              <ModuleBox x={170} y={20} w={140} h={42} label="Score Update" sub="phase 2" color="#6366f1" />
              {[
                { label: 'peer_score 재계산', desc: '각 peer 별 갱신' },
                { label: 'P1: time in mesh', desc: '+ 보상' },
                { label: 'P2: first delivery', desc: '+ 보상' },
                { label: 'P3 / P3b: mesh delivery', desc: '+ 보상 / - 페널티' },
                { label: 'P4: invalid messages', desc: '- 페널티' },
              ].map((s, i) => (
                <motion.g key={s.label} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <rect x={30} y={80 + i * 30} width={420} height={24} rx={4}
                    fill="#6366f10a" stroke="#6366f150" strokeWidth={0.6} />
                  <text x={50} y={96 + i * 30} fontSize={9.5} fontWeight={700} fill="#6366f1">{s.label}</text>
                  <text x={220} y={96 + i * 30} fontSize={9} fill="var(--muted-foreground)">{s.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 3: Mesh Rebalancing */}
          {step === 3 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Mesh Rebalancing — for each subscribed topic
              </text>
              {REBALANCE.map((r) => (
                <motion.g key={r.y} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}>
                  <rect x={30} y={r.y} width={420} height={42} rx={5}
                    fill={r.color + '0a'} stroke={r.color + '50'} strokeWidth={0.7} />
                  <text x={50} y={r.y + 18} fontSize={10} fontWeight={700} fill={r.color}>{r.label}</text>
                  <text x={50} y={r.y + 33} fontSize={9} fill="var(--muted-foreground)">{r.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 4: Fanout Maintenance */}
          {step === 4 && (
            <g>
              <ModuleBox x={170} y={20} w={140} h={42} label="Fanout Maintenance" sub="phase 4" color="#f59e0b" />
              {[
                { label: 'fanout_ttl 만료된 topic 정리', color: '#ef4444' },
                { label: '비활성 fanout peers 제거', color: '#94a3b8' },
                { label: '필요 시 새 peers 추가', color: '#10b981' },
              ].map((s, i) => (
                <motion.g key={s.label} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={50} y={90 + i * 44} width={380} height={32} rx={5}
                    fill={s.color + '0a'} stroke={s.color + '50'} strokeWidth={0.7} />
                  <text x={70} y={111 + i * 44} fontSize={10} fontWeight={600} fill={s.color}>{s.label}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 5: shift mcache */}
          {step === 5 && (
            <g>
              <ModuleBox x={170} y={20} w={140} h={42} label="Shift mcache" sub="phase 5" color="#ec4899" />
              {[
                { y: 90, label: 'message cache 슬라이드', desc: 'D_lazy 윈도우 만큼만 유지' },
                { y: 130, label: '오래된 메시지 gossip 대상에서 제거', desc: 'IHAVE 후보 갱신' },
                { y: 170, label: 'IDONTWANT cache 갱신', desc: 'v1.2 deduplication 지원' },
              ].map((s, i) => (
                <motion.g key={s.y} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={30} y={s.y} width={420} height={32} rx={5}
                    fill="#ec48990a" stroke="#ec489950" strokeWidth={0.7} />
                  <text x={50} y={s.y + 14} fontSize={10} fontWeight={700} fill="#ec4899">{s.label}</text>
                  <text x={50} y={s.y + 27} fontSize={8.5} fill="var(--muted-foreground)">{s.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 6: Emit Gossip */}
          {step === 6 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Emit Gossip (IHAVE) — per topic
              </text>
              <ActionBox x={20} y={50} w={130} h={40} label="recent_msgs" sub="mcache.recent(D_lazy)" color="#6366f1" />
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }}
                x1={150} y1={70} x2={180} y2={70} stroke="#94a3b8" strokeWidth={1.4} markerEnd="url(#hbr)" />
              <ActionBox x={180} y={50} w={130} h={40} label="filter peers" sub="non-mesh, score≥thresh" color="#10b981" />
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }}
                x1={310} y1={70} x2={340} y2={70} stroke="#94a3b8" strokeWidth={1.4} markerEnd="url(#hbr)" />
              <ActionBox x={340} y={50} w={120} h={40} label="shuffle [:D_lazy]" sub="6 peers" color="#f59e0b" />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <rect x={50} y={130} width={380} height={42} rx={6}
                  fill="#ec48990a" stroke="#ec4899" strokeWidth={0.8} />
                <text x={240} y={150} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#ec4899">
                  send IHAVE(topic, msg_ids) to each peer
                </text>
                <text x={240} y={164} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  msg_ids = recent_msgs.sample(max_ihave_length)
                </text>
              </motion.g>
              <defs>
                <marker id="hbr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <polygon points="0 0,6 2.5,0 5" fill="#94a3b8" />
                </marker>
              </defs>
            </g>
          )}

          {/* Step 7: performance */}
          {step === 7 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Eth2 mainnet 성능 추정
              </text>
              {[
                { y: 50, label: '1000 peers × 20 topics', val: '~20K ops/s', color: '#6366f1' },
                { y: 100, label: 'CPU 사용률', val: '~5-10%', color: '#10b981' },
                { y: 150, label: 'heartbeat_interval', val: '1s (Eth2)', color: '#f59e0b' },
                { y: 200, label: 'heartbeat_initial_delay', val: '5s', color: '#ec4899' },
              ].map((s) => (
                <motion.g key={s.y} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}>
                  <rect x={30} y={s.y} width={420} height={36} rx={5}
                    fill={s.color + '0a'} stroke={s.color + '50'} strokeWidth={0.7} />
                  <text x={50} y={s.y + 22} fontSize={10} fontWeight={700} fill={s.color}>{s.label}</text>
                  <text x={400} y={s.y + 22} fontSize={11} fontWeight={700} fill={s.color}
                    textAnchor="end">{s.val}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
