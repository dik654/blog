import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  build: '#0ea5e9',     // sky — build.rs
  template: '#10b981',  // emerald — 템플릿 주입
  out: '#f59e0b',       // amber — 출력
  rt: '#a855f7',        // violet — 런타임
  highlight: '#ef4444', // red — 강조
};

const STEPS = [
  { label: 'build.rs 트리거 (cargo build 시 자동)', body: 'Cargo가 build.rs를 컴파일/실행.\n환경변수 OUT_DIR로 출력 경로 전달.' },
  { label: '1. GpuField trait → 커브 파라미터 추출', body: 'modulus(), r(), r2(), inv() 호출.\nlimbs 수, p limb 배열, R, R2, inv 획득.' },
  { label: '2. 템플릿에 파라미터 주입', body: 'FIELD_LIMBS / FIELD_P[] / FIELD_R[] / FIELD_INV 등의 #define 생성.\nField/Point 함수 본체는 공통 (limb 수만큼 unroll).' },
  { label: '3. OUT_DIR 에 .cl / .cu 기록', body: '생성된 소스를 파일로 출력.\ninclude_str! 매크로로 Rust 코드에 임베딩.' },
  { label: '런타임: rust-gpu-tools가 GPU 컴파일/실행', body: '첫 호출 시 OpenCL JIT / NVCC가 PTX 생성.\n이후 호출은 디바이스에 캐시된 바이너리 재사용.' },
];

const STAGES = [
  { x: 30, label: 'build.rs', sub: 'Rust 빌드 스크립트', color: C.build },
  { x: 130, label: '파라미터 추출', sub: 'GpuField trait', color: C.build },
  { x: 230, label: '템플릿 주입', sub: '#define 치환', color: C.template },
  { x: 330, label: 'OUT_DIR/kernel', sub: '.cl / .cu', color: C.out },
  { x: 430, label: 'GPU', sub: 'rust-gpu-tools', color: C.rt },
];

function StageStep({ active }: { active: number }) {
  return (
    <g>
      {STAGES.map((s, i) => {
        const isActive = i === active;
        const isPast = i < active;
        const opacity = isActive ? 1 : isPast ? 0.5 : 0.25;
        return (
          <g key={i} opacity={opacity} style={{ transition: 'opacity 0.3s' }}>
            <ModuleBox x={s.x - 20} y={28} w={70} h={42} label={s.label} sub={s.sub} color={s.color} />
            {i < STAGES.length - 1 && (
              <motion.line x1={s.x + 52} y1={49} x2={s.x + 80} y2={49}
                stroke={isPast || isActive ? s.color : 'var(--border)'} strokeWidth={isActive ? 1.4 : 0.8}
                markerEnd={`url(#arrFlow${isActive ? 'A' : 'I'})`} />
            )}
          </g>
        );
      })}
      {active === 1 && (
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <DataBox x={70} y={94} w={70} h={22} label="modulus()" color={C.build} outlined />
          <DataBox x={150} y={94} w={70} h={22} label="r() / r2()" color={C.build} outlined />
          <DataBox x={230} y={94} w={70} h={22} label="inv()" color={C.build} outlined />
          <DataBox x={310} y={94} w={70} h={22} label="curve a, b" color={C.build} outlined />
        </motion.g>
      )}
      {active === 2 && (
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <DataBox x={50} y={94} w={90} h={22} label="FIELD_add()" color={C.template} outlined />
          <DataBox x={150} y={94} w={90} h={22} label="FIELD_mul()" color={C.template} outlined />
          <DataBox x={250} y={94} w={90} h={22} label="POINT_add()" color={C.template} outlined />
          <DataBox x={350} y={94} w={100} h={22} label="POINT_double()" color={C.template} outlined />
        </motion.g>
      )}
      {active === 4 && (
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <text x={240} y={108} textAnchor="middle" fontSize={8} fill={C.rt}>
            첫 호출: JIT 컴파일 (~수백 ms) → 캐시
          </text>
          <text x={240} y={124} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            이후 호출: 캐시된 PTX/SPV 즉시 실행
          </text>
        </motion.g>
      )}
      <defs>
        <marker id="arrFlowA" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={C.template} />
        </marker>
        <marker id="arrFlowI" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--border)" />
        </marker>
      </defs>
    </g>
  );
}

const R = [
  () => <StageStep active={0} />,
  () => <StageStep active={1} />,
  () => <StageStep active={2} />,
  () => <StageStep active={3} />,
  () => <StageStep active={4} />,
];

export default function FlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 140" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
