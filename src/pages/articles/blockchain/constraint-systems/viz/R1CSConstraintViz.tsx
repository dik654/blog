import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const M = [
  { label: 'A', data: [[0,1,0,0,0],[0,0,0,1,0]], color: '#6366f1' },
  { label: 'B', data: [[0,1,0,0,0],[0,1,0,0,0]], color: '#10b981' },
  { label: 'C', data: [[0,0,0,1,0],[0,0,0,0,1]], color: '#f59e0b' },
];
const SL = ['1','y=35','x=3','t₁=9','t₂=27'];

const STEPS = [
  { label: 'R1CS 행렬 A, B, C 정의', body: '각 곱셈 게이트를 행렬 행으로 표현합니다. (A·s)⊙(B·s)=C·s.' },
  { label: 'Witness 벡터 s 할당', body: 's = [1, 35, 3, 9, 27]. 공개/비공개 값을 포함한 전체 벡터.' },
  { label: 'A·s 내적 계산', body: 'A의 각 행과 s를 내적합니다. 결과: [3, 9].' },
  { label: 'B·s 내적 계산', body: 'B의 각 행과 s를 내적합니다. 결과: [3, 3].' },
  { label: '(A·s)⊙(B·s) = C·s 검증', body: '[3×3, 9×3] = [9, 27]. C·s = [9, 27]. 일치하면 제약 만족.' },
];

const CX = 52, CW = 18, GAP = 4;
const mX = (mi: number) => CX + mi * (5 * (CW + GAP) + 20);

export default function R1CSConstraintViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 510 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* witness vector */}
          <text x={4} y={10} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">s =</text>
          {SL.map((v, i) => (
            <motion.g key={i} animate={{ opacity: step >= 1 ? 1 : 0.2 }} transition={sp}>
              <rect x={20 + i * 24} y={3} width={22} height={12} rx={2}
                fill={step >= 1 ? '#8b5cf618' : '#8b5cf606'} stroke="#8b5cf6" strokeWidth={step >= 1 ? 1 : 0.4} />
              <text x={31 + i * 24} y={11.5} textAnchor="middle" fontSize={9} fill="#8b5cf6">{v}</text>
            </motion.g>
          ))}
          {/* matrices */}
          {M.map((m, mi) => (
            <g key={m.label}>
              <text x={mX(mi) - 8} y={42} fontSize={9} fontWeight={600} fill={m.color}>{m.label}</text>
              {m.data.map((row, ri) =>
                row.map((cell, ci) => {
                  const hi = (step === 2 && mi === 0) || (step === 3 && mi === 1) || (step === 4 && mi === 2);
                  const active = hi && cell === 1;
                  return (
                    <motion.g key={`${ri}-${ci}`} animate={{ opacity: step >= 0 ? 1 : 0.15 }} transition={sp}>
                      <motion.rect x={mX(mi) + ci * (CW + GAP)} y={28 + ri * 20} width={CW} height={16} rx={2}
                        animate={{ fill: active ? `${m.color}30` : `${m.color}08`,
                          stroke: m.color, strokeWidth: active ? 1.5 : 0.4 }} transition={sp} />
                      <text x={mX(mi) + ci * (CW + GAP) + CW / 2} y={39 + ri * 20}
                        textAnchor="middle" fontSize={9} fill={m.color}>{cell}</text>
                    </motion.g>
                  );
                })
              )}
            </g>
          ))}
          {/* result row */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={CX} y={82} fontSize={9} fill="#ec4899" fontWeight={600}>
                [3×3, 9×3] = [9, 27] = C·s  ✓ 제약 만족
              </text>
            </motion.g>
          )}
          {/* operator symbols */}
          {step >= 0 && (
            <>
              <text x={mX(0) + 5 * (CW + GAP) + 2} y={42} fontSize={9} fill="var(--muted-foreground)">⊙</text>
              <text x={mX(1) + 5 * (CW + GAP) + 2} y={42} fontSize={9} fill="var(--muted-foreground)">=</text>
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
