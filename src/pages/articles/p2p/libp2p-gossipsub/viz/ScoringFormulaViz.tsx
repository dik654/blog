import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'S(peer) 총합 — 4개 컴포넌트' },
  { label: 'Topic Score = w1·P1 + w2·P2 + w3·P3 + w3b·P3b + w4·P4' },
  { label: 'P1: Time in Mesh (보상)' },
  { label: 'P2: First Message Delivery (보상)' },
  { label: 'P3 / P3b: Mesh Delivery' },
  { label: 'P4: Invalid Messages (페널티)' },
  { label: 'Eth2 Thresholds — 다단계 차단' },
  { label: '공격 방어 매핑' },
];

const COMPONENTS = [
  { name: 'topic_weight × topic_score', desc: 'topic 별 가중 합산', color: '#10b981' },
  { name: 'app_specific_score', desc: 'attestation, slashing 등', color: '#6366f1' },
  { name: 'ip_colocation_factor', desc: '/24 subnet Sybil 페널티', color: '#f59e0b' },
  { name: 'behaviour_penalty', desc: '프로토콜 위반, exp weighted', color: '#ef4444' },
];

const THRESHOLDS = [
  { name: 'gossipThreshold', val: -4000, effect: 'IHAVE 무시', color: '#f59e0b' },
  { name: 'publishThreshold', val: -8000, effect: 'publish 무시', color: '#ef4444' },
  { name: 'graylistThreshold', val: -16000, effect: '모든 RPC 무시 = 사실상 disconnect', color: '#7f1d1d' },
  { name: 'acceptPXThreshold', val: 0, effect: 'peer exchange 허용', color: '#10b981' },
  { name: 'opportunisticGraftThreshold', val: 5, effect: 'mesh 승격 가능', color: '#6366f1' },
];

const ATTACKS = [
  { attack: 'Spam', defense: 'P4 negative', color: '#ef4444' },
  { attack: 'Lazy peer', defense: 'P2/P3 low', color: '#f59e0b' },
  { attack: 'Sybil', defense: 'IP colocation factor', color: '#ec4899' },
  { attack: 'Protocol abuse', defense: 'Behaviour penalty', color: '#8b5cf6' },
  { attack: 'Eclipse', defense: 'peer exchange thresholds', color: '#6366f1' },
];

export default function ScoringFormulaViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: total components */}
          {step === 0 && (
            <g>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                S(peer) — Total Score
              </text>
              {COMPONENTS.map((c, i) => (
                <motion.g key={c.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={30} y={45 + i * 44} width={420} height={36} rx={5}
                    fill={c.color + '0a'} stroke={c.color + '60'} strokeWidth={0.7} />
                  <text x={50} y={62 + i * 44} fontSize={10.5} fontWeight={700} fill={c.color}>+ {c.name}</text>
                  <text x={50} y={75 + i * 44} fontSize={9} fill="var(--muted-foreground)">{c.desc}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 1: topic score formula */}
          {step === 1 && (
            <g>
              <text x={240} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                topic_score = w1·P1 + w2·P2 + w3·P3 + w3b·P3b + w4·P4
              </text>
              {[
                { name: 'P1', desc: 'Time in Mesh', sign: '+', color: '#10b981' },
                { name: 'P2', desc: 'First Delivery', sign: '+', color: '#10b981' },
                { name: 'P3', desc: 'Mesh Delivery', sign: '+', color: '#6366f1' },
                { name: 'P3b', desc: 'Delivery Failures', sign: '−', color: '#f59e0b' },
                { name: 'P4', desc: 'Invalid Messages', sign: '−', color: '#ef4444' },
              ].map((p, i) => (
                <motion.g key={p.name} initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20 + i * 92} y={70} width={86} height={120} rx={6}
                    fill={p.color + '0a'} stroke={p.color + '60'} strokeWidth={0.7} />
                  <text x={63 + i * 92} y={94} textAnchor="middle" fontSize={11} fontWeight={700} fill={p.color}>
                    {p.name}
                  </text>
                  <text x={63 + i * 92} y={132} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                    {p.desc}
                  </text>
                  <text x={63 + i * 92} y={168} textAnchor="middle" fontSize={20} fontWeight={700}
                    fill={p.sign === '+' ? '#10b981' : '#ef4444'}>{p.sign}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Steps 2-5: each P */}
          {step >= 2 && step <= 5 && (() => {
            const cfg: Record<number, { p: string; title: string; rows: string[]; color: string }> = {
              2: { p: 'P1', title: 'Time in Mesh', color: '#10b981',
                rows: ['메시에 얼마나 오래 있었나', 'Good behavior 보상', 'Cap: time_in_mesh_cap', 'Weight: positive (보상)']},
              3: { p: 'P2', title: 'First Message Delivery', color: '#10b981',
                rows: ['처음으로 메시지를 전달한 횟수', 'Eth2: 초당 가중치', '신선도 보상', 'Weight: positive (보상)']},
              4: { p: 'P3 / P3b', title: 'Mesh Delivery', color: '#6366f1',
                rows: ['P3: 메시 내에서 전달한 메시지 수 (보상)', 'P3b: delivery 실패 카운트 (페널티)', 'Threshold-based 적용', 'Mesh 활동 정량화']},
              5: { p: 'P4', title: 'Invalid Messages', color: '#ef4444',
                rows: ['잘못된 메시지 전송 횟수', 'Signature 실패, format error 포함', 'Spam 직접 페널티', 'Weight: negative (강한 패널티)']},
            };
            const c = cfg[step];
            return (
              <g>
                <ModuleBox x={170} y={20} w={140} h={42} label={c.p} sub={c.title} color={c.color} />
                {c.rows.map((r, i) => (
                  <motion.g key={i} initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                    <rect x={50} y={85 + i * 36} width={380} height={28} rx={4}
                      fill={c.color + '0a'} stroke={c.color + '60'} strokeWidth={0.7} />
                    <text x={70} y={103 + i * 36} fontSize={10} fill="var(--foreground)">{r}</text>
                  </motion.g>
                ))}
              </g>
            );
          })()}

          {/* Step 6: thresholds */}
          {step === 6 && (
            <g>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Eth2 Thresholds
              </text>
              {THRESHOLDS.map((t, i) => (
                <motion.g key={t.name} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <rect x={20} y={36 + i * 38} width={440} height={30} rx={4}
                    fill={t.color + '0a'} stroke={t.color + '50'} strokeWidth={0.7} />
                  <text x={36} y={56 + i * 38} fontSize={9.5} fontWeight={700} fill={t.color}>{t.name}</text>
                  <text x={250} y={56 + i * 38} fontSize={10} fontWeight={700} fill={t.color}
                    textAnchor="end">{t.val}</text>
                  <text x={260} y={56 + i * 38} fontSize={8.5} fill="var(--muted-foreground)">{t.effect}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 7: attack defense */}
          {step === 7 && (
            <g>
              <text x={120} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">공격</text>
              <text x={350} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">방어</text>
              {ATTACKS.map((a, i) => (
                <motion.g key={a.attack} initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
                  <rect x={20} y={36 + i * 38} width={200} height={30} rx={4}
                    fill={a.color + '0a'} stroke={a.color + '50'} strokeWidth={0.7} />
                  <text x={36} y={55 + i * 38} fontSize={10} fontWeight={600} fill={a.color}>{a.attack}</text>
                  <text x={228} y={55 + i * 38} fontSize={11} fill="#94a3b8">→</text>
                  <rect x={245} y={36 + i * 38} width={215} height={30} rx={4}
                    fill="#10b9810a" stroke="#10b98150" strokeWidth={0.7} />
                  <text x={261} y={55 + i * 38} fontSize={9.5} fill="#10b981">{a.defense}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
