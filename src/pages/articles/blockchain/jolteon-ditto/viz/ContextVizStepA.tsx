import { motion } from 'framer-motion';
import { ModuleBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: HotStuff 한계 */
export function StepHSLimit() {
  const phases = ['Prepare', 'Pre-Commit', 'Commit'];
  return (<g>
    {phases.map((p, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}>
        <ModuleBox x={15 + i * 130} y={25} w={110} h={40}
          label={p} sub={`Phase ${i + 1}`} color={C.hs} />
        {i < 2 && (
          <motion.line x1={125 + i * 130} y1={45} x2={145 + i * 130} y2={45}
            stroke={C.hs} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.1 + 0.2 }} />
        )}
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.hs}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      7 delays — 정상 시에도 3단계 필수
    </motion.text>
    <motion.text x={210} y={118} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}>
      {'💡 대부분 시간은 정상 → fast path가 필요'}
    </motion.text>
  </g>);
}

/* Step 1: Jolteon dual path */
export function StepJolteon() {
  return (<g>
    <ModuleBox x={20} y={10} w={170} h={38}
      label="Fast Path (2단계)" sub="4 delays · 모든 노드 정상" color={C.jolt} />
    <AlertBox x={220} y={10} w={170} h={38}
      label="Slow Path (3단계)" sub="7 delays · 장애 fallback" color={C.hs} />
    <motion.text x={210} y={72} textAnchor="middle" fontSize={12} fontWeight={600}
      fill={C.jolt} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      정상 시 Fast / 장애 시 Slow 자동 전환
    </motion.text>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}>
      {'💡 PBFT 빠른 정상 경로 + HotStuff O(n) VC = 최적 조합'}
    </motion.text>
    <motion.text x={210} y={118} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}>
      Gelashvili et al., 2022
    </motion.text>
  </g>);
}
