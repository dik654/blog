import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const P = '#6366f1', S = '#10b981', A = '#f59e0b';

const NODES = [
  { id: 'sdk', label: 'SP1 SDK', color: P, x: 40, y: 30 },
  { id: 'cli', label: 'CLI/Build', color: P, x: 140, y: 30 },
  { id: 'executor', label: 'Executor', color: S, x: 60, y: 95 },
  { id: 'machine', label: 'Core Machine', color: S, x: 180, y: 95 },
  { id: 'prover', label: 'SP1 Prover', color: A, x: 120, y: 160 },
  { id: 'recursion', label: 'Recursion', color: A, x: 240, y: 160 },
  { id: 'plonky3', label: 'Plonky3', color: A, x: 300, y: 95 },
  { id: 'groth16', label: 'Groth16/PLONK', color: P, x: 320, y: 160 },
  { id: 'verifier', label: 'SP1 Verifier', color: P, x: 360, y: 95 },
];

const EDGES = [
  { s: 'sdk', t: 'cli' }, { s: 'sdk', t: 'executor' }, { s: 'executor', t: 'machine' },
  { s: 'machine', t: 'prover' }, { s: 'prover', t: 'recursion' }, { s: 'recursion', t: 'plonky3' },
  { s: 'prover', t: 'groth16' }, { s: 'groth16', t: 'verifier' },
];

const ACTIVE: string[][] = [
  ['sdk', 'cli', 'executor', 'machine', 'prover', 'recursion', 'plonky3', 'groth16', 'verifier'],
  ['sdk', 'cli'], ['executor', 'machine'],
  ['prover', 'recursion', 'plonky3'], ['groth16', 'verifier'],
];

const STEPS = [
  { label: '전체 아키텍처', body: 'SP1 zkVM의 계층적 구조 전체 그래프' },
  { label: '사용자 레이어', body: 'SDK + CLI로 프로그램을 빌드하고 실행합니다' },
  { label: '실행 레이어', body: 'Executor가 RISC-V를 실행하고 Machine이 AIR로 변환합니다' },
  { label: '증명 레이어', body: 'Prover가 Plonky3 STARK 증명을 생성하고 재귀 압축합니다' },
  { label: '검증 레이어', body: 'Groth16으로 래핑 후 이더리움 온체인에서 검증합니다' },
];

function find(id: string) { return NODES.find(n => n.id === id)!; }

export default function ZkVMArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const active = ACTIVE[step];
        return (
          <svg viewBox="0 0 550 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <defs>
              <marker id="sp1-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.4} />
              </marker>
            </defs>
            {EDGES.map((e, i) => {
              const s = find(e.s), t = find(e.t);
              const on = active.includes(e.s) && active.includes(e.t);
              return (
                <motion.line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={1}
                  markerEnd="url(#sp1-ah)" animate={{ opacity: on ? 0.5 : 0.1 }}
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
