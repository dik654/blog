import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b', C4 = '#ec4899';

const STEPS = [
  { label: 'World State Trie', body: '전체 이더리움 계정 상태. address → Account. 블록 헤더의 stateRoot가 루트 해시.' },
  { label: 'Account Storage Trie', body: '스마트 컨트랙트별 독립 트라이. slot → value. Account의 storageRoot가 루트 해시.' },
  { label: 'Transaction Trie', body: '블록 내 트랜잭션 목록. tx index → tx 데이터. 블록 헤더의 transactionsRoot.' },
  { label: 'Receipt Trie', body: '블록 내 실행 영수증. tx index → receipt(로그, 가스 사용량). 블록 헤더의 receiptsRoot.' },
];

const tries = [
  { label: 'World State', key: 'address', val: 'Account', root: 'stateRoot', c: C1 },
  { label: 'Account Storage', key: 'slot', val: 'value', root: 'storageRoot', c: C2 },
  { label: 'Transaction', key: 'tx index', val: 'tx data', root: 'txRoot', c: C3 },
  { label: 'Receipt', key: 'tx index', val: 'receipt', root: 'receiptsRoot', c: C4 },
];

export default function FourTriesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Block Header */}
          <rect x={150} y={10} width={140} height={24} rx={5} fill={`${C1}08`} stroke={C1} strokeWidth={0.6} />
          <text x={220} y={26} textAnchor="middle" fontSize={9} fontWeight={500} fill={C1}>Block Header</text>
          {/* Four tries */}
          {tries.map((t, i) => {
            const x = 20 + i * 108;
            const active = step === i;
            return (
              <motion.g key={i} animate={{ opacity: active ? 1 : 0.3 }}
                transition={{ type: 'spring', bounce: 0.2 }}>
                {/* Arrow from header */}
                <line x1={220} y1={34} x2={x + 44} y2={56} stroke="var(--border)" strokeWidth={0.5} />
                {/* Root label */}
                <rect x={x} y={56} width={88} height={20} rx={4} fill={`${t.c}10`} stroke={t.c}
                  strokeWidth={active ? 1 : 0.5} />
                <text x={x + 44} y={70} textAnchor="middle" fontSize={9} fontWeight={500} fill={t.c}>{t.root}</text>
                {/* Trie box */}
                <rect x={x} y={84} width={88} height={70} rx={5} fill="var(--card)" />
                <rect x={x} y={84} width={88} height={70} rx={5} fill={`${t.c}06`} stroke={t.c}
                  strokeWidth={active ? 1.2 : 0.5} />
                <text x={x + 44} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill={t.c}>{t.label}</text>
                <text x={x + 44} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  {t.key} → {t.val}
                </text>
                {/* Persistent / Ephemeral */}
                <text x={x + 44} y={145} textAnchor="middle" fontSize={9}
                  fill={i < 2 ? C2 : C3}>{i < 2 ? '영속적' : '블록별'}</text>
              </motion.g>
            );
          })}
          {/* Legend */}
          <text x={220} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            영속적 = 블록 간 갱신 · 블록별 = 해당 블록에서만 유효
          </text>
        </svg>
      )}
    </StepViz>
  );
}
