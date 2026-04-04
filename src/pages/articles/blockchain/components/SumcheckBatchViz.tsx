import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STAGES = [
  { label: 'S1', name: 'Spartan', color: '#6366f1', n: 1 },
  { label: 'S2', name: 'RAM R/W', color: '#10b981', n: 2 },
  { label: 'S3', name: 'Instruction', color: '#f59e0b', n: 2 },
  { label: 'S4', name: 'Product', color: '#ef4444', n: 3 },
  { label: 'S5', name: 'Opening', color: '#8b5cf6', n: 1 },
];

const BW = 74, BH = 42, GAP = 12, OY = 30;
const bx = (i: number) => 10 + i * (BW + GAP);

const STEPS = [
  { label: 'Stage 1: Spartan R1CS Sumcheck', body: 'OuterUniSkipProver로 첫 라운드를 가속하여 R1CS 외부 Sumcheck를 실행합니다.' },
  { label: 'Stage 2: RAM 읽기/쓰기 검사', body: 'RAM ReadWrite Checking + ProductVirtualRemainder 2개 인스턴스를 배치 처리합니다.' },
  { label: 'Stage 3: Instruction 룩업 + 평가', body: 'InstructionLookupsCR과 RamRafEvaluation을 동시에 배치 Sumcheck합니다.' },
  { label: 'Stage 4: Product + Output 검증', body: '3개 인스턴스를 α 계수로 결합. g(X) = Σᵢ αᵢ·gᵢ(X)로 배치합니다.' },
  { label: 'Stage 5: Dory 공동 개구 증명', body: '모든 평가 클레임을 ProverOpeningAccumulator로 수집 → joint_opening_proof 생성.' },
];

export default function SumcheckBatchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 450 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sc-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {STAGES.map((s, i) => (
            <motion.g key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: i <= step ? 1 : 0.15, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}>
              <rect x={bx(i)} y={OY} width={BW} height={BH} rx={7}
                fill={s.color + '18'} stroke={s.color}
                strokeWidth={i === step ? 2.5 : 1} />
              <text x={bx(i) + BW / 2} y={OY + 16} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={s.color}>{s.label}</text>
              <text x={bx(i) + BW / 2} y={OY + 30} textAnchor="middle"
                fontSize={6.5} fill="var(--muted-foreground)">{s.name}</text>
              {/* Instance dots */}
              {i <= step && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {Array.from({ length: s.n }, (_, j) => (
                    <circle key={j}
                      cx={bx(i) + BW / 2 + (j - (s.n - 1) / 2) * 12}
                      cy={OY + BH + 12}
                      r={4} fill={s.color + '40'} stroke={s.color} strokeWidth={1} />
                  ))}
                  <text x={bx(i) + BW / 2} y={OY + BH + 26} textAnchor="middle"
                    fontSize={9} fill={s.color}>{s.n}개</text>
                </motion.g>
              )}
            </motion.g>
          ))}
          {/* Arrows */}
          {[0, 1, 2, 3].map(i => step > i && (
            <motion.line key={`e${i}`}
              x1={bx(i) + BW} y1={OY + BH / 2}
              x2={bx(i + 1)} y2={OY + BH / 2}
              stroke="var(--muted-foreground)" strokeWidth={1}
              markerEnd="url(#sc-a)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
          ))}
          {/* Batch indicator */}
          {step >= 3 && (
            <motion.text x={225} y={OY + BH + 40} textAnchor="middle"
              fontSize={9} fill="#ef4444" fontWeight={600}
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              g(X) = Σᵢ αᵢ · gᵢ(X)
            </motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
