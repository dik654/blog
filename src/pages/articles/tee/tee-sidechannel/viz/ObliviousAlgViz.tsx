import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_OBL = '#10b981';
const C_NORM = '#6366f1';
const C_USE = '#f59e0b';

const STEPS = [
  {
    label: 'Bitonic sort — 비교/교환 패턴이 입력과 무관',
    body: 'bitonic_sort(arr, n, up): n/2씩 재귀 정렬 후 merge.\nO(n log²n) comparisons. compare-and-swap 위치가 입력에 의존하지 않음.',
  },
  {
    label: 'Oblivious selection — linear scan + ct_select',
    body: 'max 찾기: 전체 스캔하며 ct_select(arr[i] > result, arr[i], result).\n어느 element가 max인지 access 패턴으로 노출되지 않는다.',
  },
  {
    label: 'Oblivious data structure — 메모리 접근 패턴 균일',
    body: 'ObliDS, PathOSM 등.\n모든 operation이 동일한 메모리 접근 시퀀스 → 입력과 무관.',
  },
  {
    label: '실전 사용 — PIR / Oblivious DB / PSI',
    body: 'Private Information Retrieval, Oblivious Database (Opaque), Private Set Intersection.\n암호화 + oblivious 알고리즘이 결합된 워크로드에서 활용.',
  },
];

export default function ObliviousAlgViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[3, 1, 4, 1, 5, 9, 2, 6].map((v, i) => {
                const x = 60 + i * 45;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}>
                    <rect x={x} y={20} width={36} height={36} rx={4}
                      fill={`${C_OBL}20`} stroke={C_OBL} />
                    <text x={x + 18} y={43} textAnchor="middle" fontSize={11} fontWeight={600} fill={C_OBL}>
                      {v}
                    </text>
                  </motion.g>
                );
              })}
              <text x={240} y={86} textAnchor="middle" fontSize={9} fill={C_OBL}>compare-and-swap pairs (입력 무관)</text>
              {[[60, 105], [150, 195], [240, 285], [330, 375]].map(([a, b], i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.2 }}>
                  <line x1={a + 18} y1={94} x2={b + 18} y2={94} stroke={C_OBL} strokeWidth={1.2} />
                  <circle cx={a + 18} cy={94} r={3} fill={C_OBL} />
                  <circle cx={b + 18} cy={94} r={3} fill={C_OBL} />
                </motion.g>
              ))}
              <ActionBox x={140} y={150} w={220} h={32} label="O(n log²n) comparisons" color={C_OBL} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={32} label="for i: result = ct_select(arr[i] > result, arr[i], result)" color={C_OBL} />
              {[3, 7, 2, 9, 5, 1, 8, 4].map((v, i) => {
                const x = 60 + i * 45;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <rect x={x} y={70} width={36} height={32} rx={4} fill={`${C_OBL}20`} stroke={C_OBL} />
                    <text x={x + 18} y={91} textAnchor="middle" fontSize={11} fontWeight={500} fill={C_OBL}>{v}</text>
                  </motion.g>
                );
              })}
              <text x={240} y={130} textAnchor="middle" fontSize={9} fill={C_OBL}>
                전체 스캔 → branch 없음 → max=9 (메모리 패턴 동일)
              </text>
              <DataBox x={140} y={158} w={200} h={32} label="result = 9" color={C_OBL} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {['insert', 'lookup', 'delete', 'iterate'].map((op, i) => {
                const y = 30 + i * 38;
                return (
                  <motion.g key={op} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}>
                    <DataBox x={40} y={y} w={140} h={28} label={op} color={C_OBL} outlined />
                    <text x={195} y={y + 18} fontSize={9} fill="var(--foreground)">동일한 access pattern</text>
                  </motion.g>
                );
              })}
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill={C_OBL}>
                ObliDS / PathOSM
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {['Private Information Retrieval', 'Oblivious DB (Opaque)', 'Private Set Intersection'].map((u, i) => {
                const y = 40 + i * 50;
                return (
                  <motion.g key={u} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                    <DataBox x={70} y={y} w={340} h={36} label={u} color={C_USE} outlined />
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
