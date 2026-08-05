import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  pp: '#a855f7',
  rs: '#3b82f6',
  f1: '#10b981',
  fn: '#ec4899',
  comp: '#6366f1',
  fold: '#f59e0b',
  shared: '#0ea5e9',
};

const STEPS = [
  {
    label: '1: PublicParams 셋업',
    body: 'StepCircuit F → R1CS shape + Pedersen commit key. Augmented circuit (F + NIFS::verify) 자동 합성 → primary/secondary 두 회로 준비.',
  },
  {
    label: '2: RecursiveSNARK 초기화',
    body: 'z₀ = 초기 입력. r_U/r_W = trivial 인스턴스 (u=0, E=0). 카운터 i=0 으로 출발.',
  },
  {
    label: '3: 첫 번째 폴딩',
    body: 'z₁ = F(z₀). 새 인스턴스 U₂ 생성 → 교차항 T → comm_T 커밋 → Fiat-Shamir r → r_U/r_W 업데이트.',
  },
  {
    label: '4: N-step 재귀',
    body: 'i = 1..N 동안 같은 fold 패턴 반복. 누적 인스턴스 크기는 O(1) — 단계 N 과 무관하게 일정.',
  },
  {
    label: '5: CompressedSNARK (Spartan)',
    body: '최종 (r_U, r_W) 만족성을 Spartan sumcheck + polynomial commit 으로 단일 SNARK 로 압축. 증명 ~수 KB, 검증 O(log n).',
  },
];

export default function IVCFoldingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ivc-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.fold} />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.pp}>
                PublicParams::setup(F)
              </text>
              <ModuleBox x={30} y={50} w={130} h={50} label="StepCircuit F" sub="user-defined" color={C.pp} />
              <ActionBox x={190} y={55} w={130} h={42} label="to_r1cs()" sub="shape 추출" color={C.pp} />
              <DataBox x={350} y={55} w={130} h={42} label="r1cs_shape" sub="A, B, C 매트릭스" color={C.pp} outlined />

              <ActionBox x={190} y={110} w={130} h={42} label="commit_key()" sub="Pedersen 키" color={C.pp} />
              <DataBox x={350} y={110} w={130} h={42} label="ck" sub="generator points" color={C.pp} outlined />

              <ModuleBox x={130} y={165} w={240} h={42} label="Augmented Circuit (F + NIFS.verify)" sub="primary / secondary 분리" color={C.shared} />

              <motion.line x1={160} y1={75} x2={190} y2={76} stroke={C.pp} strokeWidth={1.2}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={320} y1={76} x2={350} y2={76} stroke={C.pp} strokeWidth={1.2}
                markerEnd="url(#ivc-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
              <motion.line x1={160} y1={75} x2={190} y2={130} stroke={C.pp} strokeWidth={1.2} strokeDasharray="3 3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              <motion.line x1={320} y1={131} x2={350} y2={131} stroke={C.pp} strokeWidth={1.2}
                markerEnd="url(#ivc-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.rs}>
                RecursiveSNARK 초기 상태
              </text>
              <DataBox x={30} y={60} w={120} h={50} label="z₀" sub="initial state" color={C.rs} outlined />
              <DataBox x={170} y={60} w={140} h={50} label="r_U = trivial" sub="u=0, E=0" color={C.rs} outlined />
              <DataBox x={330} y={60} w={140} h={50} label="r_W = trivial" sub="zero witness" color={C.rs} outlined />

              <StatusBox x={130} y={140} w={240} h={42} label="i = 0" sub="아직 폴딩 없음" color={C.rs} progress={0} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.f1}>
                Step 1 — 첫 폴딩
              </text>
              <DataBox x={20} y={45} w={100} h={42} label="z₀" color={C.rs} outlined />
              <ActionBox x={130} y={45} w={100} h={42} label="F" sub="step circuit" color={C.f1} />
              <DataBox x={240} y={45} w={100} h={42} label="z₁" color={C.f1} outlined />
              <DataBox x={350} y={45} w={130} h={42} label="U₂" sub="fresh, u=1" color={C.f1} outlined />

              <motion.line x1={120} y1={66} x2={130} y2={66} stroke={C.f1} strokeWidth={1.5}
                markerEnd="url(#ivc-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
              <motion.line x1={230} y1={66} x2={240} y2={66} stroke={C.f1} strokeWidth={1.5}
                markerEnd="url(#ivc-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />

              <ActionBox x={20} y={110} w={140} h={50} label="cross_term T" sub="r_U × U₂" color={C.fold} />
              <ActionBox x={170} y={110} w={140} h={50} label="Pedersen(T)" sub="commit" color={C.fold} />
              <ActionBox x={320} y={110} w={140} h={50} label="FS → r" sub="challenge" color={C.fold} />

              <DataBox x={70} y={170} w={170} h={36} label="r_U' = r_U + r·U₂" color={C.f1} outlined />
              <DataBox x={260} y={170} w={170} h={36} label="r_W' = r_W + r·W₂" color={C.f1} outlined />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fn}>
                N-step 재귀 — O(1) 누적
              </text>
              {/* 4 step 카드 + accumulator 일정한 크기 */}
              {[0, 1, 2, 3].map((i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 * i }}>
                  <ActionBox x={20 + i * 120} y={50} w={100} h={48} label={`step ${i + 1}`} sub={`F + fold`} color={C.fn} />
                  {i < 3 && (
                    <line x1={120 + i * 120} y1={74} x2={140 + i * 120} y2={74} stroke={C.fn} strokeWidth={1.2}
                      markerEnd="url(#ivc-arr)" />
                  )}
                </motion.g>
              ))}

              <DataBox x={130} y={130} w={240} h={50} label="누적 인스턴스 r_U" sub="크기 = const · 단계 무관" color={C.fold} outlined />
              <text x={250} y={205} textAnchor="middle" fontSize={9.5}
                fill="var(--muted-foreground)">
                전통 재귀 SNARK 와의 결정적 차이 — 매 step prover 비용 일정
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.comp}>
                CompressedSNARK::prove (Spartan)
              </text>
              <DataBox x={30} y={50} w={150} h={50} label="r_U / r_W" sub="누적 인스턴스" color={C.fn} outlined />
              <ActionBox x={195} y={55} w={130} h={42} label="Sumcheck" sub="만족성 증명" color={C.comp} />
              <ActionBox x={340} y={55} w={140} h={42} label="Polycommit" sub="opening 생성" color={C.comp} />

              <motion.line x1={180} y1={75} x2={195} y2={76} stroke={C.comp} strokeWidth={1.2}
                markerEnd="url(#ivc-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={325} y1={76} x2={340} y2={76} stroke={C.comp} strokeWidth={1.2}
                markerEnd="url(#ivc-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />

              <DataBox x={170} y={120} w={160} h={48} label="proof π" sub="~수 KB · O(1) 검증" color={C.comp} outlined />
              <StatusBox x={20} y={180} w={460} h={28} label="Verify O(log n) — 단계 수 무관" sub=" " color={C.comp} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
