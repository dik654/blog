import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';

const C = {
  ocl: '#0ea5e9',     // sky — OpenCL
  cuda: '#10b981',    // emerald — CUDA (NV)
  pro: '#10b981',
  con: '#ef4444',
  env: '#a855f7',
};

const STEPS = [
  { label: 'OpenCL 백엔드 (기본)', body: 'NVIDIA / AMD / Intel GPU 모두 지원.\nbellman(Zcash) 시절부터 검증된 경로.\n드라이버만 있으면 동작.' },
  { label: 'OpenCL 단점', body: 'NVIDIA GPU에서 CUDA 대비 10-20% 느림.\nJIT 컴파일 시간이 CUDA보다 김.' },
  { label: 'CUDA 백엔드', body: 'NVIDIA 전용, PTX 직접 생성.\nnvcc -O3 --use_fast_math 활용.\nwarp shuffle / Tensor Core 가능.' },
  { label: 'CUDA 단점', body: 'NVIDIA 전용 (AMD/Intel 불가).\nCUDA Toolkit 설치 필요.\n빌드/배포가 무겁다.' },
  { label: '환경 변수로 백엔드 선택', body: 'BELLMAN_CUDA=1 cargo build → CUDA.\n(미설정) → OpenCL 기본.\nFeature flag로 의존성 분리.' },
];

const PROS_OCL = ['NVIDIA + AMD + Intel', '드라이버만 필요', '오래 검증된 경로'];
const CONS_OCL = ['NV에서 CUDA 대비 -10~20%', 'JIT 컴파일 더 김'];
const PROS_CUDA = ['NV 최적 성능 (PTX 직접)', 'nvcc -O3 / fast_math', 'warp shuffle / Tensor Core'];
const CONS_CUDA = ['NVIDIA 전용', 'CUDA Toolkit 필요', '빌드 무거움'];

function BackendCard({ name, color, items, kind, x }: {
  name: string; color: string; items: string[]; kind: 'pro' | 'con'; x: number;
}) {
  const accent = kind === 'pro' ? C.pro : C.con;
  return (
    <g>
      <text x={x + 110} y={26} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>
        {name} <tspan fill={accent}>({kind === 'pro' ? '장점' : '단점'})</tspan>
      </text>
      <rect x={x} y={32} width={220} height={Math.max(82, items.length * 22 + 16)} rx={8}
        fill={color + '06'} stroke={color} strokeWidth={0.6} />
      {items.map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
          <circle cx={x + 18} cy={50 + i * 22} r={3} fill={accent} />
          <text x={x + 30} y={54 + i * 22} fontSize={8.5} fill="var(--foreground)">{t}</text>
        </motion.g>
      ))}
    </g>
  );
}

function OclProStep() {
  return (
    <g>
      <BackendCard name="OpenCL" color={C.ocl} items={PROS_OCL} kind="pro" x={130} />
    </g>
  );
}
function OclConStep() {
  return (
    <g>
      <BackendCard name="OpenCL" color={C.ocl} items={CONS_OCL} kind="con" x={130} />
    </g>
  );
}
function CudaProStep() {
  return (
    <g>
      <BackendCard name="CUDA" color={C.cuda} items={PROS_CUDA} kind="pro" x={130} />
    </g>
  );
}
function CudaConStep() {
  return (
    <g>
      <BackendCard name="CUDA" color={C.cuda} items={CONS_CUDA} kind="con" x={130} />
    </g>
  );
}

function EnvSelectStep() {
  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.env}>
        환경 변수 / Feature flag 로 백엔드 선택
      </text>
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <ModuleBox x={20} y={36} w={200} h={48} label="기본: OpenCL" sub="cargo build" color={C.ocl} />
        <text x={120} y={102} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          어디서나 동작
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <ModuleBox x={260} y={36} w={200} h={48} label="BELLMAN_CUDA=1" sub="cargo build" color={C.cuda} />
        <text x={360} y={102} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          NVIDIA에서 최고 성능
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={60} y={118} width={360} height={22} rx={4} fill={C.env + '08'} stroke={C.env} strokeWidth={0.5} />
        <text x={240} y={132} textAnchor="middle" fontSize={8} fill={C.env}>
          rust-gpu-tools 가 동일 Rust API로 두 백엔드 추상화
        </text>
      </motion.g>
    </g>
  );
}

const R = [OclProStep, OclConStep, CudaProStep, CudaConStep, EnvSelectStep];

export default function BackendViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
