import { motion } from 'framer-motion';
import { MAIN_COLOR, SKIP_COLOR, NODE_COLOR } from '../SkipConnectionData';

const spring = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };

export default function SkipPathViz({ step }: { step: number }) {
  const showSkip = step >= 1;
  const showGrad = step >= 2;

  return (
    <svg viewBox="0 0 400 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <defs>
        <marker id="arr-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={MAIN_COLOR} fillOpacity={0.7} />
        </marker>
        <marker id="arr-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={SKIP_COLOR} fillOpacity={0.7} />
        </marker>
      </defs>

      {/* Nodes */}
      {['x', 'F(x)', 'F(x)+x'].map((label, i) => {
        const cx = 60 + i * 140;
        return (
          <g key={label}>
            <circle cx={cx} cy={80} r={22} fill={NODE_COLOR}
              fillOpacity={0.12} stroke={NODE_COLOR} strokeWidth={1.5} />
            <text x={cx} y={84} textAnchor="middle"
              fontSize={9} fill={NODE_COLOR} fontWeight={500}>{label}</text>
          </g>
        );
      })}

      {/* Main path (red) */}
      <motion.line x1={82} y1={80} x2={178} y2={80}
        stroke={MAIN_COLOR} strokeWidth={1.5} strokeOpacity={0.6}
        markerEnd="url(#arr-red)" animate={{ opacity: 1 }} />
      <motion.line x1={222} y1={80} x2={318} y2={80}
        stroke={MAIN_COLOR} strokeWidth={1.5} strokeOpacity={0.6}
        markerEnd="url(#arr-red)" animate={{ opacity: 1 }} />
      <text x={150} y={72} textAnchor="middle" fontSize={9}
        fill={MAIN_COLOR} fillOpacity={0.7}>w1,w2</text>

      {/* Skip path (blue) */}
      {showSkip && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring}>
          <path d="M 60 58 Q 60 30, 200 30 Q 340 30, 340 58"
            fill="none" stroke={SKIP_COLOR} strokeWidth={1.5}
            strokeDasharray="6 3" strokeOpacity={0.6}
            markerEnd="url(#arr-blue)" />
          <text x={200} y={24} textAnchor="middle" fontSize={9}
            fill={SKIP_COLOR} fontWeight={500}>스킵 경로 (x 직접 전달)</text>
        </motion.g>
      )}

      {/* Gradient annotations */}
      {showGrad && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring}>
          <text x={150} y={115} textAnchor="middle" fontSize={9}
            fill={MAIN_COLOR}>메인: dF/dx (소실 가능)</text>
          <text x={200} y={135} textAnchor="middle" fontSize={9}
            fill={SKIP_COLOR}>스킵: +1 (항상 보존)</text>
          {step >= 3 && (
            <text x={200} y={152} textAnchor="middle" fontSize={9}
              fill={NODE_COLOR} fontWeight={600}>
              dy/dx = dF/dx + 1 (합산)
            </text>
          )}
        </motion.g>
      )}
    </svg>
  );
}
