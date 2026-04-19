import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, ActionBox } from '@/components/viz/boxes';

const ATK = '#ef4444';
const VICTIM = '#f59e0b';
const DEF = '#10b981';

const STEPS = [
  { label: 'Step 1 — Populate', body: '공격자가 수많은 fake node를 네트워크에 주입. 각각 유효한 ID, 응답 가능한 IP.' },
  { label: 'Step 2 — Table Pollution', body: 'self-introduction 메시지로 victim의 routing table에 진입 시도.' },
  { label: 'Step 3 — Displacement', body: 'victim이 peer 교체 시 공격자 노드를 선호하도록 유도. 정직 노드를 점진적으로 대체.' },
  { label: 'Step 4 — Isolation', body: 'victim의 모든 연결이 공격자. 네트워크 view를 완전히 제어.' },
  { label: 'Impact', body: 'Bitcoin: double-spend, censorship, fake chain. Ethereum: state manip., validator isolation. IPFS: 콘텐츠 검열.' },
  { label: 'Defense Stack', body: 'IP diversity (/16, /24) + Node Age Priority + Random Walk + Table Rotation + Manual peers — 5겹.' },
];

const DEFENSES = [
  { label: 'IP Diversity', sub: '/16, /24 subnet limits' },
  { label: 'Node Age Priority', sub: '오래된 노드 보존' },
  { label: 'Random Walk', sub: '주기 random peer 교체' },
  { label: 'Table Rotation', sub: 'stuck 방지 강제 교체' },
  { label: 'Manual Peers', sub: 'hardcoded trusted' },
];

export default function EclipseStagesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 1-4 layout: attacker pool -> victim table */}
          {step <= 4 && (
            <>
              {/* Attacker pool */}
              <text x={70} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={ATK}>
                Attacker Fake Nodes
              </text>
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const visible = step >= 0;
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: visible ? 1 : 0, scale: 1 }}
                    transition={{ delay: i * 0.04 }}>
                    <circle cx={30 + (i % 3) * 35} cy={32 + Math.floor(i / 3) * 28} r={10}
                      fill={`${ATK}25`} stroke={ATK} strokeWidth={1} />
                    <text x={30 + (i % 3) * 35} y={36 + Math.floor(i / 3) * 28}
                      textAnchor="middle" fontSize={8} fill={ATK}>F{i + 1}</text>
                  </motion.g>
                );
              })}

              {/* Victim node */}
              <ModuleBox x={195} y={90} w={90} h={36} label="Victim" sub="routing table" color={VICTIM} />

              {/* Honest peers slots in victim */}
              {[0, 1, 2, 3].map((i) => {
                const replaced = step >= 3;
                const polluted = step >= 2;
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}>
                    <rect x={310 + (i % 2) * 50} y={70 + Math.floor(i / 2) * 36}
                      width={42} height={26} rx={4}
                      fill={replaced ? `${ATK}20` : polluted ? `${VICTIM}20` : `${DEF}25`}
                      stroke={replaced ? ATK : polluted ? VICTIM : DEF}
                      strokeWidth={1}
                      strokeDasharray={replaced ? '3 2' : 'none'} />
                    <text x={331 + (i % 2) * 50} y={86 + Math.floor(i / 2) * 36}
                      textAnchor="middle" fontSize={8}
                      fill={replaced ? ATK : polluted ? VICTIM : DEF}>
                      {replaced ? `F${i + 1}` : `P${i + 1}`}
                    </text>
                  </motion.g>
                );
              })}
              <text x={355} y={158} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                victim peer slots
              </text>

              {/* Pollution arrow (step 2+) */}
              {step >= 1 && (
                <motion.line
                  x1={110} y1={108} x2={195} y2={108}
                  stroke={ATK} strokeWidth={1.2} strokeDasharray="4 2"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} />
              )}
              {step >= 1 && (
                <text x={155} y={102} textAnchor="middle" fontSize={9} fill={ATK}>
                  inject
                </text>
              )}

              {/* Step 4: isolation overlay */}
              {step >= 3 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AlertBox x={180} y={170} w={120} h={40}
                    label="Isolated" sub="공격자 view 만 보임" color={ATK} />
                </motion.g>
              )}

              {/* Step 4 (impacts) */}
              {step >= 4 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <text x={350} y={185} fontSize={9} fontWeight={600} fill={ATK}>Double-spend</text>
                  <text x={350} y={198} fontSize={9} fontWeight={600} fill={ATK}>Censorship</text>
                  <text x={350} y={211} fontSize={9} fontWeight={600} fill={ATK}>Fake chain</text>
                </motion.g>
              )}
            </>
          )}

          {/* Step 5: Defense stack */}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={DEF}>
                Eclipse Defense Stack
              </text>
              {DEFENSES.map((d, i) => (
                <motion.g key={d.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <ActionBox x={70} y={36 + i * 36} w={340} h={28}
                    label={d.label} sub={d.sub} color={DEF} />
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
