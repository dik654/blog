import { motion } from 'framer-motion';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: DAG 병렬 제안 */
export function StepDAGParallel() {
  const rows = ['V1', 'V2', 'V3'];
  return (<g>
    {rows.map((v, ri) => (
      <motion.g key={v} initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }} transition={{ delay: ri * 0.12 }}>
        <text x={12} y={28 + ri * 35} fontSize={10} fontWeight={600}
          fill={C.dag}>{v}</text>
        {[0, 1, 2].map(ci => {
          const x = 40 + ci * 100;
          return (
            <motion.rect key={ci} x={x} y={14 + ri * 35} width={70} height={24}
              rx={5} fill={`${C.dag}10`} stroke={C.dag} strokeWidth={0.8}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: `${x}px ${26 + ri * 35}px` }}
              transition={{ delay: ri * 0.1 + ci * 0.08 }} />
          );
        })}
      </motion.g>
    ))}
    <motion.text x={200} y={125} textAnchor="middle" fontSize={11}
      fill={C.dag} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}>
      💡 처리량 = n × 단일 노드 — 선형 확장
    </motion.text>
  </g>);
}

/* Step 4: Bullshark zero-message 합의 */
export function StepBullsharkCommit() {
  return (<g>
    <ModuleBox x={20} y={15} w={150} h={40}
      label="Narwhal DAG" sub="데이터 가용성 보장" color={C.dag} />
    <ActionBox x={230} y={15} w={150} h={40}
      label="Bullshark" sub="앵커 기반 순서 결정" color={C.leader} />
    <motion.line x1={170} y1={35} x2={230} y2={35}
      stroke={C.leader} strokeWidth={1.2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}>
      <ActionBox x={80} y={72} w={240} h={38}
        label="Zero-message overhead"
        sub="DAG 구조만으로 합의 — 추가 통신 없음" color={C.dag} />
    </motion.g>
    <motion.text x={200} y={128} textAnchor="middle" fontSize={11}
      fill={C.leader} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}>
      💡 합의 코드 ~200줄 — Narwhal이 무거운 작업 담당
    </motion.text>
  </g>);
}
