import { motion } from 'framer-motion';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function RunLoopStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={C1}>인터프리터 메인 루프 — PUSH1 3, PUSH1 5, ADD</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${C1}06`} stroke={C1} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={C1} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">op = contract.Code[pc]  // 0x60 = PUSH1 (pc=0)</text>
      </motion.g>
      <motion.g {...slide(0.3)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${C2}06`} stroke={C2} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={C2} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">stack.push(code[pc+1])  // push 0x03 (= 3), gas -= 3</text>
      </motion.g>
      <motion.g {...slide(0.5)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${C2}06`} stroke={C2} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={C2} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">stack.push(code[pc+1])  // push 0x05 (= 5), gas -= 3</text>
      </motion.g>
      <motion.g {...slide(0.7)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${C3}08`} stroke={C3} strokeWidth={0.8} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={C3} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">x, y := stack.pop(), stack.peek()  // x=5, y=3</text>
      </motion.g>
      <motion.g {...fade(0.9)}>
        <rect x={15} y={136} width={450} height={22} rx={4} fill={`${C3}08`} stroke={C3} strokeWidth={0.8} />
        <text x={25} y={150} fontSize={10} fontWeight={600} fill={C3} fontFamily="monospace">Line 5:</text>
        <text x={80} y={150} fontSize={10} fill="var(--foreground)" fontFamily="monospace">y.Add(&x, y)  // stack top = 0x08 (= 8), 할당 0회</text>
      </motion.g>
    </svg>
  );
}

export function RefundStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={C2}>가스 정산 — refundGas()</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${C1}06`} stroke={C1} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={C1} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">gasUsed := gasLimit - st.gasRemaining  // 100,000 - 78,680 = 21,320</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${C3}06`} stroke={C3} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={C3} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">refund := min(st.refund, gasUsed / 5)  // min(x, 4264)</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${C2}08`} stroke={C2} strokeWidth={0.8} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={C2} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">st.gasRemaining += refund  // 잔여 가스에 환불 합산</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${C2}06`} stroke={C2} strokeWidth={0.6} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={C2} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">st.state.AddBalance(sender, remaining * gasPrice)  // → 0.787 ETH</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <rect x={15} y={136} width={450} height={22} rx={4} fill={`${C3}06`} stroke={C3} strokeWidth={0.6} />
        <text x={25} y={150} fontSize={10} fontWeight={600} fill={C3} fontFamily="monospace">Line 5:</text>
        <text x={80} y={150} fontSize={10} fill="var(--foreground)" fontFamily="monospace">st.state.AddBalance(coinbase, effectiveTip * gasUsed) // 제안자 수수료</text>
      </motion.g>
    </svg>
  );
}
