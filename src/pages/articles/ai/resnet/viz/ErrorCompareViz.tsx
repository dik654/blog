import { motion } from 'framer-motion';
import { errorData } from '../OverviewData';

const BAR_W = 36;
const MAX_H = 100;
const BASE_Y = 140;

export default function ErrorCompareViz({ step }: { step: number }) {
  const showValues = step >= 1;
  return (
    <svg viewBox="0 0 380 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={190} y={16} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">CIFAR-10 에러율 (%)</text>

      {errorData.map((d, di) => {
        const cx = 100 + di * 180;
        const trainHeight = (d.train / 16) * MAX_H;
        const testHeight = (d.test / 16) * MAX_H;
        return (
          <g key={d.label}>
            {/* train bar */}
            <motion.rect x={cx - BAR_W - 4} y={BASE_Y - trainHeight}
              width={BAR_W} rx={4}
              height={trainHeight}
              fill={d.color} fillOpacity={0.45} stroke={d.color} strokeWidth={1}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{
                scaleY: 1,
                opacity: showValues ? 1 : 0.72,
              }}
              style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
              transition={{ duration: 0.5, delay: di * 0.15 }} />
            {showValues && (
              <motion.text x={cx - BAR_W / 2 - 4}
                y={BASE_Y - (d.train / 16) * MAX_H - 4}
                textAnchor="middle" fontSize={9} fill={d.color} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + di * 0.15 }}>
                {d.train}%
              </motion.text>
            )}

            {/* test bar */}
            <motion.rect x={cx + 4} y={BASE_Y - testHeight}
              width={BAR_W} rx={4}
              height={testHeight}
              fill={d.color} fillOpacity={0.78} stroke={d.color} strokeWidth={1}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{
                scaleY: 1,
                opacity: showValues ? 1 : 0.72,
              }}
              style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
              transition={{ duration: 0.5, delay: di * 0.15 + 0.1 }} />
            {showValues && (
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
