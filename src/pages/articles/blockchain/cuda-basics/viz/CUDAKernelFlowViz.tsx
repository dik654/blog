import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'host', label: 'Host (CPU)', color: '#6366f1', x: 15 },
  { id: 'transfer', label: 'cudaMemcpy', color: '#8b5cf6', x: 75 },
  { id: 'grid', label: 'Grid', color: '#10b981', x: 135 },
  { id: 'block', label: 'Block', color: '#f59e0b', x: 195 },
  { id: 'thread', label: 'Warp', color: '#ec4899', x: 255 },
  { id: 'result', label: '결과 반환', color: '#ef4444', x: 315 },
];

const STEPS = [
  { label: 'Host 데이터 준비', body: 'CPU에서 데이터를 준비하고 cudaMalloc으로 GPU 메모리를 할당합니다.' },
  { label: 'H→D 메모리 전송', body: 'cudaMemcpy로 호스트 메모리에서 디바이스(GPU) 메모리로 데이터를 복사합니다.' },
  { label: 'Grid 커널 실행', body: '<<<gridDim, blockDim>>> 구문으로 커널을 실행합니다. Grid는 전체 작업 단위입니다.' },
  { label: 'Block 분배', body: 'Grid가 여러 Block으로 분할되어 SM(Streaming Multiprocessor)에 배정됩니다.' },
  { label: 'Thread/Warp 연산', body: '32개 스레드가 하나의 Warp로 묶여 SIMT 방식으로 동일 명령을 병렬 실행합니다.' },
  { label: '결과 반환 (D→H)', body: 'cudaMemcpy로 GPU 결과를 CPU로 복사합니다. 블록체인에서는 해시/증명 결과입니다.' },
];

const EDGES = ['데이터 할당', '<<<grid,block>>>', '블록 분배', 'SIMT 실행', 'cudaMemcpy'];

export default function CUDAKernelFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 530 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const show = i <= step;
            const active = i === step;
            return (
              <g key={n.id}>
                {/* edge */}
                {i > 0 && i <= step && (
                  <motion.line x1={NODES[i - 1].x + 50} y1={42} x2={n.x} y2={42}
                    stroke={n.color} strokeWidth={i === step ? 1.8 : 1}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4 }} />
                )}
                {i > 0 && i <= step && (
                  <text x={(NODES[i - 1].x + 50 + n.x) / 2} y={34} textAnchor="middle"
                    fontSize={10} fill="var(--muted-foreground)">{EDGES[i - 1]}</text>
                )}
                {/* node box */}
                <motion.rect x={n.x} y={28} width={50} height={28} rx={5}
                  animate={{ fill: `${n.color}${active ? '25' : show ? '12' : '06'}`,
                    stroke: n.color, strokeWidth: active ? 2 : show ? 1 : 0.5,
                    opacity: show ? 1 : 0.15 }}
                  transition={{ duration: 0.3 }} />
                <text x={n.x + 25} y={46} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={n.color} opacity={show ? 1 : 0.2}>{n.label}</text>
                {/* glow */}
                {active && (
                  <motion.rect x={n.x - 2} y={26} width={54} height={32} rx={7}
                    fill="none" stroke={n.color} strokeWidth={1.5}
                    animate={{ opacity: [0.6, 0.15, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.5 }} />
                )}
              </g>
            );
          })}
          {/* GPU zone label */}
          <rect x={130} y={68} width={190} height={18} rx={3} fill="#10b98110" stroke="#10b98140" strokeWidth={0.5} />
          <text x={225} y={80} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={500}>GPU Device</text>
        </svg>
      )}
    </StepViz>
  );
}
