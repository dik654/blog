import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OverviewVizData';

export function DomainStep() {
  const elems = ['1', 'w', 'w^2', 'w^3', '...', 'w^(n-1)'];
  return (
    <g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x={220} y={12} textAnchor="middle" fontSize={8} fontWeight={600}
          fill="var(--foreground)">H = n차 단위근 도메인</text>
      </motion.g>
      {elems.map((e, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
          <rect x={20 + i * 68} y={24} width={60} height={22} rx={3}
            fill={`${CV}10`} stroke={CV} strokeWidth={0.6} />
          <text x={50 + i * 68} y={38} textAnchor="middle"
            fontSize={8} fill={CV}>{e}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <VizBox x={20} y={62} w={120} h={30} label="A열 = H" sub="tag = w^i" c={CV} delay={0.8} />
        <VizBox x={160} y={62} w={120} h={30} label="B열 = K1*H"
          sub="tag = 2*w^i" c={CE} delay={0.9} />
        <VizBox x={300} y={62} w={120} h={30} label="C열 = K2*H"
          sub="tag = 3*w^i" c={CA} delay={1.0} />
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <text x={220} y={120} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">K1=2, K2=3 → 3개 코셋이 서로소 (3n개 tag 모두 distinct)</text>
      </motion.g>
    </g>
  );
}

export function CSStep() {
  const steps = [
    { n: '1', label: 'alloc_variable', desc: '변수 풀에 Fr 값 등록', c: CV },
    { n: '2', label: 'add_gate', desc: 'selector + wire 3개 묶기', c: CE },
    { n: '3', label: 'copy_constraint', desc: '(col,row) 쌍 동치 선언', c: CA },
    { n: '4', label: 'pad_to_power_of_two', desc: '더미 게이트로 패딩', c: '#94a3b8' },
  ];
  return (
    <g>
      {steps.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
          <circle cx={36} cy={28 + i * 28} r={9} fill={`${s.c}20`} stroke={s.c} strokeWidth={0.8} />
          <text x={36} y={32 + i * 28} textAnchor="middle"
            fontSize={9} fontWeight={700} fill={s.c}>{s.n}</text>
          <text x={60} y={31 + i * 28} fontSize={9} fontWeight={600}
            fill="var(--foreground)">{s.label}</text>
          <text x={210} y={31 + i * 28} fontSize={8}
            fill="var(--muted-foreground)">{s.desc}</text>
        </motion.g>
      ))}
    </g>
  );
}
