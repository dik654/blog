import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: TX 대기 */
export function StepWhy() {
  const txs = ['TX₀', 'TX₁', 'TX₂'];
  return (<g>
    {txs.map((t, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}>
        <motion.circle r={4} fill={C.tx}
          initial={{ cx: 20 + i * 15, cy: 45 }}
          animate={{ cx: 120, cy: 45 }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity, repeatDelay: 2 }} />
      </motion.g>
    ))}
    <ModuleBox x={140} y={20} w={110} h={45} label="TX Pool" sub="검증 + 정렬 + 관리" color={C.pool} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <motion.line x1={255} y1={42} x2={290} y2={42} stroke={C.ok} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <ActionBox x={295} y={25} w={95} h={38} label="Block Builder" sub="best TX 선택" color={C.ok} />
    </motion.g>
  </g>);
}

/* Step 1: nonce gap */
export function StepNonceGap() {
  const nonces = [
    { n: '5', ok: true }, { n: '6', ok: false }, { n: '7', ok: true },
  ];
  return (<g>
    {nonces.map((item, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>
        <rect x={50 + i * 90} y={30} width={70} height={30} rx={15}
          fill={item.ok ? `${C.tx}12` : `${C.err}12`}
          stroke={item.ok ? C.tx : C.err} strokeWidth={0.8} />
        <text x={85 + i * 90} y={49} textAnchor="middle" fontSize={11}
          fill={item.ok ? C.tx : C.err}>nonce={item.n}</text>
      </motion.g>
    ))}
    <motion.text x={175} y={26} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      gap! nonce=6 없음
    </motion.text>
    <motion.text x={210} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      nonce=7은 Queued 서브풀에서 대기
    </motion.text>
  </g>);
}

/* Step 2: 스팸 + base fee */
export function StepSpam() {
  return (<g>
    <AlertBox x={20} y={18} w={160} h={40} label="스팸 TX 폭주"
      sub="메모리 소진 → 정상 TX 밀림" color={C.err} />
    <AlertBox x={220} y={18} w={170} h={40} label="base fee 변동"
      sub="TX 실행 가능성 달라짐" color={C.base} />
    <motion.text x={210} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      → 서브풀 간 재분류 + 한도 초과 TX 퇴출 필요
    </motion.text>
  </g>);
}
