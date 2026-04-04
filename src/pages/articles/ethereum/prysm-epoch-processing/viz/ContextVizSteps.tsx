import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, ActionBox, StatusBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 에폭 정산 필요 */
export function StepEpochNeed() {
  const slots = [4829, 4830, 4831, 4832];
  return (<g>
    {slots.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
        <rect x={20 + i * 100} y={30} width={80} height={28} rx={6}
          fill={s === 4832 ? `${C.epoch}18` : 'var(--card)'}
          stroke={s === 4832 ? C.epoch : 'var(--border)'} strokeWidth={s === 4832 ? 1.5 : 0.7} />
        <text x={60 + i * 100} y={48} textAnchor="middle" fontSize={11}
          fill={s === 4832 ? C.epoch : 'var(--muted-foreground)'}>{s}</text>
      </motion.g>
    ))}
    <motion.text x={360} y={22} textAnchor="middle" fontSize={10} fill={C.epoch} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Epoch 151 정산!
    </motion.text>
    <text x={210} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      580,000+ 검증자 보상/패널티/레지스트리 갱신
    </text>
  </g>);
}

/* Step 1: 연산 집약 */
export function StepCompute() {
  return (<g>
    <AlertBox x={40} y={20} w={200} h={55} label="580,000 검증자 순회"
      sub="18.5M ETH 어테스테이션 집계 + 보상" color={C.err} />
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      12초 안에 완료 실패 → 블록 생산 지연
    </motion.text>
  </g>);
}

/* Step 2: 순서 의존 */
export function StepOrder() {
  const steps = ['Justification', 'Rewards', 'Registry'];
  return (<g>
    {steps.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ActionBox x={20 + i * 135} y={25} w={110} h={40} label={s}
          sub={['2/3 투표', '보상 계산', '상태 전환'][i]} color={C.epoch} />
        {i < 2 && (
          <motion.line x1={130 + i * 135} y1={45} x2={155 + i * 135} y2={45}
            stroke={C.epoch} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.15 + 0.2, duration: 0.2 }} />
        )}
      </motion.g>
    ))}
    <text x={210} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      순서 변경 불가 — 이전 단계 결과에 의존
    </text>
  </g>);
}

/* Step 3: Precompute */
export function StepPrecompute() {
  return (<g>
    <ModuleBox x={30} y={20} w={130} h={45} label="Precompute" sub="단일 패스 O(N)" color={C.ok} />
    <motion.line x1={165} y1={42} x2={220} y2={42} stroke={C.ok} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <StatusBox x={225} y={16} w={150} h={52} label="참여 통계" sub="Source/Target/Head" color={C.ok} progress={1} />
    </motion.g>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill={C.ok}>
      N번 반복 대신 한 번의 순회로 집계
    </text>
  </g>);
}

/* Step 4: 7단계 파이프라인 */
export function StepPipeline() {
  const stages = ['Just', 'Inact', 'Reward', 'Reg', 'Slash', 'Bal'];
  return (<g>
    {stages.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}>
        <rect x={10 + i * 68} y={30} width={58} height={28} rx={14}
          fill={`${C.epoch}12`} stroke={C.epoch} strokeWidth={0.8} />
        <text x={39 + i * 68} y={48} textAnchor="middle" fontSize={11} fill={C.epoch}>{s}</text>
        {i < 5 && <line x1={68 + i * 68} y1={44} x2={78 + i * 68} y2={44}
          stroke="var(--border)" strokeWidth={0.6} />}
      </motion.g>
    ))}
    <text x={210} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      각 단계가 명확한 입출력 — 디버깅 + 테스트 용이
    </text>
  </g>);
}
