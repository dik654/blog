import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './KzgVizData';

export function OpenStep() {
  const steps = [
    { n: '1', label: 'y = f(z)', desc: '평가값 계산', c: CV },
    { n: '2', label: 'n(x) = f(x) - y', desc: 'n(z) = 0 보장', c: CE },
    { n: '3', label: 'q(x) = n(x) / (x-z)', desc: '나머지 없이 나눗셈', c: CA },
    { n: '4', label: 'pi = commit(q)', desc: '[q(t)]_1 = 증거', c: CV },
  ];
  return (
    <g>
      {steps.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
          <circle cx={40} cy={22 + i * 28} r={9} fill={`${s.c}20`} stroke={s.c} strokeWidth={0.8} />
          <text x={40} y={26 + i * 28} textAnchor="middle"
            fontSize={9} fontWeight={700} fill={s.c}>{s.n}</text>
          <text x={65} y={25 + i * 28} fontSize={9} fontWeight={600}
            fill="var(--foreground)">{s.label}</text>
          <text x={230} y={25 + i * 28} fontSize={8}
            fill="var(--muted-foreground)">{s.desc}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <text x={220} y={130} textAnchor="middle" fontSize={8} fill={CE}>
          핵심: f(z)=y 이면 (x-z) | (f(x)-y) → 몫 q가 다항식
        </text>
      </motion.g>
    </g>
  );
}

export function VerifyStep() {
  return (
    <g>
      <VizBox x={20} y={10} w={120} h={36} label="e(pi, [t]_2)"
        sub="LHS: proof pairing" c={CV} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <text x={220} y={32} textAnchor="middle" fontSize={12} fontWeight={700}
          fill={CA}>=?</text>
      </motion.g>
      <VizBox x={300} y={10} w={120} h={36} label="e(C-[y]+z*pi, G_2)"
        sub="RHS: commitment pairing" c={CE} delay={0.15} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <rect x={60} y={65} width={320} height={50} rx={5}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.6} />
        <text x={220} y={82} textAnchor="middle" fontSize={9} fill="var(--foreground)">
          유도: f(t)-y = q(t)*(t-z) → 페어링으로 양변 확인
        </text>
        <text x={220} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          2-pairing 최적화: G2 scalar_mul 불필요 → 검증 고속화
        </text>
      </motion.g>
    </g>
  );
}
