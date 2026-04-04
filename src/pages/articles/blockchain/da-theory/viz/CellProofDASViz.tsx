import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
const STEPS = [
  { label: 'Blob = 4096 필드 원소 (128KB)', body: 'BLS12-381 스칼라 필드 원소 32바이트 × 4096개 = 131,072 바이트.' },
  { label: '128개 Cell로 분할 (각 1KB)', body: '4096 / 128 = cell당 32개 원소. 각 cell은 독립 KZG 증명을 가진다.' },
  { label: 'Reed-Solomon 2배 확장: 256 Cells', body: '다항식을 2배 지점에서 평가하여 128→256 cell로 확장. 50% 손실 복구 가능.' },
  { label: 'DAS: 75개 랜덤 샘플 → 99.6%', body: '랜덤 75개 cell 요청으로 전체 가용성을 확률적으로 보장한다.' },
];
const COLS = 16, ROWS = 8;

export default function CellProofDASViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const totalCells = step >= 2 ? COLS * ROWS * 2 : COLS * ROWS;
        const sampled = step === 3
          ? new Set(Array.from({ length: 75 }, (_, i) => (i * 3 + 7) % totalCells))
          : new Set<number>();
        const isExtended = step >= 2;

        return (
          <svg viewBox="0 0 520 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* Title */}
            <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={600}
              fill="var(--foreground)">
              {step === 0 ? 'Blob: 4096 필드 원소' : step === 1 ? '128 Cells (각 32 원소)'
                : step === 2 ? 'Reed-Solomon 확장: 256 Cells' : 'DAS 샘플링: 75 / 256 cells'}
            </text>

            {/* Original 128 cells grid (16x8) */}
            {Array.from({ length: ROWS }).map((_, r) =>
              Array.from({ length: COLS }).map((_, c) => {
                const idx = r * COLS + c;
                const x = 30 + c * 15;
                const y = 30 + r * 18;
                const isSampled = sampled.has(idx);
                return (
                  <motion.rect key={`o-${idx}`} x={x} y={y} width={12} height={14} rx={2}
                    fill={step === 0 ? `${C[0]}25` : isSampled ? `${C[2]}60` : `${C[0]}20`}
                    stroke={isSampled ? C[2] : C[0]}
                    strokeWidth={isSampled ? 1.5 : 0.5}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: step === 0 ? idx * 0.002 : 0 }} />
                );
              })
            )}

            {/* Labels */}
            <text x={160} y={185} textAnchor="middle" fontSize={10}
              fill={C[0]}>원본 128 cells</text>

            {/* Extended cells (right half) */}
            {isExtended && Array.from({ length: ROWS }).map((_, r) =>
              Array.from({ length: COLS }).map((_, c) => {
                const idx = COLS * ROWS + r * COLS + c;
                const x = 280 + c * 15;
                const y = 30 + r * 18;
                const isSampled = sampled.has(idx);
                return (
                  <motion.rect key={`e-${idx}`} x={x} y={y} width={12} height={14} rx={2}
                    fill={isSampled ? `${C[2]}60` : `${C[1]}20`}
                    stroke={isSampled ? C[2] : C[1]}
                    strokeWidth={isSampled ? 1.5 : 0.5}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (r * COLS + c) * 0.003 }} />
                );
              })
            )}
            {isExtended && (
              <text x={400} y={185} textAnchor="middle" fontSize={10}
                fill={C[1]}>RS 확장 +128 cells</text>
            )}

            {/* Sampling stats */}
            {step === 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={170} y={192} width={180} height={16} rx={3}
                  fill={`${C[2]}15`} stroke={C[2]} strokeWidth={1} />
                <text x={260} y={203} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={C[2]}>75개 샘플 → 복원 실패 확률 ≈ 0</text>
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
