import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';
import { C } from './EpochPipelineVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  const slots = Array.from({ length: 6 }, (_, i) => i);
  return (<g>
    {slots.map((s, i) => (
      <motion.g key={i} {...fade(0.1 + i * 0.08)}>
        <rect x={15 + i * 60} y={10} width={50} height={28} rx={4}
          fill={i === 5 ? `${C.why}20` : `${C.why}08`}
          stroke={C.why} strokeWidth={i === 5 ? 1.2 : 0.5} />
        <text x={40 + i * 60} y={28} textAnchor="middle" fontSize={10}
          fill={C.why}>S{26 + s}</text>
      </motion.g>
    ))}
    <motion.g {...fade(0.6)}>
      <motion.line x1={345} y1={24} x2={375} y2={24} stroke={C.just} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
      <ActionBox x={380} y={8} w={75} h={32} label="에폭 전환" color={C.just} />
    </motion.g>
    <motion.text x={220} y={58} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.7)}>
      32슬롯(~6.4분)마다 보상·패널티 정산
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <ActionBox x={10} y={10} w={120} h={38} label="Justification" sub="2/3 투표 확인" color={C.just} />
    <motion.g {...fade(0.3)}>
      <StatusBox x={160} y={5} w={120} h={48} label="타겟 투표율" sub="66.7% 이상" color={C.just} progress={0.7} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <motion.line x1={280} y1={29} x2={310} y2={29} stroke={C.just} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <DataBox x={315} y={16} w={80} h={26} label="Finalized" color={C.just} />
    </motion.g>
    <motion.text x={220} y={72} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.7)}>
      justified → finalized 전환
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <ActionBox x={10} y={12} w={110} h={38} label="Inactivity" sub="Altair 도입" color={C.slash} />
    <motion.g {...fade(0.3)}>
      <motion.line x1={120} y1={31} x2={155} y2={31} stroke={C.slash} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <StatusBox x={160} y={8} w={120} h={46} label="비활성 점수" sub="누적 페널티" color={C.slash} progress={0.4} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <motion.line x1={280} y1={31} x2={310} y2={31} stroke={C.slash} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <DataBox x={315} y={18} w={85} h={26} label="복구 유도" color={C.slash} />
    </motion.g>
  </g>);
}
