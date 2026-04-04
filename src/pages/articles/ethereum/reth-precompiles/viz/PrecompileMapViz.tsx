import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, PRECOMPILES } from './PrecompileMapVizData';

export default function PrecompileMapViz() {
  return (
    <StepViz steps={STEPS}>
      {(s) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* EVM CALL box */}
          <motion.g animate={{ opacity: s >= 1 ? 1 : 0.3 }}>
            <rect x={10} y={80} width={80} height={36} rx={6} fill="#6366f115" stroke="#6366f1" strokeWidth={1.2} />
            <text x={50} y={102} textAnchor="middle" fontSize={11} fontWeight="600" fill="#6366f1">EVM CALL</text>
          </motion.g>

          {/* Arrow EVM → dispatch */}
          {s >= 2 && (
            <motion.line x1={90} y1={98} x2={130} y2={98} stroke="#6366f1" strokeWidth={1.5}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
          )}

          {/* Dispatch box */}
          <motion.g animate={{ opacity: s >= 2 ? 1 : 0.2 }}>
            <rect x={130} y={70} width={90} height={56} rx={6} fill="#8b5cf615" stroke="#8b5cf6" strokeWidth={1.2} />
            <text x={175} y={92} textAnchor="middle" fontSize={11} fontWeight="600" fill="#8b5cf6">HashMap</text>
            <text x={175} y={106} textAnchor="middle" fontSize={10} fill="#8b5cf6">주소 → fn 조회</text>
          </motion.g>

          {/* Precompile list */}
          {PRECOMPILES.map((p, i) => {
            const y = 20 + i * 38;
            const active = s === 0 || s >= 3;
            return (
              <motion.g key={p.addr} animate={{ opacity: active ? 1 : 0.15 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                <rect x={260} y={y} width={100} height={28} rx={5} fill={`${p.color}15`} stroke={p.color} strokeWidth={1} />
                <text x={270} y={y + 12} fontSize={10} fontFamily="monospace" fill={p.color}>{p.addr}</text>
                <text x={270} y={y + 22} fontSize={11} fontWeight="600" fill={p.color}>{p.name}</text>
                {/* Gas cost */}
                <motion.g animate={{ opacity: s >= 3 ? 1 : 0 }}>
                  <rect x={370} y={y + 2} width={70} height={24} rx={4} fill={`${p.color}08`} stroke={p.color} strokeWidth={0.6} />
                  <text x={405} y={y + 18} textAnchor="middle" fontSize={10} fill={p.color}>{p.gas} gas</text>
                </motion.g>
              </motion.g>
            );
          })}

          {/* Arrow dispatch → precompiles */}
          {s >= 2 && (
            <motion.line x1={220} y1={98} x2={258} y2={98} stroke="#8b5cf6" strokeWidth={1.2}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.2 }} />
          )}

          {/* Result arrow */}
          {s === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={440} y1={100} x2={460} y2={100} stroke="#10b981" strokeWidth={1.5} />
              <rect x={442} y={86} width={30} height={28} rx={4} fill="#10b98115" stroke="#10b981" strokeWidth={1} />
              <text x={457} y={104} textAnchor="middle" fontSize={10} fontWeight="600" fill="#10b981">32B</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
