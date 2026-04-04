import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const CIRCUITS = [
  { label: 'EVM', color: '#3b82f6', tables: [0, 1, 2, 3] },
  { label: 'Bytecode', color: '#8b5cf6', tables: [3] },
  { label: 'Keccak', color: '#f97316', tables: [] },
  { label: 'MPT', color: '#10b981', tables: [3] },
  { label: 'Copy', color: '#f59e0b', tables: [4] },
  { label: 'Sig', color: '#ec4899', tables: [5] },
];

const TABLES = ['RwTable', 'BytecodeT', 'TxTable', 'KeccakT', 'CopyT', 'SigT'];
const TC = '#64748b';

const BW = 62, BH = 34, GAP = 8, OY = 10;
const bx = (i: number) => 12 + i * (BW + GAP);
const TY = 90, TW = 56, TGAP = 10;
const tx = (i: number) => 28 + i * (TW + TGAP);

const STEPS = [
  { label: '6개 서브회로: EVM, Bytecode, Keccak, MPT, Copy, Sig', body: '각 서브회로가 EVM 실행의 서로 다른 측면을 검증합니다.' },
  { label: '공유 룩업 테이블로 일관성 연결', body: 'RwTable, BytecodeTable, TxTable, KeccakTable 등이 서브회로 간 데이터 정합성을 보장합니다.' },
  { label: 'EVM Circuit: ~150종 ExecutionGadget', body: 'ADD, CALL, SLOAD, KECCAK 등 오퍼코드별 가젯. configure → assign 2단계.' },
  { label: '전체 연결: 서브회로 ↔ 테이블 참조', body: '모든 서브회로의 룩업이 공유 테이블을 통해 크로스 검증됩니다.' },
];

export default function ScrollCircuitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Sub-circuits */}
          {CIRCUITS.map((c, i) => (
            <motion.g key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: step >= 0 ? 1 : 0.15, y: 0 }}
              transition={{ delay: i * 0.04 }}>
              <rect x={bx(i)} y={OY} width={BW} height={BH} rx={6}
                fill={c.color + '18'} stroke={c.color}
                strokeWidth={step === 2 && i === 0 ? 2.5 : step === 0 ? 1.5 : 1} />
              <text x={bx(i) + BW / 2} y={OY + 14} textAnchor="middle"
                fontSize={7.5} fontWeight={600} fill={c.color}>{c.label}</text>
              <text x={bx(i) + BW / 2} y={OY + 27} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">Circuit</text>
            </motion.g>
          ))}
          {/* Shared tables */}
          {step >= 1 && TABLES.map((t, i) => (
            <motion.g key={t}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}>
              <rect x={tx(i)} y={TY} width={TW} height={22} rx={4}
                fill={TC + '15'} stroke={TC} strokeWidth={1} />
              <text x={tx(i) + TW / 2} y={TY + 14} textAnchor="middle"
                fontSize={6.5} fill={TC} fontWeight={600}>{t}</text>
            </motion.g>
          ))}
          {/* Connection lines */}
          {step >= 3 && CIRCUITS.map((c, ci) =>
            c.tables.map(ti => (
              <motion.line key={`${ci}-${ti}`}
                x1={bx(ci) + BW / 2} y1={OY + BH}
                x2={tx(ti) + TW / 2} y2={TY}
                stroke={c.color} strokeWidth={0.8} strokeDasharray="3 2" opacity={0.4}
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                transition={{ delay: (ci + ti) * 0.03 }} />
            ))
          )}
          {/* EVM highlight */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={bx(0) - 3} y={OY - 3} width={BW + 6} height={BH + 6} rx={8}
                fill="none" stroke={CIRCUITS[0].color} strokeWidth={1.5} strokeDasharray="4 2" />
              <text x={bx(0) + BW / 2} y={OY + BH + 14} textAnchor="middle"
                fontSize={6.5} fill={CIRCUITS[0].color}>~150종 Gadget</text>
            </motion.g>
          )}
          {/* Label */}
          <text x={220} y={TY + 35} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">
            {step >= 1 ? '공유 룩업 테이블' : ''}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
