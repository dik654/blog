import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  leaf: '#0ea5e9',
  l2: '#10b981',
  l1: '#a855f7',
  root: '#f59e0b',
  gpu: '#10b981',
  cpu: '#ef4444',
};

const STEPS = [
  {
    label: '레벨 3 (리프) — 8개 입력 데이터',
    body: '입력 데이터를 리프에 배치 — L0, L1, ..., L7.\n각 리프는 32바이트 Fp 원소 1개.',
  },
  {
    label: '레벨 2 — 2-ary 해시 4개',
    body: 'H(L0,L1), H(L2,L3), H(L4,L5), H(L6,L7) → 4개 해시.\nN=4 → 단일 GPU 커널 호출: poseidon_batch<<<4, width>>>.',
  },
  {
    label: '레벨 1 — 해시 2개',
    body: 'H(H01, H23), H(H45, H67) → 2개 해시.\nN=2 → 같은 커널, grid 크기만 줄어듦.',
  },
  {
    label: '레벨 0 (루트) — 해시 1개',
    body: 'H(H0123, H4567) → Merkle root.\nN=1 → GPU 활용도 0% — CPU로 처리하는 편이 빠름.',
  },
  {
    label: 'Neptune 패턴 + 하이브리드 최적화',
    body: '하위 레벨(N 큼): GPU 배치 해시.\n상위 레벨(N 작음): CPU 처리 (커널 launch 오버헤드 회피).\nNeptune은 임계 레벨까지만 GPU에 위임.',
  },
];

const LEAF_X = [40, 100, 160, 220, 280, 340, 400, 460];
const Y_LEAF = 200;
const Y_L2 = 150;
const Y_L1 = 100;
const Y_ROOT = 50;

export default function MerkleTreeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={250} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            GPU Merkle 트리 — 레벨별 배치 해싱
          </text>

          {/* 리프 노드 (항상 표시) */}
          {LEAF_X.map((x, i) => (
            <motion.g key={`leaf-${i}`} initial={{ opacity: 0 }}
              animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
              <rect x={x - 16} y={Y_LEAF - 10} width={32} height={20} rx={4}
                fill={C.leaf + '14'} stroke={C.leaf} strokeWidth={0.6} />
              <text x={x} y={Y_LEAF + 4} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.leaf}>{`L${i}`}</text>
            </motion.g>
          ))}

          {/* 레벨 2 (4개) */}
          {step >= 1 && [0, 1, 2, 3].map((i) => {
            const x = (LEAF_X[i * 2] + LEAF_X[i * 2 + 1]) / 2;
            return (
              <motion.g key={`l2-${i}`} initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                <line x1={LEAF_X[i * 2]} y1={Y_LEAF - 10} x2={x} y2={Y_L2 + 10} stroke={C.l2} strokeWidth={0.6} />
                <line x1={LEAF_X[i * 2 + 1]} y1={Y_LEAF - 10} x2={x} y2={Y_L2 + 10} stroke={C.l2} strokeWidth={0.6} />
                <rect x={x - 18} y={Y_L2 - 10} width={36} height={20} rx={4}
                  fill={C.l2 + '14'} stroke={C.l2} strokeWidth={0.7} />
                <text x={x} y={Y_L2 + 4} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.l2}>{`H${i * 2}${i * 2 + 1}`}</text>
              </motion.g>
            );
          })}

          {/* 레벨 1 (2개) */}
          {step >= 2 && [0, 1].map((i) => {
            const xL = (LEAF_X[i * 4] + LEAF_X[i * 4 + 1]) / 2;
            const xR = (LEAF_X[i * 4 + 2] + LEAF_X[i * 4 + 3]) / 2;
            const x = (xL + xR) / 2;
            return (
              <motion.g key={`l1-${i}`} initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                <line x1={xL} y1={Y_L2 - 10} x2={x} y2={Y_L1 + 10} stroke={C.l1} strokeWidth={0.6} />
                <line x1={xR} y1={Y_L2 - 10} x2={x} y2={Y_L1 + 10} stroke={C.l1} strokeWidth={0.6} />
                <rect x={x - 22} y={Y_L1 - 10} width={44} height={20} rx={4}
                  fill={C.l1 + '14'} stroke={C.l1} strokeWidth={0.7} />
                <text x={x} y={Y_L1 + 4} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.l1}>{i === 0 ? 'H0..3' : 'H4..7'}</text>
              </motion.g>
            );
          })}

          {/* 루트 */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <line x1={130} y1={Y_L1 - 10} x2={250} y2={Y_ROOT + 10} stroke={C.root} strokeWidth={0.7} />
              <line x1={370} y1={Y_L1 - 10} x2={250} y2={Y_ROOT + 10} stroke={C.root} strokeWidth={0.7} />
              <rect x={222} y={Y_ROOT - 10} width={56} height={20} rx={4}
                fill={C.root + '14'} stroke={C.root} strokeWidth={1} />
              <text x={250} y={Y_ROOT + 4} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.root}>root</text>
            </motion.g>
          )}

          {/* 어노테이션 박스 */}
          {step === 0 && (
            <DataBox x={20} y={26} w={460} h={18} label="입력 데이터 8개 (32바이트 Fp 원소)" color={C.leaf} outlined />
          )}
          {step === 1 && (
            <DataBox x={20} y={26} w={460} h={18} label="poseidon_batch<<<4, width>>> — N=4" color={C.l2} outlined />
          )}
          {step === 2 && (
            <DataBox x={20} y={26} w={460} h={18} label="poseidon_batch<<<2, width>>> — N=2 (활용도 ↓)" color={C.l1} outlined />
          )}
          {step === 3 && (
            <AlertBox x={20} y={26} w={460} h={18} label="N=1 — GPU launch 오버헤드 > 연산 시간" color={C.cpu} />
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={26} w={220} h={18} label="GPU: 하위 레벨 (N 큼)" color={C.gpu} outlined />
              <DataBox x={260} y={26} w={220} h={18} label="CPU: 상위 레벨 (N ≤ 임계)" color={C.cpu} outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
