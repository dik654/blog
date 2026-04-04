import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './KzgVizData';

export function SRSStep() {
  const pts = ['[t^0]_1', '[t^1]_1', '[t^2]_1', '...', '[t^d]_1'];
  return (
    <g>
      <VizBox x={20} y={20} w={90} h={40} label="tau (t)" sub="toxic waste" c={CA} />
      <motion.path d="M 110 40 L 140 40" stroke={CA} strokeWidth={1}
        markerEnd="url(#kArr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
      {pts.map((p, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
          <rect x={145 + i * 56} y={26} width={50} height={28} rx={3}
            fill={`${CV}10`} stroke={CV} strokeWidth={0.7} />
          <text x={170 + i * 56} y={43} textAnchor="middle"
            fontSize={8} fill={CV}>{p}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <text x={220} y={80} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">G1 points = t의 거듭제곱을 커브에 인코딩</text>
        <text x={220} y={94} textAnchor="middle" fontSize={8}
          fill={CE}>universal — 한 번 생성, 모든 다항식에 재사용</text>
      </motion.g>
      <defs>
        <marker id="kArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}

export function CommitStep() {
  return (
    <g>
      <VizBox x={20} y={20} w={100} h={36} label="f(x)" sub="다항식 계수" c={CV} />
      <motion.path d="M 120 38 L 150 38" stroke={CA} strokeWidth={1}
        markerEnd="url(#kArr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <VizBox x={155} y={12} w={130} h={52} label="MSM"
        sub="Sum f_i * [t^i]_1" c={CA} delay={0.3} />
      <motion.path d="M 285 38 L 315 38" stroke={CE} strokeWidth={1}
        markerEnd="url(#kArr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <VizBox x={320} y={20} w={100} h={36} label="C" sub="G1 점 (64B)" c={CE} delay={0.6} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <text x={220} y={90} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">commit(f) + commit(g) = commit(f+g) — 동형 속성</text>
      </motion.g>
    </g>
  );
}
