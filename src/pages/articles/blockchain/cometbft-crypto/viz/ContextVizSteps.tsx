import { motion } from 'framer-motion';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepWhy() {
  const prims = [
    { label: 'Ed25519 서명', color: C.sig },
    { label: 'Merkle 증명', color: C.merkle },
    { label: 'TMHASH', color: C.hash },
  ];
  return (<g>
    <ModuleBox x={130} y={10} w={160} h={45} label="CometBFT 암호 프리미티브" sub="인증 · 무결성 · 증명" color={C.ok} />
    {prims.map((p, i) => (
      <motion.g key={p.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 + 0.3 }}>
        <DataBox x={30 + i * 135} y={72} w={115} h={28} label={p.label} color={p.color} />
      </motion.g>
    ))}
  </g>);
}

export function StepProblem() {
  return (<g>
    <rect x={30} y={25} width={160} height={40} rx={6} fill="var(--card)" stroke={C.sig} strokeWidth={0.8} />
    <text x={110} y={42} textAnchor="middle" fontSize={10} fill={C.sig}>검증자 A의 투표</text>
    <text x={110} y={55} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">서명 없음</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <AlertBox x={230} y={25} w={155} h={40} label="악의적 노드: 위조 가능" sub="A 명의로 가짜 투표" color={C.err} />
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.merkle} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      Ed25519 서명으로 위조 방지
    </motion.text>
  </g>);
}

export function StepEd25519() {
  return (<g>
    <DataBox x={15} y={30} w={75} h={28} label="privKey(64B)" color={C.sig} />
    <motion.line x1={95} y1={44} x2={140} y2={44} stroke={C.sig} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={145} y={22} w={90} h={42} label="ed25519.Sign" sub="msg → sig" color={C.sig} />
    </motion.g>
    <motion.line x1={240} y1={44} x2={280} y2={44} stroke={C.sig} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={285} y={30} w={75} h={28} label="sig(64B)" color={C.hash} />
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      Address = SHA256(pubKey)[:20] — TMHASH 트렁케이션
    </motion.text>
  </g>);
}
