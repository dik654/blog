import { motion } from 'framer-motion';
import { AlertBox, ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 순서 필요성 */
export function StepNeedOrder() {
  return (<g>
    <ModuleBox x={20} y={15} w={160} h={40}
      label="Narwhal DAG" sub="가용성 보장 (순서 없음)" color={C.dag} />
    <AlertBox x={230} y={15} w={160} h={40}
      label="블록체인" sub="전체 순서 필요!" color="#ef4444" />
    <motion.line x1={180} y1={35} x2={230} y2={35} stroke="var(--border)" strokeWidth={1.2}
      strokeDasharray="4 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.2 }} />
    <motion.text x={205} y={28} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      ?
    </motion.text>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.wave}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      같은 DAG를 보고 같은 순서를 결정해야 함
    </motion.text>
    <motion.text x={210} y={110} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}>
      {'💡 Bullshark가 DAG 위에서 순서 결정'}
    </motion.text>
  </g>);
}

/* Step 1: 웨이브 기반 앵커 */
export function StepWave() {
  const rounds = [0, 1, 2, 3];
  return (<g>
    {rounds.map(r => (
      <motion.g key={r} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: r * 0.1 }}>
        <rect x={30 + r * 95} y={20} width={80} height={50} rx={6}
          fill={r % 2 === 0 ? `${C.wave}10` : `${C.anchor}10`}
          stroke={r % 2 === 0 ? C.wave : C.anchor}
          strokeWidth={r % 2 === 0 ? 0.8 : 1.2} />
        <text x={70 + r * 95} y={38} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={r % 2 === 0 ? C.wave : C.anchor}>
          R{r}
        </text>
        {r % 2 === 1 && (
          <text x={70 + r * 95} y={55} textAnchor="middle" fontSize={10}
            fontWeight={700} fill={C.anchor}>Anchor</text>
        )}
      </motion.g>
    ))}
    {/* 웨이브 괄호 */}
    <motion.text x={118} y={85} textAnchor="middle" fontSize={10}
      fill={C.wave} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Wave 0
    </motion.text>
    <motion.text x={308} y={85} textAnchor="middle" fontSize={10}
      fill={C.wave} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Wave 1
    </motion.text>
    <motion.text x={210} y={110} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}>
      {'💡 2라운드 = 1웨이브, 짝수 라운드에 앵커'}
    </motion.text>
  </g>);
}
