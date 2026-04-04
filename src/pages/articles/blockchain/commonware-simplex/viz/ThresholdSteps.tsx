import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export function ElectorTraitStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={60} y={10} width={160} height={50} rx={6} fill="var(--card)" />
      <rect x={60} y={10} width={160} height={50} rx={6}
        fill={`${CV}10`} stroke={CV} strokeWidth={1} />
      <text x={140} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill={CV}>Config</text>
      <text x={140} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">build(participants)</text>
      <line x1={220} y1={35} x2={260} y2={35} stroke="var(--border)" strokeWidth={0.6} />
      <text x={240} y={30} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">build</text>
      <rect x={260} y={10} width={160} height={50} rx={6} fill="var(--card)" />
      <rect x={260} y={10} width={160} height={50} rx={6}
        fill={`${CE}10`} stroke={CE} strokeWidth={1} />
      <text x={340} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill={CE}>Elector</text>
      <text x={340} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">elect(round, cert)</text>
      <rect x={120} y={80} width={240} height={40} rx={5} fill={`${CA}08`} stroke={CA} strokeWidth={0.6} />
      <text x={240} y={100} textAnchor="middle" fontSize={10} fill={CA}>
        결정적 필수: same inputs → same leader
      </text>
      <text x={240} y={114} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        합의 정확성의 전제 조건
      </text>
    </motion.g>
  );
}

export function RoundRobinStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {['V0', 'V1', 'V2', 'V3'].map((v, i) => (
        <g key={i}>
          <rect x={20 + i * 110} y={20} width={90} height={28} rx={4} fill="var(--card)" />
          <rect x={20 + i * 110} y={20} width={90} height={28} rx={4}
            fill={i === 1 ? `${CE}20` : `${CV}08`}
            stroke={i === 1 ? CE : CV} strokeWidth={i === 1 ? 1.2 : 0.5} />
          <text x={65 + i * 110} y={38} textAnchor="middle" fontSize={10}
            fontWeight={i === 1 ? 700 : 400}
            fill={i === 1 ? CE : CV}>{v} {i === 1 ? '<- leader' : ''}</text>
        </g>
      ))}
      <rect x={100} y={70} width={260} height={28} rx={4} fill={`${CV}08`}
        stroke={CV} strokeWidth={0.6} />
      <text x={230} y={88} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={CV}>
        idx = modulo(view, n_participants)
      </text>
      <text x={230} y={120} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        view=5, n=4 → idx=1 → V1 리더. O(1) 연산.
      </text>
    </motion.g>
  );
}

export function RandomStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={20} y={10} width={200} height={50} rx={5} fill="var(--card)" />
      <rect x={20} y={10} width={200} height={50} rx={5}
        fill={`${CV}10`} stroke={CV} strokeWidth={0.8} />
      <text x={120} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill={CV}>View 1</text>
      <text x={120} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">cert=None → round-robin</text>
      <rect x={260} y={10} width={200} height={50} rx={5} fill="var(--card)" />
      <rect x={260} y={10} width={200} height={50} rx={5}
        fill={`${CE}10`} stroke={CE} strokeWidth={0.8} />
      <text x={360} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill={CE}>View 2+</text>
      <text x={360} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">SHA256(cert) → modulo</text>
      <rect x={80} y={80} width={320} height={40} rx={5} fill={`${CA}08`} stroke={CA} strokeWidth={0.6} />
      <text x={240} y={98} textAnchor="middle" fontSize={10} fill={CA}>
        BLS threshold cert → 임계값 미만 참여자가 결과 조작 불가
      </text>
      <text x={240} y={114} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        편향 없는 랜덤성 보장 (VRF)
      </text>
    </motion.g>
  );
}
