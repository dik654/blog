import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './G1OpsVizData';

export function DoubleStep() {
  const vars = [
    { label: 'A = Y²', x: 20, c: CV },
    { label: 'B = 4·X·A', x: 120, c: CV },
    { label: 'C = 8·A²', x: 235, c: CE },
    { label: 'D = 3·X²', x: 335, c: CE },
  ];
  return (
    <g>
      {vars.map((v, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
          <rect x={v.x} y={15} width={90} height={24} rx={3}
            fill={`${v.c}10`} stroke={v.c} strokeWidth={0.8} />
          <text x={v.x + 45} y={30} textAnchor="middle" fontSize={8} fontWeight={600} fill={v.c}>
            {v.label}
          </text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={40} y={55} width={140} height={22} rx={3} fill={`${CA}10`} stroke={CA} strokeWidth={0.8} />
        <text x={110} y={69} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>X₃ = D² - 2B</text>
        <rect x={210} y={55} width={180} height={22} rx={3} fill={`${CA}10`} stroke={CA} strokeWidth={0.8} />
        <text x={300} y={69} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>Y₃ = D(B-X₃) - C</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={120} y={92} width={180} height={22} rx={3} fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={210} y={106} textAnchor="middle" fontSize={8} fill={CE} fontWeight={600}>Z₃ = 2·Y·Z</text>
      </motion.g>
    </g>
  );
}

export function AddStep() {
  const left = [
    { label: 'U₁ = X₁·Z₂²', c: CV },
    { label: 'S₁ = Y₁·Z₂³', c: CV },
  ];
  const right = [
    { label: 'U₂ = X₂·Z₁²', c: CE },
    { label: 'S₂ = Y₂·Z₁³', c: CE },
  ];
  return (
    <g>
      {left.map((l, i) => (
        <motion.g key={`l${i}`} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
          <rect x={15} y={15 + i * 30} width={120} height={22} rx={3}
            fill={`${l.c}10`} stroke={l.c} strokeWidth={0.8} />
          <text x={75} y={29 + i * 30} textAnchor="middle" fontSize={8} fontWeight={600} fill={l.c}>{l.label}</text>
        </motion.g>
      ))}
      {right.map((r, i) => (
        <motion.g key={`r${i}`} initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
          <rect x={155} y={15 + i * 30} width={120} height={22} rx={3}
            fill={`${r.c}10`} stroke={r.c} strokeWidth={0.8} />
          <text x={215} y={29 + i * 30} textAnchor="middle" fontSize={8} fontWeight={600} fill={r.c}>{r.label}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={300} y={10} width={130} height={55} rx={5} fill={`${CA}08`} stroke={CA} strokeWidth={1} />
        <text x={365} y={30} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>U₁==U₂?</text>
        <text x={365} y={42} textAnchor="middle" fontSize={7} fill={CE}>S₁==S₂ → double</text>
        <text x={365} y={54} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">S₁≠S₂ → identity</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <text x={220} y={95} textAnchor="middle" fontSize={8} fill={CA} fontWeight={600}>
          H=U₂-U₁, R=S₂-S₁ → X₃=R²-H³-2U₁H² → Z₃=H·Z₁·Z₂
        </text>
      </motion.g>
    </g>
  );
}
