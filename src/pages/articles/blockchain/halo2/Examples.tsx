import ECDSAVerifyViz from './viz/ECDSAVerifyViz';
import CodePanel from '@/components/ui/code-panel';
import { ECDSA_CODE, PAIRING_CODE } from './ExamplesData';
import { ecdsaAnnotations, pairingAnnotations } from './ExamplesAnnotations';

export default function Examples({ title }: { title?: string }) {
  return (
    <section id="examples" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '실전 예제: ECDSA 검증 & BN254 Pairing'}</h2>
      <div className="not-prose mb-8"><ECDSAVerifyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          halo2-ecc는 실제 암호학적 프로토콜을 회로 내에서 구현합니다.
          <strong>ECDSA 서명 검증</strong>은 secp256k1 곡선에서 10단계로 처리되며,
          <code>ecdsa_verify_no_pubkey_check</code> 함수가 핵심입니다.<br />
          회로 파라미터 k=12, advice=60일 때 약 45ms(M2 Max)로 증명 가능합니다.
        </p>
        <p>
          <strong>BN254 Pairing</strong>은 Miller Loop(double-and-add + line function) +
          Final Exponentiation(easy part + hard part)으로 구성됩니다.<br />
          Sparse Fp12 곱셈으로 약 3배 성능 향상을 달성합니다.
        </p>
        <CodePanel title="ECDSA 서명 검증 — 10단계 파이프라인" code={ECDSA_CODE} annotations={ecdsaAnnotations} />
        <CodePanel title="BN254 Pairing — Miller Loop + Final Exp" code={PAIRING_CODE} annotations={pairingAnnotations} />
      </div>
    </section>
  );
}
