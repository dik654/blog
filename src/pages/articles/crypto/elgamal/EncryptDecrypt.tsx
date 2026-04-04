import ElGamalViz from './viz/ElGamalViz';

export default function EncryptDecrypt() {
  return (
    <section id="encrypt-decrypt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호화와 복호화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          세팅: p=23, g=5, 수신자 비밀키 x=6, 공개키 y = gˣ mod p = 5⁶ mod 23 = 8.
          <br />
          송신자는 y=8만 알고 메시지를 암호화한다. 비밀키 x=6은 수신자만 안다.
        </p>
      </div>
      <div className="not-prose"><ElGamalViz /></div>
    </section>
  );
}
