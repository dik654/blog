export default function Security() {
  return (
    <section id="security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안전성과 응용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>확률적 암호화:</strong>
          <br />
          매번 다른 랜덤 k를 사용하므로, 같은 메시지를 암호화해도 암호문이 매번 달라진다.
          <br />
          도청자가 "이 암호문은 이 메시지다"라고 추측하는 것이 불가능하다 (의미론적 안전성).
        </p>
        <p>
          <strong>동형 성질:</strong>
          <br />
          두 암호문을 곱하면 원문의 곱을 암호화한 것과 같다 — E(m₁) · E(m₂) = E(m₁ · m₂).
          <br />
          이 성질이 전자투표, 프라이버시 보존 집계 등에서 활용된다.
        </p>
        <p>
          <strong>한계:</strong>
          <br />
          암호문 크기가 원문의 2배 (c₁, c₂ 두 값).
          <br />
          실무에서는 하이브리드 방식을 쓴다 — ElGamal로 AES 키를 암호화하고,
          실제 데이터는 AES로 암호화.
        </p>
      </div>
    </section>
  );
}
