import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const STEPS = [
  { label: 'PC1: CPU 전용 (SHA-256, 3-5시간) — GPU 사용 불가', body: 'Stacked DRG의 순차적 의존성(깊이 강건 그래프)으로 인해 병렬화가 불가능합니다. SHA-NI 지원 CPU(AMD Zen+)가 필수적이며, 11개 레이어를 순차 인코딩합니다.' },
  { label: 'PC2: GPU 가속 (Poseidon 해시, Column Hash Tree) — pc2_cuda 2.5분', body: 'Neptune 라이브러리로 Poseidon 해시를 GPU에서 배치 처리합니다. TreeC(칼럼 커밋)와 TreeR(레플리카)을 Arity-8 Merkle Tree로 구축합니다.' },
  { label: 'C2: GPU 가속 (Groth16 MSM + NTT) — bellperson CUDA', body: 'bellperson이 sppark의 Pippenger CUDA MSM과 Cooley-Tukey NTT를 호출합니다. 수백만 개 스칼라의 Multi-Scalar Multiplication을 GPU 워프 단위로 병렬 처리합니다.' },
  { label: 'PoSt: GPU 가속 (WindowPoSt 30분 데드라인)', body: '24시간을 48개 데드라인으로 분할하여 각 데드라인마다 Groth16 증명을 생성합니다. 30분 이내 완료해야 하며 GPU 없이는 타임아웃 위험이 있습니다.' },
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
        <svg viewBox="0 0 520 90" className="w-full max-w-xl">
          <defs>
            <marker id="gpu-arrow" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#888" />
            </marker>
          </defs>

          {/* Legend */}
          <rect x={0} y={0} width={10} height={10} rx={2} fill={COLORS.CPU} />
          <text x={14} y={9} className="fill-current text-[8px]">CPU</text>
          <rect x={42} y={0} width={10} height={10} rx={2} fill={COLORS.GPU} />
          <text x={56} y={9} className="fill-current text-[8px]">GPU</text>

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
                    strokeWidth={2}
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
                  className="fill-white/70 text-[8px]"
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
