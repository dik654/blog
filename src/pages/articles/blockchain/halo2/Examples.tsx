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

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 활용 사례</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 1. Axiom: On-chain ZK coprocessor
// - 블록체인 storage 읽기 증명
// - Historical block header access
// - halo2-ecc로 ECDSA verify

// 2. Succinct: SP1 zkVM
// - Rust program → ZK proof
// - Precompiles for crypto operations

// 3. Scroll zkEVM
// - BN254 pairing for recursive SNARK aggregation
// - halo2 기반

// 4. Taiko: Type-1 zkEVM
// - Full Ethereum equivalence
// - halo2 + sp1 hybrid

// 5. Nil Foundation (zkLLVM)
// - C++ → halo2 circuit
// - Proof DSL 개발

// halo2 생태계 통계 (2024)
// - GitHub stars: 4K+ (zcash/halo2)
// - Forks: ~500
// - Based projects: 20+
// - zkEVM market share: ~40%`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: halo2-ecc의 제약</p>
          <p>
            <strong>성능 현실</strong>:<br />
            - ECDSA 검증: 40-100ms (증명 생성)<br />
            - Pairing: 500ms-2s<br />
            - 대량 연산은 여전히 비쌈
          </p>
          <p className="mt-2">
            <strong>최적화 대안</strong>:<br />
            - Precompiled circuits (재사용)<br />
            - Recursive aggregation (여러 proof 합침)<br />
            - Plonky2/Plonky3 (STARKs, 더 빠름)<br />
            - GPU acceleration (ICICLE, SPPARK)
          </p>
        </div>

      </div>
    </section>
  );
}
