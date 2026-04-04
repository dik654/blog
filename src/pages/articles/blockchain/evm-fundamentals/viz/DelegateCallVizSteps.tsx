import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b', CR = '#ef4444';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function DelegateCallStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CA}>DelegateCall — B의 코드를 A의 컨텍스트에서 실행</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">contract := NewContract(caller, addr, value, gas)</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">contract.AsDelegate()  // caller/value/address를 부모 것으로 교체</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">contract.SetCallCode(&codeHash, addrCode)  // B의 코드만 가져옴</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">ret, gas, err = interpreter.Run(contract, input, false)</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          SLOAD/SSTORE가 A의 storage에 접근 — 프록시 패턴의 핵심 구현 원리
        </text>
      </motion.g>
    </svg>
  );
}

export function AsDelegateStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CV}>AsDelegate() — 3개 필드 부모 것으로 교체</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">c.CallerAddress = parent.CallerAddress  // msg.sender 유지</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">c.value = parent.value  // msg.value 유지</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">c.self.Address = parent.self.Address  // storage 주소를 부모로</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill="var(--muted-foreground)" fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">// self.Address가 부모 주소 → SLOAD/SSTORE 시 부모 storage 접근</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          핵심: 코드만 타겟에서 빌리고, 실행 환경은 호출자 것 — 프록시 업그레이드
        </text>
      </motion.g>
    </svg>
  );
}

export function StaticCallStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CE}>StaticCall — readOnly 모드</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">ret, gas, err = interpreter.Run(contract, input, true) // readOnly</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CR}06`} stroke={CR} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CR} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if readOnly && op.writes {'{'} return ErrWriteProtection {'}'}</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CR}06`} stroke={CR} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CR} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// 금지: SSTORE, CREATE, CREATE2, SELFDESTRUCT, LOG0~4</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// Solidity view/pure 함수에서 사용 — 상태 읽기만 허용</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          하위 호출에도 readOnly 전파 — 중첩 호출에서도 쓰기 불가
        </text>
      </motion.g>
    </svg>
  );
}

export function SelfdestructStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CR}>SELFDESTRUCT (EIP-6780) — Cancun 이후 동작 변경</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CR}06`} stroke={CR} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CR} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">balance := statedb.GetBalance(contract.Address())</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">statedb.AddBalance(beneficiary, balance)  // 잔액 전송</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if statedb.WasCreatedInCurrentTx(addr) {'{'} // 같은 tx에서 생성?</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CR}08`} stroke={CR} strokeWidth={0.8} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CR} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">  statedb.Suicide(addr) {'}'} // 같은 tx면 계정 파괴, 아니면 잔액만 이동</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          EIP-6780: 기존 컨트랙트는 파괴 불가 — created-in-tx 플래그로 판별
        </text>
      </motion.g>
    </svg>
  );
}
