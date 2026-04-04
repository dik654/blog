import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: 주소 매핑으로 해결 */
export function StepAddrMap() {
  const precomps = [
    { addr: '0x01', name: 'ecRecover', gas: '3K' },
    { addr: '0x08', name: 'bn128Pair', gas: '~113K' },
    { addr: '0x0a', name: 'KZG Eval', gas: '50K' },
  ];
  return (<g>
    <ModuleBox x={15} y={22} w={85} h={45} label="EVM CALL" sub="to=0x08" color={C.evm} />
    <motion.line x1={105} y1={45} x2={145} y2={45} stroke={C.evm} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    {precomps.map((p, i) => (
      <motion.g key={p.addr} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 + 0.3 }}>
        <DataBox x={150} y={10 + i * 26} w={105} h={22} label={`${p.addr} ${p.name}`} color={C.native} />
        <text x={265} y={25 + i * 26} fontSize={10} fill={C.gas}>{p.gas}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <text x={350} y={40} fontSize={11} fill={C.native} fontWeight={600}>네이티브 실행</text>
      <text x={350} y={55} fontSize={10} fill="var(--muted-foreground)">바이트코드 건너뜀</text>
    </motion.g>
  </g>);
}

/* Step 4: 순수 Rust 구현 비교 */
export function StepPureRust() {
  return (<g>
    <ModuleBox x={20} y={20} w={160} h={48} label="Geth (CGo)" sub="bn256 C 바인딩 → FFI 복사" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ModuleBox x={220} y={20} w={170} h={48} label="revm (Rust)" sub="substrate-bn = 순수 Rust" color={C.native} />
    </motion.g>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.native}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      FFI 없이 크로스 컴파일 가능 — Precompile enum으로 디스패치
    </motion.text>
  </g>);
}
