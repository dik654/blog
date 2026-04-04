import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './PairingVizData';

export function LineFunctionStep() {
  return (
    <g>
      <VizBox x={15} y={12} w={130} h={40} label="line_double" sub="접선 λ=3x²/(2y)" c={CE} />
      <VizBox x={160} y={12} w={130} h={40} label="line_add" sub="할선 λ=(y₂-y₁)/(x₂-x₁)" c={CV} delay={0.15} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <motion.path d="M 80 52 L 80 68" stroke={CE} strokeWidth={0.8} initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.2 }} />
        <motion.path d="M 225 52 L 225 68" stroke={CV} strokeWidth={0.8} initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.2 }} />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <rect x={15} y={70} width={275} height={35} rx={5}
          fill={`${CA}08`} stroke={CA} strokeWidth={1} />
        <text x={152} y={85} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>
          line_eval(λ, xt, yt, P) → sparse Fp12
        </text>
        <text x={152} y={98} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          c0=(yP, 0, 0), c1=(-λ·xP, λ·xT-yT, 0) — 0이 아닌 계수 3개
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={310} y={70} width={120} height={35} rx={5}
          fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={370} y={85} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={CE}>
          sparse 곱셈
        </text>
        <text x={370} y={97} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          Fp12 곱셈 비용 절반
        </text>
      </motion.g>
    </g>
  );
}

export function FinalExpStep() {
  const stages = [
    { label: 'Easy 1', sub: 'f^(p⁶-1)', desc: 'conj(f)·f⁻¹', c: CV, x: 15 },
    { label: 'Easy 2', sub: 'r1^(p²+1)', desc: 'frob²(r1)·r1', c: CE, x: 140 },
    { label: 'Hard', sub: '(p⁴-p²+1)/r', desc: '761비트 pow', c: CA, x: 265 },
  ];
  return (
    <g>
      <text x={220} y={12} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        f^((p¹²-1)/r) 분해
      </text>
      {stages.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.15 }}>
          <rect x={s.x} y={22} width={115} height={55} rx={5}
            fill={`${s.c}10`} stroke={s.c} strokeWidth={1} />
          <text x={s.x + 57} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={s.c}>{s.label}</text>
          <text x={s.x + 57} y={52} textAnchor="middle" fontSize={7.5} fill={s.c}>{s.sub}</text>
          <text x={s.x + 57} y={66} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{s.desc}</text>
        </motion.g>
      ))}
      {[127, 252].map((x, i) => (
        <motion.path key={i} d={`M ${x} 50 L ${x + 13} 50`} stroke={CA} strokeWidth={1}
          markerEnd="url(#pArr)" initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }} transition={{ delay: 0.4 + i * 0.15, duration: 0.2 }} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={390} y={30} width={45} height={40} rx={5}
          fill={`${CA}08`} stroke={CA} strokeWidth={1} />
        <text x={412} y={50} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>GT</text>
        <text x={412} y={62} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Fp12</text>
      </motion.g>
    </g>
  );
}

