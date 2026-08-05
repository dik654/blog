import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: '1. Mesh Overlay & Publishing',
    body: 'Topic마다 별도 mesh. D=6 target, D_lo=4 / D_hi=12.\n발행자는 mesh peers에 full message, fanout peers에 backup.',
  },
  {
    label: '2. Mesh Maintenance (heartbeat 1s)',
    body: 'mesh_size < D_lo → GRAFT(추가).\nmesh_size > D_hi → PRUNE(제거). 항상 D 부근으로 rebalance.',
  },
  {
    label: '3. Gossip 레이어 — IHAVE / IWANT',
    body: 'Non-mesh peers에 IHAVE(메타) 전송. 누락 노드는 IWANT으로 본문 요청.\nmesh 외 backup path 확보.',
  },
  {
    label: '4. Anti-entropy: seen LRU + msg_id',
    body: 'msg_id = hash(message). LRU cache (TTL ≈ 2분).\n중복 메시지 차단으로 네트워크 효율 확보.',
  },
  {
    label: '5. Peer Scoring (v1.1)',
    body: 'Topic activity · first deliveries · mesh deliveries · invalid penalty · IP colocation.\nThresholds: graylist(-12) · publish(0) · accept(0).',
  },
  {
    label: '6. Ethereum Topics & 운영 규모',
    body: 'beacon_block, beacon_attestation_{subnet}, aggregate_and_proof, slashing 등.\n수만 validators · 초당 수천 메시지 · 분 단위 전 네트워크 전파.',
  },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  pub: '#0ea5e9',
  mesh: '#10b981',
  graft: '#22c55e',
  prune: '#ef4444',
  ihave: '#f59e0b',
  iwant: '#6366f1',
  cache: '#a855f7',
  eth: '#3b82f6',
};

export default function GossipSubFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {/* Common: publisher in center */}
          {step <= 2 && (
            <>
              {/* Publisher */}
              <circle cx={240} cy={120} r={20}
                fill={C.pub + '15'} stroke={C.pub} strokeWidth={1.6} />
              <text x={240} y={124} textAnchor="middle" fontSize={10}
                fontWeight={700} fill={C.pub}>P</text>
              <text x={240} y={150} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">publisher</text>

              {/* Mesh peers (6 around publisher) */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
                const r = 75;
                const x = 240 + Math.cos(angle) * r;
                const y = 120 + Math.sin(angle) * (r * 0.55);
                // step 0: 6 mesh peers, 2 fanout (lighter)
                // step 1: GRAFT/PRUNE animation
                // step 2: 4 mesh + 4 non-mesh (IHAVE)
                const isMesh = step === 0 ? i < 6 : step === 1 ? i < 6 : i < 4;
                const isGraft = step === 1 && i === 6;
                const isPrune = step === 1 && i === 5;
                const c = isMesh ? C.mesh : C.ihave;
                return (
                  <motion.g key={i}
                    animate={{ opacity: 1 }}
                    transition={sp}>
                    {/* edge */}
                    <line x1={240} y1={120} x2={x} y2={y}
                      stroke={
                        isGraft ? C.graft : isPrune ? C.prune : c
                      }
                      strokeWidth={isMesh ? 1.4 : 0.9}
                      strokeDasharray={!isMesh ? '3 3' : '0'}
                      strokeOpacity={isPrune ? 0.4 : 0.7} />
                    {/* GRAFT pulse */}
                    {isGraft && (
                      <motion.circle cx={x} cy={y} r={9} fill="none"
                        stroke={C.graft} strokeWidth={1.2}
                        initial={{ r: 9, opacity: 0.8 }} animate={{ r: 18, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }} />
                    )}
                    {/* PRUNE indicator */}
                    {isPrune && (
                      <text x={(240 + x) / 2} y={(120 + y) / 2 - 4} textAnchor="middle"
                        fontSize={7} fill={C.prune}>PRUNE</text>
                    )}
                    {isGraft && (
                      <text x={(240 + x) / 2} y={(120 + y) / 2 + 8} textAnchor="middle"
                        fontSize={7} fill={C.graft}>GRAFT</text>
                    )}
                    {/* peer node */}
                    <circle cx={x} cy={y} r={9}
                      fill={c + '15'} stroke={isPrune ? C.prune : c} strokeWidth={1.1} />
                    {step === 2 && !isMesh && (
                      <text x={x} y={y - 14} textAnchor="middle" fontSize={7}
                        fill={C.ihave}>IHAVE</text>
                    )}
                  </motion.g>
                );
              })}

              {/* Status sidebar */}
              <DataBox x={20} y={20} w={130} h={32}
                label={`mesh: ${step === 0 ? 6 : step === 1 ? 6 : 4} / D=6`}
                sub={
                  step === 0 ? 'publishing' :
                  step === 1 ? 'rebalance' : 'gossip layer'
                }
                color={C.mesh} outlined />

              {step === 2 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}>
                  <line x1={400} y1={120} x2={460} y2={90}
                    stroke={C.iwant} strokeWidth={1.2} strokeDasharray="3 3" />
                  <text x={450} y={86} textAnchor="end" fontSize={8} fill={C.iwant}>
                    IWANT (req body)
                  </text>
                </motion.g>
              )}

              {/* Bottom legend strip */}
              <text x={20} y={222} fontSize={8} fontWeight={600}
                fill="var(--muted-foreground)">D_lo = 4 ≤ mesh ≤ D_hi = 12</text>

              {/* Param panel right */}
              <ModuleBox x={336} y={20} w={124} h={32}
                label={['publish', 'maintain', 'gossip'][step]}
                sub={
                  step === 0 ? 'full msg → mesh' :
                  step === 1 ? 'GRAFT/PRUNE' : 'IHAVE → IWANT'
                }
                color={[C.pub, C.graft, C.ihave][step]} />
            </>
          )}

          {step === 3 && (
            <>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Anti-entropy: seen LRU cache</text>

              {/* Inbound msg */}
              <ActionBox x={20} y={50} w={100} h={48}
                label="Incoming msg" sub="from peer" color={C.pub} />

              {/* hash arrow */}
              <motion.path d="M 120 74 L 178 74" stroke={C.cache} strokeWidth={1.4}
                markerEnd="url(#arr)" initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6"
                  markerHeight="6" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={C.cache} />
                </marker>
              </defs>
              <text x={150} y={68} textAnchor="middle" fontSize={8}
                fill={C.cache}>hash()</text>

              <DataBox x={180} y={62} w={100} h={24}
                label="msg_id = h(data)" color={C.cache} outlined />

              {/* LRU cache visualization */}
              <ModuleBox x={300} y={50} w={160} h={80}
                label="LRU seen cache" sub="TTL ≈ 120 sec" color={C.cache} />

              {/* Cache slots */}
              {[
                { id: '0xa3..f1', age: '5s', new: false },
                { id: '0x71..2c', age: '40s', new: false },
                { id: 'NEW', age: '0s', new: true },
                { id: '0x9e..bb', age: '95s', new: false },
              ].map((slot, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}>
                  <rect x={310} y={138 + i * 16} width={140} height={12} rx={3}
                    fill={slot.new ? C.cache + '25' : 'var(--card)'}
                    stroke={slot.new ? C.cache : 'var(--border)'} strokeWidth={0.6} />
                  <text x={316} y={147 + i * 16} fontSize={8} fontFamily="monospace"
                    fill={slot.new ? C.cache : 'var(--muted-foreground)'}>{slot.id}</text>
                  <text x={444} y={147 + i * 16} textAnchor="end" fontSize={7}
                    fill="var(--muted-foreground)">{slot.age}</text>
                </motion.g>
              ))}

              {/* Decision */}
              <ActionBox x={20} y={140} w={250} h={36}
                label="if msg_id ∈ cache → drop (dedup)" sub="없으면 forward + insert"
                color={C.mesh} />

              <text x={150} y={210} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">중복 차단 → 네트워크 효율</text>
            </>
          )}

          {step === 4 && (
            <>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Peer Score = Σ(factors)</text>

              {/* 5 factor bars */}
              {[
                { k: 'Topic activity', v: 0.85, sign: '+', c: C.mesh },
                { k: 'First deliveries', v: 0.7, sign: '+', c: C.mesh },
                { k: 'Mesh deliveries', v: 0.6, sign: '+', c: C.mesh },
                { k: 'Invalid msg penalty', v: 0.45, sign: '−', c: C.prune },
                { k: 'IP colocation penalty', v: 0.3, sign: '−', c: C.prune },
              ].map((f, i) => (
                <motion.g key={f.k}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}>
                  <text x={20} y={62 + i * 22} fontSize={9} fontWeight={600} fill={f.c}>
                    {f.sign}
                  </text>
                  <text x={32} y={62 + i * 22} fontSize={9}
                    fill="var(--foreground)">{f.k}</text>
                  <rect x={180} y={54 + i * 22} width={140} height={8} rx={4}
                    fill="var(--border)" opacity={0.3} />
                  <motion.rect x={180} y={54 + i * 22} width={140 * f.v} height={8} rx={4}
                    fill={f.c}
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    style={{ transformOrigin: '180px center' }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }} />
                </motion.g>
              ))}

              {/* Threshold zones */}
              <text x={400} y={60} fontSize={10} fontWeight={700}
                fill="var(--foreground)">Thresholds</text>
              {[
                { name: 'accept', v: 0, c: C.mesh, eff: '메시지 수용 차단' },
                { name: 'publish', v: 0, c: C.ihave, eff: '발행 차단' },
                { name: 'graylist', v: -12, c: C.prune, eff: '메시 제외' },
              ].map((t, i) => (
                <motion.g key={t.name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.07 }}>
                  <DataBox x={340} y={75 + i * 38} w={130} h={32}
                    label={`${t.name} ≤ ${t.v}`} sub={t.eff} color={t.c} outlined />
                </motion.g>
              ))}

              {/* Sum line */}
              <line x1={20} y1={188} x2={460} y2={188}
                stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 3" />
              <text x={20} y={208} fontSize={9} fontWeight={700}
                fill="var(--foreground)">Score(p) =</text>
              <text x={100} y={208} fontSize={9} fontFamily="monospace"
                fill={C.iwant}>Σ topic_score + app_score + ip_colocation</text>
              <text x={20} y={224} fontSize={8.5}
                fill="var(--muted-foreground)">multi-factor 합산 → threshold 비교</text>
            </>
          )}

          {step === 5 && (
            <>
              <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.eth}>Ethereum Beacon Chain · GossipSub Topics</text>

              {/* topic grid */}
              {[
                { name: 'beacon_block', desc: 'block 전파', c: C.eth },
                { name: 'beacon_attestation_{0..63}', desc: 'subnet attest.', c: C.mesh },
                { name: 'aggregate_and_proof', desc: 'aggregator', c: C.iwant },
                { name: 'voluntary_exit', desc: 'validator exit', c: C.ihave },
                { name: 'proposer_slashing', desc: 'slash proof', c: C.prune },
                { name: 'attester_slashing', desc: 'slash proof', c: C.prune },
              ].map((t, i) => {
                const col = i % 3;
                const row = Math.floor(i / 3);
                return (
                  <motion.g key={t.name}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}>
                    <DataBox x={20 + col * 150} y={48 + row * 46} w={140} h={36}
                      label={t.name} sub={t.desc} color={t.c} outlined />
                  </motion.g>
                );
              })}

              {/* Scale stats */}
              <text x={240} y={166} textAnchor="middle" fontSize={10} fontWeight={700}
                fill="var(--foreground)">운영 규모</text>
              <StatusBox x={20} y={180} w={140} h={50}
                label="validators" sub="수만 명" color={C.eth} progress={0.9} />
              <StatusBox x={170} y={180} w={140} h={50}
                label="msgs / sec" sub="수천" color={C.iwant} progress={0.7} />
              <StatusBox x={320} y={180} w={140} h={50}
                label="propagation" sub="분 단위 전체 도달" color={C.mesh} progress={0.85} />
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
