import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const TRAIN_LOSS = [1.8, 1.2, 0.8, 0.55, 0.38, 0.25, 0.18, 0.12];
const VAL_LOSS = [1.7, 1.15, 0.72, 0.55, 0.52, 0.55, 0.58, 0.65];
const EPOCHS_LABELS = [1, 5, 10, 15, 20, 25, 30, 35];

export default function RegEarlyStopping() {
  return (
    <motion.g initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} transition={sp}>
      {/* chart area: compact left side */}
      {/* axes */}
      <line x1={50} y1={15} x2={50} y2={110}
        stroke="var(--border)" strokeWidth={0.8} />
      <line x1={50} y1={110} x2={310} y2={110}
        stroke="var(--border)" strokeWidth={0.8} />
      <text x={180} y={125} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">epoch</text>
      <text x={22} y={62} fontSize={8}
        fill="var(--muted-foreground)"
        transform="rotate(-90 22 62)">loss</text>

      {/* Y axis labels */}
      {[0, 0.5, 1.0, 1.5].map((v) => {
        const yy = 110 - (v / 2.0) * 90;
        return (
          <text key={v} x={46} y={yy + 3} textAnchor="end"
            fontSize={7} fill="var(--muted-foreground)">
            {v}
          </text>
        );
      })}

      {/* X axis labels */}
      {EPOCHS_LABELS.map((e, i) => (
        <text key={e} x={58 + i * 34} y={122} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          {e}
        </text>
      ))}

      {/* train loss line */}
      <polyline
        points={TRAIN_LOSS.map((v, i) =>
          `${58 + i * 34},${110 - (v / 2.0) * 90}`
        ).join(' ')}
        fill="none" stroke="#0ea5e9" strokeWidth={1.5} />
      {/* val loss line */}
      <polyline
        points={VAL_LOSS.map((v, i) =>
          `${58 + i * 34},${110 - (v / 2.0) * 90}`
        ).join(' ')}
        fill="none" stroke="#ef4444" strokeWidth={1.5} />

      {/* val loss data points */}
      {VAL_LOSS.map((v, i) => {
        const xx = 58 + i * 34;
        const yy = 110 - (v / 2.0) * 90;
        const rising = i >= 4;
        return (
          <g key={i}>
            <circle cx={xx} cy={yy}
              r={rising ? 3 : 2}
              fill={rising ? '#ef4444' : '#ef444460'}
              stroke={rising ? '#ef4444' : 'none'}
              strokeWidth={0.8} />
          </g>
        );
      })}

      {/* best line */}
      <line x1={58 + 3 * 34} y1={12}
        x2={58 + 3 * 34} y2={110}
        stroke="#10b981" strokeWidth={1}
        strokeDasharray="4 2" />
      <text x={58 + 3 * 34} y={10} textAnchor="middle"
        fontSize={7} fill="#10b981" fontWeight={600}>
        best
      </text>

      {/* legend inside chart */}
      <line x1={60} y1={22} x2={75} y2={22} stroke="#0ea5e9" strokeWidth={1.5} />
      <text x={79} y={25} fontSize={7} fill="#0ea5e9">train</text>
      <line x1={60} y1={32} x2={75} y2={32} stroke="#ef4444" strokeWidth={1.5} />
      <text x={79} y={35} fontSize={7} fill="#ef4444">val</text>

      {/* annotation — right side, clearly separated from chart */}
      <rect x={325} y={15} width={130} height={110} rx={6}
        fill="#ef444406" stroke="#ef4444" strokeWidth={0.8} />
      <text x={390} y={32} textAnchor="middle" fontSize={9}
        fontWeight={700} fill="#ef4444">Early Stopping</text>
      <line x1={335} y1={38} x2={445} y2={38} stroke="#ef4444" strokeOpacity={0.3} strokeWidth={0.5} />

      <text x={335} y={54} fontSize={8} fill="var(--muted-foreground)">E15: val=0.55</text>
      <text x={430} y={54} fontSize={7} fontWeight={600} fill="#10b981">best</text>

      <text x={335} y={70} fontSize={8} fill="#ef4444">E20: val=0.52 → cnt 0</text>
      <text x={335} y={84} fontSize={8} fill="#ef4444">E25: val=0.55 → cnt 1</text>
      <text x={335} y={98} fontSize={8} fill="#ef4444">E30: val=0.58 → cnt 2</text>
      <text x={335} y={112} fontSize={8} fontWeight={700} fill="#ef4444">E35: val=0.65 → STOP</text>
    </motion.g>
  );
}
