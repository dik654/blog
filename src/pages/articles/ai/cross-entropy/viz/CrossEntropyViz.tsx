import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, P_C, Q_C, CE_C, OK_C, LABELS, P_VALS, Q_VALS } from './CrossEntropyVizData';

export default function CrossEntropyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const q = Q_VALS[step];
        const ce = -P_VALS.reduce((s, p, i) => s + (p > 0 ? p * Math.log2(q[i]) : 0), 0);
        const qColor = step === 3 ? OK_C : Q_C;

        return (
          <svg viewBox="0 0 500 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* P distribution */}
            <text x={40} y={18} fontSize={9} fontWeight={700} fill={P_C}>P (정답)</text>
            {LABELS.map((l, i) => (
              <g key={`p-${i}`}>
                <rect x={40 + i * 70} y={25} width={60} height={26} rx={5}
                  fill={P_C + (P_VALS[i] ? '20' : '06')}
                  stroke={P_C} strokeWidth={P_VALS[i] ? 1.5 : 0.5}
                  strokeOpacity={P_VALS[i] ? 1 : 0.3} />
                <text x={70 + i * 70} y={36} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={P_C} fillOpacity={P_VALS[i] ? 1 : 0.3}>{l}</text>
                <text x={70 + i * 70} y={47} textAnchor="middle" fontSize={9}
                  fill={P_C} fillOpacity={P_VALS[i] ? 1 : 0.4}>{P_VALS[i]}</text>
              </g>
            ))}

            {/* Q distribution */}
            {step >= 1 && (
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                <text x={40} y={78} fontSize={9} fontWeight={700} fill={qColor}>Q (모델)</text>
                {LABELS.map((l, i) => (
                  <g key={`q-${i}`}>
                    <motion.rect x={40 + i * 70} y={85} width={60} height={26} rx={5}
                      fill={qColor + '15'} stroke={qColor} strokeWidth={1.5} key={`qr-${i}-${step}`} />
                    <text x={70 + i * 70} y={96} textAnchor="middle" fontSize={9}
                      fontWeight={600} fill={qColor}>{l}</text>
                    <motion.text x={70 + i * 70} y={107} textAnchor="middle"
                      fontSize={9} fontWeight={700} fill={qColor}
                      key={`qv-${i}-${step}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {q[i].toFixed(2)}
                    </motion.text>
                  </g>
                ))}
              </motion.g>
            )}

            {/* CE calculation */}
            {step >= 2 && (
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                <line x1={40} y1={125} x2={250} y2={125}
                  stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />
                <text x={40} y={148} fontSize={9} fontWeight={700} fill={CE_C}>
                  H(P, Q) = -Σ P(x) · log₂ Q(x)
                </text>
                <rect x={280} y={132} width={100} height={28} rx={6}
                  fill={(step === 3 ? OK_C : CE_C) + '15'}
                  stroke={step === 3 ? OK_C : CE_C} strokeWidth={1.5} />
                <motion.text x={330} y={150} textAnchor="middle" fontSize={12} fontWeight={700}
                  fill={step === 3 ? OK_C : CE_C} key={`ce-${step}`}
                  initial={{ scale: 0.8 }} animate={{ scale: 1 }}>{ce.toFixed(2)}</motion.text>
              </motion.g>
            )}

            {/* arrows P→Q */}
            {step >= 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}>
                {P_VALS.map((p, i) => p > 0 ? (
                  <line key={`ar-${i}`} x1={70 + i * 70} y1={53} x2={70 + i * 70} y2={83}
                    stroke={CE_C} strokeWidth={1.5} strokeDasharray="3 2" />
                ) : null)}
              </motion.g>
            )}

            {step === 3 && (
              <motion.text x={400} y={150} fontSize={9} fill={OK_C}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>수렴!</motion.text>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
