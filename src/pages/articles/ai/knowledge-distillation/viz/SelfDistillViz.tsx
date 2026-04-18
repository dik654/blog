import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, C } from './SelfDistillVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function SelfDistillViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Self-distillation concept */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={50} y={40} w={100} h={55} label="Model v1" sub="Teacher 역할" color={C.gen1} />

              {/* curved self-arrow */}
              <path d="M 150 67 C 200 20, 250 20, 250 67"
                fill="none" stroke={C.gen2} strokeWidth={1.2} markerEnd="url(#kd-self-arr)" />
              <text x={200} y={15} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.gen2}>
                자기 증류
              </text>

              <ModuleBox x={250} y={40} w={100} h={55} label="Model v2" sub="Student (동일 구조)" color={C.gen2} />

              <text x={240} y={120} textAnchor="middle" fontSize={8} fill={C.muted}>
                외부 Teacher 불필요 — 자기 자신이 Teacher
              </text>
            </motion.g>
          )}

          {/* Born-Again Networks */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Generation chain */}
              {['1세대', '2세대', '3세대'].map((gen, i) => (
                <g key={i}>
                  <ModuleBox x={20 + i * 150} y={50} w={90} h={48}
                    label={gen} sub={`acc: ${92 + i * 1.2}%`}
                    color={i === 0 ? C.gen1 : C.gen2} />
                  {i < 2 && (
                    <g>
                      <line x1={110 + i * 150} y1={74} x2={170 + i * 150} y2={74}
                        stroke={C.gen2} strokeWidth={1} markerEnd="url(#kd-self-arr)" />
                      <text x={140 + i * 150} y={67} textAnchor="middle"
                        fontSize={7} fill={C.gen2}>증류</text>
                    </g>
                  )}
                </g>
              ))}

              {/* Rising performance indicator */}
              <line x1={50} y1={130} x2={400} y2={115}
                stroke={C.gen2} strokeWidth={0.8} strokeDasharray="3 2" />
              <text x={420} y={118} fontSize={7.5} fill={C.gen2}>성능 ↑</text>
              <text x={240} y={150} textAnchor="middle" fontSize={8} fill={C.muted}>
                반복할수록 Student가 Teacher를 초월
              </text>
            </motion.g>
          )}

          {/* Deep Mutual Learning */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={40} y={40} w={100} h={55} label="Model A" sub="ResNet-32" color={C.gen1} />
              <ModuleBox x={280} y={40} w={100} h={55} label="Model B" sub="ResNet-32" color={C.mutual} />

              {/* Bidirectional arrows */}
              <line x1={140} y1={58} x2={280} y2={58}
                stroke={C.gen1} strokeWidth={1} markerEnd="url(#kd-mutual-arr1)" />
              <line x1={280} y1={76} x2={140} y2={76}
                stroke={C.mutual} strokeWidth={1} markerEnd="url(#kd-mutual-arr2)" />

              <text x={210} y={52} textAnchor="middle" fontSize={7.5} fill={C.gen1}>KL(p_A ∥ p_B)</text>
              <text x={210} y={90} textAnchor="middle" fontSize={7.5} fill={C.mutual}>KL(p_B ∥ p_A)</text>

              {/* Combined loss */}
              <rect x={140} y={110} width={160} height={40} rx={6}
                fill={`${C.mutual}08`} stroke={C.mutual} strokeWidth={0.8} />
              <text x={220} y={127} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.mutual}>
                상호 학습 손실
              </text>
              <text x={220} y={142} textAnchor="middle" fontSize={7.5} fill={C.muted}>
                L = L_CE + KL(A∥B) + KL(B∥A)
              </text>

              <text x={220} y={170} textAnchor="middle" fontSize={7.5} fill={C.muted}>
                독립 학습보다 두 모델 모두 성능 향상
              </text>
            </motion.g>
          )}

          {/* Label Smoothing connection */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Hard label */}
              <rect x={30} y={25} width={120} height={55} rx={6}
                fill={`${C.gen1}08`} stroke={C.gen1} strokeWidth={0.8} />
              <text x={90} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.gen1}>
                Hard Label
              </text>
              {/* bars */}
              <rect x={45} y={70} width={15} height={3} rx={1} fill={C.gen1} opacity={0.3} />
              <rect x={65} y={48} width={15} height={25} rx={1} fill={C.gen1} opacity={0.8} />
              <rect x={85} y={70} width={15} height={3} rx={1} fill={C.gen1} opacity={0.3} />
              <text x={90} y={85} textAnchor="middle" fontSize={7} fill={C.muted}>[0, 1, 0]</text>

              {/* Label Smoothing */}
              <rect x={180} y={25} width={120} height={55} rx={6}
                fill={`${C.smooth}08`} stroke={C.smooth} strokeWidth={0.8} />
              <text x={240} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.smooth}>
                Label Smoothing
              </text>
              <rect x={195} y={60} width={15} height={8} rx={1} fill={C.smooth} opacity={0.4} />
              <rect x={215} y={48} width={15} height={20} rx={1} fill={C.smooth} opacity={0.8} />
              <rect x={235} y={60} width={15} height={8} rx={1} fill={C.smooth} opacity={0.4} />
              <text x={240} y={85} textAnchor="middle" fontSize={7} fill={C.muted}>[0.05, 0.9, 0.05]</text>

              {/* Self-Distillation soft target */}
              <rect x={330} y={25} width={120} height={55} rx={6}
                fill={`${C.gen2}08`} stroke={C.gen2} strokeWidth={0.8} />
              <text x={390} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.gen2}>
                Self-Distill
              </text>
              <rect x={345} y={56} width={15} height={12} rx={1} fill={C.gen2} opacity={0.4} />
              <rect x={365} y={48} width={15} height={20} rx={1} fill={C.gen2} opacity={0.8} />
              <rect x={385} y={53} width={15} height={15} rx={1} fill={C.gen2} opacity={0.5} />
              <text x={390} y={85} textAnchor="middle" fontSize={7} fill={C.muted}>[0.08, 0.82, 0.10]</text>

              {/* relationship arrow */}
              <path d="M 240 85 L 240 110 L 390 110 L 390 85"
                fill="none" stroke={C.smooth} strokeWidth={0.8} strokeDasharray="3 2" />
              <text x={315} y={125} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.smooth}>
                유사한 정규화 효과
              </text>
              <text x={315} y={140} textAnchor="middle" fontSize={7.5} fill={C.muted}>
                Label smoothing = self-distillation의 특수 케이스
              </text>
            </motion.g>
          )}

          {/* Practical benefits */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Three benefit cards */}
              {[
                { label: 'Teacher 불필요', sub: '추가 학습 비용 0', color: C.benefit, x: 20 },
                { label: '정규화 효과', sub: '과적합 방지', color: C.gen2, x: 170 },
                { label: '범용 적용', sub: 'BERT, ViT, CNN...', color: C.gen1, x: 320 },
              ].map((card, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={card.x} y={30} width={130} height={55} rx={8}
                    fill={`${card.color}10`} stroke={card.color} strokeWidth={0.8} />
                  <text x={card.x + 65} y={52} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill={card.color}>{card.label}</text>
                  <text x={card.x + 65} y={70} textAnchor="middle"
                    fontSize={8} fill={C.muted}>{card.sub}</text>
                </motion.g>
              ))}

              {/* Pipeline integration */}
              <rect x={80} y={110} width={320} height={45} rx={6}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={130} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
                기존 학습 파이프라인에 바로 적용 가능
              </text>
              <text x={240} y={145} textAnchor="middle" fontSize={8} fill={C.muted}>
                train → self-distill → fine-tune (동일 파이프라인)
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="kd-self-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C.gen2} />
            </marker>
            <marker id="kd-mutual-arr1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C.gen1} />
            </marker>
            <marker id="kd-mutual-arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C.mutual} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
