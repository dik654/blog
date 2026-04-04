import { motion } from 'framer-motion';
import { DataBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './SignVerifyVizData';

const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { delay: d },
});

export function StepSign() {
  return (<g>
    <DataBox x={20} y={35} w={80} h={26} label="privKey(64B)" color={C.priv} />
    <DataBox x={20} y={68} w={80} h={26} label="msg" color="var(--muted-foreground)" />
    <motion.line x1={105} y1={50} x2={155} y2={50}
      stroke={C.priv} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.4)}>
      <ModuleBox x={160} y={28} w={110} h={48}
        label="ed25519.Sign()" sub="RFC 8032 · 2회 해시" color={C.priv} />
    </motion.g>
    <motion.line x1={275} y1={52} x2={320} y2={52}
      stroke={C.sig} strokeWidth={1} {...fade(0.7)} />
    <motion.g {...fade(0.9)}>
      <DataBox x={325} y={38} w={75} h={26} label="sig(64B)" color={C.sig} />
    </motion.g>
  </g>);
}

export function StepVerify() {
  return (<g>
    <DataBox x={10} y={25} w={75} h={24} label="pubKey(32B)" color={C.pub} />
    <DataBox x={10} y={55} w={55} h={24} label="msg" color="var(--muted-foreground)" />
    <DataBox x={70} y={55} w={55} h={24} label="sig(64B)" color={C.sig} />
    <motion.line x1={130} y1={48} x2={170} y2={48}
      stroke={C.pub} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.4)}>
      <ModuleBox x={175} y={25} w={120} h={48}
        label="ed25519.Verify()" sub="len(sig)==64 체크" color={C.pub} />
    </motion.g>
    <motion.line x1={300} y1={48} x2={330} y2={48}
      stroke={C.pub} strokeWidth={1} {...fade(0.7)} />
    <motion.g {...fade(0.9)}>
      <rect x={335} y={35} width={65} height={28} rx={14}
        fill={`${C.pub}15`} stroke={C.pub} strokeWidth={1} />
      <text x={367} y={53} textAnchor="middle" fontSize={11}
        fontWeight={600} fill={C.pub}>true</text>
    </motion.g>
  </g>);
}

export function StepAddr() {
  return (<g>
    <DataBox x={30} y={35} w={85} h={28} label="pubKey(32B)" color={C.pub} />
    <motion.line x1={120} y1={49} x2={160} y2={49}
      stroke={C.addr} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.4)}>
      <ModuleBox x={165} y={28} w={100} h={42}
        label="SHA256" sub="32 bytes" color={C.sig} />
    </motion.g>
    <motion.line x1={270} y1={49} x2={300} y2={49}
      stroke={C.addr} strokeWidth={1} {...fade(0.6)} />
    <motion.g {...fade(0.8)}>
      <DataBox x={305} y={35} w={90} h={28} label="[:20] = Address" color={C.addr} />
    </motion.g>
    <text x={210} y={85} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">
      tmhash.SumTruncated — 이더리움 주소와 동일 20B
    </text>
  </g>);
}
