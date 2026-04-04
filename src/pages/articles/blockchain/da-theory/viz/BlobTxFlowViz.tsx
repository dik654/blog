import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, BLOBTX_FIELDS, SIDECAR_FIELDS, VALIDATE_STEPS } from './BlobTxFlowVizData';
import { BlobTxFlowStep2, BlobTxFlowStep3 } from './BlobTxFlowVizParts';

const C = { ind: '#6366f1', grn: '#10b981', amb: '#f59e0b', slate: '#94a3b8' };
const F = { fg: 'var(--foreground)', muted: 'var(--muted-foreground)' };

export default function BlobTxFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: BlobTx struct */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={30} y={14} width={220} height={18} rx={4}
                fill={`${C.ind}18`} stroke={C.ind} strokeWidth={1} />
              <text x={140} y={27} textAnchor="middle" fontSize={11}
                fontWeight={700} fill={C.ind}>BlobTx</text>
              {BLOBTX_FIELDS.map((f, i) => (
                <g key={f.name}>
                  <rect x={30} y={38 + i * 28} width={220} height={24} rx={3}
                    fill={`${f.color}08`} stroke={f.color} strokeWidth={0.8} />
                  <text x={42} y={54 + i * 28} fontSize={10}
                    fontWeight={600} fill={f.color}>{f.name}</text>
                  <text x={240} y={54 + i * 28} textAnchor="end" fontSize={10}
                    fill={F.muted}>{f.type}</text>
                </g>
              ))}
              <text x={140} y={216} textAnchor="middle" fontSize={10}
                fill={F.muted}>core/types/tx_blob.go</text>
            </motion.g>
          )}
          {/* Step 1: Sidecar struct */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={30} y={14} width={240} height={18} rx={4}
                fill={`${C.grn}18`} stroke={C.grn} strokeWidth={1} />
              <text x={150} y={27} textAnchor="middle" fontSize={11}
                fontWeight={700} fill={C.grn}>BlobTxSidecar</text>
              {SIDECAR_FIELDS.map((f, i) => (
                <g key={f.name}>
                  <rect x={30} y={40 + i * 36} width={240} height={30} rx={3}
                    fill={`${f.color}08`} stroke={f.color} strokeWidth={0.8} />
                  <text x={42} y={58 + i * 36} fontSize={11}
                    fontWeight={600} fill={f.color}>{f.name}</text>
                  <text x={190} y={58 + i * 36} fontSize={10}
                    fill={F.muted}>{f.type}</text>
                  <text x={260} y={58 + i * 36} textAnchor="end" fontSize={10}
                    fontWeight={600} fill={f.color}>{f.size}</text>
                </g>
              ))}
              <text x={150} y={166} textAnchor="middle" fontSize={10}
                fill={F.muted}>rlp:"-" → 블록 직렬화에서 제외</text>
              <rect x={310} y={40} width={170} height={70} rx={5}
                fill={`${C.slate}08`} stroke={C.slate} strokeWidth={0.8} />
              <text x={395} y={58} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={F.fg}>Version 필드</text>
              <text x={395} y={78} textAnchor="middle" fontSize={10}
                fill={C.amb}>0 = Cancun (blob proof)</text>
              <text x={395} y={96} textAnchor="middle" fontSize={10}
                fill={C.grn}>1 = Osaka (cell proof)</text>
            </motion.g>
          )}
          {step === 2 && <BlobTxFlowStep2 checks={VALIDATE_STEPS} />}
          {step === 3 && <BlobTxFlowStep3 />}
        </svg>
      )}
    </StepViz>
  );
}
