import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './StateCacheVizData';

export function Step0() {
  return (<g>
    <rect x={30} y={8} width={350} height={50} rx={8} fill="var(--card)" stroke={C.hot} strokeWidth={0.6} />
    <text x={205} y={26} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.hot}>매 슬롯 상태 저장 시</text>
    {['~300MB', '12초마다', '하루 ~2TB'].map((t, i) => (
      <motion.text key={t} x={80 + i * 120} y={46} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.hot}
        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 + 0.2 }}>
        {t}
      </motion.text>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <AlertBox x={130} y={68} w={150} h={30} label="전략적 저장 필수" color={C.hot} />
    </motion.g>
  </g>);
}

export function Step1() {
  const slots = [4800, 4801, 4802, 4803, 4804];
  return (<g>
    <ModuleBox x={100} y={3} w={200} h={30} label="Hot Region (인메모리)" sub="최근 수 에폭" color={C.hot} />
    {slots.map((s, i) => (
      <motion.g key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 + 0.2 }}>
        <rect x={30 + i * 72} y={48} width={60} height={28} rx={6}
          fill={`${C.hot}12`} stroke={C.hot} strokeWidth={0.6} />
        <text x={60 + i * 72} y={66} textAnchor="middle" fontSize={10} fill={C.hot}>{s}</text>
      </motion.g>
    ))}
    <motion.text x={200} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      메모리에서 즉시 접근 (O(1) 맵 조회)
    </motion.text>
  </g>);
}

export function Step2() {
  const slots = [4768, 4800, 4832, 4864];
  return (<g>
    <text x={205} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.epoch}>32슬롯마다 에폭 경계 상태 DB 저장</text>
    {slots.map((s, i) => (
      <motion.g key={s} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 + 0.2 }}>
        <rect x={25 + i * 92} y={28} width={80} height={32} rx={6}
          fill="var(--card)" stroke={C.epoch} strokeWidth={0.8} />
        <text x={65 + i * 92} y={43} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.epoch}>{s}</text>
        <text x={65 + i * 92} y={55} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">에폭 경계</text>
      </motion.g>
    ))}
    <motion.text x={205} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      나머지 슬롯은 저장하지 않음
    </motion.text>
  </g>);
}
