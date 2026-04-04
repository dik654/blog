import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './ExtVizData';

export function Fp12TowerStep() {
  const levels = [
    { label: 'Fp', w: 60, x: 190, y: 100, c: CV },
    { label: 'Fp2 (x2)', w: 90, x: 175, y: 72, c: CE },
    { label: 'Fp6 (x3)', w: 120, x: 160, y: 44, c: CA },
    { label: 'Fp12 (x2)', w: 150, x: 145, y: 16, c: CV },
  ];
  return (
    <g>
      {levels.map((l, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
          <rect x={l.x} y={l.y} width={l.w} height={22} rx={4}
            fill={`${l.c}12`} stroke={l.c} strokeWidth={1} />
          <text x={l.x + l.w / 2} y={l.y + 14} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={l.c}>{l.label}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <text x={350} y={35} fontSize={8} fill={CA} fontWeight={600}>2 x 3 x 2 = 12</text>
        <text x={350} y={50} fontSize={7} fill="var(--muted-foreground)">embedding degree</text>
        <text x={350} y={90} fontSize={8} fill={CE} fontWeight={600}>e(G1, G2) in Fp12*</text>
        <text x={350} y={105} fontSize={7} fill="var(--muted-foreground)">페어링 결과 공간</text>
      </motion.g>
    </g>
  );
}

export function InvChainStep() {
  const chain = [
    { label: 'Fp12.inv()', sub: 'norm → Fp6', c: CV, x: 15 },
    { label: 'Fp6.inv()', sub: 'norm → Fp2', c: CE, x: 125 },
    { label: 'Fp2.inv()', sub: 'norm → Fp', c: CA, x: 235 },
    { label: 'Fp.inv()', sub: 'Fermat a^{p-2}', c: CV, x: 345 },
  ];
  return (
    <g>
      {chain.map((c, i) => (
        <motion.g key={i}>
          <VizBox x={c.x} y={35} w={95} h={40} label={c.label}
            sub={c.sub} c={c.c} delay={i * 0.15} />
          {i < 3 && (
            <motion.path d={`M ${c.x + 95} 55 L ${c.x + 125} 55`}
              stroke={CA} strokeWidth={1} markerEnd="url(#eArr)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.3 }} />
          )}
        </motion.g>
      ))}
      <motion.text x={220} y={105} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)" initial={{ opacity: 0 }}
        animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        각 층에서 conjugate * norm^{'{-1}'} — 차원을 한 단계씩 내려 Fp까지 도달
      </motion.text>
      <defs>
        <marker id="eArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}
