import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  init: '#6366f1',
  prime: '#10b981',
  mul: '#f59e0b',
  key: '#8b5cf6',
  party: '#0ea5e9',
  result: '#ec4899',
};

const STEPS = [
  {
    label: '1: 초기화 + commit-reveal 인덱스',
    body: '각 Pᵢ 가 rᵢ 생성 → commit(rᵢ) broadcast → reveal → 정렬 후 인덱스 할당.\n공정한 인덱스 — 누구도 자기 위치 조작 불가.',
  },
  {
    label: '2: 분산 소수 p 생성',
    body: '각 Pᵢ: pᵢ ← random_prime_candidate(1024).\np = Σ pᵢ (Shamir 공유). Jacobi 분산 곱 + Miller-Rabin 병렬 검증.\nq 도 동일 절차.',
  },
  {
    label: '3: N = p × q 분산 곱',
    body: '(Σ pᵢ)(Σ qⱼ) = Σ pᵢ·qⱼ. 교차항을 Paillier 동형 암호로 계산.\nBiprime 검증: φ(N) = (p−1)(q−1) 분산 계산.',
  },
  {
    label: '4: Paillier 키 완성',
    body: 'λ = lcm(p−1, q−1). 각 Pᵢ 가 λᵢ 공유 보유.\npk = (N, g) 공개, skᵢ = θᵢ — t-of-n 임계값. 단일 참가자는 sk 복원 불가.',
  },
];

export default function DKGProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="dkg-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.prime} />
            </marker>
          </defs>

          {/* 3 parties 공통 */}
          <ModuleBox x={20} y={20} w={100} h={42} label="P₁" color={C.party} />
          <ModuleBox x={200} y={20} w={100} h={42} label="P₂" color={C.party} />
          <ModuleBox x={380} y={20} w={100} h={42} label="P₃" color={C.party} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[20, 200, 380].map((x, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i }}>
                  <DataBox x={x} y={80} w={100} h={36} label={`r${i + 1} ← rand`} color={C.party} outlined />
                  <ActionBox x={x} y={125} w={100} h={36} label={`commit(r${i + 1})`} color={C.init} />
                </motion.g>
              ))}

              <ActionBox x={120} y={175} w={260} h={36} label="reveal → sort → index" color={C.init} />

              {[80, 260, 440].map((x, i) => (
                <motion.line key={i} x1={x} y1={161} x2={250} y2={175} stroke={C.init} strokeWidth={1} strokeDasharray="3 3"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + 0.1 * i }} />
              ))}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[20, 200, 380].map((x, i) => (
                <DataBox key={i} x={x} y={80} w={100} h={42}
                  label={`p${i + 1} ← prime_cand`} sub="1024 bit" color={C.prime} outlined />
              ))}

              <ActionBox x={130} y={140} w={240} h={36} label="p = Σ pᵢ (Shamir 공유)" color={C.prime} />
              <ActionBox x={130} y={180} w={240} h={32} label="Jacobi · Miller-Rabin 분산 검증" color={C.prime} />

              {[70, 250, 430].map((x, i) => (
                <motion.line key={i} x1={x} y1={122} x2={250} y2={140} stroke={C.prime} strokeWidth={1.2}
                  markerEnd="url(#dkg-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + 0.1 * i }} />
              ))}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={80} w={210} h={42} label="p = Σ pᵢ" sub="t-of-n 공유" color={C.prime} outlined />
              <DataBox x={270} y={80} w={210} h={42} label="q = Σ qᵢ" sub="t-of-n 공유" color={C.prime} outlined />

              <ActionBox x={130} y={135} w={240} h={42} label="Σ pᵢ·qⱼ (cross terms)" sub="Paillier 동형" color={C.mul} />
              <DataBox x={130} y={185} w={240} h={28} label="Biprime check φ(N) = (p−1)(q−1)" color={C.mul} outlined />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={80} w={140} h={42} label="λ = lcm(p−1, q−1)" sub="분산 계산" color={C.key} outlined />
              <DataBox x={170} y={80} w={140} h={42} label="g = N + 1" color={C.key} outlined />
              <DataBox x={320} y={80} w={160} h={42} label="θ = λ mod N · β = rand" color={C.key} outlined />

              <DataBox x={20} y={140} w={210} h={42} label="pk = (N, g)" sub="공개" color={C.result} outlined />
              <DataBox x={270} y={140} w={210} h={42} label="skᵢ = θᵢ (t-of-n)" sub="단일 참가자 복원 불가" color={C.result} outlined />

              <StatusBox x={130} y={190} w={240} h={20} label="Paillier 분산 키 완성" sub=" " color={C.result} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
