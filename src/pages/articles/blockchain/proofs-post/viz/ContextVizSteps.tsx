import { motion } from 'framer-motion';
import { ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: PoSt란? */
export function StepWhat() {
  return (<g>
    <ActionBox x={20} y={25} w={130} h={48} label="PoRep (1회)" sub="봉인 시점에 증명" color={C.chain} />
    <motion.text x={170} y={50} fontSize={14} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>→</motion.text>
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={190} y={15} w={100} h={35} label="WindowPoSt" sub="정기 검증" color={C.window} />
      <ModuleBox x={190} y={56} w={100} h={35} label="WinningPoSt" sub="블록 보상" color={C.winning} />
    </motion.g>
    <motion.text x={340} y={50} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      반복 증명으로 지속 저장 보장
    </motion.text>
  </g>);
}

/* Step 1: WindowPoSt 48 데드라인 */
export function StepWindow() {
  return (<g>
    {Array.from({ length: 12 }, (_, i) => (
      <motion.rect key={i} x={15 + i * 33} y={30} width={28} height={30} rx={4}
        fill={i < 10 ? `${C.window}18` : `${C.chain}18`}
        stroke={i < 10 ? C.window : C.chain} strokeWidth={0.7}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.04 }} />
    ))}
    {Array.from({ length: 12 }, (_, i) => (
      <text key={`t${i}`} x={29 + i * 33} y={49} textAnchor="middle" fontSize={10}
        fill={i < 10 ? C.window : C.chain}>D{i}</text>
    ))}
    <text x={210} y={20} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      24시간 = 48 데드라인 (각 30분) — 12개만 표시
    </text>
    <text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.window}>
      각 데드라인에 파티션 증명 제출 필수
    </text>
  </g>);
}
