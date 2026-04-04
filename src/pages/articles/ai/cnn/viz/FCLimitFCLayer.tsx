import { motion } from 'framer-motion';
import { sp, GRID } from './FCLimitVizData';

export default function FCLimitFCLayer({ step }: { step: number }) {
  if (step > 2) return null;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {/* Flattened 1D vector */}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={`flat-${i}`}>
          <rect x={110} y={10 + i * 14} width={8} height={10} rx={1}
            fill={step >= 1 ? '#f59e0b20' : '#64748b10'} stroke={step >= 1 ? '#f59e0b' : '#94a3b8'} strokeWidth={0.5} />
        </g>
      ))}
      {step >= 1 && (
        <text x={114} y={128} textAnchor="middle" fontSize={11} fill="#f59e0b">1D 벡터</text>
      )}

      {/* FC neurons */}
      {Array.from({ length: 4 }, (_, i) => (
        <motion.circle key={`n-${i}`} cx={180} cy={25 + i * 28} r={7}
          fill="#ef444420" stroke="#ef4444" strokeWidth={1}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ ...sp, delay: i * 0.05 }} />
      ))}

      {/* All connections (FC) */}
      {step >= 2 && Array.from({ length: 8 }, (_, fi) =>
        Array.from({ length: 4 }, (_, ni) => (
          <motion.line key={`c-${fi}-${ni}`}
            x1={118} y1={15 + fi * 14} x2={173} y2={25 + ni * 28}
            stroke="#ef4444" strokeWidth={0.3} strokeOpacity={0.4}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: (fi + ni) * 0.01 }} />
        ))
      )}

      {step >= 2 && (
        <motion.text x={180} y={128} textAnchor="middle" fontSize={11} fill="#ef4444" fontWeight={600}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {GRID * GRID}×4 = {GRID * GRID * 4} 파라미터
        </motion.text>
      )}
    </motion.g>
  );
}
