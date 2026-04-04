import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const ITEMS = [
  { label: 'NTT', desc: 'O(n log n) 다항식 곱셈', color: '#6366f1' },
  { label: '배치 역원', desc: 'Montgomery Trick', color: '#8b5cf6' },
  { label: '코셋 FFT', desc: 'vanishing poly 소거', color: '#10b981' },
  { label: '지연 머클', desc: '필요한 경로만 계산', color: '#f59e0b' },
  { label: 'SIMD 해싱', desc: '벡터화 Blake2b', color: '#ec4899' },
];

const BODIES = [
  'libiop의 핵심 최적화 기법 5가지를 살펴봅니다.',
  '유한체 FFT로 O(n log n) 다항식 곱셈을 수행합니다.',
  'Montgomery Trick으로 n개 역원을 곱셈 3(n-1)회로 계산합니다.',
  '코셋 위 평가로 vanishing polynomial 분모를 소거합니다.',
  '지연 머클 트리와 SIMD 해싱으로 메모리와 CPU를 최적화합니다.',
];
const STEPS = [
  { label: '최적화 파이프라인' },
  { label: 'NTT' },
  { label: '배치 역원' },
  { label: '코셋 FFT' },
  { label: '지연 머클 & SIMD' },
];

export default function OptPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="max-w-2xl">
        <div className="flex flex-wrap gap-2">
          {ITEMS.map((item, i) => {
            const active = step === 0 || (step === 1 && i === 0) ||
              (step === 2 && i === 1) || (step === 3 && i === 2) ||
              (step === 4 && (i === 3 || i === 4));
            return (
              <motion.div key={item.label}
                className="rounded-lg border px-3 py-2 text-center"
                animate={{
                  opacity: active ? 1 : 0.2,
                  borderColor: active ? item.color : 'var(--border)',
                  scale: active ? 1 : 0.95,
                }} transition={sp}>
                <div className="text-[11px] font-bold" style={{ color: item.color }}>
                  {item.label}
                </div>
                <div className="text-[9px] text-muted-foreground">{item.desc}</div>
              </motion.div>
            );
          })}
        </div>
        <motion.p className="text-[11px] mt-2 text-muted-foreground/80"
          initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>
          {BODIES[step]}
        </motion.p>
        </div>
      )}
    </StepViz>
  );
}
