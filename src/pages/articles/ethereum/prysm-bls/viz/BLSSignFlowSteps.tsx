import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './BLSSignFlowVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  return (<g>
    <DataBox x={20} y={10} w={80} h={26} label="sig 1" color={C.sign} />
    <DataBox x={110} y={10} w={80} h={26} label="sig 2" color={C.sign} />
    <DataBox x={200} y={10} w={80} h={26} label="sig N" color={C.sign} />
    <motion.g {...fade(0.3)}>
      {[0, 1, 2].map(i => (
        <motion.line key={i} x1={60 + i * 90} y1={36} x2={180} y2={55}
          stroke={C.agg} strokeWidth={0.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 + i * 0.1 }} />
      ))}
    </motion.g>
    <motion.g {...fade(0.5)}>
      <ActionBox x={130} y={55} w={100} h={30} label="덧셈으로 집계" color={C.agg} />
    </motion.g>
    <motion.text x={180} y={100} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.7)}>
      수천 서명 → 1개 집계 서명 (48B)
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <ModuleBox x={20} y={10} w={110} h={44} label="BLS12-381" sub="패어링 커브" color={C.curve} />
    <motion.g {...fade(0.3)}>
      <DataBox x={160} y={5} w={80} h={22} label="G1 (48B)" color={C.curve} />
      <DataBox x={160} y={32} w={80} h={22} label="G2 (96B)" color={C.curve} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <motion.line x1={240} y1={16} x2={270} y2={30} stroke={C.curve} strokeWidth={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <motion.line x1={240} y1={43} x2={270} y2={30} stroke={C.curve} strokeWidth={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <DataBox x={275} y={18} w={80} h={26} label="GT 패어링" color={C.curve} />
    </motion.g>
    <motion.text x={200} y={75} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.7)}>
      128비트 보안
    </motion.text>
  </g>);
}

export function Step2() {
  const layers = ['Go', 'CGo', 'blst (C/asm)'];
  return (<g>
    {layers.map((l, i) => (
      <motion.g key={i} {...fade(0.2 + i * 0.2)}>
        {i > 0 && <motion.line x1={55 + (i - 1) * 130 + 110} y1={32} x2={55 + i * 130} y2={32}
          stroke={C.bind} strokeWidth={0.7}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 + i * 0.2 }} />}
        <ModuleBox x={55 + i * 130} y={10} w={110} h={44} label={l}
          sub={i === 2 ? '~10x 빠른 패어링' : undefined} color={C.bind} />
      </motion.g>
    ))}
  </g>);
}
