export default function Schnorr() {
  return (
    <section id="schnorr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Schnorr Signature</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Schnorr 서명은 이산로그 문제(DLP)에 기반한 디지털 서명으로,
          EU-CMA(Existential Unforgeability under Chosen Message Attack) 보안을 제공합니다.
          ZK에서 특히 중요한 이유는 Sigma protocol과 Fiat-Shamir 변환의 기초가 되기 때문입니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">서명 과정</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`KeyGen:
  sk = random scalar ∈ Fr
  pk = sk * G  (G1 생성자)

Sign(sk, message):
  k = random nonce ∈ Fr
  R = k * G                          // commitment
  e = H(R || pk || message)          // challenge (Fiat-Shamir)
  s = k - e * sk  (mod r)           // response

Verify(pk, message, (R, s)):
  e = H(R || pk || message)
  s * G + e * pk == R ?
  // s*G + e*pk = (k - e*sk)*G + e*sk*G = k*G = R ✓`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Sigma Protocol (HVZK)</h3>
        <p>
          Schnorr 서명의 핵심은 Sigma protocol (3-move protocol)입니다.
          Prover는 이산로그 sk를 알고 있음을 sk 자체를 공개하지 않고 증명합니다.
        </p>
        <ul>
          <li><strong>Commit</strong> — Prover가 R = k*G를 보냄</li>
          <li><strong>Challenge</strong> — Verifier가 랜덤 e를 보냄</li>
          <li><strong>Response</strong> — Prover가 s = k - e*sk를 보냄</li>
        </ul>
        <p>
          이 프로토콜은 Honest-Verifier Zero-Knowledge(HVZK)를 만족합니다.
          Simulator는 (e, s)를 먼저 뽑고 R = s*G + e*pk로 계산하면 실제 대화와 구분 불가합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Fiat-Shamir 변환</h3>
        <p>
          대화형 프로토콜을 비대화형으로 변환합니다. Verifier의 랜덤 challenge를
          해시 함수로 대체합니다: e = H(R || pk || message).
          Random Oracle Model에서 EU-CMA 보안이 증명됩니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">보안 성질</h3>
        <ul>
          <li><strong>Completeness</strong> — 정당한 서명자는 항상 유효한 서명을 생성</li>
          <li><strong>Soundness</strong> — DLP가 어려우면 위조 불가 (forking lemma)</li>
          <li><strong>Zero-Knowledge</strong> — 서명에서 개인키 정보를 추출할 수 없음</li>
        </ul>
        <p>
          nonce k가 반복되면 두 서명에서 sk를 복원할 수 있으므로
          k는 반드시 매번 새로운 랜덤이어야 합니다.
        </p>
      </div>
    </section>
  );
}
