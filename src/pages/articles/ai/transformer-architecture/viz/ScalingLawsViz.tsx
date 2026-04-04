import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const ITEMS = [
  { label: 'N (파라미터)', color: '#6366f1', exp: 'N^(-0.076)' },
  { label: 'D (데이터)', color: '#0ea5e9', exp: 'D^(-0.095)' },
  { label: 'C (연산량)', color: '#10b981', exp: 'C^(-0.050)' },
];

const STEPS = [
  { label: '스케일링 법칙' }, { label: '파라미터 스케일링' },
  { label: '데이터 스케일링' }, { label: 'Chinchilla 최적화' },
];
const BODY = [
  'L = N,D,C의 멱법칙', '10배 모델 → 예측 가능한 손실 감소',
  '데이터 지수가 더 큼 (D^-0.095)', 'N:D=1:20이 최적, GPT-3는 과대',
];

export default function ScalingLawsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* N, D, C boxes */}
          {ITEMS.map((it, i) => {
            const y = 10 + i * 40;
            const glow = step === 0 || step === i + 1;
            return (
              <motion.g key={i} animate={{ opacity: step === 3 && i === 2 ? 0.2 : 1 }}>
                <motion.rect x={10} y={y} width={80} height={30} rx={6}
                  animate={{ fill: `${it.color}${glow ? '25' : '10'}`, stroke: it.color, strokeWidth: glow ? 2 : 1 }} />
                <text x={50} y={y + 19} textAnchor="middle" fontSize={10} fontWeight={600} fill={it.color}>{it.label}</text>
                {step >= 0 && step <= 2 && (
                  <>
                    <motion.line x1={90} y1={y + 15} x2={155} y2={65}
                      stroke={it.color} strokeWidth={glow ? 1.5 : 0.7} strokeDasharray="4 3"
                      animate={{ opacity: glow ? 1 : 0.3 }} />
                    <text x={115} y={y + 10} fontSize={9} fill={it.color}>{it.exp}</text>
                  </>
                )}
              </motion.g>
            );
          })}
          {/* Loss box */}
          {step <= 2 && (
            <motion.g animate={{ opacity: 1 }}>
              <motion.rect x={155} y={45} width={70} height={34} rx={6}
                animate={{ fill: '#f59e0b18', stroke: '#f59e0b', strokeWidth: step === 0 ? 2.5 : 1.5 }} />
              <text x={190} y={67} textAnchor="middle" fontSize={11} fontWeight={600} fill="#f59e0b">L (손실)</text>
            </motion.g>
          )}
          {/* Chinchilla panel */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.rect x={130} y={15} width={230} height={100} rx={8}
                fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1.5} />
              <text x={245} y={35} textAnchor="middle" fontSize={11} fontWeight={600} fill="#8b5cf6">Chinchilla 최적</text>
              <text x={245} y={55} textAnchor="middle" fontSize={9} fill="var(--foreground)">N : D = 1 : 20</text>
              {[
                { m: 'GPT-3', r: '1:1.7', c: '#ef4444' },
                { m: 'LLaMA-2', r: '1:29', c: '#10b981' },
              ].map((row, ri) => (
                <text key={ri} x={245} y={75 + ri * 16} textAnchor="middle" fontSize={9} fill={row.c}>
                  {row.m}: {row.r}
                </text>
              ))}
              <motion.line x1={90} y1={25} x2={130} y2={40} stroke="#6366f1" strokeWidth={1} strokeDasharray="3 2" />
              <motion.line x1={90} y1={65} x2={130} y2={60} stroke="#0ea5e9" strokeWidth={1} strokeDasharray="3 2" />
            </motion.g>
          )}
          {/* inline body */}
          <motion.text x={390} y={65} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
