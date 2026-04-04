import { motion } from 'framer-motion';
import { C } from './ForwardExampleVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export function InputNodes() {
  return (
    <g>
      <circle cx={40} cy={40} r={16} fill={`${C.inp}15`}
        stroke={C.inp} strokeWidth={1.2} />
      <text x={40} y={37} textAnchor="middle" fontSize={9}
        fontWeight={500} fill={C.inp}>x₁</text>
      <text x={40} y={48} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={C.inp}>0.8</text>
      <circle cx={40} cy={95} r={16} fill={`${C.inp}15`}
        stroke={C.inp} strokeWidth={1.2} />
      <text x={40} y={92} textAnchor="middle" fontSize={9}
        fontWeight={500} fill={C.inp}>x₂</text>
      <text x={40} y={103} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={C.inp}>0.4</text>
    </g>
  );
}

export function OutputNodes() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <circle cx={360} cy={40} r={16} fill={`${C.dec}15`}
        stroke={C.dec} strokeWidth={1.2} />
      <text x={360} y={37} textAnchor="middle" fontSize={9}
        fontWeight={500} fill={C.dec}>x&#770;₁</text>
      <text x={360} y={48} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={C.dec}>0.593</text>
      <circle cx={360} cy={95} r={16} fill={`${C.dec}15`}
        stroke={C.dec} strokeWidth={1.2} />
      <text x={360} y={92} textAnchor="middle" fontSize={9}
        fontWeight={500} fill={C.dec}>x&#770;₂</text>
      <text x={360} y={103} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={C.dec}>0.608</text>
      <text x={420} y={40} fontSize={9} fill="#ef4444">0.8 vs 0.593</text>
      <text x={420} y={98} fontSize={9} fill="#ef4444">0.4 vs 0.608</text>
    </motion.g>
  );
}
