import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { tr: '#6366f1', lde: '#10b981', err: '#ef4444', fri: '#f59e0b' };

const STEPS = [
  { label: 'LDE 개요 — 왜 확장하는가?', body: 'Trace 도메인: T = {ω⁰, ω¹, ..., ω⁷}  (8개 점)\n다항식 f(x): degree < 8\n\n문제: 8개 점만 검사하면 가짜도 통과.\n해법: 더 큰 도메인으로 확장 → 오류 증폭.\n\nBlowup factor ρ = 4 → LDE 도메인 = 32개 점.' },
  { label: 'Trace → 다항식 보간', body: 'trace = [(1,1), (1,2), (2,3), (3,5), ...]\nf(x) = IFFT(trace_values)  // degree 7\n\nf(ω⁰) = 1, f(ω¹) = 1, f(ω²) = 2, ...\n\n// 8개 점 → 유일한 degree-7 다항식.\n// 이 다항식이 모든 제약을 인코딩.' },
  { label: 'LDE: 32개 점으로 확장 평가', body: 'LDE_domain = {g⁰, g¹, ..., g³¹}  // |D| = ρ·|T|\ng = primitive_root(32)\n\nLDE[i] = f(gⁱ)  for i = 0..31\n// 같은 다항식을 더 많은 점에서 평가.\n\n올바른 f → 32개 점 모두 degree-7 위에 놓임.\n// Merkle Root(LDE) → Verifier에게 커밋.' },
  { label: '가짜 trace → 오류 증폭', body: '가짜 f\': degree > 7 (제약 위반)\n\nSchwartz-Zippel 보조정리:\n  deg(f\'−f) ≤ max(deg) = d\n  일치 점 ≤ d / |LDE_domain|\n  = 7 / 32 ≈ 22%\n\n→ 78%+ 점에서 불일치.\nFRI: 랜덤 k개 쿼리로 탐지.\n  soundness ≈ (1 − (1−ρ⁻¹))ᵏ' },
];

export default function LDEViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.tr}>LDE 개요</text>
              {['Trace: T = {ω⁰, ..., ω⁷}  (8점)',
                'f(x): degree < 8', '',
                '8점만 검사 → 가짜도 통과 가능',
                'blowup ρ = 4 → 32점으로 확장', '',
                '오류 증폭 → 소수 쿼리로 탐지'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.tr}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.tr}>Trace 보간</text>
              {['trace = [(1,1),(1,2),(2,3),(3,5),...]',
                'f(x) = IFFT(trace_values)  // deg 7', '',
                'f(ω⁰)=1, f(ω¹)=1, f(ω²)=2, ...', '',
                '// 8점 → 유일한 deg-7 다항식',
                '// 제약을 다항식으로 인코딩'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.tr}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.lde}>LDE 확장 평가</text>
              {['LDE_domain = {g⁰,...,g³¹}  // 32점',
                'g = primitive_root(32)', '',
                'LDE[i] = f(gⁱ)  for i=0..31',
                '// 동일 다항식, 더 많은 점', '',
                'MerkleRoot(LDE) → Verifier 커밋'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.lde}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.err}>오류 증폭</text>
              {['가짜 f\': deg > 7 (제약 위반)', '',
                'Schwartz-Zippel:',
                '  일치 ≤ d/|D| = 7/32 ≈ 22%',
                '  → 78%+ 불일치', '',
                'FRI k개 쿼리 → soundness ≈ (1-ρ⁻¹)ᵏ'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.err}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
