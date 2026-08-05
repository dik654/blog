import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = {
  thread: '#a855f7',  // violet
  block: '#10b981',   // emerald
  bdim: '#0ea5e9',    // sky
  gdim: '#f59e0b',    // amber
};

const VARS = [
  {
    name: 'threadIdx',
    color: C.thread,
    role: '블록 안의 스레드 위치',
    fields: ['threadIdx.x', 'threadIdx.y', 'threadIdx.z'],
    range: '0 ≤ idx < blockDim',
    use: 'tile 내 좌표, 워프 식별',
  },
  {
    name: 'blockIdx',
    color: C.block,
    role: '그리드 안의 블록 위치',
    fields: ['blockIdx.x', 'blockIdx.y', 'blockIdx.z'],
    range: '0 ≤ idx < gridDim',
    use: '글로벌 인덱스 계산의 출발점',
  },
  {
    name: 'blockDim',
    color: C.bdim,
    role: '블록 하나의 스레드 수',
    fields: ['blockDim.x', 'blockDim.y', 'blockDim.z'],
    range: 'kernel<<<g, b>>> 의 b',
    use: 'idx = blockIdx * blockDim + threadIdx',
  },
  {
    name: 'gridDim',
    color: C.gdim,
    role: '그리드의 블록 수',
    fields: ['gridDim.x', 'gridDim.y', 'gridDim.z'],
    range: 'kernel<<<g, b>>> 의 g',
    use: 'grid-stride loop 최대 반복 결정',
  },
];

const STEPS = [
  { label: 'threadIdx — 블록 내 스레드 위치', body: '내 스레드가 블록 안에서 몇 번째인지.\nuint3 타입 (x, y, z 필드).' },
  { label: 'blockIdx — 그리드 내 블록 위치', body: '내 블록이 그리드 안에서 몇 번째인지.\n이것이 글로벌 인덱스의 출발점.' },
  { label: 'blockDim — 블록의 스레드 수', body: '블록 하나에 스레드가 몇 개인지.\n런치 시 두 번째 인자로 전달한 값.' },
  { label: 'gridDim — 그리드의 블록 수', body: '그리드에 블록이 몇 개인지.\n런치 시 첫 번째 인자로 전달한 값.' },
  { label: '4종 결합 → 글로벌 인덱스', body: 'idx = blockIdx.x * blockDim.x + threadIdx.x\nblockDim/gridDim은 크기, threadIdx/blockIdx는 위치.' },
];

function VarStep({ idx }: { idx: number }) {
  const v = VARS[idx];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={v.color}>
        {v.name}
      </text>
      <motion.text x={240} y={28} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        {v.role}
      </motion.text>
      {v.fields.map((f, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
          <DataBox x={40 + i * 140} y={42} w={130} h={28} label={f} color={v.color} outlined />
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={40} y={84} width={400} height={20} rx={4} fill={v.color + '08'} stroke={v.color} strokeWidth={0.5} />
        <text x={50} y={98} fontSize={8} fontWeight={600} fill={v.color}>범위</text>
        <text x={100} y={98} fontSize={8} fill="var(--foreground)">{v.range}</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={40} y={110} width={400} height={20} rx={4} fill={v.color + '08'} stroke={v.color} strokeWidth={0.5} />
        <text x={50} y={124} fontSize={8} fontWeight={600} fill={v.color}>활용</text>
        <text x={100} y={124} fontSize={8} fill="var(--foreground)">{v.use}</text>
      </motion.g>
    </g>
  );
}

function CombineStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
        idx = blockIdx.x * blockDim.x + threadIdx.x
      </text>
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <DataBox x={20} y={36} w={100} h={30} label="blockIdx.x" sub="블록 위치" color={C.block} outlined />
      </motion.g>
      <motion.text x={130} y={56} fontSize={14} fontWeight={700} fill="var(--foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>×</motion.text>
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
        <DataBox x={150} y={36} w={100} h={30} label="blockDim.x" sub="블록 크기" color={C.bdim} outlined />
      </motion.g>
      <motion.text x={260} y={56} fontSize={14} fontWeight={700} fill="var(--foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>+</motion.text>
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <DataBox x={280} y={36} w={100} h={30} label="threadIdx.x" sub="스레드 위치" color={C.thread} outlined />
      </motion.g>
      <motion.text x={395} y={56} fontSize={14} fontWeight={700} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>=</motion.text>
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
        <rect x={410} y={36} width={56} height={30} rx={6} fill="#8b5cf6" />
        <text x={438} y={56} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">idx</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <text x={240} y={94} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
          예: blockIdx.x=2, blockDim.x=4, threadIdx.x=1 → idx = 2*4+1 = 9
        </text>
        <text x={240} y={112} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          전체 배열에서 9번째 스레드가 9번째 원소 담당
        </text>
        <text x={240} y={132} textAnchor="middle" fontSize={8} fill={C.gdim}>
          gridDim은 grid-stride loop에서 등장 (큰 배열을 적은 블록으로)
        </text>
      </motion.g>
    </g>
  );
}

const R = [
  () => <VarStep idx={0} />,
  () => <VarStep idx={1} />,
  () => <VarStep idx={2} />,
  () => <VarStep idx={3} />,
  () => <CombineStep />,
];

export default function BuiltinVarsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 160" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
