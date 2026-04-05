import FiatShamirViz from './viz/FiatShamirViz';

export default function FiatShamir() {
  return (
    <section id="fiat-shamir" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fiat-Shamir 변환</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Verifier의 랜덤 챌린지를 해시 H(a, stmt)로 대체 &mdash; 비대화형 증명.
          <br />
          모든 SNARK/STARK가 온체인 검증 가능한 이유.
        </p>
      </div>
      <div className="not-prose"><FiatShamirViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Fiat-Shamir Heuristic</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Fiat-Shamir Transform (1986)
//
// 목표: Interactive protocol → Non-interactive
//
// Interactive Sigma:
//   P → V: a (commitment)
//   V → P: e (challenge)
//   P → V: z (response)
//
// Fiat-Shamir:
//   e ← H(a, statement, ...) (hash로 challenge 생성)
//
// Non-interactive:
//   Prover:
//     1. k ← random
//     2. a = g^k
//     3. e = H(g, y, a)      ← Verifier 역할 대체
//     4. z = k + e·x
//     5. Output: (a, z) or (e, z)
//
//   Verifier:
//     1. e = H(g, y, a)
//     2. Check: g^z = a · y^e

// Random Oracle Model:
//   해시 함수 H를 random oracle로 가정
//   - 입력마다 독립 랜덤 출력
//   - 실제 H와 차이 있을 수 있음
//
// 보안 분석 (Pointcheval-Stern 1996):
//   적절한 조건에서 safe
//   - Zero-knowledge 유지
//   - Soundness 감소 negligible

// 주의사항:
//
// 1. Challenge Binding
//    e는 모든 프로토콜 파라미터 포함해야
//    - statement (x)
//    - commitment (a)
//    - public parameters
//    생략 시 attack 가능
//
// 2. Frozen Heart Attack
//    malleability 공격
//    해결: 도메인 분리 (domain separation)
//
// 3. Weak Fiat-Shamir
//    일부 라이브러리는 a만 해싱 → 위험
//    Strong FS: 모든 public data 포함 필수

// 실제 사용:
//
// Schnorr 서명:
//   Interactive Schnorr + Fiat-Shamir
//   = 현대 서명 스킴
//
// SNARKs/STARKs:
//   모든 zkSNARK/zkSTARK가 FS 사용
//   → 온체인 검증 가능
//
// Bulletproofs:
//   Multiple rounds를 FS로 압축
//
// Plonk/Halo2:
//   여러 interactive phases → FS로 non-interactive

// Generic Group Model (GGM):
//   FS의 대안 보안 증명 프레임워크`}
        </pre>
      </div>
    </section>
  );
}
