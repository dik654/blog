import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './VerifyVizData';

export function ICSumStep() {
  return (
    <g>
      <VizBox x={20} y={20} w={80} h={38} label="ic[0]"
        sub="One 변수" c={CE} />
      <motion.text x={115} y={44} fontSize={12} fontWeight={700} fill={CA}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        +
      </motion.text>
      <VizBox x={130} y={20} w={120} h={38} label="pub[0]·ic[1]"
        sub="1번째 공개 입력" c={CV} delay={0.2} />
      <motion.text x={265} y={44} fontSize={12} fontWeight={700} fill={CA}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        +
      </motion.text>
      <motion.text x={300} y={44} fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        ...
      </motion.text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <path d="M 220 66 L 220 78" stroke={CA} strokeWidth={1}
          markerEnd="url(#vArr)" />
      </motion.g>
      <VizBox x={140} y={82} w={160} h={34} label="IC_sum ∈ G1"
        sub="공개 입력 commitment" c={CA} delay={0.55} />
      <defs>
        <marker id="vArr" viewBox="0 0 10 10" refX={5} refY={8}
          markerWidth={5} markerHeight={5} orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}
export function PairingEqStep() {
  return (
    <g>
      <VizBox x={10} y={14} w={100} h={36} label="e(A, B)"
        sub="LHS" c={CV} />
      <motion.text x={130} y={36} fontSize={14} fontWeight={700} fill={CA}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        =?
      </motion.text>
      <VizBox x={160} y={14} w={80} h={36} label="e(α,β)"
        sub="사전 계산" c={CE} delay={0.2} />
      <motion.text x={253} y={36} fontSize={10} fontWeight={700} fill={CA}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        ·
      </motion.text>
      <VizBox x={268} y={14} w={80} h={36} label="e(IC,[γ]₂)"
        sub="공개 입력" c={CE} delay={0.35} />
      <motion.text x={361} y={36} fontSize={10} fontWeight={700} fill={CA}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        ·
      </motion.text>
      <VizBox x={376} y={14} w={55} h={36} label="e(C,[δ]₂)"
        sub="비공개" c={CE} delay={0.5} />
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}>
        <rect x={50} y={68} width={340} height={40} rx={4}
          fill={`${CE}08`} stroke={CE} strokeWidth={0.6} />
        <text x={220} y={84} textAnchor="middle" fontSize={8} fontWeight={600} fill={CE}>
          Fp12 비교: lhs == rhs → true (증명 유효)
        </text>
        <text x={220} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          총 페어링 3개: LHS 1개 + RHS 2개 (α,β는 VK에 사전 계산)
        </text>
      </motion.g>
    </g>
  );
}
export function ProofSizeStep() {
  const fields = [
    { label: 'A ∈ G1', size: '64B', c: CV, x: 40 },
    { label: 'B ∈ G2', size: '128B', c: CE, x: 175 },
    { label: 'C ∈ G1', size: '64B', c: CA, x: 310 },
  ];
  return (
    <g>
      {fields.map((f, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
          <rect x={f.x} y={25} width={90} height={50} rx={5}
            fill={`${f.c}10`} stroke={f.c} strokeWidth={1} />
          <text x={f.x + 45} y={45} textAnchor="middle"
            fontSize={10} fontWeight={600} fill={f.c}>{f.label}</text>
          <text x={f.x + 45} y={62} textAnchor="middle"
            fontSize={8} fill="var(--muted-foreground)">{f.size}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={120} y={90} width={200} height={26} rx={4}
          fill={`${CA}10`} stroke={CA} strokeWidth={0.8} />
        <text x={220} y={107} textAnchor="middle" fontSize={9} fontWeight={600} fill={CA}>
          총 256바이트 · 검증 O(1)
        </text>
      </motion.g>
    </g>
  );
}
