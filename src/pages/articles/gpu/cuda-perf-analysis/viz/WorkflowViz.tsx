import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'Step 1: Nsight Systems로 전체 타임라인',
    body: 'CPU-GPU 전송, 커널 간 갭, 스트림 활용을 한눈에. 어디서 시간이 새는지 식별.',
  },
  {
    label: 'Step 2: 실행 시간 기준 병목 커널 Top 3',
    body: '전체 시간의 80%를 차지하는 커널을 우선 공략. 작은 커널 최적화는 영향 미미.',
  },
  {
    label: 'Step 3: Nsight Compute로 커널 상세 분석',
    body: 'SOL에서 compute/memory bound 판별. 점유율, coalescing, 뱅크 충돌 메트릭 확인.',
  },
  {
    label: 'Step 4: 한 번에 한 변경 → 전후 메트릭 비교',
    body: '여러 변경을 묶으면 어떤 최적화가 효과적인지 알 수 없다. 한 번에 하나씩, 정량 비교.',
  },
];

const STAGES = [
  { label: 'nsys', sub: '타임라인', color: '#6366f1' },
  { label: 'Top 3', sub: '병목 선별', color: '#10b981' },
  { label: 'ncu', sub: '커널 분석', color: '#f59e0b' },
  { label: 'A/B', sub: '변경 ↔ 비교', color: '#a855f7' },
];

export default function WorkflowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          <text x={240} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            프로파일링 워크플로우 — 4단계 순환
          </text>

          {/* Pipeline of stages */}
          {STAGES.map((s, i) => {
            const x = 30 + i * 110;
            const active = i === step;
            const done = i < step;
            return (
              <g key={s.label}>
                {i > 0 && (
                  <motion.line x1={x - 16} y1={84} x2={x - 4} y2={84}
                    stroke="#888" strokeWidth={1.2}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: done || active ? 0.7 : 0.2 }} />
                )}
                <motion.g
                  initial={{ opacity: 0.3, y: 4 }}
                  animate={{ opacity: active ? 1 : done ? 0.55 : 0.3, y: 0 }}
                  transition={{ duration: 0.3 }}>
                  <ModuleBox x={x} y={60} w={90} h={50} label={s.label} sub={s.sub} color={s.color} />
                  <text x={x + 45} y={130} textAnchor="middle" fontSize={9}
                    fontWeight={700} fill={s.color}>Step {i + 1}</text>
                </motion.g>
              </g>
            );
          })}

          {/* loop arrow */}
          <motion.path d="M 425 100 Q 460 140 240 165 Q 30 165 55 130"
            stroke="#888" strokeWidth={1} strokeDasharray="4 3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: step === 3 ? 1 : 0.2 }}
            transition={{ duration: 0.6 }} />
          <text x={240} y={180} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)" opacity={step === 3 ? 1 : 0.4}>
            반복: 한 변경 → 측정 → 다음 변경
          </text>

          {/* Step-specific detail */}
          <motion.g key={`detail-${step}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            {step === 0 && (
              <DataBox x={120} y={195} w={240} h={32} label="nsys profile --stats=true ./app" color="#6366f1" outlined />
            )}
            {step === 1 && (
              <DataBox x={80} y={195} w={320} h={32} label="가장 느린 3개 커널이 전체의 80%를 차지" color="#10b981" outlined />
            )}
            {step === 2 && (
              <DataBox x={80} y={195} w={320} h={32} label="ncu --set full --kernel-name myKernel ./app" color="#f59e0b" outlined />
            )}
            {step === 3 && (
              <DataBox x={100} y={195} w={280} h={32} label="변경 1개씩 → before/after 메트릭" color="#a855f7" outlined />
            )}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
