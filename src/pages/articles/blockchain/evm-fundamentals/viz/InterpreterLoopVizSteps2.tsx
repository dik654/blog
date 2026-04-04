import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b', CR = '#ef4444';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function GasStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CA}>Gas 차감 — constantGas + dynamicGas</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">cost := operation.constantGas  // ADD → 3</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if op.dynamicGas != nil {'{'} cost += memoryGasCost(mem, size) {'}'}</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// memoryGasCost = 3*words + words*words/512 (이차 증가)</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CR}08`} stroke={CR} strokeWidth={0.8} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CR} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if contract.Gas {'<'} cost {'{'} return ErrOutOfGas {'}'} // 즉시 루프 종료</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <rect x={15} y={136} width={450} height={22} rx={4} fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={25} y={150} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 5:</text>
        <text x={80} y={150} fontSize={10} fill="var(--foreground)" fontFamily="monospace">contract.Gas -= cost  // 78,728 - 3 = 78,725</text>
      </motion.g>
    </svg>
  );
}

export function ExecuteStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CA}>Execute — opAdd() 실행 (할당 0회)</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">x := scope.Stack.pop()   // x = 0x80</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">y := scope.Stack.peek()  // y = 0x40 (스택 top 참조, pop 안 함)</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">y.Add(&x, y)  // y에 직접 덮어씀 → stack top = 0xC0</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill="var(--muted-foreground)" fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">// 결과를 peek() 위치에 직접 기록 — 메모리 할당 0회 최적화</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          uint256 연산은 holiman/uint256 — 4개 uint64로 구현
        </text>
      </motion.g>
    </svg>
  );
}

export function LoopBackStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CE}>pc++ & loop — 다음 opcode로 전진</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">pc++  // PUSH1이면 pc += 2 (operand 건너뜀)</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">for {'{'} op = code[pc]; ... {'}'} // STOP/RETURN/REVERT까지 반복</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if op == STOP {'{'} return nil, nil {'}'} // 정상 종료</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CR}06`} stroke={CR} strokeWidth={0.6} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CR} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if op == REVERT {'{'} return ret, ErrExecutionReverted {'}'} // 가스 보존</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          Fetch → Decode → Gas → Execute → pc++ 의 5단계가 매 opcode마다 반복
        </text>
      </motion.g>
    </svg>
  );
}
