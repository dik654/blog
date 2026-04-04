import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './ScalarVizData';

export function FpVsFrStep() {
  return (
    <g>
      <VizBox x={30} y={20} w={160} h={44} label="Fp (base field)" sub="modulus = p (좌표 표현)" c={CV} />
      <VizBox x={250} y={20} w={160} h={44} label="Fr (scalar field)" sub="modulus = r (곡선 위수)" c={CE} delay={0.15} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={30} y={80} width={380} height={30} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={220} y={99} textAnchor="middle" fontSize={8}
          fill={CA} fontWeight={600}>내부 구조 동일: [u64; 4] + Montgomery form + 동일 산술</text>
      </motion.g>
      <motion.line x1={200} y1={42} x2={240} y2={42}
        stroke="var(--muted-foreground)" strokeWidth={0.8} strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }} />
      <motion.text x={220} y={52} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)" initial={{ opacity: 0 }}
        animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        다른 소수
      </motion.text>
    </g>
  );
}

export function MacroStep() {
  return (
    <g>
      <VizBox x={20} y={15} w={170} h={40} label="fp.rs (수동 구현)" sub="학습용 — 400줄" c={CV} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={20} y={70} width={170} height={30} rx={4}
          fill={`${CE}10`} stroke={CE} strokeWidth={1} />
        <text x={105} y={89} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={CE}>fr.rs (매크로)</text>
        <text x={175} y={108} fontSize={7} fill="var(--muted-foreground)">40줄</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <rect x={230} y={30} width={190} height={60} rx={5}
          fill={`${CA}08`} stroke={CA} strokeWidth={1} />
        <text x={325} y={50} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={CA}>define_prime_field!</text>
        <text x={325} y={65} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">modulus + R + R^2 → 완전한 필드</text>
        <text x={325} y={80} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">add, sub, mul, inv, pow 자동 생성</text>
      </motion.g>
    </g>
  );
}

export function R1CSStep() {
  return (
    <g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={30} y={15} width={380} height={28} rx={4}
          fill={`${CV}08`} stroke={CV} strokeWidth={0.8} />
        <text x={220} y={33} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={CV}>R1CS: A * s .* B * s = C * s</text>
      </motion.g>
      <VizBox x={60} y={60} w={80} h={30} label="s: Vec&lt;Fr&gt;" sub="witness 벡터" c={CE} delay={0.2} />
      <VizBox x={180} y={60} w={80} h={30} label="A, B, C" sub="Fr 행렬" c={CA} delay={0.3} />
      <VizBox x={300} y={60} w={80} h={30} label="다항식" sub="Fr 계수" c={CV} delay={0.4} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={30} y={105} width={380} height={22} rx={3}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={220} y={120} textAnchor="middle" fontSize={7.5}
          fill={CA} fontWeight={600}>증명 생성/검증의 모든 연산이 Fr 위에서 수행</text>
      </motion.g>
    </g>
  );
}
