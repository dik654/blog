import { motion } from 'framer-motion';

const C = { ind: '#6366f1', grn: '#10b981', amb: '#f59e0b' };
const F = { fg: 'var(--foreground)', muted: 'var(--muted-foreground)' };

export function OpcodeStep1() {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <rect x={20} y={10} width={480} height={22} rx={4}
        fill={`${C.grn}08`} stroke={C.grn} strokeWidth={0.8} />
      <text x={30} y={24} fontSize={10} fontWeight={600} fill={C.grn} fontFamily="monospace">
        Line 0: func opBlobBaseFee(pc, interpreter, scope) // 0x4A
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <rect x={20} y={40} width={480} height={22} rx={4}
          fill={`${C.ind}06`} stroke={C.ind} strokeWidth={0.6} />
        <text x={30} y={54} fontSize={10} fontWeight={600} fill={C.ind} fontFamily="monospace">
          Line 1: excess := interpreter.evm.Context.ExcessBlobGas  // 헤더에서 읽기
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={68} width={480} height={22} rx={4}
          fill={`${C.amb}06`} stroke={C.amb} strokeWidth={0.6} />
        <text x={30} y={82} fontSize={10} fontWeight={600} fill={C.amb} fontFamily="monospace">
          Line 2: fee := eip4844.CalcBlobFee(excess)  // fakeExponential 계산
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={20} y={96} width={480} height={22} rx={4}
          fill={`${C.grn}08`} stroke={C.grn} strokeWidth={0.8} />
        <text x={30} y={110} fontSize={10} fontWeight={600} fill={C.grn} fontFamily="monospace">
          Line 3: scope.Stack.push(fee)  // *big.Int → stack top에 push
        </text>
      </motion.g>
    </motion.g>
  );
}

export function OpcodeStep2() {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <rect x={20} y={10} width={480} height={22} rx={4}
        fill={`${C.amb}08`} stroke={C.amb} strokeWidth={0.8} />
      <text x={30} y={24} fontSize={10} fontWeight={600} fill={C.amb} fontFamily="monospace">
        Line 0: func enable4844(jt *JumpTable) // Cancun 하드포크
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <rect x={20} y={42} width={480} height={22} rx={4}
          fill={`${C.ind}06`} stroke={C.ind} strokeWidth={0.6} />
        <text x={30} y={56} fontSize={10} fontWeight={600} fill={C.ind} fontFamily="monospace">
          Line 1: jt[0x49] = operation{'{'}execute: opBlobHash, gas: 3, stack: 1→1{'}'}
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={70} width={480} height={22} rx={4}
          fill={`${C.grn}06`} stroke={C.grn} strokeWidth={0.6} />
        <text x={30} y={84} fontSize={10} fontWeight={600} fill={C.grn} fontFamily="monospace">
          Line 2: jt[0x4A] = operation{'{'}execute: opBlobBaseFee, gas: 3, stack: 0→1{'}'}
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <text x={20} y={110} fontSize={10} fill={F.muted}>
          core/vm/eips.go — Cancun 활성화 시 JumpTable에 신규 opcode 등록
        </text>
      </motion.g>
    </motion.g>
  );
}
