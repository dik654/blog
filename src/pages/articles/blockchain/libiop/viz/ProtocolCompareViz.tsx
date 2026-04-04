import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const ROWS = [
  { label: 'Ligero', proof: 'O(sqrt N)', verify: 'O(sqrt N)', rounds: '2', color: '#8b5cf6' },
  { label: 'Aurora', proof: 'O(log^2 N)', verify: 'O(log N)', rounds: 'O(log N)', color: '#3b82f6' },
  { label: 'Fractal', proof: 'O(log^2 N)', verify: 'O(log N)', rounds: 'O(log N)', color: '#10b981' },
];

const BODIES = [
  'libiop의 세 프로토콜: Ligero, Aurora, Fractal의 복잡도를 비교합니다.',
  '직접 LDT로 O(sqrt N) 증명. 구현이 단순하고 중간 규모에 적합합니다.',
  'FRI 기반 O(log^2 N) 증명. 대규모 계산에서 Ligero보다 우수합니다.',
  '홀로그래픽 IOP로 전처리 지원. 검증 시간 O(log N)을 달성합니다.',
];
const STEPS = [
  { label: '프로토콜 비교' },
  { label: 'Ligero' },
  { label: 'Aurora' },
  { label: 'Fractal' },
];

export default function ProtocolCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="max-w-2xl">
        <div className="grid grid-cols-4 gap-1 text-[10px]">
          <div className="font-bold text-muted-foreground">프로토콜</div>
          <div className="font-bold text-muted-foreground">증명 크기</div>
          <div className="font-bold text-muted-foreground">검증 시간</div>
          <div className="font-bold text-muted-foreground">라운드</div>
          {ROWS.map((r, i) => {
            const active = step === 0 || step === i + 1;
            return [
              <motion.div key={`l${i}`} animate={{ opacity: active ? 1 : 0.2 }}
                transition={sp} className="font-semibold" style={{ color: r.color }}>
                {r.label}
              </motion.div>,
              <motion.div key={`p${i}`} animate={{ opacity: active ? 1 : 0.2 }}
                transition={sp}>{r.proof}</motion.div>,
              <motion.div key={`v${i}`} animate={{ opacity: active ? 1 : 0.2 }}
                transition={sp}>{r.verify}</motion.div>,
              <motion.div key={`r${i}`} animate={{ opacity: active ? 1 : 0.2 }}
                transition={sp}>{r.rounds}</motion.div>,
            ];
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
