import { motion } from 'framer-motion';
import { CV, CE, CA } from './ProverVizData';

export function RoundsOverviewStep() {
  const rounds = [
    { n: '1', label: 'Wire Commit', out: '[a]_1, [b]_1, [c]_1', c: CV },
    { n: '2', label: 'Permutation Z', out: '[Z]_1', c: CE },
    { n: '3', label: 'Quotient T', out: '[t_lo], [t_mid], [t_hi]', c: CA },
    { n: '4', label: 'Evaluations', out: 'a_bar, b_bar, ... at zeta', c: CV },
    { n: '5', label: 'Opening Proofs', out: 'W_zeta, W_{zeta*omega}', c: CE },
  ];
  return (
    <g>
      {rounds.map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
          <circle cx={32} cy={18 + i * 24} r={9} fill={`${r.c}20`} stroke={r.c} strokeWidth={0.8} />
          <text x={32} y={22 + i * 24} textAnchor="middle"
            fontSize={8} fontWeight={700} fill={r.c}>{r.n}</text>
          <text x={55} y={21 + i * 24} fontSize={9} fontWeight={600}
            fill="var(--foreground)">{r.label}</text>
          <text x={200} y={21 + i * 24} fontSize={8}
            fill="var(--muted-foreground)">{r.out}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <text x={220} y={142} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          각 라운드 후 Fiat-Shamir transcript → 다음 챌린지 도출
        </text>
      </motion.g>
    </g>
  );
}

export function QuotientStep() {
  const parts = [
    { label: 'gate constraint', desc: 'q_L*a + q_R*b + q_O*c + q_M*ab + q_C', c: CV },
    { label: 'alpha * perm1', desc: 'Z*(id product) - Z(wx)*(sigma product)', c: CE },
    { label: 'alpha^2 * perm2', desc: '(Z(x) - 1) * L1(x)', c: CA },
  ];
  return (
    <g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x={220} y={14} textAnchor="middle" fontSize={8} fontWeight={600}
          fill="var(--foreground)">combined = gate + alpha*P1 + alpha^2*P2</text>
      </motion.g>
      {parts.map((p, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.15 }}>
          <rect x={20} y={24 + i * 28} width={400} height={22} rx={3}
            fill={`${p.c}08`} stroke={p.c} strokeWidth={0.5} />
          <text x={30} y={38 + i * 28} fontSize={8} fontWeight={600} fill={p.c}>{p.label}</text>
          <text x={160} y={38 + i * 28} fontSize={8} fill="var(--muted-foreground)">{p.desc}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <text x={220} y={116} textAnchor="middle" fontSize={8} fill={CA}>
          T(x) = combined / Z_H(x), Z_H = x^n - 1
        </text>
        <text x={220} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          T를 n차씩 3분할하여 각각 KZG commit
        </text>
      </motion.g>
    </g>
  );
}
