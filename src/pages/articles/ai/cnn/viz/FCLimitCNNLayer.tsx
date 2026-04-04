import { motion } from 'framer-motion';
import { sp, PIX, GAP } from './FCLimitVizData';

export default function FCLimitCNNLayer({ step }: { step: number }) {
  if (step !== 3) return null;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <defs>
        <marker id="arrowB" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
          <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" opacity={0.5} />
        </marker>
      </defs>
      {/* 3x3 filter */}
      <rect x={110} y={30} width={36} height={36} rx={3}
        fill="#6366f115" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="3 2" />
      <text x={128} y={52} textAnchor="middle" fontSize={11} fill="#6366f1" fontWeight={600}>3×3</text>
      <text x={128} y={62} textAnchor="middle" fontSize={11} fill="#6366f1">필터</text>

      {/* Arrow from filter to feature */}
      <line x1={146} y1={48} x2={168} y2={48} stroke="#6366f1" strokeWidth={1} markerEnd="url(#arrowB)" />

      {/* Output neuron */}
      <circle cx={180} cy={48} r={7} fill="#10b98120" stroke="#10b981" strokeWidth={1.5} />

      {/* Only 9 connections */}
      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 3 }, (_, c) => (
          <motion.line key={`cnn-${r}-${c}`}
            x1={20 + (c + 1) * (PIX + GAP) + PIX / 2} y1={15 + (r + 1) * (PIX + GAP) + PIX / 2}
            x2={110} y2={30 + r * 12 + 6}
            stroke="#6366f1" strokeWidth={0.6} strokeOpacity={0.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: (r * 3 + c) * 0.03 }} />
        ))
      )}

      <motion.text x={180} y={128} textAnchor="middle" fontSize={11} fill="#10b981" fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        3×3 = 9 파라미터 (가중치 공유)
      </motion.text>
    </motion.g>
  );
}
