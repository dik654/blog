import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b', CR = '#ef4444';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function SnapshotStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CV}>Snapshot — journal 위치 기록</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">snapshot := evm.StateDB.Snapshot()  // journal.length → #42</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// 이 시점 이후 상태 변경은 journal에 기록됨</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// 에러 발생 시 → RevertToSnapshot(#42)</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// journal을 #42까지 역순 실행하여 모든 상태 변경 복원</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          Snapshot은 상태 복사가 아닌 인덱스 기록 — O(1) 비용
        </text>
      </motion.g>
    </svg>
  );
}

export function TransferStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CA}>Transfer — ETH 잔액 이동</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if value.Sign() != 0 {'{'} // value가 0이 아닐 때 전송 수행</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">  db.SubBalance(caller, value)  // 1.5 ETH → 1.4 ETH</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">  db.AddBalance(addr, value)    // 0 ETH → 0.1 ETH</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill="var(--muted-foreground)" fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">{'}'} // 두 연산 모두 journal에 undo 엔트리 추가</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          SubBalance + AddBalance가 원자적으로 실행 — 중간에 실패하면 전부 롤백
        </text>
      </motion.g>
    </svg>
  );
}

export function PrecompileStep() {
  return (
    <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={15} y={16} fontSize={11} fontWeight={700} fill={CE}>Precompile 분기 — 네이티브 Go 실행</text>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={24} width={450} height={22} rx={4} fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={25} y={38} fontSize={10} fontWeight={600} fill={CV} fontFamily="monospace">Line 1:</text>
        <text x={80} y={38} fontSize={10} fill="var(--foreground)" fontFamily="monospace">p, isPrecompile := evm.precompile(addr)  // 0x01~0x0a 범위 체크</text>
      </motion.g>
      <motion.g {...slide(0.4)}>
        <rect x={15} y={52} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={66} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 2:</text>
        <text x={80} y={66} fontSize={10} fill="var(--foreground)" fontFamily="monospace">if isPrecompile {'{'} ret, gas, err = RunPrecompiledContract(p, input, gas)</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={15} y={80} width={450} height={22} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={25} y={94} fontSize={10} fontWeight={600} fill={CE} fontFamily="monospace">Line 3:</text>
        <text x={80} y={94} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// 0x01=ecRecover, 0x02=SHA256, 0x08=bn256Pairing ...</text>
      </motion.g>
      <motion.g {...slide(0.8)}>
        <rect x={15} y={108} width={450} height={22} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={25} y={122} fontSize={10} fontWeight={600} fill={CA} fontFamily="monospace">Line 4:</text>
        <text x={80} y={122} fontSize={10} fill="var(--foreground)" fontFamily="monospace">// EVM 바이트코드 해석 없이 네이티브 Go로 직접 실행</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <text x={15} y={150} fontSize={10} fill="var(--muted-foreground)">
          가스 비용이 고정이거나 입력 크기에 비례 — 복잡한 암호 연산을 저렴하게 제공
        </text>
      </motion.g>
    </svg>
  );
}
