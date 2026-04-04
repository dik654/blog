import { motion } from 'framer-motion';
import { ActionBox, AlertBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 새 노드의 첫 과제 */
export function Step0() {
  return (<g>
    <ActionBox x={30} y={25} w={90} h={40} label="새 노드" sub="상태 없음" color={C.init} />
    <motion.text x={155} y={48} fontSize={18} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      ?
    </motion.text>
    {Array.from({ length: 5 }, (_, i) => (
      <motion.rect key={i} x={200 + i * 38} y={30} width={30} height={22} rx={4}
        fill={`${C.batch}12`} stroke={C.batch} strokeWidth={0.7}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 + 0.3 }} />
    ))}
    <text x={310} y={75} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      수백만 슬롯의 블록 체인
    </text>
  </g>);
}

/* Step 1: 제네시스부터 재실행 = 수일 소요 */
export function Step1() {
  return (<g>
    <AlertBox x={110} y={18} w={200} h={55}
      label="제네시스 → 현재" sub="순차 실행 = 수일~수주" color={C.err} />
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      새 블록이 계속 도착 → 영원히 따라잡지 못할 수 있음
    </motion.text>
  </g>);
}

/* Step 2: 신뢰 vs 속도 */
export function Step2() {
  return (<g>
    <ActionBox x={30} y={30} w={130} h={40} label="Checkpoint Sync" sub="수 분 완료" color={C.ok} />
    <motion.text x={195} y={55} fontSize={14} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      vs
    </motion.text>
    <AlertBox x={230} y={30} w={150} h={40}
      label="Weak Subjectivity" sub="신뢰 가정 필요" color={C.err} />
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.ckpt}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      속도와 보안 사이의 트레이드오프
    </motion.text>
  </g>);
}

/* Step 3: 3가지 동기화 모드 */
export function Step3() {
  const mods = [
    { label: 'Initial', sub: '배치 실행', color: C.batch },
    { label: 'Checkpoint', sub: '상태 DL', color: C.ckpt },
    { label: 'Regular', sub: '실시간', color: C.ok },
  ];
  return (<g>
    {mods.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <ModuleBox x={15 + i * 138} y={20} w={118} h={48} label={m.label} sub={m.sub} color={m.color} />
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      목적에 따라 모드를 자동 전환
    </motion.text>
  </g>);
}

/* Step 4: 라운드로빈 + Backfill */
export function Step4() {
  const peers = ['피어A', '피어B', '피어C'];
  return (<g>
    <defs><marker id="sy" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
      <path d="M0,0 L6,3 L0,6" fill={C.ok} /></marker></defs>
    {peers.map((p, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}>
        <ActionBox x={15 + i * 138} y={15} w={110} h={32} label={p} sub={`범위 ${i * 64}~${(i + 1) * 64 - 1}`} color={C.batch} />
      </motion.g>
    ))}
    <motion.line x1={210} y1={52} x2={210} y2={72} stroke={C.ok} strokeWidth={1.2}
      markerEnd="url(#sy)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={140} y={75} w={140} h={32} label="순차 실행" sub="슬롯 순서 보장" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={125} textAnchor="middle" fontSize={11} fill={C.ckpt}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      병렬 다운로드 + 순차 실행 / Backfill로 역방향 채움
    </motion.text>
  </g>);
}
