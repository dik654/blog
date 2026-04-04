import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './SetupVizData';

/** Step 0: Toxic waste */
export function ToxicWasteStep() {
  const params = [
    { label: 'τ', sub: '비밀 평가점', c: CV },
    { label: 'α', sub: '지식 계수', c: CE },
    { label: 'β', sub: '교차항 계수', c: CE },
    { label: 'γ', sub: 'public 구분', c: CA },
    { label: 'δ', sub: 'private 구분', c: CA },
  ];
  return (
    <g>
      {params.map((p, i) => (
        <VizBox key={i} x={10 + i * 86} y={25} w={78} h={44}
          label={p.label} sub={p.sub} c={p.c} delay={i * 0.1} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={60} y={86} width={320} height={24} rx={4}
          fill="#ef444410" stroke="#ef4444" strokeWidth={0.8} />
        <text x={220} y={102} textAnchor="middle" fontSize={8} fontWeight={600} fill="#ef4444">
          setup 종료 후 반드시 삭제 — 알면 가짜 증명 가능
        </text>
      </motion.g>
    </g>
  );
}

/** Step 1: Polynomial evaluation at tau */
export function EvalAtTauStep() {
  return (
    <g>
      <VizBox x={20} y={20} w={100} h={40} label="aⱼ(x), bⱼ(x), cⱼ(x)"
        sub="QAP 다항식" c={CV} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <path d="M 130 40 L 175 40" stroke={CA} strokeWidth={1}
          markerEnd="url(#sArr)" />
        <text x={152} y={34} fontSize={8} fill={CA} textAnchor="middle">eval(τ)</text>
      </motion.g>
      <VizBox x={185} y={20} w={80} h={40} label="Fr 스칼라"
        sub="aⱼ(τ), bⱼ(τ)..." c={CE} delay={0.3} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <path d="M 275 40 L 320 40" stroke={CA} strokeWidth={1}
          markerEnd="url(#sArr)" />
        <text x={297} y={34} fontSize={8} fill={CA} textAnchor="middle">·G</text>
      </motion.g>
      <VizBox x={330} y={20} w={100} h={40} label="커브 포인트"
        sub="[aⱼ(τ)]₁ ∈ G1" c={CA} delay={0.6} />
      <motion.text x={220} y={100} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        ECDLP: 포인트에서 τ 역추출 불가 → toxic waste가 안전하게 숨겨짐
      </motion.text>
      <defs>
        <marker id="sArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}
