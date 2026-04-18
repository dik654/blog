import CodePanel from '@/components/ui/code-panel';
import FieldCompareViz from './viz/FieldCompareViz';
import TwoAdicityViz from './viz/TwoAdicityViz';
import {
  BABYBEAR_CODE, BABYBEAR_ANNOTATIONS,
  MERSENNE_CODE, MERSENNE_ANNOTATIONS,
  EXTENSION_CODE, EXTENSION_ANNOTATIONS,
} from './FieldArithmeticData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function FieldArithmetic({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="field-arithmetic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'BabyBear 필드 & 확장체'}</h2>
      <div className="not-prose mb-8"><FieldCompareViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Plonky3는 <strong>BabyBear</strong>(31비트)를 기본 필드로 사용합니다.
          2-adic 구조 덕분에 FFT가 효율적이고, 4차 확장으로 128비트 보안을 달성합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('p3-babybear', codeRefs['p3-babybear'])} />
            <span className="text-[10px] text-muted-foreground self-center">baby_bear.rs</span>
          </div>
        )}

        <h3>BabyBear 필드</h3>
        <CodePanel title="BabyBear 정의 & Montgomery 곱셈" code={BABYBEAR_CODE}
          annotations={BABYBEAR_ANNOTATIONS} />

        <h3>Mersenne31 (대안 필드)</h3>
        <CodePanel title="Mersenne31 & Circle FFT" code={MERSENNE_CODE}
          annotations={MERSENNE_ANNOTATIONS} />

        <h3>확장체 (BinomialExtension)</h3>
        <CodePanel title="4차 확장: 128비트 보안" code={EXTENSION_CODE}
          annotations={EXTENSION_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Small Field 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Field</th>
                <th className="border border-border px-3 py-2 text-left">Prime</th>
                <th className="border border-border px-3 py-2 text-left">Bits</th>
                <th className="border border-border px-3 py-2 text-left">2-adicity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">BabyBear</td>
                <td className="border border-border px-3 py-2">2^31 - 2^27 + 1</td>
                <td className="border border-border px-3 py-2">31</td>
                <td className="border border-border px-3 py-2">27</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">KoalaBear</td>
                <td className="border border-border px-3 py-2">2^31 - 2^24 + 1</td>
                <td className="border border-border px-3 py-2">31</td>
                <td className="border border-border px-3 py-2">24</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Mersenne31</td>
                <td className="border border-border px-3 py-2">2^31 - 1</td>
                <td className="border border-border px-3 py-2">31</td>
                <td className="border border-border px-3 py-2">1</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Goldilocks</td>
                <td className="border border-border px-3 py-2">2^64 - 2^32 + 1</td>
                <td className="border border-border px-3 py-2">64</td>
                <td className="border border-border px-3 py-2">32</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">BN254</td>
                <td className="border border-border px-3 py-2">large prime</td>
                <td className="border border-border px-3 py-2">254</td>
                <td className="border border-border px-3 py-2">28</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-adicity의 중요성</h3>
        <div className="not-prose"><TwoAdicityViz /></div>

      </div>
    </section>
  );
}
