import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 수십 개 서비스 */
export function StepManyServices() {
  const svc = ['Pool', 'Network', 'Executor', 'Consensus', 'RPC'];
  return (<g>
    <ActionBox x={20} y={25} w={90} h={40} label="reth node" sub="CLI 명령" color={C.cli} />
    {svc.map((s, i) => (
      <motion.g key={s} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.08 }}>
        <rect x={150} y={8 + i * 20} width={65} height={16} rx={8}
          fill={`${C.comp}12`} stroke={C.comp} strokeWidth={0.7} />
        <text x={182} y={19 + i * 20} textAnchor="middle" fontSize={10} fill={C.comp}>{s}</text>
      </motion.g>
    ))}
    <motion.text x={300} y={55} fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      수십 개 서비스를 올바른 순서로 조합
    </motion.text>
  </g>);
}

/* Step 1: 의존성 순서 문제 */
export function StepDependency() {
  const chain = ['Network', 'Pool', 'Executor', 'Consensus'];
  return (<g>
    {chain.map((s, i) => (
      <motion.g key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
        <ActionBox x={5 + i * 105} y={25} w={88} h={35} label={s} color={C.cli} />
        {i < 3 && (
          <motion.line x1={93 + i * 105} y1={42} x2={110 + i * 105} y2={42}
            stroke={C.cli} strokeWidth={0.8}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.1 + 0.2, duration: 0.2 }} />
        )}
      </motion.g>
    ))}
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Geth: Register 순서를 코드 리뷰로만 검증 — 런타임 패닉 가능
    </motion.text>
  </g>);
}

/* Step 2: 커스텀 노드 불가 */
export function StepMonolith() {
  return (<g>
    <AlertBox x={50} y={15} w={320} h={55}
      label="모놀리식 노드" sub="OP Stack L2 = 별도 포크 필요 / 커스텀 EVM = 전면 수정" color={C.err} />
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      확장성 없는 구조 — 포크 유지 비용이 막대
    </motion.text>
  </g>);
}
