import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { homo: '#6366f1', comb: '#10b981', batch: '#f59e0b', cmp: '#8b5cf6' };

const STEPS = [
  { label: 'KZG 가법 동형성 활용', body: 'commit(f) + commit(g) = commit(f + g)\n\nPLONK: 7개 다항식 각각 개별 커밋\n  [a]₁, [b]₁, [c]₁, [Z]₁, [tₗ]₁, [tₘ]₁, [tₕ]₁\n  + 2개 opening: W_ζ, W_ζω\n  → 9개 G1 점.\n\nFFLONK: 동형성으로 합쳐서 커밋 수 감소.' },
  { label: 'Combined Polynomial h(x)', body: 'ν ← Fiat-Shamir\nh(x) = f₁(x) + ν·f₂(x) + ν²·f₃(x) + ...\n\n7개 다항식 → 1개 h(x)로 결합.\ncommit(h) = [f₁]₁ + ν·[f₂]₁ + ν²·[f₃]₁ + ...\n\n// 가법 동형으로 새 커밋 없이 기존 커밋 재사용.' },
  { label: 'Batch Opening — 단일 증명', body: 'PLONK: 평가점 ζ, ζω 에 대해 2개 opening.\n\nFFLONK: 평가점을 다항식에 내재화:\n  h\'(x) = h(x) - h(ζ) ← ζ에서 0\n  W = commit(h\'(x) / (x - ζ))\n\n단일 opening proof W → 증명 크기 감소.' },
  { label: 'PLONK vs FFLONK 비교', body: 'PLONK                    FFLONK\n─────                    ──────\n커밋: G1×9               G1×4\nOpening: 2개 (W_ζ,W_ζω)  1개 (W)\n증명 크기: ~900B          ~700B\n검증 gas: 높음            ~20% 절감\n\n// Polygon zkEVM에서 FFLONK 채택.' },
];

export default function FFLONKViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.homo}>KZG 동형성</text>
              {['commit(f)+commit(g) = commit(f+g)', '',
                'PLONK: 9개 G1 점 (7 커밋 + 2 open)',
                '  [a],[b],[c],[Z],[tₗ],[tₘ],[tₕ],Wζ,Wζω', '',
                'FFLONK: 동형성으로 합쳐서 축소'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.homo}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.comb}>Combined h(x)</text>
              {['ν ← FS',
                'h(x) = f₁ + ν·f₂ + ν²·f₃ + ...', '',
                'commit(h) = [f₁] + ν·[f₂] + ν²·[f₃]+...',
                '// 기존 커밋 재사용 → 새 커밋 불필요', '',
                '7개 → 1개 결합 다항식'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.comb}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.batch}>Batch Opening</text>
              {['PLONK: W_ζ, W_ζω → 2개', '',
                'FFLONK: 평가점 내재화',
                '  h\'(x) = h(x) − h(ζ)',
                '  W = commit(h\'/(x−ζ))', '',
                '→ 단일 opening proof W'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.batch}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.cmp}>비교</text>
              {['             PLONK      FFLONK',
                '커밋:        G1×9       G1×4',
                'Opening:     2개        1개',
                '증명:        ~900B      ~700B',
                'Gas:         높음       ~20% ↓', '',
                '// Polygon zkEVM에서 FFLONK 채택'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.cmp}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
