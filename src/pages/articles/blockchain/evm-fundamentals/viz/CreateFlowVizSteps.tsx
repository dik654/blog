import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b', CR = '#ef4444';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function AddressGenStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CV}>주소 생성 — CREATE vs CREATE2</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// CREATE: addr = keccak256(rlp(sender, nonce))[12:]</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">addr = crypto.CreateAddress(caller, nonce)  // nonce 의존 → 비결정적</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// CREATE2: addr = keccak256(0xff ++ sender ++ salt ++ codeHash)[12:]</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">addr = crypto.CreateAddress2(caller, salt, codeHash)  // salt → 결정적</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          CREATE2는 배포 전에 주소를 미리 계산 가능 — counterfactual deployment
        </text>
      </motion.g>
    </svg>
  );
}

export function InitCodeStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CA}>Init Code 실행 — 생성자 바이트코드</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">contract := NewContract(caller, newAddr, value, gas)</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">contract.SetCodeOptionalHash(nil, initCode)  // init code 세팅</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">ret, err = evm.interpreter.Run(contract, nil, false)  // init 실행</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// RETURN → ret = 런타임 바이트코드 (실제 배포될 코드)</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          init code = 생성자 실행, RETURN 데이터 = 런타임 코드
        </text>
      </motion.g>
    </svg>
  );
}

export function CodeLimitStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CA}>코드 크기 제한 — EIP-170, EIP-3860</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if len(ret) {'>'} MaxCodeSize {'{'} // EIP-170: 런타임 코드 &le; 24KB</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if len(initCode) {'>'} 2*MaxCodeSize {'{'} // EIP-3860: init &le; 48KB</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">createGas += 2 * len(initCode) / 32  // EIP-3860: word당 2gas</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">codeCost := 200 * len(ret)  // 배포 비용: 바이트당 200gas</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          상태 DB 비대화 방지 — 큰 컨트랙트일수록 배포 가스 비용 증가
        </text>
      </motion.g>
    </svg>
  );
}

export function CreateErrorStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CR}>CREATE 에러 처리 — 실패 시 롤백</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CR}06`} stroke={CR} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CR} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if err != nil {'{'} evm.StateDB.RevertToSnapshot(snapshot) {'}'}</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if len(ret) {'>'} MaxCodeSize {'{'} err = ErrMaxCodeSizeExceeded {'}'}</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if err == nil {'{'} evm.StateDB.SetCode(addr, ret) {'}'} // 런타임 코드 저장</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">return ret, addr, gas, err  // 성공 시 새 컨트랙트 주소 반환</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          실패 → Snapshot 롤백 + 계정 삭제, 성공 → StateDB에 런타임 코드 영구 저장
        </text>
      </motion.g>
    </svg>
  );
}
