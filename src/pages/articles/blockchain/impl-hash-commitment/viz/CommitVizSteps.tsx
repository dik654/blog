import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './CommitVizData';

export function CommitSchemeStep() {
  return (
    <g>
      <VizBox x={30} y={30} w={90} h={40} label="value" sub="은닉할 값" c={CV} delay={0} />
      <VizBox x={150} y={30} w={100} h={40} label="randomness" sub="블라인딩 팩터" c={CE} delay={0.1} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={280} y={20} width={130} height={60} rx={5}
          fill={`${CA}10`} stroke={CA} strokeWidth={1} />
        <text x={345} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={CA}>H(v, r)</text>
        <text x={345} y={56} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Poseidon 1회</text>
        <text x={345} y={68} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">= commitment</text>
      </motion.g>
      <motion.line x1={120} y1={50} x2={280} y2={42} stroke={CA} strokeWidth={0.8}
        markerEnd="url(#cmArr)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
      <motion.line x1={250} y1={50} x2={280} y2={50} stroke={CA} strokeWidth={0.8}
        markerEnd="url(#cmArr)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.3 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={120} y={100} fontSize={7} fill={CV}>Hiding: r이 랜덤 → C에서 v 추론 불가</text>
        <text x={120} y={114} fontSize={7} fill={CE}>Binding: collision resistance → C 고정</text>
      </motion.g>
      <defs>
        <marker id="cmArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}

export function ProtocolStep() {
  const steps = [
    { label: 'Commit', sub: 'C = H(v, r) 공개', c: CV, x: 30 },
    { label: '...', sub: 'v, r 비밀 유지', c: '#94a3b8', x: 170 },
    { label: 'Open', sub: 'v, r 공개 → 검증', c: CE, x: 310 },
  ];
  return (
    <g>
      {steps.map((s, i) => (
        <VizBox key={i} x={s.x} y={40} w={105} h={45} label={s.label} sub={s.sub} c={s.c} delay={i * 0.2} />
      ))}
      {[0, 1].map((i) => (
        <motion.line key={i} x1={135 + i * 140} y1={62} x2={170 + i * 140} y2={62}
          stroke={CA} strokeWidth={0.8} markerEnd="url(#cmArr)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 + i * 0.2, duration: 0.3 }} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <text x={220} y={112} textAnchor="middle" fontSize={8} fill={CA}>
          H(v, r) == C ? → binding 검증
        </text>
        <text x={220} y={126} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          커밋 후 값 변경 불가 / 공개 전 값 비공개
        </text>
      </motion.g>
    </g>
  );
}

export function ZKUsageStep() {
  return (
    <g>
      <VizBox x={20} y={15} w={120} h={40} label="commitment" sub="H(nullifier, secret)" c={CV} delay={0} />
      <VizBox x={160} y={15} w={120} h={40} label="Merkle Tree" sub="commitment pool" c={CE} delay={0.15} />
      <VizBox x={300} y={15} w={120} h={40} label="ZK Proof" sub="root 공개, 경로 비공개" c={CA} delay={0.3} />
      <motion.line x1={140} y1={35} x2={160} y2={35} stroke="var(--muted-foreground)"
        strokeWidth={0.8} markerEnd="url(#cmArr)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.2 }} />
      <motion.line x1={280} y1={35} x2={300} y2={35} stroke="var(--muted-foreground)"
        strokeWidth={0.8} markerEnd="url(#cmArr)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.2 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={40} y={72} width={360} height={60} rx={5}
          fill={`${CV}06`} stroke={CV} strokeWidth={0.8} strokeDasharray="4 2" />
        <text x={220} y={90} textAnchor="middle" fontSize={9} fontWeight={600} fill={CV}>R1CS Circuit</text>
        <text x={220} y={105} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          Poseidon circuit (~634) + Merkle circuit (depth x 640) + boolean/mux
        </text>
        <text x={220} y={119} textAnchor="middle" fontSize={7} fill={CA}>
          depth=20 기준 ~13,000 제약 → Groth16으로 수 초 내 증명
        </text>
      </motion.g>
    </g>
  );
}
