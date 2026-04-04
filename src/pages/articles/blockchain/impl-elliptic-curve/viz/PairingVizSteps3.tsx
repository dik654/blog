import { motion } from 'framer-motion';
import { CV, CE, CA } from './PairingVizData';

export function BilinearityStep() {
  const tests = [
    { lhs: 'e(3P, 5Q)', rhs: 'e(P,Q)^15', c: CE },
    { lhs: 'e(P,-Q)·e(P,Q)', rhs: '1', c: CV },
    { lhs: 'e(P,Q)^r', rhs: '1', c: CA },
  ];
  return (
    <g>
      {tests.map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
          <rect x={30} y={12 + i * 34} width={160} height={26} rx={4}
            fill={`${t.c}10`} stroke={t.c} strokeWidth={0.8} />
          <text x={110} y={29 + i * 34} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={t.c}>{t.lhs}</text>
          <text x={210} y={29 + i * 34} fontSize={10} fill="var(--muted-foreground)">=</text>
          <rect x={225} y={12 + i * 34} width={100} height={26} rx={4}
            fill={`${t.c}08`} stroke={t.c} strokeWidth={0.8} />
          <text x={275} y={29 + i * 34} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={t.c}>{t.rhs}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={380} y={30} fontSize={7.5} fill={CE} fontWeight={600}>쌍선형성</text>
        <text x={380} y={52} fontSize={7.5} fill={CV} fontWeight={600}>역원 관계</text>
        <text x={380} y={74} fontSize={7.5} fill={CA} fontWeight={600}>위수 확인</text>
      </motion.g>
    </g>
  );
}
