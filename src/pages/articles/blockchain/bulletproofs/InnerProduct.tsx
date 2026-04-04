import CodePanel from '@/components/ui/code-panel';
import BulletproofRecursion from '../components/BulletproofRecursion';
import IPAStepsViz from './viz/IPAStepsViz';
import { CREATE_CODE, VERIFY_CODE } from './InnerProductData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function InnerProduct({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const _onCodeRef = onCodeRef;
  return (
    <section id="inner-product" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '내적 인수 증명 (O(log n))'}</h2>
      <div className="not-prose mb-8">
        <BulletproofRecursion />
      </div>
      <div className="not-prose mb-8">
        <IPAStepsViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Bulletproofs 핵심 — <strong>Inner Product Argument</strong><br />
          벡터 a, b에 대해 ⟨a, b⟩ = c를 O(log n) 크기 증명으로 입증<br />
          매 라운드 절반씩 접어 재귀적으로 크기 축소
        </p>
        {_onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => _onCodeRef('ipa-create', codeRefs['ipa-create'])} />
            <span className="text-[10px] text-muted-foreground self-center">IPA create</span>
            <CodeViewButton onClick={() => _onCodeRef('ipa-struct', codeRefs['ipa-struct'])} />
            <span className="text-[10px] text-muted-foreground self-center">struct</span>
          </div>
        )}

        <h3>InnerProductProof::create (inner_product_proof.rs)</h3>
        <CodePanel
          title="InnerProductProof::create 구현"
          code={CREATE_CODE}
          annotations={[
            { lines: [3, 9], color: 'sky', note: '증명 구조체 (O(log n) 크기)' },
            { lines: [24, 29], color: 'emerald', note: '벡터 절반 분할' },
            { lines: [31, 33], color: 'amber', note: '교차 내적 계산' },
            { lines: [54, 57], color: 'violet', note: '접기 (folding) 연산' },
          ]}
        />

        <h3>검증 (O(n) 스칼라 곱셈)</h3>
        <CodePanel
          title="InnerProductProof 검증"
          code={VERIFY_CODE}
          annotations={[
            { lines: [3, 6], color: 'sky', note: '스칼라 s_i 비트 인코딩' },
            { lines: [10, 10], color: 'emerald', note: 'Pippenger로 O(n/log n) 가능' },
          ]}
        />
      </div>
    </section>
  );
}
