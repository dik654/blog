import CodePanel from '@/components/ui/code-panel';
import FieldCompareViz from './viz/FieldCompareViz';
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
      </div>
    </section>
  );
}
