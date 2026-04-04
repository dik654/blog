import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const P = '#6366f1', S = '#10b981', A = '#f59e0b';

const NODES = [
  { id: 'host', label: 'Host', color: P, x: 40, y: 25 },
  { id: 'guest', label: 'Guest', color: P, x: 130, y: 25 },
  { id: 'r0vm', label: 'r0vm', color: S, x: 85, y: 80 },
  { id: 'rv32', label: 'RV32IM', color: S, x: 30, y: 130 },
  { id: 'keccak', label: 'Keccak', color: S, x: 140, y: 130 },
  { id: 'zkp', label: 'risc0-zkp', color: A, x: 85, y: 180 },
  { id: 'recursion', label: '재귀 회로', color: A, x: 220, y: 180 },
  { id: 'groth16', label: 'Groth16', color: P, x: 300, y: 130 },
  { id: 'verifier', label: 'Solidity 검증', color: P, x: 340, y: 70 },
];

const EDGES = [
  { s: 'host', t: 'guest' }, { s: 'guest', t: 'r0vm' }, { s: 'r0vm', t: 'rv32' },
  { s: 'r0vm', t: 'keccak' }, { s: 'rv32', t: 'zkp' }, { s: 'keccak', t: 'zkp' },
  { s: 'zkp', t: 'recursion' }, { s: 'recursion', t: 'groth16' }, { s: 'groth16', t: 'verifier' },
];

const ACTIVE: string[][] = [
  ['host', 'guest', 'r0vm', 'rv32', 'keccak', 'recursion', 'zkp', 'groth16', 'verifier'],
  ['host', 'guest'], ['r0vm', 'rv32', 'keccak'],
  ['zkp', 'recursion'], ['groth16', 'verifier'],
];

const STEPS = [
  { label: '전체 아키텍처', body: 'RISC Zero zkVM의 계층적 구조 전체 그래프' },
  { label: 'Host/Guest', body: 'Host가 입력을 제공하고 Guest가 zkVM 내부에서 계산합니다' },
  { label: '실행 계층', body: 'r0vm이 RISC-V를 실행하고 RV32IM/Keccak 회로가 추적합니다' },
  { label: '증명 계층', body: 'zk-STARK가 증명하고 재귀 회로가 압축합니다' },
  { label: '검증 계층', body: 'Groth16 SNARK으로 래핑 후 이더리움에서 검증합니다' },
];

function find(id: string) { return NODES.find(n => n.id === id)!; }

export default function SegmentRecursionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const active = ACTIVE[step];
        return (
          <svg viewBox="0 0 540 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <defs>
              <marker id="r0-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.4} />
              </marker>
            </defs>
            {EDGES.map((e, i) => {
              const s = find(e.s), t = find(e.t);
              const on = active.includes(e.s) && active.includes(e.t);
              return (
                <motion.line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={1}
                  markerEnd="url(#r0-ah)" animate={{ opacity: on ? 0.5 : 0.1 }}
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
