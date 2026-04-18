export default function CryptoUsage() {
  const items = [
    {
      name: 'Pohlig-Hellman 공격',
      desc: '위수를 소인수별로 분해 → 각 부분군에서 x mod pᵢ를 풀고 CRT로 합산하여 x 복원.',
      color: 'indigo',
      href: '/blockchain/zk-theory#schnorr',
    },
    {
      name: 'RSA 복호화 최적화',
      desc: 'n=p·q에서 mod p, mod q 따로 복호화한 뒤 CRT로 합침. 속도 약 4배 향상.',
      color: 'emerald',
    },
    {
      name: 'NTT(Number Theoretic Transform)',
      desc: '큰 모듈러 연산을 여러 작은 소수로 분할 → 병렬 NTT → CRT 합산. ZK 증명 가속의 핵심.',
      color: 'amber',
    },
  ];

  return (
    <section id="crypto-usage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호학에서의 사용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          CRT는 "큰 문제를 작은 조각으로 쪼개서 풀고 다시 합친다"는 원리이다.
          <br />
          공격자가 이 원리를 쓰면 위협이 되고(Pohlig-Hellman),
          설계자가 이 원리를 쓰면 최적화가 된다(RSA, NTT).
        </p>
      </div>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3">
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
