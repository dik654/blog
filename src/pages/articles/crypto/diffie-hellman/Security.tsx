export default function Security() {
  return (
    <section id="security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안전성과 한계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>CDH 가정 (Computational Diffie-Hellman):</strong>
          <br />
          gᵃ와 gᵇ가 주어져도 gᵃᵇ를 계산하기 어렵다는 가정.
          <br />
          DLP가 어려우면 CDH도 어렵다 (역은 증명되지 않음).
        </p>
        <p>
          <strong>DDH 가정 (Decisional Diffie-Hellman):</strong>
          <br />
          gᵃᵇ와 랜덤 값 gᶜ를 구별하기 어렵다는 더 강한 가정.
          <br />
          ElGamal 암호의 안전성은 DDH에 의존한다.
        </p>
        <p>
          <strong>한계 — 중간자 공격 (MITM):</strong>
          <br />
          DH 자체는 상대방의 신원을 검증하지 않는다.
          <br />
          중간자가 Alice에게는 Bob인 척, Bob에게는 Alice인 척하면 두 세션을 각각 장악할 수 있다.
          <br />
          해결: 인증서(TLS), 서명(Schnorr) 등을 결합하여 상대방 신원을 확인한다.
        </p>
      </div>
    </section>
  );
}
