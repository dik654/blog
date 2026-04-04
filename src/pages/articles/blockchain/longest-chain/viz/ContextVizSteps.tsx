import { motion } from 'framer-motion';
import { C } from './ContextVizData';

const f = { opacity: 0, y: 4 };
const t = (d: number) => ({ delay: d });

export function StepFork() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.fork}
      initial={f} animate={{ opacity: 1, y: 0 }}>상황: 포크(Fork) 발생</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Miner A: mine(#100, nonce_a) → #101A (t=12:00:01)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Miner B: mine(#100, nonce_b) → #101B (t=12:00:02)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.fork}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'네트워크 전파 지연 내 동시 생성 → 두 유효 블록'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'문제: parent(#101A) = parent(#101B) = #100'}
    </motion.text>
  </g>);
}

export function StepLongest() {
  return (<g>
    <motion.text x={15} y={18} fontSize={11} fontWeight={700} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }}>규칙: 최장 체인 선택 (GHOST 변형)</motion.text>
    <motion.text x={15} y={38} fontSize={10} fill="var(--foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.15)}>
      {'Chain A: #99→#100→#101A→#102A→#103A (len=5)'}
    </motion.text>
    <motion.text x={15} y={58} fontSize={10} fill={C.err}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.3)}>
      {'Chain B: #99→#100→#101B→#102B (len=4)'}
    </motion.text>
    <motion.text x={15} y={78} fontSize={10} fill={C.ok}
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.45)}>
      {'len(A) > len(B) → A가 정식 체인, B는 고아(orphan)'}
    </motion.text>
    <motion.text x={15} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={f} animate={{ opacity: 1, y: 0 }} transition={t(0.6)}>
      {'PoW: 해시 파워 51%+ 보유 시 최장 체인 지배'}
    </motion.text>
  </g>);
}
