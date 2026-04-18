import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '초기 가중치: m₁=1, m₂=0, m₃=−1, b=0' },
  { label: '파리 경도 x=2.35 입력' },
  { label: 'h₁ = 1×2.35+0 = 2.35' },
  { label: 'h₂ = 0×2.35+0 = 0' },
  { label: 'h₃ = −1×2.35+0 = −2.35' },
];

const NEURONS = [
  { label: 'h₁', m: 1, city: '마드리드', color: '#ef4444' },
  { label: 'h₂', m: 0, city: '파리', color: '#3b82f6' },
  { label: 'h₃', m: -1, city: '베를린', color: '#10b981' },
];
const X = 2.35;
const H = [2.35, 0, -2.35];
const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function ForwardPassViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Input node */}
          <motion.rect x={30} y={50} width={70} height={36} rx={6}
            fill={step >= 1 ? '#6366f120' : '#80808008'}
            stroke={step >= 1 ? '#6366f1' : '#888'} strokeWidth={1.2}
            transition={sp} />
          <text x={65} y={65} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="#6366f1">x = 입력</text>
          {step >= 1 && (
            <motion.text x={65} y={78} textAnchor="middle" fontSize={9}
              fill="#6366f1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              2.35
            </motion.text>
          )}

          {/* Neurons */}
          {NEURONS.map((n, i) => {
            const ny = 18 + i * 44;
            const active = step >= i + 2;
            return (
              <g key={i}>
                {/* connection line */}
                <motion.line x1={100} y1={68} x2={180} y2={ny + 18}
                  stroke={active ? n.color : '#80808040'}
                  strokeWidth={active ? 1.2 : 0.6}
                  transition={sp} />
                {/* weight label with opaque background */}
                {(() => {
                  const ly = ny + (i === 0 ? 8 : i === 2 ? 28 : 16);
                  return (
                    <g>
                      <rect x={118} y={ly - 9} width={44} height={13} rx={3}
                        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                      <text x={140} y={ly}
                        textAnchor="middle" fontSize={9}
                        fontWeight={600} fill={n.color}>m={n.m}</text>
                    </g>
                  );
                })()}

                {/* neuron box */}
                <motion.rect x={180} y={ny} width={110} height={36} rx={6}
                  fill={active ? `${n.color}15` : '#80808008'}
                  stroke={active ? n.color : '#888'}
                  strokeWidth={active ? 1.2 : 0.6} transition={sp} />
                <text x={235} y={ny + 14} textAnchor="middle" fontSize={9}
                  fontWeight={500} fill={n.color}>{n.label} ({n.city})</text>
                <text x={235} y={ny + 27} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  {n.m}×{X}+0 = {H[i]}
                </text>

                {/* output value */}
                {active && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <rect x={310} y={ny + 6} width={50} height={22} rx={4}
                      fill={`${n.color}20`} stroke={n.color} strokeWidth={0.8} />
                    <text x={335} y={ny + 21} textAnchor="middle" fontSize={9}
                      fontWeight={600} fill={n.color}>{H[i]}</text>
                  </motion.g>
                )}
              </g>
            );
          })}

          {/* formula */}
          <text x={400} y={130} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">h = m·x + b</text>
        </svg>
      )}
    </StepViz>
  );
}
