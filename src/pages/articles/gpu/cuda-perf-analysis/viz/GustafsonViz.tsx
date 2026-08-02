import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: '구스타프슨: 문제 크기를 고정하지 않는다',
    body: '프로세서가 늘면 같은 시간에 더 큰 문제를 푼다. Scaled Speedup = N - (1-P)(N-1)',
  },
  {
    label: '암달 vs 구스타프슨: P=0.95, N=1000 비교',
    body: '암달 19.6x vs 구스타프슨 950x. 가정의 차이가 결론을 완전히 갈라놓는다.',
  },
  {
    label: '판단 기준: 작은 문제 vs 큰 문제',
    body: '작은 문제 빨리 → 암달 (직렬 최적화). 큰 문제 같은 시간 → 구스타프슨 (코어 증설).',
  },
];

export default function GustafsonViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          {/* Step 0: 그림 — fixed problem (Amdahl) vs scaled problem (Gustafson) */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                같은 시간 안에 푸는 문제 크기
              </text>

              {/* N=1: 작은 박스 */}
              <text x={70} y={60} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">N=1</text>
              <rect x={50} y={70} width={40} height={40} rx={4} fill="#6366f1" opacity={0.3} />
              <text x={70} y={94} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">1x</text>

              {/* N=10: 더 큰 박스 */}
              <text x={170} y={60} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">N=10</text>
              <motion.rect x={130} y={50} width={80} height={80} rx={4} fill="#10b981" opacity={0.3}
                initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                transition={{ duration: 0.5 }} style={{ originX: '170px', originY: '90px' }} />
              <text x={170} y={94} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">~9.6x</text>

              {/* N=100: 매우 큰 박스 */}
              <text x={300} y={60} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">N=100</text>
              <motion.rect x={250} y={30} width={100} height={100} rx={4} fill="#f59e0b" opacity={0.3}
                initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }} style={{ originX: '300px', originY: '80px' }} />
              <text x={300} y={84} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">~95x</text>

              <text x={240} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Scaled Speedup = N - (1-P)(N-1)
              </text>
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                같은 시간에 데이터셋이 N배가 된다
              </text>
            </motion.g>
          )}

          {/* Step 1: 비교 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                P = 0.95, N = 1000 — 같은 조건 다른 결론
              </text>

              <ModuleBox x={60} y={60} w={170} h={50} label="암달의 법칙" sub="문제 크기 고정" color="#ef4444" />
              <text x={145} y={140} textAnchor="middle" fontSize={28} fontWeight={700} fill="#ef4444">
                19.6x
              </text>
              <text x={145} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                S = 1 / (0.05 + 0.00095)
              </text>
              <text x={145} y={174} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                직렬 구간이 천장
              </text>

              <ModuleBox x={250} y={60} w={170} h={50} label="구스타프슨의 법칙" sub="문제 크기 비례 확장" color="#10b981" />
              <text x={335} y={140} textAnchor="middle" fontSize={28} fontWeight={700} fill="#10b981">
                950x
              </text>
              <text x={335} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                S = 1000 - 0.05 × 999
              </text>
              <text x={335} y={174} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                코어 수에 거의 비례
              </text>

              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ~50배 차이는 가정의 차이에서 온다
              </text>
            </motion.g>
          )}

          {/* Step 2: 판단 기준 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <text x={240} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                실무 판단 기준
              </text>

              <DataBox x={60} y={60} w={160} h={36} label="작은 문제 빠르게" sub="암달 지배" color="#ef4444" outlined />
              <DataBox x={60} y={108} w={160} h={36} label="직렬 구간 최소화 필수" sub="커널 퓨전, async copy" color="#ef4444" outlined />

              <DataBox x={260} y={60} w={160} h={36} label="큰 문제 같은 시간에" sub="구스타프슨 적용" color="#10b981" outlined />
              <DataBox x={260} y={108} w={160} h={36} label="GPU 코어 증설 유효" sub="멀티 GPU 확장" color="#10b981" outlined />

              <DataBox x={140} y={170} w={200} h={36} label="GPU 커널: 문제 크기 가변 시 선형 확장" color="#6366f1" outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
