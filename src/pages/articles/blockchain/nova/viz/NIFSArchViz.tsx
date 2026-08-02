import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  u1: '#a855f7',
  u2: '#3b82f6',
  t: '#f59e0b',
  fold: '#6366f1',
  aug: '#14b8a6',
  fs: '#ec4899',
};

const STEPS = [
  {
    label: '1: NIFS 입력 — 두 R1CS 인스턴스',
    body: 'U₁ = (comm_W, comm_E, u, x) — 누적된 Relaxed.\nU₂ = (comm_W, E=0, u=1, x) — 이번 step 의 fresh.\n둘 다 같은 회로 shape, 다른 witness.',
  },
  {
    label: '2: 교차항 T 계산',
    body: 'T = AW₁ ⊙ BW₂ + AW₂ ⊙ BW₁ − u₁·CW₂ − u₂·CW₁.\nFold 후 Relaxed 등식이 닫혀있게 만드는 보정 항.',
  },
  {
    label: '3: comm_T + Fiat-Shamir 챌린지',
    body: 'Pedersen.commit(T) → transcript 흡수 → r 추출.\n공개·흡수·도전 순서가 soundness 의 핵심.',
  },
  {
    label: '4: 선형 폴딩 U′ = U₁ + r·U₂',
    body: 'comm_W ′, comm_E ′, u ′, x ′ 모두 그룹 동형으로 결합.\nWitness W ′ = W₁ + r·W₂ 는 prover 만 보유.',
  },
  {
    label: '5: Augmented Circuit 재검증',
    body: 'E ′ = E₁ + r·T + r²·E₂. AW ′ ⊙ BW ′ = u ′·CW ′ + E ′ 등식 회로 내부 검증.\n다음 step 에서도 같은 형태 → IVC 폐쇄성.',
  },
];

export default function NIFSArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="nf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.fold} />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                두 인스턴스 U₁, U₂
              </text>

              <ModuleBox x={30} y={50} w={200} h={62} label="U₁ — 누적 Relaxed" sub="comm_W, comm_E, u, x" color={C.u1} />
              <ModuleBox x={270} y={50} w={200} h={62} label="U₂ — Fresh 표준" sub="comm_W, E=0, u=1, x" color={C.u2} />

              <text x={250} y={140} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                동일 회로 shape · 다른 witness · 같은 등식 형태
              </text>
              <DataBox x={130} y={160} w={240} h={40} label="등식: AW ⊙ BW = u·CW + E" sub="u=1, E=0 → 표준 R1CS" color={C.fold} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.t}>
                교차항 T
              </text>
              <DataBox x={20} y={50} w={140} h={42} label="AW₁ ⊙ BW₂" color={C.t} outlined />
              <DataBox x={170} y={50} w={140} h={42} label="AW₂ ⊙ BW₁" color={C.t} outlined />
              <DataBox x={320} y={50} w={160} h={42} label="− u₁·CW₂ − u₂·CW₁" color={C.t} outlined />

              <ActionBox x={150} y={115} w={200} h={50} label="합산 → T ∈ Fⁿ" sub="n = 제약 수" color={C.t} />

              <motion.line x1={90} y1={92} x2={250} y2={115} stroke={C.t} strokeWidth={1.2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={240} y1={92} x2={250} y2={115} stroke={C.t} strokeWidth={1.2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
              <motion.line x1={400} y1={92} x2={250} y2={115} stroke={C.t} strokeWidth={1.2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />

              <text x={250} y={195} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                T 가 없으면 fold 후 등식이 깨진다 — Relaxed 의 E 가 흡수한다
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fs}>
                Pedersen + Fiat-Shamir
              </text>
              <DataBox x={30} y={55} w={120} h={42} label="T" sub="vector ∈ Fⁿ" color={C.t} outlined />
              <ActionBox x={170} y={55} w={140} h={42} label="Pedersen commit" color={C.fs} />
              <DataBox x={330} y={55} w={140} h={42} label="comm_T" sub="single point" color={C.fs} outlined />

              <ActionBox x={30} y={120} w={170} h={50} label="transcript.absorb" sub="comm_T 추가" color={C.fs} />
              <ActionBox x={220} y={120} w={170} h={50} label="squeeze" sub="r ∈ Fq 추출" color={C.fs} />
              <DataBox x={400} y={130} w={80} h={36} label="r" color={C.fold} outlined />

              <motion.line x1={150} y1={76} x2={170} y2={76} stroke={C.fs} strokeWidth={1.2}
                markerEnd="url(#nf-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={310} y1={76} x2={330} y2={76} stroke={C.fs} strokeWidth={1.2}
                markerEnd="url(#nf-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
              <motion.line x1={400} y1={97} x2={115} y2={120} stroke={C.fs} strokeWidth={1} strokeDasharray="3 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
              <motion.line x1={200} y1={145} x2={220} y2={145} stroke={C.fs} strokeWidth={1.2}
                markerEnd="url(#nf-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
              <motion.line x1={390} y1={148} x2={400} y2={148} stroke={C.fold} strokeWidth={1.2}
                markerEnd="url(#nf-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />

              <text x={250} y={195} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                "공개 → 흡수 → 도전" 순서가 soundness 의 핵심
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fold}>
                선형 폴딩 U' = U₁ + r·U₂
              </text>
              <DataBox x={20} y={50} w={140} h={32} label="comm_W'" sub="W₁ + r·W₂" color={C.fold} outlined />
              <DataBox x={170} y={50} w={140} h={32} label="comm_E'" sub="E₁ + r·T + r²·E₂" color={C.fold} outlined />
              <DataBox x={320} y={50} w={140} h={32} label="u'" sub="u₁ + r·u₂" color={C.fold} outlined />

              <DataBox x={20} y={92} w={140} h={32} label="x'" sub="x₁ + r·x₂" color={C.fold} outlined />
              <DataBox x={170} y={92} w={140} h={32} label="W' (prover)" sub="W₁ + r·W₂" color={C.u1} outlined />
              <DataBox x={320} y={92} w={140} h={32} label="E' (prover)" sub="E₁ + r·T + r²·E₂" color={C.u1} outlined />

              <ModuleBox x={130} y={140} w={240} h={50} label="U' = (comm_W', comm_E', u', x')" sub="다음 step 의 누적기" color={C.aug} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.aug}>
                Augmented Circuit — 회로 내 재검증
              </text>
              <DataBox x={20} y={50} w={140} h={42} label="W'" color={C.fold} outlined />
              <DataBox x={170} y={50} w={140} h={42} label="E'" color={C.fold} outlined />
              <DataBox x={320} y={50} w={140} h={42} label="u'" color={C.fold} outlined />

              <ActionBox x={70} y={110} w={360} h={50} label="check: A·W' ⊙ B·W' == u'·C·W' + E'" sub="회로 내부 제약" color={C.aug} />
              <StatusBox x={130} y={170} w={240} h={36} label="IVC 폐쇄성 — 같은 형태 유지" sub=" " color={C.aug} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
