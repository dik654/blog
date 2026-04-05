import CodePanel from '@/components/ui/code-panel';
import { DUPLEX_CODE, DUPLEX_ANNOTATIONS, USAGE_CODE, USAGE_ANNOTATIONS } from './ChallengerData';

export default function Challenger({ title }: { title?: string }) {
  return (
    <section id="challenger" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Fiat-Shamir 챌린저'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>DuplexChallenger</strong>는 Poseidon2 스펀지 기반 Fiat-Shamir 변환을
          구현합니다. 증명자와 검증자가 동일한 순서로 데이터를 흡수(observe)하고
          챌린지를 샘플(sample)하여 비대화형 증명을 가능하게 합니다.
        </p>

        <h3>DuplexChallenger 구조</h3>
        <CodePanel title="스펀지 구조 & 흡수/듀플렉싱" code={DUPLEX_CODE}
          annotations={DUPLEX_ANNOTATIONS} />

        <h3>STARK 증명에서의 사용</h3>
        <CodePanel title="observe → sample 시퀀스" code={USAGE_CODE}
          annotations={USAGE_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Sponge Construction</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Sponge based on Poseidon2 permutation
// State: width-W vector (예: 16 field elements)
// Rate (r): 흡수/압축 bandwidth (예: 8)
// Capacity (c): security margin (예: 8)

// Absorb (observe)
// 새 데이터를 rate 부분에 XOR/add
// State = Permutation(State)

// Squeeze (sample)
// Rate 부분에서 output 추출
// 필요 시 Permutation(State) 다시

// Example sequence
challenger = DuplexChallenger::new();

challenger.observe(commitment_C1);
alpha = challenger.sample();

challenger.observe(commitment_C2);
beta = challenger.sample();

challenger.observe(polynomial_evals);
z = challenger.sample();

// Security
// - c bits capacity → c/2 bits classical security
// - Standard: 128-bit security → c = 256
// - Poseidon2 BabyBear: 8 capacity elements × 31 bits = 248 bits

// Interactive to non-interactive
// Before: Verifier가 각 challenge 생성
// After: Prover가 transcript에서 challenge 계산
//        (Verifier도 동일 계산으로 verify)`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Fiat-Shamir의 안전성</p>
          <p>
            <strong>Random Oracle Model</strong>: hash function을 이상적 random function으로 가정<br />
            <strong>현실과 차이</strong>: 실제 hash는 구체적 구현<br />
            <strong>위험</strong>: Weak hash → soundness 깨짐<br />
            <strong>Best practice</strong>: Cryptographic-grade hash + transcript 완전성
          </p>
        </div>

      </div>
    </section>
  );
}
