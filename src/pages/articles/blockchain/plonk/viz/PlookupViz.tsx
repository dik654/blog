import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { t: '#6366f1', f: '#10b981', s: '#f59e0b', z: '#8b5cf6' };

const STEPS = [
  { label: '① 테이블 T 정의', body: 'T = {0, 1, 2, 3, 4, 5, 6, 7}  // 허용 값\n\n용도: range check (0~7), XOR 테이블 등.\n검증자가 미리 공개 → 셋업 시 커밋 계산.\n\nt(x): T를 보간한 다항식.\nt(ω⁰)=0, t(ω¹)=1, ..., t(ω⁷)=7.' },
  { label: '② 쿼리 벡터 f', body: 'f = {3, 1, 5, 3}  // 증명 대상 값\n\n주장: "모든 fᵢ ∈ T"\n= f₀=3 ∈ T ✓,  f₁=1 ∈ T ✓\n  f₂=5 ∈ T ✓,  f₃=3 ∈ T ✓\n\n나이브 검증: 각 값마다 T 전체 스캔 → O(n·m)\nPlookup: grand product로 O(n+m).' },
  { label: '③ 정렬 병합 s 구성', body: 's = sort(T ∪ f) = {0, 1, 1, 2, 3, 3, 4, 5, 5, 6, 7}\n\n규칙: T 순서로 정렬, f 원소는 T 옆에 삽입.\n핵심 관찰: sᵢ₊₁ = sᵢ 이거나 sᵢ₊₁ = T의 다음 값.\n\n이 속성이 "f ⊂ T"를 보장.\nf에 없는 값(2,4,6,7)은 T에서만 1회 등장.' },
  { label: '④ Grand Product 다항식', body: 'β, γ ← Fiat-Shamir\n\nZ(X): 누적 곱\nZ(1) = 1\nZ(ωⁱ⁺¹) = Z(ωⁱ) · (1+β)ⁿ · Π(γ+fᵢ)·Π(γ(1+β)+tᵢ+β·tᵢ₊₁)\n           / Π(γ(1+β)+sᵢ+β·sᵢ₊₁)\n\nZ(ωⁿ) = 1 ⟺ 정렬 조건 성립 ⟺ f ⊂ T.' },
];

export default function PlookupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.t}>테이블 T</text>
              {['T = {0, 1, 2, 3, 4, 5, 6, 7}', '',
                't(x): T를 보간한 다항식',
                't(ω⁰)=0, t(ω¹)=1, ..., t(ω⁷)=7', '',
                '// range check, XOR 등에 사용'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.t}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.f}>쿼리 f</text>
              {['f = {3, 1, 5, 3}', '',
                '검증: f₀=3∈T✓, f₁=1∈T✓',
                '      f₂=5∈T✓, f₃=3∈T✓', '',
                'naive: O(n·m) → Plookup: O(n+m)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.f}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.s}>정렬 병합 s</text>
              {['s = sort(T ∪ f)',
                '  = {0, 1, 1, 2, 3, 3, 4, 5, 5, 6, 7}', '',
                '속성: s[i+1] = s[i]  또는',
                '      s[i+1] = T의 다음 값', '',
                '→ "f ⊂ T" 보장'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.s}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.z}>Grand Product Z(X)</text>
              {['β, γ ← FS',
                'Z(1) = 1',
                'Z(ωⁱ⁺¹) = Z(ωⁱ) ·',
                '  (1+β)ⁿ·Π(γ+fᵢ)·Π(γ(1+β)+tᵢ+βtᵢ₊₁)',
                '  / Π(γ(1+β)+sᵢ+βsᵢ₊₁)', '',
                'Z(ωⁿ) = 1 ⟺ f ⊂ T'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.z}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
