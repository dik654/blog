import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS } from './chainRuleData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function ChainRuleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 150" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>

          {/* Simple chain: steps 0-4 */}
          {step < 5 && (
            <g>
              {/* y=2x box */}
              <motion.rect x={60} y={25} width={100} height={40} rx={6}
                fill={step >= 2 ? '#3b82f618' : '#80808008'}
                stroke={step >= 2 ? '#3b82f6' : '#888'}
                strokeWidth={1.2} transition={sp} />
              <text x={110} y={42} textAnchor="middle" fontSize={9}
                fontWeight={500} fill="#3b82f6">y = 2x</text>
              {step >= 2 && (
                <text x={110} y={56} textAnchor="middle" fontSize={9}
                  fill="#3b82f6">dy/dx = 2</text>
              )}

              {/* z=4y box */}
              <motion.rect x={220} y={25} width={100} height={40} rx={6}
                fill={step >= 2 ? '#10b98118' : '#80808008'}
                stroke={step >= 2 ? '#10b981' : '#888'}
                strokeWidth={1.2} transition={sp} />
              <text x={270} y={42} textAnchor="middle" fontSize={9}
                fontWeight={500} fill="#10b981">z = 4y</text>
              {step >= 2 && (
                <text x={270} y={56} textAnchor="middle" fontSize={9}
                  fill="#10b981">dz/dy = 4</text>
              )}

              {/* x input */}
              <text x={40} y={48} textAnchor="middle" fontSize={9}
                fill="var(--foreground)">x</text>
              {step >= 1 && (
                <text x={40} y={60} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">= 3</text>
              )}
              <line x1={50} y1={45} x2={58} y2={45}
                stroke="var(--border)" strokeWidth={0.8} />

              {/* y=6 between boxes */}
              {step >= 1 && (
                <motion.text x={185} y={42} textAnchor="middle"
                  fontSize={9} fill="var(--foreground)"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  y=6
                </motion.text>
              )}
              <line x1={162} y1={45} x2={218} y2={45}
                stroke="var(--border)" strokeWidth={0.8}
                markerEnd="url(#arr)" />

              {/* z=24 output */}
              {step >= 1 && (
                <motion.text x={345} y={42} textAnchor="middle"
                  fontSize={9} fill="var(--foreground)"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  z=24
                </motion.text>
              )}
              <line x1={322} y1={45} x2={340} y2={45}
                stroke="var(--border)" strokeWidth={0.8} />

              {/* chain rule result (step 3) */}
              {step === 3 && (
                <motion.g initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }} transition={sp}>
                  <rect x={100} y={78} width={230} height={32} rx={6}
                    fill="#8b5cf615" stroke="#8b5cf6" strokeWidth={1} />
                  <text x={215} y={98} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill="#8b5cf6">
                    dz/dx = 4 × 2 = 8
                  </text>
                </motion.g>
              )}

              {/* numerical verification (step 4) */}
              {step === 4 && (
                <motion.g initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }} transition={sp}>
                  {/* old values row */}
                  <rect x={40} y={76} width={380} height={56} rx={6}
                    fill="color-mix(in oklch, var(--muted) 6%, transparent)"
                    stroke="var(--border)" strokeWidth={0.6} />
                  <text x={55} y={92} fontSize={8}
                    fill="var(--muted-foreground)">기존</text>
                  <text x={55} y={104} fontSize={8}
                    fill="var(--muted-foreground)">변경</text>
                  {/* x column */}
                  <text x={110} y={81} textAnchor="middle" fontSize={8}
                    fontWeight={600} fill="var(--foreground)">x</text>
                  <text x={110} y={92} textAnchor="middle" fontSize={9}
                    fill="var(--foreground)">3.00</text>
                  <text x={110} y={104} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill="#6366f1">3.01</text>
                  {/* y column */}
                  <text x={210} y={81} textAnchor="middle" fontSize={8}
                    fontWeight={600} fill="var(--foreground)">y=2x</text>
                  <text x={210} y={92} textAnchor="middle" fontSize={9}
                    fill="var(--foreground)">6.00</text>
                  <text x={210} y={104} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill="#3b82f6">6.02</text>
                  {/* z column */}
                  <text x={310} y={81} textAnchor="middle" fontSize={8}
                    fontWeight={600} fill="var(--foreground)">z=4y</text>
                  <text x={310} y={92} textAnchor="middle" fontSize={9}
                    fill="var(--foreground)">24.00</text>
                  <text x={310} y={104} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill="#10b981">24.08</text>
                  {/* delta annotation */}
                  <text x={380} y={92} fontSize={8}
                    fill="var(--muted-foreground)">Δx=0.01</text>
                  <text x={380} y={104} fontSize={8}
                    fontWeight={600} fill="#8b5cf6">
                    Δz=0.08
                  </text>
                  <text x={215} y={126} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill="#8b5cf6">
                    Δz/Δx = 0.08/0.01 = 8 -- dz/dx = 8과 일치!
                  </text>
                </motion.g>
              )}
            </g>
          )}

          {/* Neural network application (step 5) */}
          {step >= 5 && (
            <motion.g initial={{ opacity: 0 }}
              animate={{ opacity: 1 }} transition={sp}>
              {/* h = m*x + b block */}
              <rect x={30} y={20} width={130} height={45} rx={6}
                fill="#3b82f618" stroke="#3b82f6" strokeWidth={1.2} />
              <text x={95} y={36} textAnchor="middle" fontSize={9}
                fontWeight={500} fill="#3b82f6">h = m·x + b</text>
              <text x={95} y={50} textAnchor="middle" fontSize={9}
                fill="#3b82f6">dh/dm = x = 2.35</text>

              {/* arrow */}
              <line x1={162} y1={42} x2={208} y2={42}
                stroke="var(--border)" strokeWidth={0.8}
                markerEnd="url(#arr)" />
              <text x={185} y={36} textAnchor="middle" fontSize={8}
                fill="var(--muted-foreground)">h=0</text>

              {/* L(softmax(h)) block */}
              <rect x={210} y={20} width={130} height={45} rx={6}
                fill="#ef444418" stroke="#ef4444" strokeWidth={1.2} />
              <text x={275} y={36} textAnchor="middle" fontSize={9}
                fontWeight={500} fill="#ef4444">L(softmax(h))</text>
              <text x={275} y={50} textAnchor="middle" fontSize={9}
                fill="#ef4444">dL/dh = y−ŷ = −0.91</text>

              {/* chain rule result */}
              <rect x={50} y={80} width={290} height={36} rx={6}
                fill="#8b5cf615" stroke="#8b5cf6" strokeWidth={1} />
              <text x={195} y={96} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#8b5cf6">
                dL/dm = dL/dh × dh/dm
              </text>
              <text x={195} y={110} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#8b5cf6">
                = (−0.91) × 2.35 = −2.14
              </text>

              {/* interpretation */}
              <text x={380} y={95} fontSize={8}
                fill="var(--muted-foreground)">m₂를 올리면</text>
              <text x={380} y={108} fontSize={8}
                fontWeight={600} fill="#10b981">손실 2.14 감소</text>
            </motion.g>
          )}

          <defs>
            <marker id="arr" markerWidth={6} markerHeight={6}
              refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--border)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
