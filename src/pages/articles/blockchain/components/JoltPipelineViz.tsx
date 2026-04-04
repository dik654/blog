import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: '실행 트레이스', sub: 'RISC-V → ExecStep', color: '#64748b' },
  { label: 'Lasso 룩업', sub: 'AND/XOR/Range MLE', color: '#3b82f6' },
  { label: 'Dory 커밋', sub: '다변량 PCS', color: '#8b5cf6' },
  { label: 'Spartan', sub: 'R1CS Sumcheck', color: '#6366f1' },
  { label: '배치 Sumcheck', sub: '5개 인스턴스', color: '#ec4899' },
  { label: '공동 개구', sub: 'joint_opening', color: '#10b981' },
];

const BW = 68, BH = 42, GAP = 6, OY = 20;
const bx = (i: number) => 4 + i * (BW + GAP);

const STEPS = [
  { label: '① 실행 트레이스: RISC-V 사이클별 기록', body: '각 사이클의 opcode, rs1, rs2, rd, imm, result를 기록합니다.' },
  { label: '② Lasso 룩업: 서브테이블 분해', body: 'AND(x,y) → 8비트 Prefix/Suffix 분해. 희소 MLE로 트레이스 사용 항목만 포함.' },
  { label: '③ Dory 커밋: 비신뢰 다변량 커밋', body: 'DoryLayout으로 행렬 형태 배열 후 다항식 커밋합니다.' },
  { label: '④ Spartan: UniSkip 최적화 Sumcheck', body: 'OuterUniSkipProver로 첫 라운드 가속. R1CS 외부 Sumcheck 실행.' },
  { label: '⑤ 배치 Sumcheck: 5개 동시 처리', body: 'RAM R/W, Instruction, Product, Output — α 계수 배치 결합.' },
  { label: '⑥ 공동 개구: Dory joint proof', body: 'ProverOpeningAccumulator → 단일 증명으로 모든 클레임 확인.' },
];

export default function JoltPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="jl-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {NODES.map((n, i) => (
            <motion.g key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: i <= step ? 1 : 0.15, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}>
              <rect x={bx(i)} y={OY} width={BW} height={BH} rx={7}
                fill={n.color + '18'} stroke={n.color}
                strokeWidth={i === step ? 2.5 : 1} />
              <text x={bx(i) + BW / 2} y={OY + 16} textAnchor="middle"
                fontSize={7.5} fontWeight={600} fill={n.color}>{n.label}</text>
              <text x={bx(i) + BW / 2} y={OY + 30} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">{n.sub}</text>
            </motion.g>
          ))}
          {/* Arrows */}
          {Array.from({ length: 5 }, (_, i) => step > i && (
            <motion.line key={`e${i}`}
              x1={bx(i) + BW} y1={OY + BH / 2}
              x2={bx(i + 1)} y2={OY + BH / 2}
              stroke="var(--muted-foreground)" strokeWidth={1}
              markerEnd="url(#jl-a)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
          ))}
          {/* Step number indicators */}
          {NODES.map((n, i) => i <= step && (
            <motion.g key={`num${i}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
              <circle cx={bx(i) + BW / 2} cy={OY + BH + 14} r={8}
                fill={n.color + '20'} stroke={n.color} strokeWidth={1} />
              <text x={bx(i) + BW / 2} y={OY + BH + 17} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={n.color}>{i + 1}</text>
            </motion.g>
          ))}
          {/* Final proof badge */}
          {step === 5 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <rect x={bx(5) + 4} y={OY + BH + 28} width={BW - 8} height={16} rx={8}
                fill={NODES[5].color + '25'} stroke={NODES[5].color} strokeWidth={1} />
              <text x={bx(5) + BW / 2} y={OY + BH + 39} textAnchor="middle"
                fontSize={6.5} fontWeight={600} fill={NODES[5].color}>JoltProof ✓</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
