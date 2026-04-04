import DigitalSigViz from './viz/DigitalSigViz';

export default function DigitalSignature() {
  return (
    <section id="digital-signature" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">디지털 서명: ECDSA, EdDSA, BLS</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          메시지 무결성과 발신자 인증을 동시에 보장하는 서명 알고리즘 비교.
        </p>
      </div>
      <div className="not-prose"><DigitalSigViz /></div>
    </section>
  );
}
