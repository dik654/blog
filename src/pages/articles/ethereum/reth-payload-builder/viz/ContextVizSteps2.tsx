import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: FCU → 백그라운드 빌드 */
export function StepFcu() {
  return (<g>
    <ModuleBox x={10} y={20} w={90} h={42} label="CL" sub="FCU + attrs" color={C.cl} />
    <motion.line x1={105} y1={41} x2={140} y2={41} stroke={C.engine} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <ModuleBox x={145} y={20} w={95} h={42} label="Engine API" sub="head 갱신" color={C.engine} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <motion.line x1={192} y1={62} x2={192} y2={78} stroke={C.builder} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <ActionBox x={145} y={80} w={95} h={30} label="빌드 시작" sub="백그라운드" color={C.builder} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={290} y={30} w={100} h={24} label="payload_id" color={C.ok} />
    </motion.g>
  </g>);
}

/* Step 4: PayloadBuilder trait */
export function StepBuilderTrait() {
  return (<g>
    <ModuleBox x={20} y={15} w={130} h={48} label="PayloadBuilder"
      sub="trait: build_payload()" color={C.builder} />
    <motion.line x1={155} y1={39} x2={190} y2={39} stroke={C.ok} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={195} y={18} w={70} h={20} label="TX Pool" color={C.engine} />
      <DataBox x={195} y={44} w={70} h={20} label="revm 실행" color={C.builder} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <motion.line x1={270} y1={39} x2={300} y2={39} stroke={C.ok} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
      <DataBox x={305} y={25} w={95} h={28} label="ExecutionPayload" sub="+ block_value" color={C.ok} />
    </motion.g>
    <text x={210} y={88} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      trait → MEV builder로 교체 가능
    </text>
  </g>);
}
