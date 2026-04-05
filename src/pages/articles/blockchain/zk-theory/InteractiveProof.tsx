import SigmaProtocolViz from './viz/SigmaProtocolViz';
import SpecialSoundnessViz from './viz/SpecialSoundnessViz';

export default function InteractiveProof() {
  return (
    <section id="sigma-protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sigma 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Commit &rarr; Challenge &rarr; Response 3단계 대화형 증명의 표준 형태.
          <br />
          현대 ZKP(Groth16, PLONK, Bulletproofs)는 모두 이 3-move 구조가 뼈대.
        </p>
      </div>
      <div className="not-prose mb-8"><SigmaProtocolViz /></div>
      <h3 className="text-lg font-bold mb-4">특수 건전성 (Special Soundness)</h3>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          같은 커밋에 두 챌린지 모두 응답 가능하면 비밀 x 복원 가능 &rarr; x 모르면 불가.
        </p>
      </div>
      <div className="not-prose"><SpecialSoundnessViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Sigma Protocol 3단계 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sigma Protocol (3-move protocol)
//
// Prover가 증명할 것: "나는 witness w를 안다"
// Relation R: (x, w) ∈ R이면 w는 x의 witness
//
// 3 Moves:
//
// Move 1 (Commitment):
//   Prover → Verifier: a
//   - Prover: 랜덤 r 선택
//   - a = f(r) (계산)
//   - a를 Verifier에게 전송
//
// Move 2 (Challenge):
//   Verifier → Prover: e
//   - Verifier: 랜덤 challenge e 선택
//   - e를 Prover에게 전송
//
// Move 3 (Response):
//   Prover → Verifier: z
//   - z = g(r, w, e) 계산 (r과 w 둘 다 필요!)
//   - z를 Verifier에게 전송
//
// Verification:
//   Verifier는 (a, e, z)로 명제 검증
//   V(x, a, e, z) = ACCEPT or REJECT

// 3대 보안 성질:
//
// 1. Completeness
//    정직한 Prover → Verifier가 ACCEPT
//
// 2. Special Soundness
//    같은 a에 대한 두 서로 다른 (e, z), (e', z')에서
//    Extractor가 w를 복원 가능
//
// 3. Honest-Verifier Zero-Knowledge (HVZK)
//    Simulator S가 (a, e, z) 위조 가능
//    (실제 w 없이)

// Challenge Space:
//   |challenge| 크기 = soundness error의 역수
//   128-bit challenge → 2^-128 error

// 변형:
//   - Or-proof: A or B 증명
//   - And-proof: A and B 증명
//   - Compound proofs
//
// 예시 구현:
//   - Schnorr: DLP 기반
//   - Chaum-Pedersen: equality of DLs
//   - Okamoto: Representation problem
//   - Guillou-Quisquater: RSA 기반`}
        </pre>
      </div>
    </section>
  );
}
