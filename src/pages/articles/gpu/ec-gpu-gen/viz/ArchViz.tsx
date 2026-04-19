import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  bp: '#0ea5e9',     // sky — bellperson
  gen: '#10b981',    // emerald — ec-gpu-gen
  rt: '#f59e0b',     // amber — rust-gpu-tools
  gpu: '#a855f7',    // violet — GPU
  highlight: '#ef4444',
};

const STEPS = [
  { label: 'bellperson: Groth16 prover (Rust)', body: '증명 생성의 80%+ 가 MSM(Multi-Scalar Multiplication).\n수백만 점 × 스칼라 곱.\nCPU만 쓰면 분 단위, GPU 쓰면 초 단위.' },
  { label: 'ec-gpu-gen: 빌드 타임 커널 생성', body: 'BN254 / BLS12-381 등 커브별로 FIELD_*, POINT_* 함수 생성.\nbuild.rs 출력물이 OUT_DIR/kernel.cl 또는 .cu.' },
  { label: 'rust-gpu-tools: 런타임 GPU 관리', body: '디바이스 탐색 (OpenCL/CUDA).\n첫 호출 시 커널 소스 → GPU 바이너리 컴파일.\nGPU 메모리 버퍼 할당/전송.' },
  { label: 'GPU: 실제 커널 실행', body: 'NVIDIA / AMD GPU 모두 지원 (OpenCL).\nNV에서는 CUDA 백엔드로 PTX 직접 생성.' },
  { label: '지연 컴파일 (lazy compilation)', body: '빌드 타임에는 GPU 없이도 컴파일 가능.\n첫 multiexp() 호출 때 드라이버가 컴파일.\n결과 바이너리는 디스크에 캐시.' },
];

const STAGES = [
  { x: 30,  label: 'bellperson', sub: 'Groth16',     color: C.bp },
  { x: 145, label: 'ec-gpu-gen', sub: '커널 소스',   color: C.gen },
  { x: 260, label: 'rust-gpu-tools', sub: 'GPU 추상화', color: C.rt },
  { x: 380, label: 'GPU',         sub: 'NV / AMD',  color: C.gpu },
];

function ArchStep({ active }: { active: number }) {
  return (
    <g>
      {STAGES.map((s, i) => {
        const isActive = i === active;
        const opacity = isActive ? 1 : 0.3;
        return (
          <g key={i} opacity={opacity} style={{ transition: 'opacity 0.3s' }}>
            <ModuleBox x={s.x} y={32} w={90} h={44} label={s.label} sub={s.sub} color={s.color} />
            {i < STAGES.length - 1 && (
              <line x1={s.x + 92} y1={54} x2={STAGES[i + 1].x - 2} y2={54}
                stroke={i < active || isActive ? s.color : 'var(--border)'}
                strokeWidth={isActive ? 1.4 : 0.8}
                markerEnd={`url(#arrArch${isActive ? 'A' : 'I'})`} />
            )}
          </g>
        );
      })}
      {active === 0 && (
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <DataBox x={70} y={92} w={140} h={26} label="multiexp(bases, scalars)" color={C.bp} outlined />
          <text x={240} y={108} fontSize={8} fill="var(--muted-foreground)">→ MSM (~10^6 점)</text>
        </motion.g>
      )}
      {active === 1 && (
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <DataBox x={50} y={92} w={120} h={26} label="FIELD_mul()" color={C.gen} outlined />
          <DataBox x={180} y={92} w={120} h={26} label="POINT_add()" color={C.gen} outlined />
          <DataBox x={310} y={92} w={130} h={26} label="POINT_double()" color={C.gen} outlined />
        </motion.g>
      )}
      {active === 2 && (
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <DataBox x={30} y={92} w={130} h={26} label="Device::best()" color={C.rt} outlined />
          <DataBox x={170} y={92} w={130} h={26} label="program.compile()" color={C.rt} outlined />
          <DataBox x={310} y={92} w={140} h={26} label="create_buffer()" color={C.rt} outlined />
        </motion.g>
      )}
      {active === 3 && (
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <text x={240} y={106} textAnchor="middle" fontSize={8.5} fill={C.gpu}>
            run_kernel("multiexp", buffers) → SM 병렬 실행
          </text>
        </motion.g>
      )}
      {active === 4 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <rect x={60} y={92} width={360} height={32} rx={6} fill={C.highlight + '08'} stroke={C.highlight} strokeWidth={0.6} />
          <text x={240} y={106} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.highlight}>지연 컴파일</text>
          <text x={240} y={119} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
            빌드 ↛ GPU / 첫 호출 시 컴파일 / 디스크 캐시 재사용
          </text>
        </motion.g>
      )}
      <defs>
        <marker id="arrArchA" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={C.bp} />
        </marker>
        <marker id="arrArchI" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--border)" />
        </marker>
      </defs>
    </g>
  );
}

const R = [
  () => <ArchStep active={0} />,
  () => <ArchStep active={1} />,
  () => <ArchStep active={2} />,
  () => <ArchStep active={3} />,
  () => <ArchStep active={4} />,
];

export default function ArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 130" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
