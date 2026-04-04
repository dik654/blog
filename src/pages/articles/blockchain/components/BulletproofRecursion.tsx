import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Round = { n: number; L: string; R: string; desc: string };

const rounds: Round[] = [
  { n: 8, L: 'L₀', R: 'R₀', desc: 'a = [a₀…a₃] ‖ [a₄…a₇], 도전값 u₀ 샘플링' },
  { n: 4, L: 'L₁', R: 'R₁', desc: "a' = a_lo + u₀·a_hi, b' = b_lo + u₀⁻¹·b_hi" },
  { n: 2, L: 'L₂', R: 'R₂', desc: 'u₁으로 절반 더 감소' },
  { n: 1, L: '(a,b)', R: '', desc: '최종 스칼라 쌍 (a,b) 전송 — O(log n) 증명 완료' },
];

export default function BulletproofRecursion() {
  const [step, setStep] = useState(0);

  return (
    <div className="rounded-xl border p-5 space-y-4 not-prose">
      <p className="text-sm font-medium">Inner Product Proof — O(log n) 재귀 절반 감소</p>

      <div className="flex items-center gap-2 flex-wrap">
        {rounds.map((r, i) => (
          <motion.button
            key={i}
            onClick={() => setStep(i)}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border cursor-pointer transition-colors ${step === i ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}`}
          >
            n={r.n}
          </motion.button>
        ))}
      </div>

      {/* Vector visualization */}
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-[200px]">
          {Array.from({ length: rounds[0].n }, (_, i) => {
            const activeN = rounds[step].n;
            const inLo = i < activeN / 2;
            const folded = i < activeN;
            return (
              <motion.div
                key={i}
                animate={{
                  opacity: folded ? 1 : 0.2,
                  scaleY: folded ? 1 : 0.5,
                  backgroundColor: i < activeN
                    ? inLo ? 'oklch(0.55 0.2 250)' : 'oklch(0.55 0.2 140)'
                    : 'oklch(0.8 0 0)',
                }}
                transition={{ duration: 0.4 }}
                className="flex-1 h-12 rounded text-[9px] text-white flex items-center justify-center font-mono"
              >
                a{i}
              </motion.div>
            );
          })}
        </div>
        <div className="flex gap-1 mt-1 text-[10px] text-foreground/60">
          <span style={{ flex: rounds[step].n / 2 }} className="text-center">a_lo</span>
          <span style={{ flex: rounds[step].n / 2 }} className="text-center">a_hi</span>
          {rounds[step].n < rounds[0].n && (
            <span style={{ flex: rounds[0].n - rounds[step].n }} className="text-center text-muted-foreground">접힘</span>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-lg bg-accent p-3 text-xs space-y-1"
        >
          <div className="font-semibold">Round {step + 1} / {rounds.length}</div>
          <div className="text-foreground/75">{rounds[step].desc}</div>
          {step < rounds.length - 1 && (
            <div className="font-mono bg-background rounded p-2 mt-1">
              {rounds[step].L} = &lt;a_lo, G_hi&gt; + &lt;b_hi, H_lo&gt; + &lt;a_lo, b_hi&gt;·Q<br />
              {rounds[step].R} = &lt;a_hi, G_lo&gt; + &lt;b_lo, H_hi&gt; + &lt;a_hi, b_lo&gt;·Q<br />
              u{step} = transcript.challenge() ← Fiat-Shamir
            </div>
          )}
          {step === rounds.length - 1 && (
            <div className="font-mono bg-background rounded p-2 mt-1">
              검증: a·b == claim?<br />
              P == a·G + b·H + a·b·Q? (MSM)<br />
              증명 크기: 2·log₂(n)개 L,R 포인트 + 스칼라 2개
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
