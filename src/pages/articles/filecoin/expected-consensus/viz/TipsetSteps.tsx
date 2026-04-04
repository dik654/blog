import { motion } from 'framer-motion';
import { C } from './TipsetVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

export function StepTipsetIntro() {
  const epochs = [
    { y: 15, blocks: 3, label: 'EN' },
    { y: 58, blocks: 2, label: 'EN-1' },
    { y: 101, blocks: 1, label: 'EN-2' },
  ];
  return (
    <g>
      {epochs.map((ep, ei) => (
        <motion.g key={ei} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: ei * 0.15, ...sp }}>
          <text x={18} y={ep.y + 22} fontSize={10} fill="currentColor" fillOpacity={0.4}>{ep.label}</text>
          {Array.from({ length: ep.blocks }).map((_, bi) => (
            <motion.rect key={bi} x={65 + bi * 85} y={ep.y} width={72} height={30} rx={6}
              fill={`${C.block}18`} stroke={C.block} strokeWidth={1.2}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: ei * 0.1 + bi * 0.05, ...sp }} />
          ))}
          {ei < 2 && (
            <line x1={100} y1={ep.y + 34} x2={100} y2={epochs[ei + 1].y - 4}
              stroke="var(--border)" strokeWidth={0.8} />
          )}
        </motion.g>
      ))}
      <motion.text x={330} y={30} fontSize={10} fill={C.block}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        에폭당 평균 5블록
      </motion.text>
      <motion.text x={330} y={48} fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.7 }}>
        Poisson 복수 당선
      </motion.text>
    </g>
  );
}

export function StepValidity() {
  const rules = [
    { label: '같은 에폭', sub: 'height 동일', color: C.block },
    { label: '같은 부모', sub: 'ParentTipSet 일치', color: C.weight },
    { label: '고유 마이너', sub: '에폭당 1인 1블록', color: C.f3 },
  ];
  return (
    <g>
      {rules.map((r, i) => (
        <motion.g key={r.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12, ...sp }}>
          <rect x={15 + i * 135} y={25} width={125} height={50} rx={6}
            fill={`${r.color}12`} stroke={r.color} strokeWidth={1} />
          <text x={77 + i * 135} y={48} textAnchor="middle" fontSize={11}
            fontWeight={600} fill={r.color}>{r.label}</text>
          <text x={77 + i * 135} y={64} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)">{r.sub}</text>
        </motion.g>
      ))}
      <motion.text x={210} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.5 }}>
        💡 WinCount=3이어도 블록은 1개만 — WinCount는 보상 계수
      </motion.text>
    </g>
  );
}
