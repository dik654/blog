import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './ProverVizData';

export function LinearizationStep() {
  return (
    <g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x={220} y={14} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="var(--foreground)">선형화 트릭: 다항식곱 → scalar * polynomial</text>
      </motion.g>
      <VizBox x={20} y={24} w={180} h={34} label="r(x) = linearization"
        sub="wire 값을 scalar로 대체" c={CV} delay={0.1} />
      <VizBox x={240} y={24} w={180} h={34} label="batch W_zeta"
        sub="r + nu*(a-a_bar) + ..." c={CE} delay={0.2} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <rect x={40} y={72} width={360} height={30} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.5} />
        <text x={220} y={86} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          W_zeta = [r + nu*(a-a_bar) + nu^2*(b-b_bar) + ... ] / (x - zeta)
        </text>
        <text x={220} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          6개 다항식을 nu 거듭제곱으로 결합 → KZG 한 번으로 모두 open
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <rect x={40} y={110} width={360} height={22} rx={3}
          fill={`${CV}08`} stroke={CV} strokeWidth={0.5} />
        <text x={220} y={124} textAnchor="middle" fontSize={8} fill={CV}>
{'W_{zeta*omega} = [Z(x) - z_bar_omega] / (x - zeta*omega)'}
        </text>
      </motion.g>
    </g>
  );
}

export function VerifierStep() {
  const steps = [
    { n: '1', label: 'Fiat-Shamir 재현', desc: 'b, g, alpha, zeta, nu, u', c: CV },
    { n: '2', label: '[r]_1 계산', desc: 'selector + Z + sigma commitment 선형 결합', c: CE },
    { n: '3', label: 'F = [r] + nu*[a] + ... + u*[Z]', desc: 'batched commitment', c: CA },
    { n: '4', label: 'Pairing Check', desc: 'e(W+u*W_w, [t]_2) = e(..., G_2)', c: CV },
  ];
  return (
    <g>
      {steps.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
          <circle cx={36} cy={22 + i * 30} r={9} fill={`${s.c}20`} stroke={s.c} strokeWidth={0.8} />
          <text x={36} y={26 + i * 30} textAnchor="middle"
            fontSize={8} fontWeight={700} fill={s.c}>{s.n}</text>
          <text x={60} y={25 + i * 30} fontSize={9} fontWeight={600}
            fill="var(--foreground)">{s.label}</text>
          <text x={260} y={25 + i * 30} fontSize={8}
            fill="var(--muted-foreground)">{s.desc}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={40} y={138} width={360} height={14} rx={2}
          fill={`${CE}10`} stroke={CE} strokeWidth={0.5} />
        <text x={220} y={148} textAnchor="middle" fontSize={8} fill={CE}>
          pairing 2번 = 모든 제약 + 모든 다항식 관계 한꺼번에 검증
        </text>
      </motion.g>
    </g>
  );
}
