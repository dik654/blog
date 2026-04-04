import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: '명령어 페치', sub: 'PC → instruction', color: '#6366f1' },
  { label: '디코딩', sub: 'opcode, op_a/b/c', color: '#10b981' },
  { label: '피연산자 읽기', sub: '레지스터/즉시값', color: '#f59e0b' },
  { label: '연산 수행', sub: 'ALU/MEM/분기', color: '#ef4444' },
  { label: '결과 저장', sub: 'rd 레지스터 갱신', color: '#8b5cf6' },
  { label: 'PC 업데이트', sub: 'PC += 4 또는 분기', color: '#ec4899' },
];

const NW = 78, GAP = 82, SY = 40;
const nx = (i: number) => 4 + i * GAP;
const EDGES = ['Instruction', 'op_b, op_c', '피연산자 값', '결과', '완료'];

const STEPS = [
  { label: '명령어 페치', body: 'PC 주소에서 Instruction을 가져옵니다.' },
  { label: '디코딩', body: 'opcode, 목적지(op_a), 소스(op_b, op_c), 즉시값 플래그를 추출합니다.' },
  { label: '피연산자 읽기', body: 'imm_b/imm_c 플래그에 따라 레지스터 또는 즉시값을 읽습니다.' },
  { label: '연산 수행', body: 'opcode에 따라 ALU, 메모리(LW/SW), 분기(BEQ/JAL) 연산을 수행합니다.' },
  { label: '결과 저장', body: '연산 결과를 op_a(목적지) 레지스터에 기록합니다.' },
  { label: 'PC 업데이트', body: 'PC += 4 (순차) 또는 분기 주소로 점프합니다.' },
];

export default function ExecutionCycleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 640 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ec-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => step > i && (
            <motion.g key={`e${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              <line x1={nx(i) + NW} y1={SY + 19} x2={nx(i + 1)} y2={SY + 19}
                stroke="var(--muted-foreground)" strokeWidth={1.2} markerEnd="url(#ec-ah)" />
              <rect x={(nx(i) + NW + nx(i + 1)) / 2 - 20} y={SY + 6} width={40} height={11} rx={2} fill="var(--card)" />
              <text x={(nx(i) + NW + nx(i + 1)) / 2} y={SY + 13}
                textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{lbl}</text>
            </motion.g>
          ))}
          {NODES.map((n, i) => i <= step && (
            <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}>
              <rect x={nx(i)} y={SY} width={NW} height={38} rx={7}
                fill={n.color + '18'} stroke={n.color} strokeWidth={step === i ? 2 : 1} />
              <text x={nx(i) + NW / 2} y={SY + 15} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
              <text x={nx(i) + NW / 2} y={SY + 28} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">{n.sub}</text>
            </motion.g>
          ))}
          {/* Cycle-back arrow from PC update to fetch */}
          {step === 5 && (
            <motion.path
              d={`M ${nx(5) + NW / 2} ${SY + 38} Q ${nx(5) + NW / 2} ${SY + 60} ${nx(0) + NW / 2} ${SY + 60} L ${nx(0) + NW / 2} ${SY + 38}`}
              fill="none" stroke="#ec4899" strokeWidth={1.2} strokeDasharray="4 2"
              markerEnd="url(#ec-ah)" opacity={0.5}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
