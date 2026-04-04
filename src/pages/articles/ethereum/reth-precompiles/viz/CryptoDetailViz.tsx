import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './CryptoDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      CALL → 주소 체크
    </text>
    <text x={20} y={42} fontSize={10} fill={C.call}>
      Line 1: if to &gt;= 0x01 &amp;&amp; to &lt;= 0x0a {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.hash}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     let precompile = map.get(to)?  // HashMap 조회
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.hash}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     return precompile.call(input, gas_limit)
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.call}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'}  // 바이트코드 실행 건너뜀
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      gas_limit 체크
    </text>
    <text x={20} y={42} fontSize={10} fill={C.pair}>
      Line 1: let required_gas = base_gas + input.len() * per_byte
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.pair}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // bn128 pairing: 34,000 * k + 45,000 (k=쌍 수)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.pair}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: if gas_limit &lt; required_gas {'{'} return Err(OOG) {'}'}
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      실행 전에 가스 부족을 차단
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      ecRecover (0x01) — secp256k1 서명 복구
    </text>
    <text x={20} y={42} fontSize={10} fill={C.curve}>
      Line 1: let input = (hash: [u8;32], v, r, s)  // 128 bytes
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.curve}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let pubkey = secp256k1::recover(hash, v, r, s)?
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.out}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: let addr = keccak256(pubkey)[12..]  // 하위 20B
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      가스 3,000 고정 — TX 서명 검증의 핵심
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      bn128 Pairing (0x08) — 배치 pairing
    </text>
    <text x={20} y={42} fontSize={10} fill={C.pair}>
      Line 1: let pairs: Vec&lt;(G1, G2)&gt; = parse_input(input)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.pair}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let result = bn128::pairing_check(&amp;pairs)?
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.curve}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // result == 1 → 검증 성공 (32B 출력)
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      substrate-bn으로 pairing 계산 — ZK 검증의 핵심
    </motion.text>
  </g>);
}

function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      결과 반환 → EVM 스택
    </text>
    <text x={20} y={42} fontSize={10} fill={C.out}>
      Line 1: return PrecompileOutput {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.out}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     gas_used: 3_000,  // ecRecover 기준
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.out}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     bytes: address.to_vec(),  // 32B or 64B
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.out}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'}  // EVM stack: success=1 + output
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function CryptoDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
