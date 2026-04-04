import { motion } from 'framer-motion';
import { C } from './ProposerVizData';

export function Step0() {
  const vals = [
    { name: 'Val A', vp: 40 },
    { name: 'Val B', vp: 30 },
    { name: 'Val C', vp: 30 },
  ];
  return (<g>
    <text x={210} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
      ValidatorSet (TotalVP = 100)
    </text>
    {vals.map((v, i) => (
      <motion.g key={v.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={30 + i * 130} y={28} width={110} height={45} rx={6}
          fill="var(--card)" stroke={C.val} strokeWidth={0.6} />
        <text x={85 + i * 130} y={45} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.val}>{v.name}</text>
        <text x={85 + i * 130} y={63} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          VP={v.vp}, priority=0
        </text>
      </motion.g>
    ))}
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      초기 상태: 모든 ProposerPriority = 0
    </text>
  </g>);
}

export function Step1() {
  const vals = [
    { name: 'Val A', vp: 40, pr: 40, hi: true },
    { name: 'Val B', vp: 30, pr: 30, hi: false },
    { name: 'Val C', vp: 30, pr: 30, hi: false },
  ];
  return (<g>
    <text x={210} y={16} textAnchor="middle" fontSize={10} fill={C.ok}>
      priority += VotingPower (각자의 VP를 더함)
    </text>
    {vals.map((v, i) => (
      <motion.g key={v.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.15 }}>
        <rect x={30 + i * 130} y={28} width={110} height={45} rx={6}
          fill="var(--card)" stroke={v.hi ? C.hi : C.val} strokeWidth={v.hi ? 1.5 : 0.6} />
        <text x={85 + i * 130} y={45} textAnchor="middle" fontSize={11} fontWeight={600}
          fill={v.hi ? C.hi : C.val}>{v.name}</text>
        <motion.text x={85 + i * 130} y={63} textAnchor="middle" fontSize={10}
          fill={v.hi ? C.hi : 'var(--muted-foreground)'}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 + 0.3 }}>
          {'priority \u2192 '}{v.pr}
        </motion.text>
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.hi} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      Val A = 가장 높은 priority (40)
    </motion.text>
  </g>);
}

export function Step2() {
  const vals = [
    { name: 'Val A', pr: -60, selected: true },
    { name: 'Val B', pr: 30, selected: false },
    { name: 'Val C', pr: 30, selected: false },
  ];
  return (<g>
    <text x={210} y={16} textAnchor="middle" fontSize={10} fill={C.ok}>
      선택된 제안자: priority -= TotalVP(100)
    </text>
    {vals.map((v, i) => (
      <motion.g key={v.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={30 + i * 130} y={28} width={110} height={45} rx={6}
          fill={v.selected ? `${C.ok}10` : 'var(--card)'}
          stroke={v.selected ? C.ok : C.val} strokeWidth={v.selected ? 1.5 : 0.6} />
        <text x={85 + i * 130} y={45} textAnchor="middle" fontSize={11} fontWeight={600}
          fill={v.selected ? C.ok : C.val}>{v.name}</text>
        <text x={85 + i * 130} y={63} textAnchor="middle" fontSize={10}
          fill={v.pr < 0 ? '#ef4444' : 'var(--muted-foreground)'}>
          priority = {v.pr}
        </text>
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      다음 라운드: B 또는 C가 제안자 (A는 priority가 낮아 뒤로)
    </motion.text>
  </g>);
}
