import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepPool() {
  const msgs = ['TX₀', 'TX₁', 'TX₂'];
  return (<g>
    {msgs.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <DataBox x={15} y={18 + i * 30} w={65} h={22} label={m} color={C.pool} />
      </motion.g>
    ))}
    <motion.line x1={85} y1={48} x2={140} y2={48} stroke={C.gas} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
    <ModuleBox x={145} y={22} w={120} h={48} label="MessagePool" sub="가스 가격 정렬" color={C.pool} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <ActionBox x={300} y={28} w={100} h={38} label="블록 선택" sub="수익 최적화" color={C.ok} />
    </motion.g>
  </g>);
}

export function StepGas() {
  return (<g>
    <ActionBox x={20} y={15} w={110} h={32} label="BaseFee" sub="네트워크 혼잡도" color={C.err} />
    <text x={140} y={35} fontSize={11} fill="var(--muted-foreground)">+</text>
    <ActionBox x={155} y={15} w={110} h={32} label="GasPremium" sub="마이너 팁" color={C.gas} />
    <text x={275} y={35} fontSize={11} fill="var(--muted-foreground)">=</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <DataBox x={290} y={18} w={110} h={26} label="유효 가스비" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={75} textAnchor="middle" fontSize={11} fill={C.gas}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      GasFeeCap = 최대 지불 의사 가격 (상한)
    </motion.text>
    <text x={210} y={95} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      유효 프리미엄 = min(FeeCap - BaseFee, Premium)
    </text>
  </g>);
}

export function StepNonce() {
  const nonces = [3, 4, 5];
  return (<g>
    {nonces.map((n, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <DataBox x={30 + i * 120} y={30} w={90} h={28} label={`nonce=${n}`}
          sub={i === 2 ? '대기 중' : '실행 가능'} color={i === 2 ? C.nonce : C.ok} />
        {i < 2 && <text x={120 + i * 120} y={48} fontSize={11} fill={C.ok}>→</text>}
      </motion.g>
    ))}
    <text x={210} y={88} textAnchor="middle" fontSize={11} fill={C.nonce}>
      nonce 4가 실행되어야 nonce 5도 실행 가능
    </text>
  </g>);
}

export function StepDiff() {
  return (<g>
    <ActionBox x={20} y={20} w={170} h={38} label="Ethereum EIP-1559" sub="블록 가스 50% 기준" color={C.pool} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ActionBox x={225} y={20} w={170} h={38} label="Filecoin Gas" sub="블록 한도 대비 사용률" color={C.gas} />
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.gas}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      + 메시지 크기에 별도 가스 비용 부과
    </motion.text>
  </g>);
}
