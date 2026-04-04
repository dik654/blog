import { motion } from 'framer-motion';
import { RNN_C, LSTM_C } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const rnnGrad = [1.00, 0.45, 0.20, 0.09, 0.04, 0.02];
const lstmGrad = [1.00, 0.92, 0.85, 0.78, 0.72, 0.66];
const barW = 30;
const maxH = 65;

function GradRow({ vals, color, label, sub, baseY, delayOff }: {
  vals: number[]; color: string; label: string; sub: string;
  baseY: number; delayOff: number;
}) {
  return (
    <g>
      <text x={18} y={baseY - 10} fontSize={9} fill={color} fontWeight={600}>{label}</text>
      <text x={18} y={baseY + 1} fontSize={8} fill={color}>{sub}</text>
      {vals.map((v, i) => {
        const bx = 55 + i * 78;
        const h = v * maxH;
        return (
          <motion.g key={i} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.08 + delayOff }}>
            <rect x={bx} y={baseY + 15 - maxH} width={barW} height={maxH} rx={3}
              fill="#80808008" stroke="#55555530" strokeWidth={0.5} />
            <motion.rect x={bx} y={baseY + 15 - h} width={barW} height={h} rx={3}
              fill={color + '25'} stroke={color} strokeWidth={1}
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              transition={{ ...sp, delay: i * 0.08 + delayOff }}
              style={{ transformOrigin: `${bx + barW / 2}px ${baseY + 15}px` }} />
            <text x={bx + barW / 2} y={baseY + 13 - h} textAnchor="middle"
              fontSize={9} fill={color} fontWeight={600}>{v.toFixed(2)}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export function Step3() {
  return (
    <g>
      <text x={260} y={16} textAnchor="middle" fontSize={10} fill="#999">
        t-0 → t-5 기울기 크기 비교 (동일 시퀀스)
      </text>
      <GradRow vals={rnnGrad} color={RNN_C} label="RNN" sub="곱셈만"
        baseY={55} delayOff={0} />
      <GradRow vals={lstmGrad} color={LSTM_C} label="LSTM" sub="덧셈 경로"
        baseY={120} delayOff={0.4} />
      {[0, 1, 2, 3, 4, 5].map(i => (
        <text key={i} x={55 + i * 78 + barW / 2} y={160} textAnchor="middle"
          fontSize={8} fill="#999">t-{i}</text>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}>
        <text x={260} y={178} textAnchor="middle" fontSize={9} fill={RNN_C}>
          RNN t-5: 0.02 (98% 소실)
        </text>
        <text x={260} y={192} textAnchor="middle" fontSize={9} fill={LSTM_C}>
          LSTM t-5: 0.66 (34% 감소) — 덧셈 경로가 기울기 보존
        </text>
      </motion.g>
    </g>
  );
}
