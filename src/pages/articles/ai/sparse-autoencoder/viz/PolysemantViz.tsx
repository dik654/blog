import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './PolysemantVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function Neuron({ cx, cy, active, color }: {
  cx: number; cy: number; active: boolean; color: string;
}) {
  return (
    <motion.circle cx={cx} cy={cy} r={active ? 8 : 6}
      fill={active ? `${color}44` : `${color}15`}
      stroke={color} strokeWidth={active ? 2 : 1}
      animate={{ r: active ? 8 : 6 }} transition={sp} />
  );
}

export default function PolysemantViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 135" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {/* Neuron grid */}
          {[0, 1, 2, 3, 4].map((i) => (
            <Neuron key={i} cx={60 + i * 30} cy={55}
              active={i === 2} color={C.neuron} />
          ))}
          <text x={120} y={80} textAnchor="middle" fontSize={9}
            fill={C.muted}>#1423</text>

          {/* Step 0: single concept */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={220} y={38} width={60} height={24} rx={5}
                fill={`${C.neuron}18`} stroke={C.neuron} strokeWidth={1.2} />
              <text x={250} y={54} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C.neuron}>의심</text>
              <line x1={150} y1={55} x2={218} y2={50}
                stroke={C.neuron} strokeWidth={1} strokeDasharray="3 2" />
              <text x={310} y={53} fontSize={9} fill={C.muted}>
                높은 활성화 ✓
              </text>
            </motion.g>
          )}

          {/* Step 1: polysemanticity */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {['의심', '대문자', '법률'].map((label, i) => (
                <g key={label}>
                  <rect x={220} y={18 + i * 28} width={55} height={22} rx={4}
                    fill={`${C.multi}15`} stroke={C.multi} strokeWidth={1.2} />
                  <text x={247} y={33 + i * 28} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={C.multi}>{label}</text>
                  <motion.line x1={150} y1={55} x2={218} y2={29 + i * 28}
                    stroke={C.multi} strokeWidth={1} strokeDasharray="3 2"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                    transition={{ delay: i * 0.15 }} />
                </g>
              ))}
              <text x={300} y={53} fontSize={9} fill={C.multi}>
                같은 뉴런 → 다수 개념
              </text>
            </motion.g>
          )}

          {/* Step 2: superposition */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.line key={i} x1={60 + i * 30} y1={55}
                  x2={260} y2={50}
                  stroke={C.super} strokeWidth={1} strokeDasharray="3 2"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                  transition={{ delay: i * 0.08 }} />
              ))}
              <rect x={240} y={32} width={80} height={36} rx={6}
                fill={`${C.super}12`} stroke={C.super} strokeWidth={1.5} />
              <text x={280} y={48} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C.super}>개념 A</text>
              <text x={280} y={60} textAnchor="middle" fontSize={9}
                fill={C.muted}>뉴런 조합으로 표현</text>
              <text x={350} y={40} fontSize={9} fill={C.super}>
                N개 뉴런 →
              </text>
              <text x={350} y={52} fontSize={9} fill={C.super}>
                N+α 개 개념
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
