import { motion } from 'framer-motion';
import { gradients, COLORS } from '../VanishingGradientData';

const MAX_W = 220;
const BASE_X = 100;

function barColor(i: number) {
  return [COLORS.high, COLORS.mid, COLORS.low][i];
}

export default function GradientBarViz({ step }: { step: number }) {
  const visible = step >= 1 ? step : 0;

  return (
    <svg viewBox="0 0 400 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={200} y={14} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">각 층의 기울기 크기 (|dL/dw|)</text>

      {gradients.map((g, i) => {
        const y = 32 + i * 36;
        const show = visible >= i + 1;
        const w = (g.absVal / 0.12) * MAX_W;
        const c = barColor(i);
        return (
          <g key={g.layer}>
            <text x={BASE_X - 6} y={y + 15} textAnchor="end"
              fontSize={9} fill={c} fontWeight={500}>{g.layer}</text>
            <motion.rect x={BASE_X} y={y} rx={4}
              height={22} fill={c} fillOpacity={0.3}
              stroke={c} strokeWidth={1}
              initial={{ width: 0 }}
              animate={{ width: show ? Math.max(w, 3) : 0 }}
              transition={{ duration: 0.5, delay: 0.1 }} />
            {show && (
              <motion.text x={BASE_X + w + 6} y={y + 15}
                fontSize={9} fill={c} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}>
                {g.absVal}
              </motion.text>
            )}
          </g>
        );
      })}

      {/* 감소 비율 — 값 텍스트 뒤에 표시 */}
      {step >= 2 && (
        <motion.text x={BASE_X + 80} y={32 + 1 * 36 + 15} fontSize={8}
          fill={COLORS.mid} initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
          (3층 대비 37× 감소)
        </motion.text>
      )}
      {step >= 3 && (
        <motion.text x={BASE_X + 90} y={32 + 2 * 36 + 15} fontSize={8}
          fill={COLORS.low} initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
          (1,500× 감소 — 학습 불가)
        </motion.text>
      )}
    </svg>
  );
}
