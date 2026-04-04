import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const CL = '#6366f1', CB = '#10b981', CR = '#ef4444';

const STEPS = [
  { label: '쓰기 성능: LSM 승', body: 'LSM: 순차 쓰기로 변환 → 높은 쓰기 처리량. B+tree: 페이지 분할, Copy-on-Write 필요 → 쓰기마다 여러 페이지 갱신.' },
  { label: '읽기 성능: B+tree 승', body: 'B+tree: O(log n) 한 번에 찾음 (3~4 depth). LSM: Memtable → L0 → L1 → L2 여러 레벨 순회 필요.' },
  { label: '공간 효율: B+tree 승', body: 'LSM: compaction 중 임시 공간 2배 필요 + 삭제된 데이터가 tombstone으로 남음. B+tree: 고정 공간, 즉시 삭제.' },
  { label: '지연 예측성: B+tree 승', body: 'LSM: compaction 스파이크로 p99 지연 불안정. B+tree: compaction 없음, O(log n) 항상 보장.' },
  { label: '블록체인 노드: 읽기 >> 쓰기', body: 'EVM 실행 시 SLOAD(상태 읽기)가 병목. 읽기 지연 예측성이 핵심 → Reth/Erigon이 MDBX(B+tree) 선택한 이유.' },
];

const axes = [
  { name: '쓰기 처리량', lsm: 95, bt: 50 },
  { name: '읽기 지연', lsm: 40, bt: 90 },
  { name: '공간 효율', lsm: 50, bt: 85 },
  { name: '지연 예측성', lsm: 30, bt: 95 },
  { name: '블록체인 적합', lsm: 35, bt: 90 },
];

export default function LsmVsBtreeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Bar chart comparison */}
          {axes.map((ax, i) => {
            const y = 30 + i * 38;
            const active = step === i;
            return (
              <motion.g key={i} animate={{ opacity: active ? 1 : 0.35 }}>
                {/* Label */}
                <text x={110} y={y + 14} textAnchor="end" fontSize={10} fontWeight={active ? 600 : 400}
                  fill="var(--foreground)">{ax.name}</text>

                {/* LSM bar */}
                <motion.rect x={120} y={y} width={0} height={14} rx={3}
                  fill={`${CL}30`} stroke={CL} strokeWidth={active ? 1 : 0.5}
                  animate={{ width: ax.lsm * 3.5 }} transition={{ duration: 0.6 }} />
                <motion.text x={0} y={y + 11} fontSize={9} fontWeight={500} fill={CL}
                  animate={{ x: 125 + ax.lsm * 3.5 }} transition={{ duration: 0.6 }}>
                  {ax.lsm}%
                </motion.text>

                {/* B+tree bar */}
                <motion.rect x={120} y={y + 17} width={0} height={14} rx={3}
                  fill={`${CB}30`} stroke={CB} strokeWidth={active ? 1 : 0.5}
                  animate={{ width: ax.bt * 3.5 }} transition={{ duration: 0.6, delay: 0.1 }} />
                <motion.text x={0} y={y + 28} fontSize={9} fontWeight={500} fill={CB}
                  animate={{ x: 125 + ax.bt * 3.5 }} transition={{ duration: 0.6, delay: 0.1 }}>
                  {ax.bt}%
                </motion.text>

                {/* Winner badge */}
                {active && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <rect x={470} y={y + 4} width={35} height={18} rx={4}
                      fill={ax.lsm > ax.bt ? `${CL}20` : `${CB}20`}
                      stroke={ax.lsm > ax.bt ? CL : CB} strokeWidth={0.8} />
                    <text x={487} y={y + 17} textAnchor="middle" fontSize={8} fontWeight={600}
                      fill={ax.lsm > ax.bt ? CL : CB}>{ax.lsm > ax.bt ? 'LSM' : 'B+tree'}</text>
                  </motion.g>
                )}
              </motion.g>
            );
          })}

          {/* Legend */}
          <rect x={140} y={218} width={10} height={10} rx={2} fill={`${CL}30`} stroke={CL} strokeWidth={0.5} />
          <text x={155} y={227} fontSize={10} fill={CL}>LSM-tree</text>
          <rect x={230} y={218} width={10} height={10} rx={2} fill={`${CB}30`} stroke={CB} strokeWidth={0.5} />
          <text x={245} y={227} fontSize={10} fill={CB}>B+tree</text>
        </svg>
      )}
    </StepViz>
  );
}
