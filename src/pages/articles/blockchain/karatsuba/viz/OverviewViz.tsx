import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STEPS = [
  {
    label: '문제: (a+bu)(c+du)를 곱하려면 곱셈이 몇 번 필요한가?',
    body: '확장체에서 두 원소를 곱하려면 각 계수 간 교차 곱이 필요하다.\n곱셈 횟수를 줄이면 페어링 전체가 빨라진다.',
  },
  {
    label: 'Naive = 4번, Karatsuba = 3번. 25% 절감이 재귀적으로 누적',
    body: '한 층에서 25%를 절감하면 3층 타워에서는 144→54로 줄어든다.\nFp12 곱셈 한 번에 2.7배 빨라지고, 이것이 254번 반복된다.',
  },
];

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 20 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Question mark / expression */}
          <motion.text x={260} y={80} textAnchor="middle" fontSize={14}
            fontWeight={700} fill="hsl(var(--foreground))"
            animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={sp}>
            (a + bu)(c + du) = ?
          </motion.text>

          {/* Naive box */}
          <motion.g animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }} transition={sp}>
            <rect x={60} y={120} width={160} height={70} rx={8}
              fill="hsl(var(--muted) / 0.15)" stroke="hsl(var(--border))" strokeWidth={1.2} />
            <text x={140} y={145} textAnchor="middle" fontSize={12}
              fontWeight={600} fill="hsl(var(--foreground))">Naive</text>
            <text x={140} y={168} textAnchor="middle" fontSize={11}
              fill="hsl(var(--muted-foreground))">4 곱셈 + 2 덧셈</text>
          </motion.g>

          {/* Karatsuba box */}
          <motion.g
            animate={{ opacity: step >= 1 ? 1 : 0.3, y: 0 }}
            initial={{ opacity: 0, y: 10 }} transition={{ ...sp, delay: 0.15 }}>
            <rect x={300} y={120} width={160} height={70} rx={8}
              fill={step >= 1 ? 'hsl(142 71% 45% / 0.12)' : 'hsl(var(--muted) / 0.15)'}
              stroke={step >= 1 ? 'hsl(142 71% 45%)' : 'hsl(var(--border))'} strokeWidth={1.2} />
            <text x={380} y={145} textAnchor="middle" fontSize={12}
              fontWeight={600} fill="hsl(var(--foreground))">Karatsuba</text>
            <text x={380} y={168} textAnchor="middle" fontSize={11}
              fill={step >= 1 ? 'hsl(142 71% 45%)' : 'hsl(var(--muted-foreground))'}>
              3 곱셈 + 5 덧셈
            </text>
          </motion.g>

          {/* Arrow between */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
              <line x1={224} y1={155} x2={296} y2={155}
                stroke="hsl(142 71% 45%)" strokeWidth={1.5} strokeDasharray="4 3" />
              <text x={260} y={148} textAnchor="middle" fontSize={10}
                fontWeight={600} fill="hsl(142 71% 45%)">-25%</text>
            </motion.g>
          )}

          {/* Savings callout */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: 0.35 }}>
              <rect x={140} y={220} width={240} height={40} rx={6}
                fill="hsl(142 71% 45% / 0.08)" stroke="hsl(142 71% 45% / 0.4)" strokeWidth={1} />
              <text x={260} y={244} textAnchor="middle" fontSize={11}
                fontWeight={600} fill="hsl(142 71% 45%)">
                3층 타워 누적: 144 → 54 Fp곱 (2.7x)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
