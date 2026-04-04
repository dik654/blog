import { motion } from 'framer-motion';
import { evalPipelineSteps } from '../evalData';

const BW = 76, GAP = 10;

export default function EvalPipelineViz() {
  return (
    <div className="not-prose rounded-xl border p-5 mb-6">
      <svg viewBox="0 0 370 80" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {evalPipelineSteps.map((node, i) => {
          const x = i * (BW + GAP) + 4;
          return (
            <g key={i}>
              <motion.rect x={x} y={10} width={BW} height={48} rx={6}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                fill={`${node.color}15`} stroke={node.color} strokeWidth={1.5} />
              <motion.text x={x + BW / 2} y={30} textAnchor="middle"
                fontSize={7.5} fontWeight={600} fill={node.color}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.12 + 0.1 }}>
                {node.label}
              </motion.text>
              <motion.text x={x + BW / 2} y={43} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.12 + 0.15 }}>
                {node.sub}
              </motion.text>
              {i < evalPipelineSteps.length - 1 && (
                <motion.line x1={x + BW + 1} y1={34} x2={x + BW + GAP - 1} y2={34}
                  stroke="var(--border)" strokeWidth={1}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                  transition={{ delay: i * 0.12 + 0.15 }} />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
