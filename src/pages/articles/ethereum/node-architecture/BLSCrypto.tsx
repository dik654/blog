import BLSPipelineViz from './viz/BLSPipelineViz';

export default function BLSCrypto({ title }: { title?: string }) {
  return (
    <section id="bls-crypto" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'BLS 암호학 (서명 & 집계)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Lighthouse의 <code>crypto/bls</code> 모듈은 <strong>BLS(Boneh-Lynn-Shacham)</strong> 서명을
          구현합니다. 검증자 서명과 집계의 핵심이며, 컴파일 타임 피처 플래그로
          BLST(고성능)와 fake_crypto(테스트) 백엔드를 전환합니다.<br />
          제네릭 설계로 <code>GenericSecretKey</code>, <code>GenericPublicKey</code>,
          <code>GenericSignature</code>가 백엔드에 독립적인 공통 인터페이스를 제공합니다.
        </p>
      </div>
      <BLSPipelineViz />
    </section>
  );
}
