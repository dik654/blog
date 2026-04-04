import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './AttestationFlowVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  return (<g>
    <ModuleBox x={40} y={10} w={130} h={48} label="LMD-GHOST" sub="포크 선택 가중치" color={C.commit} />
    <ModuleBox x={230} y={10} w={130} h={48} label="Casper FFG" sub="최종 확정 투표" color={C.why} />
    <motion.line x1={170} y1={34} x2={230} y2={34} stroke={C.commit} strokeWidth={1} {...fade(0.3)} />
    <motion.g {...fade(0.4)}>
      <DataBox x={115} y={72} w={170} h={30} label="매 에폭 1회 투표 = 합의 결정" color={C.why} />
    </motion.g>
  </g>);
}

export function Step1() {
  const slots = [0, 1, 2, 3];
  return (<g>
    <ModuleBox x={10} y={8} w={90} h={42} label="에폭 시작" sub="셔플 시드" color={C.commit} />
    <motion.line x1={100} y1={29} x2={135} y2={29} stroke={C.commit} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <ActionBox x={140} y={8} w={105} h={42} label="위원회 배정" sub="64개 위원회" color={C.commit} />
    </motion.g>
    {slots.map((s, i) => (
      <motion.g key={i} {...fade(0.4 + i * 0.1)}>
        <rect x={280 + i * 42} y={14} width={36} height={30} rx={4}
          fill={`${C.data}12`} stroke={C.data} strokeWidth={0.8} />
        <text x={298 + i * 42} y={33} textAnchor="middle" fontSize={10} fill={C.data}>S{s}</text>
      </motion.g>
    ))}
    <text x={298} y={60} fontSize={8} fill="var(--muted-foreground)">슬롯에 매핑</text>
  </g>);
}

export function Step2() {
  const fields = ['source CP', 'target CP', 'head root'];
  return (<g>
    <ModuleBox x={10} y={15} w={100} h={42} label="AttestData" sub="투표 데이터 구조" color={C.data} />
    {fields.map((f, i) => (
      <motion.g key={i} {...fade(0.3 + i * 0.15)}>
        <motion.line x1={110} y1={36} x2={150} y2={18 + i * 25} stroke={C.data} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 + i * 0.15 }} />
        <DataBox x={155} y={6 + i * 25} w={100} h={22} label={f} color={C.data} />
      </motion.g>
    ))}
    <motion.g {...fade(0.8)}>
      <text x={300} y={25} fontSize={8} fill="var(--muted-foreground)">이전 justified</text>
      <text x={300} y={50} fontSize={8} fill="var(--muted-foreground)">현재 에폭</text>
      <text x={300} y={75} fontSize={8} fill="var(--muted-foreground)">블록 루트</text>
    </motion.g>
  </g>);
}
