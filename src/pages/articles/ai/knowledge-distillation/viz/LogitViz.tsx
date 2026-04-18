import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { STEPS, C } from './LogitVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* bar heights for probability distributions */
const teacherBars = [
  { label: '고양이', h: 42, color: C.soft },
  { label: '호랑이', h: 14, color: C.soft },
  { label: '강아지', h: 4, color: C.soft },
];
const studentBars = [
  { label: '고양이', h: 35, color: C.student },
  { label: '호랑이', h: 18, color: C.student },
  { label: '강아지', h: 8, color: C.student },
];

function ProbBars({ bars, x, y, label, show }: {
  bars: { label: string; h: number; color: string }[];
  x: number; y: number; label: string; show: boolean;
}) {
  if (!show) return null;
  const barW = 18;
  const gap = 6;
  const baseY = y + 55;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={x + ((barW + gap) * bars.length) / 2 - gap / 2} y={y} textAnchor="middle"
        fontSize={8} fontWeight={600} fill="var(--foreground)">{label}</text>
      {bars.map((b, i) => (
        <g key={i}>
          <motion.rect
            x={x + i * (barW + gap)} y={baseY - b.h}
            width={barW} height={b.h} rx={3}
            fill={b.color} opacity={0.7}
            initial={{ height: 0, y: baseY }}
            animate={{ height: b.h, y: baseY - b.h }}
            transition={{ ...sp, delay: i * 0.08 }}
          />
          <text x={x + i * (barW + gap) + barW / 2} y={baseY + 10}
            textAnchor="middle" fontSize={7} fill={C.muted}>{b.label}</text>
        </g>
      ))}
    </motion.g>
  );
}

export default function LogitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Teacher soft distribution */}
          <ProbBars bars={teacherBars} x={30} y={15} label="Teacher soft (T>1)" show={step >= 0} />

          {/* Student soft distribution */}
          <ProbBars bars={studentBars} x={130} y={15} label="Student soft (T>1)" show={step >= 1} />

          {/* KL divergence arrow */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={95} y1={45} x2={130} y2={45}
                stroke={C.kl} strokeWidth={1.2} strokeDasharray="3 2" markerEnd="url(#kd-kl-arr)" />
              <rect x={220} y={15} width={130} height={50} rx={6}
                fill={`${C.kl}10`} stroke={C.kl} strokeWidth={0.8} />
              <text x={285} y={33} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={C.kl}>
                KL Divergence
              </text>
              <text x={285} y={46} textAnchor="middle" fontSize={7.5} fill={C.muted}>
                L_soft = T² · KL(p_T ∥ q_T)
              </text>
              <text x={285} y={58} textAnchor="middle" fontSize={7} fill={C.muted}>
                T²: gradient 보상 계수
              </text>
            </motion.g>
          )}

          {/* Hard loss */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={220} y={80} width={130} height={45} rx={6}
                fill={`${C.hard}10`} stroke={C.hard} strokeWidth={0.8} />
              <text x={285} y={97} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={C.hard}>
                Cross-Entropy
              </text>
              <text x={285} y={110} textAnchor="middle" fontSize={7.5} fill={C.muted}>
                L_hard = CE(y, σ(q))
              </text>
              <text x={285} y={120} textAnchor="middle" fontSize={7} fill={C.muted}>
                y: one-hot, σ: softmax(T=1)
              </text>

              {/* one-hot label */}
              <DataBox x={45} y={85} w={70} h={28} label="Hard Label" sub="[0, 1, 0]" color={C.hard} />
              <line x1={115} y1={99} x2={220} y2={99}
                stroke={C.hard} strokeWidth={0.8} markerEnd="url(#kd-hard-arr)" />
            </motion.g>
          )}

          {/* Final combined loss */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={sp}>
              {/* merge arrows */}
              <line x1={350} y1={40} x2={380} y2={160} stroke={C.kl} strokeWidth={0.8} />
              <line x1={350} y1={102} x2={380} y2={160} stroke={C.hard} strokeWidth={0.8} />

              <rect x={360} y={140} width={110} height={55} rx={8}
                fill={`${C.teacher}08`} stroke={C.teacher} strokeWidth={1} />
              <text x={415} y={157} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.teacher}>
                Total Loss
              </text>
              <text x={415} y={170} textAnchor="middle" fontSize={7.5} fill={C.muted}>
                α · L_hard + (1-α) · L_soft
              </text>
              <text x={415} y={182} textAnchor="middle" fontSize={7} fill={C.muted}>
                α=0.1, T=4~20 (실전)
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="kd-kl-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C.kl} />
            </marker>
            <marker id="kd-hard-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C.hard} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
