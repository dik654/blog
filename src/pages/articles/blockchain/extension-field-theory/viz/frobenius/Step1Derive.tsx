import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathTex from '@/components/ui/math';

const steps = [
  {
    label: '출발점',
    formula: '(a + bu)^7 = \\;?',
    note: 'F₇² 원소를 7제곱한다. 어떻게 전개될까?',
  },
  {
    label: '페르마 소정리',
    formula: 'a^7 = a',
    note: 'Fp 원소는 p제곱해도 자기 자신. a ∈ F₇ 이므로 a⁷ = a.',
  },
  {
    label: 'b도 마찬가지',
    formula: 'b^7 = b',
    note: 'b도 F₇ 원소이므로 같은 이유로 b⁷ = b.',
  },
  {
    label: 'u⁷ 계산: 분해',
    formula: 'u^7 = u^6 \\cdot u = (u^2)^3 \\cdot u',
    note: '지수를 분해하여 u²을 활용할 수 있는 형태로 만든다.',
  },
  {
    label: 'u² = −1 대입',
    formula: '(u^2)^3 \\cdot u = (-1)^3 \\cdot u = -u',
    note: 'u² = −1 (확장체의 정의)이므로 대입하면 u⁷ = −u.',
  },
  {
    label: '전체 결합',
    formula: '(a+bu)^7 = a^7 + b^7 \\cdot u^7 = a + b \\cdot (-u)',
    note: '위의 결과를 모두 대입한다.',
  },
  {
    label: '최종 결과',
    formula: '\\boxed{\\varphi(a+bu) = a - bu}',
    note: 'u의 부호만 뒤집힌다 — 복소수 켤레 (a+bi → a−bi) 와 동일!',
  },
];

export default function Step1Derive() {
  const [cur, setCur] = useState(0);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 수식 영역 */}
      <AnimatePresence mode="wait">
        <motion.div key={cur}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="text-center py-6">
          <p className="text-xs font-medium text-primary mb-3">
            {cur + 1} / {steps.length} — {steps[cur].label}
          </p>
          <MathTex display>{steps[cur].formula}</MathTex>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            {steps[cur].note}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* 이전/다음 */}
      <div className="flex justify-center items-center gap-3 mt-2">
        <button onClick={() => setCur(s => Math.max(0, s - 1))} disabled={cur === 0}
          className="px-4 py-1.5 text-xs rounded-lg border disabled:opacity-30
            hover:bg-accent cursor-pointer transition-colors">
          ← 이전
        </button>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div key={i} onClick={() => setCur(i)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-colors
                ${i <= cur ? 'bg-primary' : 'bg-border'}`} />
          ))}
        </div>
        <button onClick={() => setCur(s => Math.min(steps.length - 1, s + 1))}
          disabled={cur === steps.length - 1}
          className="px-4 py-1.5 text-xs rounded-lg border disabled:opacity-30
            hover:bg-accent cursor-pointer transition-colors">
          다음 →
        </button>
      </div>
    </div>
  );
}
