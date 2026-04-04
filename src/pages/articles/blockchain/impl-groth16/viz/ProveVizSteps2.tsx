import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './ProveVizData';

/** Step 2: Proof element B */
export function ProofBStep() {
  const parts = [
    { label: '[β]₂', sub: '교차항 계수', c: CV, x: 20 },
    { label: 'Σwⱼ[bⱼ(τ)]₂', sub: 'QAP B항 MSM', c: CE, x: 130 },
    { label: 's[δ]₂', sub: '블라인딩', c: CA, x: 290 },
  ];
  return (
    <g>
      <motion.text x={220} y={16} textAnchor="middle" fontSize={9} fontWeight={700}
        fill={CE} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        B ∈ G2
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
        B\'(G1)도 별도 계산 — C의 블라인딩 항 r·B\'에 사용
      </motion.text>
    </g>
  );
}

/** Step 3: Proof element C */
export function ProofCStep() {
  const parts = [
    { label: 'Σwⱼ·l_query', sub: 'private 기여', c: CV, x: 8 },
    { label: 'Σhᵢ·h_query', sub: 'h(τ)t(τ)/δ', c: CE, x: 148 },
    { label: 'sA+rB\'-rsδ', sub: '블라인딩', c: CA, x: 298 },
  ];
  return (
    <g>
      <motion.text x={220} y={16} textAnchor="middle" fontSize={9} fontWeight={700}
        fill={CA} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        C ∈ G1
      </motion.text>
      {parts.map((p, i) => (
        <VizBox key={i} x={p.x} y={28} w={128} h={40} label={p.label}
          sub={p.sub} c={p.c} delay={i * 0.15} />
      ))}
      {[133, 288].map((px, i) => (
        <motion.text key={i} x={px} y={52} fontSize={12} fontWeight={700} fill={CA}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}>
          +
        </motion.text>
      ))}
      <motion.text x={220} y={100} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        sA + rB' - rsδ: 교차항 rs가 소거되어 검증 방정식 유지
      </motion.text>
    </g>
  );
}
