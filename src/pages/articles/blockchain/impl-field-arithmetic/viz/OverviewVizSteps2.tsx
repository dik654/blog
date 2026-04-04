import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OverviewVizData';

export function ModAddStep() {
  return (
    <g>
      <VizBox x={20} y={40} w={80} h={36} label="a" sub="[u64; 4]" c={CV} />
      <VizBox x={120} y={40} w={80} h={36} label="b" sub="[u64; 4]" c={CV} delay={0.1} />
      <motion.text x={108} y={62} fontSize={14} fill={CA} fontWeight={700}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>+</motion.text>
      <motion.path d="M 210 58 L 240 58" stroke={CA} strokeWidth={1}
        markerEnd="url(#fArr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
      <VizBox x={250} y={30} w={90} h={24} label="sum" sub="carry 전파" c={CE} delay={0.35} />
      <motion.path d="M 295 54 L 295 72" stroke={CA} strokeWidth={1}
        markerEnd="url(#fArr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.3 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={250} y={76} width={90} height={36} rx={4}
          fill={`${CA}10`} stroke={CA} strokeWidth={1} />
        <text x={295} y={92} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={CA}>sub_if_gte</text>
        <text x={295} y={104} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">{'sum >= p ? p 빼기'}</text>
      </motion.g>
      <defs>
        <marker id="fArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}

export function ModSubStep() {
  return (
    <g>
      <VizBox x={20} y={40} w={80} h={36} label="a" sub="[u64; 4]" c={CV} />
      <VizBox x={120} y={40} w={80} h={36} label="b" sub="[u64; 4]" c={CV} delay={0.1} />
      <motion.text x={108} y={62} fontSize={14} fill={CA} fontWeight={700}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>-</motion.text>
      <motion.path d="M 210 58 L 240 58" stroke={CA} strokeWidth={1}
        markerEnd="url(#fArr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
      <VizBox x={250} y={30} w={90} h={24} label="diff" sub="borrow 전파" c={CE} delay={0.35} />
      <motion.path d="M 295 54 L 295 72" stroke={CA} strokeWidth={1}
        markerEnd="url(#fArr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.3 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={240} y={76} width={110} height={36} rx={4}
          fill={`${CE}10`} stroke={CE} strokeWidth={1} />
        <text x={295} y={92} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={CE}>borrow?</text>
        <text x={295} y={104} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">yes → diff + p 복원</text>
      </motion.g>
      <defs>
        <marker id="fArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}
