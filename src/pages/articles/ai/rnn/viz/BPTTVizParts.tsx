import { motion } from 'framer-motion';
import { BWD_C } from './BPTTVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const vanishVals = [1, 0.7, 0.4, 0.15, 0.03];
const explodeVals = [1, 1.5, 2.5, 4, 7];
const vanishFactors = ['', '\u00d70.7', '\u00d70.57', '\u00d70.38', '\u00d70.2'];
const EXPLODE_C = '#f59e0b';

export function Step2() {
  return (
    <g>
      <text x={250} y={14} textAnchor="middle" fontSize={10} fill="#999">
        기울기 크기 변화 (시간 역방향)
      </text>
      {/* Vanishing side */}
      <text x={140} y={30} textAnchor="middle" fontSize={9} fill={BWD_C} fontWeight={600}>
        ||W_h|| &lt; 1 → 소실
      </text>
      {vanishVals.map((v, i) => {
        const bx = 30 + i * 52;
        return (
          <g key={`v${i}`}>
            <motion.rect x={bx} y={110 - v * 75} width={36} height={v * 75}
              rx={3} fill={BWD_C + '30'} stroke={BWD_C} strokeWidth={1}
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              transition={{ ...sp, delay: i * 0.1 }}
              style={{ transformOrigin: `${bx + 18}px 110px` }} />
            {/* Value on bar */}
            <motion.text x={bx + 18} y={108 - v * 75} textAnchor="middle"
              fontSize={9} fill={BWD_C} fontWeight={600}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.15 }}>
              {v.toFixed(2)}
            </motion.text>
            {/* Multiplication factor */}
            {i > 0 && (
              <motion.text x={bx + 18} y={122} textAnchor="middle"
                fontSize={7} fill={BWD_C} opacity={0.7}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ delay: i * 0.1 + 0.2 }}>
                {vanishFactors[i]}
              </motion.text>
            )}
            {/* Time label */}
            <text x={bx + 18} y={134} textAnchor="middle" fontSize={8} fill="#999">
              t-{i}
            </text>
          </g>
        );
      })}
      {/* Exploding side */}
      <text x={388} y={30} textAnchor="middle" fontSize={9} fill={EXPLODE_C} fontWeight={600}>
        ||W_h|| &gt; 1 → 폭발
      </text>
      {explodeVals.map((v, i) => {
        const h = Math.min(v * 12, 75);
        const bx = 290 + i * 42;
        return (
          <g key={`e${i}`}>
            <motion.rect x={bx} y={110 - h} width={30} height={h}
              rx={3} fill={EXPLODE_C + '30'} stroke={EXPLODE_C} strokeWidth={1}
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              transition={{ ...sp, delay: i * 0.1 }}
              style={{ transformOrigin: `${bx + 15}px 110px` }} />
            <motion.text x={bx + 15} y={108 - h} textAnchor="middle"
              fontSize={9} fill={EXPLODE_C} fontWeight={600}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.15 }}>
              {v.toFixed(1)}
            </motion.text>
            <text x={bx + 15} y={134} textAnchor="middle" fontSize={8} fill="#999">
              t-{i}
            </text>
          </g>
        );
      })}
      {/* Summary */}
      <motion.text x={250} y={155} textAnchor="middle" fontSize={9} fill={BWD_C}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        5단계 만에 기울기 3% → 20단계면 사실상 0
      </motion.text>
    </g>
  );
}

