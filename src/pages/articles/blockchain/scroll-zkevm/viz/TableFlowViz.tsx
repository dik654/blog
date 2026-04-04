import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const P = '#6366f1', S = '#10b981', A = '#f59e0b';

const TABLES = [
  { label: 'TxTable', color: P, x: 30, y: 15 },
  { label: 'BytecodeTable', color: P, x: 130, y: 15 },
  { label: 'EVM Circuit', color: P, x: 180, y: 75 },
  { label: 'RwTable', color: S, x: 310, y: 75 },
  { label: 'KeccakTable', color: S, x: 30, y: 135 },
  { label: 'CopyTable', color: A, x: 130, y: 135 },
  { label: 'State Circuit', color: P, x: 310, y: 135 },
  { label: 'MptTable', color: S, x: 310, y: 185 },
];

const EDGES = [
  { s: 0, t: 2 }, { s: 1, t: 2 }, { s: 2, t: 3 },
  { s: 4, t: 2 }, { s: 5, t: 2 }, { s: 3, t: 6 }, { s: 6, t: 7 },
];

const STEPS = [
  { label: '테이블 시스템 전체', body: '테이블을 통해 여러 회로가 데이터를 공유하고 일관성을 검증합니다.' },
  { label: '입력: TxTable -> EVM', body: '트랜잭션 메타데이터(nonce, gas, value)를 EVM Circuit에 제공합니다.' },
  { label: '코드: BytecodeTable -> EVM', body: '바이트코드의 각 바이트를 인덱스와 매핑하여 정확성을 보장합니다.' },
  { label: '상태: EVM -> RwTable -> State', body: 'EVM의 모든 r/w 연산이 RwTable을 거쳐 State Circuit에서 검증됩니다.' },
  { label: '해시/복사/증명', body: 'Keccak, Copy, MPT 테이블이 해시, 복사, 상태 트리를 각각 검증합니다.' },
];

const ACTIVE: number[][] = [
  [0,1,2,3,4,5,6,7], [0,2], [1,2], [2,3,6], [4,5,6,7],
];

const mid = (i: number) => ({ x: TABLES[i].x + 35, y: TABLES[i].y + 12 });

export default function TableFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const s = mid(e.s), t = mid(e.t);
            const on = ACTIVE[step].includes(e.s) && ACTIVE[step].includes(e.t);
            return (
              <motion.line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="4 2"
                animate={{ opacity: on ? 0.5 : 0.08 }} transition={{ duration: 0.3 }} />
            );
          })}
          {TABLES.map((t, i) => {
            const on = ACTIVE[step].includes(i);
            return (
              <motion.g key={t.label} animate={{ opacity: on ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
                <rect x={t.x} y={t.y} width={70} height={24} rx={5}
                  fill={on ? t.color + '12' : '#fff0'} stroke={t.color} strokeWidth={on ? 1.5 : 1} />
                <text x={t.x + 35} y={t.y + 15} textAnchor="middle" fontSize={9}
                  fontWeight={500} fill={t.color}>{t.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
