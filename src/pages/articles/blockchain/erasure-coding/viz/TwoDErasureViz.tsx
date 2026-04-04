import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const STEPS = [
  { label: '데이터를 2D 매트릭스 배치', body: '원본 k x k 데이터를 정사각 매트릭스로 배치합니다.' },
  { label: '행/열별 RS 인코딩 확장', body: '각 행과 열에 RS 코딩을 적용하여 2k x 2k로 확장합니다.' },
  { label: 'DAS: 랜덤 셀 샘플링', body: '라이트 노드가 랜덤 셀을 샘플링하여 가용성을 검증합니다.' },
  { label: '손실 시 행/열 복구', body: '행 또는 열 단위로 독립 복구가 가능해 효율적입니다.' },
];
const GS = 22, PAD = 30;

export default function TwoDErasureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {Array.from({ length: step >= 1 ? 8 : 4 }).map((_, r) =>
            Array.from({ length: step >= 1 ? 8 : 4 }).map((_, c) => {
              const x = PAD + c * (GS + 2), y = 20 + r * (GS + 2);
              const isOrig = r < 4 && c < 4;
              const isParity = !isOrig;
              const sampled = step === 2 && ((r + c) % 3 === 0);
              const lost = step === 3 && (r === 1 && c === 2);
              const color = lost ? '#ef4444' : sampled ? C[2] : isParity ? C[1] : C[0];
              return (
                <motion.rect key={`${r}-${c}`} x={x} y={y} width={GS} height={GS} rx={3}
                  fill={sampled ? `${C[2]}30` : lost ? '#ef444415' : `${color}12`}
                  stroke={color} strokeWidth={sampled ? 1.5 : lost ? 1.5 : 0.8}
                  strokeDasharray={lost ? '2 2' : 'none'}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: (r + c) * 0.02 }} />
              );
            })
          )}
          {/* labels */}
          <text x={PAD + 2 * (GS + 2)} y={14} textAnchor="middle"
            fontSize={9} fill={C[0]} fontWeight={600}>원본 k x k</text>
          {step >= 1 && (
            <motion.text x={PAD + 6 * (GS + 2)} y={14} textAnchor="middle"
              fontSize={9} fill={C[1]} fontWeight={600}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              패리티 확장
            </motion.text>
          )}
          {step === 2 && (
            <motion.text x={240} y={150} textAnchor="middle" fontSize={9}
              fill={C[2]} fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              DAS: 강조된 셀 = 랜덤 샘플
            </motion.text>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={PAD} y1={20 + 1 * (GS + 2) + GS / 2}
                x2={PAD + 8 * (GS + 2)} y2={20 + 1 * (GS + 2) + GS / 2}
                stroke="#ef4444" strokeWidth={1} strokeDasharray="4 2" />
              <text x={240} y={150} textAnchor="middle" fontSize={9}
                fill="#ef4444" fontWeight={600}>행 단위 복구 가능</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
