import KZGBlobViz from './viz/KZGBlobViz';

export default function KZGBlob({ title }: { title?: string }) {
  return (
    <section id="kzg-blob" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'KZG 커밋먼트 & Blob (EIP-4844)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Lighthouse의 <code>crypto/kzg</code> 모듈은 Deneb 업그레이드(EIP-4844)에서 도입된
          <strong>KZG 커밋먼트</strong>를 구현합니다. Blob 데이터의 무결성을 보장하면서
          데이터 가용성 샘플링(DAS)을 가능하게 하며, C-KZG와 Rust-ETH-KZG 두 라이브러리를
          백엔드로 사용합니다.
        </p>
        <p>
          <code>KzgCommitment</code>는 48바이트 BLS12-381 G1 포인트,
          <code>KzgProof</code> 역시 48바이트로 표현되며,
          <code>TrustedSetup</code>에서 G1/G2 monomial + lagrange 포인트를 로딩합니다.<br />
          PeerDAS 프로토콜을 위한 Cell/Row 증명도 지원합니다.
        </p>
      </div>
      <KZGBlobViz />
    </section>
  );
}
