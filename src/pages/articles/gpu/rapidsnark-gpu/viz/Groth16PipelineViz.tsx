import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  ntt: '#0ea5e9',
  div: '#10b981',
  intt: '#a855f7',
  msm: '#f59e0b',
  proof: '#ef4444',
  bottle: '#ef4444',
};

const STEPS = [
  {
    label: 'Step 1: 다항식 평가 (NTT)',
    body: 'a(x) = NTT(A · witness), b(x) = NTT(B · witness), c(x) = NTT(C · witness).\n각 NTT는 멀티스레드 — 16코어에서 60ms 수준.',
  },
  {
    label: 'Step 2: 몫 다항식 H(x)',
    body: 'h_eval = (a · b − c) / Z — evaluation domain에서 원소별 나눗셈.\nZ = vanishing polynomial (모든 제약 루트의 곱).',
  },
  {
    label: 'Step 3: 역변환 (INTT)',
    body: 'H_coeffs = INTT(h_eval) — 계수 형태로 복원.\nMSM 입력으로 사용하기 위함.',
  },
  {
    label: 'Step 4: MSM (병목 70~80%)',
    body: 'pi_A = MSM(witness, pk.A) [G1], pi_B = MSM(witness, pk.B) [G2],\npi_C = MSM(witness, pk.C) [G1], pi_H = MSM(H_coeffs, pk.H) [G1].',
  },
  {
    label: 'Step 5: 증명 조립',
    body: 'proof = { pi_A, pi_B, pi_C } — 3개 타원곡선 점.\npi_C에 pi_H가 합산되어 최종 출력 (Groth16 pairing 검증과 호환).',
  },
];

const STAGES = [
  { name: 'NTT', cost: '~60ms', color: C.ntt },
  { name: 'H = (a·b−c)/Z', cost: '~20ms', color: C.div },
  { name: 'INTT', cost: '~60ms', color: C.intt },
  { name: 'MSM × 4', cost: '~2.4s (CPU)', color: C.msm },
  { name: 'assemble', cost: '<1ms', color: C.proof },
];

export default function Groth16PipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            Groth16 증명 파이프라인 — 5단계
          </text>

          {/* 5단계 시각화 (항상) */}
          {STAGES.map((s, i) => {
            const isActive = i === step;
            const isPast = i < step;
            const x = 14 + i * 92;
            return (
              <motion.g key={s.name} initial={{ opacity: 0.4 }}
                animate={{ opacity: isActive ? 1 : isPast ? 0.85 : 0.4 }} transition={{ duration: 0.25 }}>
                <rect x={x} y={36} width={86} height={42} rx={6}
                  fill={isActive ? s.color + '20' : 'var(--card)'}
                  stroke={s.color} strokeWidth={isActive ? 1.2 : 0.5} />
                <rect x={x} y={36} width={3.5} height={42} fill={s.color} />
                <text x={x + 45} y={56} textAnchor="middle" fontSize={9} fontWeight={700} fill={s.color}>{s.name}</text>
                <text x={x + 45} y={70} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{s.cost}</text>
                {/* 화살표 */}
                {i < STAGES.length - 1 && (
                  <line x1={x + 86} y1={57} x2={x + 92} y2={57} stroke={s.color} strokeWidth={1} />
                )}
              </motion.g>
            );
          })}

          {/* Step별 디테일 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={100} w={140} h={32} label="A · witness → NTT" color={C.ntt} outlined />
              <DataBox x={170} y={100} w={140} h={32} label="B · witness → NTT" color={C.ntt} outlined />
              <DataBox x={320} y={100} w={140} h={32} label="C · witness → NTT" color={C.ntt} outlined />
              <ActionBox x={20} y={148} w={440} h={36} label="Cooley-Tukey FFT, OpenMP 16T" sub="2^20 NTT ≈ 60ms" color={C.ntt} />
              <DataBox x={20} y={194} w={440} h={32} label="결과: a(x), b(x), c(x) — eval form" color={C.ntt} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={100} w={210} h={32} label="a · b − c (원소별)" color={C.div} outlined />
              <DataBox x={250} y={100} w={210} h={32} label="Z(s_i) — vanishing poly" color={C.div} outlined />
              <ActionBox x={20} y={148} w={440} h={36} label="h_eval[i] = (a·b − c)[i] / Z(s_i)" sub="O(n) 원소별 Fp 나눗셈" color={C.div} />
              <StatusBox x={20} y={194} w={440} h={32} label="비용 ≪ NTT — 거의 무시 가능" color={C.div} progress={0.05} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={100} w={200} h={32} label="h_eval (eval form)" color={C.div} outlined />
              <ActionBox x={230} y={100} w={230} h={32} label="INTT(h_eval) → H_coeffs" color={C.intt} />
              <DataBox x={20} y={148} w={440} h={36} label="H(x) 계수 — 다음 MSM 입력" color={C.intt} outlined />
              <StatusBox x={20} y={194} w={440} h={32} label="비용 ≈ NTT와 동일" color={C.intt} progress={0.5} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={100} w={210} h={26} label="pi_A = MSM(w, pk.A) [G1]" color={C.msm} outlined />
              <DataBox x={250} y={100} w={210} h={26} label="pi_B = MSM(w, pk.B) [G2]" color={C.msm} outlined />
              <DataBox x={20} y={132} w={210} h={26} label="pi_C = MSM(w, pk.C) [G1]" color={C.msm} outlined />
              <DataBox x={250} y={132} w={210} h={26} label="pi_H = MSM(H, pk.H) [G1]" color={C.msm} outlined />
              <AlertBox x={20} y={170} w={440} h={36} label="병목: 전체 시간의 70~80%" sub="GPU 오프로드 핵심 타깃" color={C.bottle} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={120} y={100} w={80} h={36} label="pi_A" sub="G1" color={C.proof} outlined />
              <DataBox x={210} y={100} w={80} h={36} label="pi_B" sub="G2" color={C.proof} outlined />
              <DataBox x={300} y={100} w={80} h={36} label="pi_C" sub="G1 (+pi_H)" color={C.proof} outlined />
              <StatusBox x={20} y={150} w={440} h={36} label="proof = { pi_A, pi_B, pi_C } — 약 200B" sub="pairing 검증 입력" color={C.proof} progress={1} />
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Verifier: e(pi_A, pi_B) = e(vk_α, vk_β) · e(pi_C, vk_δ) ...
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
