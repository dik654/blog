import { motion } from 'framer-motion';
import { ActionBox, AlertBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: CL의 데이터 저장 요구 */
export function Step0() {
  const items = ['Block', 'State', 'Validator'];
  return (<g>
    {items.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={20} y={20 + i * 28} width={75} height={20} rx={10}
          fill={`${C.db}12`} stroke={C.db} strokeWidth={0.8} />
        <text x={57} y={34 + i * 28} textAnchor="middle" fontSize={11} fill={C.db}>{m}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={150} y={25} w={110} h={42} label="빠른 조회" sub="포크 선택·RPC" color={C.ok} />
    </motion.g>
    <ActionBox x={300} y={25} w={100} h={42} label="영구 저장" sub="ACID 보장" color={C.bucket} />
  </g>);
}

/* Step 1: 상태 크기 폭발 — 실제 수치로 규모 표현 */
export function Step1() {
  return (<g>
    <AlertBox x={30} y={18} w={140} h={50}
      label="BeaconState" sub="~300 MB / 슬롯" color={C.err} />
    <motion.text x={195} y={48} fontSize={12} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      x
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <AlertBox x={215} y={18} w={160} h={50}
        label="7,200 슬롯/일" sub="12초 x 86,400초" color={C.err} />
    </motion.g>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={10} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      300MB x 7,200 = 2.1TB/일 — 전체 저장 불가
    </motion.text>
  </g>);
}

/* Step 2: 읽기 >> 쓰기 */
export function Step2() {
  return (<g>
    <ActionBox x={30} y={30} w={120} h={40} label="쓰기" sub="슬롯당 1회" color={C.state} />
    <motion.text x={175} y={55} fontSize={12} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      {'<<'}
    </motion.text>
    <ActionBox x={210} y={30} w={170} h={40} label="읽기" sub="포크선택·RPC·검증 빈번" color={C.ok} />
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.bucket}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      읽기 최적화된 저장소가 핵심
    </motion.text>
  </g>);
}

/* Step 3: BoltDB + 에폭 경계 저장 */
export function Step3() {
  const mods = [
    { label: 'BoltDB', sub: 'B+Tree 읽기', color: C.db },
    { label: '버킷 스키마', sub: '유형별 분리', color: C.bucket },
    { label: '에폭 경계', sub: '1/32 절감', color: C.ok },
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
      단일 파일, ACID, 에폭 경계만 상태 저장
    </motion.text>
  </g>);
}

/* Step 4: 프루닝 + 아카이벌 */
export function Step4() {
  return (<g>
    <ActionBox x={30} y={20} w={160} h={40} label="Finalized 경계" sub="비-캐노니컬 자동 삭제" color={C.ok} />
    <motion.text x={220} y={45} fontSize={12} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      +
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ActionBox x={245} y={20} w={150} h={40} label="--archive" sub="전체 히스토리 보존" color={C.state} />
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      기본 프루닝으로 디스크 안정 / 아카이벌로 히스토리 보존
    </motion.text>
  </g>);
}
