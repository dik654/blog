import { motion } from 'framer-motion';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function PreCheckStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={C1}>사전 검증 — nonce·잔액·가스 구매</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${C1}06`} stroke={C1} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={C1} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if tx.Nonce != statedb.GetNonce(sender) {'{'} return ErrNonceTooHigh {'}'}</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${C3}06`} stroke={C3} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={C3} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">cost = gasLimit * gasPrice + value  // 100000×10gwei + 0.1 ETH</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${C3}06`} stroke={C3} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={C3} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if balance {'<'} cost {'{'} return ErrInsufficientFunds {'}'}</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${C2}08`} stroke={C2} strokeWidth={0.8} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={C2} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">st.state.SubBalance(sender, cost)  // 1.5 → 0.5 ETH</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <rect x={15} y={136} width={450} height={22} rx={4} fill={`${C2}08`} stroke={C2} strokeWidth={0.8} />
        <text x={25} y={150} fontSize={10} fontWeight={600} fill={C2} fontFamily="monospace">Line 5:</text>
        <text x={80} y={150} fontSize={10} fill="var(--foreground)" fontFamily="monospace">st.gasRemaining = gasLimit  // gasRemaining = 100,000</text>
      </motion.g>
    </svg>
  );
}

export function IntrinsicGasStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={C3}>내재 가스 차감 — IntrinsicGas()</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${C1}06`} stroke={C1} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={C1} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">gas := TxGas  // 21,000 (기본 비용)</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${C1}06`} stroke={C1} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={C1} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">for _, b := range data {'{'} if b != 0 {'{'} gas += 16 {'}'} else {'{'} gas += 4 {'}'} {'}'}</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${C3}06`} stroke={C3} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={C3} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">gas += 16*16 + 4*4 = 272  // non-zero 16개, zero 4개</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${C2}08`} stroke={C2} strokeWidth={0.8} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={C2} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">st.gasRemaining -= gas  // 100,000 - 21,272 = 78,728</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          데이터가 길수록 내재 가스 증가 — 비용이 낮은 검사를 먼저 수행
        </text>
      </motion.g>
    </svg>
  );
}

export function CallSetupStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={C2}>스냅샷 + ETH 전송 — Call() 진입</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${C1}06`} stroke={C1} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={C1} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">snapshot := evm.StateDB.Snapshot()  // journal 위치 #42 기록</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${C3}06`} stroke={C3} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={C3} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">evm.StateDB.SubBalance(caller, value)  // sender: 0.5 → 0.4 ETH</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${C3}06`} stroke={C3} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={C3} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">evm.StateDB.AddBalance(addr, value)  // receiver: 0 → 0.1 ETH</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${C2}08`} stroke={C2} strokeWidth={0.8} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={C2} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">ret, gas, err := evm.interpreter.Run(contract, input, false)</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <rect x={15} y={136} width={450} height={22} rx={4} fill={`${C1}06`} stroke={C1} strokeWidth={0.6} />
        <text x={25} y={150} fontSize={10} fontWeight={600} fill={C1} fontFamily="monospace">Line 5:</text>
        <text x={80} y={150} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if err != nil {'{'} evm.StateDB.RevertToSnapshot(snapshot) {'}'} // 롤백</text>
      </motion.g>
    </svg>
  );
}
