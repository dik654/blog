import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b', CR = '#ef4444';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function NewContractStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CA}>NewContract — 실행 컨텍스트 구성</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">c := NewContract(caller, addr, value, gas)</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">c.CallerAddress = caller.Address()  // 호출자 주소</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">c.SetCallCode(&codeHash, code)  // 대상 주소의 바이트코드 세팅</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// Contract가 ScopeContext에 전달되어 Run() 진입</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          Contract 구조체 = caller + address + value + gas + code — 한 번의 실행 단위
        </text>
      </motion.g>
    </svg>
  );
}

export function RunEntryStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CE}>Run() 호출 — depth++ 후 인터프리터 루프</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">evm.depth++  // 현재 깊이 1 → 2 (최대 1024)</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">stack := stackPool.Get()  // sync.Pool에서 Stack 할당</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">for {'{'} op = code[pc]; validate; gas; execute; pc++ {'}'} // 메인 루프</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">defer {'{'} evm.depth--; returnStack(stack) {'}'} // Pool에 반환</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          depth 1024 초과 시 ErrDepth — 재귀 호출 공격(stack bomb) 방지
        </text>
      </motion.g>
    </svg>
  );
}

export function ErrorHandleStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CR}>에러 처리 — REVERT vs OOG</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if err != nil {'{'} // Run() 반환 에러 확인</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">  if err == ErrExecutionReverted {'{'} gas = returnGas {'}'} // 잔여 가스 보존</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CR}08`} stroke={CR} strokeWidth={0.8} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CR} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">  else {'{'} gas = 0 {'}'} // OOG 등 → 가스 전량 소진</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CV}08`} stroke={CV} strokeWidth={0.8} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">  evm.StateDB.RevertToSnapshot(snapshot)  // 두 경우 모두 상태 원복</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          REVERT = 가스 돌려줌 (Solidity require/revert), OOG = 전량 몰수
        </text>
      </motion.g>
    </svg>
  );
}
