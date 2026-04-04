import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const TRAIN_LOSS = [1.8, 1.2, 0.8, 0.55, 0.38, 0.25, 0.18, 0.12];
const VAL_LOSS = [1.7, 1.15, 0.72, 0.55, 0.52, 0.55, 0.58, 0.65];
const EPOCHS_LABELS = [1, 5, 10, 15, 20, 25, 30, 35];

export default function RegEarlyStopping() {
  return (
    <motion.g initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} transition={sp}>
      {/* axes */}
      <line x1={60} y1={15} x2={60} y2={115}
        stroke="var(--border)" strokeWidth={0.8} />
      <line x1={60} y1={115} x2={430} y2={115}
        stroke="var(--border)" strokeWidth={0.8} />
      <text x={245} y={130} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">epoch</text>
      <text x={30} y={65} fontSize={8}
        fill="var(--muted-foreground)"
        transform="rotate(-90 30 65)">loss</text>

      {/* Y axis labels */}
      {[0, 0.5, 1.0, 1.5].map((v) => {
        const yy = 115 - (v / 2.0) * 95;
        return (
          <text key={v} x={55} y={yy + 3} textAnchor="end"
            fontSize={7} fill="var(--muted-foreground)">
            {v}
          </text>
        );
      })}

      {/* X axis labels */}
      {EPOCHS_LABELS.map((e, i) => (
        <text key={e} x={70 + i * 46} y={126} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          {e}
        </text>
      ))}

      {/* train loss line */}
      <polyline
        points={TRAIN_LOSS.map((v, i) =>
          `${70 + i * 46},${115 - (v / 2.0) * 95}`
        ).join(' ')}
        fill="none" stroke="#0ea5e9" strokeWidth={1.5} />
      {/* val loss line */}
      <polyline
        points={VAL_LOSS.map((v, i) =>
          `${70 + i * 46},${115 - (v / 2.0) * 95}`
        ).join(' ')}
        fill="none" stroke="#ef4444" strokeWidth={1.5} />

      {/* val loss data points with values */}
      {VAL_LOSS.map((v, i) => {
        const xx = 70 + i * 46;
        const yy = 115 - (v / 2.0) * 95;
        const rising = i >= 4;
        return (
          <g key={i}>
            <circle cx={xx} cy={yy}
              r={rising ? 3 : 2}
              fill={rising ? '#ef4444' : '#ef444460'}
              stroke={rising ? '#ef4444' : 'none'}
              strokeWidth={0.8} />
            {i >= 3 && (
              <text x={xx} y={yy - 6} textAnchor="middle"
                fontSize={7}
                fontWeight={rising ? 600 : 400}
                fill={rising ? '#ef4444' : '#ef444490'}>
                {v}
              </text>
            )}
          </g>
        );
      })}

      {/* stop line at epoch 20 */}
      <line x1={70 + 3 * 46} y1={12}
        x2={70 + 3 * 46} y2={115}
        stroke="#10b981" strokeWidth={1}
        strokeDasharray="4 2" />
      <text x={70 + 3 * 46} y={10} textAnchor="middle"
        fontSize={8} fill="#10b981" fontWeight={600}>
        best (0.52)
      </text>

      {/* legend */}
      <line x1={360} y1={20} x2={380} y2={20}
        stroke="#0ea5e9" strokeWidth={1.5} />
      <text x={385} y={23} fontSize={8} fill="#0ea5e9">train</text>
      <line x1={360} y1={35} x2={380} y2={35}
        stroke="#ef4444" strokeWidth={1.5} />
      <text x={385} y={38} fontSize={8} fill="#ef4444">val</text>

      {/* annotation */}
      <rect x={340} y={50} width={110} height={40} rx={4}
        fill="#ef444410" stroke="#ef4444" strokeWidth={0.6} />
      <text x={395} y={64} textAnchor="middle" fontSize={7}
        fill="#ef4444">val 3회 연속 증가</text>
      <text x={395} y={76} textAnchor="middle" fontSize={7}
        fill="#ef4444">0.55→0.58→0.65</text>
      <text x={395} y={86} textAnchor="middle" fontSize={8}
        fontWeight={600} fill="#10b981">
        epoch 20에서 중단!
      </text>
    </motion.g>
  );
}
