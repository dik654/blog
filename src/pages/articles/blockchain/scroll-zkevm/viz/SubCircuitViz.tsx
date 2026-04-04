import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const P = '#6366f1', S = '#10b981', A = '#f59e0b';

const NODES = [
  { id: 'evm', label: 'EVM Circuit', color: P, x: 160, y: 30 },
  { id: 'bytecode', label: 'Bytecode', color: P, x: 40, y: 80 },
  { id: 'keccak', label: 'Keccak', color: S, x: 120, y: 130 },
  { id: 'mpt', label: 'MPT', color: S, x: 200, y: 130 },
  { id: 'copy', label: 'Copy', color: A, x: 280, y: 80 },
  { id: 'sig', label: 'Sig', color: A, x: 320, y: 130 },
  { id: 'rw', label: 'RwTable', color: P, x: 100, y: 180 },
  { id: 'tx', label: 'TxTable', color: P, x: 250, y: 180 },
];

const EDGES = [
  { s: 'evm', t: 'rw' }, { s: 'evm', t: 'bytecode' }, { s: 'evm', t: 'keccak' },
  { s: 'evm', t: 'copy' }, { s: 'mpt', t: 'keccak' }, { s: 'sig', t: 'tx' },
  { s: 'tx', t: 'evm' }, { s: 'mpt', t: 'rw' },
];

const ACTIVE: string[][] = [
  ['evm', 'bytecode', 'keccak', 'mpt', 'copy', 'sig', 'rw', 'tx'],
  ['evm', 'rw', 'bytecode'], ['keccak', 'mpt', 'rw'],
  ['copy', 'sig', 'tx', 'evm'], ['rw', 'tx', 'evm', 'mpt', 'sig'],
];

const STEPS = [
  { label: 'Scroll zkEVM 서브회로 구조', body: 'EVM Circuit을 중심으로 6개 서브회로가 공유 테이블로 연결됩니다.' },
  { label: 'EVM Circuit — 실행 엔진', body: '오퍼코드별 ExecutionGadget이 RwTable과 BytecodeTable을 조회합니다.' },
  { label: 'Keccak & MPT — 상태 검증', body: 'Keccak 해시와 Merkle Patricia Trie로 스토리지 무결성을 증명합니다.' },
  { label: 'Copy & Sig — 보조 회로', body: '메모리 복사 추적과 ECDSA 서명 검증을 별도 회로로 분리합니다.' },
  { label: 'RwTable & TxTable — 공유 테이블', body: '모든 서브회로가 공유 테이블로 일관성을 유지합니다.' },
];

function find(id: string) { return NODES.find(n => n.id === id)!; }

export default function SubCircuitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const active = ACTIVE[step];
        return (
          <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <defs>
              <marker id="sc-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.4} />
              </marker>
            </defs>
            {EDGES.map((e, i) => {
              const s = find(e.s), t = find(e.t);
              const on = active.includes(e.s) && active.includes(e.t);
              return (
                <motion.line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={1}
                  markerEnd="url(#sc-ah)" animate={{ opacity: on ? 0.5 : 0.1 }}
                  transition={{ duration: 0.3 }} />
              );
            })}
            {NODES.map(n => {
              const on = active.includes(n.id);
              return (
                <motion.g key={n.id} animate={{ opacity: on ? 1 : 0.2 }} transition={{ duration: 0.3 }}>
                  <circle cx={n.x} cy={n.y} r={18} fill={on ? n.color + '12' : '#ffffff08'}
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
