import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

// CUDA 스레드 계층 4단계 색상
const C = {
  grid: '#0ea5e9',     // sky
  block: '#10b981',    // emerald
  warp: '#f59e0b',     // amber
  thread: '#a855f7',   // violet
  limit: '#ef4444',    // red
};

const STEPS = [
  { label: 'Grid: 커널 1회 호출 = Grid 1개', body: 'Grid는 커널 호출의 가장 바깥 단위.\n수백~수천 Block 포함.' },
  { label: 'Block: Grid를 구성하는 단위', body: 'Block은 SM 1개에 통째 배정.\n같은 Block 스레드는 공유 메모리 공유.' },
  { label: 'Warp: 32 스레드 묶음', body: '워프 단위로 명령어 동시 실행 (SIMT).\n워프 크기는 모든 NVIDIA GPU 공통 32.' },
  { label: 'Thread: 최소 실행 단위', body: '각 Thread는 CUDA 코어 1개에서 실행.\n블록 내 threadIdx로 식별.' },
  { label: '하드웨어 제약', body: '블록당 최대 1024 스레드.\n블록 차원 x=1024 y=1024 z=64.\n그리드 차원 x=2^31-1 y=65535 z=65535.' },
];

function GridStep() {
  return (
    <g>
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <rect x={40} y={20} width={400} height={130} rx={10} fill={C.grid + '08'}
          stroke={C.grid} strokeWidth={1.2} strokeDasharray="6 3" />
        <text x={240} y={36} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.grid}>Grid</text>
      </motion.g>
      {Array.from({ length: 9 }).map((_, i) => {
        const col = i % 3, row = Math.floor(i / 3);
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.2 + i * 0.04 }}>
            <rect x={70 + col * 115} y={50 + row * 32} width={100} height={26} rx={4}
              fill="var(--card)" stroke={C.block} strokeWidth={0.5} />
            <text x={120 + col * 115} y={66 + row * 32} textAnchor="middle" fontSize={8} fill={C.block}>
              Block ({col},{row})
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

function BlockStep() {
  return (
    <g>
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <ModuleBox x={170} y={20} w={140} h={50} label="Block (1, 0)" sub="최대 1024 스레드" color={C.block} />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <line x1={240} y1={70} x2={240} y2={88} stroke={C.block} strokeWidth={1} markerEnd="url(#arrCh)" />
        <DataBox x={70} y={92} w={120} h={26} label="SM 배정" sub="공유 메모리 가능" color={C.block} />
        <DataBox x={200} y={92} w={120} h={26} label="동기화" sub="__syncthreads()" color={C.block} />
        <DataBox x={330} y={92} w={120} h={26} label="레지스터" sub="블록 단위 분배" color={C.block} />
      </motion.g>
      <motion.text x={240} y={140} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Block 간 공유 메모리 직접 접근 불가
      </motion.text>
      <defs>
        <marker id="arrCh" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
          <path d="M0,0 L5,2.5 L0,5" fill={C.block} />
        </marker>
      </defs>
    </g>
  );
}

function WarpStep() {
  return (
    <g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <rect x={30} y={20} width={420} height={40} rx={6} fill={C.block + '06'} stroke={C.block} strokeWidth={0.6} strokeDasharray="3 2" />
        <text x={240} y={36} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.block}>Block (1024 스레드)</text>
      </motion.g>
      {[0, 1, 2, 31].map((idx, i) => {
        const x = 40 + i * 100;
        return (
          <motion.g key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>
            <rect x={x} y={75} width={86} height={32} rx={5} fill={C.warp + '15'} stroke={C.warp} strokeWidth={0.8} />
            <text x={x + 43} y={93} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warp}>
              {i === 3 ? 'Warp 31' : `Warp ${idx}`}
            </text>
            <text x={x + 43} y={102} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
              {i === 3 ? 'Thread 992-1023' : `Thread ${idx * 32}-${idx * 32 + 31}`}
            </text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        SIMT: 워프 내 32 스레드는 동일 명령 동시 실행
      </motion.text>
    </g>
  );
}

function ThreadStep() {
  return (
    <g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <rect x={50} y={20} width={380} height={28} rx={5} fill={C.warp + '10'} stroke={C.warp} strokeWidth={0.8} />
        <text x={240} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warp}>Warp 0 (32 스레드)</text>
      </motion.g>
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 60 + i * 47;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04 }}>
            <rect x={x} y={62} width={42} height={36} rx={4} fill={C.thread + '15'} stroke={C.thread} strokeWidth={0.7} />
            <text x={x + 21} y={78} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.thread}>T{i}</text>
            <text x={x + 21} y={92} textAnchor="middle" fontSize={6.5} fill="var(--muted-foreground)">core</text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        ... 24 스레드 더 (총 32)
      </motion.text>
      <motion.text x={240} y={138} textAnchor="middle" fontSize={8} fill={C.thread}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        threadIdx로 블록 내 위치 식별
      </motion.text>
    </g>
  );
}

function LimitStep() {
  const limits = [
    { label: 'Block당 최대 스레드', value: '1024', color: C.block },
    { label: 'Block 차원 (x, y, z)', value: '1024 / 1024 / 64', color: C.block },
    { label: 'Grid 차원 x', value: '2^31 - 1', color: C.grid },
    { label: 'Grid 차원 (y, z)', value: '65535 / 65535', color: C.grid },
    { label: 'Warp 크기 (고정)', value: '32', color: C.warp },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.limit}>하드웨어 제약</text>
      {limits.map((l, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
          <rect x={30} y={26 + i * 22} width={420} height={18} rx={4}
            fill={l.color + '08'} stroke={l.color} strokeWidth={0.5} />
          <text x={42} y={39 + i * 22} fontSize={8.5} fontWeight={600} fill={l.color}>{l.label}</text>
          <text x={440} y={39 + i * 22} textAnchor="end" fontSize={9} fontWeight={700} fill="var(--foreground)">{l.value}</text>
        </motion.g>
      ))}
    </g>
  );
}

const R = [GridStep, BlockStep, WarpStep, ThreadStep, LimitStep];

export default function HierarchyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 160" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
