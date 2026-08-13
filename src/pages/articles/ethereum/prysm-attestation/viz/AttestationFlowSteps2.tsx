import { motion } from "framer-motion";
import { ActionBox, DataBox, ModuleBox } from "@/components/viz/boxes";
import { C } from "./AttestationFlowVizData";

const fade = (delay: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay } });
const Arrow = ({ x1, x2, color, delay }: { x1: number; x2: number; color: string; delay: number }) => <motion.line x1={x1} y1={34} x2={x2} y2={34} stroke={color} strokeWidth={0.8} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay }} />;

export function Step3() {
  return <g>
    <ModuleBox x={10} y={12} w={108} h={44} label="AttestationData" sub="head·source·target" color={C.sign} />
    <Arrow x1={118} x2={148} color={C.sign} delay={0.2} />
    <motion.g {...fade(0.3)}><ActionBox x={152} y={12} w={116} h={44} label="Slashing check" sub="intent 저장" color={C.sign} /></motion.g>
    <Arrow x1={268} x2={298} color={C.sign} delay={0.45} />
    <motion.g {...fade(0.55)}><DataBox x={302} y={19} w={108} h={30} label="BLS signature" color={C.sign} /></motion.g>
    <motion.text x={210} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.7)}>같은 target epoch의 conflicting vote는 서명 전에 차단</motion.text>
  </g>;
}

export function Step4() {
  return <g>
    <DataBox x={10} y={19} w={100} h={30} label="단일 vote" color={C.agg} />
    <Arrow x1={110} x2={142} color={C.agg} delay={0.2} />
    <motion.g {...fade(0.3)}><ActionBox x={146} y={12} w={124} h={44} label="Subnet·선정" sub="selection proof" color={C.agg} /></motion.g>
    <Arrow x1={270} x2={302} color={C.agg} delay={0.45} />
    <motion.g {...fade(0.55)}><ModuleBox x={306} y={12} w={104} h={44} label="Aggregator" sub="같은 data 수집" color={C.agg} /></motion.g>
    <motion.text x={210} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.7)}>routing은 부하를 나누고 vote 의미는 바꾸지 않음</motion.text>
  </g>;
}

export function Step5() {
  return <g>
    <DataBox x={10} y={19} w={104} h={30} label="집계 후보" color={C.block} />
    <Arrow x1={114} x2={144} color={C.block} delay={0.2} />
    <motion.g {...fade(0.3)}><ActionBox x={148} y={12} w={124} h={44} label="Subsumption" sub="동일 data·bit 포함" color={C.block} /></motion.g>
    <Arrow x1={272} x2={302} color={C.block} delay={0.45} />
    <motion.g {...fade(0.55)}><ModuleBox x={306} y={12} w={104} h={44} label="Block 포함" sub="fork별 limit" color={C.block} /></motion.g>
    <motion.text x={210} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.7)}>conflicting data는 합치지 않고 별도 검증</motion.text>
  </g>;
}
