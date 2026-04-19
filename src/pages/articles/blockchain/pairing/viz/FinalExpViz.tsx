import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  ml: '#6b7280',
  e1: '#6366f1',
  e2: '#10b981',
  hard: '#f59e0b',
  result: '#a855f7',
  cheap: '#0ea5e9',
};

const STEPS = [
  {
    label: '1: Miller Loop 결과 f ∈ Fp12*',
    body: 'Miller loop 출력 f. 아직 GT 부분군 아님.\n전체 지수 (p¹² − 1)/r 을 (p⁶−1) · (p²+1) · ((p⁴−p²+1)/r) 3 단계로 분해.',
  },
  {
    label: '2: Easy Part 1 — f^(p⁶−1)',
    body: 'p⁶ 승 = conjugate (c0, c1) → (c0, −c1). f₁ = conjugate(f) · f⁻¹.\nFp6 역원 1회 + Fp12 곱셈 1회 = 거의 무료. 유니타리 성질 획득.',
  },
  {
    label: '3: Easy Part 2 — f₁^(p²+1)',
    body: 'f₂ = Frobenius²(f₁) · f₁.\nFrobenius² 는 각 Fp2 계수에 상수 곱 — Fp 곱 ~6회. "거의 무료".',
  },
  {
    label: '4: Hard Part — f₂^((p⁴−p²+1)/r)',
    body: '지수 ≈ 761 bit. BN param u 활용한 addition chain.\n약 12 단계 Fp12 곱 + Frobenius. 결과: e(P,Q) ∈ GT ⊂ Fp12*.',
  },
];

export default function FinalExpViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="fe-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.hard} />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ml}>
                지수 분해
              </text>
              <DataBox x={20} y={50} w={460} h={42} label="(p¹² − 1) / r" sub="전체 final exp 지수" color={C.ml} outlined />

              <DataBox x={20} y={120} w={140} h={42} label="(p⁶ − 1)" sub="Easy 1" color={C.e1} outlined />
              <DataBox x={170} y={120} w={140} h={42} label="(p² + 1)" sub="Easy 2" color={C.e2} outlined />
              <DataBox x={320} y={120} w={160} h={42} label="(p⁴−p²+1)/r" sub="Hard ≈ 761 bit" color={C.hard} outlined />

              <text x={250} y={195} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                3 단계 분해 — 앞 두 단계는 "거의 무료", 마지막이 비용 95%
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.e1}>
                Easy 1 — f^(p⁶ − 1)
              </text>
              <DataBox x={20} y={60} w={140} h={42} label="f = (c0, c1)" sub="∈ Fp12" color={C.ml} outlined />
              <ActionBox x={180} y={60} w={140} h={42} label="conjugate" sub="(c0, −c1)" color={C.e1} />
              <DataBox x={340} y={60} w={140} h={42} label="conj(f)" color={C.e1} outlined />

              <ActionBox x={180} y={120} w={140} h={42} label="f⁻¹" sub="Fp6 inversion" color={C.cheap} />
              <ActionBox x={20} y={170} w={460} h={36} label="f₁ = conj(f) · f⁻¹" color={C.e1} />

              <text x={250} y={213} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                inv + mul = 2 연산 → 매우 저렴
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.e2}>
                Easy 2 — f₁^(p² + 1)
              </text>
              <DataBox x={20} y={60} w={140} h={42} label="f₁" sub="유니타리" color={C.e1} outlined />
              <ActionBox x={180} y={60} w={140} h={42} label="Frobenius²" sub="계수 상수 곱" color={C.e2} />
              <DataBox x={340} y={60} w={140} h={42} label="Frob²(f₁)" color={C.e2} outlined />

              <ActionBox x={130} y={130} w={240} h={50} label="f₂ = Frob²(f₁) · f₁" color={C.e2} />

              <text x={250} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Frobenius² 는 6 Fp 곱뿐 — 사실상 무료
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.hard}>
                Hard Part — addition chain
              </text>
              <DataBox x={20} y={50} w={140} h={36} label="f₂" color={C.e2} outlined />
              <DataBox x={180} y={50} w={140} h={36} label="u" sub="BN param" color={C.hard} outlined />

              {[0, 1, 2].map((i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 * i }}>
                  <ActionBox x={20 + i * 160} y={100} w={140} h={42}
                    label={['a = f₂^u', 'b = a^u', 'c = b · conj(a)'][i]} color={C.hard} />
                  {i < 2 && (
                    <line x1={160 + i * 160} y1={120} x2={180 + i * 160} y2={120} stroke={C.hard} strokeWidth={1.2}
                      markerEnd="url(#fe-arr)" />
                  )}
                </motion.g>
              ))}

              <text x={250} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ... addition chain 약 12 단계 (Fp12 mul + Frob 조합)
              </text>
              <StatusBox x={130} y={180} w={240} h={32} label="e(P,Q) ∈ GT ⊂ Fp12*" sub=" " color={C.result} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
