import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './LookupVizData';

export function WhyLookupStep() {
  return (
    <g>
      <VizBox x={20} y={15} w={180} h={44} label="PLONK 게이트만"
        sub="range check: ~16 boolean 제약" c={CV} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <text x={220} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={CA}>vs</text>
      </motion.g>
      <VizBox x={240} y={15} w={180} h={44} label="Plookup"
        sub="테이블 1개 + lookup 1개" c={CE} delay={0.15} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <rect x={40} y={80} width={360} height={36} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.5} />
        <text x={220} y={96} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          XOR, AND, 비트 분해 등 비산술 연산을 O(1) 제약으로 처리
        </text>
        <text x={220} y={108} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          테이블 크기가 커져도 prover 비용만 증가, verifier는 O(1)
        </text>
      </motion.g>
    </g>
  );
}

export function TableStep() {
  const tables = [
    { label: 'range_table(8)', vals: '0, 1, 2, ..., 255', c: CV },
    { label: 'xor_table(4)', vals: 'a + 16*b + 256*(a^b)', c: CE },
    { label: 'and_table(4)', vals: 'a + 16*b + 256*(a&b)', c: CA },
  ];
  return (
    <g>
      {tables.map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
          <rect x={20} y={18 + i * 38} width={130} height={28} rx={3}
            fill={`${t.c}12`} stroke={t.c} strokeWidth={0.7} />
          <text x={85} y={35 + i * 38} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={t.c}>{t.label}</text>
          <text x={170} y={35 + i * 38} fontSize={8}
            fill="var(--muted-foreground)">{t.vals}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={220} y={136} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          다중 컬럼은 alpha로 인코딩 → 단일 Fr 값으로 압축
        </text>
      </motion.g>
    </g>
  );
}
