import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OverviewVizData';

/** Step 2: Lagrange interpolation */
export function LagrangeStep() {
  const rows = [
    { label: 'A[i,j]', c: CV },
    { label: 'B[i,j]', c: CE },
    { label: 'C[i,j]', c: CA },
  ];
  return (
    <g>
      {rows.map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
          <rect x={20} y={20 + i * 36} width={80} height={28} rx={4}
            fill={`${r.c}10`} stroke={r.c} strokeWidth={0.8} />
          <text x={60} y={38 + i * 36} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={r.c}>{r.label}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={140} y={58} fontSize={10} fill={CA}>Lagrange</text>
        <path d="M 110 55 L 170 55" stroke={CA} strokeWidth={1}
          markerEnd="url(#gArr)" strokeDasharray="3,2" />
      </motion.g>
      {rows.map((r, i) => (
        <motion.g key={`p${i}`} initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.12 }}>
          <rect x={200} y={20 + i * 36} width={100} height={28} rx={4}
            fill={`${r.c}10`} stroke={r.c} strokeWidth={0.8} />
          <text x={250} y={38 + i * 36} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={r.c}>
            {['aⱼ(x)', 'bⱼ(x)', 'cⱼ(x)'][i]}
          </text>
        </motion.g>
      ))}
      <motion.text x={340} y={58} fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        각 열 → 다항식
      </motion.text>
      <defs>
        <marker id="gArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 3: QAP equivalence */
export function QAPEquivStep() {
  return (
    <g>
      <VizBox x={20} y={20} w={160} h={40} label="a(x)·b(x) - c(x)"
        sub="witness로 결합한 다항식" c={CV} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <path d="M 190 40 L 220 40" stroke={CA} strokeWidth={1.2}
          markerEnd="url(#gArr)" />
        <text x={205} y={34} fontSize={8} fill={CA} textAnchor="middle">÷</text>
      </motion.g>
      <VizBox x={230} y={20} w={80} h={40} label="t(x)"
        sub="소거 다항식" c={CE} delay={0.3} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <path d="M 320 40 L 350 40" stroke={CA} strokeWidth={1.2}
          markerEnd="url(#gArr)" />
        <text x={335} y={34} fontSize={8} fill={CA} textAnchor="middle">=</text>
      </motion.g>
      <VizBox x={360} y={20} w={60} h={40} label="h(x)"
        sub="몫 다항식" c={CA} delay={0.6} />
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}>
        <rect x={60} y={80} width={320} height={36} rx={5}
          fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={220} y={96} textAnchor="middle" fontSize={8} fontWeight={600} fill={CE}>
          나머지 = 0 ⟺ 모든 R1CS 제약 만족 ⟺ 유효한 증명 가능
        </text>
        <text x={220} y={109} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          Schwartz-Zippel: 랜덤 τ에서 성립 → 전체 다항식 동치 (확률적 보장)
        </text>
      </motion.g>
    </g>
  );
}
