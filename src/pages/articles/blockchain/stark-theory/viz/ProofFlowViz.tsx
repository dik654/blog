import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { tr: '#6366f1', cst: '#10b981', fri: '#f59e0b', qry: '#ec4899', vfy: '#8b5cf6' };

const STEPS = [
  { label: 'STARK 증명 파이프라인 개요', body: '5단계: Trace Commit → Constraint → FRI → Query → Verify\n\n핵심: "실행 추적이 올바른가?"\n→ 다항식 저차성(low-degree)으로 환원\n→ FRI로 검증. Trusted Setup 불필요.' },
  { label: '1. Trace Commit', body: 'trace = execute(program, input)  // n행 × w열\nfor col in trace.columns:\n  f_col(x) = IFFT(col_values)  // deg < n\n  lde_col = evaluate(f_col, LDE_domain)  // ρ·n점\nroot = MerkleRoot(lde_cols)\ntranscript.absorb(root)\n\n// trace 전체를 해시 하나로 바인딩.' },
  { label: '2. Constraint Composition', body: 'α₁, α₂, ... ← FS(transcript)  // 랜덤 결합 계수\n\nC(x) = α₁·T₁(x) + α₂·T₂(x) + α₃·B₁(x) + ...\nQ(x) = C(x) / Z_H(x)        // 몫 다항식\n\ncheck: deg(Q) ≤ max_deg - |H|\n// Q가 다항식 ⟺ 모든 제약 만족.' },
  { label: '3. FRI — 저차 검증', body: 'β ← FS(transcript)\nf₀(x) = Q(x)  // 초기 다항식\n\nfor round in 0..k:\n  split: fᵢ(x) = g(x²) + x·h(x²)\n  fᵢ₊₁(x) = g(x) + βᵢ·h(x)  // 접기\n  commit(fᵢ₊₁)  // 머클 커밋\n  βᵢ₊₁ ← FS\n\n최종: f_final = 상수 (deg 0).' },
  { label: '4-5. Query & Verify', body: 'q₁, q₂, ... ← FS  // 랜덤 쿼리 위치\n\nfor q in queries:\n  answer = trace_lde[q]        // 값\n  path = merkle_proof(q)       // 경로\n  fri_decommit(q)              // FRI 열기\n\nVerifier:\n  check merkle roots\n  check constraint at query points\n  check FRI consistency\n  → accept / reject.' },
];

export default function ProofFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {[
            { c: C.tr, lines: ['5단계 STARK 파이프라인:', '  1. Trace Commit', '  2. Constraint Composition', '  3. FRI (Low-degree Test)', '  4. Query', '  5. Verify', '// Trusted Setup 불필요'] },
            { c: C.tr, lines: ['trace = execute(prog, input)', 'f(x) = IFFT(trace_col)', 'lde = evaluate(f, LDE_domain)', 'root = MerkleRoot(lde)', 'transcript.absorb(root)', '', '// n행 × w열 → 해시 1개로 바인딩'] },
            { c: C.cst, lines: ['αᵢ ← FS(transcript)', 'C(x) = Σ αᵢ·constraintᵢ(x)', 'Q(x) = C(x) / Z_H(x)', '', 'deg(Q) ≤ max_deg − |H|', '// Q 다항식 ⟺ 제약 충족'] },
            { c: C.fri, lines: ['f₀(x) = Q(x)', 'split: f = g(x²) + x·h(x²)', 'fold: fᵢ₊₁ = g + βᵢ·h', 'commit(fᵢ₊₁)', 'βᵢ₊₁ ← FS', '', '최종: f_final = 상수 (deg 0)'] },
            { c: C.qry, lines: ['q₁, q₂, ... ← FS  // 쿼리 위치', 'answer = trace_lde[q]', 'path = merkle_proof(q)', 'fri_decommit(q)', '', 'Verifier: merkle + constraint + FRI', '→ accept / reject'] },
          ].map((block, i) => (
            step === i && (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <text x={20} y={18} fontSize={10} fontWeight={600} fill={block.c}>
                  {['개요', 'Trace Commit', 'Constraint', 'FRI', 'Query & Verify'][i]}
                </text>
                {block.lines.map((t, j) => (
                  <motion.text key={j} x={20} y={38 + j * 16} fontSize={10}
                    fontFamily="monospace" fill={block.c}
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: j * 0.05 }}>{t}</motion.text>
                ))}
              </motion.g>
            )
          ))}
        </svg>
      )}
    </StepViz>
  );
}
