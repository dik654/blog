import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './PrivateRPCVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 1</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <DataBox x={20} y={20} w={170} h={26} label="real: 0x1234.. getBalance" color={C.real} />
    </motion.g>
    <motion.text x={240} y={70} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      사용자의 실제 쿼리 — 서버에 직접 보내면 프라이버시 노출
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 2~3</text>
    <DataBox x={15} y={22} w={130} h={22} label="real: 0x1234.." color={C.real} />
    {[0, 1, 2].map((i) => (
      <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 + i * 0.15 }}>
        <DataBox x={15} y={50 + i * 28} w={130} h={22} label={`dummy: 0x${['a7f2', 'c3d1', 'e9b4'][i]}..`} color={C.dummy} />
      </motion.g>
    ))}
    <motion.text x={210} y={55} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      더미 K개 = 랜덤 주소/메서드
    </motion.text>
  </g>);
}

function Step2() {
  const labels = ['dummy: 0xc3d1..', 'real: 0x1234..', 'dummy: 0xa7f2..', 'dummy: 0xe9b4..'];
  const colors = [C.dummy, C.real, C.dummy, C.dummy];
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 4: shuffle()</text>
    <ActionBox x={15} y={20} w={80} h={28} label="shuffle()" sub="무작위" color={C.shuffle} />
    {labels.map((l, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + i * 0.12 }}>
        <DataBox x={115} y={20 + i * 26} w={140} h={20} label={l} color={colors[i]} />
      </motion.g>
    ))}
    <motion.text x={370} y={60} fontSize={10} fill={C.shuffle}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      순서로 추측 불가
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 5~6</text>
    <ActionBox x={15} y={22} w={120} h={32} label="batch_query()" sub="K+1개 전송" color={C.server} />
    <motion.line x1={140} y1={38} x2={180} y2={38} stroke={C.server} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={185} y={22} w={120} h={32} label="서버 응답" sub="K+1개 결과" color={C.server} />
    </motion.g>
    <motion.line x1={310} y1={38} x2={345} y2={38} stroke={C.real} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={350} y={25} w={110} h={26} label="진짜 결과 추출" color={C.real} />
    </motion.g>
    <motion.text x={240} y={82} textAnchor="middle" fontSize={10} fill={C.server}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      Pr(식별) = 1/(K+1) = 1/8
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function PrivateRPCViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 130" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
