import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, HEADER_CHECKS, TAYLOR_ITERS } from './BlobGasFlowVizData';
import { GasStep1, GasStep2 } from './BlobGasFlowVizParts';

const C = { ind: '#6366f1', grn: '#10b981', amb: '#f59e0b', red: '#ef4444' };
const F = { fg: 'var(--foreground)', muted: 'var(--muted-foreground)' };

export default function BlobGasFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: VerifyEIP4844Header */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={20} y={10} width={480} height={22} rx={4}
                fill={`${C.ind}10`} stroke={C.ind} strokeWidth={1} />
              <text x={260} y={25} textAnchor="middle" fontSize={11}
                fontWeight={700} fill={F.fg}>
                VerifyEIP4844Header(chain, parent, header) error
              </text>
              <text x={260} y={46} textAnchor="middle" fontSize={10}
                fill={F.muted}>consensus/misc/eip4844/eip4844.go</text>
              {HEADER_CHECKS.map((c, i) => (
                <motion.g key={c.label}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <rect x={40} y={58 + i * 30} width={200} height={24} rx={4}
                    fill={`${c.color}08`} stroke={c.color} strokeWidth={0.8} />
                  <text x={50} y={74 + i * 30} fontSize={10}
                    fontWeight={600} fill={c.color}>{`${i + 1}. ${c.label}`}</text>
                  <text x={250} y={74 + i * 30} fontSize={11}
                    fill={C.grn}>OK</text>
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}>
                <rect x={300} y={58} width={180} height={50} rx={5}
                  fill={`${C.red}08`} stroke={C.red} strokeWidth={1} />
                <text x={390} y={78} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={C.red}>검증 실패 시</text>
                <text x={390} y={96} textAnchor="middle" fontSize={10}
                  fill={F.muted}>ErrInvalidExcessBlobGas</text>
              </motion.g>
            </motion.g>
          )}
          {step === 1 && <GasStep1 />}
          {step === 2 && <GasStep2 />}
          {/* Step 3: fakeExponential loop */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={20} y={10} width={480} height={22} rx={4}
                fill={`${C.amb}10`} stroke={C.amb} strokeWidth={1} />
              <text x={260} y={25} textAnchor="middle" fontSize={11}
                fontWeight={700} fill={F.fg}>
                fakeExponential(factor, num, denom) *big.Int
              </text>
              {TAYLOR_ITERS.map((t, i) => {
                const barW = Math.max(20, 300 - i * 65);
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}>
                    <rect x={40} y={44 + i * 32} width={barW} height={24} rx={3}
                      fill={`${C.amb}${Math.round(8 + i * 4).toString(16).padStart(2, '0')}`}
                      stroke={C.amb} strokeWidth={0.8} />
                    <text x={50} y={60 + i * 32} fontSize={10}
                      fontWeight={600} fill={C.amb}>{t.label}</text>
                    <text x={barW + 50} y={60 + i * 32} fontSize={10}
                      fill={F.muted}>{t.term}</text>
                  </motion.g>
                );
              })}
              <text x={260} y={210} textAnchor="middle" fontSize={10}
                fill={F.muted}>output / denom → 최종 가격 (wei)</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
