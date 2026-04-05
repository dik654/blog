import Plonky3CrateMapViz from '../components/Plonky3CrateMapViz';
import CrateArchViz from './viz/CrateArchViz';
import CodePanel from '@/components/ui/code-panel';
import { CRATE_MAP_CODE, BABYBEAR_CODE, CONFIG_CODE } from './OverviewData';
import { crateMapAnnotations, babyBearAnnotations, configAnnotations } from './OverviewAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 크레이트 구조'}</h2>
      <div className="not-prose mb-8"><CrateArchViz /></div>
      <div className="not-prose mb-8"><Plonky3CrateMapViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Plonky3</strong>는 Polygon Labs가 개발한 모듈형 STARK 프레임워크로,
          SP1·Valida 등 여러 zkVM의 증명 백엔드로 사용됩니다.<br />
          필드·해시·커밋·FRI 등 각 컴포넌트가 독립 크레이트로 분리되어
          유연하게 조합할 수 있습니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('p3-babybear', codeRefs['p3-babybear'])} />
            <span className="text-[10px] text-muted-foreground self-center">baby_bear.rs</span>
            <CodeViewButton onClick={() => onCodeRef('p3-stark-config', codeRefs['p3-stark-config'])} />
            <span className="text-[10px] text-muted-foreground self-center">config.rs</span>
          </div>
        )}
        <CodePanel title="크레이트 맵" code={CRATE_MAP_CODE} annotations={crateMapAnnotations} />
        <CodePanel title="BabyBear 필드 (baby-bear/src/baby_bear.rs)" code={BABYBEAR_CODE} annotations={babyBearAnnotations} />
        <CodePanel title="StarkGenericConfig (uni-stark/src/config.rs)" code={CONFIG_CODE} annotations={configAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Plonky3 vs Plonky2 vs Halo2</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">특성</th>
                <th className="border border-border px-3 py-2 text-left">Plonky2</th>
                <th className="border border-border px-3 py-2 text-left">Plonky3</th>
                <th className="border border-border px-3 py-2 text-left">Halo2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Commitment</td>
                <td className="border border-border px-3 py-2">FRI (STARK)</td>
                <td className="border border-border px-3 py-2">FRI (modular)</td>
                <td className="border border-border px-3 py-2">KZG/IPA</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Trusted Setup</td>
                <td className="border border-border px-3 py-2">None</td>
                <td className="border border-border px-3 py-2">None</td>
                <td className="border border-border px-3 py-2">Required (KZG)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Field</td>
                <td className="border border-border px-3 py-2">Goldilocks (64-bit)</td>
                <td className="border border-border px-3 py-2">Modular (BabyBear, Mersenne31)</td>
                <td className="border border-border px-3 py-2">BN254 scalar</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Architecture</td>
                <td className="border border-border px-3 py-2">Monolithic</td>
                <td className="border border-border px-3 py-2">Modular crates</td>
                <td className="border border-border px-3 py-2">PLONKish</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Prover 속도</td>
                <td className="border border-border px-3 py-2">빠름</td>
                <td className="border border-border px-3 py-2">매우 빠름</td>
                <td className="border border-border px-3 py-2">중간</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Proof 크기</td>
                <td className="border border-border px-3 py-2">~50KB</td>
                <td className="border border-border px-3 py-2">~50-100KB</td>
                <td className="border border-border px-3 py-2">~1-2KB</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Small Field 혁명</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 전통 SNARK: large field (254-bit, 256-bit)
// - BN254, BLS12-381
// - Pairing-friendly
// - EVM verify 가능

// Plonky3 small field (31-bit, 64-bit)
// - BabyBear: 2^31 - 2^27 + 1
// - Mersenne31: 2^31 - 1
// - Goldilocks: 2^64 - 2^32 + 1
// - KoalaBear: 2^31 - 2^24 + 1

// 장점
// ✓ 메모리 효율 (4-8x 적음)
// ✓ 연산 속도 (Montgomery mult 빠름)
// ✓ GPU/AVX 친화적
// ✓ 더 큰 circuit 가능

// 단점
// ✗ Extension field 필요 (최소 128-bit security)
// ✗ Pairing 불가 (bridging 복잡)
// ✗ EVM verify 비쌈 (non-native field)

// 사용 사례
// - zkVM (Succinct SP1, Valida, Risc Zero)
// - Recursive proofs (intermediate)
// - STARK-based prover acceleration`}</pre>

      </div>
    </section>
  );
}
