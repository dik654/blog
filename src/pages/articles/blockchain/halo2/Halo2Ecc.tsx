import EccModuleViz from './viz/EccModuleViz';
import CodePanel from '@/components/ui/code-panel';
import { ECC_MODULE_CODE, ECPOINT_CODE } from './Halo2EccData';
import { eccModuleAnnotations, ecpointAnnotations } from './Halo2EccAnnotations';

export default function Halo2Ecc({ title }: { title?: string }) {
  return (
    <section id="halo2-ecc" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'halo2-ecc: 회로 내 타원곡선 연산'}</h2>
      <div className="not-prose mb-8"><EccModuleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>halo2-ecc</strong>는 영지식증명 회로 내에서 타원곡선 암호(ECC) 연산을
          효율적으로 구현하는 라이브러리입니다. <code>bigint</code>(큰 정수 limb 표현),
          <code>fields</code>(소수체 FpChip), <code>ecc</code>(점 연산 EccChip),
          그리고 <code>secp256k1</code>/<code>bn254</code> 특화 모듈로 계층화되어 있습니다.
        </p>
        <p>
          핵심 타입인 <code>EcPoint</code>는 제네릭으로 다양한 필드와 곡선을 지원하며,
          <code>StrictEcPoint</code>는 x 좌표가 축약(reduced)된 점으로 비교 연산이 효율적입니다.
          <code>ComparableEcPoint</code> 열거형으로 최적화된 비교를 선택적으로 수행합니다.
        </p>
        <CodePanel title="halo2-ecc 모듈 계층 구조" code={ECC_MODULE_CODE} annotations={eccModuleAnnotations} />
        <CodePanel title="EcPoint & 점 연산 타입 시스템" code={ECPOINT_CODE} annotations={ecpointAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Non-native Field Arithmetic</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 문제: halo2 native field is BN254 scalar (254-bit prime)
// 우리가 ECC 연산하려는 field는 secp256k1 (256-bit prime)
// → 다른 field, "non-native"

// Naive: BN254 내에서 secp256k1 simulate
// - 각 secp256k1 원소 = BN254 원소 여러 개 (limbs)
// - 256-bit → 3 limbs of 88-bit each

// Arithmetic operations
// Addition: limb별 add + carry propagation
// Multiplication: 3x3 limb multiplication + modular reduction
// Inversion: Extended Euclidean (매우 비쌈)

// Cost 분석 (secp256k1 point add in BN254 circuit)
// - Native BN254 add: ~10 constraints
// - Non-native secp256k1 add: ~2000 constraints
// → 200x more expensive

// 최적화 기법
// 1) Barrett reduction
// 2) Montgomery multiplication
// 3) Lazy reduction (결과만 reduce)
// 4) Window method for scalar mult

// 사용 사례
// - Ethereum signature verification (secp256k1)
// - Bitcoin integration
// - Cross-chain verification`}</pre>

      </div>
    </section>
  );
}
