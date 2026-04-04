export default function Applications() {
  const items = [
    {
      name: 'Schnorr / Sigma 프로토콜',
      desc: '커밋 r, 챌린지 e 모두 CSPRNG에서 생성. r이 예측 가능하면 비밀키 x가 노출된다.',
      color: 'indigo',
      href: '/crypto/zk-theory#sigma-protocol',
    },
    {
      name: 'TLS 핸드셰이크',
      desc: '세션키 협상 시 클라이언트/서버 랜덤 32바이트. 예측 가능하면 세션 탈취.',
      color: 'emerald',
    },
    {
      name: '지갑 개인키 생성',
      desc: 'BIP-39 니모닉, secp256k1 개인키 모두 CSPRNG 의존. 엔트로피 부족 시 자산 탈취.',
      color: 'amber',
    },
    {
      name: 'Nonce 생성',
      desc: 'ECDSA, EdDSA 서명의 nonce가 재사용 또는 예측되면 개인키 복원 가능 (Sony PS3 해킹 사례).',
      color: 'indigo',
    },
  ];

  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호학에서의 사용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          암호 프로토콜의 모든 비밀값은 CSPRNG에서 생성된다.
          <br />
          랜덤이 깨지면 알고리즘 자체의 수학적 안전성과 무관하게 시스템 전체가 무너진다.
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
