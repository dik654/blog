export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ElGamal이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ElGamal(1985)은{' '}
          <a href="/crypto/diffie-hellman" className="text-indigo-400 hover:underline">Diffie-Hellman 키 교환</a>을
          암호화 시스템으로 확장한 공개키 암호다.
          <br />
          DH는 "공유 키를 합의"하는 프로토콜이었다면,
          ElGamal은 "수신자의 공개키로 메시지를 직접 암호화"한다.
        </p>
        <p>
          안전성은{' '}
          <a href="/crypto/discrete-log" className="text-indigo-400 hover:underline">이산로그 문제(DLP)</a>와
          DDH 가정에 기반한다.
          <br />
          같은 메시지를 두 번 암호화해도 매번 다른 암호문이 나온다 (확률적 암호화).
          <br />
          이 성질이 의미론적 안전성(semantic security)을 보장한다.
        </p>
      </div>
    </section>
  );
}
