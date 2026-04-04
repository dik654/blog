import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const P = '#6366f1', S = '#10b981', A = '#f59e0b';

const NODES = [
  { id: 'rv', label: 'RISC-V', color: P, x: 40, y: 30 },
  { id: 'trace', label: '실행 트레이스', color: P, x: 160, y: 30 },
  { id: 'lasso', label: 'Lasso 룩업', color: S, x: 60, y: 100 },
  { id: 'ram', label: 'RAM 검사', color: S, x: 170, y: 100 },
  { id: 'r1cs', label: 'Spartan R1CS', color: S, x: 280, y: 100 },
  { id: 'batch', label: 'BatchedSumcheck', color: A, x: 170, y: 170 },
  { id: 'dory', label: 'Dory PCS', color: A, x: 280, y: 170 },
  { id: 'proof', label: 'JoltProof', color: P, x: 340, y: 100 },
];

const EDGES = [
  { s: 'rv', t: 'trace' }, { s: 'trace', t: 'lasso' }, { s: 'trace', t: 'ram' },
  { s: 'trace', t: 'r1cs' }, { s: 'lasso', t: 'batch' }, { s: 'ram', t: 'batch' },
  { s: 'r1cs', t: 'batch' }, { s: 'batch', t: 'dory' }, { s: 'dory', t: 'proof' },
];

const ACTIVE: string[][] = [
  ['rv', 'trace', 'lasso', 'ram', 'r1cs', 'batch', 'dory', 'proof'],
  ['rv', 'trace'], ['trace', 'lasso', 'ram', 'r1cs'],
  ['lasso', 'ram', 'r1cs', 'batch'], ['batch', 'dory', 'proof'],
];

const STEPS = [
  { label: 'Jolt zkVM 전체 파이프라인', body: 'RISC-V 실행 트레이스를 Sumcheck + Dory로 증명합니다.' },
  { label: '실행 트레이스 생성', body: 'RISC-V 프로그램을 에뮬레이션하여 명령어별 상태를 기록합니다.' },
  { label: 'Lasso + RAM + R1CS 분해', body: '트레이스를 룩업/메모리/제약 세 갈래로 분해합니다.' },
  { label: 'BatchedSumcheck 통합', body: '8단계의 독립 Sumcheck를 배치 계수로 단일 증명에 병합합니다.' },
  { label: 'Dory PCS & 최종 증명', body: '다변량 다항식 평가를 Dory로 검증하고 JoltProof를 출력합니다.' },
];

function find(id: string) { return NODES.find(n => n.id === id)!; }

export default function JoltZkVMViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const active = ACTIVE[step];
        return (
          <svg viewBox="0 0 540 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <defs>
              <marker id="jolt-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.4} />
              </marker>
            </defs>
            {EDGES.map((e, i) => {
              const s = find(e.s), t = find(e.t);
              const on = active.includes(e.s) && active.includes(e.t);
              return (
                <motion.line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={1}
                  markerEnd="url(#jolt-ah)" animate={{ opacity: on ? 0.5 : 0.1 }}
                  transition={{ duration: 0.3 }} />
              );
            })}
            {NODES.map(n => {
              const on = active.includes(n.id);
              return (
                <motion.g key={n.id} animate={{ opacity: on ? 1 : 0.2 }} transition={{ duration: 0.3 }}>
                  <circle cx={n.x} cy={n.y} r={20} fill={on ? n.color + '12' : '#ffffff08'}
                    stroke={n.color} strokeWidth={on ? 1.5 : 1} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={9} fontWeight={500}
                    fill={n.color}>{n.label}</text>
                </motion.g>
              );
            })}
        </svg>
        );
      }}
    </StepViz>
  );
}
