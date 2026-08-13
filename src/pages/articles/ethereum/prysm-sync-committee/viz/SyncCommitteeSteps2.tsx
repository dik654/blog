import { motion } from "framer-motion";
import { ActionBox, DataBox, ModuleBox } from "@/components/viz/boxes";
import { C } from "./SyncCommitteeVizData";

const fade = (delay: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay } });
const Arrow = ({ x1, x2, color, delay }: { x1: number; x2: number; color: string; delay: number }) => <motion.line x1={x1} y1={34} x2={x2} y2={34} stroke={color} strokeWidth={0.8} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay }} />;

export function Step3() {
  return <g>
    <ModuleBox x={10} y={12} w={108} h={44} label="Head root" sub="slot 관찰 결과" color={C.sign} />
    <Arrow x1={118} x2={148} color={C.sign} delay={0.2} />
    <motion.g {...fade(0.3)}><ActionBox x={152} y={12} w={116} h={44} label="Sync domain" sub="fork·genesis 결합" color={C.sign} /></motion.g>
    <Arrow x1={268} x2={298} color={C.sign} delay={0.45} />
    <motion.g {...fade(0.55)}><DataBox x={302} y={19} w={108} h={30} label="96-byte signature" color={C.sign} /></motion.g>
    <motion.text x={210} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.7)}>attestation과 같은 root라도 signing identity는 다름</motion.text>
  </g>;
}

export function Step4() {
  return <g>
    <DataBox x={10} y={19} w={104} h={30} label="Subnet messages" color={C.agg} />
    <Arrow x1={114} x2={144} color={C.agg} delay={0.2} />
    <motion.g {...fade(0.3)}><ActionBox x={148} y={12} w={124} h={44} label="Local bit mapping" sub="같은 slot·root" color={C.agg} /></motion.g>
    <Arrow x1={272} x2={302} color={C.agg} delay={0.45} />
    <motion.g {...fade(0.55)}><ModuleBox x={306} y={12} w={104} h={44} label="Contribution" sub="subcommittee 집계" color={C.agg} /></motion.g>
    <motion.text x={210} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.7)}>중복 validator도 committee position별 bit로 보존</motion.text>
  </g>;
}

export function Step5() {
  return <g>
    <DataBox x={10} y={19} w={104} h={30} label="Contributions" color={C.reward} />
    <Arrow x1={114} x2={144} color={C.reward} delay={0.2} />
    <motion.g {...fade(0.3)}><ActionBox x={148} y={12} w={124} h={44} label="Global offset" sub="bits·pubkeys 결합" color={C.reward} /></motion.g>
    <Arrow x1={272} x2={302} color={C.reward} delay={0.45} />
    <motion.g {...fade(0.55)}><ModuleBox x={306} y={12} w={104} h={44} label="SyncAggregate" sub="block body 포함" color={C.reward} /></motion.g>
    <motion.text x={210} y={80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.7)}>light client는 trusted branch와 update 규칙도 함께 검증</motion.text>
  </g>;
}
