import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  vec: '#6366f1',
  cm: '#8b5cf6',
  ch: '#f59e0b',
  fold: '#10b981',
  lr: '#ec4899',
  done: '#ef4444',
};

const STEPS = [
  {
    label: '1: 입력 벡터 a, b 와 내적 c',
    body: 'a, b ∈ Fⁿ, c = ⟨a, b⟩.\n예: a=[3,7], b=[2,5] → c = 6 + 35 = 41.',
  },
  {
    label: '2: Pedersen 벡터 커밋 P',
    body: 'P = ⟨a, G⟩ + ⟨b, H⟩ + c·U.\nG, H 는 미리 합의된 generator 벡터.',
  },
  {
    label: '3: Fiat-Shamir challenge u',
    body: 'transcript 에 P 추가 → 해시로 challenge u 추출.\nVerifier 도 동일하게 재현.',
  },
  {
    label: '4: 접기 한 라운드 (n → n/2)',
    body: 'L = ⟨aₗ,Gᵣ⟩ + … , R = ⟨aᵣ,Gₗ⟩ + …\na\' = aₗ·u + aᵣ·u⁻¹ — 길이 절반.',
  },
  {
    label: '5: log₂n 라운드 재귀',
    body: 'n=64 → 6 라운드. 매 라운드 (Lᵢ, Rᵢ) 쌍 누적.\n최종 a, b 는 스칼라 1개씩.',
  },
  {
    label: '6: 최종 검증',
    body: 'P\' = Σ uᵢ²·Lᵢ + P + Σ uᵢ⁻²·Rᵢ. check a\'·b\' = c.\n증명 크기 = 2·log₂n 점 + 2 스칼라.',
  },
];

export default function IPAStepsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ipa-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.fold} />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.vec}>
                입력 a, b ∈ Fⁿ
              </text>
              {/* a 벡터 8개 셀 */}
              {[3, 7, 2, 5, 4, 1, 6, 8].map((v, i) => (
                <motion.g key={`a${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }}>
                  <rect x={30 + i * 55} y={50} width={48} height={32} rx={4}
                    fill={`${C.vec}18`} stroke={C.vec} strokeWidth={0.6} />
                  <text x={54 + i * 55} y={71} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.vec}>{v}</text>
                </motion.g>
              ))}
              <text x={20} y={70} textAnchor="end" fontSize={10} fontWeight={600} fill={C.vec}>a</text>

              {[2, 5, 1, 3, 4, 7, 6, 2].map((v, i) => (
                <motion.g key={`b${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }}>
                  <rect x={30 + i * 55} y={95} width={48} height={32} rx={4}
                    fill={`${C.vec}18`} stroke={C.vec} strokeWidth={0.6} />
                  <text x={54 + i * 55} y={116} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.vec}>{v}</text>
                </motion.g>
              ))}
              <text x={20} y={115} textAnchor="end" fontSize={10} fontWeight={600} fill={C.vec}>b</text>

              <DataBox x={150} y={155} w={200} h={50} label="c = ⟨a, b⟩ = 41 …" sub="(예시: a₀b₀ + a₁b₁ + …)" color={C.cm} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cm}>
                Pedersen 커밋 P
              </text>
              <DataBox x={20} y={50} w={150} h={42} label="⟨a, G⟩" sub="Σ aᵢ·Gᵢ" color={C.cm} outlined />
              <DataBox x={180} y={50} w={150} h={42} label="⟨b, H⟩" sub="Σ bᵢ·Hᵢ" color={C.cm} outlined />
              <DataBox x={340} y={50} w={140} h={42} label="c · U" sub="내적 commit" color={C.cm} outlined />

              <ActionBox x={150} y={120} w={200} h={50} label="합: P" sub="단일 그룹 원소" color={C.cm} />

              <motion.line x1={95} y1={92} x2={250} y2={120} stroke={C.cm} strokeWidth={1.2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={255} y1={92} x2={250} y2={120} stroke={C.cm} strokeWidth={1.2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
              <motion.line x1={410} y1={92} x2={250} y2={120} stroke={C.cm} strokeWidth={1.2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ch}>
                Fiat-Shamir challenge
              </text>
              <DataBox x={20} y={70} w={140} h={50} label="transcript" sub="P 흡수" color={C.ch} outlined />
              <ActionBox x={180} y={75} w={140} h={42} label="hash → squeeze" color={C.ch} />
              <DataBox x={340} y={75} w={140} h={42} label="u" sub="스칼라" color={C.fold} outlined />

              <motion.line x1={160} y1={95} x2={180} y2={95} stroke={C.ch} strokeWidth={1.2}
                markerEnd="url(#ipa-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={320} y1={95} x2={340} y2={95} stroke={C.ch} strokeWidth={1.2}
                markerEnd="url(#ipa-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />

              <text x={250} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Verifier 도 동일한 transcript 로 같은 u 재현 — 비대화형
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fold}>
                접기 1 라운드 (n=8 → 4)
              </text>
              {/* a 분할 */}
              {[3, 7, 2, 5].map((v, i) => (
                <rect key={`al${i}`} x={30 + i * 50} y={50} width={42} height={28} rx={3}
                  fill={`${C.vec}25`} stroke={C.vec} strokeWidth={0.6} />
              ))}
              {[4, 1, 6, 8].map((v, i) => (
                <rect key={`ar${i}`} x={260 + i * 50} y={50} width={42} height={28} rx={3}
                  fill={`${C.vec}25`} stroke={C.vec} strokeWidth={0.6} />
              ))}
              <text x={120} y={45} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.vec}>aₗ</text>
              <text x={350} y={45} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.vec}>aᵣ</text>

              <ActionBox x={50} y={100} w={170} h={42} label="L = ⟨aₗ,Gᵣ⟩ + ⟨bᵣ,Hₗ⟩ + …" color={C.lr} />
              <ActionBox x={280} y={100} w={170} h={42} label="R = ⟨aᵣ,Gₗ⟩ + ⟨bₗ,Hᵣ⟩ + …" color={C.lr} />

              {/* 폴딩 결과 4 셀 */}
              {[0, 1, 2, 3].map((i) => (
                <motion.rect key={`af${i}`} x={130 + i * 50} y={170} width={42} height={28} rx={3}
                  fill={`${C.fold}25`} stroke={C.fold} strokeWidth={0.8}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + 0.05 * i }} />
              ))}
              <text x={350} y={188} fontSize={9} fontWeight={600} fill={C.fold}>a' = aₗ·u + aᵣ·u⁻¹</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.lr}>
                log₂n 라운드 (n=64 → 6 라운드)
              </text>
              {[64, 32, 16, 8, 4, 2, 1].map((n, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }}>
                  <rect x={20 + i * 65} y={70} width={Math.max(20, n / 2)} height={30} rx={3}
                    fill={`${C.fold}25`} stroke={C.fold} strokeWidth={0.6} />
                  <text x={20 + i * 65 + Math.max(20, n / 2) / 2} y={90} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fold}>n={n}</text>
                  {i < 6 && (
                    <text x={20 + i * 65 + Math.max(20, n / 2) + 5} y={90} fontSize={10} fill={C.fold}>→</text>
                  )}
                </motion.g>
              ))}

              <DataBox x={130} y={140} w={240} h={50} label="(L₁,R₁), (L₂,R₂), … (L₆,R₆)" sub="6 쌍 누적 + 최종 a',b' 스칼라" color={C.lr} outlined />
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.done}>
                최종 검증
              </text>
              <ActionBox x={20} y={60} w={460} h={42} label="P' = Σ uᵢ²·Lᵢ + P + Σ uᵢ⁻²·Rᵢ" color={C.cm} />
              <ActionBox x={20} y={115} w={220} h={42} label="check a'·b' = c" color={C.done} />
              <ActionBox x={260} y={115} w={220} h={42} label="check P' = a'·G' + b'·H' + c·U" color={C.done} />

              <StatusBox x={20} y={170} w={460} h={36} label="증명 크기 = 2·log₂n 점 + 2 스칼라" sub="n=64 → 14 elements ≈ 448B" color={C.done} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
