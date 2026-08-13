import { motion } from "framer-motion";
import { ActionBox, DataBox, ModuleBox } from "@/components/viz/boxes";
import { C } from "./BlockProposalFlowVizData";

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

function Arrow({ x1, x2, color, delay }: { x1: number; x2: number; color: string; delay: number }) {
  return <motion.line x1={x1} y1={34} x2={x2} y2={34} stroke={color} strokeWidth={0.8} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay }} />;
}

export function Step3() {
  return <g>
    <ModuleBox x={10} y={12} w={104} h={44} label="Local EL" sub="payload 후보" color={C.deposit} />
    <Arrow x1={114} x2={144} color={C.deposit} delay={0.2} />
    <motion.g {...reveal(0.3)}><ActionBox x={148} y={12} w={124} h={44} label="Deadline·정책" sub="local / builder" color={C.deposit} /></motion.g>
    <Arrow x1={272} x2={302} color={C.deposit} delay={0.45} />
    <motion.g {...reveal(0.55)}><DataBox x={306} y={19} w={104} h={30} label="payload 선택" color={C.deposit} /></motion.g>
    <motion.text x={210} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...reveal(0.7)}>유효성·fork contract·남은 시간까지 receipt에 기록</motion.text>
  </g>;
}

export function Step4() {
  return <g>
    <ModuleBox x={10} y={12} w={106} h={44} label="Consensus fields" sub="operation·RANDAO" color={C.assemble} />
    <Arrow x1={116} x2={146} color={C.assemble} delay={0.2} />
    <motion.g {...reveal(0.3)}><ActionBox x={150} y={12} w={120} h={44} label="Fork schema 조립" sub="bounded body" color={C.assemble} /></motion.g>
    <Arrow x1={270} x2={300} color={C.assemble} delay={0.45} />
    <motion.g {...reveal(0.55)}><DataBox x={304} y={19} w={106} h={30} label="candidate block" color={C.assemble} /></motion.g>
    <motion.text x={210} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...reveal(0.7)}>post-state full root를 계산해 state_root를 채움</motion.text>
  </g>;
}

export function Step5() {
  return <g>
    <DataBox x={10} y={19} w={100} h={30} label="완성 block" color={C.sign} />
    <Arrow x1={110} x2={142} color={C.sign} delay={0.2} />
    <motion.g {...reveal(0.3)}><ActionBox x={146} y={12} w={124} h={44} label="Single sign" sub="durable identity" color={C.sign} /></motion.g>
    <Arrow x1={270} x2={302} color={C.sign} delay={0.45} />
    <motion.g {...reveal(0.55)}><ModuleBox x={306} y={12} w={104} h={44} label="Gossip publish" sub="같은 signed bytes" color={C.sign} /></motion.g>
    <motion.text x={210} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...reveal(0.7)}>timeout 뒤 다른 block을 재서명하지 않음</motion.text>
  </g>;
}
