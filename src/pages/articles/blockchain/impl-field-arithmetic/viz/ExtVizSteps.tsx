import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './ExtVizData';

export function Fp2StructStep() {
  return (
    <g>
      <VizBox x={30} y={30} w={100} h={40} label="c0: Fp" sub="실수부" c={CV} />
      <motion.text x={145} y={54} fontSize={12} fill={CA} fontWeight={700}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>+</motion.text>
      <VizBox x={160} y={30} w={100} h={40} label="c1: Fp" sub="허수부" c={CE} delay={0.1} />
      <motion.text x={272} y={54} fontSize={9} fill={CA} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>* u</motion.text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={30} y={88} width={260} height={26} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={160} y={105} textAnchor="middle" fontSize={8}
          fill={CA} fontWeight={600}>u^2 = -1 (BN254) — 복소수의 i^2 = -1과 동일</text>
      </motion.g>
    </g>
  );
}

export function Fp2KaratsubaStep() {
  const boxes = [
    { x: 20, y: 15, label: 'v0 = a0*b0', c: CV },
    { x: 160, y: 15, label: 'v1 = a1*b1', c: CE },
    { x: 80, y: 60, label: '(a0+a1)(b0+b1)', c: CA },
  ];
  return (
    <g>
      {boxes.map((b, i) => (
        <VizBox key={i} x={b.x} y={b.y} w={120} h={30}
          label={b.label} sub="" c={b.c} delay={i * 0.15} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={240} y={55} width={170} height={40} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={325} y={72} textAnchor="middle" fontSize={8}
          fill={CA} fontWeight={600}>c0 = v0 - v1</text>
        <text x={325} y={86} textAnchor="middle" fontSize={8}
          fill={CE} fontWeight={600}>c1 = 3rd - v0 - v1</text>
      </motion.g>
      <motion.text x={215} y={115} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)" initial={{ opacity: 0 }}
        animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        Fp 곱셈 4회 → 3회 (25% 절감)
      </motion.text>
    </g>
  );
}

export function Fp6StructStep() {
  const components = [
    { label: 'c0: Fp2', sub: '상수항', c: CV, x: 20 },
    { label: 'c1: Fp2', sub: 'v의 계수', c: CE, x: 160 },
    { label: 'c2: Fp2', sub: 'v^2의 계수', c: CA, x: 300 },
  ];
  return (
    <g>
      {components.map((comp, i) => (
        <VizBox key={i} x={comp.x} y={25} w={120} h={36}
          label={comp.label} sub={comp.sub} c={comp.c} delay={i * 0.12} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={20} y={78} width={400} height={36} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={220} y={93} textAnchor="middle" fontSize={8}
          fill={CA} fontWeight={600}>v^3 = beta = 9 + u → 차수 제한</text>
        <text x={220} y={107} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">Karatsuba → Fp2 곱셈 9회 → 6회</text>
      </motion.g>
    </g>
  );
}
