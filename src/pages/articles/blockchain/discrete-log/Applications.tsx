export default function Applications() {
  const items = [
    {
      name: 'Diffie-Hellman 키 교환',
      desc: 'Alice가 gᵃ, Bob이 gᵇ를 공개. 둘 다 gᵃᵇ를 계산할 수 있지만, 도청자는 gᵃ와 gᵇ로부터 gᵃᵇ를 구할 수 없다 (CDH 가정).',
      color: 'indigo',
      href: '/crypto/diffie-hellman',
    },
    {
      name: 'Schnorr 서명 / 식별',
      desc: '공개키 y = gˣ에 대해 비밀키 x를 알고 있음을 증명. DLP가 어려우므로 y에서 x를 역추적 불가.',
      color: 'emerald',
      href: '/crypto/zk-theory#schnorr',
    },
    {
      name: 'ElGamal 암호',
      desc: '수신자의 공개키 gˣ로 메시지를 암호화. DLP 난이도가 복호화 불가능성을 보장.',
      color: 'amber',
      href: '/crypto/elgamal',
    },
    {
      name: 'ECDLP — 타원곡선 버전',
      desc: '유한체 위 타원곡선군에서의 이산로그. 같은 안전성을 더 짧은 키(256-bit)로 달성.',
      color: 'indigo',
      href: '/crypto/elliptic-curves',
    },
  ];

  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호학 응용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          DLP의 일방향성을 기반으로 한 암호 프로토콜들이다.
          <br />
          각각 "정방향은 쉽고 역방향은 어렵다"는 동일한 원리를 다른 방식으로 활용한다.
        </p>
      </div>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>
              {p.href ? <a href={p.href} className="hover:underline">{p.name} →</a> : p.name}
            </p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
