import { motion } from 'framer-motion';
import { C } from './ValidationVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

export function StepMinerWinner() {
  const stages = [
    { label: 'Beacon', sub: '랜덤 시드', color: '#ec4899' },
    { label: 'Random 추출', sub: '주소+에폭→vrfBase', color: C.vrf },
    { label: 'VRF 서명', sub: '워커 BLS 검증', color: C.vrf },
    { label: 'WinCount', sub: '파워비례 재계산', color: C.miner },
  ];
  return (<g>
    <text x={220} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">VRF 당선: 4단계 검증 파이프라인</text>
    {stages.map((s, i) => {
      const x = 10 + i * 105;
      return (
        <motion.g key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15, ...sp }}>
          <rect x={x} y={28} width={92} height={40} rx={5} fill={`${s.color}10`} stroke={s.color} strokeWidth={1} />
          <text x={x + 46} y={44} textAnchor="middle" fontSize={10} fontWeight={600} fill={s.color}>{s.label}</text>
          <text x={x + 46} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{s.sub}</text>
          {i < 3 && <text x={x + 98} y={52} fontSize={10} fill="var(--muted-foreground)">→</text>}
        </motion.g>);
    })}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <text x={430} y={52} fontSize={12} fill="#10b981" fontWeight={700}>✓</text>
    </motion.g>
  </g>);
}

export function StepSigBeaconTkt() {
  const items = [
    { label: '서명', input: '블록 헤더', process: 'BLS 키 검증', color: C.sig },
    { label: '비콘', input: '이전 비콘값', process: '연속성 확인', color: C.beacon },
    { label: '티켓', input: '비밀키+비콘', process: 'VRF 유효성', color: C.vrf },
  ];
  return (<g>
    <text x={210} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">3가지 암호학 검증 (병렬)</text>
    {items.map((it, i) => {
      const y = 26 + i * 34;
      return (
        <motion.g key={it.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12, ...sp }}>
          <text x={15} y={y + 18} fontSize={11} fontWeight={700} fill={it.color}>{it.label}</text>
          <rect x={60} y={y} width={100} height={28} rx={4} fill={`${it.color}08`} stroke={it.color} strokeWidth={0.6} />
          <text x={110} y={y + 18} textAnchor="middle" fontSize={10} fill={it.color}>{it.input}</text>
          <text x={170} y={y + 18} fontSize={10} fill="var(--muted-foreground)">→</text>
          <rect x={185} y={y} width={110} height={28} rx={4} fill={`${it.color}10`} stroke={it.color} strokeWidth={1} />
          <text x={240} y={y + 18} textAnchor="middle" fontSize={10} fill={it.color} fontWeight={600}>{it.process}</text>
          <text x={310} y={y + 18} fontSize={11} fill="#10b981" fontWeight={700}>✓</text>
        </motion.g>);
    })}
  </g>);
}

export function StepWinPost() {
  const stages = [
    { label: '비콘', sub: '랜덤 시드', color: '#ec4899' },
    { label: '섹터 선택', sub: '무작위 N개', color: C.post },
    { label: 'Merkle 증명', sub: '경로 검증', color: C.post },
  ];
  return (<g>
    <text x={210} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">WinningPoSt: 실제로 데이터를 갖고 있는가?</text>
    {stages.map((s, i) => {
      const x = 20 + i * 130;
      return (
        <motion.g key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.2, ...sp }}>
          <rect x={x} y={28} width={110} height={36} rx={5} fill={`${s.color}10`} stroke={s.color} strokeWidth={1} />
          <text x={x + 55} y={44} textAnchor="middle" fontSize={11} fontWeight={600} fill={s.color}>{s.label}</text>
          <text x={x + 55} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{s.sub}</text>
          {i < 2 && <text x={x + 118} y={50} fontSize={12} fill="var(--muted-foreground)">→</text>}
        </motion.g>);
    })}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <text x={410} y={50} fontSize={12} fill="var(--muted-foreground)">→</text>
      <rect x={420} y={36} width={30} height={24} rx={4} fill="#10b98120" stroke="#10b981" strokeWidth={1.5} />
      <text x={435} y={52} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">✓</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <rect x={50} y={80} width={320} height={26} rx={5} fill="#f59e0b08" stroke="#f59e0b" strokeWidth={0.8} />
      <text x={210} y={97} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>PoW = 해시 연산 증명 → Filecoin = 저장 공간 증명</text>
    </motion.g>
  </g>);
}
