import { motion } from 'framer-motion';
import { C } from './StateStructVizData';

export function Step0() {
  const fields = [
    { label: 'LastBlockHeight', y: 42 },
    { label: 'LastBlockID', y: 58 },
    { label: 'LastBlockTime', y: 74 },
  ];
  return (<g>
    <rect x={100} y={15} width={220} height={75} rx={8} fill="var(--card)" stroke={C.state} strokeWidth={0.8} />
    <text x={210} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.state}>State</text>
    {fields.map((f, i) => (
      <motion.text key={i} x={120} y={f.y} fontSize={10} fill="var(--foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 + 0.2 }}>
        {f.label}
      </motion.text>
    ))}
    <text x={210} y={110} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      마지막 확정 블록 기준 — "여기까지 처리 완료"
    </text>
  </g>);
}

export function Step1() {
  const sets = [
    { label: 'LastValidators', sub: '이전 블록 검증', color: C.val, x: 15 },
    { label: 'Validators', sub: '현재 투표 자격', color: C.state, x: 155 },
    { label: 'NextValidators', sub: '다음 블록 적용', color: C.params, x: 290 },
  ];
  return (<g>
    {sets.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}>
        <rect x={s.x} y={20} width={118} height={50} rx={8} fill="var(--card)"
          stroke={s.color} strokeWidth={0.8} />
        <text x={s.x + 59} y={40} textAnchor="middle" fontSize={10} fontWeight={600}
          fill={s.color}>{s.label}</text>
        <text x={s.x + 59} y={56} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">{s.sub}</text>
      </motion.g>
    ))}
    {[140, 275].map((x, i) => (
      <motion.text key={i} x={x} y={48} fontSize={14} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {'→'}
      </motion.text>
    ))}
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill={C.val}>
      3개 세트가 블록마다 한 칸씩 전진 (슬라이딩 윈도우)
    </text>
  </g>);
}

export function Step2() {
  return (<g>
    <rect x={30} y={15} width={160} height={55} rx={8} fill="var(--card)" stroke={C.params} strokeWidth={0.8} />
    <text x={110} y={32} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.params}>ConsensusParams</text>
    <motion.text x={110} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      블록 크기 · 증거 유효기간
    </motion.text>
    <motion.text x={110} y={62} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      가스 한도 · 밸리데이터 키 타입
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={230} y={15} width={160} height={55} rx={8} fill="var(--card)" stroke={C.app} strokeWidth={0.8} />
      <text x={310} y={32} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.app}>AppHash</text>
      <text x={310} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        앱 상태 머클 루트
      </text>
      <text x={310} y={62} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        Commit() 응답에서 수신
      </text>
    </motion.g>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      둘 다 다음 블록 헤더에 포함 → 검증 가능
    </text>
  </g>);
}

