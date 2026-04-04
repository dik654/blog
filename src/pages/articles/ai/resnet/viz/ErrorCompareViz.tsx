import { motion } from 'framer-motion';
import { errorData } from '../OverviewData';

const BAR_W = 36;
const MAX_H = 100;
const BASE_Y = 140;

export default function ErrorCompareViz({ step }: { step: number }) {
  const showAll = step >= 1;
  return (
    <svg viewBox="0 0 380 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={190} y={16} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">CIFAR-10 에러율 (%)</text>

      {errorData.map((d, di) => {
        const cx = 100 + di * 180;
        return (
          <g key={d.label}>
            {/* train bar */}
            <motion.rect x={cx - BAR_W - 4} y={BASE_Y}
              width={BAR_W} rx={4}
              fill={d.color} fillOpacity={0.25} stroke={d.color} strokeWidth={1}
              initial={{ height: 0, y: BASE_Y }}
              animate={showAll
                ? { height: (d.train / 16) * MAX_H, y: BASE_Y - (d.train / 16) * MAX_H }
                : { height: 0, y: BASE_Y }}
              transition={{ duration: 0.5, delay: di * 0.15 }} />
            {showAll && (
              <motion.text x={cx - BAR_W / 2 - 4}
                y={BASE_Y - (d.train / 16) * MAX_H - 4}
                textAnchor="middle" fontSize={9} fill={d.color} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + di * 0.15 }}>
                {d.train}%
              </motion.text>
            )}

            {/* test bar */}
            <motion.rect x={cx + 4} y={BASE_Y}
              width={BAR_W} rx={4}
              fill={d.color} fillOpacity={0.6} stroke={d.color} strokeWidth={1}
              initial={{ height: 0, y: BASE_Y }}
              animate={showAll
                ? { height: (d.test / 16) * MAX_H, y: BASE_Y - (d.test / 16) * MAX_H }
                : { height: 0, y: BASE_Y }}
              transition={{ duration: 0.5, delay: di * 0.15 + 0.1 }} />
            {showAll && (
              <motion.text x={cx + BAR_W / 2 + 4}
                y={BASE_Y - (d.test / 16) * MAX_H - 4}
                textAnchor="middle" fontSize={9} fill={d.color} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + di * 0.15 }}>
                {d.test}%
              </motion.text>
            )}

            <text x={cx} y={BASE_Y + 14} textAnchor="middle"
              fontSize={9} fill={d.color} fontWeight={500}>{d.label}</text>
          </g>
        );
      })}

      {/* legend */}
      <rect x={140} y={162} width={10} height={8} rx={2} fill="#888" fillOpacity={0.25} />
      <text x={154} y={170} fontSize={9} fill="var(--muted-foreground)">train</text>
      <rect x={190} y={162} width={10} height={8} rx={2} fill="#888" fillOpacity={0.6} />
      <text x={204} y={170} fontSize={9} fill="var(--muted-foreground)">test</text>
    </svg>
  );
}
