import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LAYERS = [
  { label: 'Rust 패킹 서비스', color: '#6366f1', y: 5 },
  { label: 'CUDA C 인터페이스', color: '#8b5cf6', y: 35 },
  { label: 'GPU 커널 실행', color: '#10b981', y: 65 },
  { label: '결과 호스트 복사', color: '#f59e0b', y: 95 },
];

const STEPS = [
  { label: 'CUDA 가속 파이프라인', body: 'Rust FFI → CUDA C → GPU 커널 → 호스트 복사의 4단계 파이프라인.' },
  { label: 'Rust → CUDA FFI', body: 'cfg(feature = "nvidia") 게이트로 CUDA 사용 가능 시에만 GPU 경로 활성화.' },
  { label: 'GPU 커널 병렬 실행', body: '각 스레드가 하나의 청크 엔트로피를 독립 계산. 수천 스레드 동시 실행.' },
  { label: '결과 전송', body: '계산 완료 후 cudaMemcpy로 GPU → CPU 메모리 복사.' },
];

export default function CUDAPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 125" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const active = step === 0 || step === i + 1;
            return (
              <g key={i}>
                <motion.rect x={40} y={l.y} width={180} height={24} rx={5}
                  animate={{ fill: `${l.color}${active ? '18' : '06'}`,
                    stroke: l.color, strokeWidth: active ? 1.5 : 0.5,
                    opacity: active ? 1 : 0.2 }}
                  transition={{ duration: 0.3 }} />
                <text x={130} y={l.y + 15} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={l.color} opacity={active ? 1 : 0.2}>
                  {l.label}
                </text>
                {i < 3 && (
                  <motion.line x1={130} y1={l.y + 24} x2={130} y2={l.y + 35}
                    stroke={l.color} strokeWidth={1} strokeDasharray="3 2"
                    animate={{ opacity: active ? 0.5 : 0.1 }}
                    transition={{ duration: 0.3 }} />
                )}
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
