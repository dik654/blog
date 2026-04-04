import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function ScopeCreateStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CV}>ScopeContext 생성 — sync.Pool 재사용</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">stack := stackPool.Get().(*Stack)  // sync.Pool에서 가져옴</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">mem := NewMemory()  // 초기 크기 0, 필요 시 32byte 단위 확장</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">scope := ScopeContext{'{'}Stack: stack, Memory: mem, Contract: contract{'}'}</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">defer returnStack(stack)  // 호출 종료 시 Pool에 반환</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          GC 압력 최소화 — 매 호출마다 Stack/Memory를 새로 할당하지 않음
        </text>
      </motion.g>
    </svg>
  );
}

export function FetchStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CV}>Fetch — PC가 가리키는 opcode 읽기</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">op = contract.GetOp(pc)  // code[0] → 0x60</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">operation = in.table[op]  // JumpTable[0x60] → PUSH1 핸들러</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">operation.execute = opPush1  // 실행 함수 포인터</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">operation.constantGas = 3   // PUSH1 고정 가스 비용</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <rect x={15} y={136} width={450} height={22} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={25} y={150} fontSize={10} fontWeight={600} fill="var(--muted-foreground)" fontFamily="monospace">Line 5:</text>
        <text x={80} y={150} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">minStack=0, maxStack=1  // 스택 검증 범위</text>
      </motion.g>
    </svg>
  );
}

export function DecodeStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CV}>Decode — JumpTable 룩업 + 스택 검증</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">sLen := stack.Len()  // 현재 스택 깊이 확인</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if sLen {'<'} op.minStack {'{'} return ErrStackUnderflow {'}'}</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if sLen + op.maxStack {'>'} 1024 {'{'} return ErrStackOverflow {'}'}</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// JumpTable은 하드포크별 별도 — cancunInstructionSet 등</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          스택 최대 깊이 1024 — 넘기면 EVM 실행 즉시 중단
        </text>
      </motion.g>
    </svg>
  );
}
