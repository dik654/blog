import { motion } from 'framer-motion';
import { ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: CL의 직렬화 요구 */
export function Step0() {
  const items = ['네트워크', 'DB 저장', '해시 계산'];
  return (<g>
    <ActionBox x={30} y={25} w={90} h={40} label="SSZ" sub="직렬화 규격" color={C.ssz} />
    {items.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.2 }}>
        <rect x={170} y={14 + i * 28} width={90} height={20} rx={10}
          fill={`${C.ok}12`} stroke={C.ok} strokeWidth={0.7} />
        <text x={215} y={28 + i * 28} textAnchor="middle" fontSize={11} fill={C.ok}>{m}</text>
      </motion.g>
    ))}
    <motion.text x={330} y={50} fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      모두 SSZ 기반
    </motion.text>
  </g>);
}

/* Step 1: RLP 문제 */
export function Step1() {
  return (<g>
    <AlertBox x={110} y={18} w={200} h={55}
      label="RLP (EL)" sub="가변 프리픽스 → 머클 증명 불가" color={C.err} />
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      동일 데이터 → 다른 인코딩 가능 = 라이트 클라이언트 불가
    </motion.text>
  </g>);
}

/* Step 2: 결정적 해시 */
export function Step2() {
  return (<g>
    <ActionBox x={40} y={25} w={140} h={40} label="Node A 해시" sub="0xabc..." color={C.ok} />
    <motion.text x={210} y={50} fontSize={12} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      ==
    </motion.text>
    <ActionBox x={240} y={25} w={140} h={40} label="Node B 해시" sub="0xabc..." color={C.ok} />
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.ssz}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      바이트 수준 결정성이 합의의 전제 조건
    </motion.text>
  </g>);
}

