import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  thread: '#a855f7',
  warp: '#f59e0b',
  block: '#10b981',
  cluster: '#ef4444',
  grid: '#0ea5e9',
};

const STEPS = [
  { label: '기존 (Hopper 이전): Thread → Warp → Block → Grid', body: '4계층 구조.\n블록 간 통신은 글로벌 메모리 + __threadfence (L2 경유, 느림).' },
  { label: 'Hopper: Block 과 Grid 사이에 Cluster 추가', body: '5계층 구조.\nThread → Warp → Block → Cluster → Grid.\nCluster 는 동일 GPC 내에 배치 보장.' },
  { label: 'Cluster = 같은 GPC 내 블록 묶음', body: '최대 16 블록을 하나의 클러스터로.\n클러스터는 SM 간 네트워크로 직접 통신.\nL2 우회.' },
  { label: '결과: 분산 공유 메모리 (Distributed Shared)', body: 'cluster.map_shared_rank() 로 이웃 블록 smem 직접 접근.\ncluster.sync() 경량 배리어.' },
];

const OLD_LEVELS = [
  { name: 'Thread', sub: 'CUDA core', color: C.thread },
  { name: 'Warp',   sub: '32 threads', color: C.warp },
  { name: 'Block',  sub: 'SM 1개',     color: C.block },
  { name: 'Grid',   sub: 'GPU 전체',   color: C.grid },
];

const NEW_LEVELS = [
  { name: 'Thread',  sub: 'CUDA core',  color: C.thread },
  { name: 'Warp',    sub: '32 threads', color: C.warp },
  { name: 'Block',   sub: 'SM 1개',     color: C.block },
  { name: 'Cluster', sub: '~16 blocks', color: C.cluster, isNew: true },
  { name: 'Grid',    sub: 'GPU 전체',   color: C.grid },
];

function HierBar({ levels, y }: { levels: typeof NEW_LEVELS; y: number }) {
  const w = 460 / levels.length;
  return (
    <g>
      {levels.map((l, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
          <rect x={10 + i * w} y={y} width={w - 8} height={36} rx={6}
            fill={l.color + ((l as { isNew?: boolean }).isNew ? '20' : '12')}
            stroke={l.color} strokeWidth={(l as { isNew?: boolean }).isNew ? 1.2 : 0.6} />
          <text x={10 + i * w + (w - 8) / 2} y={y + 16} textAnchor="middle" fontSize={9} fontWeight={700} fill={l.color}>
            {l.name}
          </text>
          <text x={10 + i * w + (w - 8) / 2} y={y + 28} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            {l.sub}
          </text>
          {i < levels.length - 1 && (
            <line x1={10 + (i + 1) * w - 8} y1={y + 18} x2={10 + (i + 1) * w} y2={y + 18}
              stroke={l.color} strokeWidth={0.8} markerEnd="url(#arrCh2)" />
          )}
        </motion.g>
      ))}
    </g>
  );
}

function OldHierStep() {
  return (
    <g>
      <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--muted-foreground)">
        기존 4계층 (Volta ~ Ampere)
      </text>
      <HierBar levels={OLD_LEVELS} y={40} />
      <motion.text x={240} y={104} textAnchor="middle" fontSize={9} fill={C.cluster}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Block 간 통신: 글로벌 메모리 + __threadfence (L2 경유, 느림)
      </motion.text>
      <defs>
        <marker id="arrCh2" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
        </marker>
      </defs>
    </g>
  );
}

function NewHierStep() {
  return (
    <g>
      <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cluster}>
        Hopper 5계층 (Cluster 추가)
      </text>
      <HierBar levels={NEW_LEVELS} y={40} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={240} y={104} textAnchor="middle" fontSize={9} fill={C.cluster}>
          Cluster: 같은 GPC 내 동시 스케줄 보장 + 분산 공유 메모리
        </text>
      </motion.g>
    </g>
  );
}

function ClusterDetailStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cluster}>
        Cluster = 같은 GPC 내 블록 그룹 (최대 16)
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <rect x={40} y={32} width={400} height={80} rx={10} fill={C.cluster + '06'} stroke={C.cluster} strokeWidth={1.2} strokeDasharray="6 3" />
        <text x={60} y={48} fontSize={8} fontWeight={700} fill={C.cluster}>GPC (Cluster)</text>
      </motion.g>
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>
          <rect x={60 + i * 92} y={56} width={80} height={42} rx={6} fill={C.block + '15'} stroke={C.block} strokeWidth={0.8} />
          <text x={100 + i * 92} y={74} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={C.block}>Block {i}</text>
          <text x={100 + i * 92} y={88} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">SM {i}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        {[0, 1, 2].map((i) => (
          <line key={i} x1={140 + i * 92} y1={77} x2={152 + i * 92} y2={77}
            stroke={C.cluster} strokeWidth={1.2} markerEnd="url(#arrCh2)" />
        ))}
      </motion.g>
      <motion.text x={240} y={132} textAnchor="middle" fontSize={9} fill={C.cluster}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        SM 간 네트워크로 직접 통신 (L2 우회)
      </motion.text>
    </g>
  );
}

function DSMStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cluster}>
        Distributed Shared Memory
      </text>
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <rect x={30} y={36} width={180} height={56} rx={8} fill={C.block + '12'} stroke={C.block} strokeWidth={0.8} />
        <text x={120} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.block}>Block A (SM 0)</text>
        <rect x={50} y={62} width={140} height={20} rx={3} fill={C.block + '20'} stroke={C.block} strokeWidth={0.5} />
        <text x={120} y={75} textAnchor="middle" fontSize={8} fill={C.block}>shared memory</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <line x1={213} y1={64} x2={267} y2={64} stroke={C.cluster} strokeWidth={1.4} markerEnd="url(#arrCh2)" />
        <text x={240} y={56} textAnchor="middle" fontSize={7} fill={C.cluster}>map_shared_rank</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
        <rect x={270} y={36} width={180} height={56} rx={8} fill={C.block + '12'} stroke={C.block} strokeWidth={0.8} />
        <text x={360} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.block}>Block B (SM 1)</text>
        <rect x={290} y={62} width={140} height={20} rx={3} fill={C.block + '20'} stroke={C.block} strokeWidth={0.5} />
        <text x={360} y={75} textAnchor="middle" fontSize={8} fill={C.block}>shared memory</text>
      </motion.g>
      <motion.text x={240} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.cluster}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        cluster.sync() — 클러스터 단위 경량 배리어
      </motion.text>
      <motion.text x={240} y={124} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        L2 경유 없이 SM 간 네트워크로 직접 read
      </motion.text>
    </g>
  );
}

const R = [OldHierStep, NewHierStep, ClusterDetailStep, DSMStep];

export default function ClusterHierarchyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 140" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
