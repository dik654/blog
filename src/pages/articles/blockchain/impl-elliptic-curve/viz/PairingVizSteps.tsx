import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './PairingVizData';

export function PairingOverviewStep() {
  const stages = [
    { label: 'G1 (P)', sub: 'Fp 위의 점', c: CV, x: 15 },
    { label: 'G2 (Q)', sub: 'Fp2 위의 점', c: CE, x: 115 },
  ];
  return (
    <g>
      {stages.map((s, i) => (
        <VizBox key={i} x={s.x} y={15} w={90} h={40} label={s.label} sub={s.sub} c={s.c} delay={i * 0.15} />
      ))}
      <motion.path d="M 205 35 L 245 35" stroke={CA} strokeWidth={1.5}
        markerEnd="url(#pArr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.4 }} />
      <motion.text x={225} y={27} textAnchor="middle" fontSize={8} fill={CA} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        e(P,Q)
      </motion.text>
      <VizBox x={250} y={15} w={120} h={40} label="GT ⊂ Fp12*" sub="유한체 원소" c={CA} delay={0.5} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <rect x={15} y={75} width={355} height={28} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={192} y={93} textAnchor="middle" fontSize={8} fill={CA} fontWeight={600}>
          e(aP, bQ) = e(P,Q)^(ab) — 쌍선형 사상
        </text>
      </motion.g>
      <defs>
        <marker id="pArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}

export function MillerLoopStep() {
  const iters = [
    { label: 'f²·line_double', c: CE },
    { label: '+1: f·line_add(Q)', c: CV },
    { label: '-1: f·line_add(-Q)', c: CV },
    { label: '0: skip', c: 'var(--muted-foreground)' },
  ];
  return (
    <g>
      <VizBox x={15} y={10} w={130} h={30} label="NAF(|6u+2|)" sub="65비트, MSB→LSB" c={CA} />
      {iters.map((it, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.12 }}>
          <rect x={165} y={10 + i * 27} width={180} height={22} rx={3}
            fill={it.c === CE || it.c === CV ? `${it.c}10` : 'var(--card)'}
            stroke={it.c === CE || it.c === CV ? it.c : 'var(--border)'} strokeWidth={0.8} />
          <text x={255} y={24 + i * 27} textAnchor="middle"
            fontSize={8} fontWeight={it.c !== 'var(--muted-foreground)' ? 600 : 400}
            fill={it.c}>{it.label}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={360} y={10} width={75} height={55} rx={5}
          fill={`${CE}08`} stroke={CE} strokeWidth={1} />
        <text x={397} y={30} textAnchor="middle" fontSize={8} fontWeight={600} fill={CE}>64회</text>
        <text x={397} y={44} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">반복</text>
        <text x={397} y={56} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">+ 보정 2회</text>
      </motion.g>
    </g>
  );
}
