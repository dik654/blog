import { motion } from 'framer-motion';
import { SHOT_BARS } from './FewShotData';

const BAR_X = 100, BAR_W = 300, BAR_H = 28;

export function BarChart() {
  return (
    <>
      {SHOT_BARS.map((bar, i) => {
        const y = 20 + i * 46;
        const fillW = (bar.value / 100) * BAR_W;
        return (
          <motion.g key={bar.label}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.12 }}>
            <text x={BAR_X - 10} y={y + 18} textAnchor="end"
              fontSize={10} fontWeight={600} fill={bar.color}>{bar.label}</text>
            <rect x={BAR_X} y={y} width={BAR_W} height={BAR_H} rx={4}
              fill="var(--muted)" opacity={0.15} />
            <motion.rect x={BAR_X} y={y} height={BAR_H} rx={4}
              fill={bar.color} initial={{ width: 0 }}
              animate={{ width: fillW }}
              transition={{ duration: 0.6, delay: i * 0.12 }} opacity={0.7} />
            <motion.text x={BAR_X + fillW + 8} y={y + 18}
              fontSize={10} fontWeight={700} fill={bar.color}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.12 + 0.4 }}>{bar.value}%</motion.text>
          </motion.g>
        );
      })}
    </>
  );
}

export function GoodBadCompare() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={30} y={25} width={185} height={160} rx={6}
        fill="#10b98110" stroke="#10b981" strokeWidth={1.5} />
      <text x={122} y={48} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="#10b981">Good Examples</text>
      {['긍정 + 부정 + 중립', '엣지케이스 포함', '명확한 라벨'].map((t, i) => (
        <text key={t} x={52} y={72 + i * 28} fontSize={9}
          fill="var(--foreground)">✅ {t}</text>
      ))}
      <rect x={245} y={25} width={185} height={160} rx={6}
        fill="#ef444410" stroke="#ef4444" strokeWidth={1.5} />
      <text x={337} y={48} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="#ef4444">Bad Examples</text>
      {['전부 같은 패턴', '엣지케이스 없음', '모호한 라벨'].map((t, i) => (
        <text key={t} x={267} y={72 + i * 28} fontSize={9}
          fill="var(--foreground)">❌ {t}</text>
      ))}
    </motion.g>
  );
}

export function RecencyBias({ cx }: { cx: number }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {['예시 1', '예시 2', '예시 3'].map((label, i) => {
        const x = 80 + i * 120;
        const isLast = i === 2;
        return (
          <motion.g key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.15 }}>
            <rect x={x} y={40} width={90} height={40} rx={5}
              fill={isLast ? '#f59e0b20' : '#6366f110'}
              stroke={isLast ? '#f59e0b' : '#6366f1'}
              strokeWidth={isLast ? 2 : 1} />
            <text x={x + 45} y={65} textAnchor="middle" fontSize={10}
              fontWeight={isLast ? 700 : 400}
              fill={isLast ? '#f59e0b' : '#6366f1'}>{label}</text>
            {i < 2 && <line x1={x + 90} y1={60} x2={x + 120} y2={60}
              stroke="var(--border)" strokeWidth={1} />}
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <text x={cx} y={110} textAnchor="middle" fontSize={9}
          fontWeight={600} fill="#f59e0b">↑ 마지막 예시의 영향력 최대</text>
        <rect x={cx - 80} y={130} width={160} height={30} rx={5}
          fill="#f59e0b15" stroke="#f59e0b" strokeWidth={1} />
        <text x={cx} y={150} textAnchor="middle" fontSize={9}
          fill="#f59e0b">Recency Bias (최신성 편향)</text>
      </motion.g>
    </motion.g>
  );
}
