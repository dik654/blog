import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './NoteStructVizData';

function Step0() {
  const fields = [
    { label: 'npk', color: C.npk, y: 20 },
    { label: 'token', color: C.token, y: 48 },
    { label: 'value', color: C.value, y: 76 },
    { label: 'random', color: C.random, y: 104 },
  ];
  return (<g>
    <text x={30} y={15} fontSize={11} fontWeight={700} fill="var(--foreground)">struct Note</text>
    {fields.map((f, i) => (
      <motion.g key={f.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <DataBox x={30} y={f.y} w={80} h={22} label={f.label} color={f.color} />
        <text x={125} y={f.y + 14} fontSize={10} fill="var(--muted-foreground)">bytes32</text>
      </motion.g>
    ))}
  </g>);
}

function Step1() {
  return (<g>
    <ActionBox x={20} y={20} w={120} h={40} label="poseidon(sk)" sub="spendingKey 해시" color={C.npk} />
    <motion.line x1={145} y1={40} x2={195} y2={40} stroke={C.npk} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={200} y={27} w={140} h={26} label="npk = 0xa3f2..e7b1" color={C.npk} />
    </motion.g>
    <motion.text x={240} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      spendingKey(비밀) → npk(공개). 역산 불가.
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <DataBox x={30} y={30} w={150} h={26} label="token = 0xA0b8..USDC" color={C.token} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={210} y={25} width={220} height={35} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={220} y={42} fontSize={10} fill="var(--muted-foreground)">commitment 해시 안에 포함</text>
      <text x={220} y={54} fontSize={10} fill={C.token}>→ 외부에서 토큰 종류 판별 불가</text>
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <DataBox x={30} y={30} w={130} h={26} label="value = 1000" color={C.value} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={190} y={25} width={240} height={35} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={200} y={42} fontSize={10} fill="var(--muted-foreground)">USDC 1000개. 해시에 포함되어 은닉</text>
      <text x={200} y={54} fontSize={10} fill={C.value}>→ 금액을 아는 건 Note 소유자뿐</text>
    </motion.g>
  </g>);
}

function Step4() {
  return (<g>
    <DataBox x={20} y={25} w={150} h={26} label="random = 0x7b1e.." color={C.random} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <DataBox x={200} y={15} w={130} h={22} label="commit A = 0x2d8a.." color={C.random} />
      <DataBox x={200} y={45} w={130} h={22} label="commit B = 0x91fc.." color={C.random} />
      <text x={350} y={27} fontSize={10} fill="var(--muted-foreground)">같은 값</text>
      <text x={350} y={57} fontSize={10} fill="var(--muted-foreground)">다른 random</text>
    </motion.g>
    <motion.text x={240} y={90} textAnchor="middle" fontSize={10} fill={C.random}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      → 다른 commitment. 패턴 분석 차단.
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function NoteStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
