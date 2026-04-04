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
      </div>
    </section>
  );
}
