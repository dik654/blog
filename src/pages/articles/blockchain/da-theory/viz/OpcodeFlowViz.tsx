import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, BLOBHASH_STACK } from './OpcodeFlowVizData';
import { OpcodeStep1, OpcodeStep2 } from './OpcodeFlowVizParts';

const C = { ind: '#6366f1', grn: '#10b981', amb: '#f59e0b', red: '#ef4444' };
const F = { fg: 'var(--foreground)', muted: 'var(--muted-foreground)' };

export default function OpcodeFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={20} y={10} width={480} height={22} rx={4}
                fill={`${C.ind}10`} stroke={C.ind} strokeWidth={1} />
              <text x={260} y={25} textAnchor="middle" fontSize={11}
                fontWeight={700} fill={F.fg}>opBlobHash(pc, interpreter, scope)</text>
              <text x={260} y={44} textAnchor="middle" fontSize={10}
                fill={F.muted}>core/vm/eips.go : BLOBHASH (0x49)</text>
              {/* EVM Stack */}
              <rect x={30} y={56} width={80} height={100} rx={5}
                fill={`${C.ind}06`} stroke={C.ind} strokeWidth={1} />
              <text x={70} y={72} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C.ind}>EVM Stack</text>
              <rect x={38} y={80} width={64} height={24} rx={3}
                fill={`${C.amb}15`} stroke={C.amb} strokeWidth={1} />
              <text x={70} y={96} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C.amb}>index</text>
              <text x={70} y={120} textAnchor="middle" fontSize={10}
                fill={F.muted}>pop</text>
              {BLOBHASH_STACK.map((s, i) => (
                <motion.g key={s.phase}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}>
                  <rect x={140 + i * 120} y={56} width={110} height={46} rx={4}
                    fill={`${[C.amb, C.red, C.grn][i]}08`}
                    stroke={[C.amb, C.red, C.grn][i]} strokeWidth={1} />
                  <text x={195 + i * 120} y={74} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={[C.amb, C.red, C.grn][i]}>{s.value}</text>
                  <text x={195 + i * 120} y={92} textAnchor="middle" fontSize={10}
                    fill={F.muted}>{s.desc}</text>
                  {i < 2 && (
                    <line x1={250 + i * 120} y1={79} x2={260 + i * 120} y2={79}
                      stroke={F.muted} strokeWidth={0.8} />
                  )}
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}>
                <rect x={260} y={116} width={200} height={26} rx={4}
                  fill={`${C.red}08`} stroke={C.red} strokeWidth={0.8} />
                <text x={360} y={133} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={C.red}>
                  범위 밖 → stack.Clear() (0x00)
                </text>
              </motion.g>
            </motion.g>
          )}
          {step === 1 && <OpcodeStep1 />}
          {step === 2 && <OpcodeStep2 />}
        </svg>
      )}
    </StepViz>
  );
}
