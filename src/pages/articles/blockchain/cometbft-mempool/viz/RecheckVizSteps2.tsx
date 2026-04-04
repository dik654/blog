import { motion } from 'framer-motion';
import { C } from './RecheckVizData';

export function Step2() {
  const results = [
    { tx: 'TX₀', ok: true },
    { tx: 'TX₂', ok: false },
    { tx: 'TX₄', ok: true },
  ];
  return (<g>
    {results.map((r, i) => (
      <motion.g key={r.tx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <rect x={20 + i * 140} y={25} width={115} height={40} rx={6}
          fill={r.ok ? `${C.ok}10` : `${C.remove}08`}
          stroke={r.ok ? C.ok : C.remove} strokeWidth={0.8} />
        <text x={77 + i * 140} y={42} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={r.ok ? C.ok : C.remove}>{r.tx}</text>
        <text x={77 + i * 140} y={58} textAnchor="middle" fontSize={10}
          fill={r.ok ? C.ok : C.remove}>
          {r.ok ? 'code=0 유지' : 'code!=0 제거'}
        </text>
      </motion.g>
    ))}
    <motion.text x={210} y={88} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      무효화된 TX₂가 다음 블록에 포함되는 것을 방지
    </motion.text>
  </g>);
}
