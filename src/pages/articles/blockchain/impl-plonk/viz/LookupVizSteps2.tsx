import { motion } from 'framer-motion';
import { CV, CE, CA } from './LookupVizData';

export function SortedMergeStep() {
  const t = [0, 1, 2, 3];
  const f = [1, 3];
  const sorted = [0, 1, 1, 2, 3, 3];
  return (
    <g>
      <text x={20} y={16} fontSize={8} fontWeight={600} fill={CV}>T (테이블)</text>
      {t.map((v, i) => (
        <motion.g key={`t${i}`} initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
          <rect x={20 + i * 36} y={22} width={30} height={20} rx={2}
            fill={`${CV}10`} stroke={CV} strokeWidth={0.5} />
          <text x={35 + i * 36} y={35} textAnchor="middle" fontSize={8} fill={CV}>{v}</text>
        </motion.g>
      ))}
      <text x={200} y={16} fontSize={8} fontWeight={600} fill={CE}>f (조회값)</text>
      {f.map((v, i) => (
        <motion.g key={`f${i}`} initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.06 }}>
          <rect x={200 + i * 36} y={22} width={30} height={20} rx={2}
            fill={`${CE}10`} stroke={CE} strokeWidth={0.5} />
          <text x={215 + i * 36} y={35} textAnchor="middle" fontSize={8} fill={CE}>{v}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={20} y={68} fontSize={8} fontWeight={600} fill={CA}>sorted = f ∪ T</text>
      </motion.g>
      {sorted.map((v, i) => (
        <motion.g key={`s${i}`} initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.08 }}>
          <rect x={20 + i * 42} y={74} width={36} height={20} rx={2}
            fill={i === 2 || i === 3 ? `${CA}15` : `${CA}08`}
            stroke={CA} strokeWidth={0.5} />
          <text x={38 + i * 42} y={87} textAnchor="middle" fontSize={8} fill={CA}>{v}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        <text x={220} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          h1 = sorted[..n], h2 = sorted[n-1..] (h1[last] = h2[0] 중첩)
        </text>
      </motion.g>
    </g>
  );
}

export function LookupGrandProductStep() {
  const lines = [
    { label: 'num = (1+b)(g+f_i)(g(1+b)+t_i+b*t_{i+1})', c: CE },
    { label: 'den = (g(1+b)+h1_i+b*h1_{i+1})(g(1+b)+h2_i+b*h2_{i+1})', c: CA },
    { label: 'Z(w^(i+1)) = Z(w^i) * num / den', c: CV },
  ];
  return (
    <g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x={220} y={16} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="var(--foreground)">Plookup Grand Product</text>
      </motion.g>
      {lines.map((l, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}>
          <rect x={30} y={28 + i * 30} width={380} height={22} rx={3}
            fill={`${l.c}08`} stroke={l.c} strokeWidth={0.5} />
          <text x={40} y={42 + i * 30} fontSize={8} fill={l.c}>{l.label}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={60} y={120} width={320} height={16} rx={2}
          fill={`${CE}10`} stroke={CE} strokeWidth={0.5} />
        <text x={220} y={131} textAnchor="middle" fontSize={8} fill={CE}>
          정렬 올바르면 인접 쌍이 일치 → Z가 1로 복귀
        </text>
      </motion.g>
    </g>
  );
}
