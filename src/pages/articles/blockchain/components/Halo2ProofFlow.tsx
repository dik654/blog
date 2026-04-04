import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phases = [
  {
    id: 'advice',
    label: '① 어드바이스 커밋',
    color: 'blue',
    challenge: null,
    detail: '회로 합성 → 어드바이스 열 값 채움 → KZG Commit(advice_poly, blind)\n→ 각 커밋을 transcript에 기록 (Fiat-Shamir 시작)',
  },
  {
    id: 'lookup',
    label: '② θ — Plookup',
    color: 'violet',
    challenge: 'θ (theta)',
    detail: 'θ = transcript.squeeze()\nPlookup: permuted_input = Σ θⁱ·input_i(X)\n→ commit(permuted_input), commit(permuted_table)',
  },
  {
    id: 'permutation',
    label: '③ β, γ — 퍼뮤테이션',
    color: 'indigo',
    challenge: 'β, γ',
    detail: 'β = transcript.squeeze(), γ = transcript.squeeze()\nZ_perm(wX)·Π(A+βσ+γ) = Z_perm(X)·Π(A+βX+γ)\n→ commit(Z_perm), commit(Z_lookup)',
  },
  {
    id: 'vanishing',
    label: '④ y — 소멸 다항식',
    color: 'amber',
    challenge: 'y',
    detail: 'y = transcript.squeeze()\nh(X) = Σ yⁱ·constraint_i(X) / Z_H(X)\n→ h 분할 후 각 조각 commit',
  },
  {
    id: 'opening',
    label: '⑤ x — 개구 & SHPLONK',
    color: 'orange',
    challenge: 'x, x₁, x₂, x₃, x₄',
    detail: 'x = transcript.squeeze()\n각 열 다항식을 x, ωx 등에서 평가\n→ SHPLONK으로 다지점 개구를 단일 KZG 증명으로 압축',
  },
];

export default function Halo2ProofFlow() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="rounded-xl border p-5 space-y-3 not-prose">
      <p className="text-sm font-medium">create_proof — Fiat-Shamir 도전값 순서</p>
      <div className="space-y-2">
        {phases.map((p, i) => {
          const colors: Record<string, string> = {
            blue: 'border-blue-400 bg-blue-50 dark:bg-blue-950/20',
            violet: 'border-violet-400 bg-violet-50 dark:bg-violet-950/20',
            indigo: 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20',
            amber: 'border-amber-400 bg-amber-50 dark:bg-amber-950/20',
            orange: 'border-orange-400 bg-orange-50 dark:bg-orange-950/20',
          };
          const badgeColors: Record<string, string> = {
            blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
            violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
            indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
            amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
            orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
          };
          return (
            <motion.div key={p.id} whileTap={{ scale: 0.99 }}>
              <button
                onClick={() => setActive(a => a === i ? null : i)}
                className={`w-full text-left rounded-lg border-l-4 p-3 cursor-pointer transition-colors ${active === i ? colors[p.color] : 'hover:bg-accent/40'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{p.label}</span>
                  {p.challenge && (
                    <span className={`text-xs px-2 py-0.5 rounded font-mono ${badgeColors[p.color]}`}>
                      {p.challenge}
                    </span>
                  )}
                </div>
              </button>
              <AnimatePresence>
                {active === i && (
                  <motion.pre
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs bg-muted rounded-b px-3 py-2 font-mono whitespace-pre-wrap overflow-hidden"
                  >
                    {p.detail}
                  </motion.pre>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      <p className="text-xs text-foreground/60">
        각 도전값은 이전 단계의 커밋을 transcript에 기록한 후 squeeze — 비대화형 변환 (Fiat-Shamir)
      </p>
    </div>
  );
}
