import { motion } from 'framer-motion';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 2: Ditto = Jolteon + DAG */
export function StepDitto() {
  return (<g>
    <ModuleBox x={20} y={10} w={130} h={38}
      label="Jolteon" sub="리더 기반 합의" color={C.jolt} />
    <motion.line x1={150} y1={29} x2={180} y2={29} stroke={C.ditto} strokeWidth={1.2}
      strokeDasharray="4 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.2 }} />
    <ActionBox x={180} y={10} w={100} h={38}
      label="DAG" sub="비동기 fallback" color={C.ditto} />
    <motion.line x1={280} y1={29} x2={305} y2={29} stroke={C.ditto} strokeWidth={1.2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
    <ModuleBox x={305} y={10} w={90} h={38}
      label="Ditto" sub="하이브리드" color={C.ditto} />
    <motion.text x={210} y={75} textAnchor="middle" fontSize={11} fill={C.ditto}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      리더 장애 시 DAG가 TX 전파 유지
    </motion.text>
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}>
      {'💡 Autobahn(Highway+Lanes)의 선행 연구'}
    </motion.text>
  </g>);
}

/* Step 3: DiemBFT v4 */
export function StepDiemBFT() {
  return (<g>
    <ModuleBox x={15} y={10} w={85} h={38}
      label="HotStuff" sub="2019" color={C.hs} />
    <motion.line x1={100} y1={29} x2={120} y2={29} stroke="var(--border)" strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 }} />
    <ModuleBox x={120} y={10} w={85} h={38}
      label="Jolteon" sub="2022" color={C.jolt} />
    <motion.line x1={205} y1={29} x2={225} y2={29} stroke="var(--border)" strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <ModuleBox x={225} y={10} w={85} h={38}
      label="DiemBFT" sub="v4" color={C.diem} />
    <motion.line x1={310} y1={29} x2={330} y2={29} stroke="var(--border)" strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <ModuleBox x={330} y={10} w={75} h={38}
      label="Aptos" sub="메인넷" color={C.diem} />
    <motion.text x={210} y={75} textAnchor="middle" fontSize={11} fill={C.diem}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      리더 평판 시스템: 응답 빠른 검증자 우선
    </motion.text>
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}>
      {'💡 Aptos 메인넷의 실제 합의 엔진'}
    </motion.text>
  </g>);
}
