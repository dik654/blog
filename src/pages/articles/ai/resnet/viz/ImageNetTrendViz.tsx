import { motion } from 'framer-motion';
import { imagenetData, HUMAN_ERROR } from '../ImpactData';

const LEFT = 50;
const RIGHT = 370;
const TOP = 24;
const BOT = 130;
const MAX_ERR = 18;

function xPos(year: number) {
  return LEFT + ((year - 2012) / 3.5) * (RIGHT - LEFT);
}
function yPos(err: number) {
  return TOP + (err / MAX_ERR) * (BOT - TOP);
}

export default function ImageNetTrendViz({ step }: { step: number }) {
  const showHighlight = step >= 1;
  const showLegacy = step >= 2;

  return (
    <svg viewBox="0 0 420 175" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={210} y={14} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">ImageNet Top-5 Error Rate (%)</text>

      {/* Y axis */}
      {[0, 5, 10, 15].map(v => (
        <g key={v}>
          <line x1={LEFT} y1={yPos(v)} x2={RIGHT} y2={yPos(v)}
            stroke="var(--border)" strokeWidth={0.5} />
          <text x={LEFT - 6} y={yPos(v) + 3} textAnchor="end"
            fontSize={9} fill="var(--muted-foreground)">{v}%</text>
        </g>
      ))}

      {/* Human line */}
      <line x1={LEFT} y1={yPos(HUMAN_ERROR)} x2={RIGHT} y2={yPos(HUMAN_ERROR)}
        stroke="#ec4899" strokeWidth={1} strokeDasharray="4 3" strokeOpacity={0.6} />
      <text x={RIGHT + 4} y={yPos(HUMAN_ERROR) + 3} fontSize={9}
        fill="#ec4899" fillOpacity={0.8}>5.1%</text>

      {/* Data points and lines */}
      {imagenetData.map((d, i) => {
        const x = xPos(d.year);
        const y = yPos(d.error);
        const prev = i > 0 ? imagenetData[i - 1] : null;
        const isResNet = d.model === 'ResNet';

        return (
          <g key={d.model}>
            {prev && (
              <motion.line x1={xPos(prev.year)} y1={yPos(prev.error)}
                x2={x} y2={y} stroke="var(--muted-foreground)"
                strokeWidth={1} strokeOpacity={0.3}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: i * 0.15 }} />
            )}
            <motion.circle cx={x} cy={y}
              r={isResNet && showHighlight ? 8 : 5}
              fill={d.color} fillOpacity={isResNet && showHighlight ? 0.4 : 0.2}
              stroke={d.color} strokeWidth={1.5}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: i * 0.15 }} />
            <text x={x} y={y - 10} textAnchor="middle"
              fontSize={9} fill={d.color}
              fontWeight={isResNet ? 600 : 400}>
              {d.error}%
            </text>
            <text x={x} y={BOT + 14} textAnchor="middle"
              fontSize={9} fill={d.color}
              fontWeight={isResNet ? 600 : 400}>
              {d.model}
            </text>
          </g>
        );
      })}

      {/* Legacy text */}
      {showLegacy && (
        <motion.text x={210} y={158} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)"
          initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
          DenseNet / ResNeXt / EfficientNet / Transformer 스킵 커넥션
        </motion.text>
      )}
    </svg>
  );
}
