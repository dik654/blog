import { motion } from 'framer-motion';
import { AlertBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: EVM 바이트코드의 한계 */
export function StepEvmLimit() {
  const ops = ['ADD', 'MUL', 'SHA3'];
  return (<g>
    <ModuleBox x={30} y={20} w={100} h={45} label="EVM" sub="범용 opcode" color={C.evm} />
    {ops.map((op, i) => (
      <motion.g key={op} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={160} y={15 + i * 25} width={55} height={18} rx={9}
          fill={`${C.evm}12`} stroke={C.evm} strokeWidth={0.7} />
        <text x={187} y={28 + i * 25} textAnchor="middle" fontSize={10} fill={C.evm}>{op}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <AlertBox x={250} y={25} w={140} h={45} label="bn128 Pairing" sub="~10M gas (EVM)" color={C.err} />
    </motion.g>
    <text x={210} y={100} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      암호 연산을 opcode로 구현하면 가스비 폭발
    </text>
  </g>);
}

/* Step 1: 가스비 폭발 문제 */
export function StepGasExplosion() {
  return (<g>
    <rect x={30} y={20} width={160} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={110} y={40} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.err}>Groth16 검증</text>
    <text x={110} y={55} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">3회 페어링 필요</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={220} y={20} width={170} height={50} rx={6} fill={`${C.err}08`}
        stroke={C.err} strokeWidth={0.8} strokeDasharray="4 3" />
      <text x={305} y={40} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.err}>~10,000,000 gas</text>
      <text x={305} y={55} textAnchor="middle" fontSize={10} fill={C.err}>블록 한도의 1/3</text>
    </motion.g>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      온체인 ZK 검증이 사실상 불가능
    </motion.text>
  </g>);
}

/* Step 2: 하드포크마다 추가 */
export function StepForkAdd() {
  const forks = [
    { name: 'Byzantium', addr: '0x06~08', color: C.crypto },
    { name: 'Istanbul', addr: '0x09', color: C.gas },
    { name: 'Cancun', addr: '0x0a', color: C.native },
  ];
  return (<g>
    {forks.map((f, i) => (
      <motion.g key={f.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ActionBox x={20 + i * 135} y={25} w={115} h={42} label={f.name} sub={f.addr} color={f.color} />
      </motion.g>
    ))}
    <text x={210} y={95} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      하드포크마다 새 프리컴파일 등록 — 레지스트리 관리가 핵심
    </text>
  </g>);
}
