import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { init: '#6366f1', prime: '#10b981', mul: '#f59e0b', key: '#8b5cf6' };

const STEPS = [
  { label: '① 초기화 + 인덱스 결정', body: 'params = { key_bits: 2048, threshold: t, n: 3 }\n\n각 참가자 Pᵢ: rᵢ ← random()\nbroadcast(commit(rᵢ))\nreveal rᵢ → sort → index 할당\n// 공정한 인덱스: 누구도 위치 조작 불가.' },
  { label: '② 분산 소수 생성 + Jacobi 검증', body: '각 Pᵢ: pᵢ ← random_prime_candidate(1024)\n소수 공유: p = Σ pᵢ mod N (Shamir 방식)\n\n분산 소수성 검사:\n  Jacobi(g, p) = Π Jacobi(g, pᵢ)  // 분산 곱\n  trial_division 후 Miller-Rabin 병렬 실행.\n// q도 동일한 절차로 독립 생성.' },
  { label: '③ N = p × q 분산 곱셈', body: 'Shamir 곱셈 프로토콜:\n  p = Σ pᵢ,  q = Σ qᵢ (t-of-n 공유)\n  N = (Σ pᵢ)(Σ qᵢ) = Σ pᵢ·qⱼ\n  → 교차 항을 Paillier 동형 암호로 계산.\n\nBiprime 검증:\n  N이 정확히 두 소수의 곱인지 확인\n  φ(N) = (p-1)(q-1) 을 분산 계산.' },
  { label: '④ Paillier 키 완성', body: 'λ(N) = lcm(p-1, q-1)  // 분산 계산\n  각 Pᵢ가 λᵢ 공유 보유 → λ = Σ λᵢ\n\ng = N + 1  // 표준 생성원\nθ = λ(N) mod N  // 비밀 복호화 키\nβ = rand()\n\n공개키: pk = (N, g)\n비밀키 공유: skᵢ = θᵢ  // t-of-n 임계값\n// 단일 참가자는 sk 복원 불가.' },
];

export default function DKGProtocolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.init}>초기화</text>
              {['params = {bits:2048, t:2, n:3}', '',
                'P₁: r₁ ← random(), broadcast(H(r₁))',
                'P₂: r₂ ← random(), broadcast(H(r₂))',
                'P₃: r₃ ← random(), broadcast(H(r₃))', '',
                'reveal → sort(r₁,r₂,r₃) → index'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.init}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.prime}>분산 소수 생성</text>
              {['각 Pᵢ: pᵢ ← rand_prime_candidate(1024)',
                'p = Σ pᵢ  (Shamir 공유)', '',
                'Jacobi 검증:',
                '  J(g,p) = Π J(g,pᵢ)  // 분산 곱',
                '  + Miller-Rabin 병렬 실행',
                '// q도 동일 절차로 생성'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.prime}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.mul}>N = p × q</text>
              {['p = Σ pᵢ,  q = Σ qᵢ',
                'N = (Σ pᵢ)(Σ qᵢ)',
                '  = Σ pᵢ·qⱼ  // Paillier 동형 암호', '',
                'Biprime 검증:',
                '  φ(N) = (p-1)(q-1) 분산 계산',
                '  N이 두 소수의 곱인지 확인'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.mul}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.key}>Paillier 키 완성</text>
              {['λ = lcm(p-1, q-1)  // λᵢ 공유 합산',
                'g = N + 1', 'θ = λ mod N, β = rand()', '',
                'pk = (N, g)           // 공개',
                'skᵢ = θᵢ              // t-of-n 공유',
                '// 단일 참가자: sk 복원 불가'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.key}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
