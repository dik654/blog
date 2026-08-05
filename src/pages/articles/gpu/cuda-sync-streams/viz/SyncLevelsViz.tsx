import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'Thread-level — __syncwarp() (워프 32 스레드)',
    body: '가장 경량. 워프 안에서만 동기화. shuffle 명령어와 짝지어 사용.',
  },
  {
    label: 'Block-level — __syncthreads() (블록 전체)',
    body: '공유 메모리 일관성에 필수. 블록 내 모든 스레드가 도달할 때까지 대기.',
  },
  {
    label: 'Device-level — cudaDeviceSynchronize() (디바이스 전체)',
    body: '호스트가 GPU의 모든 작업을 기다린다. 가장 무거움. 비동기 실행을 막음.',
  },
  {
    label: 'Stream-level — cudaStreamSynchronize / WaitEvent',
    body: '특정 스트림만 선택적으로 대기. 비동기 실행을 유지하면서 의존성 표현.',
  },
];

const LEVELS = [
  { label: 'Thread', sub: '__syncwarp()', color: '#10b981', size: 32, scope: '워프 내 32 스레드' },
  { label: 'Block', sub: '__syncthreads()', color: '#6366f1', size: 96, scope: '블록 내 전체 스레드' },
  { label: 'Device', sub: 'cudaDeviceSync()', color: '#f59e0b', size: 160, scope: 'GPU 전체 작업' },
  { label: 'Stream', sub: 'cudaStreamSync()', color: '#a855f7', size: 128, scope: '특정 스트림만' },
];

export default function SyncLevelsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            CUDA 동기화 4가지 수준
          </text>

          {/* Level boxes */}
          {LEVELS.map((l, i) => {
            const x = 30 + i * 110;
            const active = i === step;
            return (
              <motion.g key={l.label}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: active ? 1 : 0.35 }}
                transition={{ duration: 0.3 }}>
                <ModuleBox x={x} y={50} w={100} h={50} label={l.label} sub={l.sub} color={l.color} />
                {/* scope visualization: nested circles */}
                <circle cx={x + 50} cy={150} r={l.size / 4} fill={l.color}
                  opacity={active ? 0.3 : 0.12} />
                <text x={x + 50} y={154} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={l.color} opacity={active ? 1 : 0.5}>
                  {l.label}
                </text>
              </motion.g>
            );
          })}

          {/* Cost/scope axis */}
          <line x1={20} y1={210} x2={460} y2={210} stroke="#888" strokeWidth={0.6} />
          <text x={20} y={224} fontSize={9} fill="var(--muted-foreground)">경량 ←</text>
          <text x={460} y={224} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">→ 무거움</text>

          {/* Step-specific scope description */}
          <motion.g key={`scope-${step}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <text x={240} y={188} textAnchor="middle" fontSize={9}
              fontWeight={600} fill={LEVELS[step].color}>
              범위: {LEVELS[step].scope}
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
