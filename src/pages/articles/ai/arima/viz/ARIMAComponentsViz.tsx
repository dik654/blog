import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, T, CY, sp } from './ARIMAComponentsVizData';

export default function ARIMAComponentsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 360 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Timeline boxes: Y_{t-4}...Y_t */}
          {T.map(i => {
            const x = 30 + i * 70;
            const label = i < 4 ? `Y_{t-${4 - i}}` : 'Yₜ';
            const isCurrent = i === 4;
            return (
              <g key={i}>
                <rect x={x} y={CY - 12} width={50} height={24} rx={5}
                  fill={isCurrent ? '#6366f115' : '#80808008'}
                  stroke={isCurrent ? '#6366f1' : '#666'} strokeWidth={isCurrent ? 2 : 0.8} />
                <text x={x + 25} y={CY + 2} textAnchor="middle" fontSize={9}
                  fill={isCurrent ? '#6366f1' : 'var(--foreground)'} fontWeight={isCurrent ? 700 : 400}>{label}</text>
              </g>
            );
          })}

          {/* Step 0: full equation */}
          {step === 0 && (
            <motion.text x={180} y={100} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Yₜ = c + Σφᵢ Y'ₜ₋ᵢ + Σθⱼ εₜ₋ⱼ + εₜ
            </motion.text>
          )}

          {/* Step 1: AR arrows from past values */}
          {step === 1 && [2, 3].map(i => {
            const x1 = 30 + i * 70 + 50;
            const x2 = 30 + 4 * 70;
            return (
              <motion.g key={`ar${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: (i - 2) * 0.15 }}>
                <motion.line x1={x1} y1={CY - 5} x2={x2} y2={CY - 5}
                  stroke="#10b981" strokeWidth={1.5} markerEnd="url(#arrowG)" />
                <rect x={(x1 + x2) / 2 - 8} y={CY - 17} width={16} height={10} rx={2} fill="var(--card)" />
                <text x={(x1 + x2) / 2} y={CY - 10} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
                  φ{i === 2 ? '₂' : '₁'}
                </text>
              </motion.g>
            );
          })}

          {/* Step 2: differencing */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={240} y1={CY + 16} x2={310} y2={CY + 16} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
              <text x={275} y={CY + 30} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>Y'ₜ = Yₜ − Yₜ₋₁</text>
              <text x={275} y={CY + 42} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">추세 제거</text>
              <rect x={240} y={CY - 12} width={50} height={24} rx={5} fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" />
              <rect x={310} y={CY - 12} width={50} height={24} rx={5} fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" />
            </motion.g>
          )}

          {/* Step 3: MA arrows from past errors */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[2, 3].map(i => {
                const x1 = 30 + i * 70 + 25;
                const x2 = 30 + 4 * 70 + 25;
                return (
                  <g key={`ma${i}`}>
                    <text x={x1} y={CY + 26} textAnchor="middle" fontSize={9} fill="#8b5cf6">ε{i === 2 ? '₋₂' : '₋₁'}</text>
                    <motion.line x1={x1} y1={CY + 16} x2={x2} y2={CY + 8}
                      stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="3 2" markerEnd="url(#arrowP)"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: (i - 2) * 0.2 }} />
                    <rect x={(x1 + x2) / 2 - 8} y={CY + 15} width={16} height={10} rx={2} fill="var(--card)" />
                    <text x={(x1 + x2) / 2} y={CY + 22} textAnchor="middle" fontSize={9} fill="#8b5cf6" fontWeight={600}>
                      θ{i === 2 ? '₂' : '₁'}
                    </text>
                  </g>
                );
              })}
            </motion.g>
          )}

          {/* Arrow markers */}
          <defs>
            <marker id="arrowG" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#10b981" />
            </marker>
            <marker id="arrowP" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#8b5cf6" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
