import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './ProveVizData';

/** Step 0: compute h(x) */
export function ComputeHStep() {
  return (
    <g>
      <VizBox x={10} y={18} w={100} h={38} label="a(x)·b(x)" sub="witness 결합" c={CV} />
      <motion.text x={125} y={42} fontSize={10} fontWeight={700} fill={CA}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        -
      </motion.text>
      <VizBox x={140} y={18} w={70} h={38} label="c(x)" sub="결과항" c={CE} delay={0.15} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <path d="M 220 37 L 255 37" stroke={CA} strokeWidth={1}
          markerEnd="url(#pArr)" />
        <text x={237} y={30} fontSize={8} fill={CA} textAnchor="middle">÷t(x)</text>
      </motion.g>
      <VizBox x={265} y={18} w={70} h={38} label="h(x)" sub="몫" c={CA} delay={0.4} />
      <VizBox x={350} y={18} w={70} h={38} label="rem" sub="나머지" c={CA} delay={0.5} />
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}>
        <rect x={80} y={74} width={280} height={40} rx={4}
          fill={`${CE}08`} stroke={CE} strokeWidth={0.6} />
        <text x={220} y={90} textAnchor="middle" fontSize={8} fontWeight={600} fill={CE}>
          rem = 0 → Some(h) — 증명 진행
        </text>
        <text x={220} y={104} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          rem != 0 → None — witness가 잘못됨, 증명 불가
        </text>
      </motion.g>
      <defs>
        <marker id="pArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 1: Proof element A */
export function ProofAStep() {
  const parts = [
    { label: '[α]₁', sub: '지식 계수', c: CV, x: 20 },
    { label: 'Σwⱼ[aⱼ(τ)]₁', sub: 'QAP A항 MSM', c: CE, x: 130 },
    { label: 'r[δ]₁', sub: '블라인딩', c: CA, x: 290 },
  ];
  return (
    <g>
      <motion.text x={220} y={16} textAnchor="middle" fontSize={9} fontWeight={700}
        fill={CV} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        A ∈ G1
      </motion.text>
      {parts.map((p, i) => (
        <VizBox key={i} x={p.x} y={28} w={120} h={40} label={p.label}
          sub={p.sub} c={p.c} delay={i * 0.15} />
      ))}
      {[115, 278].map((px, i) => (
        <motion.text key={i} x={px} y={52} fontSize={12} fontWeight={700} fill={CA}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}>
          +
        </motion.text>
      ))}
      <motion.text x={220} y={100} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        witness[j]=0인 변수는 건너뜀 — MSM 최적화
      </motion.text>
    </g>
  );
}
