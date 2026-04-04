import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const STEPS = [
  { label: 'PC1: CPU 전용 (SHA-256, 3-5시간) — GPU 사용 불가', body: '순차 의존성으로 병렬화 불가 — SHA-NI CPU 필수' },
  { label: 'PC2: GPU 가속 (Poseidon 해시, Column Hash Tree) — pc2_cuda 2.5분', body: 'Neptune으로 Poseidon GPU 배치 → TreeC/TreeR 구축' },
  { label: 'C2: GPU 가속 (Groth16 MSM + NTT) — bellperson CUDA', body: 'Pippenger MSM + Cooley-Tukey NTT를 GPU 워프 병렬 처리' },
  { label: 'PoSt: GPU 가속 (WindowPoSt 30분 데드라인)', body: '48개 데드라인 × Groth16 — 30분 내 완료 필수' },
];

const COLORS = { CPU: '#f59e0b', GPU: '#6366f1' };

const PIPELINE = [
  { label: 'PC1 (SDR)',      hw: 'CPU' as const, time: '3-5h'  },
  { label: 'PC2 (Poseidon)', hw: 'GPU' as const, time: '2.5m'  },
  { label: 'C2 (Groth16)',   hw: 'GPU' as const, time: '20-30m' },
  { label: 'PoSt (Window)',  hw: 'GPU' as const, time: '< 30m'  },
];

export default function GPUPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 660 90" className="w-full max-w-xl">
          <defs>
            <marker id="gpu-arrow" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#888" />
            </marker>
          </defs>

          {/* Legend */}
          <rect x={0} y={0} width={10} height={10} rx={2} fill={COLORS.CPU} />
          <text x={14} y={9} fontSize={10} fill="currentColor">CPU</text>
          <rect x={42} y={0} width={10} height={10} rx={2} fill={COLORS.GPU} />
          <text x={56} y={9} fontSize={10} fill="currentColor">GPU</text>

          {PIPELINE.map((s, i) => {
            const x = i * 130;
            const active = i === step;
            const done = i < step;
            const color = COLORS[s.hw];
            const opacity = active ? 1 : done ? 0.45 : 0.2;

            return (
              <g key={s.label}>
                {i > 0 && (
                  <motion.line
                    x1={x - 8} y1={50} x2={x + 2} y2={50}
                    stroke={done || active ? color : '#666'}
                    strokeWidth={1.5}
                    markerEnd="url(#gpu-arrow)"
                    animate={{ opacity: done || active ? 0.8 : 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <motion.rect
                  x={x + 4} y={24} width={118} height={52} rx={8}
                  fill={color}
                  animate={{ opacity, scale: active ? 1 : 0.98 }}
                  transition={{ duration: 0.3 }}
                  style={{ transformOrigin: `${x + 63}px 50px` }}
                />
                <text
                  x={x + 63} y={46}
                  textAnchor="middle"
                  className="fill-white text-[10px] font-bold"
                  style={{ opacity: Math.max(opacity, 0.5) }}
                >
                  {s.label}
                </text>
                <text
                  x={x + 63} y={62}
                  textAnchor="middle"
                  fontSize={10} fill="white" opacity={0.6}
                  style={{ opacity: Math.max(opacity, 0.4) }}
                >
                  {s.hw} | {s.time}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
