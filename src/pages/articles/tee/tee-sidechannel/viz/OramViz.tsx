import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_TREE = '#6366f1';
const C_PATH = '#10b981';
const C_STASH = '#f59e0b';
const C_COST = '#ef4444';

const STEPS = [
  {
    label: 'Path ORAM — binary tree + stash',
    body: '모든 block은 tree 노드 또는 stash에 저장.\nposition_map[block_id] = path. 각 access는 path 전체를 읽고 다시 쓴다.',
  },
  {
    label: '읽기 — path 전체 read → 타겟 추출',
    body: 'path 위 모든 노드 (~log N)를 읽음.\n타겟 block을 stash로 이동, 새 random path 할당.',
  },
  {
    label: '쓰기 — stash에서 path를 다시 채움',
    body: 'rebuild_path: stash 내 가능한 block들을 path에 다시 분배.\n결과적으로 access pattern이 uniform random과 구분 불가.',
  },
  {
    label: '비용 — O(log²N) overhead',
    body: '1GB 데이터셋(2^24 block)에서 24× slowdown.\n민감 워크로드(key store)만 제한적 사용 권장. 변형: Ring ORAM, ZeroTrace.',
  },
];

export default function OramViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* binary tree */}
              <DataBox x={210} y={20} w={60} h={24} label="root" color={C_TREE} outlined />
              <DataBox x={140} y={66} w={60} h={24} label="L" color={C_TREE} outlined />
              <DataBox x={280} y={66} w={60} h={24} label="R" color={C_TREE} outlined />
              <DataBox x={70} y={112} w={50} h={24} label="LL" color={C_TREE} outlined />
              <DataBox x={150} y={112} w={50} h={24} label="LR" color={C_TREE} outlined />
              <DataBox x={250} y={112} w={50} h={24} label="RL" color={C_TREE} outlined />
              <DataBox x={330} y={112} w={50} h={24} label="RR" color={C_TREE} outlined />
              <line x1={240} y1={44} x2={170} y2={66} stroke={C_TREE} />
              <line x1={240} y1={44} x2={310} y2={66} stroke={C_TREE} />
              <line x1={170} y1={90} x2={95} y2={112} stroke={C_TREE} />
              <line x1={170} y1={90} x2={175} y2={112} stroke={C_TREE} />
              <line x1={310} y1={90} x2={275} y2={112} stroke={C_TREE} />
              <line x1={310} y1={90} x2={355} y2={112} stroke={C_TREE} />
              <DataBox x={150} y={170} w={180} h={32} label="stash (temp blocks)" color={C_STASH} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* path highlight */}
              <DataBox x={210} y={20} w={60} h={24} label="root" color={C_PATH} outlined />
              <DataBox x={280} y={66} w={60} h={24} label="R" color={C_PATH} outlined />
              <DataBox x={250} y={112} w={50} h={24} label="RL" color={C_PATH} outlined />
              <DataBox x={140} y={66} w={60} h={24} label="L" color={C_TREE} outlined />
              <DataBox x={70} y={112} w={50} h={24} label="LL" color={C_TREE} outlined />
              <DataBox x={150} y={112} w={50} h={24} label="LR" color={C_TREE} outlined />
              <DataBox x={330} y={112} w={50} h={24} label="RR" color={C_TREE} outlined />
              <line x1={240} y1={44} x2={310} y2={66} stroke={C_PATH} strokeWidth={1.5} />
              <line x1={310} y1={90} x2={275} y2={112} stroke={C_PATH} strokeWidth={1.5} />
              <ActionBox x={130} y={158} w={220} h={32} label="path 전체 read → 타겟 → stash" color={C_PATH} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={150} y={20} w={180} h={32} label="stash (가능한 block들)" color={C_STASH} outlined />
              <ActionBox x={120} y={70} w={240} h={36} label="rebuild_path: 다시 분배" sub="새 random path" color={C_PATH} />
              <DataBox x={150} y={130} w={180} h={32} label="position_map 업데이트" color={C_TREE} outlined />
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill={C_PATH}>
                access pattern이 uniform random과 구분 불가
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={26} textAnchor="middle" fontSize={10} fontWeight={700} fill={C_COST}>
                비용 비교 (1GB 데이터셋)
              </text>
              <text x={50} y={70} fontSize={9} fill="var(--foreground)">일반 access</text>
              <rect x={150} y={60} width={20} height={14} rx={2} fill={C_PATH} />
              <text x={50} y={108} fontSize={9} fill="var(--foreground)">Path ORAM</text>
              <rect x={150} y={98} width={300} height={14} rx={2} fill={C_COST} />
              <text x={460} y={108} textAnchor="end" fontSize={9} fill={C_COST}>24×</text>
              <AlertBox x={70} y={140} w={340} h={32} label="민감 워크로드만 제한 사용" color={C_COST} />
              <text x={240} y={194} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Ring ORAM (bandwidth) / ZeroTrace (SGX 통합)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
