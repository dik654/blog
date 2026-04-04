import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './PermVizData';

export function SigmaPolyStep() {
  const rows = [
    { id: 'identity', tag: 'w^i', c: CV },
    { id: 'K1*H', tag: 'K1*w^i', c: CE },
    { id: 'K2*H', tag: 'K2*w^i', c: CA },
  ];
  return (
    <g>
      {rows.map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
          <VizBox x={20} y={14 + i * 38} w={100} h={30}
            label={`sigma_${['A', 'B', 'C'][i]}`} sub={`column ${['A', 'B', 'C'][i]}`} c={r.c} />
          <text x={140} y={32 + i * 38} fontSize={9} fill="var(--foreground)">
            sigma(w^i) = tag(sigma({['A', 'B', 'C'][i]}, i))
          </text>
          <rect x={330} y={18 + i * 38} width={80} height={22} rx={3}
            fill={`${r.c}10`} stroke={r.c} strokeWidth={0.5} />
          <text x={370} y={32 + i * 38} textAnchor="middle"
            fontSize={8} fill={r.c}>{r.tag}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={220} y={130} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">copy 없으면 sigma = identity → tag가 자기 코셋 값</text>
      </motion.g>
    </g>
  );
}

export function GrandProductStep() {
  const formula = [
    { label: 'Z(w^0) = 1', desc: '시작값', c: CV },
    { label: 'num = (a+b*w^i+g)(b+b*K1*w^i+g)(c+b*K2*w^i+g)',
      desc: 'identity tag', c: CE },
    { label: 'den = (a+b*sigma_A+g)(b+b*sigma_B+g)(c+b*sigma_C+g)',
      desc: 'sigma tag', c: CA },
    { label: 'Z(w^(i+1)) = Z(w^i) * num / den', desc: '누적곱', c: CV },
  ];
  return (
    <g>
      {formula.map((f, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
          <rect x={20} y={10 + i * 30} width={340} height={22} rx={3}
            fill={`${f.c}08`} stroke={f.c} strokeWidth={0.5} />
          <text x={30} y={24 + i * 30} fontSize={8} fontWeight={600} fill={f.c}>
            {f.label}
          </text>
          <text x={380} y={24 + i * 30} fontSize={8}
            fill="var(--muted-foreground)">{f.desc}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={60} y={128} width={320} height={14} rx={2}
          fill={`${CE}10`} stroke={CE} strokeWidth={0.5} />
        <text x={220} y={138} textAnchor="middle" fontSize={8} fill={CE}>
          copy 만족 → num=den telescope → Z(w^n) = 1
        </text>
      </motion.g>
    </g>
  );
}
